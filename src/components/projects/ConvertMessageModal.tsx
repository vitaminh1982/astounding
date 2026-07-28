import React from 'react';
import { X } from 'lucide-react';

interface ConvertMessageModalProps {
  isOpen: boolean;
  type: 'task' | 'document';
  onClose: () => void;
  onConfirm: () => void;
}

const ConvertMessageModal: React.FC<ConvertMessageModalProps> = ({
  isOpen,
  type,
  onClose,
  onConfirm
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-surface-container-high rounded-lg p-6 max-w-md w-full mx-4 shadow-lg dark:shadow-gray-900 border border-border dark:border-border transition-colors">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-foreground dark:text-foreground">
            Convert to {type === 'task' ? 'Task' : 'Document'}
          </h3>
          <button
            onClick={onClose}
            className="text-outline dark:text-muted-foreground hover:text-muted-foreground dark:hover:text-outline transition-colors p-1 rounded hover:bg-surface-container-low dark:hover:bg-surface-container-highest"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-muted-foreground dark:text-muted-foreground mb-6">
          This will create a new {type} based on the AI agent's response. You can edit the details
          after creation.
        </p>
        
        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose} 
            className="px-4 py-2 border border-border dark:border-border text-on-surface dark:text-muted-foreground rounded-lg hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            className="px-4 py-2 bg-primary dark:bg-teal-600 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-teal-700 transition-colors shadow-sm dark:shadow-gray-900"
          >
            Convert
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConvertMessageModal;
