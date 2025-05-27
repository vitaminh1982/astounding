import React, { useState } from 'react';

export interface Trigger {
  id: string;
  name: string;
  type: 'schedule' | 'event' | 'webhook' | 'manual';
  description: string;
  config: {
    schedule?: string;
    eventType?: string;
    webhookUrl?: string;
    conditions?: Record<string, any>;
  };
  isActive: boolean;
}

interface TriggerPanelProps {
  workflowId: string;
  triggers?: Trigger[];
  onTriggerChange?: (triggers: Trigger[]) => void;
}

const TriggerPanel: React.FC<TriggerPanelProps> = ({
  workflowId,
  triggers = [],
  onTriggerChange = () => {},
}) => {
  const [editingTrigger, setEditingTrigger] = useState<Trigger | null>(null);
  const [isAddingTrigger, setIsAddingTrigger] = useState(false);

  const handleAddTrigger = () => {
    const newTrigger: Trigger = {
      id: `trigger-${Date.now()}`,
      name: '',
      type: 'manual',
      description: '',
      config: {},
      isActive: true,
    };
    setEditingTrigger(newTrigger);
    setIsAddingTrigger(true);
  };

  const handleSaveTrigger = (trigger: Trigger) => {
    if (isAddingTrigger) {
      onTriggerChange([...triggers, trigger]);
    } else {
      onTriggerChange(
        triggers.map(t => t.id === trigger.id ? trigger : t)
      );
    }
    setEditingTrigger(null);
    setIsAddingTrigger(false);
  };

  const handleDeleteTrigger = (triggerId: string) => {
    onTriggerChange(triggers.filter(t => t.id !== triggerId));
  };

  const handleToggleTrigger = (triggerId: string) => {
    onTriggerChange(
      triggers.map(t =>
        t.id === triggerId ? { ...t, isActive: !t.isActive } : t
      )
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 p-4 border-b">
        <h2 className="text-lg font-semibold">Workflow Triggers</h2>
        <button
          onClick={handleAddTrigger}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Trigger
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {triggers && triggers.length > 0 ? (
          <div className="space-y-4">
            {triggers.map((trigger) => (
              <div
                key={trigger.id}
                className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg">{trigger.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{trigger.description}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setEditingTrigger(trigger)}
                      className="text-gray-600 hover:text-indigo-600 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleTrigger(trigger.id)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        trigger.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {trigger.isActive ? 'Active' : 'Inactive'}
                    </button>
                    <button
                      onClick={() => handleDeleteTrigger(trigger.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="mt-3 text-sm">
                  <div className="flex items-center text-gray-600">
                    <span className="font-medium mr-2">Type:</span>
                    <span className="capitalize">{trigger.type}</span>
                  </div>
                  {trigger.type === 'schedule' && trigger.config.schedule && (
                    <div className="mt-1 text-gray-600">
                      <span className="font-medium mr-2">Schedule:</span>
                      {trigger.config.schedule}
                    </div>
                  )}
                  {trigger.type === 'webhook' && trigger.config.webhookUrl && (
                    <div className="mt-1 text-gray-600">
                      <span className="font-medium mr-2">Webhook URL:</span>
                      <span className="text-indigo-600">{trigger.config.webhookUrl}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="rounded-full bg-gray-100 p-4 mb-4">
              <svg 
                className="h-8 w-8 text-gray-400"
                fill="none" 
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No triggers configured
            </h3>
            <p className="text-gray-500 max-w-sm">
              Add your first trigger to start automating your workflow
            </p>
          </div>
        )}
      </div>

      {(editingTrigger || isAddingTrigger) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              {isAddingTrigger ? 'Create Trigger' : 'Edit Trigger'}
            </h2>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              if (editingTrigger) {
                handleSaveTrigger(editingTrigger);
              }
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={editingTrigger.name}
                  onChange={(e) => setEditingTrigger({...editingTrigger, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={editingTrigger.description}
                  onChange={(e) => setEditingTrigger({...editingTrigger, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={editingTrigger.type}
                  onChange={(e) => setEditingTrigger({
                    ...editingTrigger,
                    type: e.target.value as Trigger['type'],
                    config: {}
                  })}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="schedule">Schedule</option>
                  <option value="event">Event</option>
                  <option value="webhook">Webhook</option>
                  <option value="manual">Manual</option>
                </select>
              </div>

              {editingTrigger.type === 'schedule' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Schedule (Cron Expression)
                  </label>
                  <input
                    type="text"
                    value={editingTrigger.config.schedule || ''}
                    onChange={(e) => setEditingTrigger({
                      ...editingTrigger,
                      config: {
                        ...editingTrigger.config,
                        schedule: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="*/5 * * * *"
                  />
                </div>
              )}

              {editingTrigger.type === 'webhook' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Webhook URL
                  </label>
                  <input
                    type="url"
                    value={editingTrigger.config.webhookUrl || ''}
                    onChange={(e) => setEditingTrigger({
                      ...editingTrigger,
                      config: {
                        ...editingTrigger.config,
                        webhookUrl: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="https://"
                  />
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditingTrigger(null);
                    setIsAddingTrigger(false);
                  }}
                  className="px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  {isAddingTrigger ? 'Create' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TriggerPanel;
