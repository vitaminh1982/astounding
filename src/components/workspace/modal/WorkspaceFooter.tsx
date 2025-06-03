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
    <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onSave}
        className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Save Changes
      </button>
    </div>
  );
};

export default WorkspaceFooter;