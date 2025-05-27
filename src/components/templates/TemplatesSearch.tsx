import React, { useContext } from 'react';
import { Search, Filter } from 'lucide-react';
import { LanguageContext } from '../../context/LanguageContext';

export default function TemplatesSearch() {
  const { t } = useContext(LanguageContext);

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 sm:mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 sm:w-5 h-4 sm:h-5" />
        <input 
          type="text"
          placeholder={t('templates.search.placeholder')}
          className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <button className="flex items-center justify-center gap-2 px-4 py-2 border rounded-lg bg-white hover:bg-gray-50 transition-colors text-sm sm:text-base">
        <Filter className="w-4 h-4" />
        <span className="whitespace-nowrap">{t('templates.search.filters')}</span>
      </button>
    </div>
  );
}
