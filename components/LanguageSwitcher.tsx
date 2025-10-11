import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Language } from '../types';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const buttonClasses = (lang: Language) =>
    `px-3 py-1 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75 ${
      language === lang
        ? 'bg-cyan-500 text-white'
        : 'bg-transparent text-slate-300 hover:bg-slate-700'
    }`;

  return (
    <div className="flex space-x-1 bg-slate-800 p-1 rounded-lg">
      <button onClick={() => setLanguage('en')} className={buttonClasses('en')}>
        EN
      </button>
      <button onClick={() => setLanguage('zh')} className={buttonClasses('zh')}>
        中文
      </button>
    </div>
  );
};

export default LanguageSwitcher;