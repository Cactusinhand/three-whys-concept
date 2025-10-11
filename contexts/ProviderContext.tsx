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
    if (process.env.API_KEY) providers.push('gemini');
    if (process.env.OPENAI_API_KEY) providers.push('openai');
    if (process.env.DEEPSEEK_API_KEY) providers.push('deepseek');
    return providers;
  }, []);

  const initialProvider = useMemo((): Provider | null => {
    if (process.env.API_KEY) return 'gemini';
    if (process.env.OPENAI_API_KEY) return 'openai';
    if (process.env.DEEPSEEK_API_KEY) return 'deepseek';
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
