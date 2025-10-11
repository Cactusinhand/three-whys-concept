import type { Analysis, Provider } from '../types';
import { generateWithAutoProvider, checkAvailableProviders } from './autoProviderService';

export const generateConceptAnalysis = async (concept: string, provider: Provider): Promise<Analysis> => {
  switch (provider) {
    case 'gemini':
      console.log("Using Gemini API");
      const { generateWithGemini } = await import('./llm/gemini');
      return generateWithGemini(concept);

    case 'openai':
      console.log("Using OpenAI API");
      const { generateWithOpenAI } = await import('./llm/openai');
      return generateWithOpenAI(concept);

    case 'deepseek':
      console.log("Using DeepSeek API");
      const { generateWithDeepSeek } = await import('./llm/deepseek');
      return generateWithDeepSeek(concept);

    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
};

// New function that automatically selects the best available provider
export const generateConceptAnalysisAuto = async (concept: string): Promise<Analysis> => {
  const availableProviders = checkAvailableProviders();

  if (availableProviders.length === 0) {
    throw new Error('No AI provider API keys configured. Please set GEMINI_API_KEY, OPENAI_API_KEY, or DEEPSEEK_API_KEY in your environment variables.');
  }

  console.log(`Available providers: ${availableProviders.join(', ')}`);
  return generateWithAutoProvider(concept);
};
