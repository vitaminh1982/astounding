import React, { useState } from 'react';
import { PlayCircle, Pencil, Trash2, Star, Copy, X, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { LanguageContext } from '../../context/LanguageContext';
import { Prompt } from '../../types/prompt';
import { useContext } from 'react';
import { toast } from 'react-hot-toast';

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
  const [isExpanded, setIsExpanded] = useState(false);
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

  const handleCopyContent = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(prompt.content);
    toast.success('Prompt copied to clipboard');
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
      className={`bg-white border ${isSelected ? 'border-indigo-500' : 'border-gray-200'} rounded-xl shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-200 ease-in-out ${className} relative ${isSelected ? 'ring-2 ring-indigo-500' : ''} max-w-[300px]`}
      aria-labelledby={`prompt-title-${prompt.id}`}
    >
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
    </article>
  );
}