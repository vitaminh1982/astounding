import React, { useState, useRef, useEffect } from 'react';
import { Zap } from 'lucide-react';

interface CreditConsumptionBarProps {
  directCredits: {
    used: number;
    total: number;
  };
  backgroundCredits: {
    used: number;
    total: number;
  };
  className?: string;
}

const CreditConsumptionBar: React.FC<CreditConsumptionBarProps> = ({
  directCredits,
  backgroundCredits,
  className = '',
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const directRemaining = directCredits.total - directCredits.used;
  const directPct = Math.min(100, (directCredits.used / directCredits.total) * 100);
  const backgroundPct = Math.min(100, (backgroundCredits.used / backgroundCredits.total) * 100);

  // Fermer au clic extérieur
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShowInfo(false);
      }
    };
    if (showInfo) document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [showInfo]);

  return (
    <div className={`relative ${className}`} ref={ref}>
      {/* Trigger — icône + montant restant, clic pour ouvrir */}
      <button
        onClick={() => setShowInfo(prev => !prev)}
        aria-label="Tokens restants — voir détails"
        aria-expanded={showInfo}
        className="flex items-center gap-1.5 h-9 px-3 rounded-full
          bg-gray-100 dark:bg-gray-700
          border border-gray-200 dark:border-gray-600
          hover:bg-gray-200 dark:hover:bg-gray-600
          text-gray-500 dark:text-gray-400
          transition-colors focus:outline-none"
      >
        <Zap className="h-4 w-4 flex-shrink-0" strokeWidth={1.75} />
        <span className="text-sm font-medium tabular-nums">
          {(directCredits.total - directCredits.used).toLocaleString()}
        </span>
      </button>

      {/* Info box — au clic seulement */}
      {showInfo && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl dark:shadow-gray-900 border border-gray-100 dark:border-gray-700 p-4 z-50">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">
            Token Usage
          </h4>

          {/* Active Conversations */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-600 dark:text-gray-400">Active conversations</span>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 tabular-nums">
                {directCredits.used.toLocaleString()} / {directCredits.total.toLocaleString()}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
              <div
                className="h-full rounded-full bg-gray-400 dark:bg-gray-400 transition-all"
                style={{ width: `${directPct}%` }}
              />
            </div>
          </div>

          {/* Background Processing */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-600 dark:text-gray-400">Background processing</span>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 tabular-nums">
                {backgroundCredits.used.toLocaleString()} / {backgroundCredits.total.toLocaleString()}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
              <div
                className="h-full rounded-full bg-gray-400 dark:bg-gray-400 transition-all"
                style={{ width: `${backgroundPct}%` }}
              />
            </div>
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-700">
            Resets on the 1st of each month. Unused tokens don't roll over.
          </p>
        </div>
      )}
    </div>
  );
};

export default CreditConsumptionBar;
