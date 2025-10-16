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
    const configured: Provider[] = [];
    if (import.meta.env.VITE_GLM_API_KEY) configured.push('glm45');
    if (import.meta.env.VITE_DEEPSEEK_API_KEY) configured.push('deepseek');
    if (import.meta.env.VITE_GEMINI_API_KEY) configured.push('gemini');
    if (import.meta.env.VITE_OPENAI_API_KEY) configured.push('openai');

    if (configured.length > 0) {
      return configured;
    }

    // Default to server-managed providers when keys are stored securely
    return ['glm45', 'deepseek'];
  }, []);

  const initialProvider = useMemo((): Provider | null => {
    if (availableProviders.includes('glm45')) return 'glm45';
    if (availableProviders.includes('deepseek')) return 'deepseek';
    if (availableProviders.length > 0) return availableProviders[0];
    return null;
  }, [availableProviders]);

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
