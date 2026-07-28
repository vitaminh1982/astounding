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
        <h3 className="font-semibold text-base sm:text-lg text-foreground dark:text-foreground">
          Basic Information
        </h3>
        {!isEditable && (
          <span className="text-xs text-muted-foreground dark:text-muted-foreground">
            (Read-only)
          </span>
        )}
      </div>
      
      {/* Grid layout responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-on-surface dark:text-muted-foreground mb-1">
            Identifier
            {errors.identifier && (
              <span className="text-destructive text-xs ml-2">{errors.identifier}</span>
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
                ? 'border-border dark:border-border bg-white dark:bg-surface-container-highest text-foreground dark:text-foreground focus:ring-2 focus:ring-ring dark:focus:ring-ring focus:border-transparent' 
                : 'border-border dark:border-border bg-surface-container-low dark:bg-surface-container-high text-muted-foreground dark:text-muted-foreground cursor-not-allowed'
              }
              ${errors.identifier ? 'border-red-300 dark:border-destructive' : ''}
            `}
          />
          {isEditable && (
            <p className="mt-1 text-xs text-muted-foreground dark:text-muted-foreground">
              {(editedTemplate.id || "TEMP_WELCOME_001").length}/{IDENTIFIER_MAX_LENGTH}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-on-surface dark:text-muted-foreground mb-1">
            Created by
          </label>
          <input
            type="text"
            value={editedTemplate.author || "Admin"}
            readOnly
            className="p-1.5 sm:p-2 block w-full rounded-md border-border dark:border-border bg-surface-container-low dark:bg-surface-container-high text-muted-foreground dark:text-muted-foreground text-sm cursor-not-allowed"
          />
        </div>
      </div>

      {/* Tags section */}
      <div>
        <label className="block text-xs sm:text-sm font-medium text-on-surface dark:text-muted-foreground mb-2">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4" />
            <span>Tags</span>
            <span className="text-xs text-muted-foreground dark:text-muted-foreground">
              ({editedTemplate.tags.length}/{MAX_TAGS})
            </span>
          </div>
          {errors.tag && (
            <span className="text-destructive text-xs ml-2 block mt-1">{errors.tag}</span>
          )}
        </label>

        <div className="space-y-2">
          {/* Tags list */}
          {editedTemplate.tags.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 sm:gap-2 p-2 rounded-md bg-surface-container-low dark:bg-surface-container-high border border-border dark:border-border">
              {editedTemplate.tags.map(tag => (
                <span 
                  key={tag} 
                  className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm bg-indigo-100 dark:bg-green-900 text-indigo-700 dark:text-green-100 transition-colors"
                >
                  {tag}
                  {isEditable && (
                    <button 
                      onClick={() => handleRemoveTag(tag)} 
                      className="hover:text-indigo-900 dark:hover:text-green-50 p-0.5 rounded-full hover:bg-indigo-200 dark:hover:bg-green-800 transition-colors focus:outline-none focus:ring-2 focus:ring-ring dark:focus:ring-ring"
                      aria-label={`Remove ${tag} tag`}
                    >
                      <X className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground dark:text-muted-foreground bg-surface-container-low dark:bg-surface-container-high border border-border dark:border-border rounded-md">
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
                    border-border dark:border-border 
                    bg-white dark:bg-surface-container-highest 
                    text-foreground dark:text-foreground 
                    placeholder-gray-400 dark:placeholder-gray-500
                    focus:ring-2 focus:ring-ring dark:focus:ring-ring 
                    focus:border-transparent
                    disabled:bg-surface-container-low dark:disabled:bg-surface-container-high 
                    disabled:cursor-not-allowed
                    disabled:text-outline dark:disabled:text-muted-foreground
                    ${errors.tag ? 'border-red-300 dark:border-destructive' : ''}
                  `}
                  aria-label="New tag input"
                />
                {newTag && (
                  <p className="mt-1 text-xs text-muted-foreground dark:text-muted-foreground">
                    {newTag.length}/{TAG_MAX_LENGTH}
                  </p>
                )}
              </div>
              <button
                onClick={handleAddTag}
                disabled={!newTag.trim() || editedTemplate.tags.length >= MAX_TAGS}
                className="inline-flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-md bg-primary dark:bg-green-600 text-white text-xs sm:text-sm hover:bg-indigo-700 dark:hover:bg-green-700 transition-colors disabled:bg-surface-container dark:disabled:bg-surface-container-highest disabled:cursor-not-allowed disabled:text-muted-foreground dark:disabled:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring dark:focus:ring-ring focus:ring-offset-2 dark:focus:ring-offset-gray-800"
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
        <p className="text-xs text-muted-foreground dark:text-muted-foreground italic">
          Press Enter or click "Add Tag" to add a new tag. Click the X icon to remove a tag.
        </p>
      )}
    </div>
  );
}
