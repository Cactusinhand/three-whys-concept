
import React from 'react';

const Loader: React.FC = () => {
  return (
    <svg 
      className="h-12 w-12 text-cyan-500" 
      viewBox="0 0 50 50" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle 
        className="animate-[spin_1.5s_linear_infinite]"
        stroke="currentColor" 
        strokeWidth="4" 
        fill="none" 
        cx="25" 
        cy="25" 
        r="20" 
        strokeDasharray="94.24" 
        strokeDashoffset="70.68"
        style={{ transformOrigin: 'center' }}
      ></circle>
    </svg>
  );
};

export default Loader;
