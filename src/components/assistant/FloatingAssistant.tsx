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

  // Gestion du redimensionnement de la fenêtre
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
        {/* Bouton flottant - exact circle size */}
        <button
          data-floating-button
          onClick={handleToggle}
          className={`
            relative
            flex items-center justify-center
            w-full h-full rounded-full
            bg-indigo-600 text-white
            shadow-lg hover:shadow-xl
            ${TRANSITIONS.default}
            hover:scale-110
          `}
        >
          <Bot className="w-5 h-5 md:w-6 md:h-6" />
          <span className="absolute -top-2 -right-2 px-2 py-0.5 text-[10px] md:text-xs font-bold bg-orange-500 text-white rounded-full pointer-events-none">
            BETA
          </span>
        </button>

        {/* Tooltip - positioned outside clickable area */}
        <div className="hidden md:block absolute bottom-full right-0 mb-2 w-48 p-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Need help? I am here to guide you!
        </div>
      </div>

      {/* Fenêtre de chat */}
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
            bg-white rounded-lg shadow-2xl
            ${TRANSITIONS.default}
            overflow-hidden
          `}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3 md:p-4 bg-indigo-600 text-white">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 md:w-5 md:h-5" />
              <span className="font-medium text-sm md:text-base">Sendplex Assistant</span>
              <span className="px-1.5 py-0.5 text-[10px] md:text-xs bg-orange-500 rounded-full">BETA</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 hover:bg-indigo-700 rounded transition-colors sm:block"
                aria-label={isMinimized ? "Agrandir" : "Réduire"}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-red-500 rounded transition-colors flex items-center gap-1"
                aria-label="Fermer l'assistant"
              >
                <X className="w-4 h-4" />
                <span className="text-xs md:text-sm hidden sm:inline">Close</span>
              </button>
            </div>
          </div>

          {/* Contenu */}
          {!isMinimized && <AssistantChat currentPath={location.pathname} />}
        </div>
      )}
    </>
  );
}
