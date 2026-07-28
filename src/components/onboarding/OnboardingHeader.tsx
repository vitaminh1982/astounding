import React, { useCallback } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Page } from '../../App';

interface OnboardingHeaderProps {
  onNavigate?: (page: Page) => void;
  onClose?: () => void;
}

const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({ onNavigate, onClose }) => {
  const handleSkipTour = useCallback(() => {
    // Navigate back to Dashboard first, then close (order is your choice)
    if (onNavigate) onNavigate('dashboard' as Page);
    if (onClose) onClose();
  }, [onNavigate, onClose]);

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-teal-900 rounded-lg transition-colors">
            <ShieldCheck className="w-6 h-6 text-primary-green dark:text-teal-300 transition-colors" />
          </div>
          <h1 className="text-2xl font-bold text-on-surface dark:text-foreground transition-colors">
            AI Governance & Management
          </h1>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground dark:text-muted-foreground mt-2 transition-colors">
          Welcome to Sendplex&apos;s comprehensive AI governance and management platform
        </p>
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleSkipTour}
          className="px-4 py-2 border border-border dark:border-border rounded-lg bg-white dark:bg-surface-container-highest hover:bg-surface-container-low dark:hover:bg-surface-container-highest text-on-surface dark:text-on-surface-variant text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring dark:focus:ring-ring focus:ring-offset-2 dark:focus:ring-offset-gray-800 shadow-sm dark:shadow-gray-900 hover:shadow-md dark:hover:shadow-gray-800"
          aria-label="Skip onboarding tour and return to dashboard"
        >
          Skip Tour
        </button>
      </div>
    </div>
  );
};

export default OnboardingHeader;
