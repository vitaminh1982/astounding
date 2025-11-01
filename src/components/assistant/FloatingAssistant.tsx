import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Minus, Maximize2, MessageSquare } from 'lucide-react';
import { TRANSITIONS } from '../../utils/animations';
import AssistantChat from './AssistantChat';
import { useLocation } from 'react-router-dom';

export default function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const location = useLocation();
  const assistantRef = useRef(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (assistantRef.current && !assistantRef.current.contains(event.target)) {
        const isFloatingButton = event.target.closest('[data-floating-button]');
        if (!isFloatingButton) {
          setIsOpen(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Window resize handling
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640 && isOpen) {
        setIsMinimized(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  return (
    <>
      {/* Container for floating button with minimal footprint */}
      <div 
        className={`
          fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50
          ${isOpen ? 'hidden' : 'block'}
          w-12 h-12 md:w-14 md:h-14
          group
        `}
      >
        {/* Floating button - exact circle size */}
        <button
          data-floating-button
          onClick={handleToggle}
          className={`
            relative
            flex items-center justify-center
            w-full h-full rounded-full
            bg-indigo-600 dark:bg-teal-600 text-white
            shadow-lg dark:shadow-gray-900 hover:shadow-xl dark:hover:shadow-gray-800
            ${TRANSITIONS.default}
            hover:scale-110
            focus:outline-none focus:ring-4 focus:ring-indigo-500/50 dark:focus:ring-teal-500/50
            transition-all duration-200
          `}
          aria-label="Open Sendplex Assistant"
        >
          <Bot className="w-5 h-5 md:w-6 md:h-6 transition-colors" />
          <span className="absolute -top-2 -right-2 px-2 py-0.5 text-[10px] md:text-xs font-bold bg-orange-500 dark:bg-orange-400 text-white rounded-full pointer-events-none shadow-sm transition-colors">
            BETA
          </span>
        </button>

        {/* Tooltip - positioned outside clickable area */}
        <div className="hidden md:block absolute bottom-full right-0 mb-2 w-48 p-2 bg-gray-900 dark:bg-gray-700 border border-gray-700 dark:border-gray-600 text-white dark:text-gray-200 text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-lg dark:shadow-gray-900">
          <span className="transition-colors">Need help? I am here to guide you!</span>
          {/* Tooltip arrow */}
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
        </div>
      </div>

      {/* Chat window */}
      {isOpen && (
        <div
          ref={assistantRef}
          className={`
            fixed z-[49]
            ${isMinimized 
              ? 'bottom-4 right-4 md:bottom-6 md:right-6 w-auto h-12' 
              : 'bottom-0 right-0 sm:bottom-4 sm:right-4 md:bottom-6 md:right-6'
            }
            ${isMinimized ? 'w-auto' : 'w-full sm:w-[400px]'}
            ${isMinimized ? 'h-12' : 'h-[85vh] sm:h-[600px]'}
            bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
            rounded-lg shadow-2xl dark:shadow-gray-900
            ${TRANSITIONS.default}
            overflow-hidden transition-all duration-200
          `}
          role="dialog"
          aria-label="Sendplex Assistant Chat"
          aria-modal="true"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3 md:p-4 bg-indigo-600 dark:bg-teal-600 text-white transition-colors">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 md:w-5 md:h-5 transition-colors" />
              <span className="font-medium text-sm md:text-base transition-colors">Sendplex Assistant</span>
              <span className="px-1.5 py-0.5 text-[10px] md:text-xs bg-orange-500 dark:bg-orange-400 text-white rounded-full shadow-sm transition-colors">
                BETA
              </span>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              {/* Minimize/Maximize button - hidden on mobile */}
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="hidden sm:flex p-1.5 hover:bg-indigo-700 dark:hover:bg-teal-700 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent"
                aria-label={isMinimized ? "Expand assistant" : "Minimize assistant"}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
              </button>
              
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-red-500 dark:hover:bg-red-600 rounded transition-colors flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent"
                aria-label="Close assistant"
              >
                <X className="w-4 h-4" />
                <span className="text-xs md:text-sm hidden sm:inline transition-colors">Close</span>
              </button>
            </div>
          </div>

          {/* Content */}
          {!isMinimized && (
            <div className="flex-1 bg-white dark:bg-gray-800 transition-colors">
              <AssistantChat currentPath={location.pathname} />
            </div>
          )}
        </div>
      )}
    </>
  );
}
