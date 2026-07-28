import React from 'react';
import { Save, FolderOpen } from 'lucide-react';
import { WorkflowToolbarProps } from '../types/workflowTypes';

/**
 * Workflow toolbar with save and load actions
 * Provides quick access to workflow persistence operations
 */
const WorkflowToolbar: React.FC<WorkflowToolbarProps> = ({ onSave, onLoad }) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={onSave}
        className="p-2.5 bg-white dark:bg-surface-container-high border border-border dark:border-border rounded-lg shadow-md dark:shadow-gray-900 hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors group"
        aria-label="Save workflow"
      >
        <Save className="w-5 h-5 text-on-surface dark:text-on-surface-variant group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" />
      </button>
      <button
        onClick={onLoad}
        className="p-2.5 bg-white dark:bg-surface-container-high border border-border dark:border-border rounded-lg shadow-md dark:shadow-gray-900 hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors group"
        aria-label="Load workflow"
      >
        <FolderOpen className="w-5 h-5 text-on-surface dark:text-on-surface-variant group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" />
      </button>
    </div>
  );
};

export default WorkflowToolbar;
