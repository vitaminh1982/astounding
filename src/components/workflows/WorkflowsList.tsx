import React, { useState, useEffect, useContext } from 'react';
import { Plus, Search } from 'lucide-react';
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
        // Add more mock workflows as needed
      ];
      setWorkflows(mockWorkflows);
    };

    fetchWorkflows();
  }, []);

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || workflow.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="workflows-list h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{t('workflows.list.title')}</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus className="h-4 w-4 mr-1 " />
          {t('workflows.list.newButton')}
        </button>
      </div>

      {/* Search and Filter */}
      <div className="mb-4 space-y-2">
        <div className="relative">
          <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('workflows.list.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        
        <div className="flex space-x-2">
          {['all', 'active', 'draft', 'paused', 'archived'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-3 py-1 text-sm rounded-full ${
                filter === status
                  ? 'bg-primary-100 text-primary-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t(`workflows.list.filters.${status}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Workflows List */}
      <div className="flex-1 overflow-y-auto">
        {filteredWorkflows.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            {t('workflows.list.noWorkflowsFound')}
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
          onCreate={(newWorkflow) => {
            setWorkflows([...workflows, newWorkflow]);
            setIsCreating(false);
            onSelect(newWorkflow);
          }}
        />
      )}
    </div>
  );
};

const WorkflowCard: React.FC<WorkflowCardProps> = ({ workflow, isSelected, onClick }) => {
  const { t } = useContext(LanguageContext);
  
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    draft: 'bg-gray-100 text-gray-800',
    paused: 'bg-yellow-100 text-yellow-800',
    archived: 'bg-red-100 text-red-800',
  };

  return (
    <div
      onClick={onClick}
      className={`
        p-4 rounded-lg border cursor-pointer transition-all
        ${isSelected 
          ? 'border-primary-500 bg-primary-50' 
          : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
        }
      `}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-900">{workflow.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{workflow.description}</p>
        </div>
        <span className={`
          px-2 py-1 text-xs font-medium rounded-full
          ${statusColors[workflow.status]}
        `}>
          {t(`workflows.list.status.${workflow.status}`)}
        </span>
      </div>
      
      <div className="mt-2 flex items-center text-xs text-gray-500">
        <span>{t('workflows.list.card.updatedAt')} {new Date(workflow.updatedAt).toLocaleDateString()}</span>
        <span className="mx-2">•</span>
        <span>{workflow.agents.length} {t('workflows.list.card.agents')}</span>
      </div>
    </div>
  );
};

const CreateWorkflowModal: React.FC<CreateWorkflowModalProps> = ({ onClose, onCreate }) => {
  const { t } = useContext(LanguageContext);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
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
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">{t('workflows.list.modal.title')}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('workflows.list.modal.nameLabel')}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('workflows.list.modal.descriptionLabel')}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                rows={3}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
            >
              {t('workflows.list.modal.cancelButton')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
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
