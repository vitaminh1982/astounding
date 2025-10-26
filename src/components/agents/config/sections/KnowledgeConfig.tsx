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
      <h3 className="text-lg font-semibold">Skills & Knowledge</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="font-medium">Knowledge Base</h4>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 dark:bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-teal-700 transition-colors shadow-sm dark:shadow-gray-900"
        >
            <Plus className="w-4 h-4" />
            Add Document
          </button>
        </div>
        
        {knowledgeConfig.bases.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {knowledgeConfig.bases.map((doc) => (
              <div key={doc} className="flex items-center justify-between border rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="truncate">{doc}</span>
                </div>
                <button
                  onClick={() => removeDocument(doc)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Remove document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border rounded-lg bg-gray-50">
            <FileText className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No knowledge documents added yet</p>
            <p className="text-sm text-gray-400 mt-1 mb-4">Add documents that your agent can learn from.</p>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Document
            </button>
          </div>
        )}
      </div>
      
      <div>
        <h4 className="font-medium mb-3">Languages</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {knowledgeConfig.languages.map((lang) => (
            <div key={lang.code} className="border rounded-lg p-3">
              <div className="flex items-center gap-2 font-medium">
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </div>
              <div className="text-sm text-gray-600 mt-1">{lang.level}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Add Document Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">Add Knowledge Document</h3>
              <p className="text-sm text-gray-500 mt-1">
                Upload documents to train your AI agent
              </p>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label htmlFor="document-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Document Name
                </label>
                <input
                  type="text"
                  id="document-name"
                  placeholder="Enter a descriptive name"
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  disabled={isUploading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload File
                </label>
                
                {selectedFile ? (
                  <div className="border border-gray-300 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <div className="truncate">
                          <p className="truncate font-medium">{selectedFile.name}</p>
                          <p className="text-xs text-gray-500">
                            {(selectedFile.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setSelectedFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="text-gray-400 hover:text-red-500"
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
                              <span className="text-xs font-medium text-indigo-600">
                                {uploadProgress}% Complete
                              </span>
                            </div>
                          </div>
                          <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-gray-200">
                            <div
                              style={{ width: `${uploadProgress}%` }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600 transition-all duration-300"
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500 transition-colors"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
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
              
              <div className="border-t pt-3">
                <h5 className="font-medium text-sm mb-2">Supported Document Types</h5>
                <div className="space-y-1">
                  {DOCUMENT_TYPES.map(type => (
                    <div key={type.id} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      <span>{type.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t flex gap-2 justify-end">
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setDocumentName('');
                  setSelectedFile(null);
                  setUploadProgress(0);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                onClick={handleAddDocument}
                className={`px-4 py-2 rounded-lg ${
                  isUploading || !documentName.trim() || !selectedFile
                    ? 'bg-indigo-300 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
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
