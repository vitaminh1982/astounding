/**
 * Documents tab component for project deliverables - Simplified version
 */
import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Upload, 
  Search,
  Sparkles,
  FolderOpen
} from 'lucide-react';
import DocumentCard from './DocumentCard';
import { Document } from '../types';

// Sample data
const INITIAL_DOCUMENTS: Document[] = [
  {
    id: 'doc-001',
    name: 'Project Requirements Document',
    description: 'Comprehensive requirements analysis for the digital transformation project including functional and non-functional specifications',
    type: 'pdf',
    size: 2457600,
    generatedBy: 'Ikki',
    createdAt: new Date('2025-01-15T10:30:00'),
    status: 'final',
    isAIGenerated: true,
    category: 'requirements'
  },
  {
    id: 'doc-002',
    name: 'Technical Architecture Design',
    description: 'System architecture diagrams and technical specifications for the platform infrastructure',
    type: 'pdf',
    size: 3145728,
    generatedBy: 'Shiryu',
    createdAt: new Date('2025-01-16T14:20:00'),
    status: 'final',
    isAIGenerated: true,
    category: 'technical'
  },
  {
    id: 'doc-003',
    name: 'Risk Assessment Report',
    description: 'Comprehensive risk analysis with mitigation strategies and contingency plans',
    type: 'docx',
    size: 1048576,
    generatedBy: 'Hyôga',
    createdAt: new Date('2025-01-17T09:15:00'),
    status: 'review',
    isAIGenerated: true,
    category: 'analysis'
  },
  {
    id: 'doc-004',
    name: 'Project Timeline Gantt Chart',
    description: 'Detailed project schedule with milestones, dependencies, and resource allocation',
    type: 'xlsx',
    size: 524288,
    generatedBy: 'Seiya',
    createdAt: new Date('2025-01-18T11:45:00'),
    status: 'final',
    isAIGenerated: true,
    category: 'planning'
  },
  {
    id: 'doc-005',
    name: 'User Interface Mockups',
    description: 'High-fidelity UI/UX designs for the main application interfaces and workflows',
    type: 'pdf',
    size: 5242880,
    generatedBy: 'Shun',
    createdAt: new Date('2025-01-19T13:00:00'),
    status: 'draft',
    isAIGenerated: false,
    category: 'design'
  },
  {
    id: 'doc-006',
    name: 'API Documentation',
    description: 'Complete API reference with endpoints, authentication, and integration examples',
    type: 'html',
    size: 819200,
    generatedBy: 'Shiryu',
    createdAt: new Date('2025-01-20T10:00:00'),
    status: 'review',
    isAIGenerated: true,
    category: 'technical'
  },
  {
    id: 'doc-007',
    name: 'Compliance Checklist',
    description: 'Industry standards compliance verification and certification requirements',
    type: 'pdf',
    size: 716800,
    generatedBy: 'Shun',
    createdAt: new Date('2025-01-21T15:30:00'),
    status: 'final',
    isAIGenerated: true,
    category: 'compliance'
  },
  {
    id: 'doc-008',
    name: 'Testing Strategy Document',
    description: 'QA approach, test cases, and quality assurance procedures',
    type: 'docx',
    size: 1572864,
    generatedBy: 'Ikki',
    createdAt: new Date('2025-01-22T09:20:00'),
    status: 'draft',
    isAIGenerated: true,
    category: 'testing'
  }
];

const DocumentsTab: React.FC = () => {
  const [documents] = useState<Document[]>(INITIAL_DOCUMENTS);
  const [searchQuery, setSearchQuery] = useState('');

  // Simple search filter
  const filteredDocuments = useMemo(() => {
    if (!searchQuery) return documents;
    
    return documents.filter(doc => 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.generatedBy.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [documents, searchQuery]);

  const handleView = (doc: Document) => {
    console.log('Viewing document:', doc.id);
    // Implement document viewer
  };

  const handleDownload = (doc: Document) => {
    console.log('Downloading document:', doc.id);
    // Implement download functionality
  };

  const handleGenerate = () => {
    console.log('Generate new document');
    // Implement AI generation dialog
  };

  const handleUpload = () => {
    console.log('Upload document');
    // Implement file upload
  };

  if (documents.length === 0) {
    return (
      <div className="p-6 h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center mx-auto mb-4 transition-colors">
            <FileText className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No Documents Yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            AI-generated documents and project artifacts will appear here. Get started by generating your first document.
          </p>
          <div className="flex justify-center gap-3">
            <button 
              onClick={handleGenerate}
              className="px-5 py-2.5 bg-indigo-600 dark:bg-teal-600 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-teal-700 transition-colors flex items-center gap-2 font-medium shadow-sm dark:shadow-gray-900"
            >
              <Sparkles className="w-4 h-4" />
              Generate Document
            </button>
            <button 
              onClick={handleUpload}
              className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 font-medium"
            >
              <Upload className="w-4 h-4" />
              Upload
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Simple Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600 p-6 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Project Deliverables</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {documents.length} document{documents.length !== 1 ? 's' : ''} available
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleGenerate}
              className="px-4 py-2 bg-indigo-600 dark:bg-teal-600 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-teal-700 transition-colors flex items-center gap-2 font-medium shadow-sm dark:shadow-gray-900"
            >
              <Sparkles className="w-4 h-4" />
              Generate Document
            </button>
            <button 
              onClick={handleUpload}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 font-medium"
            >
              <Upload className="w-4 h-4" />
              Upload
            </button>
          </div>
        </div>

        {/* Simple Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:border-indigo-500 dark:focus:border-teal-500 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all"
          />
        </div>
      </div>

      {/* Documents List */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredDocuments.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <FolderOpen className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No documents found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Try adjusting your search term
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 bg-indigo-600 dark:bg-teal-600 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-teal-700 transition-colors shadow-sm dark:shadow-gray-900"
              >
                Clear Search
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-w-5xl mx-auto">
            {filteredDocuments.map(doc => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onView={handleView}
                onDownload={handleDownload}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentsTab;
