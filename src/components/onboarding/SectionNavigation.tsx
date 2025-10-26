import React from 'react';
import { ArrowRight } from 'lucide-react';

interface SectionNavigationProps {
  onNext: () => void;
}

const SectionNavigation: React.FC<SectionNavigationProps> = ({ onNext }) => {
  return (
    <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
      <button
        onClick={onNext}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 dark:bg-teal-600 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        id="continue-button"
      >
        <span>Continue</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default SectionNavigation;
