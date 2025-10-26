import React, { useState, useContext } from 'react';
import ClientsHeader from '../components/clients/ClientsHeader';
import ClientsFilters from '../components/clients/ClientsFilters';
import ClientsList from '../components/clients/ClientsList';
import ClientSegmentation from '../components/clients/ClientSegmentation';
import ClientAnalytics from '../components/clients/ClientAnalytics';
import { ChevronRightIcon } from '@heroicons/react/24/outline'; // Assuming this icon is still used
import { LanguageContext } from '../context/LanguageContext';

export default function ClientsPage() {
  const [showIndicator, setShowIndicator] = useState(true);
  const { t } = useContext(LanguageContext);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <ClientsHeader className="mb-8" />

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Column */}
          <div className="w-full lg:flex-1 min-w-0">
            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-6 p-4">
              <div className="overflow-x-auto">
                <div className="min-w-[600px] lg:min-w-0">
                  <ClientsFilters />
                </div>
              </div>
            </div>

            {/* Clients List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <ClientsList />
            </div>
          </div>

          {/* Scroll Indicator (desktop only) */}
          {showIndicator && (
            <div className="hidden lg:block fixed right-0 top-1/2 -translate-y-1/2 bg-primary-500 dark:bg-teal-600 text-white rounded-l-lg shadow-lg z-50 transition-transform hover:translate-x-0 translate-x-[calc(100%-8px)] group">
              <div className="flex items-center p-3 cursor-pointer" onClick={() => setShowIndicator(false)}>
                <ChevronRightIcon className="h-5 w-5 mr-2" />
                <span className="whitespace-nowrap group-hover:block hidden">
                  {t('clients.page.seeAnalytics')}
                </span>
              </div>
            </div>
          )}

          {/* Sidebar */}
          <div className="w-full lg:w-[380px] lg:flex-shrink-0">
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <ClientSegmentation />
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <ClientAnalytics />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
