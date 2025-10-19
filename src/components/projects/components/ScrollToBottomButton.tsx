/**
 * Scroll to bottom button component
 */
import React from 'react';

interface ScrollToBottomButtonProps {
  onClick: () => void;
  messageCount?: number;
}

const ScrollToBottomButton: React.FC<ScrollToBottomButtonProps> = ({ 
  onClick, 
  messageCount 
}) => {
  return (
    <button
      onClick={onClick}
      className="absolute bottom-24 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 z-10 group"
      aria-label="Scroll to bottom"
    >
      <svg 
        className="w-5 h-5" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M19 14l-7 7m0 0l-7-7m7 7V3" 
        />
      </svg>
      
      {messageCount && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
          {messageCount > 9 ? '9+' : messageCount}
        </span>
      )}
      
      <span className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
        New messages
      </span>
    </button>
  );
};

export default ScrollToBottomButton;
