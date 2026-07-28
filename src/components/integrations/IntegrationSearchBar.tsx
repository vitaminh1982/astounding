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
        <Search className="h-5 w-5 text-outline dark:text-muted-foreground" />
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="block w-full pl-10 pr-3 py-2 border border-border dark:border-border rounded-md 
                  shadow-sm dark:shadow-gray-900 placeholder-gray-400 dark:placeholder-gray-500 
                  bg-white dark:bg-surface-container-highest text-foreground dark:text-foreground
                  focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-ring 
                  focus:border-tertiary dark:focus:border-green-500 sm:text-sm transition-colors"
        placeholder={t('integrations.searchPlaceholder')}
        aria-label={t('integrations.aria.searchTools')}
      />
    </div>
  );
}
