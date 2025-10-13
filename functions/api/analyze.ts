// Cloudflare Pages Function: POST /api/analyze
// Proxies analysis requests to AI providers using server-side secrets

// Pre-defined headers for better performance
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

// Cache the prompt to avoid recreating it on every request
let cachedPrompt: string | null = null;

function getBilingualPrompt(): string {
  if (cachedPrompt) return cachedPrompt;

  cachedPrompt = `
You are an expert educator and analyst. Your task is to explain a concept using the "Why-How-What" framework.
You MUST write your entire response, for every field, in BOTH English and Simplified Chinese.
You MUST output a single, valid JSON object and nothing else. Do not wrap the JSON in markdown backticks or any other formatting.

The JSON object must strictly conform to the following TypeScript interface:
interface BilingualText { en: string; zh: string; }
interface Section { title: BilingualText; content: BilingualText; }
interface WhatSection { title: BilingualText; coreComponents: Section; operatingMechanism: Section; applicationBoundaries: Section; }
interface Analysis { why: Section; how: Section; what: WhatSection; }

Here is the framework to follow for generating the content of the JSON fields:

🎯 **Why (The Why):**
- **Goal:** Explain why this concept exists.
- **Action:** Clarify the fundamental problem or core tension it was created to solve. Provide a solid "cognitive anchor" for its necessity.

💡 **How (The How):**
- **Goal:** Create an intuitive, sensory understanding.
- **Action:** Design a very simple, vivid analogy or micro-scenario. Strip away all jargon. Use everyday experiences to make the concept's operation instantly "felt."

🔧 **What (The What):**
- **Goal:** Systematically deconstruct the concept.
- **Action:** Break it down into a mini mental model with three parts:
  - **A. Core Components:** What are its most critical constituent parts?
  - **B. Operating Mechanism:** How do these parts interact with each other?
  - **C. Application Boundaries:** When is it applicable? When is it not?
`;
  return cachedPrompt;
}

export const onRequestOptions = () => new Response(null, { status: 204, headers: corsHeaders });

export const onRequestPost = async ({ request, env }: { request: Request; env: Record<string, string> }) => {
  try {
    const { concept } = await request.json().catch(() => ({}));
    if (!concept || typeof concept !== 'string' || concept.trim().length === 0) {
      return new Response(JSON.stringify({ error: { message: 'Concept is required and must be a non-empty string.' } }), { status: 400, headers: corsHeaders });
    }

    let providerName = 'Unknown';
    let aiResponse;

    // For now, only use DeepSeek as specified
    if (env.DEEPSEEK_API_KEY) {
      providerName = 'DeepSeek';
      aiResponse = await callDeepSeek(concept.trim(), env.DEEPSEEK_API_KEY);
    } else {
      return new Response(JSON.stringify({
        error: { message: 'DeepSeek API key not configured. Please set DEEPSEEK_API_KEY in your environment variables.' }
      }), { status: 500, headers: corsHeaders });
    }

    // Add provider info to response
    const responseWithProvider = { ...aiResponse, provider: providerName };
    return new Response(JSON.stringify(responseWithProvider), { status: 200, headers: corsHeaders });

  } catch (error: any) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({
      error: { message: error.message || 'Failed to generate concept analysis. The service may be temporarily unavailable.' }
    }), { status: 500, headers: corsHeaders });
  }
};

async function callDeepSeek(concept: string, apiKey: string) {
  console.log(`[DeepSeek] Starting analysis for concept: "${concept}"`);

  const systemPrompt = getBilingualPrompt();
  console.log(`[DeepSeek] Prompt length: ${systemPrompt.length} characters`);

  const requestBody = {
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Generate the analysis for the concept: "${concept}"` },
    ],
    temperature: 0.7,
    response_format: { type: 'json_object' },
    max_tokens: 4000, // Add token limit to prevent excessive generation
    stream: false, // Disable streaming for faster response
  };

  console.log(`[DeepSeek] Sending request to DeepSeek API...`);
  const startTime = Date.now();

  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
  });

  const responseTime = Date.now() - startTime;
  console.log(`[DeepSeek] API response received in ${responseTime}ms, status: ${response.status}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: { message: 'Could not parse error response.' } }));
    console.error(`[DeepSeek] API Error:`, errorData);
    throw new Error(`DeepSeek API Error: ${response.status} ${response.statusText} - ${errorData.error?.message || 'Unknown API error'}`);
  }

  const responseData = await response.json();
  console.log(`[DeepSeek] Response structure:`, {
    choices: responseData.choices?.length || 0,
    usage: responseData.usage
  });

  const jsonText = responseData.choices[0]?.message?.content?.trim();
  if (!jsonText) {
    throw new Error('Empty response from DeepSeek API');
  }

  console.log(`[DeepSeek] Response text length: ${jsonText.length} characters`);

  try {
    const result = JSON.parse(jsonText);
    console.log(`[DeepSeek] Successfully parsed JSON response`);
    return result;
  } catch (parseError) {
    console.error(`[DeepSeek] JSON parse error:`, parseError);
    console.error(`[DeepSeek] Raw response:`, jsonText);
    throw new Error('Invalid JSON response from DeepSeek API');
  }
}


