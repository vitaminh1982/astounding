import React, { useState, useEffect } from 'react';
import { X, Plus, Tag } from 'lucide-react';
import { Template } from '../../../../types/template';

interface BasicInfoProps {
  template: Template;
  onUpdate?: (updates: Partial<Template>) => void;
  isEditable?: boolean;
}

export default function BasicInfo({ 
  template, 
  onUpdate,
  isEditable = true 
}: BasicInfoProps) {
  const [editedTemplate, setEditedTemplate] = useState<Template>(template);
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);
  
  // Character limits
  const IDENTIFIER_MAX_LENGTH = 50;
  const TAG_MAX_LENGTH = 30;
  const MAX_TAGS = 10;

  // Update isDirty when form changes
  useEffect(() => {
    if (JSON.stringify(editedTemplate) !== JSON.stringify(template)) {
      setIsDirty(true);
    }
  }, [editedTemplate, template]);

  // Notify parent component of changes
  useEffect(() => {
    if (isDirty && onUpdate) {
      onUpdate(editedTemplate);
    }
  }, [editedTemplate, isDirty, onUpdate]);

  // Handler for input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    setEditedTemplate(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handler for adding tags
  const handleAddTag = () => {
    const trimmedTag = newTag.trim();
    
    // Validation
    if (!trimmedTag) {
      setErrors(prev => ({ ...prev, tag: 'Tag cannot be empty' }));
      return;
    }
    
    if (trimmedTag.length > TAG_MAX_LENGTH) {
      setErrors(prev => ({ 
        ...prev, 
        tag: `Tag must be ${TAG_MAX_LENGTH} characters or less` 
      }));
      return;
    }
    
    if (editedTemplate.tags.includes(trimmedTag)) {
      setErrors(prev => ({ ...prev, tag: 'Tag already exists' }));
      return;
    }
    
    if (editedTemplate.tags.length >= MAX_TAGS) {
      setErrors(prev => ({ 
        ...prev, 
        tag: `Maximum ${MAX_TAGS} tags allowed` 
      }));
      return;
    }
    
    setEditedTemplate(prev => ({
      ...prev,
      tags: [...prev.tags, trimmedTag]
    }));
    
    setNewTag('');
    
    // Clear error
    if (errors.tag) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.tag;
        return newErrors;
      });
    }
  };

  // Handler for removing tags
  const handleRemoveTag = (tagToRemove: string) => {
    setEditedTemplate(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Handler for key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-gray-100">
          Basic Information
        </h3>
        {!isEditable && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            (Read-only)
          </span>
        )}
      </div>
      
      {/* Grid layout responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Identifier
            {errors.identifier && (
              <span className="text-red-500 text-xs ml-2">{errors.identifier}</span>
            )}
          </label>
          <input
            type="text"
            name="identifier"
            value={editedTemplate.id || "TEMP_WELCOME_001"}
            onChange={handleInputChange}
            readOnly={!isEditable}
            maxLength={IDENTIFIER_MAX_LENGTH}
            className={`p-1.5 sm:p-2 block w-full rounded-md text-sm transition-colors
              ${isEditable 
                ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:border-transparent' 
                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 cursor-not-allowed'
              }
              ${errors.identifier ? 'border-red-300 dark:border-red-500' : ''}
            `}
          />
          {isEditable && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {(editedTemplate.id || "TEMP_WELCOME_001").length}/{IDENTIFIER_MAX_LENGTH}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Created by
          </label>
          <input
            type="text"
            value={editedTemplate.author || "Admin"}
            readOnly
            className="p-1.5 sm:p-2 block w-full rounded-md border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm cursor-not-allowed"
          />
        </div>
      </div>

      {/* Tags section */}
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4" />
            <span>Tags</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({editedTemplate.tags.length}/{MAX_TAGS})
            </span>
          </div>
          {errors.tag && (
            <span className="text-red-500 text-xs ml-2 block mt-1">{errors.tag}</span>
          )}
        </label>

        <div className="space-y-2">
          {/* Tags list */}
          {editedTemplate.tags.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 sm:gap-2 p-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              {editedTemplate.tags.map(tag => (
                <span 
                  key={tag} 
                  className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm bg-indigo-100 dark:bg-teal-900 text-indigo-700 dark:text-teal-100 transition-colors"
                >
                  {tag}
                  {isEditable && (
                    <button 
                      onClick={() => handleRemoveTag(tag)} 
                      className="hover:text-indigo-900 dark:hover:text-teal-50 p-0.5 rounded-full hover:bg-indigo-200 dark:hover:bg-teal-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500"
                      aria-label={`Remove ${tag} tag`}
                    >
                      <X className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
              No tags added yet
            </div>
          )}

          {/* Add new tag input */}
          {isEditable && (
            <div className="flex flex-wrap sm:flex-nowrap items-start gap-2">
              <div className="flex-1 min-w-[150px]">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter tag name"
                  maxLength={TAG_MAX_LENGTH}
                  disabled={editedTemplate.tags.length >= MAX_TAGS}
                  className={`w-full px-2 sm:px-3 py-1.5 rounded-md text-sm transition-colors
                    border-gray-300 dark:border-gray-600 
                    bg-white dark:bg-gray-700 
                    text-gray-900 dark:text-gray-100 
                    placeholder-gray-400 dark:placeholder-gray-500
                    focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 
                    focus:border-transparent
                    disabled:bg-gray-100 dark:disabled:bg-gray-800 
                    disabled:cursor-not-allowed
                    disabled:text-gray-400 dark:disabled:text-gray-600
                    ${errors.tag ? 'border-red-300 dark:border-red-500' : ''}
                  `}
                  aria-label="New tag input"
                />
                {newTag && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {newTag.length}/{TAG_MAX_LENGTH}
                  </p>
                )}
              </div>
              <button
                onClick={handleAddTag}
                disabled={!newTag.trim() || editedTemplate.tags.length >= MAX_TAGS}
                className="inline-flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-md bg-indigo-600 dark:bg-teal-600 text-white text-xs sm:text-sm hover:bg-indigo-700 dark:hover:bg-teal-700 transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-500 dark:disabled:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                aria-label="Add tag"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Add Tag</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Help text */}
      {isEditable && (
        <p className="text-xs text-gray-500 dark:text-gray-400 italic">
          Press Enter or click "Add Tag" to add a new tag. Click the X icon to remove a tag.
        </p>
      )}
    </div>
  );
}
