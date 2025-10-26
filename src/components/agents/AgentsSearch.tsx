import React, { useContext, useCallback, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { LanguageContext } from '../../context/LanguageContext';

export default function AgentsSearch() {
  const { t } = useContext(LanguageContext);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // TODO: Implement search logic or debounced API call
  }, []);

  const handleFilterClick = useCallback(() => {
    // TODO: Implement filter modal/dropdown
    console.log('Open filters');
  }, []);

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
      {/* Search Input */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5 pointer-events-none" />
        <input 
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder={t('agents.page.search.placeholder')}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:border-indigo-500 dark:focus:border-teal-500 transition-colors duration-200"
          aria-label={t('agents.page.search.placeholder')}
        />
      </div>

      {/* Filter Button */}
      <button 
        onClick={handleFilterClick}
        className="flex items-center justify-center sm:justify-start gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 shadow-sm whitespace-nowrap"
        aria-label={t('agents.page.search.filters')}
      >
        <Filter className="w-4 h-4" />
        <span>{t('agents.page.search.filters')}</span>
      </button>
    </div>
  );
}
