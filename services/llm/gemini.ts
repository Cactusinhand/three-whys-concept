import { GoogleGenAI, Type } from "@google/genai";
import type { Analysis } from "../../types";

const bilingualTextSchema = {
  type: Type.OBJECT,
  properties: {
    en: { type: Type.STRING, description: "The English version of the text." },
    zh: { type: Type.STRING, description: "The Simplified Chinese version of the text." },
  },
  required: ["en", "zh"],
};

const sectionSchema = {
  type: Type.OBJECT,
  properties: {
    title: bilingualTextSchema,
    content: bilingualTextSchema,
  },
  required: ["title", "content"],
};

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    why: {
      ...sectionSchema,
      description: "Explains why the concept exists, its purpose, and the problem it solves.",
    },
    how: {
      ...sectionSchema,
      description: "Provides an intuitive analogy or simple scenario to understand how the concept works.",
    },
    what: {
      type: Type.OBJECT,
      description: "Systematically breaks down the concept into its components, mechanism, and boundaries.",
      properties: {
        title: bilingualTextSchema,
        coreComponents: { ...sectionSchema, description: "Explanation of the key parts." },
        operatingMechanism: { ...sectionSchema, description: "Explanation of how the parts interact." },
        applicationBoundaries: { ...sectionSchema, description: "Explanation of where it applies and where it doesn't." },
      },
      required: ["title", "coreComponents", "operatingMechanism", "applicationBoundaries"],
    },
  },
  required: ["why", "how", "what"],
};

export const generateWithGemini = async (concept: string): Promise<Analysis> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set for Gemini");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const systemPrompt = `
You are an expert educator and analyst. Your task is to explain a concept using the "Why-How-What" framework.
For every single field (all titles and all content), you MUST provide the response in BOTH English and Simplified Chinese.
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
    console.error("Failed to parse JSON response from Gemini:", text);
    throw new Error("Received an invalid response from the API.");
  }
};
