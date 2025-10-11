import type OpenAI from 'openai';
import type { Analysis } from '../../types';
import { getOpenAIStylePrompt } from './prompt';

export const generateWithOpenAICompatible = async (
    client: OpenAI, 
    concept: string, 
    model: string = 'gpt-4o'
): Promise<Analysis> => {
    
    const systemPrompt = getOpenAIStylePrompt(concept);

    try {
        const response = await client.chat.completions.create({
            model: model,
            messages: [
                {
                    role: 'system',
                    content: systemPrompt,
                },
                {
                    role: 'user',
                    content: `Please generate the analysis for the concept: "${concept}"`
                }
            ],
            temperature: 0.7,
            response_format: { type: "json_object" },
        });

        const text = response.choices[0]?.message?.content?.trim();

        if (!text) {
            throw new Error("Received an empty response from the API.");
        }
        
        return JSON.parse(text) as Analysis;

    } catch (e) {
        console.error("Failed to parse JSON response or API call failed:", e);
        throw new Error("Received an invalid response from the API.");
    }
};
