import React, { useState } from 'react';
import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import IntegrationSearchBar from '../components/integrations/IntegrationSearchBar';
import IntegrationGrid from '../components/integrations/IntegrationGrid';
import IntegrationModal from '../components/integrations/IntegrationModal';
import AddToolModal from '../components/integrations/AddToolModal';
import { IntegrationType } from '../components/integrations/IntegrationCard';
import { toast } from 'react-hot-toast';
import PageHeader from '../components/common/PageHeader';

// Sample integrations data - in a real app, this would come from an API
const initialIntegrations: IntegrationType[] = [
  {
    id: '1',
    name: 'Slack',
    description: 'Connect your Slack workspace to send and receive messages directly from the platform.',
    iconType: 'slack',
    category: 'messaging',
    isConnected: true,
    connectedSince: '2025-02-17'
  },
  {
    id: '2',
    name: 'Google Calendar',
    description: 'Sync your Google Calendar to schedule meetings and track events automatically.',
    iconType: 'google-calendar',
    category: 'calendar',
    isConnected: false
  },
  {
    id: '3',
    name: 'Zapier',
    description: 'Connect to thousands of apps through Zapier to automate your workflow.',
    iconType: 'zapier',
    category: 'automation',
    isConnected: true,
    connectedSince: '2025-02-17'
  },
  {
    id: '4',
    name: 'Shopify',
    description: 'Sync your Shopify store products, orders and customers.',
    iconType: 'shopify',
    category: 'ecommerce',
    isConnected: false
  },
  {
    id: '5',
    name: 'Stripe',
    description: 'Process payments and manage subscriptions with Stripe integration.',
    iconType: 'stripe',
    category: 'payment',
    isConnected: false
  },
  {
    id: '6',
    name: 'HubSpot',
    description: 'Sync contacts, companies and deals with your HubSpot CRM.',
    iconType: 'hubspot',
    category: 'crm',
    isConnected: true,
    connectedSince: '2025-02-17'
  },
  {
    id: '7',
    name: 'Zendesk',
    description: 'Manage customer support tickets directly from your dashboard.',
    iconType: 'zendesk',
    category: 'crm',
    isConnected: false
  },
  {
    id: '8',
    name: 'Outlook',
    description: 'Sync your emails, calendar and contacts with Outlook.',
    iconType: 'outlook',
    category: 'email',
    isConnected: false
  },
  {
    id: '9',
    name: 'Mailchimp',
    description: 'Sync your email subscribers and campaigns with Mailchimp.',
    iconType: 'mailchimp',
    category: 'email',
    isConnected: true,
    connectedSince: '2025-02-17'
  },
  {
    id: '10',
    name: 'Asana',
    description: 'Track your project tasks and deadlines with Asana integration.',
    iconType: 'asana',
    category: 'project',
    isConnected: false
  },
   {
    id: '11',
    name: 'Gmail',
    description: 'Connect to Gmail to send and manage emails.',
    iconType: 'outlook',
    category: 'email',
    isConnected: true,
    connectedSince: '2025-02-17'
  },
];

export default function IntegrationsPage() {
  const { t } = useContext(LanguageContext);
  
  // State for integrations
  const [integrations, setIntegrations] = useState<IntegrationType[]>(initialIntegrations);
  
  // State for search filter
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for integration detail modal
  const [integrationModalOpen, setIntegrationModalOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<IntegrationType | null>(null);
  
  // State for Add Tool modal
  const [addToolModalOpen, setAddToolModalOpen] = useState(false);

  // Get connected integrations - these are the only ones we'll show on the main page
  const connectedIntegrations = integrations.filter(integration => integration.isConnected);
  
  // Get available (not connected) integrations for the Add Tool modal
  const availableIntegrations = integrations.filter(integration => !integration.isConnected);

  // Handle opening the modal for an integration detail
  const handleOpenIntegrationModal = (integration: IntegrationType) => {
    setSelectedIntegration(integration);
    setIntegrationModalOpen(true);
  };

  // Handle closing the integration detail modal
  const handleCloseIntegrationModal = () => {
    setIntegrationModalOpen(false);
    setSelectedIntegration(null);
  };
  
  // Handle opening the Add Tool modal
  const handleOpenAddToolModal = () => {
    setAddToolModalOpen(true);
  };
  
  // Handle closing the Add Tool modal
  const handleCloseAddToolModal = () => {
    setAddToolModalOpen(false);
  };

  // Handle connecting an integration
  const handleConnectIntegration = (integration: IntegrationType) => {
    const updatedIntegrations = integrations.map(item => {
      if (item.id === integration.id) {
        const now = new Date().toISOString().split('T')[0];
        return { ...item, isConnected: true, connectedSince: now };
      }
      return item;
    });
    
    setIntegrations(updatedIntegrations);
    toast.success(t('integrations.messages.connectSuccess', { name: integration.name }));
    
    // Close the modals
    handleCloseIntegrationModal();
  };

  // Handle disconnecting an integration
  const handleDisconnectIntegration = (integration: IntegrationType) => {
    const updatedIntegrations = integrations.map(item => {
      if (item.id === integration.id) {
        return { ...item, isConnected: false, connectedSince: undefined };
      }
      return item;
    });
    
    setIntegrations(updatedIntegrations);
    toast.success(t('integrations.messages.disconnectSuccess', { name: integration.name }));
  };

return (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    {/* Container principal avec padding responsive */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      {/* En-tête */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('integrations.title')}</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              {t('integrations.subtitle')}
            </p>
          </div>
          {/* Actions rapides */}
          <div className="flex gap-3">
            <button
              className="flex items-center gap-2 bg-teal-600 dark:bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-700 dark:hover:bg-teal-600"
              onClick={handleOpenAddToolModal}
            >
              <svg 
                className="w-4 h-4" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor" 
                aria-hidden="true"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" 
                  clipRule="evenodd" 
                />
              </svg>
              {t('integrations.addTool')}
            </button>
          </div>
        </div>
      </div>

      {/* Section principale */}
      <section className="rounded-lg bg-white shadow">
        <div className="p-4 sm:p-6">
          {/* Barre de recherche */}
          <div className="mb-6">
            <IntegrationSearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>

          {/* Contenu des intégrations */}
          <div className="overflow-hidden">
            {connectedIntegrations.length > 0 ? (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  {t('integrations.connectedTools')}
                </h2>
                <IntegrationGrid
                  integrations={connectedIntegrations}
                  searchQuery={searchQuery}
                  categoryFilter="all"
                  statusFilter="connected"
                  onOpenModal={handleOpenIntegrationModal}
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg p-8 text-center">
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
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  {t('integrations.noToolsConnected')}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {t('integrations.noToolsConnectedDescription')}
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleOpenAddToolModal}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <svg 
                      className="w-4 h-4" 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 20 20" 
                      fill="currentColor" 
                      aria-hidden="true"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                    {t('integrations.addTool')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>

    {/* Add Tool Modal component */}
    <AddToolModal
      isOpen={addToolModalOpen}
      onClose={handleCloseAddToolModal}
      availableIntegrations={availableIntegrations}
      onOpenIntegrationModal={handleOpenIntegrationModal}
    />

    {/* Integration detail modal - for connecting or disconnecting a specific tool */}
    <IntegrationModal
      integration={selectedIntegration}
      isOpen={integrationModalOpen}
      onClose={handleCloseIntegrationModal}
      onConnect={handleConnectIntegration}
      onDisconnect={handleDisconnectIntegration}
    />
  </div>
);

}
