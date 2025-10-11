import React from 'react';

const EXAMPLES = ['Machine Learning', 'Quantum Computing', 'Mindfulness', 'Existentialism'];

interface ExampleConceptsProps {
  onSelect: (concept: string) => void;
  isLoading: boolean;
}

const ExampleConcepts: React.FC<ExampleConceptsProps> = ({ onSelect, isLoading }) => {
  return (
    <div className="w-full max-w-xl mx-auto text-center mt-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <span className="text-sm text-slate-400 mr-2">Or try an example:</span>
      <div className="flex flex-wrap gap-2 justify-center mt-1">
        {EXAMPLES.map((example) => (
          <button
            key={example}
            onClick={() => onSelect(example)}
            disabled={isLoading}
            className="text-sm bg-slate-700/50 border border-slate-600 text-slate-300 px-3 py-1 rounded-full hover:bg-slate-700 hover:border-cyan-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExampleConcepts;
