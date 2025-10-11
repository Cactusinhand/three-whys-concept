import React from 'react';
import ProviderSelector from './ProviderSelector';

const Header: React.FC = () => {
  return (
    <header className="w-full animate-fade-in flex flex-col items-center gap-4 md:relative text-center">
      <div className="order-2 md:order-1">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500">
          Concept Three-Whys
        </h1>
        <p className="mt-2 text-base sm:text-lg text-slate-400 max-w-lg mx-auto">
          The <span className="bg-cyan-400/20 text-cyan-300 px-1.5 py-0.5 rounded-md">Why</span>-<span className="bg-cyan-400/20 text-cyan-300 px-1.5 py-0.5 rounded-md">How</span>-<span className="bg-cyan-400/20 text-cyan-300 px-1.5 py-0.5 rounded-md">What</span> Framework for Deep Understanding
        </p>
      </div>
      <div className="order-1 md:order-2 md:absolute md:top-0 md:right-0">
        <ProviderSelector />
      </div>
    </header>
  );
};

export default Header;