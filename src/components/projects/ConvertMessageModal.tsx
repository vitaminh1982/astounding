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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Convert to {type === 'task' ? 'Task' : 'Document'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-gray-600 mb-6">
          This will create a new {type} based on the AI agent's response. You can edit the details
          after creation.
        </p>
        
        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose} 
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Convert
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConvertMessageModal;