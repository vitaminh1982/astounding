import React, { useContext } from 'react';
import { Search, Filter, Tags } from 'lucide-react';
import { LanguageContext } from '../../context/LanguageContext';


export default function ClientsFilters() {
  const { t } = useContext(LanguageContext);

  return (
    <div className="mb-6 space-y-4">
      {/* Première ligne : Recherche et boutons */}
      <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
        {/* Barre de recherche */}
        <div className="w-full sm:w-1/2 xl:w-1/3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-outline dark:text-muted-foreground w-5 h-5 transition-colors" />
            <input 
              type="text"
              placeholder={t('clients.search.placeholder')}
              className="w-full pl-10 pr-4 py-2 border border-border dark:border-border rounded-lg bg-white dark:bg-surface-container-highest text-foreground dark:text-foreground placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 focus:border-green-600 dark:focus:border-green-400 transition-colors"
            />
          </div>
        </div>
        
        {/* Boutons Filtres et Tags */}
        <div className="flex gap-3 sm:ml-auto">
          <button className="inline-flex items-center gap-2 px-4 py-2 border border-border dark:border-border rounded-lg bg-white dark:bg-surface-container-highest text-on-surface dark:text-muted-foreground hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors">
            <Filter className="w-4 h-4" />
            {t('clients.filters.button')}
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 border border-border dark:border-border rounded-lg bg-white dark:bg-surface-container-highest text-on-surface dark:text-muted-foreground hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors">
            <Tags className="w-4 h-4" />
            {t('clients.tags.button')}
          </button>
        </div>
      </div>
      
      {/* Deuxième ligne : Boutons de filtrage */}
      <div className="flex flex-wrap gap-2 justify-start">
        <button className="px-4 py-1.5 bg-primary dark:bg-green-600 text-white rounded-full text-sm hover:bg-indigo-700 dark:hover:bg-green-700 transition-colors">
          {t('clients.filters.all')}
        </button>
        <button className="px-4 py-1.5 bg-white dark:bg-surface-container-highest border border-border dark:border-border text-on-surface dark:text-muted-foreground rounded-full text-sm hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors">
          {t('clients.filters.vip')}
        </button>
        <button className="px-4 py-1.5 bg-white dark:bg-surface-container-highest border border-border dark:border-border text-on-surface dark:text-muted-foreground rounded-full text-sm hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors">
          {t('clients.filters.new')}
        </button>
        <button className="px-4 py-1.5 bg-white dark:bg-surface-container-highest border border-border dark:border-border text-on-surface dark:text-muted-foreground rounded-full text-sm hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors">
          {t('clients.filters.inactive')}
        </button>
      </div>
    </div>
  );
}
