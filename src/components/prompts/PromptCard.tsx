import React, { useState } from 'react';
import { PlayCircle, Pencil, Trash2, Star } from 'lucide-react';
import { LanguageContext } from '../../context/LanguageContext';
import { Prompt } from '../../types/prompt';
import { useContext } from 'react';

interface PromptCardProps {
  prompt: Prompt;
  onUsePrompt?: (promptId: string) => void;
  onEditPrompt?: (promptId: string) => void;
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
  const [isHovered, setIsHovered] = useState(false);

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
    if (onEditPrompt) {
      onEditPrompt(prompt.id);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDeletePrompt) {
      onDeletePrompt(prompt.id);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(prompt.id, !prompt.isFavorite);
    }
  };

  return (
    <article
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        bg-white dark:bg-gray-800 border rounded-xl shadow-sm dark:shadow-gray-900 overflow-hidden flex flex-col
        transition-all duration-200 ease-in-out
        ${isSelected 
          ? 'border-indigo-500 dark:border-teal-500 ring-2 ring-indigo-500 dark:ring-teal-500' 
          : 'border-gray-200 dark:border-gray-600'
        }
        ${isHovered ? 'shadow-md dark:shadow-gray-800 transform scale-[1.01]' : ''}
        ${className}
        h-[220px]
      `}
      aria-labelledby={`prompt-title-${prompt.id}`}
    >
      {/* Category badge */}
      <div className="bg-indigo-50 dark:bg-teal-900/20 px-4 py-1.5 border-b border-indigo-100 dark:border-teal-700 flex justify-between items-center transition-colors">
        <span className="text-xs font-semibold text-indigo-700 dark:text-teal-300 uppercase tracking-wider">
          {prompt.category.replace('_', ' ')}
        </span>
        
        {/* Favorite button - moved to header */}
        {onToggleFavorite && (
          <button
            onClick={handleFavoriteClick}
            className={`p-1 rounded-full transition-colors ${
              prompt.isFavorite 
                ? 'text-yellow-500 dark:text-yellow-400' 
                : 'text-gray-400 dark:text-gray-500 hover:text-yellow-400 dark:hover:text-yellow-400'
            }`}
            aria-label={prompt.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star className={`h-4 w-4 ${prompt.isFavorite ? 'fill-current' : ''}`} />
          </button>
        )}
      </div>
      
      {/* Main Content Area */}
      <div className="p-4 flex-grow flex flex-col">
        {/* Usage Count Badge */}
        <div className="inline-block px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-300 mb-2 self-start transition-colors">
          {`Used ${prompt.usageCount} times`}
        </div>

        {/* Prompt Title */}
        <h3
          id={`prompt-title-${prompt.id}`}
          className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 transition-colors"
          title={prompt.title}
        >
          {prompt.title}
        </h3>

        {/* Prompt Description - Truncated */}
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2 transition-colors" title={prompt.description}>
          {prompt.description || 'No description provided.'}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {prompt.tags && prompt.tags.slice(0, 2).map((tag, index) => (
            <span 
              key={index} 
              className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-300 transition-colors"
            >
              {tag}
            </span>
          ))}
          {prompt.tags && prompt.tags.length > 2 && (
            <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-300 transition-colors">
              +{prompt.tags.length - 2}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons Footer */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600 flex justify-end items-center transition-colors">
        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          {/* Use Prompt Button */}
          {onUsePrompt && (
            <button
              onClick={handleUseClick}
              className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 dark:bg-teal-600 text-white text-sm rounded-md hover:bg-indigo-700 dark:hover:bg-teal-700 transition-colors shadow-sm dark:shadow-gray-900"
              title="Use Prompt"
            >
              <PlayCircle className="h-4 w-4" />
              <span>Use</span>
            </button>
          )}

          {/* Edit Button */}
          {onEditPrompt && (
            <button
              onClick={handleEditClick}
              className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors"
              title="Edit Prompt"
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}

          {/* Delete Button */}
          {onDeletePrompt && (
            <button
              onClick={handleDeleteClick}
              className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
              title="Delete Prompt"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
