// src/components/documents/DocumentsSearch.tsx
import React, { useContext } from 'react';
import { Search } from 'lucide-react';
import { LanguageContext } from '../../context/LanguageContext';

interface DocumentsSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const DocumentsSearch: React.FC<DocumentsSearchProps> = ({ 
  searchQuery, 
  onSearchChange 
}) => {
  const { t } = useContext(LanguageContext);

  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-200 dark:focus:ring-teal-500/20 focus:border-indigo-600 dark:focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
        placeholder={t('documents.search.placeholder')}
        aria-label={t('documents.search.ariaLabel')}
      />
    </div>
  );
};

export default DocumentsSearch;
