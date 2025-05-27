import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Circle } from 'lucide-react';

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

  const handleAddIntegration = () => {
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
  };

  const handleSaveIntegration = (integration: Integration) => {
    if (isAddingIntegration) {
      onIntegrationChange([...integrations, integration]);
    } else {
      onIntegrationChange(
        integrations.map(i => i.id === integration.id ? integration : i)
      );
    }
    setEditingIntegration(null);
    setIsAddingIntegration(false);
  };

  const handleDeleteIntegration = (integrationId: string) => {
    setDeleteConfirmation(null);
    onIntegrationChange(integrations.filter(i => i.id !== integrationId));
  };

  const handleToggleIntegration = (integrationId: string) => {
    onIntegrationChange(
      integrations.map(i =>
        i.id === integrationId ? { ...i, isActive: !i.isActive } : i
      )
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-600 text-center">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-medium">Error loading integrations</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        <div>
          <h2 className="text-lg font-semibold">Integrations</h2>
          <p className="text-sm text-gray-500">Manage your workflow integrations</p>
        </div>
        <button
          onClick={handleAddIntegration}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Integration
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {integrations.length === 0 ? (
          <div className="text-center py-12">
            <div className="rounded-full bg-indigo-100 p-3 mx-auto w-fit">
              <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No integrations</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding your first integration.</p>
            <button
              onClick={handleAddIntegration}
              className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Integration
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {integrations.map((integration) => (
              <div
                key={integration.id}
                className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="font-medium text-lg">{integration.name}</h3>
                      <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        integration.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        <Circle className="w-2 h-2 mr-1" fill={integration.isActive ? 'currentColor' : 'none'} />
                        {integration.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{integration.description}</p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => setEditingIntegration(integration)}
                      className="p-1 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-gray-100"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleToggleIntegration(integration.id)}
                      className={`p-1 rounded-full ${
                        integration.isActive
                          ? 'text-green-600 hover:bg-green-100'
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                      title={integration.isActive ? 'Deactivate' : 'Activate'}
                    >
                      <Circle className="w-4 h-4" fill={integration.isActive ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmation(integration.id)}
                      className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-100"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-500">
                  <div>
                    <span className="font-medium text-gray-700">Type:</span>
                    <span className="ml-2 capitalize">{integration.type}</span>
                  </div>
                  {integration.type === 'api' && integration.config.endpoint && (
                    <>
                      <div>
                        <span className="font-medium text-gray-700">Method:</span>
                        <span className="ml-2">{integration.config.method}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium text-gray-700">Endpoint:</span>
                        <span className="ml-2 text-indigo-600">{integration.config.endpoint}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {(editingIntegration || isAddingIntegration) && (
        <IntegrationEditor
          integration={editingIntegration || {
            id: `integration-${Date.now()}`,
            name: '',
            type: 'api',
            description: '',
            config: {},
            isActive: true,
          }}
          onSave={handleSaveIntegration}
          onCancel={() => {
            setEditingIntegration(null);
            setIsAddingIntegration(false);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Integration</h3>
            <p className="text-sm text-gray-500">
              Are you sure you want to delete this integration? This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteIntegration(deleteConfirmation)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


interface IntegrationEditorProps {
  integration: Integration;
  onSave: (integration: Integration) => void;
  onCancel: () => void;
}

const IntegrationEditor: React.FC<IntegrationEditorProps> = ({
  integration,
  onSave,
  onCancel,
}) => {
  const [editedIntegration, setEditedIntegration] = useState<Integration>(integration);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedIntegration);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">
          {integration.id ? 'Edit Integration' : 'Create Integration'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={editedIntegration.name}
              onChange={(e) => setEditedIntegration({...editedIntegration, name: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={editedIntegration.description}
              onChange={(e) => setEditedIntegration({...editedIntegration, description: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <select
              value={editedIntegration.type}
              onChange={(e) => setEditedIntegration({
                ...editedIntegration,
                type: e.target.value as Integration['type'],
                config: {}
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="api">API</option>
              <option value="database">Database</option>
              <option value="messaging">Messaging</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {editedIntegration.type === 'api' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IntegrationBuilder;
