import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Circle, AlertTriangle, RefreshCw, Bell, Code } from 'lucide-react';

export interface ErrorHandler {
  id: string;
  name: string;
  description: string;
  type: 'retry' | 'fallback' | 'notification' | 'custom';
  config: {
    maxRetries?: number;
    retryDelay?: number;
    fallbackAction?: string;
    notificationChannels?: string[];
    customHandler?: string;
  };
  isActive: boolean;
  lastTriggered?: string;
  errorCount?: number;
}

interface ErrorHandlingProps {
  workflowId: string;
  errorHandlers?: ErrorHandler[];
  onErrorHandlerChange?: (handlers: ErrorHandler[]) => void;
  isLoading?: boolean;
  error?: string;
}

const ErrorHandling: React.FC<ErrorHandlingProps> = ({
  workflowId,
  errorHandlers = [],
  onErrorHandlerChange = () => {},
  isLoading = false,
  error,
}) => {
  const [editingHandler, setEditingHandler] = useState<ErrorHandler | null>(null);
  const [isAddingHandler, setIsAddingHandler] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHandlers = errorHandlers.filter(handler => 
    handler.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    handler.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getHandlerIcon = (type: ErrorHandler['type']) => {
    const icons = {
      retry: <RefreshCw className="w-5 h-5" />,
      fallback: <AlertTriangle className="w-5 h-5" />,
      notification: <Bell className="w-5 h-5" />,
      custom: <Code className="w-5 h-5" />,
    };
    return icons[type];
  };

    const handleSaveHandler = (handler: ErrorHandler) => {
    if (isAddingHandler) {
      onErrorHandlerChange([...errorHandlers, handler]);
    } else {
      onErrorHandlerChange(
        errorHandlers.map(h => h.id === handler.id ? handler : h)
      );
    }
    setEditingHandler(null);
    setIsAddingHandler(false);
  };

  const handleDeleteHandler = (handlerId: string) => {
    onErrorHandlerChange(errorHandlers.filter(h => h.id !== handlerId));
  };

  const getHandlerTypeColor = (type: ErrorHandler['type']) => {
    const colors = {
      retry: 'text-blue-600 bg-blue-100',
      fallback: 'text-yellow-600 bg-yellow-100',
      notification: 'text-purple-600 bg-purple-100',
      custom: 'text-gray-600 bg-gray-100',
    };
    return colors[type];
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
          <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
          <p className="text-lg font-medium">Error loading error handlers</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold">Error Handling</h2>
            <p className="text-sm text-gray-500">
              Configure how your workflow handles errors and exceptions
            </p>
          </div>
          <button
            onClick={() => setIsAddingHandler(true)}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Handler
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search handlers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {filteredHandlers.length === 0 ? (
          <div className="text-center py-12">
            <div className="rounded-full bg-red-100 p-3 mx-auto w-fit">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No error handlers</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery ? 'No handlers match your search criteria.' : 'Start by adding an error handler to your workflow.'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setIsAddingHandler(true)}
                className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Handler
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHandlers.map((handler) => (
              <div
                key={handler.id}
                className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-md ${getHandlerTypeColor(handler.type)} mr-3`}>
                        {getHandlerIcon(handler.type)}
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">{handler.name}</h3>
                        <p className="text-sm text-gray-500">{handler.description}</p>
                      </div>
                      <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        handler.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        <Circle className="w-2 h-2 mr-1" fill={handler.isActive ? 'currentColor' : 'none'} />
                        {handler.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => setEditingHandler(handler)}
                      className="p-1 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-gray-100"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmation(handler.id)}
                      className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-100"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 bg-gray-50 rounded-md p-4">
                  {handler.type === 'retry' && (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Max Retries:</span>
                        <span className="ml-2">{handler.config.maxRetries || 3}</span>
                      </div>
                      <div>
                        <span className="font-medium">Delay:</span>
                        <span className="ml-2">{handler.config.retryDelay || 5000}ms</span>
                      </div>
                    </div>
                  )}
                  {handler.type === 'fallback' && (
                    <div>
                      <span className="font-medium">Fallback Action:</span>
                      <pre className="mt-2 text-sm bg-white p-2 rounded border">
                        {handler.config.fallbackAction}
                      </pre>
                    </div>
                  )}
                  {handler.type === 'notification' && (
                    <div>
                      <span className="font-medium">Notification Channels:</span>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {handler.config.notificationChannels?.map((channel) => (
                          <span
                            key={channel}
                            className="px-2 py-1 bg-white rounded-full text-sm border"
                          >
                            {channel}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {handler.lastTriggered && (
                  <div className="mt-3 text-xs text-gray-500 flex items-center">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Last triggered: {new Date(handler.lastTriggered).toLocaleString()}
                    {handler.errorCount !== undefined && (
                      <span className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-800 rounded-full">
                        {handler.errorCount} errors
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ErrorHandlerEditor Modal */}
  {(editingHandler || isAddingHandler) && (
    <ErrorHandlerEditor
      handler={editingHandler || {
        id: `error-handler-${Date.now()}`,
        name: '',
        description: '',
        type: 'retry',
        config: {},
        isActive: true,
      }}
      onSave={handleSaveHandler} // Now this function exists
      onCancel={() => {
        setEditingHandler(null);
        setIsAddingHandler(false);
      }}
    />
  )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Error Handler</h3>
            <p className="text-sm text-gray-500">
              Are you sure you want to delete this error handler? This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDeleteHandler(deleteConfirmation);
                  setDeleteConfirmation(null);
                }}
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


interface ErrorHandlerEditorProps {
  handler: ErrorHandler;
  onSave: (handler: ErrorHandler) => void;
  onCancel: () => void;
}

const ErrorHandlerEditor: React.FC<ErrorHandlerEditorProps> = ({
  handler,
  onSave,
  onCancel,
}) => {
  const [editedHandler, setEditedHandler] = useState<ErrorHandler>(handler);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedHandler);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">
          {handler.id ? 'Edit Error Handler' : 'Create Error Handler'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={editedHandler.name}
              onChange={(e) => setEditedHandler({...editedHandler, name: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={editedHandler.description}
              onChange={(e) => setEditedHandler({...editedHandler, description: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <select
              value={editedHandler.type}
              onChange={(e) => setEditedHandler({
                ...editedHandler,
                type: e.target.value as ErrorHandler['type'],
                config: {} // Reset config when type changes
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="retry">Retry</option>
              <option value="fallback">Fallback</option>
              <option value="notification">Notification</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {/* Conditional config fields based on type */}
          {editedHandler.type === 'retry' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Max Retries
                </label>
                <input
                  type="number"
                  value={editedHandler.config.maxRetries || ''}
                  onChange={(e) => setEditedHandler({
                    ...editedHandler,
                    config: {
                      ...editedHandler.config,
                      maxRetries: parseInt(e.target.value)
                    }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Retry Delay (ms)
                </label>
                <input
                  type="number"
                  value={editedHandler.config.retryDelay || ''}
                  onChange={(e) => setEditedHandler({
                    ...editedHandler,
                    config: {
                      ...editedHandler.config,
                      retryDelay: parseInt(e.target.value)
                    }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
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

export default ErrorHandling;
