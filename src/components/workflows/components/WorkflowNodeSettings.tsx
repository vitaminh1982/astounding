import React from 'react';
import { Settings, X } from 'lucide-react';
import { WorkflowNodeSettingsProps } from '../types/workflowTypes';

/**
 * Node settings panel for editing selected workflow node properties
 * Displays editable fields for node name, description, and type
 */
const WorkflowNodeSettings: React.FC<WorkflowNodeSettingsProps> = ({
  selectedNode,
  onClose,
  onUpdateNode,
}) => {
  if (!selectedNode) return null;

  const handleLabelChange = (value: string) => {
    onUpdateNode(selectedNode.id, { label: value });
  };

  const handleDescriptionChange = (value: string) => {
    onUpdateNode(selectedNode.id, { description: value });
  };

  return (
    <div className="bg-white dark:bg-surface-container-high border border-border dark:border-border p-5 rounded-xl shadow-xl dark:shadow-gray-900 w-80 transition-colors">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border dark:border-border">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground dark:text-foreground transition-colors">
            <Settings className="w-5 h-5 text-teal-600 dark:text-teal-400 transition-colors" strokeWidth={2.5} />
            Node Settings
          </h3>
          <button
            onClick={onClose}
            className="text-muted-foreground dark:text-muted-foreground hover:text-on-surface dark:hover:text-on-surface-variant transition-colors rounded-lg p-1 hover:bg-surface-container-low dark:hover:bg-surface-container-highest"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-on-surface dark:text-muted-foreground transition-colors">
              Name
            </label>
            <input
              type="text"
              value={selectedNode.data.label}
              onChange={(e) => handleLabelChange(e.target.value)}
              className="border border-border dark:border-border rounded-lg px-3 py-2 text-sm bg-white dark:bg-surface-container-highest text-foreground dark:text-foreground placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-ring dark:focus:ring-teal-400 focus:border-teal-500 dark:focus:border-teal-400 transition-all"
              placeholder="Enter node name"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-on-surface dark:text-muted-foreground transition-colors">
              Description
            </label>
            <textarea
              value={selectedNode.data.description || ''}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              className="border border-border dark:border-border rounded-lg px-3 py-2 text-sm bg-white dark:bg-surface-container-highest text-foreground dark:text-foreground placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-ring dark:focus:ring-teal-400 focus:border-teal-500 dark:focus:border-teal-400 transition-all resize-none"
              rows={3}
              placeholder="Enter description"
            />
          </div>

          {/* Node Type Badge */}
          <div className="flex items-center gap-2 pt-2">
            <span className="text-xs font-medium text-muted-foreground dark:text-muted-foreground transition-colors">Type:</span>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 transition-colors">
              {selectedNode.data.type}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowNodeSettings;
