import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../locales';

interface ErrorDisplayProps {
  error: string | null;
  onRetry?: () => void;
  showRetry?: boolean;
  type?: 'error' | 'warning' | 'info';
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  showRetry = false,
  type = 'error'
}) => {
  const { language } = useLanguage();

  if (!error) return null;

  const getErrorIcon = () => {
    switch (type) {
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      default: // error
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const getErrorTypeStyles = () => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-900/50 border-yellow-700 text-yellow-300';
      case 'info':
        return 'bg-blue-900/50 border-blue-700 text-blue-300';
      default: // error
        return 'bg-red-900/50 border-red-700 text-red-300';
    }
  };

  const getRetryButtonText = () => {
    switch (language) {
      case 'zh':
        return '重试';
      default:
        return 'Retry';
    }
  };

  return (
    <div className={`mt-12 text-center border px-4 py-3 rounded-lg animate-fade-in ${getErrorTypeStyles()}`}>
      <div className="flex items-center justify-center mb-2">
        {getErrorIcon()}
        <span className="ml-2 font-bold">
          {type === 'error' ? translations[language].errorTitle :
           type === 'warning' ? 'Warning' : 'Information'}
        </span>
      </div>
      <p className="mb-3">{error}</p>
      {showRetry && onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500"
        >
          {getRetryButtonText()}
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;