import type { Analysis } from '../../types';
import { generateWithOpenAICompatible } from './openaiCompatible';

export const generateWithDeepSeek = async (concept: string): Promise<Analysis> => {
    if (!process.env.DEEPSEEK_API_KEY) {
        throw new Error("DEEPSEEK_API_KEY environment variable not set");
    }

    const OpenAI = (await import('openai')).default;

    const deepseek = new OpenAI({
        apiKey: process.env.DEEPSEEK_API_KEY,
        baseURL: 'https://api.deepseek.com/v1',
        dangerouslyAllowBrowser: true,
    });

    return generateWithOpenAICompatible(deepseek, concept, 'deepseek-chat');
};
