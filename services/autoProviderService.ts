import type { Analysis, Provider } from '../types';

// Provider priority configuration - now optimized to use available providers first
const PROVIDER_PRIORITY: Provider[] = ['gemini', 'openai', 'deepseek'];

// Check if a provider has valid API key configuration
const isProviderAvailable = (provider: Provider): boolean => {
  switch (provider) {
    case 'gemini':
      const geminiKey = process.env.GEMINI_API_KEY;
      return !!geminiKey && geminiKey.trim() !== '' && geminiKey !== 'undefined';
    case 'openai':
      const openaiKey = process.env.OPENAI_API_KEY;
      return !!openaiKey && openaiKey.trim() !== '' && openaiKey !== 'undefined';
    case 'deepseek':
      const deepseekKey = process.env.DEEPSEEK_API_KEY;
      return !!deepseekKey && deepseekKey.trim() !== '' && deepseekKey !== 'undefined';
    default:
      return false;
  }
};

// Get available providers prioritized by availability, then by original priority
const getOptimizedProviderOrder = (): Provider[] => {
  // First get all available providers
  const availableProviders = PROVIDER_PRIORITY.filter(isProviderAvailable);

  // If no providers available, throw error
  if (availableProviders.length === 0) {
    throw new Error('No AI provider API keys configured. Please set GEMINI_API_KEY, OPENAI_API_KEY, or DEEPSEEK_API_KEY in your environment variables.');
  }

  console.log(`Available providers: ${availableProviders.join(', ')}`);
  return availableProviders;
};

// Generate concept analysis using the first available provider with fallback
export const generateWithAutoProvider = async (concept: string): Promise<Analysis> => {
  const availableProviders = getOptimizedProviderOrder();

  // Try each available provider in order, with fallback on failure
  for (const provider of availableProviders) {
    try {
      console.log(`Attempting to use ${provider} provider...`);

      switch (provider) {
        case 'gemini':
          const { generateWithGemini } = await import('./llm/gemini');
          return await generateWithGemini(concept);

        case 'openai':
          const { generateWithOpenAI } = await import('./llm/openai');
          return await generateWithOpenAI(concept);

        case 'deepseek':
          const { generateWithDeepSeek } = await import('./llm/deepseek');
          return await generateWithDeepSeek(concept);

        default:
          throw new Error(`Unsupported AI provider: ${provider}`);
      }
    } catch (error) {
      console.warn(`Failed to use ${provider} provider:`, error);
      if (availableProviders.indexOf(provider) === availableProviders.length - 1) {
        // This is the last provider, re-throw the error
        throw error;
      }
      // Continue to next provider
      console.log(`Falling back to next provider...`);
    }
  }

  throw new Error('All AI providers failed to process the request.');
};

// Export for testing and debugging
export const getProviderPriority = (): Provider[] => [...PROVIDER_PRIORITY];
export const checkAvailableProviders = (): Provider[] => {
  return PROVIDER_PRIORITY.filter(isProviderAvailable);
};