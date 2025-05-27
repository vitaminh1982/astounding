// src/components/documents/DocumentsHeader.tsx
import React from 'react';

interface DocumentsHeaderProps {
  onUpload?: () => void;
}

const DocumentsHeader: React.FC<DocumentsHeaderProps> = ({ onUpload }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="mt-1 text-sm text-gray-500">
            Import and manage documents to train your AI agents
          </p>
        </div>
        <button
          onClick={onUpload}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Import a document
        </button>
      </div>
    </div>
  );
};

export default DocumentsHeader;
