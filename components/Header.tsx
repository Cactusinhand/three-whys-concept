import React from 'react';
import ProviderSelector from './ProviderSelector';

const Header: React.FC = () => {
  return (
    <header className="text-center w-full animate-fade-in">
      <div className="relative flex items-center justify-center">
        <div className="flex-1"></div>
        <div className="flex-1">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500 whitespace-nowrap">
            Concept Three-Whys
          </h1>
          <p className="mt-2 text-lg text-slate-400">
            The <span className="bg-cyan-400/20 text-cyan-300 px-1.5 py-0.5 rounded-md">Why</span>-<span className="bg-cyan-400/20 text-cyan-300 px-1.5 py-0.5 rounded-md">How</span>-<span className="bg-cyan-400/20 text-cyan-300 px-1.5 py-0.5 rounded-md">What</span> Framework for Deep Understanding
          </p>
        </div>
        <div className="flex-1 flex justify-end items-center space-x-2">
          <ProviderSelector />
        </div>
      </div>
    </header>
  );
};

export default Header;