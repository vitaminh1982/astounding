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

    // Define color classes for dark mode with teal theme consistency
    const activeClasses = `bg-primary dark:bg-teal-600 text-white shadow-sm dark:shadow-gray-900`;
    const inactiveClasses = `bg-white dark:bg-surface-container-highest border border-border dark:border-border text-on-surface dark:text-muted-foreground hover:border-indigo-200 dark:hover:border-teal-500 hover:bg-indigo-50 dark:hover:bg-surface-container-highest shadow-sm dark:shadow-gray-900`;
    const activeCountClasses = `bg-primary dark:bg-primary text-white`;
    const inactiveCountClasses = `bg-surface-container-low dark:bg-surface-container-highest text-muted-foreground dark:text-muted-foreground`;

    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setActiveFilter(option.id)}
        className={`
          px-3 py-1.5 rounded-full text-sm
          flex items-center gap-1.5
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-2
          ${isActive 
            ? `${activeClasses} focus:ring-ring dark:focus:ring-ring dark:focus:ring-offset-gray-800` 
            : `${inactiveClasses} focus:ring-gray-500 dark:focus:ring-ring dark:focus:ring-offset-gray-900`
          }
        `}
        aria-pressed={isActive}
        aria-label={`Filter by ${option.label}${option.count ? ` (${option.count} items)` : ''}`}
      >
        {option.color && (
          <span
            className={`w-2 h-2 rounded-full transition-colors`}
            style={{ 
              backgroundColor: option.color === 'amber' ? '#f59e0b' : '#ef4444'
            }}
          />
        )}
        <span className="transition-colors">{option.label}</span>
        {option.count && (
          <span className={`
            text-xs px-1.5 py-0.5 rounded-full transition-colors
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
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-outline dark:text-muted-foreground w-5 h-5 transition-colors" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={t('conversations.search.placeholder')}
            className="w-full pl-10 pr-10 py-2 border border-border dark:border-border rounded-lg
                     bg-white dark:bg-surface-container-highest text-foreground dark:text-foreground
                     placeholder-gray-500 dark:placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-ring dark:focus:ring-ring 
                     focus:border-primary-green dark:focus:border-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900
                     transition-all duration-200 shadow-sm dark:shadow-gray-900"
            aria-label="Search conversations"
          />
          <AnimatePresence>
            {searchValue && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2
                         text-outline dark:text-muted-foreground hover:text-muted-foreground dark:hover:text-outline
                         focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-ring 
                         focus:ring-offset-2 dark:focus:ring-offset-gray-900 rounded-sm p-0.5 transition-colors"
                aria-label="Clear search"
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
              transition-all duration-200 shadow-sm dark:shadow-gray-900
              focus:outline-none focus:ring-2 focus:ring-offset-2
              ${isFilterMenuOpen
                ? 'bg-indigo-50 dark:bg-teal-900/30 border-indigo-200 dark:border-teal-700 text-primary-green dark:text-teal-300 focus:ring-ring dark:focus:ring-ring dark:focus:ring-offset-gray-800'
                : 'bg-white dark:bg-surface-container-highest border-border dark:border-border text-on-surface dark:text-muted-foreground hover:bg-surface-container-low dark:hover:bg-surface-container-highest hover:border-outline-variant dark:hover:border-outline focus:ring-gray-500 dark:focus:ring-ring dark:focus:ring-offset-gray-900'
              }
            `}
            aria-expanded={isFilterMenuOpen}
            aria-label="Toggle advanced filters"
          >
            <Filter className="w-4 h-4 transition-colors" />
            <span className="hidden sm:inline transition-colors">{t('conversations.filters.button')}</span>
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
            {/* Advanced filters menu content */}
            <div className="p-4 border border-border dark:border-border rounded-lg bg-surface-container-low dark:bg-surface-container-high shadow-sm dark:shadow-gray-900 transition-colors">
              <p className="text-muted-foreground dark:text-muted-foreground text-sm transition-colors">
                {t('conversations.filters.advancedContent')}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
