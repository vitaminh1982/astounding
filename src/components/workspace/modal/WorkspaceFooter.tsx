import React from 'react';

interface WorkspaceFooterProps {
  onClose: () => void;
  onSave: () => void;
}

/**
 * Footer component for the workspace modal
 * Contains action buttons (cancel and save)
 */
const WorkspaceFooter: React.FC<WorkspaceFooterProps> = ({ onClose, onSave }) => {
  return (
    <div className="px-6 py-4 bg-surface-container-low dark:bg-surface-container-high border-t border-border dark:border-border flex justify-end space-x-3">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 border border-border dark:border-border rounded-md shadow-sm text-sm font-medium text-on-surface dark:text-on-surface-variant bg-white dark:bg-surface-container-highest hover:bg-surface-container-low dark:hover:bg-surface-container-highest focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring dark:focus:ring-ring dark:focus:ring-offset-gray-800 transition-colors"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onSave}
        className="px-4 py-2 bg-primary dark:bg-green-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 dark:hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring dark:focus:ring-ring dark:focus:ring-offset-gray-800 transition-colors"
      >
        Save Changes
      </button>
    </div>
  );
};

export default WorkspaceFooter;
