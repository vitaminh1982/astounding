import React, { useState, useCallback, useMemo } from 'react';
import { Plus, Edit2, Trash2, Circle, X, AlertCircle, Zap, Database, MessageSquare, Code, Power, CheckCircle } from 'lucide-react';

export interface Integration {
  id: string;
  name: string;
  type: 'api' | 'database' | 'messaging' | 'custom';
  description: string;
  config: {
    endpoint?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    authentication?: {
      type: 'basic' | 'bearer' | 'oauth2';
      credentials: Record<string, string>;
    };
    parameters?: Record<string, string>;
  };
  isActive: boolean;
}

interface IntegrationBuilderProps {
  workflowId: string;
  integrations?: Integration[];
  onIntegrationChange?: (integrations: Integration[]) => void;
  isLoading?: boolean;
  error?: string;
}

const IntegrationBuilder: React.FC<IntegrationBuilderProps> = ({
  workflowId,
  integrations = [],
  onIntegrationChange = () => {},
  isLoading = false,
  error,
}) => {
  const [editingIntegration, setEditingIntegration] = useState<Integration | null>(null);
  const [isAddingIntegration, setIsAddingIntegration] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);

  // Memoized integration type configuration with dark mode variants
  const integrationTypeConfig = useMemo(() => ({
    api: {
      icon: Zap,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      label: 'API'
    },
    database: {
      icon: Database,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
      label: 'Database'
    },
    messaging: {
      icon: MessageSquare,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      label: 'Messaging'
    },
    custom: {
      icon: Code,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800',
      label: 'Custom'
    }
  }), []);

  const handleAddIntegration = useCallback(() => {
    const newIntegration: Integration = {
      id: `integration-${Date.now()}`,
      name: '',
      type: 'api',
      description: '',
      config: {},
      isActive: true,
    };
    setEditingIntegration(newIntegration);
    setIsAddingIntegration(true);
  }, []);

  const handleSaveIntegration = useCallback((integration: Integration) => {
    if (isAddingIntegration) {
      onIntegrationChange([...integrations, integration]);
    } else {
      onIntegrationChange(
        integrations.map(i => i.id === integration.id ? integration : i)
      );
    }
    setEditingIntegration(null);
    setIsAddingIntegration(false);
  }, [isAddingIntegration, integrations, onIntegrationChange]);

  const handleDeleteIntegration = useCallback((integrationId: string) => {
    setDeleteConfirmation(null);
    onIntegrationChange(integrations.filter(i => i.id !== integrationId));
  }, [integrations, onIntegrationChange]);

  const handleToggleIntegration = useCallback((integrationId: string) => {
    onIntegrationChange(
      integrations.map(i =>
        i.id === integrationId ? { ...i, isActive: !i.isActive } : i
      )
    );
  }, [integrations, onIntegrationChange]);

  const handleCloseModal = useCallback(() => {
    setEditingIntegration(null);
    setIsAddingIntegration(false);
  }, []);

  const handleCancelDelete = useCallback(() => {
    setDeleteConfirmation(null);
  }, []);

  // Loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 transition-colors">
            Loading integrations...
          </p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4 transition-colors">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 transition-colors">
            Error loading integrations
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors">
            Integrations
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors">
            Connect external services and APIs to your workflow
          </p>
        </div>
        <button
          onClick={handleAddIntegration}
          className="flex items-center gap-2 bg-indigo-600 dark:bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-teal-700 transition-colors shadow-sm dark:shadow-gray-900"
          aria-label="Add new integration"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Integration
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        {integrations.length === 0 ? (
          /* Empty State */
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/20 mb-4 transition-colors">
              <Zap className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 transition-colors">
              No integrations configured
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6 transition-colors">
              Connect your workflow to external services, APIs, databases, and messaging platforms to automate your processes.
            </p>
            <button
              onClick={handleAddIntegration}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Integration
            </button>
          </div>
        ) : (
          /* Integration Cards */
          <div className="space-y-4">
            {integrations.map((integration) => {
              const typeConfig = integrationTypeConfig[integration.type];
              const TypeIcon = typeConfig.icon;

              return (
                <div
                  key={integration.id}
                  className={`p-4 border ${typeConfig.borderColor} rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200`}
                >
                  {/* Integration Header */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${typeConfig.bgColor} flex items-center justify-center transition-colors`}>
                        <TypeIcon className={`w-5 h-5 ${typeConfig.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-medium text-lg text-gray-900 dark:text-gray-100 truncate transition-colors">
                            {integration.name || 'Untitled Integration'}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                            integration.isActive 
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800' 
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
                          }`}>
                            <Circle 
                              className="w-2 h-2 mr-1" 
                              fill={integration.isActive ? 'currentColor' : 'none'} 
                            />
                            {integration.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2 transition-colors">
                          {integration.description || 'No description provided'}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => setEditingIntegration(integration)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all duration-200"
                        aria-label="Edit integration"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleIntegration(integration.id)}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          integration.isActive
                            ? 'text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
                            : 'text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        aria-label={integration.isActive ? 'Deactivate integration' : 'Activate integration'}
                        title={integration.isActive ? 'Deactivate' : 'Activate'}
                      >
                        <Power className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmation(integration.id)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                        aria-label="Delete integration"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Integration Details */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 transition-colors">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-700 dark:text-gray-300 mr-2 transition-colors">
                          Type:
                        </span>
                        <span className={`px-2 py-1 rounded-md ${typeConfig.bgColor} ${typeConfig.color} text-xs font-medium`}>
                          {typeConfig.label}
                        </span>
                      </div>
                      
                      {integration.type === 'api' && integration.config.method && (
                        <div className="flex items-center">
                          <span className="font-medium text-gray-700 dark:text-gray-300 mr-2 transition-colors">
                            Method:
                          </span>
                          <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-xs font-mono transition-colors">
                            {integration.config.method}
                          </code>
                        </div>
                      )}
                      
                      {integration.type === 'api' && integration.config.endpoint && (
                        <div className="col-span-full">
                          <span className="font-medium text-gray-700 dark:text-gray-300 mr-2 transition-colors">
                            Endpoint:
                          </span>
                          <a
                            href={integration.config.endpoint}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 break-all transition-colors"
                          >
                            {integration.config.endpoint}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {(editingIntegration || isAddingIntegration) && editingIntegration && (
        <IntegrationEditor
          integration={editingIntegration}
          onSave={handleSaveIntegration}
          onCancel={handleCloseModal}
          integrationTypeConfig={integrationTypeConfig}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div 
          className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-colors"
          onClick={handleCancelDelete}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center transition-colors">
                  <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 transition-colors">
                    Delete Integration
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">
                    Are you sure you want to delete this integration? This action cannot be undone and may affect your workflow's functionality.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 rounded-b-xl transition-colors">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2.5 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteIntegration(deleteConfirmation)}
                className="px-4 py-2.5 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 shadow-sm hover:shadow-md transition-all duration-200"
              >
                Delete Integration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Integration Editor Component
interface IntegrationEditorProps {
  integration: Integration;
  onSave: (integration: Integration) => void;
  onCancel: () => void;
  integrationTypeConfig: any; // Consider refining this type
}

const IntegrationEditor: React.FC<IntegrationEditorProps> = ({
  integration,
  onSave,
  onCancel,
  integrationTypeConfig,
}) => {
  const [editedIntegration, setEditedIntegration] = useState<Integration>(integration);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedIntegration);
  };

  const TypeIcon = integrationTypeConfig[editedIntegration.type]?.icon || Zap; // Fallback icon

  return (
    <div 
      className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-colors"
      onClick={onCancel}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between transition-colors z-10">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${integrationTypeConfig[editedIntegration.type]?.bgColor || 'bg-blue-50 dark:bg-blue-900/20'} flex items-center justify-center transition-colors`}>
              <TypeIcon className={`w-5 h-5 ${integrationTypeConfig[editedIntegration.type]?.color || 'text-blue-600 dark:text-blue-400'}`} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 transition-colors">
              {integration.id ? 'Edit Integration' : 'Create Integration'}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
              Integration Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={editedIntegration.name}
              onChange={(e) => setEditedIntegration({...editedIntegration, name: e.target.value})}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors"
              placeholder="Enter integration name"
              required
            />
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
              Description
            </label>
            <textarea
              value={editedIntegration.description}
              onChange={(e) => setEditedIntegration({...editedIntegration, description: e.target.value})}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors resize-none"
              rows={3}
              placeholder="Describe what this integration does"
            />
          </div>

          {/* Type Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
              Integration Type <span className="text-red-500">*</span>
            </label>
            <select
              value={editedIntegration.type}
              onChange={(e) => {
                const newType = e.target.value as Integration['type'];
                setEditedIntegration({
                  ...editedIntegration,
                  type: newType,
                  // Reset config for relevant fields or clear all for simplicity
                  config: newType === 'api' ? { endpoint: '', method: 'GET' } : {} 
                });
              }}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors appearance-none"
            >
              <option value="api">API</option>
              <option value="database">Database</option>
              <option value="messaging">Messaging</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {/* API-Specific Fields */}
          {editedIntegration.type === 'api' && (
            <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg transition-colors">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2 transition-colors">
                <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                API Configuration
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                  Endpoint URL
                </label>
                <input
                  type="url"
                  value={editedIntegration.config.endpoint || ''}
                  onChange={(e) => setEditedIntegration({
                    ...editedIntegration,
                    config: {
                      ...editedIntegration.config,
                      endpoint: e.target.value
                    }
                  })}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors"
                  placeholder="https://api.example.com/endpoint"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                  HTTP Method
                </label>
                <select
                  value={editedIntegration.config.method || 'GET'}
                  onChange={(e) => setEditedIntegration({
                    ...editedIntegration,
                    config: {
                      ...editedIntegration.config,
                      method: e.target.value as 'GET' | 'POST' | 'PUT' | 'DELETE'
                    }
                  })}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors appearance-none"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>
            </div>
          )}
          {/* Add other type specific configurations here if needed */}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 transition-colors">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              {integration.id ? 'Save Changes' : 'Create Integration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IntegrationBuilder;
