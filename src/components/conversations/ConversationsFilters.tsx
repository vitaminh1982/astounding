import React, { useState } from 'react';
import { Filter, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Tooltip from '../common/Tooltip';
import { useContext } from 'react';
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
    
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setActiveFilter(option.id)}
        className={`
          px-3 py-1.5 rounded-full text-sm
          flex items-center gap-1.5
          transition-all duration-200
          ${isActive 
            ? 'bg-teal-600 dark:bg-teal-500 text-white shadow-sm' 
            : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-teal-200 dark:hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/30'
          }
        `}
      >
        {option.color && (
          <span 
            className={`w-2 h-2 rounded-full bg-${option.color}-500`}
            style={{ backgroundColor: option.color === 'amber' ? '#f59e0b' : '#ef4444' }}
          />
        )}
        {option.label}
        {option.count && (
          <span className={`
            text-xs px-1.5 py-0.5 rounded-full transition-colors
            ${isActive 
              ? 'bg-teal-500 dark:bg-teal-600 text-white' 
              : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
            }
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
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5 transition-colors" />
          <input 
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={t('conversations.search.placeholder')}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-teal-500 dark:focus:border-teal-400
                     transition-all duration-200"
          />
          <AnimatePresence>
            {searchValue && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2
                         text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300
                         focus:outline-none transition-colors"
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
                ? 'bg-teal-50 dark:bg-teal-900/30 border-teal-200 dark:border-teal-600 text-teal-600 dark:text-teal-400' 
                : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
              }
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
            <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 transition-colors">
              <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors">{t('conversations.filters.advancedContent')}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
