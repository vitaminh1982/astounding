import React, { useState } from 'react';
import { 
  Workflow, 
  GitBranch, 
  UserCheck, 
  Database, 
  Zap,
  Plus, 
  Search, 
  Filter,
  ArrowLeft,
  Play,
  Pause,
  Edit2,
  Eye,
  Copy,
  Trash2,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { Page } from '../../App';

interface OrchestrationWorkflowManagementPageProps {
  onNavigate: (page: Page) => void;
}

// Mock data for workflows
const workflows = [
  {
    id: 'workflow-001',
    name: 'Customer Onboarding Flow',
    description: 'Automated customer onboarding with multiple touchpoints',
    status: 'active',
    agents: ['Customer Support', 'Sales Assistant'],
    tasks: 12,
    completedTasks: 8,
    priority: 'high',
    lastRun: '2025-03-15 14:30',
    successRate: 94.5,
    avgExecutionTime: '3.2 min'
  },
  {
    id: 'workflow-002',
    name: 'Technical Issue Resolution',
    description: 'Multi-step technical support workflow with escalation',
    status: 'active',
    agents: ['Technical Assistant', 'Customer Support'],
    tasks: 8,
    completedTasks: 6,
    priority: 'medium',
    lastRun: '2025-03-15 13:45',
    successRate: 89.2,
    avgExecutionTime: '5.7 min'
  },
  {
    id: 'workflow-003',
    name: 'Sales Lead Processing',
    description: 'Lead qualification and nurturing workflow',
    status: 'active',
    agents: ['Sales Assistant'],
    tasks: 6,
    completedTasks: 6,
    priority: 'high',
    lastRun: '2025-03-15 15:20',
    successRate: 96.8,
    avgExecutionTime: '2.1 min'
  },
  {
    id: 'workflow-004',
    name: 'HR Employee Support',
    description: 'Employee inquiry and support workflow',
    status: 'paused',
    agents: ['HR Assistant'],
    tasks: 4,
    completedTasks: 2,
    priority: 'low',
    lastRun: '2025-03-14 16:00',
    successRate: 87.3,
    avgExecutionTime: '4.5 min'
  }
];

// Mock data for workflow templates
const workflowTemplates = [
  {
    id: 'template-001',
    name: 'Customer Support Template',
    description: 'Standard customer support workflow pattern',
    category: 'Support',
    usageCount: 15,
    rating: 4.8
  },
  {
    id: 'template-002',
    name: 'Sales Funnel Template',
    description: 'Lead qualification and conversion workflow',
    category: 'Sales',
    usageCount: 8,
    rating: 4.6
  },
  {
    id: 'template-003',
    name: 'Technical Escalation Template',
    description: 'Technical issue escalation workflow',
    category: 'Technical',
    usageCount: 12,
    rating: 4.7
  }
];

export default function OrchestrationWorkflowManagementPage({ onNavigate }: OrchestrationWorkflowManagementPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'designer' | 'assignment' | 'templates' | 'dependencies'>('designer');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredWorkflows = workflows.filter(workflow =>
    workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workflow.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header with breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => onNavigate('orchestration')}
              className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Orchestration Hub
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">Workflow & Task Management</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Workflow & Task Management</h1>
              <p className="text-gray-600">Design, assign, and manage complex multi-agent workflows</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white hover:bg-gray-50">
                <Copy className="w-4 h-4" />
                Clone Workflow
              </button>
              <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                <Plus className="w-4 h-4" />
                New Workflow
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="bg-white rounded-lg shadow">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {[
                { key: 'designer', label: 'Workflow Designer', icon: GitBranch },
                { key: 'assignment', label: 'Task Assignment', icon: UserCheck },
                { key: 'templates', label: 'Templates', icon: Database },
                { key: 'dependencies', label: 'Dependencies & Triggers', icon: Zap }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`py-4 px-6 text-sm font-medium flex items-center gap-2 ${
                    activeTab === key
                      ? 'border-b-2 border-indigo-500 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content based on active tab */}
          <div className="p-6">
            {activeTab === 'designer' && (
              <div className="space-y-6">
                {/* Active workflows */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredWorkflows.map((workflow) => (
                    <div key={workflow.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{workflow.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">{workflow.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(workflow.priority)}`}>
                            {workflow.priority.charAt(0).toUpperCase() + workflow.priority.slice(1)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(workflow.status)}`}>
                            {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Progress</span>
                          <span className="font-medium">{workflow.completedTasks}/{workflow.tasks} tasks</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${(workflow.completedTasks / workflow.tasks) * 100}%` }}
                          ></div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                          <div>
                            <p className="text-xs text-gray-500">Success Rate</p>
                            <p className="text-sm font-bold text-green-600">{workflow.successRate}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Avg Execution</p>
                            <p className="text-sm font-bold text-blue-600">{workflow.avgExecutionTime}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 pt-2">
                          {workflow.agents.map((agent, index) => (
                            <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                              {agent}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                        <button className="p-2 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-indigo-50">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-indigo-50">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 rounded-full hover:bg-green-50">
                          <Play className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'assignment' && (
              <div className="text-center py-12">
                <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Task Assignment & Delegation</h3>
                <p className="text-gray-500">Manage task prioritization, deadlines, and distribution</p>
                <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  Assign New Task
                </button>
              </div>
            )}

            {activeTab === 'templates' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {workflowTemplates.map((template) => (
                    <div key={template.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{template.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                        </div>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {template.category}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Usage Count</span>
                          <span className="font-medium">{template.usageCount}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Rating</span>
                          <span className="font-medium text-amber-600">{template.rating}/5</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                        <button className="px-3 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700">
                          Use Template
                        </button>
                        <button className="p-2 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-indigo-50">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'dependencies' && (
              <div className="text-center py-12">
                <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Dependencies & Triggers</h3>
                <p className="text-gray-500">Configure task relationships and event-based triggers</p>
                <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  Configure Triggers
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}