export type Language = 'en' | 'zh';
export type Provider = 'gemini' | 'openai' | 'deepseek' | 'glm45';

export interface BilingualText {
  en: string;
  zh: string;
}

export interface Section {
  title: BilingualText;
  content: BilingualText;
}

export interface WhatSection {
  title: BilingualText;
  coreComponents: Section;
  operatingMechanism: Section;
  applicationBoundaries: Section;
}

export interface Analysis {
  why: Section;
  how: Section;
  what: WhatSection;
}

export interface ShareableState {
  concept: string;
  analysis: Analysis;
}

export const PROVIDER_DISPLAY_NAMES: Record<Provider, string> = {
  gemini: 'Gemini',
  openai: 'OpenAI',
  deepseek: 'DeepSeek',
  glm45: 'GLM',
};
