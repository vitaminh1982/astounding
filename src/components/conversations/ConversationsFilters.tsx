import React, { useState, useContext } from 'react';
import { Filter, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Tooltip from '../common/Tooltip';
import { LanguageContext } from '../../context/LanguageContext';

interface FilterOption {
  id: string;
  label: string;
  color?: string;
  count?: number;
}

const filterOptions: FilterOption[] = [
  { id: 'all', label: 'All', count: 24 },
  { id: 'in-progress', label: 'Ongoing', count: 12 },
  {
    id: 'attention',
    label: 'Required Attention',
    color: 'amber',
    count: 4
  },
  {
    id: 'urgent',
    label: 'Urgent',
    color: 'red',
    count: 2
  },
];

export default function ConversationsFilters() {
  const { t } = useContext(LanguageContext);
  const [searchValue, setSearchValue] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  const clearSearch = () => {
    setSearchValue('');
  };

  const FilterButton: React.FC<{ option: FilterOption }> = ({ option }) => {
    const isActive = activeFilter === option.id;

    // Define color classes for dark mode
    const activeClasses = `bg-indigo-600 text-white shadow-sm`;
    const inactiveClasses = `bg-white border text-gray-700 hover:border-indigo-200 hover:bg-indigo-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:border-gray-500`;
    const activeCountClasses = `bg-indigo-500 text-white`;
    const inactiveCountClasses = `bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300`;

    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setActiveFilter(option.id)}
        className={`
          px-3 py-1.5 rounded-full text-sm
          flex items-center gap-1.5
          transition-all duration-200
          ${isActive ? activeClasses : inactiveClasses}
        `}
      >
        {option.color && (
          <span
            className={`w-2 h-2 rounded-full`}
            // Inline styles for specific colors that might not have direct Tailwind classes
            style={{ backgroundColor: option.color === 'amber' ? '#f59e0b' : '#ef4444' }}
          />
        )}
        {option.label}
        {option.count && (
          <span className={`
            text-xs px-1.5 py-0.5 rounded-full
            ${isActive ? activeCountClasses : inactiveCountClasses}
          `}>
            {option.count}
          </span>
        )}
      </motion.button>
    );
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="flex gap-2 sm:gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 dark:text-gray-500" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={t('conversations.search.placeholder')}
            className="w-full pl-10 pr-10 py-2 border rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                     transition-all duration-200
                     dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-indigo-600 dark:focus:border-indigo-600 dark:text-gray-300"
          />
          <AnimatePresence>
            {searchValue && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2
                         text-gray-400 hover:text-gray-600
                         focus:outline-none dark:text-gray-500 dark:hover:text-gray-400"
              >
                <X className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <Tooltip content={t('conversations.filters.tooltipAdvanced')}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
            className={`
              flex items-center gap-2 px-4 py-2 border rounded-lg
              transition-all duration-200
              ${isFilterMenuOpen
                ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                : 'bg-white hover:bg-gray-50'
              }
              dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:text-gray-300
              ${isFilterMenuOpen ? 'dark:bg-indigo-900 dark:border-indigo-700 dark:text-indigo-300' : ''}
            `}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">{t('conversations.filters.button')}</span>
          </motion.button>
        </Tooltip>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {filterOptions.map((option) => (
          <FilterButton key={option.id} option={option} />
        ))}
      </div>

      <AnimatePresence>
        {isFilterMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {/* Contenu du menu de filtres avancés */}
            <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
              {/* Ajoutez ici vos filtres avancés */}
              <p className="text-gray-500 text-sm dark:text-gray-400">{t('conversations.filters.advancedContent')}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
