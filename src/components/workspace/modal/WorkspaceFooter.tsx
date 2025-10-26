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
    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-teal-500 dark:focus:ring-offset-gray-800 transition-colors"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onSave}
        className="px-4 py-2 bg-indigo-600 dark:bg-teal-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 dark:hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-teal-500 dark:focus:ring-offset-gray-800 transition-colors"
      >
        Save Changes
      </button>
    </div>
  );
};

export default WorkspaceFooter;
