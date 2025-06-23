import React from 'react';
import { ArrowRight } from 'lucide-react';

interface SectionNavigationProps {
  onNext: () => void;
}

const SectionNavigation: React.FC<SectionNavigationProps> = ({ onNext }) => {
  const handleContinue = () => {
    // Scroll to top of the page
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    
    // Call the original onNext function
    onNext();
  };

  return (
    <div className="flex justify-end pt-4 border-t border-gray-200">
      <button
        onClick={handleContinue}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        <span>Continue</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default SectionNavigation;
