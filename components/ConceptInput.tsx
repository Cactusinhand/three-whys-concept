import React, { useState } from 'react';

interface ConceptInputProps {
  onSubmit: (concept: string) => void;
  isLoading: boolean;
  maxLength: number;
}

const ConceptInput: React.FC<ConceptInputProps> = ({ onSubmit, isLoading, maxLength }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(inputValue);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto animate-fade-in">
      <div className="flex items-center border-2 border-slate-700 rounded-full bg-slate-800 p-1 focus-within:border-cyan-500 transition-colors duration-300 shadow-lg">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter a concept (e.g., Blockchain, Stoicism, API)..."
          className="w-full bg-transparent border-none text-slate-200 placeholder-slate-500 px-4 py-2 focus:outline-none focus:ring-0"
          disabled={isLoading}
          maxLength={maxLength}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75 flex items-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            'Analyze'
          )}
        </button>
      </div>
    </form>
  );
};

export default ConceptInput;