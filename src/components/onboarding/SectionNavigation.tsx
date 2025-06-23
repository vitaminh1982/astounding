import React from 'react';
import { ArrowRight } from 'lucide-react';

interface SectionNavigationProps {
  onNext: () => void;
}

const SectionNavigation: React.FC<SectionNavigationProps> = ({ onNext }) => {
  return (
    <div className="flex justify-end pt-4 border-t border-gray-200">
      <button
        onClick={onNext}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        <span>Continue</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default SectionNavigation;