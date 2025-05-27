import React from 'react';
import { useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';
import IntegrationCard, { IntegrationType } from './IntegrationCard';

interface IntegrationGridProps {
  integrations: IntegrationType[];
  searchQuery: string;
  categoryFilter: string;
  statusFilter: string;
  onOpenModal: (integration: IntegrationType) => void;
}

export default function IntegrationGrid({
  integrations,
  searchQuery,
  categoryFilter,
  statusFilter,
  onOpenModal
}: IntegrationGridProps) {
  const { t } = useContext(LanguageContext);

  // Filter integrations based on search query and filters
  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = 
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || integration.category === categoryFilter;
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'connected' && integration.isConnected) ||
      (statusFilter === 'disconnected' && !integration.isConnected);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (filteredIntegrations.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No tools found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Try adjusting your search or filter to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {filteredIntegrations.map(integration => (
        <IntegrationCard
          key={integration.id}
          integration={integration}
          onOpenModal={onOpenModal}
        />
      ))}
    </div>
  );
}
