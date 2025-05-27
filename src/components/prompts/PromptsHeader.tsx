// src/components/prompts/PromptsHeader.tsx

import React, { useContext } from 'react';
import { Plus } from 'lucide-react';
import { LanguageContext } from '../../context/LanguageContext';

interface PromptsHeaderProps {
  onCreatePrompt?: () => void;
  onCreateRole?: () => void;
}

export default function PromptsHeader({ onCreatePrompt, onCreateRole }: PromptsHeaderProps) {
  const { t } = useContext(LanguageContext);

  return (
    <>
      {/* Header section with title, subtitle, and action buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
        {/* Title and Subtitle */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {t('prompts.header.title', 'Prompts')}
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {t('prompts.header.subtitle', 'Manage and discover AI prompts')}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2 sm:gap-1.5">
          {/* New Role Button */}
          <button
            onClick={onCreateRole}
            className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
          >
            <Plus className="w-4 h-4" />
            <span className="whitespace-nowrap">
              {t('prompts.header.newRole', 'New Role')}
            </span>
          </button>

          {/* Create New Prompt Button */}
          <button
            onClick={onCreatePrompt}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base"
          >
            <Plus className="w-4 h-4" />
            <span className="whitespace-nowrap">
              {t('prompts.header.generatePrompt', 'Create New Prompt')}
            </span>
          </button>
        </div>
      </div>
    </>
  );
}