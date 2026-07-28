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
    <div className="bg-white dark:bg-surface-container-high rounded-xl shadow-sm dark:shadow-gray-900 p-6 border border-border dark:border-border transition-colors">
      <h2 className="text-lg font-semibold text-on-surface dark:text-foreground mb-6 transition-colors">Onboarding Progress</h2>
      <div className="space-y-2">
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          const isCompleted = completedSections.includes(section.id);
          
          return (
            <button
              key={section.id}
              onClick={() => onSectionClick(section.id)}
              className={`w-full flex items-center p-3 rounded-lg text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring dark:focus:ring-ring focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                isActive
                  ? 'bg-indigo-50 dark:bg-green-900 text-indigo-700 dark:text-green-100 shadow-sm dark:shadow-gray-900'
                  : isCompleted
                  ? 'text-on-surface dark:text-on-surface-variant hover:bg-surface-container-low dark:hover:bg-surface-container-highest hover:shadow-sm dark:hover:shadow-gray-900'
                  : 'text-muted-foreground dark:text-muted-foreground hover:bg-surface-container-low dark:hover:bg-surface-container-highest'
              }`}
              aria-label={`${isCompleted ? 'Completed' : isActive ? 'Current' : 'Pending'} section: ${section.title}`}
              aria-current={isActive ? 'step' : undefined}
            >
              <div className={`p-2 rounded-lg mr-3 transition-colors ${
                isActive 
                  ? 'bg-indigo-100 dark:bg-green-800' 
                  : isCompleted 
                  ? 'bg-green-100 dark:bg-green-900' 
                  : 'bg-surface-container-low dark:bg-surface-container-highest'
              }`}>
                {isCompleted ? (
                  <CheckCircle className={`w-5 h-5 transition-colors ${
                    isActive 
                      ? 'text-primary-green dark:text-green-300' 
                      : 'text-green-600 dark:text-green-300'
                  }`} />
                ) : (
                  <section.icon className={`w-5 h-5 transition-colors ${
                    isActive 
                      ? 'text-primary-green dark:text-green-300' 
                      : 'text-muted-foreground dark:text-muted-foreground'
                  }`} />
                )}
              </div>
              <span className="font-medium transition-colors">{section.title}</span>
            </button>
          );
        })}
      </div>
      
      <div className="mt-6 pt-6 border-t border-border dark:border-border transition-colors">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground dark:text-muted-foreground transition-colors">Progress</span>
          <span className="text-sm font-medium text-primary-green dark:text-green-400 transition-colors">
            {Math.round((completedSections.length / sections.length) * 100)}%
          </span>
        </div>
        <div className="mt-2 w-full h-2 bg-surface-container dark:bg-surface-container-highest rounded-full overflow-hidden transition-colors">
          <div 
            className="h-full bg-primary dark:bg-primary transition-all duration-300"
            style={{ width: `${(completedSections.length / sections.length) * 100}%` }}
            role="progressbar"
            aria-valuenow={Math.round((completedSections.length / sections.length) * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Onboarding progress: ${completedSections.length} of ${sections.length} sections completed`}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingProgress;
