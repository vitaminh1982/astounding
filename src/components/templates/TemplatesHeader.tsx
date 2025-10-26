import React, { useContext, useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { LanguageContext } from '../../context/LanguageContext';
import EmptyTemplateEditor from './editor/EmptyTemplateEditor';
import { Template } from '../../types/template';

export default function TemplatesHeader() {
  const { t } = useContext(LanguageContext);
  const [showNewTemplateModal, setShowNewTemplateModal] = useState(false);

  const handleNewTemplate = useCallback(() => {
    setShowNewTemplateModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowNewTemplateModal(false);
  }, []);

  const handleSaveTemplate = useCallback((template: Template) => {
    // Handle saving the new template here
    console.log('New template:', template);
    setShowNewTemplateModal(false);
  }, []);

  const handleNewCategory = useCallback(() => {
    // Handle creating a new category
    console.log('Create new category');
  }, []);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        {/* Title and Subtitle */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors">
            {t('templates.header.title')}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 transition-colors">
            {t('templates.header.subtitle')}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2 sm:gap-3">
          {/* New Category Button */}
          <button
            onClick={handleNewCategory}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 shadow-sm hover:shadow"
            aria-label={t('templates.header.newCategory')}
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            <span className="whitespace-nowrap">
              {t('templates.header.newCategory')}
            </span>
          </button>

          {/* New Template Button */}
          <button
            onClick={handleNewTemplate}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 bg-indigo-600 dark:bg-teal-600 text-white hover:bg-indigo-700 dark:hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 shadow-sm hover:shadow-md active:scale-95"
            aria-label={t('templates.header.newTemplate')}
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            <span className="whitespace-nowrap">
              {t('templates.header.newTemplate')}
            </span>
          </button>
        </div>
      </div>

      {/* New Template Modal */}
      {showNewTemplateModal && (
        <EmptyTemplateEditor
          onClose={handleCloseModal}
          onSave={handleSaveTemplate}
        />
      )}
    </>
  );
}
