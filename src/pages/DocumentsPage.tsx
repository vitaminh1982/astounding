import React, { useState, useMemo } from 'react';
import DocumentsHeader from '../components/documents/DocumentsHeader';
import DocumentsSearch from '../components/documents/DocumentsSearch';
import DocumentGrid from '../components/documents/DocumentGrid';
import { Document } from '../types';
import { availableAgents } from '../constants/agents';
import { Plus, Download, Upload } from 'lucide-react';
import UploadModal from '../components/documents/UploadModal';
import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

const getAgentById = (id: string) => availableAgents.find(a => a.id === id);

const initialDocuments: Document[] = [
  {
    id: '1',
    name: 'presentation-commerciale.pdf',
    type: 'pdf',
    size: '2.5 Mo',
    lastModified: '2023-06-15',
    assignedAgents: [getAgentById('assistant-commercial')].filter(Boolean) as any[]
  },
  {
    id: '2',
    name: 'documentation-technique.docx',
    type: 'docx',
    size: '1.8 Mo',
    lastModified: '2023-06-16',
    assignedAgents: [getAgentById('assistant-technique')].filter(Boolean) as any[]
  },
  {
    id: '3',
    name: 'faq-service-client.pdf',
    type: 'pdf',
    size: '3.2 Mo',
    lastModified: '2023-06-17',
    assignedAgents: [getAgentById('service-client-24-7')].filter(Boolean) as any[]
  },
  {
    id: '4',
    name: 'catalogue-produits.pdf',
    type: 'pdf',
    size: '5.1 Mo',
    lastModified: '2023-06-18',
    assignedAgents: [getAgentById('assistant-commercial'), getAgentById('service-client-24-7')].filter(Boolean) as any[]
  },
  {
    id: '5',
    name: 'guide-depannage.docx',
    type: 'docx',
    size: '1.5 Mo',
    lastModified: '2023-06-19',
    assignedAgents: [getAgentById('assistant-technique'), getAgentById('service-client-24-7')].filter(Boolean) as any[]
  },
  {
    id: '6',
    name: 'specifications-techniques.pdf',
    type: 'pdf',
    size: '4.3 Mo',
    lastModified: '2023-06-20',
    assignedAgents: [getAgentById('assistant-technique'), getAgentById('assistant-commercial')].filter(Boolean) as any[]
  },
  {
    id: '7',
    name: 'procedures-service-client.docx',
    type: 'docx',
    size: '2.1 Mo',
    lastModified: '2023-06-21',
    assignedAgents: [getAgentById('service-client-24-7')].filter(Boolean) as any[]
  }
];

const DocumentsPage: React.FC = () => {
  // États
  const { t } = useContext(LanguageContext);
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Filtrage des documents
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.assignedAgents.some(agent =>
        agent?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [documents, searchQuery]);

  // Gestionnaires d'événements
  const handleDelete = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const handleAssignAgent = (documentId: string, agentId: string) => {
    setDocuments(documents.map(doc => {
      if (doc.id === documentId) {
        const newAgent = availableAgents.find(agent => agent.id === agentId);
        if (newAgent && !doc.assignedAgents.some(a => a?.id === agentId)) {
          return {
            ...doc,
            assignedAgents: [...doc.assignedAgents, newAgent]
          };
        }
      }
      return doc;
    }));
  };

  const handleUnassignAgent = (documentId: string, agentId: string) => {
    setDocuments(documents.map(doc => {
      if (doc.id === documentId) {
        return {
          ...doc,
          assignedAgents: doc.assignedAgents.filter(agent => agent?.id !== agentId)
        };
      }
      return doc;
    }));
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleExport = () => {
    console.log('Export clicked');
    // Implémentez ici la logique d'exportation
  };

  const handleUpload = (file: File) => {
    console.log('Uploading file:', file);

    // Création d'un nouveau document
    const newDocument: Document = {
      id: String(Date.now()),
      name: file.name,
      type: file.name.split('.').pop() || '',
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      lastModified: new Date().toISOString().split('T')[0],
      assignedAgents: []
    };

    setDocuments([...documents, newDocument]);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Container principal avec padding responsive */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* En-tête */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors">{t('documents.title')}</h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 transition-colors">
                {t('documents.subtitle')}
              </p>
            </div>
            {/* Actions rapides */}
            <div className="flex gap-3">
              <button
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm dark:shadow-gray-900"
                onClick={handleExport}
              >
                <Download className="w-4 h-4" />
                {t('documents.actions.export')}
              </button>
              <button
                          className="flex items-center gap-2 bg-indigo-600 dark:bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-teal-700 transition-colors shadow-sm dark:shadow-gray-900"
        
                onClick={() => setIsUploadModalOpen(true)}
              >
                <Plus className="w-4 h-4" />
                {t('documents.actions.newDocument')}
              </button>
            </div>
          </div>
        </div>

        {/* Section principale */}
        <section className="rounded-lg bg-white dark:bg-gray-800 shadow dark:shadow-gray-900 border border-gray-200 dark:border-gray-600 transition-colors">
          <div className="p-4 sm:p-6">
            {/* Barre de recherche */}
            <div className="mb-6">
              <DocumentsSearch
                searchQuery={searchQuery}
                onSearchChange={handleSearch}
              />
            </div>

            {/* Grille de documents */}
            <div className="overflow-hidden">
              <DocumentGrid
                documents={filteredDocuments}
                onDelete={handleDelete}
                onAssignAgent={handleAssignAgent}
                onUnassignAgent={handleUnassignAgent}
              />
            </div>
          </div>
        </section>
      </div>

      {/* Modal d'upload */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUpload}
      />
    </div>
  );
};

export default DocumentsPage;
