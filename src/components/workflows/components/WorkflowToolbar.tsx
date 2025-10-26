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
        className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
        aria-label="Save workflow"
      >
        <Save className="w-5 h-5 text-gray-700 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-teal-400 transition-colors" />
      </button>
      <button
        onClick={onLoad}
        className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
        aria-label="Load workflow"
      >
        <FolderOpen className="w-5 h-5 text-gray-700 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-teal-400 transition-colors" />
      </button>
    </div>
  );
};

export default WorkflowToolbar;
