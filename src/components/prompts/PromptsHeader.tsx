// src/components/prompts/PromptsHeader.tsx

import React, { useContext, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { LanguageContext } from '../../context/LanguageContext';

interface PromptsHeaderProps {
  onCreatePrompt?: () => void;
  onCreateRole?: () => void;
}

export default function PromptsHeader({ onCreatePrompt, onCreateRole }: PromptsHeaderProps) {
  const { t } = useContext(LanguageContext);

  const handleCreatePrompt = useCallback(() => {
    onCreatePrompt?.();
  }, [onCreatePrompt]);

  const handleCreateRole = useCallback(() => {
    onCreateRole?.();
  }, [onCreateRole]);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      {/* Title and Subtitle */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors">
          {t('prompts.header.title', 'Prompts')}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 transition-colors">
          {t('prompts.header.subtitle', 'Manage and discover AI prompts')}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2 sm:gap-3">
        {/* New Role Button */}
        <button
          onClick={handleCreateRole}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 shadow-sm hover:shadow"
          aria-label={t('prompts.header.newRole', 'New Role')}
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          <span className="whitespace-nowrap">
            {t('prompts.header.newRole', 'New Role')}
          </span>
        </button>

        {/* Create New Prompt Button */}
        <button
          onClick={handleCreatePrompt}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 bg-indigo-600 dark:bg-teal-600 text-white hover:bg-indigo-700 dark:hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 shadow-sm hover:shadow-md active:scale-95"
          aria-label={t('prompts.header.generatePrompt', 'Create New Prompt')}
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          <span className="whitespace-nowrap">
            {t('prompts.header.generatePrompt', 'Create New Prompt')}
          </span>
        </button>
      </div>
    </div>
  );
}
