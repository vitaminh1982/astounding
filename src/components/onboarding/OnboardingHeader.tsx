import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Page } from '../../App';

interface OnboardingHeaderProps {
  onNavigate?: (page: Page) => void;
  onClose?: () => void;
}

const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({ onNavigate, onClose }) => {
  const handleSkipTour = () => {
    // Close the current modal/onboarding flow
    if (onClose) {
      onClose();
    }
    
    // Navigate back to the Dashboard Page
    if (onNavigate) {
      onNavigate('dashboard');
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <ShieldCheck className="w-6 h-6 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            AI Governance & Management
          </h1>
        </div>
        <p className="text-sm sm:text-base text-gray-600 mt-2">
          Welcome to Sendplex's comprehensive AI governance and management platform
        </p>
      </div>
      <div className="flex gap-3">
        <button className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-50 text-gray-700 text-sm">
          Skip Tour={handleSkipTour}
        </button>
      </div>
    </div>
  );
};

export default OnboardingHeader;