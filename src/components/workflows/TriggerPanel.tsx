import React, { useState, useContext, useCallback, useMemo } from 'react';
import { Plus, Edit2, Trash2, Clock, Zap, Webhook, PlayCircle, Power, X } from 'lucide-react';

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

  // Memoized trigger type icons and colors
  const triggerTypeConfig = useMemo(() => ({
    schedule: {
      icon: Clock,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    event: {
      icon: Zap,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800'
    },
    webhook: {
      icon: Webhook,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800'
    },
    manual: {
      icon: PlayCircle,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800'
    }
  }), []);

  const handleAddTrigger = useCallback(() => {
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
  }, []);

  const handleSaveTrigger = useCallback((trigger: Trigger) => {
    if (isAddingTrigger) {
      onTriggerChange([...triggers, trigger]);
    } else {
      onTriggerChange(
        triggers.map(t => t.id === trigger.id ? trigger : t)
      );
    }
    setEditingTrigger(null);
    setIsAddingTrigger(false);
  }, [isAddingTrigger, triggers, onTriggerChange]);

  const handleDeleteTrigger = useCallback((triggerId: string) => {
    onTriggerChange(triggers.filter(t => t.id !== triggerId));
  }, [triggers, onTriggerChange]);

  const handleToggleTrigger = useCallback((triggerId: string) => {
    onTriggerChange(
      triggers.map(t =>
        t.id === triggerId ? { ...t, isActive: !t.isActive } : t
      )
    );
  }, [triggers, onTriggerChange]);

  const handleCloseModal = useCallback(() => {
    setEditingTrigger(null);
    setIsAddingTrigger(false);
  }, []);

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors">
            Workflow Triggers
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors">
            Configure automated triggers for your workflow
          </p>
        </div>
        <button
          onClick={handleAddTrigger}
          className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 flex items-center gap-2 shadow-sm hover:shadow-md transition-all duration-200"
          aria-label="Add new trigger"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Trigger</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        {triggers && triggers.length > 0 ? (
          <div className="space-y-4">
            {triggers.map((trigger) => {
              const typeConfig = triggerTypeConfig[trigger.type];
              const TypeIcon = typeConfig.icon;

              return (
                <div
                  key={trigger.id}
                  className={`p-4 border ${typeConfig.borderColor} rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200`}
                >
                  {/* Trigger Header */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${typeConfig.bgColor} flex items-center justify-center transition-colors`}>
                        <TypeIcon className={`w-5 h-5 ${typeConfig.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-lg text-gray-900 dark:text-gray-100 truncate transition-colors">
                          {trigger.name || 'Untitled Trigger'}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2 transition-colors">
                          {trigger.description || 'No description provided'}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => setEditingTrigger(trigger)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all duration-200"
                        aria-label="Edit trigger"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleTrigger(trigger.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                          trigger.isActive
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
                        }`}
                        aria-label={trigger.isActive ? 'Deactivate trigger' : 'Activate trigger'}
                      >
                        <Power className="w-3 h-3" />
                        {trigger.isActive ? 'Active' : 'Inactive'}
                      </button>
                      <button
                        onClick={() => handleDeleteTrigger(trigger.id)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                        aria-label="Delete trigger"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Trigger Details */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2 transition-colors">
                    <div className="flex items-center text-sm">
                      <span className="font-medium text-gray-700 dark:text-gray-300 mr-2 transition-colors">
                        Type:
                      </span>
                      <span className={`capitalize px-2 py-1 rounded-md ${typeConfig.bgColor} ${typeConfig.color} text-xs font-medium`}>
                        {trigger.type}
                      </span>
                    </div>
                    
                    {trigger.type === 'schedule' && trigger.config.schedule && (
                      <div className="flex items-center text-sm">
                        <span className="font-medium text-gray-700 dark:text-gray-300 mr-2 transition-colors">
                          Schedule:
                        </span>
                        <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-xs font-mono transition-colors">
                          {trigger.config.schedule}
                        </code>
                      </div>
                    )}
                    
                    {trigger.type === 'event' && trigger.config.eventType && (
                      <div className="flex items-center text-sm">
                        <span className="font-medium text-gray-700 dark:text-gray-300 mr-2 transition-colors">
                          Event:
                        </span>
                        <span className="text-gray-600 dark:text-gray-400 transition-colors">
                          {trigger.config.eventType}
                        </span>
                      </div>
                    )}
                    
                    {trigger.type === 'webhook' && trigger.config.webhookUrl && (
                      <div className="flex items-start text-sm">
                        <span className="font-medium text-gray-700 dark:text-gray-300 mr-2 flex-shrink-0 transition-colors">
                          Webhook:
                        </span>
                        <a
                          href={trigger.config.webhookUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 break-all transition-colors"
                        >
                          {trigger.config.webhookUrl}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4 transition-colors">
              <Zap className="h-8 w-8 text-gray-400 dark:text-gray-500 transition-colors" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 transition-colors">
              No triggers configured
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-6 transition-colors">
              Add your first trigger to start automating your workflow. Choose from schedules, events, webhooks, or manual triggers.
            </p>
            <button
              onClick={handleAddTrigger}
              className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 flex items-center gap-2 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              Add Your First Trigger
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {(editingTrigger || isAddingTrigger) && editingTrigger && (
        <div 
          className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-colors"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between transition-colors">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 transition-colors">
                {isAddingTrigger ? 'Create Trigger' : 'Edit Trigger'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveTrigger(editingTrigger);
              }} 
              className="p-6 space-y-5"
            >
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editingTrigger.name}
                  onChange={(e) => setEditingTrigger({...editingTrigger, name: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors"
                  placeholder="Enter trigger name"
                  required
                />
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                  Description
                </label>
                <textarea
                  value={editingTrigger.description}
                  onChange={(e) => setEditingTrigger({...editingTrigger, description: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors resize-none"
                  rows={3}
                  placeholder="Describe what this trigger does"
                />
              </div>

              {/* Type Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={editingTrigger.type}
                  onChange={(e) => setEditingTrigger({
                    ...editingTrigger,
                    type: e.target.value as Trigger['type'],
                    config: {}
                  })}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors"
                >
                  <option value="schedule">Schedule</option>
                  <option value="event">Event</option>
                  <option value="webhook">Webhook</option>
                  <option value="manual">Manual</option>
                </select>
              </div>

              {/* Conditional Fields Based on Type */}
              {editingTrigger.type === 'schedule' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
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
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors font-mono text-sm"
                    placeholder="*/5 * * * *"
                  />
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 transition-colors">
                    Example: <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">*/5 * * * *</code> runs every 5 minutes
                  </p>
                </div>
              )}

              {editingTrigger.type === 'event' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                    Event Type
                  </label>
                  <input
                    type="text"
                    value={editingTrigger.config.eventType || ''}
                    onChange={(e) => setEditingTrigger({
                      ...editingTrigger,
                      config: {
                        ...editingTrigger.config,
                        eventType: e.target.value
                      }
                    })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors"
                    placeholder="e.g., user.created, order.completed"
                  />
                </div>
              )}

              {editingTrigger.type === 'webhook' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
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
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors"
                    placeholder="https://example.com/webhook"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 transition-colors">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2.5 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  {isAddingTrigger ? 'Create Trigger' : 'Save Changes'}
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
