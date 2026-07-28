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
    <div className="flex justify-between items-center px-6 py-4 border-b border-border dark:border-border">
      <h2 className="text-xl font-semibold text-foreground dark:text-foreground">Workspace Management</h2>
      <button
        onClick={onClose}
        className="text-outline dark:text-muted-foreground hover:text-muted-foreground dark:hover:text-muted-foreground focus:outline-none transition-colors"
        aria-label="Close modal"
      >
        <X className="w-6 h-6" />
      </button>
    </div>
  );
};

export default WorkspaceHeader;
