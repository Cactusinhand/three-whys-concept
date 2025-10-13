// FIX: Updated ProviderContext to support dynamic provider selection.
// This adds `setSelectedProvider` and `availableProviders` to the context
// to resolve type errors in the `ProviderSelector` component.
import React, { createContext, useContext, ReactNode, useMemo, useState } from 'react';
import type { Provider } from '../types';

interface ProviderContextType {
  selectedProvider: Provider | null;
  setSelectedProvider: (provider: Provider) => void;
  availableProviders: Provider[];
}

const ProviderContext = createContext<ProviderContextType | undefined>(undefined);

export const ProviderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const availableProviders = useMemo((): Provider[] => {
    const providers: Provider[] = [];
    if (import.meta.env.VITE_GEMINI_API_KEY) providers.push('gemini');
    if (import.meta.env.VITE_OPENAI_API_KEY) providers.push('openai');
    if (import.meta.env.VITE_DEEPSEEK_API_KEY) providers.push('deepseek');
    return providers;
  }, []);

  const initialProvider = useMemo((): Provider | null => {
    // For production, always use DeepSeek regardless of other API keys
    // This prevents trying multiple providers and causing performance issues
    if (import.meta.env.VITE_DEEPSEEK_API_KEY) return 'deepseek';

    // Fallback to other providers only if DeepSeek is not available
    if (import.meta.env.VITE_GEMINI_API_KEY) return 'gemini';
    if (import.meta.env.VITE_OPENAI_API_KEY) return 'openai';
    return null;
  }, []);

  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(initialProvider);

  const value = {
    selectedProvider,
    setSelectedProvider,
    availableProviders,
  };

  return (
    <ProviderContext.Provider value={value}>
      {children}
    </ProviderContext.Provider>
  );
};

export const useProvider = (): ProviderContextType => {
  const context = useContext(ProviderContext);
  if (context === undefined) {
    throw new Error('useProvider must be used within a ProviderProvider');
  }
  return context;
};
