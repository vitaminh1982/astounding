/**
 * Documents tab component for project deliverables
 */
import React from 'react';
import { FileText } from 'lucide-react';

/**
 * DocumentsTab displays project documents and deliverables
 */
const DocumentsTab: React.FC = () => {
  return (
    <div className="p-6 h-full flex items-center justify-center">
      <div className="text-center">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Deliverable Management</h3>
        <p className="text-gray-500 mb-4">AI-generated documents and project artifacts will appear here.</p>
        <div className="flex justify-center gap-3">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Generate Document
          </button>
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
            Upload Document
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentsTab;