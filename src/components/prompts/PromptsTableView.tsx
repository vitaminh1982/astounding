import React, { useState } from 'react';
import { Prompt } from '../../types/prompt';
import { PlayCircle, Pencil, Trash2, Star, ChevronUp, ChevronDown } from 'lucide-react';

interface PromptsTableViewProps {
  prompts: Prompt[];
  onUsePrompt?: (promptId: string) => void;
  onEditPrompt?: (promptId: string) => void;
  onDeletePrompt?: (promptId: string) => void;
  onToggleFavorite?: (promptId: string, isFavorite: boolean) => void;
  selectedPromptId?: string | null;
  onSelect?: (promptId: string) => void;
}

export default function PromptsTableView({
  prompts,
  onUsePrompt,
  onEditPrompt,
  onDeletePrompt,
  onToggleFavorite,
  selectedPromptId,
  onSelect
}: PromptsTableViewProps) {
  const [sortField, setSortField] = useState<keyof Prompt>('title');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Function to handle sorting
  const handleSort = (field: keyof Prompt) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Sort prompts based on current sort field and direction
  const sortedPrompts = [...prompts].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    // Handle special cases for sorting
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  
  // Function to get sort icon
  const getSortIcon = (field: keyof Prompt) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' 
      ? <ChevronUp className="w-4 h-4 inline-block ml-1 text-gray-500 dark:text-gray-400 transition-colors" /> 
      : <ChevronDown className="w-4 h-4 inline-block ml-1 text-gray-500 dark:text-gray-400 transition-colors" />;
  };
  
  // Function to truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  // Function to handle row click
  const handleRowClick = (promptId: string) => {
    if (onSelect) {
      onSelect(promptId);
    }
  };

  if (prompts.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900 transition-colors">
        <div className="mx-auto flex flex-col items-center">
          <svg className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 transition-colors">
            No Prompts Found
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 transition-colors">
            Try adjusting your search query or filters to find what you're looking for.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900 overflow-hidden transition-colors">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600 transition-colors">
          <thead className="bg-gray-50 dark:bg-gray-700 transition-colors">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-100 transition-colors"
                onClick={() => handleSort('title')}
              >
                <div className="flex items-center">
                  Title {getSortIcon('title')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-100 transition-colors"
                onClick={() => handleSort('category')}
              >
                <div className="flex items-center">
                  Category {getSortIcon('category')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell transition-colors"
              >
                Preview
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hidden lg:table-cell hover:text-gray-700 dark:hover:text-gray-100 transition-colors"
                onClick={() => handleSort('usageCount')}
              >
                <div className="flex items-center">
                  Usage {getSortIcon('usageCount')}
                </div>
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600 transition-colors">
            {sortedPrompts.map((prompt, index) => (
              <tr 
                key={prompt.id} 
                className={`${
                  index % 2 === 0 
                    ? 'bg-white dark:bg-gray-800' 
                    : 'bg-gray-50 dark:bg-gray-700'
                } ${
                  selectedPromptId === prompt.id 
                    ? 'bg-teal-50 dark:bg-teal-900/30' 
                    : ''
                } hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors`}
                onClick={() => handleRowClick(prompt.id)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {prompt.isFavorite && (
                      <Star className="h-4 w-4 text-yellow-500 dark:text-yellow-400 mr-2 fill-current transition-colors" />
                    )}
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors">
                      {prompt.title}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 transition-colors">
                    {prompt.category.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs transition-colors">
                    {truncateText(prompt.content, 50)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell transition-colors">
                  {prompt.usageCount} times
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    {onUsePrompt && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUsePrompt(prompt.id);
                        }}
                        className="text-teal-600 dark:text-teal-400 hover:text-teal-900 dark:hover:text-teal-300 transition-colors"
                        title="Use Prompt"
                      >
                        <PlayCircle className="h-5 w-5" />
                      </button>
                    )}
                    {onEditPrompt && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditPrompt(prompt.id);
                        }}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors"
                        title="Edit Prompt"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                    )}
                    {onToggleFavorite && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(prompt.id, !prompt.isFavorite);
                        }}
                        className={`${
                          prompt.isFavorite 
                            ? 'text-yellow-500 dark:text-yellow-400' 
                            : 'text-gray-400 dark:text-gray-500'
                        } hover:text-yellow-600 dark:hover:text-yellow-300 transition-colors`}
                        title={prompt.isFavorite ? "Remove from favorites" : "Add to favorites"}
                      >
                        <Star className={`h-5 w-5 ${prompt.isFavorite ? 'fill-current' : ''}`} />
                      </button>
                    )}
                    {onDeletePrompt && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeletePrompt(prompt.id);
                        }}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors"
                        title="Delete Prompt"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
