import React, { useContext, useState } from 'react';
import { Plus } from 'lucide-react';
import { LanguageContext } from '../../context/LanguageContext';
import EmptyTemplateEditor from './editor/EmptyTemplateEditor';
import { Template } from '../../types/template';

export default function TemplatesHeader() {
  const { t } = useContext(LanguageContext);
  const [showNewTemplateModal, setShowNewTemplateModal] = useState(false);

  const handleNewTemplate = () => {
    setShowNewTemplateModal(true);
  };

  const handleSaveTemplate = (template: Template) => {
    // Handle saving the new template here
    console.log('New template:', template);
    setShowNewTemplateModal(false);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {t('templates.header.title')}
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {t('templates.header.subtitle')}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2 sm:gap-1.5">
          
          <button className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base">
            <Plus className="w-4 h-4" />
            <span className="whitespace-nowrap">
              {t('templates.header.newCategory')}
            </span>
          </button>
          <button 
            onClick={handleNewTemplate}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base"
          >
            <Plus className="w-4 h-4" />
            <span className="whitespace-nowrap">
              {t('templates.header.newTemplate')}
            </span>
          </button>
        </div>
      </div>

      {showNewTemplateModal && (
        <EmptyTemplateEditor
          onClose={() => setShowNewTemplateModal(false)}
          onSave={handleSaveTemplate}
        />
      )}
    </>
  );
}
