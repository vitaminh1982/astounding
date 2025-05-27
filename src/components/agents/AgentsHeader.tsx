import React, { useState, useContext } from 'react';
import { Plus, Upload } from 'lucide-react';
import { LanguageContext } from '../../context/LanguageContext';
import AgentConfigModal from './config/AgentConfigModal';
import ImportAgentModal from './config/ImportAgentModal'; 
import { AgentConfig } from '../../../types/agent-config';

export default function AgentsHeader() {
  const { t } = useContext(LanguageContext);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false); // Add state for import modal
  const [newAgentConfig, setNewAgentConfig] = useState<AgentConfig>({
    id: '',
    name: '',
    status: 'inactive',
    lastUpdate: '',
    communication: {
      style: [],
      language: [],
      customTone: ''
    },
    knowledge: {
      bases: [],
      languages: []
    },
    rules: {
      availability: '',
      thresholds: {
        maxResponseTime: 0,
        maxSessionDuration: 0,
        maxAttempts: 0,
        confidenceScore: 0
      },
      escalationConditions: []
    },
    learning: {
      sources: [],
      updateFrequency: ''
    },
    integrations: [],
    metrics: {
      resolutionRate: 0,
      responseTime: '',
      csatScore: 0
    }
  });

  const handleSave = (config: AgentConfig) => {
    console.log('Saving new agent config:', config);
    setShowConfigModal(false);
    // Here you would typically call an API to save the new agent
  };

  const handleImport = () => {
    // Implement import functionality
    setShowImportModal(true);
    // You'll need to create an import modal component or use a file input
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          {t('agents.page.header.title')}
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          {t('agents.page.header.subtitle')}
        </p>
      </div>
      
      <div className="flex gap-2">
        {/* Import Agent button */}
        <button 
          className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white hover:bg-gray-50"
          onClick={handleImport}
        >
          <Upload className="w-4 h-4" />
          {t('agents.page.header.importAgent')}
        </button>
        
        {/* New Agent button */}
        <button 
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          onClick={() => setShowConfigModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('agents.page.header.newAgent')}
        </button>
      </div>

      {showConfigModal && (
        <AgentConfigModal
          agent={newAgentConfig}
          onClose={() => setShowConfigModal(false)}
          onSave={handleSave}
        />
      )}
      
      {showImportModal && (
        <ImportAgentModal 
          onClose={() => setShowImportModal(false)} 
          onImportComplete={(importedAgent) => {
            console.log('Agent imported:', importedAgent);
            setShowImportModal(false);
            // Here you would handle the actual agent import logic
          }}
        />
      )}
    </div>
  );
}
