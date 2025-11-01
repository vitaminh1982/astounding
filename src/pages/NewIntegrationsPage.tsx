import React, { useState, useEffect, useContext } from 'react';
import { Plus, Filter, Search, Loader2 } from 'lucide-react';
import { LanguageContext } from '../context/LanguageContext';
import { toast } from 'react-hot-toast';
import {
  IntegrationTypeData,
  UserIntegration,
  IntegrationType,
  IntegrationCategory,
  MCPServerFormData,
  VendorAPIFormData,
} from '../types/integration';
import { IntegrationService } from '../services/integrationService';
import EnhancedIntegrationCard from '../components/integrations/EnhancedIntegrationCard';
import ConnectionModal from '../components/integrations/ConnectionModal';

export default function NewIntegrationsPage() {
  const { t } = useContext(LanguageContext);

  const [integrationTypes, setIntegrationTypes] = useState<IntegrationTypeData[]>([]);
  const [userIntegrations, setUserIntegrations] = useState<UserIntegration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<IntegrationType | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<IntegrationCategory | 'all'>('all');
  const [connectionModal, setConnectionModal] = useState<{
    isOpen: boolean;
    integrationType: IntegrationTypeData | null;
    existingIntegration?: UserIntegration;
  }>({
    isOpen: false,
    integrationType: null,
  });
  const [showAvailable, setShowAvailable] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [types, userInts] = await Promise.all([
        IntegrationService.getAllIntegrationTypes(),
        IntegrationService.getUserIntegrations('mock-user-id'),
      ]);
      setIntegrationTypes(types);
      setUserIntegrations(userInts);
    } catch (error) {
      toast.error('Failed to load integrations');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (data: MCPServerFormData | VendorAPIFormData) => {
    if (!connectionModal.integrationType) return;

    try {
      const newIntegration = await IntegrationService.createUserIntegration(
        'mock-user-id',
        connectionModal.integrationType.id,
        data
      );

      if (data.api_key) {
        await IntegrationService.storeCredential(
          newIntegration.id,
          'api_key',
          data.api_key
        );
      }

      await IntegrationService.connectIntegration(newIntegration.id);

      await IntegrationService.logEvent(
        newIntegration.id,
        'connected',
        `Successfully connected to ${connectionModal.integrationType.name}`
      );

      setUserIntegrations([...userIntegrations, newIntegration]);
      toast.success(`Successfully connected to ${connectionModal.integrationType.name}`);
      setConnectionModal({ isOpen: false, integrationType: null });
      await loadData();
    } catch (error) {
      toast.error('Failed to connect integration');
      throw error;
    }
  };

  const handleTest = async (integration: UserIntegration) => {
    try {
      const result = await IntegrationService.testConnection(integration);

      if (result.success) {
        toast.success('Connection test successful!');
        await loadData();
      } else {
        toast.error(result.error_message || 'Connection test failed');
      }
    } catch (error) {
      toast.error('Failed to test connection');
      throw error;
    }
  };

  const handleDisconnect = async (integration: UserIntegration) => {
    try {
      await IntegrationService.disconnectIntegration(integration.id);
      await IntegrationService.logEvent(
        integration.id,
        'disconnected',
        'Integration disconnected by user'
      );

      setUserIntegrations(
        userIntegrations.filter((ui) => ui.id !== integration.id)
      );
      toast.success('Integration disconnected');
      await loadData();
    } catch (error) {
      toast.error('Failed to disconnect integration');
      throw error;
    }
  };

  const filteredTypes = integrationTypes.filter((type) => {
    const matchesSearch =
      type.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      type.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || type.type === typeFilter;
    const matchesCategory =
      categoryFilter === 'all' || type.category === categoryFilter;
    return matchesSearch && matchesType && matchesCategory;
  });

  const connectedIntegrations = userIntegrations.filter((ui) => ui.is_connected);
  const availableTypes = filteredTypes.filter(
    (type) => !userIntegrations.find((ui) => ui.integration_type_id === type.id)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-teal-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors">
                {t('integrations.title')}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 transition-colors">
                Connect MCP servers and vendor APIs
              </p>
            </div>

            <button
              onClick={() => setShowAvailable(!showAvailable)}
              className="flex items-center gap-2 bg-blue-600 dark:bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-teal-700 transition-colors shadow-sm dark:shadow-gray-900"
            >
              <Plus className="w-4 h-4" />
              Add Integration
            </button>
          </div>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search integrations..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-teal-500"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                     focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-teal-500"
          >
            <option value="all">All Types</option>
            <option value="mcp">MCP Servers</option>
            <option value="vendor">Vendor APIs</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                     focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-teal-500"
          >
            <option value="all">All Categories</option>
            <option value="messaging">Messaging</option>
            <option value="calendar">Calendar</option>
            <option value="crm">CRM</option>
            <option value="storage">Storage</option>
            <option value="productivity">Productivity</option>
            <option value="automation">Automation</option>
            <option value="project">Project Management</option>
          </select>
        </div>

        {!showAvailable && (
          <section className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Connected Integrations ({connectedIntegrations.length})
            </h2>

            {connectedIntegrations.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {connectedIntegrations.map((userInt) => (
                  <EnhancedIntegrationCard
                    key={userInt.id}
                    integrationType={userInt.integration_type!}
                    userIntegration={userInt}
                    onConnect={() => {}}
                    onConfigure={() =>
                      setConnectionModal({
                        isOpen: true,
                        integrationType: userInt.integration_type!,
                        existingIntegration: userInt,
                      })
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                <p className="text-gray-500 dark:text-gray-400">
                  No connected integrations yet. Add your first integration to get started.
                </p>
              </div>
            )}
          </section>
        )}

        {showAvailable && (
          <section>
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Available Integrations ({availableTypes.length})
            </h2>

            {availableTypes.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {availableTypes.map((type) => (
                  <EnhancedIntegrationCard
                    key={type.id}
                    integrationType={type}
                    onConnect={() =>
                      setConnectionModal({
                        isOpen: true,
                        integrationType: type,
                      })
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                <p className="text-gray-500 dark:text-gray-400">
                  No available integrations found matching your filters.
                </p>
              </div>
            )}
          </section>
        )}
      </div>

      <ConnectionModal
        integrationType={connectionModal.integrationType}
        existingIntegration={connectionModal.existingIntegration}
        isOpen={connectionModal.isOpen}
        onClose={() =>
          setConnectionModal({ isOpen: false, integrationType: null })
        }
        onConnect={handleConnect}
        onTest={handleTest}
        onDisconnect={handleDisconnect}
      />
    </div>
  );
}
