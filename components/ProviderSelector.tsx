import React from 'react';
import { useProvider } from '../contexts/ProviderContext';
import type { Provider } from '../types';

const PROVIDER_NAMES: Record<Provider, string> = {
    gemini: 'Gemini',
    openai: 'OpenAI',
    deepseek: 'DeepSeek'
}

const ProviderSelector: React.FC = () => {
  const { selectedProvider, setSelectedProvider, availableProviders } = useProvider();

  if (availableProviders.length <= 1) {
    return null; // Don't show the selector if only one or zero providers are configured
  }

  const buttonClasses = (provider: Provider) =>
    `px-3 py-1 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75 ${
      selectedProvider === provider
        ? 'bg-cyan-500 text-white'
        : 'bg-transparent text-slate-300 hover:bg-slate-700'
    }`;

  return (
    <div className="flex space-x-1 bg-slate-800 p-1 rounded-lg">
      {availableProviders.map((provider) => (
        <button 
            key={provider}
            onClick={() => setSelectedProvider(provider)} 
            className={buttonClasses(provider)}
        >
            {PROVIDER_NAMES[provider]}
        </button>
      ))}
    </div>
  );
};

export default ProviderSelector;