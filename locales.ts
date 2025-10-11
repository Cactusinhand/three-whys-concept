import type { Language } from './types';

type Translation = {
  loadingMessage: string;
  errorTitle: string;
  errorMessage: string;
  errorEmptyConcept: string;
  analysisOf: string;
  errorNoProvider: string;
  errorConceptTooLong: string;
};

export const translations: Record<Language, Translation> = {
  en: {
    loadingMessage: 'Analyzing "{concept}"...',
    errorTitle: 'Error',
    errorMessage: 'Failed to analyze the concept. Please ensure the API key is valid and try again.',
    errorEmptyConcept: 'Please enter a concept.',
    analysisOf: 'Analysis of:',
    errorNoProvider: 'No AI provider configured. Please ensure at least one API key is set in the environment variables.',
    errorConceptTooLong: 'Concept is too long. Please keep it under {maxLength} characters.',
  },
  zh: {
    loadingMessage: '正在分析 "{concept}"...',
    errorTitle: '错误',
    errorMessage: '分析概念失败。请确保 API 密钥有效并重试。',
    errorEmptyConcept: '请输入一个概念。',
    analysisOf: '分析:',
    errorNoProvider: '未配置 AI 提供程序。请确保在环境变量中设置了至少一个 API 密钥。',
    errorConceptTooLong: '概念太长，请保持在 {maxLength} 个字符以内。',
  },
};