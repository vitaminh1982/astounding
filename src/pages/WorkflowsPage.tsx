// pages/WorkflowsPage.tsx
import React, { useState, useContext, useCallback, useMemo } from 'react';
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

  const handleSelectWorkflow = useCallback((workflow: Workflow) => {
    setSelectedWorkflow(workflow);
    setIsMobileViewingDetails(true);
  }, []);

  const handleBackToList = useCallback(() => {
    setIsMobileViewingDetails(false);
  }, []);

  const handleCreateWorkflow = useCallback(() => {
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
  }, []);

  const handleWorkflowUpdate = useCallback((updatedWorkflow: Workflow) => {
    setSelectedWorkflow(updatedWorkflow);
    // Here you would typically make an API call to update the workflow
    console.log('Workflow updated:', updatedWorkflow);
  }, []);

  const handleTriggersUpdate = useCallback((triggers: Trigger[]) => {
    if (selectedWorkflow) {
      const updatedWorkflow = {
        ...selectedWorkflow,
        triggers,
        updatedAt: new Date().toISOString(),
      };
      handleWorkflowUpdate(updatedWorkflow);
    }
  }, [selectedWorkflow, handleWorkflowUpdate]);

  const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = useMemo(() => [
    { 
      key: 'design', 
      label: t('workflows.tabs.design'),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      )
    },
    { 
      key: 'triggers', 
      label: t('workflows.tabs.triggers'),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    { 
      key: 'integrations', 
      label: t('workflows.tabs.integrations'),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      key: 'rules', 
      label: t('workflows.tabs.rules'),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      )
    },
    { 
      key: 'errors', 
      label: t('workflows.tabs.errors'),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      key: 'logs', 
      label: "Logs",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
  ], [t]);

  const getStatusColor = useCallback((status: string) => {
    const colors = {
      active: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800',
      draft: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700',
      paused: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800',
      error: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800',
    };
    return colors[status as keyof typeof colors] || colors.draft;
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors">
                {t('workflows.title')}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 transition-colors">
                {t('workflows.subtitle')}
              </p>
            </div>
            <button 
              onClick={handleCreateWorkflow}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 bg-indigo-600 dark:bg-teal-600 text-white hover:bg-indigo-700 dark:hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 shadow-sm hover:shadow-md active:scale-95"
              aria-label={t('workflows.newWorkflow')}
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              <span className="whitespace-nowrap">{t('workflows.newWorkflow')}</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex h-[calc(100vh-12rem)] relative rounded-lg overflow-hidden shadow-lg">
          <AnimatePresence>
            {/* Workflows List Panel */}
            <motion.div 
              className={`
                ${isMobileViewingDetails ? 'hidden md:block' : 'w-full'}
                md:w-1/2 
                border-r border-gray-200 dark:border-gray-700
                overflow-y-auto
                bg-white dark:bg-gray-800
                transition-colors
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
            {/* Workflow Details Panel */}
            <motion.div 
              className={`
                ${!isMobileViewingDetails ? 'hidden md:block' : 'w-full absolute md:relative top-0 left-0 h-full z-10'}
                md:w-1/2 
                bg-white dark:bg-gray-800
                transition-colors
              `}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {selectedWorkflow ? (
                <div className="h-full flex flex-col">
                  {/* Mobile Back Button */}
                  <div className="md:hidden p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors">
                    <button
                      onClick={handleBackToList}
                      className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                    >
                      <ArrowLeft className="h-5 w-5" />
                      <span className="font-medium">{t('workflows.backToList')}</span>
                    </button>
                  </div>

                  {/* Workflow Header */}
                  <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1 min-w-0 mr-4">
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 truncate transition-colors">
                          {selectedWorkflow.name}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors">
                          {selectedWorkflow.description || t('workflows.noDescription')}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(selectedWorkflow.status)}`}>
                        {selectedWorkflow.status.charAt(0).toUpperCase() + selectedWorkflow.status.slice(1)}
                      </span>
                    </div>
                    
                    {/* Tabs */}
                    <div className="flex space-x-1 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                      {tabs.map(({ key, label, icon }) => (
                        <button
                          key={key}
                          onClick={() => setActiveTab(key)}
                          className={`
                            px-4 py-2.5 
                            font-medium 
                            rounded-lg 
                            flex items-center gap-2 
                            transition-all duration-200 
                            whitespace-nowrap
                            ${activeTab === key
                              ? 'bg-indigo-50 dark:bg-teal-900/30 text-indigo-600 dark:text-teal-400 shadow-sm'
                              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                            }
                          `}
                          aria-pressed={activeTab === key}
                        >
                          {icon}
                          <span className="text-sm">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tab Content */}
                  <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="h-full"
                      >
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
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                /* Empty State */
                <div className="h-full flex flex-col items-center justify-center p-6 text-center bg-white dark:bg-gray-800 transition-colors">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4 transition-colors">
                    <svg 
                      className="h-8 w-8 text-gray-400 dark:text-gray-500 transition-colors"
                      fill="none" 
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 transition-colors">
                    {t('workflows.noWorkflowSelected')}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm transition-colors">
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
