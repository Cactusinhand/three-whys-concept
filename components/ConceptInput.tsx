import React, { useState } from 'react';
import { useProvider } from '../contexts/ProviderContext';
import { PROVIDER_DISPLAY_NAMES } from '../types';

interface ConceptInputProps {
  onSubmit: (concept: string) => void;
  isLoading: boolean;
  maxLength: number;
}

const ConceptInput: React.FC<ConceptInputProps> = ({ onSubmit, isLoading, maxLength }) => {
  const [inputValue, setInputValue] = useState('');
  const { selectedProvider, setSelectedProvider, availableProviders } = useProvider();

  const prioritizedProviders = availableProviders.filter((provider) => provider === 'glm45' || provider === 'deepseek');
  const rotationList = prioritizedProviders.length > 0 ? prioritizedProviders : availableProviders;
  const fallbackProvider = rotationList[0] ?? selectedProvider ?? null;
  const activeProvider = selectedProvider && rotationList.includes(selectedProvider) ? selectedProvider : fallbackProvider;
  const providerLabel = activeProvider ? (PROVIDER_DISPLAY_NAMES[activeProvider] ?? activeProvider) : 'Auto';
  const canToggle = rotationList.length > 1;

  const handleProviderToggle = () => {
    if (!canToggle || isLoading || rotationList.length === 0) {
      return;
    }

    const currentIndex = activeProvider ? rotationList.indexOf(activeProvider) : -1;
    const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % rotationList.length : 0;
    setSelectedProvider(rotationList[nextIndex]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(inputValue);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto animate-fade-in">
      <div className="flex items-center border-2 border-slate-700 rounded-full bg-slate-800 p-1 focus-within:border-cyan-500 transition-colors duration-300 shadow-lg">
        <button
          type="button"
          onClick={handleProviderToggle}
          disabled={!canToggle || isLoading}
          className={`mr-2 px-3 py-1 text-xs sm:text-sm font-semibold rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75 ${
            !canToggle || isLoading
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-slate-700 text-cyan-300 hover:bg-slate-600'
          }`}
          title={canToggle ? 'Click to switch provider' : 'Provider managed by server configuration'}
        >
          {providerLabel}
        </button>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter a concept (e.g., Blockchain, Stoicism, API)..."
          className="w-full bg-transparent border-none text-slate-200 placeholder-slate-500 px-4 py-2 focus:outline-none focus:ring-0"
          disabled={isLoading}
          maxLength={maxLength}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75 flex items-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            'Analyze'
          )}
        </button>
      </div>
    </form>
  );
};

export default ConceptInput;
