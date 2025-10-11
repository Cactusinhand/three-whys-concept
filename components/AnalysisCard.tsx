
import React from 'react';

interface AnalysisCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  delay?: number;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ title, icon, children, delay = 0 }) => {
  return (
    <div 
      className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl shadow-slate-950/50 p-6 animate-slide-in-up"
      style={{ animationDelay: `${delay}s`, animationFillMode: 'backwards' }}
    >
      <h3 className="text-xl sm:text-2xl font-bold text-teal-400 flex items-center mb-4">
        {icon}
        <span className="ml-3">{title}</span>
      </h3>
      <div className="text-slate-300 text-base leading-relaxed prose prose-invert max-w-none prose-p:text-slate-300">
        {children}
      </div>
    </div>
  );
};

export default AnalysisCard;
