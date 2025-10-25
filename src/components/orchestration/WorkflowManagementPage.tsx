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
  AlertTriangle,
  BarChart3,
  Activity,
  Users
} from 'lucide-react';
import { Page } from '../../App';

interface WorkflowManagementPageProps {
  onNavigate: (page: Page) => void;
}

// Mock data for workflows with enhanced details
const workflows = [
  {
    id: 'workflow-001',
    name: 'Customer Onboarding Flow',
    description: 'Automated customer onboarding with multiple touchpoints and personalized experiences',
    status: 'active',
    agents: ['Customer Support', 'Sales Assistant', 'E-commerce Assistant'],
    tasks: 12,
    completedTasks: 8,
    priority: 'high',
    lastRun: '2025-03-15 14:30',
    successRate: 94.5,
    avgExecutionTime: '3.2 min',
    totalExecutions: 1247,
    category: 'Customer Experience'
  },
  {
    id: 'workflow-002',
    name: 'Technical Issue Resolution',
    description: 'Multi-step technical support workflow with intelligent escalation and resolution tracking',
    status: 'active',
    agents: ['Technical Assistant', 'Customer Support'],
    tasks: 8,
    completedTasks: 6,
    priority: 'medium',
    lastRun: '2025-03-15 13:45',
    successRate: 89.2,
    avgExecutionTime: '5.7 min',
    totalExecutions: 892,
    category: 'Technical Support'
  },
  {
    id: 'workflow-003',
    name: 'Sales Lead Processing',
    description: 'Comprehensive lead qualification, nurturing, and conversion workflow',
    status: 'active',
    agents: ['Sales Assistant'],
    tasks: 6,
    completedTasks: 6,
    priority: 'high',
    lastRun: '2025-03-15 15:20',
    successRate: 96.8,
    avgExecutionTime: '2.1 min',
    totalExecutions: 673,
    category: 'Sales & Marketing'
  },
  {
    id: 'workflow-004',
    name: 'HR Employee Support',
    description: 'Employee inquiry handling and HR process automation',
    status: 'paused',
    agents: ['HR Assistant'],
    tasks: 4,
    completedTasks: 2,
    priority: 'low',
    lastRun: '2025-03-14 16:00',
    successRate: 87.3,
    avgExecutionTime: '4.5 min',
    totalExecutions: 234,
    category: 'Human Resources'
  },
  {
    id: 'workflow-005',
    name: 'Billing & Payment Processing',
    description: 'Automated billing inquiries and payment processing workflow',
    status: 'active',
    agents: ['Billing Service', 'Customer Support'],
    tasks: 7,
    completedTasks: 7,
    priority: 'medium',
    lastRun: '2025-03-15 14:15',
    successRate: 92.1,
    avgExecutionTime: '2.8 min',
    totalExecutions: 445,
    category: 'Finance'
  }
];

// Mock data for workflow templates
const workflowTemplates = [
  {
    id: 'template-001',
    name: 'Customer Support Template',
    description: 'Standard customer support workflow pattern with escalation paths',
    category: 'Support',
    usageCount: 15,
    rating: 4.8,
    estimatedTime: '3-5 min',
    complexity: 'Medium'
  },
  {
    id: 'template-002',
    name: 'Sales Funnel Template',
    description: 'Lead qualification and conversion workflow with CRM integration',
    category: 'Sales',
    usageCount: 8,
    rating: 4.6,
    estimatedTime: '2-3 min',
    complexity: 'Low'
  },
  {
    id: 'template-003',
    name: 'Technical Escalation Template',
    description: 'Technical issue escalation workflow with expert routing',
    category: 'Technical',
    usageCount: 12,
    rating: 4.7,
    estimatedTime: '5-8 min',
    complexity: 'High'
  },
  {
    id: 'template-004',
    name: 'Multi-Agent Coordination Template',
    description: 'Complex workflow involving multiple agents and decision points',
    category: 'Coordination',
    usageCount: 5,
    rating: 4.9,
    estimatedTime: '8-12 min',
    complexity: 'High'
  }
];

export default function WorkflowManagementPage({ onNavigate }: WorkflowManagementPageProps) {
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

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredWorkflows = workflows.filter(workflow =>
    workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workflow.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workflow.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTemplates = workflowTemplates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header with breadcrumb */}
        <div className="mb-6">

          
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

        {/* Overview metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Workflows</p>
                <p className="text-2xl font-bold text-purple-600">{workflows.filter(w => w.status === 'active').length}</p>
              </div>
              <Workflow className="w-8 h-8 text-purple-500" />
            </div>
            <div className="mt-2 text-xs text-green-600">+2 this week</div>
          </div>
          <div className="bg-white rounded-lg p-4 border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg Success Rate</p>
                <p className="text-2xl font-bold text-green-600">93.8%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-500" />
            </div>
            <div className="mt-2 text-xs text-green-600">+2.1% improvement</div>
          </div>
          <div className="bg-white rounded-lg p-4 border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Executions</p>
                <p className="text-2xl font-bold text-blue-600">3,491</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
            <div className="mt-2 text-xs text-blue-600">Today: 156</div>
          </div>
          <div className="bg-white rounded-lg p-4 border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg Execution Time</p>
                <p className="text-2xl font-bold text-orange-600">3.7min</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
            <div className="mt-2 text-xs text-green-600">-0.8min faster</div>
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

          {/* Search and filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab === 'templates' ? 'templates' : 'workflows'}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white hover:bg-gray-50">
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
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
                          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full mt-2">
                            {workflow.category}
                          </span>
                        </div>
                        <div className="flex flex-col items-end gap-2">
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
                            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(workflow.completedTasks / workflow.tasks) * 100}%` }}
                          ></div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                          <div className="text-center">
                            <p className="text-sm font-bold text-green-600">{workflow.successRate}%</p>
                            <p className="text-xs text-gray-500">Success Rate</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-bold text-blue-600">{workflow.avgExecutionTime}</p>
                            <p className="text-xs text-gray-500">Avg Time</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-bold text-purple-600">{workflow.totalExecutions}</p>
                            <p className="text-xs text-gray-500">Executions</p>
                          </div>
                        </div>
                        
                        <div className="pt-2">
                          <p className="text-xs text-gray-500 mb-2">Assigned Agents:</p>
                          <div className="flex flex-wrap gap-2">
                            {workflow.agents.map((agent, index) => (
                              <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                                {agent}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                        <button className="p-2 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-indigo-50" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-indigo-50" title="Edit Workflow">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 rounded-full hover:bg-green-50" title="Run Workflow">
                          <Play className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-yellow-600 rounded-full hover:bg-yellow-50" title="Pause Workflow">
                          <Pause className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'assignment' && (
              <div className="space-y-6">
                <div className="text-center py-8">
                  <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Task Assignment & Delegation</h3>
                  <p className="text-gray-500 mb-4">Manage task prioritization, deadlines, and distribution across agents</p>
                  <div className="flex justify-center gap-3">
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                      Assign New Task
                    </button>
                    <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                      Bulk Assignment
                    </button>
                  </div>
                </div>

                {/* Task assignment overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 rounded-lg p-6 border">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-blue-900">Pending Tasks</h4>
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-3xl font-bold text-blue-600">23</p>
                    <p className="text-sm text-blue-700 mt-2">Awaiting assignment</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-6 border">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-green-900">In Progress</h4>
                      <Activity className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-3xl font-bold text-green-600">45</p>
                    <p className="text-sm text-green-700 mt-2">Currently executing</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-6 border">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-purple-900">Completed Today</h4>
                      <CheckCircle className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-3xl font-bold text-purple-600">127</p>
                    <p className="text-sm text-purple-700 mt-2">Successfully finished</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'templates' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTemplates.map((template) => (
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
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Est. Time</span>
                          <span className="font-medium">{template.estimatedTime}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Complexity</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getComplexityColor(template.complexity)}`}>
                            {template.complexity}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                        <button className="px-3 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700">
                          Use Template
                        </button>
                        <button className="p-2 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-indigo-50" title="Preview">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 rounded-full hover:bg-green-50" title="Clone">
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'dependencies' && (
              <div className="space-y-6">
                <div className="text-center py-8">
                  <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Dependencies & Triggers</h3>
                  <p className="text-gray-500 mb-4">Configure task relationships and event-based triggers</p>
                  <div className="flex justify-center gap-3">
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                      Configure Triggers
                    </button>
                    <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                      Manage Dependencies
                    </button>
                  </div>
                </div>

                {/* Dependencies overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-yellow-50 rounded-lg p-6 border">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-yellow-900">Active Triggers</h4>
                      <Zap className="w-5 h-5 text-yellow-600" />
                    </div>
                    <p className="text-3xl font-bold text-yellow-600">12</p>
                    <p className="text-sm text-yellow-700 mt-2">Event-based triggers configured</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-6 border">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-blue-900">Dependencies</h4>
                      <GitBranch className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-3xl font-bold text-blue-600">8</p>
                    <p className="text-sm text-blue-700 mt-2">Task relationships defined</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}