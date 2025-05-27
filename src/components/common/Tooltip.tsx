// src/components/common/Tooltip.tsx

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = 'top',
  delay = 0.3,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePosition = () => {
      if (triggerRef.current && tooltipRef.current) {
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        
        let x = 0;
        let y = 0;

        switch (position) {
          case 'top':
            x = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
            y = triggerRect.top - tooltipRect.height - 8;
            break;
          case 'bottom':
            x = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
            y = triggerRect.bottom + 8;
            break;
          case 'left':
            x = triggerRect.left - tooltipRect.width - 8;
            y = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
            break;
          case 'right':
            x = triggerRect.right + 8;
            y = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
            break;
        }

        // Ajustements pour garder le tooltip dans la fenêtre
        const padding = 10;
        x = Math.max(padding, Math.min(x, window.innerWidth - tooltipRect.width - padding));
        y = Math.max(padding, Math.min(y, window.innerHeight - tooltipRect.height - padding));

        setCoords({ x, y });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [position, isVisible]);

  const variants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.1,
      },
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
      },
    },
  };

  let timeoutId: NodeJS.Timeout;

  const handleMouseEnter = () => {
    timeoutId = setTimeout(() => {
      setIsVisible(true);
    }, delay * 1000);
  };

  const handleMouseLeave = () => {
    clearTimeout(timeoutId);
    setIsVisible(false);
  };

  const getArrowStyle = () => {
    switch (position) {
      case 'top':
        return 'bottom-[-6px] left-1/2 transform -translate-x-1/2 border-t-black border-x-transparent border-t-[6px] border-x-[6px] border-b-0';
      case 'bottom':
        return 'top-[-6px] left-1/2 transform -translate-x-1/2 border-b-black border-x-transparent border-b-[6px] border-x-[6px] border-t-0';
      case 'left':
        return 'right-[-6px] top-1/2 transform -translate-y-1/2 border-l-black border-y-transparent border-l-[6px] border-y-[6px] border-r-0';
      case 'right':
        return 'left-[-6px] top-1/2 transform -translate-y-1/2 border-r-black border-y-transparent border-r-[6px] border-y-[6px] border-l-0';
    }
  };

  return (
    <div
      ref={triggerRef}
      className={`inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={variants}
            style={{
              position: 'fixed',
              left: coords.x,
              top: coords.y,
              zIndex: 50,
            }}
            className="pointer-events-none"
          >
            <div className="relative">
              <div className="bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-lg whitespace-nowrap">
                {content}
                <div className={`absolute w-0 h-0 border-solid ${getArrowStyle()}`} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;
