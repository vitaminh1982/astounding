import React from 'react';
import { Template } from '../../../../types/template';
import { Save, Send, Copy, Power, Trash2, MoreVertical } from 'lucide-react';
import { useState } from 'react';

interface ActionButtonsProps {
  template: Template;
  onSave: (template: Template) => void;
}

export default function ActionButtons({ template, onSave }: ActionButtonsProps) {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="relative">
      {/* Version Desktop */}
      <div className="hidden sm:flex justify-end gap-2 sm:gap-3 pt-4 sm:pt-6 border-t">
        <button
          onClick={() => onSave(template)}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Save className="w-4 h-4" />
          Save
        </button>
        
        <button className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
          <Send className="w-4 h-4" />
          Publish
        </button>
        
        <button className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors">
          <Copy className="w-4 h-4" />
          Duplicate
        </button>
        
        <button className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-amber-100 text-amber-700 text-sm rounded-lg hover:bg-amber-200 transition-colors">
          <Power className="w-4 h-4" />
          Deactivate
        </button>
        
        <button className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-red-100 text-red-700 text-sm rounded-lg hover:bg-red-200 transition-colors">
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>

      {/* Version Mobile */}
      <div className="sm:hidden flex justify-between gap-2 pt-4 border-t">
        <div className="flex gap-2">
          <button
            onClick={() => onSave(template)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
          >
            <Save className="w-4 h-4" />
            <span className="sr-only sm:not-sr-only">Save</span>
          </button>
          
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
            <Send className="w-4 h-4" />
            <span className="sr-only sm:not-sr-only">Publish</span>
          </button>
        </div>

        {/* Menu déroulant pour les actions secondaires */}
        <div className="relative">
          <button
            onClick={() => setShowMore(!showMore)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMore && (
            <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                <Copy className="w-4 h-4" />
                Duplicate
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-amber-700 hover:bg-amber-50">
                <Power className="w-4 h-4" />
                Deactivate
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-700 hover:bg-red-50">
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
