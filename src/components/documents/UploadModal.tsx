// src/components/documents/UploadModal.tsx
import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onUpload(selectedFile);
      onClose();
      setSelectedFile(null);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-60 z-50" onClick={onClose} />
      
      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-surface-container-high rounded-lg shadow-xl dark:shadow-gray-900 p-6 z-50 w-full max-w-md border border-border dark:border-border transition-colors">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-foreground dark:text-foreground transition-colors">Upload a document</h3>
          <button
            onClick={onClose}
            className="text-outline dark:text-muted-foreground hover:text-muted-foreground dark:hover:text-outline p-2 rounded-lg hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div
          className={`mt-4 p-6 border-2 border-dashed rounded-lg transition-all ${
            dragActive 
              ? 'border-primary-green dark:border-teal-500 bg-indigo-50 dark:bg-teal-900/20' 
              : 'border-border dark:border-border hover:border-outline-variant dark:hover:border-outline'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-outline dark:text-muted-foreground transition-colors" />
            <div className="mt-4">
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-primary-green dark:text-teal-400 hover:text-indigo-500 dark:hover:text-teal-300 transition-colors">
                  Click to upload
                </span>
                <input
                  id="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </label>
              <p className="pl-1 text-muted-foreground dark:text-muted-foreground transition-colors">or drag and drop here</p>
            </div>
          </div>
        </div>

        {selectedFile && (
          <div className="mt-4 p-4 bg-surface-container-low dark:bg-surface-container-highest/50 rounded-lg border border-border dark:border-border transition-colors">
            <p className="text-sm text-muted-foreground dark:text-muted-foreground transition-colors">Selected file:</p>
            <p className="font-medium text-foreground dark:text-foreground transition-colors">{selectedFile.name}</p>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-on-surface dark:text-muted-foreground bg-white dark:bg-surface-container-highest border border-border dark:border-border rounded-md hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!selectedFile}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors shadow-sm dark:shadow-gray-900 ${
              selectedFile
                ? 'bg-primary dark:bg-teal-600 hover:bg-indigo-700 dark:hover:bg-teal-700'
                : 'bg-indigo-400 dark:bg-teal-400 cursor-not-allowed'
            }`}
          >
            Upload
          </button>
        </div>
      </div>
    </>
  );
};

export default UploadModal;
