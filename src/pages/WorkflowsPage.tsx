// pages/WorkflowsPage.tsx
import React, { useState, useContext } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageContext } from '../context/LanguageContext';
import WorkflowsList from '../components/workflows/WorkflowsList';
import WorkflowDesigner from '../components/workflows/WorkflowDesigner';
import TriggerPanel from '../components/workflows/TriggerPanel';
import IntegrationBuilder from '../components/workflows/IntegrationBuilder';
import AutomationRules from '../components/workflows/AutomationRules';
import ErrorHandling from '../components/workflows/ErrorHandling';
import LogsOverview from '../components/workflows/LogsOverview';
import { Node, Edge } from 'reactflow';
import { initialNodes, initialEdges } from '../components/workflows/WorkflowDesigner';

// Types
interface Trigger {
  id: string;
  type: string;
  config: Record<string, any>;
}

interface Integration {
  id: string;
  type: string;
  config: Record<string, any>;
}

interface Rule {
  id: string;
  condition: string;
  action: string;
}

interface ErrorHandler {
  id: string;
  type: string;
  action: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'draft' | 'paused' | 'error';
  triggers: Trigger[];
  integrations: Integration[];
  rules: Rule[];
  errorHandlers: ErrorHandler[];
  createdAt: string;
  updatedAt: string;
  design?: {
    nodes: Node[];
    edges: Edge[];
  };
}

type TabType = 'design' | 'triggers' | 'integrations' | 'rules' | 'errors' | 'logs';

const WorkflowsPage: React.FC = () => {
  const { t } = useContext(LanguageContext);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('design');
  const [isMobileViewingDetails, setIsMobileViewingDetails] = useState(false);

  const handleSelectWorkflow = (workflow: Workflow) => {
    setSelectedWorkflow(workflow);
    setIsMobileViewingDetails(true);
  };

  const handleBackToList = () => {
    setIsMobileViewingDetails(false);
  };

  const handleCreateWorkflow = () => {
    const newWorkflow: Workflow = {
      id: `workflow-${Date.now()}`,
      name: 'New Workflow',
      description: '',
      status: 'draft',
      triggers: [],
      integrations: [],
      rules: [],
      errorHandlers: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      design: {
        nodes: initialNodes,
        edges: initialEdges,
      },
    };
    setSelectedWorkflow(newWorkflow);
    setIsMobileViewingDetails(true);
  };

  const handleWorkflowUpdate = (updatedWorkflow: Workflow) => {
    setSelectedWorkflow(updatedWorkflow);
    // Here you would typically make an API call to update the workflow
    console.log('Workflow updated:', updatedWorkflow);
  };

  const handleTriggersUpdate = (triggers: Trigger[]) => {
    if (selectedWorkflow) {
      const updatedWorkflow = {
        ...selectedWorkflow,
        triggers,
        updatedAt: new Date().toISOString(),
      };
      handleWorkflowUpdate(updatedWorkflow);
    }
  };

  const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
    { 
      key: 'design', 
      label: t('workflows.tabs.design'),
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    },
    { 
      key: 'triggers', 
      label: t('workflows.tabs.triggers'),
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    },
    { 
      key: 'integrations', 
      label: t('workflows.tabs.integrations'),
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    },
    { 
      key: 'rules', 
      label: t('workflows.tabs.rules'),
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    },
    { 
      key: 'errors', 
      label: t('workflows.tabs.errors'),
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    },
        { 
      key: 'logs', 
      label: "Logs",
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      draft: 'bg-gray-100 text-gray-800',
      paused: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {t('workflows.title')}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                {t('workflows.subtitle')}
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handleCreateWorkflow}
                className="flex items-center gap-2 bg-teal-600 dark:bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                {t('workflows.newWorkflow')}
              </button>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(100vh-4rem)] relative">
          <AnimatePresence>
            <motion.div 
              className={`
                ${isMobileViewingDetails ? 'hidden md:block' : 'w-full'}
                md:w-1/2 
                border-r border-gray-200 dark:border-gray-700
                overflow-y-auto
                bg-white dark:bg-gray-800
                rounded-l-lg
              `}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-4 sm:p-6">
                <WorkflowsList
                  onSelect={handleSelectWorkflow}
                  selectedId={selectedWorkflow?.id}
                />
              </div>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            <motion.div 
              className={`
                ${!isMobileViewingDetails ? 'hidden md:block' : 'w-full absolute md:relative top-0 left-0 h-full'}
                md:w-1/2 
                bg-white
                rounded-r-lg
              `}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {selectedWorkflow ? (
                <div className="h-full flex flex-col">
                  <div className="md:hidden p-4 bg-white border-b border-gray-200">
                    <button
                      onClick={handleBackToList}
                      className="flex items-center text-gray-600 hover:text-gray-900"
                    >
                      <ArrowLeft className="h-5 w-5 mr-2" />
                      {t('workflows.backToList')}
                    </button>
                  </div>

                  <div className="p-4 border-b">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h2 className="text-xl font-semibold">{selectedWorkflow.name}</h2>
                        <p className="text-sm text-gray-500">{selectedWorkflow.description}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(selectedWorkflow.status)}`}>
                        {selectedWorkflow.status.charAt(0).toUpperCase() + selectedWorkflow.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="flex space-x-2 overflow-x-auto">
                      {tabs.map(({ key, label, icon }) => (
                        <button
                          key={key}
                          onClick={() => setActiveTab(key)}
                          className={`px-4 py-2 font-medium rounded-md flex items-center gap-2 transition-colors ${
                            activeTab === key
                              ? 'bg-indigo-50 text-indigo-600'
                              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {icon}
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    {activeTab === 'design' && (
                      <WorkflowDesigner 
                        workflow={selectedWorkflow}
                        onWorkflowUpdate={handleWorkflowUpdate}
                      />
                    )}
                    {activeTab === 'triggers' && (
                      <TriggerPanel
                        workflowId={selectedWorkflow.id}
                        triggers={selectedWorkflow.triggers}
                        onTriggersUpdate={handleTriggersUpdate}
                      />
                    )}
                    {activeTab === 'integrations' && (
                      <IntegrationBuilder
                        workflowId={selectedWorkflow.id}
                        integrations={selectedWorkflow.integrations}
                        onIntegrationsUpdate={(integrations) => 
                          handleWorkflowUpdate({
                            ...selectedWorkflow,
                            integrations,
                            updatedAt: new Date().toISOString(),
                          })
                        }
                      />
                    )}
                    {activeTab === 'rules' && (
                      <AutomationRules
                        workflowId={selectedWorkflow.id}
                        rules={selectedWorkflow.rules}
                        onRulesUpdate={(rules) =>
                          handleWorkflowUpdate({
                            ...selectedWorkflow,
                            rules,
                            updatedAt: new Date().toISOString(),
                          })
                        }
                      />
                    )}
                    {activeTab === 'errors' && (
                      <ErrorHandling
                        workflowId={selectedWorkflow.id}
                        errorHandlers={selectedWorkflow.errorHandlers}
                        onErrorHandlersUpdate={(errorHandlers) =>
                          handleWorkflowUpdate({
                            ...selectedWorkflow,
                            errorHandlers,
                            updatedAt: new Date().toISOString(),
                          })
                        }
                      />
                    )}
                                        {activeTab === 'logs' && (
                      <LogsOverview
                        workflowId={selectedWorkflow.id}
                        errorHandlers={selectedWorkflow.errorHandlers}
                        onErrorHandlersUpdate={(errorHandlers) =>
                          handleWorkflowUpdate({
                            ...selectedWorkflow,
                            errorHandlers,
                            updatedAt: new Date().toISOString(),
                          })
                        }
                      />
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <div className="rounded-full bg-gray-100 p-4 mb-4">
                    <svg 
                      className="h-8 w-8 text-gray-400"
                      fill="none" 
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {t('workflows.noWorkflowSelected')}
                  </h3>
                  <p className="text-gray-500 max-w-sm">
                    {t('workflows.selectWorkflowPrompt')}
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default WorkflowsPage;
