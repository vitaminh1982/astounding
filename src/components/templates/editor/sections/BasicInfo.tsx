import React, { useState, useEffect } from 'react';
import { Template } from '../../../../types/template';
import { X, Plus, Hash, User, Calendar, Tag as TagIcon, AlertCircle, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BasicInfoProps {
  template: Template;
  onChange?: (updates: Partial<Template>) => void;
}

export default function BasicInfo({ template, onChange }: BasicInfoProps) {
  const [tags, setTags] = useState<string[]>(template.tags || []);
  const [newTag, setNewTag] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Track changes
  useEffect(() => {
    const hasChanged = JSON.stringify(tags) !== JSON.stringify(template.tags || []);
    setHasChanges(hasChanged);
  }, [tags, template.tags]);

  const validateTag = (tag: string): string | null => {
    const trimmedTag = tag.trim();
    
    if (!trimmedTag) return 'Tag cannot be empty';
    if (trimmedTag.length < 2) return 'Tag must be at least 2 characters';
    if (trimmedTag.length > 20) return 'Tag must be less than 20 characters';
    if (tags.includes(trimmedTag)) return 'Tag already exists';
    if (tags.length >= 10) return 'Maximum 10 tags allowed';
    if (!/^[a-zA-Z0-9-_\s]+$/.test(trimmedTag)) return 'Tag can only contain letters, numbers, spaces, hyphens, and underscores';
    
    return null;
  };

  const addTag = () => {
    const trimmedTag = newTag.trim();
    const validationError = validateTag(trimmedTag);
    
    if (validationError) {
      setError(validationError);
      return;
    }

    const updatedTags = [...tags, trimmedTag];
    setTags(updatedTags);
    setNewTag('');
    setError(null);
    onChange?.({ tags: updatedTags });
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    onChange?.({ tags: updatedTags });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTag(e.target.value);
    if (error) setError(null);
  };

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getTagColor = (index: number) => {
    const colors = [
      'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800',
      'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300 border-pink-200 dark:border-pink-800',
      'bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-teal-900/30 border border-blue-200 dark:border-teal-800 rounded-lg transition-colors">
            <TagIcon className="w-5 h-5 text-blue-600 dark:text-teal-400 transition-colors" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 transition-colors">
              Basic Information
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">
              Template metadata and identification
            </p>
          </div>
        </div>
        
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-xs rounded-full border border-amber-200 dark:border-amber-800 transition-colors"
          >
            Unsaved changes
          </motion.div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-6 shadow-sm dark:shadow-gray-900 transition-colors">
        {/* Read-only Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Template ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2 transition-colors">
              <Hash className="w-4 h-4" />
              Template Identifier
            </label>
            <div className="relative">
              <input
                type="text"
                value={template.id || "TEMP_WELCOME_001"}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 font-mono text-sm shadow-sm dark:shadow-gray-900 transition-colors cursor-not-allowed"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Check className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 transition-colors">
              Unique identifier for this template
            </p>
          </div>

          {/* Created By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2 transition-colors">
              <User className="w-4 h-4" />
              Created By
            </label>
            <div className="relative">
              <input
                type="text"
                value={template.createdBy || "Admin"}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 text-sm shadow-sm dark:shadow-gray-900 transition-colors cursor-not-allowed"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Check className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 transition-colors">
              Template creator
            </p>
          </div>

          {/* Creation Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2 transition-colors">
              <Calendar className="w-4 h-4" />
              Created On
            </label>
            <div className="relative">
              <input
                type="text"
                value={formatDate(template.createdAt || new Date().toISOString())}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 text-sm shadow-sm dark:shadow-gray-900 transition-colors cursor-not-allowed"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Check className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 transition-colors">
              Template creation date
            </p>
          </div>

          {/* Last Modified */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2 transition-colors">
              <Calendar className="w-4 h-4" />
              Last Modified
            </label>
            <div className="relative">
              <input
                type="text"
                value={formatDate(template.updatedAt || new Date().toISOString())}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 text-sm shadow-sm dark:shadow-gray-900 transition-colors cursor-not-allowed"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Check className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 transition-colors">
              Last modification date
            </p>
          </div>
        </div>

        {/* Tags Section */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 transition-colors">
              <TagIcon className="w-4 h-4" />
              Tags ({tags.length}/10)
            </label>
            {tags.length > 0 && (
              <button
                onClick={() => {
                  setTags([]);
                  onChange?.({ tags: [] });
                }}
                className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Tags Display */}
          {tags.length > 0 ? (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                  {tags.map((tag, index) => (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${getTagColor(index)}`}
                    >
                      <Hash className="w-3 h-3" />
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5 transition-colors"
                        aria-label={`Remove ${tag} tag`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-center transition-colors">
              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">
                No tags added yet. Add tags to organize and categorize this template.
              </p>
            </div>
          )}

          {/* Add Tag Input */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  value={newTag}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter tag name (e.g., welcome, onboarding)"
                  disabled={tags.length >= 10}
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 shadow-sm dark:shadow-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed ${
                    error
                      ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500 dark:focus:ring-red-400'
                      : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-teal-500 focus:ring-indigo-500 dark:focus:ring-teal-500'
                  }`}
                  maxLength={20}
                />
              </div>
              <button
                onClick={addTag}
                disabled={!newTag.trim() || tags.length >= 10}
                className="px-4 py-2 bg-indigo-600 dark:bg-teal-600 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shadow-sm dark:shadow-gray-900 hover:shadow-md dark:hover:shadow-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 font-medium"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add</span>
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-700 dark:text-red-300 flex items-center gap-2 transition-colors"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Helper Text */}
            <div className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400 transition-colors">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-500" />
              </div>
              <div className="space-y-1">
                <p>{newTag.length}/20 characters</p>
                <p>Press Enter to add tag quickly</p>
                <p>Tags help organize and search templates</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-center shadow-sm dark:shadow-gray-900 transition-colors">
          <div className="p-2 bg-blue-100 dark:bg-teal-900/30 rounded-lg inline-flex mb-2 transition-colors">
            <Hash className="w-4 h-4 text-blue-600 dark:text-teal-400 transition-colors" />
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors">
            {template.id?.split('_').pop() || '001'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
            Template #
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-center shadow-sm dark:shadow-gray-900 transition-colors">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg inline-flex mb-2 transition-colors">
            <TagIcon className="w-4 h-4 text-green-600 dark:text-green-400 transition-colors" />
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors">
            {tags.length}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
            Active Tags
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-center shadow-sm dark:shadow-gray-900 transition-colors">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg inline-flex mb-2 transition-colors">
            <User className="w-4 h-4 text-purple-600 dark:text-purple-400 transition-colors" />
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors truncate">
            {template.createdBy || 'Admin'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
            Created By
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-center shadow-sm dark:shadow-gray-900 transition-colors">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg inline-flex mb-2 transition-colors">
            <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400 transition-colors" />
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors">
            {Math.ceil((Date.now() - new Date(template.createdAt || Date.now()).getTime()) / (1000 * 60 * 60 * 24))}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
            Days Old
          </p>
        </div>
      </div>
    </div>
  );
}
