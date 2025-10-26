import React, { useState, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { useUsage } from '../hooks/useUsage';
import UsageHeader from '../components/usage/UsageHeader';
import PrimaryMetrics from '../components/usage/PrimaryMetrics';
import ConversationSummary from '../components/usage/ConversationSummary';
import WorkflowTracking from '../components/usage/WorkflowTracking';
import AgentUsage from '../components/usage/AgentUsage';
import UpgradeOptions from '../components/usage/UpgradeOptions';
import { toast } from 'react-hot-toast';

export default function UsagePage() {
  const { t } = useContext(LanguageContext);
  const { usageData, isLoading, error } = useUsage();
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const handleRefresh = () => {
    // In a real implementation, this would refetch the data
    toast.success('Usage data refreshed');
  };
  
  const handleExport = () => {
    // In a real implementation, this would generate and download a report
    toast.success('Report exported successfully');
  };
  
  const handlePeriodChange = (period: 'day' | 'week' | 'month' | 'year') => {
    setSelectedPeriod(period);
    // In a real implementation, this would fetch data for the selected period
  };
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 rounded-lg shadow-lg dark:shadow-gray-900 max-w-md w-full text-center transition-colors">
          <div className="text-red-500 dark:text-red-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">{t('usage.error.title', 'Error Loading Usage Data')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-teal-600 dark:bg-teal-500 text-white rounded-lg hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            {t('usage.error.retry', 'Try Again')}
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <UsageHeader
          onRefresh={handleRefresh}
          onExport={handleExport}
          onPeriodChange={handlePeriodChange}
          selectedPeriod={selectedPeriod}
          isLoading={isLoading}
        />
        
        <div className="space-y-6">
          {/* Primary Metrics Section - The only section always visible */}
          <section>
            <PrimaryMetrics usageData={usageData} />
          </section>
          
          {/* Toggle button for advanced features */}
          <div className="flex justify-center py-4">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              {showAdvanced ? 
                t('usage.advancedOptions.hide', 'Hide Detailed Analytics') : 
                t('usage.advancedOptions.show', 'Show Detailed Analytics')}
              <svg 
                className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          
          {/* All detailed sections - Only visible when toggled */}
          {showAdvanced && (
            <>
              <section>
                <ConversationSummary usageData={usageData} />
              </section>

              <section>
                <UpgradeOptions />
              </section>
              
              <section>
                <AgentUsage usageData={usageData} />
              </section>
              
              <section>
                <WorkflowTracking usageData={usageData} />
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
