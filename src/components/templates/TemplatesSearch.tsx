import React, { useContext } from 'react';
import { Search, Filter } from 'lucide-react';
import { LanguageContext } from '../../context/LanguageContext';

export default function TemplatesSearch() {
  const { t } = useContext(LanguageContext);

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 sm:mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-outline dark:text-muted-foreground w-4 sm:w-5 h-4 sm:h-5" />
        <input 
          type="text"
          placeholder={t('templates.search.placeholder')}
          className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border border-border dark:border-border rounded-lg focus:ring-2 focus:ring-ring dark:focus:ring-ring focus:border-primary-green dark:focus:border-green-500 bg-white dark:bg-surface-container-highest text-foreground dark:text-foreground placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
        />
      </div>
      <button className="flex items-center justify-center gap-2 px-4 py-2 border border-border dark:border-border rounded-lg bg-white dark:bg-surface-container-highest hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors text-sm sm:text-base text-on-surface dark:text-muted-foreground shadow-sm dark:shadow-gray-900">
        <Filter className="w-4 h-4" />
        <span className="whitespace-nowrap">{t('templates.search.filters')}</span>
      </button>
    </div>
  );
}
