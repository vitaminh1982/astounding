import React from 'react';
import { X } from 'lucide-react';

interface WorkspaceHeaderProps {
  onClose: () => void;
}

/**
 * Header component for the workspace modal
 * Displays the title and close button
 */
const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({ onClose }) => {
  return (
    <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Workspace Management</h2>
      <button
        onClick={onClose}
        className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none transition-colors"
        aria-label="Close modal"
      >
        <X className="w-6 h-6" />
      </button>
    </div>
  );
};

export default WorkspaceHeader;
