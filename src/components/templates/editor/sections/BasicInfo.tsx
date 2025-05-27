import React, { useState } from 'react';
import { Template } from '../../../../types/template';
import { X, Plus } from 'lucide-react';

interface BasicInfoProps {
  template: Template;
}

export default function BasicInfo({ template }: BasicInfoProps) {
  const [tags, setTags] = useState(template.tags);
  const [newTag, setNewTag] = useState('');

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <h3 className="font-semibold text-base sm:text-lg">Basic Informations</h3>
      
      {/* Grid layout responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Identifier
          </label>
          <input
            type="text"
            value="TEMP_WELCOME_001"
            readOnly
            className="p-1.5 sm:p-2 block w-full rounded-md border-gray-300 bg-gray-50 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Created by
          </label>
          <input
            type="text"
            value="Admin"
            readOnly
            className="p-1.5 sm:p-2 block w-full rounded-md border-gray-300 bg-gray-50 text-sm"
          />
        </div>
      </div>

      {/* Tags section */}
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <div className="space-y-2">
          {/* Tags list */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {tags.map(tag => (
              <span 
                key={tag} 
                className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm bg-indigo-100 text-indigo-700"
              >
                {tag}
                <button 
                  onClick={() => removeTag(tag)} 
                  className="hover:text-indigo-900 p-0.5"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </span>
            ))}
          </div>

          {/* Add new tag input */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="New tag"
              className="flex-1 min-w-[150px] px-2 sm:px-3 py-1 rounded-md border-gray-300 text-sm"
            />
            <button
              onClick={addTag}
              className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-md bg-indigo-600 text-white text-xs sm:text-sm hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
