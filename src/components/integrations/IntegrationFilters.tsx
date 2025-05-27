// src/components/integrations/IntegrationFilters.tsx
import React from 'react';
import { useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';

interface IntegrationFiltersProps {
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  hideStatusFilter?: boolean; // New prop to hide status filter
}

export default function IntegrationFilters({
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
  hideStatusFilter = false
}: IntegrationFiltersProps) {
  const { t } = useContext(LanguageContext);

  const categories = [
    { id: 'all', name: t('integrations.filters.categories.all') },
    { id: 'messaging', name: t('integrations.filters.categories.messaging') },
    { id: 'calendar', name: t('integrations.filters.categories.calendar') },
    { id: 'email', name: t('integrations.filters.categories.email') },
    { id: 'crm', name: t('integrations.filters.categories.crm') },
    { id: 'automation', name: t('integrations.filters.categories.automation') },
    { id: 'ecommerce', name: t('integrations.filters.categories.ecommerce') },
    { id: 'payment', name: t('integrations.filters.categories.payment') },
    { id: 'project', name: t('integrations.filters.categories.project') }
  ];

  const statuses = [
    { id: 'all', name: t('integrations.filters.status.all') },
    { id: 'connected', name: t('integrations.filters.status.connected') },
    { id: 'disconnected', name: t('integrations.filters.status.disconnected') }
  ];

  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
      {/* Category filter */}
      <div className="flex items-center">
        <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mr-2">
          {t('integrations.filters.category')}:
        </label>
        <select
          id="category-filter"
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Status filter - hide if hideStatusFilter is true */}
      {!hideStatusFilter && (
        <div className="flex items-center">
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mr-2">
            {t('integrations.filters.status.label')}:
          </label>
          <select
            id="status-filter"
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statuses.map((status) => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
