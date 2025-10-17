// Cloudflare Pages Function: POST /api/analyze
// Proxies analysis requests to AI providers using server-side secrets

// Pre-defined headers for better performance
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json",
};

// Cache the prompt to avoid recreating it on every request
let cachedPrompt: string | null = null;
const DEFAULT_GLM_BASE_URL = "https://open.bigmodel.cn/api/paas/v4/";

type ProviderKey = "glm45" | "deepseek";

interface ProviderCandidate {
  key: ProviderKey;
  displayName: string;
  executor: () => Promise<any>;
}

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

?? **Why (The Why):**
- **Goal:** Explain why this concept exists.
- **Action:** Clarify the fundamental problem or core tension it was created to solve. Provide a solid "cognitive anchor" for its necessity.

?? **How (The How):**
- **Goal:** Create an intuitive, sensory understanding.
- **Action:** Design a very simple, vivid analogy or micro-scenario. Strip away all jargon. Use everyday experiences to make the concept's operation instantly "felt."

?? **What (The What):**
- **Goal:** Systematically deconstruct the concept.
- **Action:** Break it down into a mini mental model with three parts:
  - **A. Core Components:** What are its most critical constituent parts?
  - **B. Operating Mechanism:** How do these parts interact with each other?
  - **C. Application Boundaries:** When is it applicable? When is it not?
`;
  return cachedPrompt;
}

export const onRequestOptions = () =>
  new Response(null, { status: 204, headers: corsHeaders });

export const onRequestPost = async ({
  request,
  env,
}: {
  request: Request;
  env: Record<string, string>;
}) => {
  const handlerStart = Date.now();
  try {
    const { concept, provider } = await request.json().catch(() => ({}));
    if (
      !concept ||
      typeof concept !== "string" ||
      concept.trim().length === 0
    ) {
      return new Response(
        JSON.stringify({
          error: {
            message: "Concept is required and must be a non-empty string.",
          },
        }),
        { status: 400, headers: corsHeaders },
      );
    }

    const sanitizedConcept = concept.trim();
    const normalizedProvider =
      typeof provider === "string" ? provider.toLowerCase() : null;

    const glmApiKey = env.GLM_API_KEY || env.GLM_45_AIR_API_KEY;
    const glmBaseUrl =
      env.GLM_BASE_URL || env.GLM_45_AIR_BASE_URL || DEFAULT_GLM_BASE_URL;
    const deepseekApiKey = env.DEEPSEEK_API_KEY;

    const providerCandidates: ProviderCandidate[] = [];
    const addCandidate = (candidate: ProviderCandidate) => {
      if (!providerCandidates.some(({ key }) => key === candidate.key)) {
        providerCandidates.push(candidate);
      }
    };

    if (normalizedProvider === "glm45" && glmApiKey) {
      addCandidate({
        key: "glm45",
        displayName: "GLM-4.5-Air",
        executor: () => callGLM(sanitizedConcept, glmApiKey, glmBaseUrl),
      });
    }

    if (normalizedProvider === "deepseek" && deepseekApiKey) {
      addCandidate({
        key: "deepseek",
        displayName: "DeepSeek",
        executor: () => callDeepSeek(sanitizedConcept, deepseekApiKey),
      });
    }

    if (glmApiKey) {
      addCandidate({
        key: "glm45",
        displayName: "GLM-4.5-Air",
        executor: () => callGLM(sanitizedConcept, glmApiKey, glmBaseUrl),
      });
    }

    if (deepseekApiKey) {
      addCandidate({
        key: "deepseek",
        displayName: "DeepSeek",
        executor: () => callDeepSeek(sanitizedConcept, deepseekApiKey),
      });
    }

    if (providerCandidates.length === 0) {
      return new Response(
        JSON.stringify({
          error: {
            message:
              "No AI provider configured. Please set GLM_API_KEY or DEEPSEEK_API_KEY in your environment variables.",
          },
        }),
        { status: 500, headers: corsHeaders },
      );
    }

    let providerName = "Unknown";
    let aiResponse: any;
    let lastError: Error | null = null;

    for (const candidate of providerCandidates) {
      console.log(`[${candidate.displayName}] Attempting provider...`);
      const attemptStart = Date.now();
      try {
        aiResponse = await candidate.executor();
        const attemptDuration = Date.now() - attemptStart;
        console.log(
          `[${candidate.displayName}] Completed successfully in ${attemptDuration}ms`,
        );
        providerName = candidate.displayName;
        break;
      } catch (providerError) {
        const attemptDuration = Date.now() - attemptStart;
        const normalizedError =
          providerError instanceof Error
            ? providerError
            : new Error(String(providerError));
        console.error(
          `[${candidate.displayName}] Provider error after ${attemptDuration}ms:`,
          normalizedError,
        );
        lastError = normalizedError;
      }
    }

    if (!aiResponse) {
      return new Response(
        JSON.stringify({
          error: {
            message:
              lastError?.message ||
              "All AI providers failed. Please check your configuration.",
          },
        }),
        { status: 500, headers: corsHeaders },
      );
    }

    const totalDuration = Date.now() - handlerStart;
    console.log(
      `[analyze] Responding with provider ${providerName} in ${totalDuration}ms`,
    );
    const responseWithProvider = { ...aiResponse, provider: providerName };
    return new Response(JSON.stringify(responseWithProvider), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error: any) {
    console.error("API Error:", error);
    if (typeof handlerStart === "number") {
      console.error(
        `[analyze] Request failed after ${Date.now() - handlerStart}ms`,
      );
    }
    return new Response(
      JSON.stringify({
        error: {
          message:
            error.message ||
            "Failed to generate concept analysis. The service may be temporarily unavailable.",
        },
      }),
      { status: 500, headers: corsHeaders },
    );
  }
};

// Normalize model output into the strict Analysis shape expected by the frontend
function normalizeToBilingual(val: any): { en: string; zh: string } {
  // If array, join as paragraphs
  if (Array.isArray(val)) {
    const s = val.filter((x) => typeof x === "string").join("\n\n");
    return { en: s, zh: s };
  }
  if (val && typeof val === "object") {
    // Common variants for bilingual keys
    const enRaw =
      val.en ?? val.english ?? val["en-US"] ?? val["en_us"] ?? val["EN"];
    const zhRaw =
      val.zh ?? val.chinese ?? val["zh-CN"] ?? val["zh_cn"] ?? val["CN"];

    const en = Array.isArray(enRaw)
      ? enRaw.filter((x: any) => typeof x === "string").join("\n\n")
      : typeof enRaw === "string"
        ? enRaw
        : typeof val.english === "string"
          ? val.english
          : undefined;

    const zh = Array.isArray(zhRaw)
      ? zhRaw.filter((x: any) => typeof x === "string").join("\n\n")
      : typeof zhRaw === "string"
        ? zhRaw
        : typeof val.chinese === "string"
          ? val.chinese
          : undefined;

    if (typeof en === "string" || typeof zh === "string") {
      return {
        en: (en ?? zh ?? "").toString(),
        zh: (zh ?? en ?? "").toString(),
      };
    }
  }
  const s = typeof val === "string" ? val : "";
  return { en: s, zh: s };
}

function getFirst<T = any>(
  obj: any,
  keys: string[],
  fallback?: any,
): T | undefined {
  if (!obj || typeof obj !== "object") return fallback;
  for (const k of keys) {
    const v = obj[k];
    if (v !== undefined) return v as T;
  }
  return fallback;
}

function normalizeSection(
  raw: any,
  defaultTitleEn: string,
  defaultTitleZh: string,
) {
  const title = normalizeToBilingual(
    getFirst(raw, ["title", "heading", "name", "label"]),
  );
  const content = normalizeToBilingual(
    getFirst(raw, ["content", "text", "body", "details"]),
  );
  return {
    title: {
      en: title.en || defaultTitleEn,
      zh: title.zh || defaultTitleZh,
    },
    content,
  };
}

function normalizeAnalysisPayload(data: any) {
  // Handle wrapper keys often used by models
  const root = getFirst(data, ["analysis", "result", "data", "output"]) ?? data;

  // Map top-level sections with common aliases/casing
  const whyRaw = getFirst(root, ["why", "Why", "purpose", "theWhy", "raison"]);
  const howRaw = getFirst(root, [
    "how",
    "How",
    "method",
    "approach",
    "mechanism",
  ]);
  const whatRaw = getFirst(root, ["what", "What", "definition", "structure"]);

  const why = normalizeSection(whyRaw || {}, "Why", "为什么");
  const how = normalizeSection(howRaw || {}, "How", "如何");

  const whatTitle = normalizeToBilingual(
    getFirst(whatRaw, ["title", "heading", "name", "label"]),
  );
  const coreRaw = getFirst(whatRaw, [
    "coreComponents",
    "core_components",
    "components",
    "core",
    "parts",
  ]);
  const mechRaw = getFirst(whatRaw, [
    "operatingMechanism",
    "operating_mechanism",
    "mechanism",
    "how_it_works",
    "operation",
  ]);
  const boundsRaw = getFirst(whatRaw, [
    "applicationBoundaries",
    "application_boundaries",
    "boundaries",
    "limitations",
    "scope",
  ]);

  const coreComponents = normalizeSection(
    coreRaw || {},
    "Core Components",
    "核心要素",
  );
  const operatingMechanism = normalizeSection(
    mechRaw || {},
    "Operating Mechanism",
    "运作机制",
  );
  const applicationBoundaries = normalizeSection(
    boundsRaw || {},
    "Application Boundaries",
    "适用边界",
  );

  return {
    why,
    how,
    what: {
      title: {
        en: whatTitle.en || "What",
        zh: whatTitle.zh || "是什么",
      },
      coreComponents,
      operatingMechanism,
      applicationBoundaries,
    },
  };
}

async function callGLM(
  concept: string,
  apiKey: string,
  baseUrl: string = DEFAULT_GLM_BASE_URL,
) {
  const overallStart = Date.now();
  console.log(`[GLM-4.5-Air] Starting analysis for concept: "${concept}"`);

  const systemPrompt = getBilingualPrompt();
  console.log(`[GLM-4.5-Air] Prompt length: ${systemPrompt.length} characters`);

  const requestBody = {
    model: "glm-4.5-air",
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Generate the analysis for the concept: "${concept}"`,
      },
    ],
    temperature: 0.7,
    response_format: { type: "json_object" },
    max_tokens: 4000,
    stream: false,
  };

  const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const endpoint = new URL("chat/completions", normalizedBaseUrl).toString();

  console.log(`[GLM-4.5-Air] Sending request to GLM API...`);
  const startTime = Date.now();

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
  });

  const responseTime = Date.now() - startTime;
  console.log(
    `[GLM-4.5-Air] API response received in ${responseTime}ms, status: ${response.status}`,
  );

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: { message: "Could not parse error response." } }));
    console.error(`[GLM-4.5-Air] API Error:`, errorData);
    throw new Error(
      `GLM-4.5-Air API Error: ${response.status} ${response.statusText} - ${errorData.error?.message || "Unknown API error"}`,
    );
  }

  const decodeStart = Date.now();
  const responseData = await response.json();
  const decodeDuration = Date.now() - decodeStart;
  console.log(`[GLM-4.5-Air] Response structure:`, {
    choices: responseData.choices?.length || 0,
    usage: responseData.usage,
    bodyParseMs: decodeDuration,
  });

  const message = responseData.choices?.[0]?.message;
  let jsonText: string | undefined;

  if (typeof message?.content === "string") {
    jsonText = message.content.trim();
  } else if (Array.isArray(message?.content)) {
    jsonText = message.content
      .map((part: any) => {
        if (typeof part === "string") return part;
        if (part && typeof part === "object") {
          if (typeof part.text === "string") return part.text;
          if (typeof part.content === "string") return part.content;
        }
        return "";
      })
      .join("")
      .trim();
  }

  if (!jsonText) {
    console.error(
      "[GLM-4.5-Air] Empty or unsupported message format:",
      message,
    );
    throw new Error("Empty response from GLM-4.5-Air API");
  }

  console.log(
    `[GLM-4.5-Air] Response text length: ${jsonText.length} characters`,
  );

  try {
    const parseStart = Date.now();
    const result = JSON.parse(jsonText);
    const normalized = normalizeAnalysisPayload(result);
    console.log(
      `[GLM-4.5-Air] Successfully parsed JSON response in ${Date.now() - parseStart}ms (total ${Date.now() - overallStart}ms)`,
    );
    return normalized;
  } catch (parseError) {
    console.error(`[GLM-4.5-Air] JSON parse error:`, parseError);
    console.error(`[GLM-4.5-Air] Raw response:`, jsonText);
    throw new Error("Invalid JSON response from GLM-4.5-Air API");
  }
}

async function callDeepSeek(concept: string, apiKey: string) {
  console.log(`[DeepSeek] Starting analysis for concept: "${concept}"`);

  const systemPrompt = getBilingualPrompt();
  console.log(`[DeepSeek] Prompt length: ${systemPrompt.length} characters`);

  const requestBody = {
    model: "deepseek-chat",
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Generate the analysis for the concept: "${concept}"`,
      },
    ],
    temperature: 0.7,
    response_format: { type: "json_object" },
    max_tokens: 4000, // Add token limit to prevent excessive generation
    stream: false, // Disable streaming for faster response
  };

  console.log(`[DeepSeek] Sending request to DeepSeek API...`);
  const startTime = Date.now();

  const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
  });

  const responseTime = Date.now() - startTime;
  console.log(
    `[DeepSeek] API response received in ${responseTime}ms, status: ${response.status}`,
  );

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: { message: "Could not parse error response." } }));
    console.error(`[DeepSeek] API Error:`, errorData);
    throw new Error(
      `DeepSeek API Error: ${response.status} ${response.statusText} - ${errorData.error?.message || "Unknown API error"}`,
    );
  }

  const responseData = await response.json();
  console.log(`[DeepSeek] Response structure:`, {
    choices: responseData.choices?.length || 0,
    usage: responseData.usage,
  });

  const jsonText = responseData.choices[0]?.message?.content?.trim();
  if (!jsonText) {
    throw new Error("Empty response from DeepSeek API");
  }

  console.log(`[DeepSeek] Response text length: ${jsonText.length} characters`);

  try {
    const result = JSON.parse(jsonText);
    const normalized = normalizeAnalysisPayload(result);
    console.log(`[DeepSeek] Successfully parsed JSON response`);
    return normalized;
  } catch (parseError) {
    console.error(`[DeepSeek] JSON parse error:`, parseError);
    console.error(`[DeepSeek] Raw response:`, jsonText);
    throw new Error("Invalid JSON response from DeepSeek API");
  }
}
