import React from 'react';
import { CheckCircle } from 'lucide-react';

interface Section {
  id: number;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface OnboardingProgressProps {
  sections: Section[];
  activeSection: number;
  completedSections: number[];
  onSectionClick: (sectionId: number) => void;
}

const OnboardingProgress: React.FC<OnboardingProgressProps> = ({
  sections,
  activeSection,
  completedSections,
  onSectionClick
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">Onboarding Progress</h2>
      <div className="space-y-2">
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          const isCompleted = completedSections.includes(section.id);
          
          return (
            <button
              key={section.id}
              onClick={() => onSectionClick(section.id)}
              className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : isCompleted
                  ? 'text-gray-700 hover:bg-gray-50'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <div className={`p-2 rounded-lg mr-3 ${
                isActive ? 'bg-indigo-100' : isCompleted ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                {isCompleted ? (
                  <CheckCircle className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-green-600'}`} />
                ) : (
                  <section.icon className={`w-5 h-5 ${
                    isActive ? 'text-indigo-600' : 'text-gray-500'
                  }`} />
                )}
              </div>
              <span className="font-medium">{section.title}</span>
            </button>
          );
        })}
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Progress</span>
          <span className="text-sm font-medium text-indigo-600">
            {Math.round((completedSections.length / sections.length) * 100)}%
          </span>
        </div>
        <div className="mt-2 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${(completedSections.length / sections.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingProgress;