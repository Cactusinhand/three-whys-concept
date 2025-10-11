import type { Language } from './types';

type Translation = {
  loadingMessage: string;
  errorTitle: string;
  errorMessage: string;
  errorEmptyConcept: string;
  analysisOf: string;
};

export const translations: Record<Language, Translation> = {
  en: {
    loadingMessage: 'Analyzing "{concept}"...',
    errorTitle: 'Error',
    errorMessage: 'Failed to analyze the concept. Please ensure an API key is configured and try again.',
    errorEmptyConcept: 'Please enter a concept.',
    analysisOf: 'Analysis of:',
  },
  zh: {
    loadingMessage: '正在分析 "{concept}"...',
    errorTitle: '错误',
    errorMessage: '分析概念失败。请确保已配置 API 密钥并重试。',
    errorEmptyConcept: '请输入一个概念。',
    analysisOf: '分析:',
  },
};