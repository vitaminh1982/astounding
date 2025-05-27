import React from 'react';
import { Template } from '../../../types/template';
import BasicInfo from './sections/BasicInfo';
import MessageConfig from './sections/MessageConfig';
import VariablesList from './sections/VariablesList';
import CustomizationOptions from './sections/CustomizationOptions';
import SharingSettings from './sections/SharingSettings';
import AutomationSettings from './sections/AutomationSettings';
import PreviewSection from './sections/PreviewSection';
import ValidationInfo from './sections/ValidationInfo';
import ActionButtons from './sections/ActionButtons';

interface TemplateEditorProps {
  template: Template;
  onClose: () => void;
  onSave: (template: Template) => void;
}

export default function TemplateEditor({ template, onClose, onSave }: TemplateEditorProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center overflow-y-auto p-2 sm:p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-[1200px] my-2 sm:my-4 relative">
        <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 shadow-xl">
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-3 sm:pb-4">
            <h2 className="text-lg sm:text-2xl font-bold">Template Modification</h2>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1.5 sm:p-2 rounded-full transition-colors"
            >
              <span className="sr-only">Close</span>
              <svg 
                className="h-5 w-5 sm:h-6 sm:w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Left Column (spans 2 columns on desktop) */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <BasicInfo template={template} />
              <MessageConfig template={template} />
              <CustomizationOptions template={template} />
              <AutomationSettings template={template} />
            </div>
            
            {/* Right Column */}
            <div className="space-y-4 sm:space-y-6">
              {/* Sur mobile, VariablesList peut être réduit ou caché initialement */}
              <div className="lg:block">
                <VariablesList />
              </div>
              <SharingSettings template={template} />
              <PreviewSection template={template} />
              <ValidationInfo template={template} />
            </div>
          </div>

          {/* Action Buttons - Fixed at bottom on mobile */}
          <div className="sticky bottom-0 bg-white pt-3 sm:pt-4 mt-4 sm:mt-6 border-t">
            <ActionButtons template={template} onSave={onSave} />
          </div>
        </div>
      </div>
    </div>
  );
}
