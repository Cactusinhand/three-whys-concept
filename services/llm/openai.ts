import type { Analysis } from '../../types';
import { generateWithOpenAICompatible } from './openaiCompatible';

export const generateWithOpenAI = async (concept: string): Promise<Analysis> => {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY environment variable not set");
    }

    const OpenAI = (await import('openai')).default;

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
    });

    return generateWithOpenAICompatible(openai, concept);
};
