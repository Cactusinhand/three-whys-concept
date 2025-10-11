import React, { useState, useCallback, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { generateConceptAnalysis } from './services/aiService';
import type { Analysis, Provider, ShareableState } from './types';
import Header from './components/Header';
import ConceptInput from './components/ConceptInput';
import AnalysisDisplay from './components/AnalysisDisplay';
import Loader from './components/Loader';
import Footer from './components/Footer';
import ExampleConcepts from './components/ExampleConcepts';
import History from './components/History';
import DownloadButton from './components/DownloadButton';
import LanguageSwitcher from './components/LanguageSwitcher';
import ShareButton from './components/ShareButton';
import { useHistory } from './hooks/useHistory';
import { useLanguage } from './contexts/LanguageContext';
import { useProvider } from './contexts/ProviderContext';
import { translations } from './locales';
import { encodeState, decodeState } from './utils/share';

const App: React.FC = () => {
  const [concept, setConcept] = useState<string>('');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();
  const { selectedProvider } = useProvider();
  const { history, addHistoryItem } = useHistory();
  const analysisRef = useRef<HTMLDivElement>(null);

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
          setError("Could not read the shared link. The data may be corrupted.");
        }
      } catch (err) {
        console.error("Failed to process shared link:", err);
        setError("Failed to load data from the shared link.");
      } finally {
        setIsLoading(false);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [addHistoryItem]);

  const handleAnalysis = useCallback(async (conceptToAnalyze: string) => {
    if (!conceptToAnalyze.trim()) {
      setError(translations[language].errorEmptyConcept);
      return;
    }
    if (isLoading) return;

    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    setConcept(conceptToAnalyze);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const result = await generateConceptAnalysis(conceptToAnalyze, selectedProvider as Provider);
      setAnalysis(result);
      addHistoryItem(conceptToAnalyze);
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : translations[language].errorMessage;
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [language, selectedProvider, addHistoryItem, isLoading]);
  
  const handleDownload = async () => {
    if (!analysisRef.current) {
      console.error("Analysis element not found");
      return;
    }

    setIsDownloading(true);
    document.body.classList.add('is-capturing');

    try {
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
      setError("Failed to generate the image for download.");
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
        setError("Could not copy link to clipboard.");
      }
    } else {
      setError("Failed to generate a shareable link.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-4 sm:p-6 md:p-8 bg-slate-900 font-sans">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center flex-grow">
        <Header />
        <main className="w-full mt-8">
          <ConceptInput onSubmit={handleAnalysis} isLoading={isLoading} />
          <ExampleConcepts onSelect={handleAnalysis} isLoading={isLoading} />

          <History
            history={history}
            onSelect={handleAnalysis}
            isLoading={isLoading}
          />
          
          <div className="w-full max-w-2xl mx-auto flex flex-wrap justify-center items-center gap-4 mt-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <LanguageSwitcher />
            <DownloadButton
              onClick={handleDownload}
              isLoading={isDownloading}
              isDisabled={!analysis || isLoading}
            />
            <ShareButton
              onClick={handleShare}
              isDisabled={!analysis || isLoading}
            />
          </div>

          {isLoading && (
            <div className="mt-12 flex flex-col items-center justify-center">
              <Loader />
              <p className="mt-4 text-slate-400">
                {translations[language].loadingMessage.replace('{concept}', concept)}
              </p>
            </div>
          )}

          {error && (
            <div className="mt-12 text-center bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg animate-fade-in">
              <p className="font-bold">{translations[language].errorTitle}</p>
              <p>{error}</p>
            </div>
          )}

          {analysis && !isLoading && (
            <div className="mt-12 animate-fade-in">
              <div ref={analysisRef} className="bg-slate-900 p-4 sm:p-6 rounded-lg">
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-cyan-400 mb-8">
                  {translations[language].analysisOf}{' '}
                  <span className="text-white">{concept}</span>
                </h2>
                <AnalysisDisplay analysis={analysis} />
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default App;
