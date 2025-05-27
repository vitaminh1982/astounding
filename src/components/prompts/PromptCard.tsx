// src/components/cards/PromptCard.tsx

import React, { useContext } from 'react';
import { PlayCircle, Pencil, Trash2, Star } from 'lucide-react';
import { LanguageContext } from '../../context/LanguageContext';
import { Prompt } from '../../types/prompt';

interface PromptCardProps {
  prompt: Prompt;
  onUsePrompt?: (promptId: string) => void;
  onEditPrompt?: (promptId: string) => void;
  onDeletePrompt?: (promptId: string) => void;
  onToggleFavorite?: (promptId: string, isFavorite: boolean) => void;
  className?: string;
}

export default function PromptCard({
  prompt,
  onUsePrompt,
  onEditPrompt,
  onDeletePrompt,
  onToggleFavorite,
  className = ''
}: PromptCardProps) {
  const { t } = useContext(LanguageContext);

  const handleUseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUsePrompt) {
      onUsePrompt(prompt.id);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEditPrompt) {
      onEditPrompt(prompt.id);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeletePrompt) {
      onDeletePrompt(prompt.id);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(prompt.id, !prompt.isFavorite);
    }
  };

  return (
    <article
      className={`bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-200 ease-in-out ${className} relative`}
      aria-labelledby={`prompt-title-${prompt.id}`}
    >
      {/* Category label at top */}
      <div className="bg-indigo-50 px-4 py-1.5 border-b border-indigo-100">
        <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">
          {prompt.category}
        </span>
      </div>
      
      {/* Main Content Area */}
      <div className="p-4 flex-grow">
        {/* Favorite Star - Repositioned */}
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

        {/* Prompt Description */}
        <p
          className="text-sm text-gray-600 mb-3"
          title={prompt.description}
        >
          {prompt.description || 'No description provided.'}
        </p>
        
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
