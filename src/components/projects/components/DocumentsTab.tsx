/**
 * Documents tab component for project deliverables
 */
import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Upload, 
  Plus, 
  Search, 
  Filter,
  Grid3x3,
  List,
  Download,
  Trash2,
  SortAsc,
  Sparkles,
  FolderOpen,
  CheckCircle,
  Clock,
  TrendingUp
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
    size: 2457600, // 2.4 MB
    generatedBy: 'Ikki',
    createdAt: new Date('2025-01-15T10:30:00'),
    status: 'final',
    isAIGenerated: true,
    category: 'requirements',
    version: '2.0',
    tags: ['requirements', 'specifications', 'analysis']
  },
  {
    id: 'doc-002',
    name: 'Technical Architecture Design',
    description: 'System architecture diagrams and technical specifications for the platform infrastructure',
    type: 'pdf',
    size: 3145728, // 3 MB
    generatedBy: 'Shiryu',
    createdAt: new Date('2025-01-16T14:20:00'),
    status: 'final',
    isAIGenerated: true,
    category: 'technical',
    version: '1.5',
    tags: ['architecture', 'technical', 'infrastructure']
  },
  {
    id: 'doc-003',
    name: 'Risk Assessment Report',
    description: 'Comprehensive risk analysis with mitigation strategies and contingency plans',
    type: 'docx',
    size: 1048576, // 1 MB
    generatedBy: 'Hyôga',
    createdAt: new Date('2025-01-17T09:15:00'),
    status: 'review',
    isAIGenerated: true,
    category: 'analysis',
    version: '1.0',
    tags: ['risk', 'analysis', 'mitigation']
  },
  {
    id: 'doc-004',
    name: 'Project Timeline Gantt Chart',
    description: 'Detailed project schedule with milestones, dependencies, and resource allocation',
    type: 'xlsx',
    size: 524288, // 512 KB
    generatedBy: 'Seiya',
    createdAt: new Date('2025-01-18T11:45:00'),
    status: 'final',
    isAIGenerated: true,
    category: 'planning',
    version: '3.2',
    tags: ['timeline', 'planning', 'schedule']
  },
  {
    id: 'doc-005',
    name: 'User Interface Mockups',
    description: 'High-fidelity UI/UX designs for the main application interfaces and workflows',
    type: 'pdf',
    size: 5242880, // 5 MB
    generatedBy: 'Shun',
    createdAt: new Date('2025-01-19T13:00:00'),
    status: 'draft',
    isAIGenerated: false,
    category: 'design',
    version: '0.8',
    tags: ['design', 'ui', 'mockups']
  },
  {
    id: 'doc-006',
    name: 'API Documentation',
    description: 'Complete API reference with endpoints, authentication, and integration examples',
    type: 'html',
    size: 819200, // 800 KB
    generatedBy: 'Shiryu',
    createdAt: new Date('2025-01-20T10:00:00'),
    status: 'review',
    isAIGenerated: true,
    category: 'technical',
    version: '1.1',
    tags: ['api', 'documentation', 'technical']
  },
  {
    id: 'doc-007',
    name: 'Compliance Checklist',
    description: 'Industry standards compliance verification and certification requirements',
    type: 'pdf',
    size: 716800, // 700 KB
    generatedBy: 'Shun',
    createdAt: new Date('2025-01-21T15:30:00'),
    status: 'final',
    isAIGenerated: true,
    category: 'compliance',
    version: '1.0',
    tags: ['compliance', 'standards', 'certification']
  },
  {
    id: 'doc-008',
    name: 'Testing Strategy Document',
    description: 'QA approach, test cases, and quality assurance procedures',
    type: 'docx',
    size: 1572864, // 1.5 MB
    generatedBy: 'Ikki',
    createdAt: new Date('2025-01-22T09:20:00'),
    status: 'draft',
    isAIGenerated: true,
    category: 'testing',
    version: '0.5',
    tags: ['testing', 'qa', 'quality']
  }
];

interface DocumentFilter {
  search: string;
  category: string;
  status: string;
  agent: string;
  aiGenerated: 'all' | 'ai' | 'manual';
}

/**
 * DocumentsTab displays project documents and deliverables with advanced filtering
 */
const DocumentsTab: React.FC = () => {
  const [documents] = useState<Document[]>(INITIAL_DOCUMENTS);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<DocumentFilter>({
    search: '',
    category: 'all',
    status: 'all',
    agent: 'all',
    aiGenerated: 'all'
  });
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');

  // Get unique categories and agents
  const categories = useMemo(() => {
    return Array.from(new Set(documents.map(d => d.category)));
  }, [documents]);

  const agents = useMemo(() => {
    return Array.from(new Set(documents.map(d => d.generatedBy)));
  }, [documents]);

  // Filter and sort documents
  const filteredDocuments = useMemo(() => {
    let filtered = documents.filter(doc => {
      const matchesSearch = filter.search === '' ||
        doc.name.toLowerCase().includes(filter.search.toLowerCase()) ||
        doc.description.toLowerCase().includes(filter.search.toLowerCase()) ||
        doc.tags?.some(tag => tag.toLowerCase().includes(filter.search.toLowerCase()));
      
      const matchesCategory = filter.category === 'all' || doc.category === filter.category;
      const matchesStatus = filter.status === 'all' || doc.status === filter.status;
      const matchesAgent = filter.agent === 'all' || doc.generatedBy === filter.agent;
      const matchesAI = filter.aiGenerated === 'all' ||
        (filter.aiGenerated === 'ai' && doc.isAIGenerated) ||
        (filter.aiGenerated === 'manual' && !doc.isAIGenerated);

      return matchesSearch && matchesCategory && matchesStatus && matchesAgent && matchesAI;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'size':
          return b.size - a.size;
        case 'date':
        default:
          return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });

    return filtered;
  }, [documents, filter, sortBy]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: documents.length,
      final: documents.filter(d => d.status === 'final').length,
      draft: documents.filter(d => d.status === 'draft').length,
      review: documents.filter(d => d.status === 'review').length,
      aiGenerated: documents.filter(d => d.isAIGenerated).length,
      totalSize: documents.reduce((sum, d) => sum + d.size, 0)
    };
  }, [documents]);

  const formatTotalSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleView = (doc: Document) => {
    console.log('Viewing document:', doc.id);
    // Implement document viewer
  };

  const handleDownload = (doc: Document) => {
    console.log('Downloading document:', doc.id);
    // Implement download functionality
  };

  const handleEdit = (doc: Document) => {
    console.log('Editing document:', doc.id);
    // Implement edit functionality
  };

  const handleDelete = (doc: Document) => {
    console.log('Deleting document:', doc.id);
    // Implement delete with confirmation
  };

  const handleGenerate = () => {
    console.log('Generate new document');
    // Implement AI generation dialog
  };

  const handleUpload = () => {
    console.log('Upload document');
    // Implement file upload
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filter.category !== 'all') count++;
    if (filter.status !== 'all') count++;
    if (filter.agent !== 'all') count++;
    if (filter.aiGenerated !== 'all') count++;
    return count;
  }, [filter]);

  if (documents.length === 0) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-10 h-10 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Documents Yet</h3>
          <p className="text-gray-500 mb-6">
            AI-generated documents and project artifacts will appear here. Get started by generating your first document.
          </p>
          <div className="flex justify-center gap-3">
            <button 
              onClick={handleGenerate}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium shadow-lg shadow-indigo-200"
            >
              <Sparkles className="w-5 h-5" />
              Generate with AI
            </button>
            <button 
              onClick={handleUpload}
              className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium"
            >
              <Upload className="w-5 h-5" />
              Upload Document
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header with Stats */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Project Deliverables</h2>
            <p className="text-sm text-gray-600">Manage and organize your project documents</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleGenerate}
              className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium shadow-lg shadow-indigo-200"
            >
              <Sparkles className="w-4 h-4" />
              Generate Document
            </button>
            <button 
              onClick={handleUpload}
              className="px-4 py-2.5 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium"
            >
              <Upload className="w-4 h-4" />
              Upload
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <FolderOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
            <div className="text-xs text-blue-700 font-medium">Total Docs</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-900">{stats.final}</div>
            <div className="text-xs text-green-700 font-medium">Final</div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-orange-900">{stats.review}</div>
            <div className="text-xs text-orange-700 font-medium">In Review</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border border-yellow-200">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-yellow-900">{stats.draft}</div>
            <div className="text-xs text-yellow-700 font-medium">Drafts</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-900">{stats.aiGenerated}</div>
            <div className="text-xs text-purple-700 font-medium">AI Generated</div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 border border-indigo-200">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="text-2xl font-bold text-indigo-900">{formatTotalSize(stats.totalSize)}</div>
            <div className="text-xs text-indigo-700 font-medium">Total Size</div>
          </div>
        </div>

        {/* Filters and View Controls */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search documents, tags, or descriptions..."
              value={filter.search}
              onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <select
              value={filter.category}
              onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
              className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={filter.status}
              onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="final">Final</option>
              <option value="review">In Review</option>
              <option value="draft">Draft</option>
            </select>

            <select
              value={filter.agent}
              onChange={(e) => setFilter(prev => ({ ...prev, agent: e.target.value }))}
              className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Agents</option>
              {agents.map(agent => (
                <option key={agent} value={agent}>{agent}</option>
              ))}
            </select>

            <select
              value={filter.aiGenerated}
              onChange={(e) => setFilter(prev => ({ ...prev, aiGenerated: e.target.value as any }))}
              className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Types</option>
              <option value="ai">AI Generated</option>
              <option value="manual">Manual Upload</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="size">Sort by Size</option>
            </select>

            {/* View Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2.5 text-sm font-medium transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2.5 text-sm font-medium transition-colors border-l border-gray-300 ${
                  viewMode === 'list'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600">Active filters:</span>
            {filter.category !== 'all' && (
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium flex items-center gap-1">
                Category: {filter.category}
                <button
                  onClick={() => setFilter(prev => ({ ...prev, category: 'all' }))}
                  className="hover:bg-indigo-200 rounded-full p-0.5"
                >
                  ×
                </button>
              </span>
            )}
            {filter.status !== 'all' && (
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium flex items-center gap-1">
                Status: {filter.status}
                <button
                  onClick={() => setFilter(prev => ({ ...prev, status: 'all' }))}
                  className="hover:bg-indigo-200 rounded-full p-0.5"
                >
                  ×
                </button>
              </span>
            )}
            {filter.agent !== 'all' && (
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium flex items-center gap-1">
                Agent: {filter.agent}
                <button
                  onClick={() => setFilter(prev => ({ ...prev, agent: 'all' }))}
                  className="hover:bg-indigo-200 rounded-full p-0.5"
                >
                  ×
                </button>
              </span>
            )}
            {filter.aiGenerated !== 'all' && (
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium flex items-center gap-1">
                Type: {filter.aiGenerated === 'ai' ? 'AI Generated' : 'Manual'}
                <button
                  onClick={() => setFilter(prev => ({ ...prev, aiGenerated: 'all' }))}
                  className="hover:bg-indigo-200 rounded-full p-0.5"
                >
                  ×
                </button>
              </span>
            )}
            <button
              onClick={() => setFilter({ search: '', category: 'all', status: 'all', agent: 'all', aiGenerated: 'all' })}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Documents Grid/List */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredDocuments.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your filters or search terms
              </p>
              <button
                onClick={() => setFilter({ search: '', category: 'all', status: 'all', agent: 'all', aiGenerated: 'all' })}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold">{filteredDocuments.length}</span> of{' '}
                <span className="font-semibold">{documents.length}</span> documents
              </p>
            </div>

            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-3'
            }>
              {filteredDocuments.map(doc => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  onView={handleView}
                  onDownload={handleDownload}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  viewMode={viewMode}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DocumentsTab;
