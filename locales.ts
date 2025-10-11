import type { Language } from './types';

type Translation = {
  loadingMessage: string;
  errorTitle: string;
  errorMessage: string;
  errorEmptyConcept: string;
  analysisOf: string;
  errorNoProvider: string;
  errorConceptTooLong: string;
  // Enhanced error messages
  errorNetworkConnection: string;
  errorApiTimeout: string;
  errorApiQuotaExceeded: string;
  errorInvalidResponse: string;
  errorProviderUnavailable: string;
  errorAllProvidersFailed: string;
  errorShareLinkFailed: string;
  errorDownloadFailed: string;
  errorInvalidConcept: string;
  // Action buttons
  retryButton: string;
  cancelButton: string;
  tryAgainButton: string;
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
    // Enhanced error messages
    errorNetworkConnection: 'Network connection failed. Please check your internet connection and try again.',
    errorApiTimeout: 'Request timed out. The AI service took too long to respond. Please try again.',
    errorApiQuotaExceeded: 'API quota exceeded. Please try again later or check your API key usage.',
    errorInvalidResponse: 'Invalid response from AI service. Please try again.',
    errorProviderUnavailable: 'AI provider is temporarily unavailable. Trying alternative providers...',
    errorAllProvidersFailed: 'All AI providers failed. Please check your API keys and try again later.',
    errorShareLinkFailed: 'Failed to generate shareable link. Please try again.',
    errorDownloadFailed: 'Failed to generate download image. Please try again.',
    errorInvalidConcept: 'The concept contains invalid characters. Please enter a valid concept.',
    // Action buttons
    retryButton: 'Retry',
    cancelButton: 'Cancel',
    tryAgainButton: 'Try Again',
  },
  zh: {
    loadingMessage: '正在分析 "{concept}"...',
    errorTitle: '错误',
    errorMessage: '分析概念失败。请确保 API 密钥有效并重试。',
    errorEmptyConcept: '请输入一个概念。',
    analysisOf: '分析:',
    errorNoProvider: '未配置 AI 提供程序。请确保在环境变量中设置了至少一个 API 密钥。',
    errorConceptTooLong: '概念太长，请保持在 {maxLength} 个字符以内。',
    // Enhanced error messages
    errorNetworkConnection: '网络连接失败。请检查您的网络连接并重试。',
    errorApiTimeout: '请求超时。AI 服务响应时间过长，请重试。',
    errorApiQuotaExceeded: 'API 配额已用完。请稍后重试或检查您的 API 密钥使用情况。',
    errorInvalidResponse: 'AI 服务返回无效响应。请重试。',
    errorProviderUnavailable: 'AI 提供程序暂时不可用。正在尝试备用提供商...',
    errorAllProvidersFailed: '所有 AI 提供程序都失败了。请检查您的 API 密钥并稍后重试。',
    errorShareLinkFailed: '生成分享链接失败。请重试。',
    errorDownloadFailed: '生成下载图片失败。请重试。',
    errorInvalidConcept: '概念包含无效字符。请输入有效的概念。',
    // Action buttons
    retryButton: '重试',
    cancelButton: '取消',
    tryAgainButton: '再试一次',
  },
};