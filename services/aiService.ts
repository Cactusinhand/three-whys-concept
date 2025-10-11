import type { Analysis, Provider } from '../types';

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
