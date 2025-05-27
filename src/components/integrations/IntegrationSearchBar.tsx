import React from 'react';
import { Search } from 'lucide-react';
import { useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';

interface IntegrationSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function IntegrationSearchBar({ searchQuery, setSearchQuery }: IntegrationSearchBarProps) {
  const { t } = useContext(LanguageContext);

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md 
                  shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 
                  focus:border-blue-500 sm:text-sm"
        placeholder={t('integrations.searchPlaceholder')}
        aria-label={t('integrations.aria.searchTools')}
      />
    </div>
  );
}
