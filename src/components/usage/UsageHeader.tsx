import React, { useContext } from 'react';
import { Download, RefreshCw, Calendar } from 'lucide-react';
import { LanguageContext } from '../../context/LanguageContext';

interface UsageHeaderProps {
  onRefresh: () => void;
  onExport: () => void;
  onPeriodChange: (period: 'day' | 'week' | 'month' | 'year') => void;
  selectedPeriod: 'day' | 'week' | 'month' | 'year';
  isLoading: boolean;
}

export default function UsageHeader({
  onRefresh,
  onExport,
  onPeriodChange,
  selectedPeriod,
  isLoading
}: UsageHeaderProps) {
  const { t } = useContext(LanguageContext);
  
  const periods = [
    { value: 'day', label: t('usage.periods.day', 'Day') },
    { value: 'week', label: t('usage.periods.week', 'Week') },
    { value: 'month', label: t('usage.periods.month', 'Month') },
    { value: 'year', label: t('usage.periods.year', 'Year') }
  ];

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {t('usage.header.title', 'Usage & Analytics')}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          {t('usage.header.subtitle', 'Monitor your usage and optimize your resources')}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2 sm:gap-1.5">
        <div className="flex items-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden transition-colors">
          <Calendar className="ml-3 w-4 h-4 text-gray-500 dark:text-gray-400" />
          <select
            className="w-full py-2 pl-2 pr-8 bg-transparent text-gray-900 dark:text-gray-100 border-none focus:ring-0 text-sm"
            value={selectedPeriod}
            onChange={(e) => onPeriodChange(e.target.value as any)}
          >
            {periods.map((period) => (
              <option key={period.value} value={period.value} className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                {period.label}
              </option>
            ))}
          </select>
        </div>
        
        <button 
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="whitespace-nowrap">
            {t('usage.header.refresh', 'Refresh')}
          </span>
        </button>
        
        <button 
          onClick={onExport}
          className="flex items-center justify-center gap-2 bg-indigo-600 dark:bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-teal-700 transition-colors text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          <Download className="w-4 h-4" />
          <span className="whitespace-nowrap">
            {t('usage.header.export', 'Export Report')}
          </span>
        </button>
      </div>
    </div>
  );
}
