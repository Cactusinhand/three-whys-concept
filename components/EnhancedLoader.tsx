import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../locales';

interface EnhancedLoaderProps {
  concept?: string;
  stage?: 'initializing' | 'connecting' | 'analyzing' | 'generating';
  showProgress?: boolean;
  onCancel?: () => void;
}

export const EnhancedLoader: React.FC<EnhancedLoaderProps> = ({
  concept,
  stage = 'analyzing',
  showProgress = false,
  onCancel
}) => {
  const { language } = useLanguage();

  const getStageText = () => {
    switch (stage) {
      case 'initializing':
        return language === 'zh' ? '正在准备分析请求...' : 'Preparing analysis request...';
      case 'connecting':
        return language === 'zh' ? '正在连接 DeepSeek AI...' : 'Connecting to DeepSeek AI...';
      case 'analyzing':
        return concept ?
          (language === 'zh' ? `正在使用 AI 分析 "${concept}"...` : `Using AI to analyze "${concept}"...`) :
          (language === 'zh' ? '正在使用 AI 分析概念...' : 'Using AI to analyze concept...');
      case 'generating':
        return language === 'zh' ? '正在整理分析结果...' : 'Organizing analysis results...';
      default:
        return language === 'zh' ? '处理中...' : 'Processing...';
    }
  };

  const getStageIcon = () => {
    switch (stage) {
      case 'initializing':
        return (
          <svg className="animate-pulse" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
            <path d="M10 4a6 6 0 100 12 6 6 0 000-12z"/>
          </svg>
        );
      case 'connecting':
        return (
          <svg className="animate-bounce" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 11a1 1 0 011-1h1.586a1 1 0 01.707.293l1.414 1.414a1 1 0 01.293.707V13a1 1 0 01-1 1v-1zm0 0a1 1 0 011-1h.01a1 1 0 01.707.293l1.414 1.414a1 1 0 01.293.707V13a1 1 0 01-1 1v-1z"/>
          </svg>
        );
      case 'analyzing':
        return (
          <svg
            className="animate-spin"
            fill="none"
            viewBox="0 0 50 50"
          >
            <circle
              className="stroke-cyan-500"
              strokeWidth="4"
              cx="25"
              cy="25"
              r="20"
              strokeDasharray="94.24"
              strokeDashoffset="70.68"
            />
          </svg>
        );
      case 'generating':
        return (
          <svg className="animate-pulse" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828a2 2 0 00-2.828 2.828l.793.793zm-3.172 3.172a2 2 0 112.828 2.828l.793-.793 2.828-2.828a2 2 0 00-2.828-2.828l-.793.793zm-2.828 2.828a2 2 0 112.828-2.828l-.793-.793-2.828 2.828a2 2 0 002.828 2.828l.793.793z"/>
          </svg>
        );
      default:
        return (
          <svg className="animate-spin" fill="none" viewBox="0 0 50 50">
            <circle className="stroke-cyan-500" strokeWidth="4" cx="25" cy="25" r="20" strokeDasharray="94.24" strokeDashoffset="70.68"/>
          </svg>
        );
    }
  };

  const getProgressSteps = () => [
    { key: 'init', label: language === 'zh' ? '初始化' : 'Initialize', done: stage !== 'initializing' },
    { key: 'connect', label: language === 'zh' ? '连接' : 'Connect', done: stage !== 'initializing' && stage !== 'connecting' },
    { key: 'analyze', label: language === 'zh' ? '分析' : 'Analyze', done: stage === 'generating' },
    { key: 'generate', label: language === 'zh' ? '生成' : 'Generate', done: stage === 'generating' }
  ];

  const getCancelButton = () => {
    switch (language) {
      case 'zh':
        return '取消';
      default:
        return 'Cancel';
    }
  };

  return (
    <div className="mt-12 flex flex-col items-center justify-center">
      <div className="h-12 w-12 text-cyan-500 mb-4">
        {getStageIcon()}
      </div>

      <p className="text-slate-400 text-lg font-medium mb-2">
        {getStageText()}
      </p>

      {showProgress && (
        <div className="w-full max-w-xs mb-8">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            {getProgressSteps().map((step, index) => (
              <React.Fragment key={step.key}>
                <div className={`flex items-center ${step.done ? 'text-cyan-400' : 'text-slate-600'}`}>
                  <div className={`w-2 h-2 rounded-full ${step.done ? 'bg-cyan-400' : 'bg-slate-600'}`} />
                  <span className="ml-2 whitespace-nowrap">{step.label}</span>
                </div>
                {index < getProgressSteps().length - 1 && (
                  <div className="flex-1 flex justify-center text-slate-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 001.414 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col items-center space-y-5">
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            {getCancelButton()}
          </button>
        )}

        <div className="text-xs text-slate-500 animate-pulse">
          {language === 'zh' ? '请稍候，AI正在处理您的请求...' : 'Please wait, AI is processing your request...'}
        </div>
      </div>

      <div className="mt-6 text-center">
        <div className="inline-flex items-center space-x-2 text-xs text-slate-600">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
          </svg>
          <span>
            {language === 'zh' ? '处理时间取决于概念复杂度' : 'Processing time varies by concept complexity'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EnhancedLoader;