import React, { useState, useCallback, useRef, useEffect, lazy, Suspense } from 'react';
import { generateConceptAnalysisAuto } from './services/aiService';
import type { Analysis, Provider, ShareableState } from './types';
import Header from './components/Header';
import ConceptInput from './components/ConceptInput';
import EnhancedLoader from './components/EnhancedLoader';
import LanguageSwitcher from './components/LanguageSwitcher';
import { useHistory } from './hooks/useHistory';
import { useLanguage } from './contexts/LanguageContext';
import { useProvider } from './contexts/ProviderContext';
import { translations } from './locales';
import { encodeState, decodeState } from './utils/share';
import { createErrorInfo, validateConcept, getValidationErrorMessage } from './utils/errorHandling';

// Lazy load non-critical components to reduce initial bundle size and dependency chain
const AnalysisDisplay = lazy(() => import('./components/AnalysisDisplay'));
const ErrorDisplay = lazy(() => import('./components/ErrorDisplay'));
const Footer = lazy(() => import('./components/Footer'));
const ExampleConcepts = lazy(() => import('./components/ExampleConcepts'));
const History = lazy(() => import('./components/History'));
const DownloadButton = lazy(() => import('./components/DownloadButton'));
const ShareButton = lazy(() => import('./components/ShareButton'));

// Dynamic import for heavy dependencies
const loadHtml2Canvas = () => import('html2canvas');

const MAX_CONCEPT_LENGTH = 100;

const App: React.FC = () => {
  const [concept, setConcept] = useState<string>('');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [loadingStage, setLoadingStage] = useState<'initializing' | 'connecting' | 'analyzing' | 'generating'>('analyzing');
  const [error, setError] = useState<string | null>(null);
  const [errorInfo, setErrorInfo] = useState<ReturnType<typeof createErrorInfo> | null>(null);
  const { language } = useLanguage();
  const { selectedProvider } = useProvider();
  const { history, addHistoryItem } = useHistory();
  const analysisRef = useRef<HTMLDivElement>(null);
  const analysisAbortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get('data');

    if (data) {
      setIsLoading(true);
      try {
        const decodedState = decodeState(data);
        if (decodedState) {
          setConcept(decodedState.concept);
          setAnalysis(decodedState.analysis);
          addHistoryItem(decodedState.concept);
        } else {
          const errorInfo = createErrorInfo(new Error('Could not read the shared link. The data may be corrupted.'), 'share_link');
          setErrorInfo(errorInfo);
          setError(errorInfo.userFriendly);
        }
      } catch (err) {
        console.error("Failed to process shared link:", err);
        const errorInfo = createErrorInfo(err instanceof Error ? err : new Error('Failed to load data from the shared link.'), 'share_link');
        setErrorInfo(errorInfo);
        setError(errorInfo.userFriendly);
      } finally {
        setIsLoading(false);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [addHistoryItem]);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (analysisAbortControllerRef.current) {
        analysisAbortControllerRef.current.abort();
      }
    };
  }, []);

  const handleAnalysis = useCallback(async (conceptToAnalyze: string, isRetry: boolean = false) => {
    const trimmedConcept = conceptToAnalyze.trim();

    // Enhanced validation
    const validation = validateConcept(trimmedConcept);
    if (!validation.isValid) {
      const errorMessage = getValidationErrorMessage(validation.error!, language);
      const errorInfo = createErrorInfo(new Error(errorMessage), 'validation');
      setErrorInfo(errorInfo);
      setError(errorMessage);
      return;
    }

    if (isLoading && !isRetry) return;

    // Cancel any ongoing analysis
    if (analysisAbortControllerRef.current) {
      analysisAbortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    analysisAbortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);
    setErrorInfo(null);
    setAnalysis(null);
    if (!isRetry) {
      setConcept(trimmedConcept);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update loading stages - NO delays, just immediate API calls!
    setLoadingStage('initializing');
    setLoadingStage('connecting');
    setLoadingStage('analyzing');

    // Start API call immediately when entering analyzing stage
    const analysisPromise = generateConceptAnalysisAuto(trimmedConcept);

    try {
      const result = await analysisPromise;

      // Check if request was aborted
      if (analysisAbortControllerRef.current?.signal.aborted) {
        return;
      }

      setLoadingStage('generating');
      await new Promise(resolve => setTimeout(resolve, 500));

      setAnalysis(result);
      addHistoryItem(trimmedConcept);
      setErrorInfo(null);
    } catch (err) {
      // Check if request was aborted
      if (analysisAbortControllerRef.current?.signal.aborted) {
        return;
      }

      console.error(err);
      const errorInfo = createErrorInfo(err instanceof Error ? err : new Error('Analysis failed'), 'ai_service');
      setErrorInfo(errorInfo);
      setError(errorInfo.userFriendly);
    } finally {
      if (!analysisAbortControllerRef.current?.signal.aborted) {
        setIsLoading(false);
        setLoadingStage('analyzing');
      }
    }
  }, [language, addHistoryItem, isLoading]);

  const handleRetry = useCallback(() => {
    if (concept) {
      handleAnalysis(concept, true);
    }
  }, [concept, handleAnalysis]);

  const handleCancel = useCallback(() => {
    if (analysisAbortControllerRef.current) {
      analysisAbortControllerRef.current.abort();
      analysisAbortControllerRef.current = null;
    }
    setIsLoading(false);
    setLoadingStage('analyzing');
  }, []);

  const handleDownload = async () => {
    if (!analysisRef.current) {
      console.error("Analysis element not found");
      const errorInfo = createErrorInfo(new Error('Analysis element not found'), 'download');
      setErrorInfo(errorInfo);
      setError(errorInfo.userFriendly);
      return;
    }

    setIsDownloading(true);
    document.body.classList.add('is-capturing');

    try {
      // Dynamic import html2canvas only when needed
      const { default: html2canvas } = await loadHtml2Canvas();
      const canvas = await html2canvas(analysisRef.current, {
        backgroundColor: '#0f172a', // bg-slate-900
        useCORS: true,
        scale: 2,
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `why-how-what-${concept.toLowerCase().replace(/\s+/g, '-')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to download image", err);
      const errorInfo = createErrorInfo(err instanceof Error ? err : new Error('Failed to generate download image'), 'download');
      setErrorInfo(errorInfo);
      setError(errorInfo.userFriendly);
    } finally {
      document.body.classList.remove('is-capturing');
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!analysis || !concept) return;

    const stateToShare: ShareableState = {
      concept,
      analysis,
    };

    const encodedData = encodeState(stateToShare);

    if (encodedData) {
      const url = `${window.location.origin}${window.location.pathname}?data=${encodedData}`;
      try {
        await navigator.clipboard.writeText(url);
        // The button's internal state will show "Copied!"
      } catch (err) {
        console.error("Failed to copy link to clipboard", err);
        const errorInfo = createErrorInfo(err instanceof Error ? err : new Error('Could not copy link to clipboard'), 'share_link');
        setErrorInfo(errorInfo);
        setError(errorInfo.userFriendly);
      }
    } else {
      const errorInfo = createErrorInfo(new Error('Failed to generate a shareable link'), 'share_link');
      setErrorInfo(errorInfo);
      setError(errorInfo.userFriendly);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-4 sm:p-6 md:p-8 bg-slate-900 font-sans">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center flex-grow">
        <Header />
        <main className="w-full mt-8">
          <ConceptInput 
            onSubmit={handleAnalysis} 
            isLoading={isLoading} 
            maxLength={MAX_CONCEPT_LENGTH}
          />
          <Suspense fallback={
            <div className="w-full max-w-2xl mx-auto mt-8 p-4 bg-slate-800 rounded-lg text-center text-slate-400">
              Loading examples...
            </div>
          }>
            <ExampleConcepts onSelect={handleAnalysis} isLoading={isLoading} />
          </Suspense>

          <Suspense fallback={
            <div className="w-full max-w-2xl mx-auto mt-6 p-4 bg-slate-800 rounded-lg text-center text-slate-400">
              Loading history...
            </div>
          }>
            <History
              history={history}
              onSelect={handleAnalysis}
              isLoading={isLoading}
            />
          </Suspense>

          <div className="w-full max-w-2xl mx-auto flex flex-wrap justify-center items-center gap-4 mt-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <LanguageSwitcher />
            <Suspense fallback={
              <button className="px-4 py-2 bg-slate-700 text-white rounded-md" disabled>
                Loading...
              </button>
            }>
              <DownloadButton
                onClick={handleDownload}
                isLoading={isDownloading}
                isDisabled={!analysis || isLoading}
              />
            </Suspense>
            <Suspense fallback={
              <button className="px-4 py-2 bg-slate-700 text-white rounded-md" disabled>
                Loading...
              </button>
            }>
              <ShareButton
                onClick={handleShare}
                isDisabled={!analysis || isLoading}
              />
            </Suspense>
          </div>

          {isLoading && (
            <div className="mt-12">
              <EnhancedLoader
                concept={concept}
                stage={loadingStage}
                showProgress={true}
                onCancel={handleCancel}
              />
            </div>
          )}

          {error && (
            <div className="mt-12">
              <Suspense fallback={
                <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg text-center text-red-300">
                  Loading error display...
                </div>
              }>
                <ErrorDisplay
                  error={error}
                  onRetry={errorInfo?.retryable ? handleRetry : undefined}
                  showRetry={!!errorInfo?.retryable}
                  type={errorInfo?.type === 'network' || errorInfo?.type === 'timeout' ? 'warning' : 'error'}
                />
              </Suspense>
            </div>
          )}

          {analysis && !isLoading && (
            <div className="mt-12 animate-fade-in">
              <div ref={analysisRef} className="bg-slate-900 p-4 sm:p-6 rounded-lg">
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-cyan-400 mb-8">
                  {translations[language].analysisOf}{' '}
                  <span className="text-white">{concept}</span>
                </h2>
                <Suspense fallback={
                  <div className="p-8 bg-slate-800 rounded-lg text-center text-slate-400">
                    <div className="animate-pulse">Loading analysis...</div>
                  </div>
                }>
                  <AnalysisDisplay analysis={analysis} />
                </Suspense>
              </div>
            </div>
          )}
        </main>
      </div>
      <Suspense fallback={
        <div className="w-full text-center p-4 bg-slate-800 text-slate-400">
          Loading footer...
        </div>
      }>
        <Footer />
      </Suspense>
    </div>
  );
};

export default App;