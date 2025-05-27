// src/components/prompts/PromptsSearch.tsx

import React, { useContext } from 'react';
import { Search, Filter } from 'lucide-react';
import { LanguageContext } from '../../context/LanguageContext';

interface PromptsSearchProps {
  /** The current value of the search input */
  searchQuery: string;
  /** Callback function triggered when the search input value changes */
  onSearchChange: (query: string) => void;
  /** Callback function triggered when the Filters button is clicked */
  onFiltersClick: () => void;
   /** Optional additional CSS classes for the container */
  className?: string;
}

export default function PromptsSearch({
  searchQuery,
  onSearchChange,
  onFiltersClick,
  className = ''
}: PromptsSearchProps) {
  const { t } = useContext(LanguageContext);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  return (
    // Flex container to hold search input and filter button
    <div className={`flex items-center gap-4 mb-6 ${className}`}>

      {/* Search Input Group */}
      <div className="relative flex-grow">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        {/* Input Field */}
        <input
          type="text"
          name="prompt-search"
          id="prompt-search"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder={t('prompts.search.placeholder', 'Search for a prompt...')} // Translation key
          value={searchQuery}
          onChange={handleInputChange}
          aria-label={t('prompts.search.ariaLabel', 'Search Prompts')} // Accessibility label
        />
      </div>

      {/* Filter Button */}
      <button
        type="button"
        onClick={onFiltersClick}
        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <Filter className="h-5 w-5 mr-2 text-gray-400" aria-hidden="true" />
        {t('prompts.search.filtersButton', 'Filters')} {/* Translation key */}
      </button>

    </div>
  );
}