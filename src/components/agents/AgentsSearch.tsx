import React, { useContext } from 'react';
import { Search, Filter } from 'lucide-react';
import { LanguageContext } from '../../context/LanguageContext';

export default function AgentsSearch() {
  const { t } = useContext(LanguageContext);

  return (
    <div className="flex gap-4 mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input 
          type="text"
          placeholder={t('agents.page.search.placeholder')}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <button className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white hover:bg-gray-50 transition-colors">
        <Filter className="w-4 h-4" />
        {t('agents.page.search.filters')}
      </button>
    </div>
  );
}
