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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('usage.error.title', 'Error Loading Usage Data')}</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            {t('usage.error.retry', 'Try Again')}
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
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
              className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors"
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
