import React from 'react';

interface HistoryProps {
  history: string[];
  onSelect: (concept: string) => void;
  isLoading: boolean;
}

const History: React.FC<HistoryProps> = ({ history, onSelect, isLoading }) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-xl mx-auto text-center mt-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
      <span className="text-sm text-slate-400 mr-2">Your recent analyses:</span>
      <div className="flex flex-wrap gap-2 justify-center mt-1">
        {history.map((item) => (
          <button
            key={item}
            onClick={() => onSelect(item)}
            disabled={isLoading}
            className="text-sm bg-slate-700/50 border border-slate-600 text-slate-300 px-3 py-1 rounded-full hover:bg-slate-700 hover:border-cyan-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default History;