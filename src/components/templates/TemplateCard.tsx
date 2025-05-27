import React, { useState } from 'react';
import { Star, Clock, BarChart2 } from 'lucide-react';
import { Template } from '../../types/template';
import TemplateEditor from './editor/TemplateEditor';

interface TemplateCardProps {
  template: Template;
  className?: string;
}

export default function TemplateCard({ template, className }: TemplateCardProps) {
  const [showEditor, setShowEditor] = useState(false);

  const handleSave = (updatedTemplate: Template) => {
    console.log('Template updated:', updatedTemplate);
    setShowEditor(false);
  };

  return (
    <>
      <div 
        className={`bg-white rounded-lg shadow p-3 sm:p-4 hover:shadow-md transition-shadow cursor-pointer ${className}`}
        onClick={() => setShowEditor(true)}
      >
        <div className="flex items-start sm:items-center justify-between mb-2 sm:mb-3">
          <h3 className="font-semibold text-sm sm:text-base line-clamp-2 flex-1 pr-2">
            {template.name}
          </h3>
          <button 
            className={`${template.favorite ? 'text-yellow-400' : 'text-gray-400'} flex-shrink-0`}
            onClick={(e) => {
              e.stopPropagation();
              // Handle favorite toggle
            }}
          >
            <Star className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
        
        <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2">
          {template.description}
        </p>
        
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
          {template.tags.map((tag, index) => (
            <span 
              key={index}
              className="bg-indigo-50 text-indigo-600 px-2 py-0.5 sm:py-1 rounded-full text-xs whitespace-nowrap"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="whitespace-nowrap">{template.lastModified}</span>
          </div>
          <div className="flex items-center gap-1">
            <BarChart2 className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="whitespace-nowrap">{template.usage} usages</span>
          </div>
        </div>
      </div>

      {showEditor && (
        <TemplateEditor
          template={template}
          onClose={() => setShowEditor(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
}
