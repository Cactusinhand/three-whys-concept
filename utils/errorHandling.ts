/**
 * Error handling utilities for the application
 */

export interface ErrorInfo {
  type: 'network' | 'timeout' | 'quota' | 'invalid_response' | 'provider_unavailable' | 'all_providers_failed' | 'share_link' | 'download' | 'validation' | 'unknown';
  message: string;
  originalError?: Error;
  provider?: string;
  retryable: boolean;
  userFriendly: string;
}

/**
 * Categorize and create user-friendly error messages
 */
export const createErrorInfo = (error: Error, provider?: string): ErrorInfo => {
  const errorMessage = error.message.toLowerCase();

  // Network related errors
  if (errorMessage.includes('network') || errorMessage.includes('connection')) {
    return {
      type: 'network',
      message: error.message,
      originalError: error,
      provider,
      retryable: true,
      userFriendly: errorMessage.includes('fetch') ?
        'Network connection failed. Please check your internet connection.' :
        'Network error occurred. Please try again.'
    };
  }

  // Timeout errors
  if (errorMessage.includes('timeout') || errorMessage.includes('aborted')) {
    return {
      type: 'timeout',
      message: error.message,
      originalError: error,
      provider,
      retryable: true,
      userFriendly: 'Request timed out. The AI service took too long to respond. Please try again.'
    };
  }

  // API quota/usage errors
  if (errorMessage.includes('quota') || errorMessage.includes('limit') || errorMessage.includes('rate limit')) {
    return {
      type: 'quota',
      message: error.message,
      originalError: error,
      provider,
      retryable: false,
      userFriendly: 'API quota exceeded. Please try again later or check your API key usage.'
    };
  }

  // Invalid API key or authentication
  if (errorMessage.includes('unauthorized') || errorMessage.includes('api key') || errorMessage.includes('authentication')) {
    return {
      type: 'invalid_response',
      message: error.message,
      originalError: error,
      provider,
      retryable: false,
      userFriendly: `Invalid API key for ${provider || 'AI provider'}. Please check your configuration.`
    };
  }

  // Invalid response format
  if (errorMessage.includes('invalid') || errorMessage.includes('parse') || errorMessage.includes('format')) {
    return {
      type: 'invalid_response',
      message: error.message,
      originalError: error,
      provider,
      retryable: true,
      userFriendly: 'AI service returned invalid response. Please try again.'
    };
  }

  // Provider unavailable
  if (errorMessage.includes('unavailable') || errorMessage.includes('down') || errorMessage.includes('maintenance')) {
    return {
      type: 'provider_unavailable',
      message: error.message,
      originalError: error,
      provider,
      retryable: true,
      userFriendly: `AI provider is temporarily unavailable. Trying alternative providers...`
    };
  }

  // Default fallback
  return {
    type: 'unknown',
    message: error.message,
    originalError: error,
    provider,
    retryable: true,
    userFriendly: error.message || 'An unexpected error occurred. Please try again.'
  };
};

/**
 * Check if an error is retryable based on error info
 */
export const isRetryableError = (errorInfo: ErrorInfo): boolean => {
  return errorInfo.retryable;
};

/**
 * Get appropriate action button text based on error type
 */
export const getActionText = (errorInfo: ErrorInfo, language: 'en' | 'zh'): string => {
  if (errorInfo.type === 'provider_unavailable') {
    return language === 'zh' ? '尝试其他提供商' : 'Try Alternative Provider';
  }

  if (errorInfo.retryable) {
    return language === 'zh' ? '重试' : 'Retry';
  }

  return language === 'zh' ? '稍后重试' : 'Try Again Later';
};

/**
 * Determine if we should show fallback option
 */
export const shouldShowFallback = (errorInfo: ErrorInfo): boolean => {
  return errorInfo.type === 'provider_unavailable' || errorInfo.type === 'network';
};

/**
 * Create a comprehensive error for when all providers fail
 */
export const createAllProvidersFailedError = (errors: ErrorInfo[]): ErrorInfo => {
  const providerCount = errors.length;
  const providers = errors.map(e => e.provider).filter(Boolean).join(', ');

  return {
    type: 'all_providers_failed',
    message: `All ${providerCount} AI providers failed: ${providers}`,
    originalError: new Error('All providers failed'),
    retryable: false,
    userFriendly: 'All AI providers failed. Please check your API keys and try again later.'
  };
};

/**
 * Validate concept input
 */
export const validateConcept = (concept: string): { isValid: boolean; error?: string } => {
  if (!concept || concept.trim().length === 0) {
    return { isValid: false, error: 'empty' };
  }

  if (concept.length > 100) {
    return { isValid: false, error: 'too_long' };
  }

  // Check for invalid characters that might cause issues with AI services
  const invalidChars = /[<>[\]{}/\\|`]/;
  if (invalidChars.test(concept)) {
    return { isValid: false, error: 'invalid_chars' };
  }

  return { isValid: true };
};

/**
 * Get user-friendly validation error message
 */
export const getValidationErrorMessage = (errorType: string, language: 'en' | 'zh'): string => {
  switch (errorType) {
    case 'empty':
      return language === 'zh' ? '请输入一个概念。' : 'Please enter a concept.';
    case 'too_long':
      return language === 'zh' ? '概念太长，请保持在 100 个字符以内。' : 'Concept is too long. Please keep it under 100 characters.';
    case 'invalid_chars':
      return language === 'zh' ? '概念包含无效字符。请移除特殊字符后重试。' : 'The concept contains invalid characters. Please remove special characters and try again.';
    default:
      return language === 'zh' ? '输入无效，请重试。' : 'Invalid input. Please try again.';
  }
};