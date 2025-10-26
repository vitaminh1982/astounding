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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900 p-6 border border-gray-200 dark:border-gray-700 transition-colors">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6">Onboarding Progress</h2>
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
                  ? 'bg-indigo-50 dark:bg-teal-900 text-indigo-700 dark:text-teal-100'
                  : isCompleted
                  ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className={`p-2 rounded-lg mr-3 transition-colors ${
                isActive 
                  ? 'bg-indigo-100 dark:bg-teal-800' 
                  : isCompleted 
                  ? 'bg-green-100 dark:bg-green-900' 
                  : 'bg-gray-100 dark:bg-gray-700'
              }`}>
                {isCompleted ? (
                  <CheckCircle className={`w-5 h-5 ${
                    isActive 
                      ? 'text-indigo-600 dark:text-teal-300' 
                      : 'text-green-600 dark:text-green-300'
                  }`} />
                ) : (
                  <section.icon className={`w-5 h-5 ${
                    isActive 
                      ? 'text-indigo-600 dark:text-teal-300' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`} />
                )}
              </div>
              <span className="font-medium">{section.title}</span>
            </button>
          );
        })}
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">Progress</span>
          <span className="text-sm font-medium text-indigo-600 dark:text-teal-400">
            {Math.round((completedSections.length / sections.length) * 100)}%
          </span>
        </div>
        <div className="mt-2 w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 dark:bg-teal-500 transition-all duration-300"
            style={{ width: `${(completedSections.length / sections.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingProgress;
