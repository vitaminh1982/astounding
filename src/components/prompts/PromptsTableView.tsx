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
      ? <ChevronUp className="w-4 h-4 inline-block ml-1" /> 
      : <ChevronDown className="w-4 h-4 inline-block ml-1" />;
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
      <div className="text-center py-16 px-6">
        <div className="mx-auto flex flex-col items-center">
          <svg className="h-12 w-12 text-gray-400 mb-4\" fill="none\" viewBox="0 0 24 24\" stroke="currentColor">
            <path strokeLinecap="round\" strokeLinejoin="round\" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-800">
            No Prompts Found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search query or filters to find what you're looking for.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('title')}
              >
                <div className="flex items-center">
                  Title {getSortIcon('title')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('category')}
              >
                <div className="flex items-center">
                  Category {getSortIcon('category')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
              >
                Preview
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hidden lg:table-cell"
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
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedPrompts.map((prompt, index) => (
              <tr 
                key={prompt.id} 
                className={`${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } ${
                  selectedPromptId === prompt.id ? 'bg-indigo-50' : ''
                } hover:bg-gray-100 cursor-pointer transition-colors`}
                onClick={() => handleRowClick(prompt.id)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {prompt.isFavorite && (
                      <Star className="h-4 w-4 text-yellow-500 mr-2 fill-current" />
                    )}
                    <div className="text-sm font-medium text-gray-900">
                      {prompt.title}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                    {prompt.category.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <div className="text-sm text-gray-500 max-w-xs">
                    {truncateText(prompt.content, 50)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
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
                        className="text-indigo-600 hover:text-indigo-900"
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
                        className="text-blue-600 hover:text-blue-900"
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
                          prompt.isFavorite ? 'text-yellow-500' : 'text-gray-400'
                        } hover:text-yellow-600`}
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
                        className="text-red-600 hover:text-red-900"
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