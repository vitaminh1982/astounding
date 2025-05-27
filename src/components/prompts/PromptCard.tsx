import React, { useState } from 'react';
import { PlayCircle, Pencil, Trash2, Star, Copy, X, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { LanguageContext } from '../../context/LanguageContext';
import { Prompt } from '../../types/prompt';
import { useContext } from 'react';
import { toast } from 'react-hot-toast';

interface PromptCardProps {
  prompt: Prompt;
  onUsePrompt?: (promptId: string) => void;
  onEditPrompt?: (updatedPrompt: Prompt) => void;
  onDeletePrompt?: (promptId: string) => void;
  onToggleFavorite?: (promptId: string, isFavorite: boolean) => void;
  className?: string;
  isSelected?: boolean;
  onSelect?: (promptId: string) => void;
}

export default function PromptCard({
  prompt,
  onUsePrompt,
  onEditPrompt,
  onDeletePrompt,
  onToggleFavorite,
  className = '',
  isSelected = false,
  onSelect
}: PromptCardProps) {
  const { t } = useContext(LanguageContext);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState<Prompt>({ ...prompt });
  const [isContentExpanded, setIsContentExpanded] = useState(false);

  // Function to handle card selection
  const handleCardClick = (e: React.MouseEvent) => {
    // Only select if not clicking on an action button
    if (
      !e.defaultPrevented && 
      onSelect && 
      !(e.target as HTMLElement).closest('button')
    ) {
      onSelect(prompt.id);
    }
  };

  const handleUseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onUsePrompt) {
      onUsePrompt(prompt.id);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(prompt.id, !prompt.isFavorite);
    }
  };

  const handleCopyContent = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(prompt.content);
    toast.success('Prompt copied to clipboard');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onEditPrompt) {
      onEditPrompt(editedPrompt);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedPrompt({ ...prompt });
    setIsEditing(false);
  };

  const handleConfirmDelete = () => {
    if (onDeletePrompt) {
      onDeletePrompt(prompt.id);
    }
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedPrompt(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsArray = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
    setEditedPrompt(prev => ({
      ...prev,
      tags: tagsArray
    }));
  };

  // Determine if description should be truncated
  const shouldTruncateDescription = prompt.description.length > 100 && !isExpanded;
  const truncatedDescription = shouldTruncateDescription
    ? `${prompt.description.substring(0, 100)}...`
    : prompt.description;

  // Determine if content should be truncated
  const shouldTruncateContent = prompt.content.length > 200 && !isContentExpanded;
  const truncatedContent = shouldTruncateContent
    ? `${prompt.content.substring(0, 200)}...`
    : prompt.content;

  return (
    <article
      onClick={handleCardClick}
      className={`bg-white border ${isSelected ? 'border-indigo-500' : 'border-gray-200'} rounded-xl shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-200 ease-in-out ${className} relative ${isSelected ? 'ring-2 ring-indigo-500' : ''}`}
      aria-labelledby={`prompt-title-${prompt.id}`}
    >
      {isEditing ? (
        // Edit Mode
        <form onSubmit={handleSaveEdit} className="p-4 space-y-4">
          <div>
            <label htmlFor={`title-${prompt.id}`} className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              id={`title-${prompt.id}`}
              name="title"
              type="text"
              value={editedPrompt.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          
          <div>
            <label htmlFor={`description-${prompt.id}`} className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id={`description-${prompt.id}`}
              name="description"
              value={editedPrompt.description}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor={`content-${prompt.id}`} className="block text-sm font-medium text-gray-700 mb-1">
              Prompt Content
            </label>
            <textarea
              id={`content-${prompt.id}`}
              name="content"
              value={editedPrompt.content}
              onChange={handleInputChange}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono"
              required
            />
          </div>
          
          <div>
            <label htmlFor={`category-${prompt.id}`} className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id={`category-${prompt.id}`}
              name="category"
              value={editedPrompt.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="marketing">Marketing</option>
              <option value="content_creation">Content Creation</option>
              <option value="development">Development</option>
              <option value="support">Support</option>
              <option value="hr">HR</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          
          <div>
            <label htmlFor={`tags-${prompt.id}`} className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma separated)
            </label>
            <input
              id={`tags-${prompt.id}`}
              name="tags"
              type="text"
              value={editedPrompt.tags.join(', ')}
              onChange={handleTagsChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-3">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Save
            </button>
          </div>
        </form>
      ) : (
        // View Mode
        <>
          {/* Category label at top */}
          <div className="bg-indigo-50 px-4 py-1.5 border-b border-indigo-100">
            <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">
              {prompt.category.replace('_', ' ')}
            </span>
          </div>
          
          {/* Main Content Area */}
          <div className="p-4 flex-grow">
            {/* Favorite Star */}
            {onToggleFavorite && (
              <button
                onClick={handleFavoriteClick}
                className={`absolute top-3 right-4 p-1.5 rounded-full hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${prompt.isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-400'}`}
                aria-label={prompt.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Star className={`h-5 w-5 ${prompt.isFavorite ? 'fill-current' : ''}`} />
              </button>
            )}

            {/* Usage Count Badge */}
            <div className="inline-block px-2 py-1 rounded-full bg-gray-100 text-xs text-gray-600 mb-2">
              {`Used ${prompt.usageCount} times`}
            </div>

            {/* Prompt Title */}
            <h3
              id={`prompt-title-${prompt.id}`}
              className="text-lg font-semibold text-gray-900 mb-2 pr-8"
              title={prompt.title}
            >
              {prompt.title}
            </h3>

            {/* Prompt Description with expand/collapse */}
            <div className="mb-3">
              <p className="text-sm text-gray-600" title={prompt.description}>
                {truncatedDescription}
              </p>
              {prompt.description.length > 100 && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                  }}
                  className="text-xs text-indigo-600 hover:text-indigo-800 mt-1 flex items-center"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-3 h-3 mr-1" />
                      Show less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3 h-3 mr-1" />
                      Show more
                    </>
                  )}
                </button>
              )}
            </div>
            
            {/* Prompt Content Preview */}
            <div className="mb-3 bg-gray-50 p-3 rounded-md">
              <div className="flex justify-between items-center mb-1">
                <h4 className="text-xs font-medium text-gray-700">Prompt Content</h4>
                <button
                  onClick={handleCopyContent}
                  className="text-xs text-indigo-600 hover:text-indigo-800 p-1"
                  title="Copy prompt content"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
              <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono">
                {truncatedContent}
              </pre>
              {prompt.content.length > 200 && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsContentExpanded(!isContentExpanded);
                  }}
                  className="text-xs text-indigo-600 hover:text-indigo-800 mt-1 flex items-center"
                >
                  {isContentExpanded ? (
                    <>
                      <ChevronUp className="w-3 h-3 mr-1" />
                      Show less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3 h-3 mr-1" />
                      Show more
                    </>
                  )}
                </button>
              )}
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {prompt.tags && prompt.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="px-2 py-1 rounded-md bg-gray-100 text-xs text-gray-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons Footer */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-end items-center">
            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              {/* Use Prompt Button */}
              {onUsePrompt && (
                <button
                  onClick={handleUseClick}
                  className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 transition-colors"
                  title="Use Prompt"
                >
                  <PlayCircle className="h-4 w-4 inline mr-1" />
                  Use
                </button>
              )}

              {/* Edit Button */}
              {onEditPrompt && (
                <button
                  onClick={handleEditClick}
                  className="p-1.5 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  title="Edit Prompt"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              )}

              {/* Delete Button */}
              {onDeletePrompt && (
                <button
                  onClick={handleDeleteClick}
                  className="p-1.5 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400"
                  title="Delete Prompt"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Delete Confirmation Dialog */}
          {showDeleteConfirm && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 p-4">
              <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 max-w-xs">
                <h4 className="font-medium text-gray-900 mb-2">Delete Prompt</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Are you sure you want to delete this prompt? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={handleCancelDelete}
                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="px-3 py-1.5 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </article>
  );
}