import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { Plus, Search, X } from 'lucide-react';
import { LanguageContext } from '../../context/LanguageContext';
import { Workflow } from '../../types/workflow';

interface WorkflowsListProps {
  onSelect: (workflow: Workflow) => void;
  selectedId?: string;
}

interface WorkflowCardProps {
  workflow: Workflow;
  isSelected: boolean;
  onClick: () => void;
}

interface CreateWorkflowModalProps {
  onClose: () => void;
  onCreate: (workflow: Workflow) => void;
}

const WorkflowsList: React.FC<WorkflowsListProps> = ({ onSelect, selectedId }) => {
  const { t } = useContext(LanguageContext);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'draft' | 'paused' | 'archived'>('all');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const fetchWorkflows = async () => {
      // Mock data - replace with actual API call
      const mockWorkflows: Workflow[] = [
        {
          id: '1',
          name: t('workflows.mockData.customerSupport.name'),
          description: t('workflows.mockData.customerSupport.description'),
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
          agents: [1],
          triggers: [],
          integrations: [],
          rules: [],
          errorHandlers: [],
        },
        {
          id: '2',
          name: t('workflows.mockData.SalesSupport.name'),
          description: t('workflows.mockData.SalesSupport.description'),
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
          agents: [1],
          triggers: [],
          integrations: [],
          rules: [],
          errorHandlers: [],
        },
        {
          id: '3',
          name: t('workflows.mockData.TechnicalSupport.name'),
          description: t('workflows.mockData.TechnicalSupport.description'),
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
          agents: [1],
          triggers: [],
          integrations: [],
          rules: [],
          errorHandlers: [],
        },
        {
          id: '4',
          name: t('workflows.mockData.HRAssistant.name'),
          description: t('workflows.mockData.HRAssistant.description'),
          status: 'paused',
          createdAt: new Date(),
          updatedAt: new Date(),
          agents: [1],
          triggers: [],
          integrations: [],
          rules: [],
          errorHandlers: [],
        }
      ];
      setWorkflows(mockWorkflows);
    };

    fetchWorkflows();
  }, [t]);

  const filteredWorkflows = useMemo(() => {
    return workflows.filter(workflow => {
      const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           workflow.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'all' || workflow.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [workflows, searchTerm, filter]);

  const handleCreateWorkflow = useCallback((newWorkflow: Workflow) => {
    setWorkflows(prev => [...prev, newWorkflow]);
    setIsCreating(false);
    onSelect(newWorkflow);
  }, [onSelect]);

  const handleClearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  const filterButtons = useMemo(() => 
    ['all', 'active', 'draft', 'paused', 'archived'] as const,
    []
  );

  return (
    <div className="workflows-list h-full flex flex-col bg-white dark:bg-gray-800 transition-colors">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors">
          {t('workflows.list.title')}
        </h2>
        <button
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 shadow-sm hover:shadow active:scale-95"
          aria-label={t('workflows.list.newButton')}
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          <span>{t('workflows.list.newButton')}</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="mb-4 space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="h-5 w-5 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors" />
          <input
            type="text"
            placeholder={t('workflows.list.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10 py-2.5 w-full rounded-lg transition-all duration-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:border-transparent"
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {filterButtons.map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
                filter === status
                  ? 'bg-indigo-100 dark:bg-teal-900/40 text-indigo-700 dark:text-teal-300 ring-2 ring-indigo-500 dark:ring-teal-500 ring-inset'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              aria-pressed={filter === status}
            >
              {t(`workflows.list.filters.${status}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Workflows List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        {filteredWorkflows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 mb-3 transition-colors">
              <Search className="h-6 w-6 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 transition-colors">
              {t('workflows.list.noWorkflowsFound')}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredWorkflows.map((workflow) => (
              <WorkflowCard
                key={workflow.id}
                workflow={workflow}
                isSelected={workflow.id === selectedId}
                onClick={() => onSelect(workflow)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Workflow Modal */}
      {isCreating && (
        <CreateWorkflowModal
          onClose={() => setIsCreating(false)}
          onCreate={handleCreateWorkflow}
        />
      )}
    </div>
  );
};

const WorkflowCard: React.FC<WorkflowCardProps> = ({ workflow, isSelected, onClick }) => {
  const { t } = useContext(LanguageContext);
  
  const statusColors = useMemo(() => ({
    active: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800',
    draft: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-600',
    paused: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800',
    archived: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800',
  }), []);

  return (
    <div
      onClick={onClick}
      className={`
        p-4 rounded-lg border cursor-pointer transition-all duration-200
        ${isSelected 
          ? 'border-indigo-500 dark:border-teal-500 bg-indigo-50 dark:bg-teal-900/20 shadow-md' 
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-300 dark:hover:border-teal-600 hover:bg-gray-50 dark:hover:bg-gray-750 hover:shadow-sm'
        }
      `}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && onClick()}
      aria-selected={isSelected}
    >
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate transition-colors">
            {workflow.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2 transition-colors">
            {workflow.description}
          </p>
        </div>
        <span className={`
          px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap
          ${statusColors[workflow.status]}
        `}>
          {t(`workflows.list.status.${workflow.status}`)}
        </span>
      </div>
      
      <div className="mt-3 flex items-center text-xs text-gray-500 dark:text-gray-400 transition-colors">
        <span>
          {t('workflows.list.card.updatedAt')} {new Date(workflow.updatedAt).toLocaleDateString()}
        </span>
        <span className="mx-2">•</span>
        <span>
          {workflow.agents.length} {t('workflows.list.card.agents')}
        </span>
      </div>
    </div>
  );
};

const CreateWorkflowModal: React.FC<CreateWorkflowModalProps> = ({ onClose, onCreate }) => {
  const { t } = useContext(LanguageContext);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    const newWorkflow: Workflow = {
      id: `wf-${Date.now()}`,
      name,
      description,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      agents: [],
      triggers: [],
      integrations: [],
      rules: [],
      errorHandlers: [],
    };

    onCreate(newWorkflow);
  }, [name, description, onCreate]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4 transition-colors backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 
            id="modal-title"
            className="text-xl font-semibold text-gray-900 dark:text-gray-100 transition-colors"
          >
            {t('workflows.list.modal.title')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            {/* Name Input */}
            <div>
              <label 
                htmlFor="workflow-name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors"
              >
                {t('workflows.list.modal.nameLabel')}
              </label>
              <input
                id="workflow-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-lg px-4 py-2.5 transition-all duration-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:border-transparent"
                placeholder="Enter workflow name"
                required
                autoFocus
              />
            </div>
            
            {/* Description Textarea */}
            <div>
              <label 
                htmlFor="workflow-description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors"
              >
                {t('workflows.list.modal.descriptionLabel')}
              </label>
              <textarea
                id="workflow-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="block w-full rounded-lg px-4 py-2.5 transition-all duration-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:border-transparent resize-none"
                rows={4}
                placeholder="Describe the workflow purpose..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              {t('workflows.list.modal.cancelButton')}
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 bg-indigo-600 dark:bg-teal-600 text-white hover:bg-indigo-700 dark:hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 shadow-sm hover:shadow-md active:scale-95"
            >
              {t('workflows.list.modal.createButton')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkflowsList;
