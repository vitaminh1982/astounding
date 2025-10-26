import React, { useState, useContext, useCallback } from 'react';
import { Plus, Upload, Link } from 'lucide-react';
import { LanguageContext } from '../../context/LanguageContext';
import AgentConfigModal from './config/AgentConfigModal';
import ImportAgentModal from './config/ImportAgentModal'; 
import ConnectAgentModal from './config/ConnectAgentModal';
import { AgentConfig } from '../../../types/agent-config';

const initialAgentConfig: AgentConfig = {
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
};

export default function AgentsHeader() {
  const { t } = useContext(LanguageContext);
  
  // State management
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [newAgentConfig] = useState<AgentConfig>(initialAgentConfig);

  // Memoized handlers
  const handleSave = useCallback((config: AgentConfig) => {
    console.log('Saving new agent config:', config);
    setShowConfigModal(false);
    // TODO: Call API to save the new agent
  }, []);

  const handleConnect = useCallback(() => {
    setShowConnectModal(true);
  }, []);

  const handleImport = useCallback(() => {
    setShowImportModal(true);
  }, []);

  const handleNewAgent = useCallback(() => {
    setShowConfigModal(true);
  }, []);

  const handleCloseConfigModal = useCallback(() => {
    setShowConfigModal(false);
  }, []);

  const handleCloseImportModal = useCallback(() => {
    setShowImportModal(false);
  }, []);

  const handleCloseConnectModal = useCallback(() => {
    setShowConnectModal(false);
  }, []);

  const handleConnectComplete = useCallback((provider: string, config: any) => {
    console.log('Connected to provider:', provider, 'with config:', config);
    setShowConnectModal(false);
    // TODO: Handle the connection logic
  }, []);

  const handleImportComplete = useCallback((importedAgent: AgentConfig) => {
    console.log('Agent imported:', importedAgent);
    setShowImportModal(false);
    // TODO: Handle the actual agent import logic
  }, []);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        {/* Header Text */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
            {t('agents.page.header.title')}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            {t('agents.page.header.subtitle')}
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          {/* Connect Agent Button */}
          <button 
            onClick={handleConnect}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 shadow-sm"
            aria-label={t('agents.page.header.connectAgent')}
          >
            <Link className="w-4 h-4" />
            <span className="hidden sm:inline">
              {t('agents.page.header.connectAgent')}
            </span>
          </button>
          
          {/* Import Agent Button */}
          <button 
            onClick={handleImport}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 shadow-sm"
            aria-label={t('agents.page.header.importAgent')}
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">
              {t('agents.page.header.importAgent')}
            </span>
          </button>
          
          {/* New Agent Button - Indigo in light mode, Green/Teal in dark mode */}
          <button 
            onClick={handleNewAgent}
            className="flex items-center gap-2 bg-indigo-600 dark:bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-teal-700 transition-colors shadow-sm dark:shadow-gray-900"
            aria-label={t('agents.page.header.newAgent')}
          >
            <Plus className="w-4 h-4" />
            <span>{t('agents.page.header.newAgent')}</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      {showConfigModal && (
        <AgentConfigModal
          agent={newAgentConfig}
          onClose={handleCloseConfigModal}
          onSave={handleSave}
        />
      )}

      {showConnectModal && (
        <ConnectAgentModal
          onClose={handleCloseConnectModal}
          onConnect={handleConnectComplete}
        />
      )}
      
      {showImportModal && (
        <ImportAgentModal 
          onClose={handleCloseImportModal} 
          onImportComplete={handleImportComplete}
        />
      )}
    </>
  );
}
