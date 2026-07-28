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
          bg-surface-container-low dark:bg-surface-container-highest
          border border-border dark:border-border
          hover:bg-surface-container dark:hover:bg-surface-container-highest
          text-muted-foreground dark:text-muted-foreground
          transition-colors focus:outline-none"
      >
        <Zap className="h-4 w-4 flex-shrink-0" strokeWidth={1.75} />
        <span className="text-sm font-medium tabular-nums">
          {(directCredits.total - directCredits.used).toLocaleString()}
        </span>
      </button>

      {/* Info box — au clic seulement */}
      {showInfo && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-surface-container-high rounded-xl shadow-xl dark:shadow-gray-900 border border-border dark:border-border p-4 z-50">
          <h4 className="text-sm font-semibold text-on-surface dark:text-foreground mb-3">
            Token Usage
          </h4>

          {/* Active Conversations */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-muted-foreground dark:text-muted-foreground">Active conversations</span>
              <span className="text-xs font-medium text-on-surface dark:text-muted-foreground tabular-nums">
                {directCredits.used.toLocaleString()} / {directCredits.total.toLocaleString()}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-surface-container-low dark:bg-surface-container-highest overflow-hidden">
              <div
                className="h-full rounded-full bg-outline-variant dark:bg-outline-variant transition-all"
                style={{ width: `${directPct}%` }}
              />
            </div>
          </div>

          {/* Background Processing */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-muted-foreground dark:text-muted-foreground">Background processing</span>
              <span className="text-xs font-medium text-on-surface dark:text-muted-foreground tabular-nums">
                {backgroundCredits.used.toLocaleString()} / {backgroundCredits.total.toLocaleString()}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-surface-container-low dark:bg-surface-container-highest overflow-hidden">
              <div
                className="h-full rounded-full bg-outline-variant dark:bg-outline-variant transition-all"
                style={{ width: `${backgroundPct}%` }}
              />
            </div>
          </div>

          <p className="text-xs text-outline dark:text-muted-foreground pt-2 border-t border-border dark:border-border">
            Resets on the 1st of each month. Unused tokens don't roll over.
          </p>
        </div>
      )}
    </div>
  );
};

export default CreditConsumptionBar;
