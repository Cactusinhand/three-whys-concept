import React, { useState } from 'react';

interface ShareButtonProps {
  onClick: () => void;
  isDisabled: boolean;
}

const ShareButton: React.FC<ShareButtonProps> = ({ onClick, isDisabled }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleClick = () => {
    if (isDisabled) return;
    onClick();
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
  };

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled || isCopied}
      className="bg-teal-600 hover:bg-teal-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 sm:px-6 rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-75 flex items-center justify-center"
    >
      {isCopied ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="hidden sm:inline ml-2">Copied!</span>
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
          <span className="hidden sm:inline ml-2">Share Link</span>
        </>
      )}
    </button>
  );
};

export default ShareButton;
