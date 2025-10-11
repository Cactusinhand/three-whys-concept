import { GoogleGenAI, Type } from "@google/genai";
import type { Analysis, Language } from "../types";

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    why: {
      type: Type.OBJECT,
      description: "Explains why the concept exists, its purpose, and the problem it solves.",
      properties: {
        title: { type: Type.STRING, description: "Title for the 'Why' section." },
        content: { type: Type.STRING, description: "Detailed explanation for the 'Why' section." },
      },
      required: ["title", "content"],
    },
    how: {
      type: Type.OBJECT,
      description: "Provides an intuitive analogy or simple scenario to understand how the concept works.",
      properties: {
        title: { type: Type.STRING, description: "Title for the 'How' section." },
        content: { type: Type.STRING, description: "Detailed explanation for the 'How' section." },
      },
      required: ["title", "content"],
    },
    what: {
      type: Type.OBJECT,
      description: "Systematically breaks down the concept into its components, mechanism, and boundaries.",
      properties: {
        title: { type: Type.STRING, description: "Title for the 'What' section." },
        coreComponents: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Title for 'Core Components'." },
            content: { type: Type.STRING, description: "Explanation of the key parts." },
          },
          required: ["title", "content"],
        },
        operatingMechanism: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Title for 'Operating Mechanism'." },
            content: { type: Type.STRING, description: "Explanation of how the parts interact." },
          },
          required: ["title", "content"],
        },
        applicationBoundaries: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Title for 'Application Boundaries'." },
            content: { type: Type.STRING, description: "Explanation of where it applies and where it doesn't." },
          },
          required: ["title", "content"],
        },
      },
      required: ["title", "coreComponents", "operatingMechanism", "applicationBoundaries"],
    },
  },
  required: ["why", "how", "what"],
};

export const generateConceptAnalysis = async (concept: string, language: Language): Promise<Analysis> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const systemPrompt = `
You are an expert educator and analyst. Your task is to explain a concept using the "Why-How-What" framework.
You MUST write your entire response, including all titles and content, in ${language === 'zh' ? 'Simplified Chinese' : 'English'}.
You MUST follow this structure precisely and output your response as a valid JSON object matching the provided schema.

The user wants to understand the concept: "${concept}"

Here is the framework to follow:

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

Now, apply this framework to the concept: "${concept}".
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: systemPrompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: analysisSchema,
      temperature: 0.7,
    },
  });
  
  const text = response.text.trim();
  try {
    return JSON.parse(text) as Analysis;
  } catch (e) {
    console.error("Failed to parse JSON response:", text);
    throw new Error("Received an invalid response from the API.");
  }
};