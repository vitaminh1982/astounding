import React, { useState, useCallback } from 'react';
import { Template } from '../../../../types/template';
import { X, Plus, Hash, User, Calendar, Tag as TagIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BasicInfoProps {
  template: Template;
  onChange?: (field: string, value: any) => void;
  readOnly?: boolean;
}

export default function BasicInfo({ template, onChange, readOnly = false }: BasicInfoProps) {
  const [tags, setTags] = useState(template.tags);
  const [newTag, setNewTag] = useState('');
  const [tagError, setTagError] = useState('');

  const addTag = useCallback(() => {
    const trimmedTag = newTag.trim().toLowerCase();
    
    // Validation
    if (!trimmedTag) {
      setTagError('Tag cannot be empty');
      return;
    }
    
    if (trimmedTag.length < 2) {
      setTagError('Tag must be at least 2 characters');
      return;
    }
    
    if (trimmedTag.length > 20) {
      setTagError('Tag must be less than 20 characters');
      return;
    }
    
    if (tags.includes(trimmedTag)) {
      setTagError('Tag already exists');
      return;
    }
    
    if (tags.length >= 10) {
      setTagError('Maximum 10 tags allowed');
      return;
    }

    const updatedTags = [...tags, trimmedTag];
    setTags(updatedTags);
    setNewTag('');
    setTagError('');
    onChange?.('tags', updatedTags);
  }, [newTag, tags, onChange]);

  const removeTag = useCallback((tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    onChange?.('tags', updatedTags);
  }, [tags, onChange]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Escape') {
      setNewTag('');
      setTagError('');
    }
  }, [addTag]);

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  };

  // Tag color variants
  const tagColors = [
    'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800',
    'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
  ];

  const getTagColor = (index: number) => tagColors[index % tagColors.length];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 rounded-lg">
          <Hash className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
            Basic Information
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Template metadata and identification
          </p>
        </div>
      </div>
      
      {/* Grid layout responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Identifier */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Hash className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            Identifier
          </label>
          <div className="relative">
            <input
              type="text"
              value={template.id || "TEMP_WELCOME_001"}
              readOnly
              className="w-full px-3 py-2 pl-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 transition-all cursor-not-allowed"
            />
            <div className="absolute inset-y-0 right-3 flex items-center">
              <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                #{template.id || "001"}
              </span>
            </div>
          </div>
        </div>

        {/* Created by */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <User className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            Created by
          </label>
          <div className="relative">
            <input
              type="text"
              value={template.createdBy || "Admin"}
              readOnly
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 transition-all cursor-not-allowed"
            />
            <div className="absolute inset-y-0 right-3 flex items-center">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <User className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Created date */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            Created on
          </label>
          <input
            type="text"
            value={formatDate(template.createdAt || new Date())}
            readOnly
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 transition-all cursor-not-allowed"
          />
        </div>

        {/* Last updated */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            Last updated
          </label>
          <input
            type="text"
            value={formatDate(template.updatedAt || new Date())}
            readOnly
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 transition-all cursor-not-allowed"
          />
        </div>
      </div>

      {/* Tags section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <TagIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            Tags
            <span className="text-xs text-gray-400 dark:text-gray-500">
              ({tags.length}/10)
            </span>
          </label>
          {!readOnly && tags.length > 0 && (
            <button
              onClick={() => {
                setTags([]);
                onChange?.('tags', []);
              }}
              className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Tags list with animations */}
        <div className="min-h-[60px] p-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg">
          {tags.length === 0 ? (
            <div className="flex items-center justify-center h-[44px] text-sm text-gray-400 dark:text-gray-500">
              <TagIcon className="w-4 h-4 mr-2" />
              No tags added yet
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <AnimatePresence mode="popLayout">
                {tags.map((tag, index) => (
                  <motion.span
                    key={tag}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${getTagColor(index)} transition-all hover:shadow-sm`}
                  >
                    <Hash className="w-3 h-3" />
                    {tag}
                    {!readOnly && (
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5 transition-colors group"
                        aria-label={`Remove ${tag} tag`}
                      >
                        <X className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                      </button>
                    )}
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Add new tag input */}
        {!readOnly && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Hash className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => {
                    setNewTag(e.target.value);
                    setTagError('');
                  }}
                  onKeyDown={handleKeyPress}
                  placeholder="Add a new tag..."
                  maxLength={20}
                  className={`w-full pl-9 pr-3 py-2 bg-white dark:bg-gray-800 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                    tagError
                      ? 'border-red-300 dark:border-red-700 focus:ring-red-500/20 dark:focus:ring-red-400/20'
                      : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20'
                  } text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500`}
                  disabled={tags.length >= 10}
                />
                {newTag && (
                  <div className="absolute inset-y-0 right-3 flex items-center">
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {newTag.length}/20
                    </span>
                  </div>
                )}
              </div>
              <motion.button
                onClick={addTag}
                disabled={!newTag.trim() || tags.length >= 10}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 text-white text-sm font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-indigo-600 disabled:hover:to-purple-600 shadow-sm hover:shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Tag</span>
              </motion.button>
            </div>

            {/* Error message */}
            <AnimatePresence>
              {tagError && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  {tagError}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Helper text */}
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <span>💡</span>
              Press Enter to add, Escape to clear. Max 10 tags, 2-20 characters each.
            </p>
          </div>
        )}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <p className="text-sm font-semibold text-green-700 dark:text-green-300">Active</p>
          </div>
        </div>
        
        <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">Version</p>
          <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">v{template.version || '1.0'}</p>
        </div>
        
        <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
          <p className="text-xs text-purple-600 dark:text-purple-400 font-medium mb-1">Uses</p>
          <p className="text-sm font-semibold text-purple-700 dark:text-purple-300">{template.usageCount || 0}</p>
        </div>
      </div>
    </div>
  );
}
