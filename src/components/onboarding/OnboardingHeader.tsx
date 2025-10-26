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
            <ShieldCheck className="w-6 h-6 text-indigo-600 dark:text-teal-300" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            AI Governance & Management
          </h1>
        </div>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
          Welcome to Sendplex&apos;s comprehensive AI governance and management platform
        </p>
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleSkipTour}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          Skip Tour
        </button>
      </div>
    </div>
  );
};

export default OnboardingHeader;
