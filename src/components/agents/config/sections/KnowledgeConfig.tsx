import React, { useState, useRef } from 'react';
import { Plus, FileText, XCircle, Upload, Trash2, CheckCircle } from 'lucide-react';

interface KnowledgeConfigProps {
  config: {
    bases: string[];
    languages: {
      code: string;
      name: string;
      flag: string;
      level: string;
    }[];
  };
  onChange: (config: any) => void;
}

// Simulated document types that can be uploaded
const DOCUMENT_TYPES = [
  { id: 'pdf', label: 'PDF Documents', extensions: '.pdf' },
  { id: 'docx', label: 'Word Documents', extensions: '.docx,.doc' },
  { id: 'txt', label: 'Text Files', extensions: '.txt' },
  { id: 'md', label: 'Markdown Files', extensions: '.md' },
];

export default function KnowledgeConfig({ config, onChange }: KnowledgeConfigProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [knowledgeConfig, setKnowledgeConfig] = useState(config);
  const [documentName, setDocumentName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBaseChange = (base: string, checked: boolean) => {
    const updatedConfig = {
      ...knowledgeConfig,
      bases: checked
        ? [...knowledgeConfig.bases, base]
        : knowledgeConfig.bases.filter(b => b !== base)
    };
    
    setKnowledgeConfig(updatedConfig);
    onChange(updatedConfig);
  };

  const handleAddDocument = () => {
    if (!documentName.trim() || !selectedFile) return;
    
    // Simulate file upload with progress
    setIsUploading(true);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          
          // Add the new document to the knowledge base
          const newDocumentName = `${documentName.trim()}.${selectedFile.name.split('.').pop()}`;
          const updatedConfig = {
            ...knowledgeConfig,
            bases: [...knowledgeConfig.bases, newDocumentName]
          };
          
          setKnowledgeConfig(updatedConfig);
          onChange(updatedConfig);
          
          // Reset the form
          setDocumentName('');
          setSelectedFile(null);
          setUploadProgress(0);
          setIsAddModalOpen(false);
          
          return 0;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      // Auto-populate the document name field with the file name (without extension)
      const fileName = e.target.files[0].name;
      setDocumentName(fileName.substring(0, fileName.lastIndexOf('.')));
    }
  };

  const removeDocument = (documentToRemove: string) => {
    const updatedConfig = {
      ...knowledgeConfig,
      bases: knowledgeConfig.bases.filter(doc => doc !== documentToRemove)
    };
    
    setKnowledgeConfig(updatedConfig);
    onChange(updatedConfig);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Skills & Knowledge</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-gray-900 dark:text-gray-100">Knowledge Base</h4>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 dark:bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-teal-700 transition-colors shadow-sm dark:shadow-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            <Plus className="w-4 h-4" />
            Add Document
          </button>
        </div>
        
        {knowledgeConfig.bases.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {knowledgeConfig.bases.map((doc) => (
              <div key={doc} className="flex items-center justify-between border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg p-3 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 dark:bg-teal-900 rounded-lg transition-colors">
                    <FileText className="w-4 h-4 text-blue-600 dark:text-teal-300" />
                  </div>
                  <span className="truncate text-gray-900 dark:text-gray-100">{doc}</span>
                </div>
                <button
                  onClick={() => removeDocument(doc)}
                  className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-700 rounded-sm"
                  title="Remove document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 transition-colors">
            <FileText className="w-10 h-10 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No knowledge documents added yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 mb-4">Add documents that your agent can learn from.</p>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-indigo-600 dark:bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-teal-700 transition-colors shadow-sm dark:shadow-gray-900 mx-auto focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-700"
            >
              <Plus className="w-4 h-4" />
              Add Document
            </button>
          </div>
        )}
      </div>
      
      <div>
        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Languages</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {knowledgeConfig.languages.map((lang) => (
            <div key={lang.code} className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg p-3 transition-colors">
              <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{lang.level}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Add Document Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex items-center justify-center z-50 p-4 transition-colors">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl dark:shadow-gray-900 w-full max-w-md flex flex-col transition-colors">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Add Knowledge Document</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Upload documents to train your AI agent
              </p>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label htmlFor="document-name" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Document Name
                </label>
                <input
                  type="text"
                  id="document-name"
                  placeholder="Enter a descriptive name"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  disabled={isUploading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Upload File
                </label>
                
                {selectedFile ? (
                  <div className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg p-3 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600 dark:text-teal-400" />
                        <div className="truncate">
                          <p className="truncate font-medium text-gray-900 dark:text-gray-100">{selectedFile.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {(selectedFile.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setSelectedFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-700 rounded-sm transition-colors"
                        disabled={isUploading}
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                    
                    {isUploading && (
                      <div className="mt-3">
                        <div className="relative pt-1">
                          <div className="flex mb-1 items-center justify-between">
                            <div>
                              <span className="text-xs font-medium text-indigo-600 dark:text-teal-400">
                                {uploadProgress}% Complete
                              </span>
                            </div>
                          </div>
                          <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-gray-200 dark:bg-gray-600">
                            <div
                              style={{ width: `${uploadProgress}%` }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600 dark:bg-teal-500 transition-all duration-300"
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500 dark:hover:border-teal-500 transition-colors"
                  >
                    <Upload className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      PDFs, DOC, TXT, MD up to 10MB
                    </p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.txt,.md"
                      className="hidden"
                      disabled={isUploading}
                    />
                  </div>
                )}
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <h5 className="font-medium text-sm text-gray-900 dark:text-gray-100 mb-2">Supported Document Types</h5>
                <div className="space-y-1">
                  {DOCUMENT_TYPES.map(type => (
                    <div key={type.id} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                      <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
                      <span>{type.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2 justify-end">
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setDocumentName('');
                  setSelectedFile(null);
                  setUploadProgress(0);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                onClick={handleAddDocument}
                className={`px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                  isUploading || !documentName.trim() || !selectedFile
                    ? 'bg-indigo-300 dark:bg-teal-700 text-white cursor-not-allowed opacity-50'
                    : 'bg-indigo-600 dark:bg-teal-600 hover:bg-indigo-700 dark:hover:bg-teal-700 text-white focus:ring-indigo-500 dark:focus:ring-teal-500'
                }`}
                disabled={isUploading || !documentName.trim() || !selectedFile}
              >
                {isUploading ? 'Uploading...' : 'Add Document'}
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}
