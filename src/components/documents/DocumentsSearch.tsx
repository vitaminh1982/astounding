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
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600"
        placeholder={t('documents.search.placeholder')}
        aria-label={t('documents.search.ariaLabel')}
      />
    </div>
  );
};

export default DocumentsSearch;
