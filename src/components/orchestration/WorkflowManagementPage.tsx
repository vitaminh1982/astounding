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
      case 'active': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'paused': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'inactive': return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
      case 'error': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'low': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'High': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'Medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'Low': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header with breadcrumb */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors">Workflow & Task Management</h1>
              <p className="text-gray-600 dark:text-gray-400 transition-colors">Design, assign, and manage complex multi-agent workflows</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors">
                <Copy className="w-4 h-4" />
                Clone Workflow
              </button>
              <button className="flex items-center gap-2 bg-teal-600 dark:bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors shadow-sm dark:shadow-gray-900">
                <Plus className="w-4 h-4" />
                New Workflow
              </button>
            </div>
          </div>
        </div>

        {/* Overview metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600 shadow-sm dark:shadow-gray-900 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Active Workflows</p>
                <p className="text-2xl font-bold text-purple-600">{workflows.filter(w => w.status === 'active').length}</p>
              </div>
              <Workflow className="w-8 h-8 text-purple-500" />
            </div>
            <div className="mt-2 text-xs text-green-600 dark:text-green-400 transition-colors">+2 this week</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600 shadow-sm dark:shadow-gray-900 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Avg Success Rate</p>
                <p className="text-2xl font-bold text-green-600">93.8%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-500" />
            </div>
            <div className="mt-2 text-xs text-green-600 dark:text-green-400 transition-colors">+2.1% improvement</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600 shadow-sm dark:shadow-gray-900 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Total Executions</p>
                <p className="text-2xl font-bold text-blue-600">3,491</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
            <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 transition-colors">Today: 156</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600 shadow-sm dark:shadow-gray-900 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Avg Execution Time</p>
                <p className="text-2xl font-bold text-orange-600">3.7min</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
            <div className="mt-2 text-xs text-green-600 dark:text-green-400 transition-colors">-0.8min faster</div>
          </div>
        </div>

        {/* Main content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900 border border-gray-200 dark:border-gray-600 transition-colors">
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-600 transition-colors">
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
                  className={`py-4 px-6 text-sm font-medium flex items-center gap-2 transition-colors ${
                    activeTab === key
                      ? 'border-b-2 border-teal-500 dark:border-teal-400 text-teal-600 dark:text-teal-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Search and filters */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-600 transition-colors">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab === 'templates' ? 'templates' : 'workflows'}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-teal-500 dark:focus:border-teal-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors">
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
                    <div key={workflow.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-6 hover:shadow-md dark:hover:shadow-gray-800 transition-all bg-white dark:bg-gray-700">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 transition-colors">{workflow.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors">{workflow.description}</p>
                          <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded-full mt-2 transition-colors">
                            {workflow.category}
                          </span>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${getPriorityColor(workflow.priority)}`}>
                            {workflow.priority.charAt(0).toUpperCase() + workflow.priority.slice(1)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${getStatusColor(workflow.status)}`}>
                            {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300 transition-colors">
                          <span className="text-gray-500 dark:text-gray-400">Progress</span>
                          <span className="font-medium">{workflow.completedTasks}/{workflow.tasks} tasks</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div 
                            className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(workflow.completedTasks / workflow.tasks) * 100}%` }}
                          ></div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-200 dark:border-gray-600 transition-colors">
                          <div className="text-center">
                            <p className="text-sm font-bold text-green-600">{workflow.successRate}%</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">Success Rate</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-bold text-blue-600">{workflow.avgExecutionTime}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">Avg Time</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-bold text-purple-600">{workflow.totalExecutions}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">Executions</p>
                          </div>
                        </div>
                        
                        <div className="pt-2">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 transition-colors">Assigned Agents:</p>
                          <div className="flex flex-wrap gap-2">
                            {workflow.agents.map((agent, index) => (
                              <span key={index} className="px-2 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs rounded-full transition-colors">
                                {agent}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 transition-colors">
                        <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 rounded-full hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 rounded-full hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors" title="Edit Workflow">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400 rounded-full hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors" title="Run Workflow">
                          <Play className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-yellow-600 dark:hover:text-yellow-400 rounded-full hover:bg-yellow-50 dark:hover:bg-yellow-900/30 transition-colors" title="Pause Workflow">
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
                  <UserCheck className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4 transition-colors" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 transition-colors">Task Assignment & Delegation</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4 transition-colors">Manage task prioritization, deadlines, and distribution across agents</p>
                  <div className="flex justify-center gap-3">
                    <button className="px-4 py-2 bg-teal-600 dark:bg-teal-500 text-white rounded-lg hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors">
                      Assign New Task
                    </button>
                    <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors">
                      Bulk Assignment
                    </button>
                  </div>
                </div>

                {/* Task assignment overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6 border border-blue-200 dark:border-blue-600 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-blue-900 dark:text-blue-300 transition-colors">Pending Tasks</h4>
                      <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 transition-colors">23</p>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-2 transition-colors">Awaiting assignment</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-6 border border-green-200 dark:border-green-600 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-green-900 dark:text-green-300 transition-colors">In Progress</h4>
                      <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400 transition-colors">45</p>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-2 transition-colors">Currently executing</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-6 border border-purple-200 dark:border-purple-600 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-purple-900 dark:text-purple-300 transition-colors">Completed Today</h4>
                      <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 transition-colors">127</p>
                    <p className="text-sm text-purple-700 dark:text-purple-300 mt-2 transition-colors">Successfully finished</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'templates' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTemplates.map((template) => (
                    <div key={template.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-6 hover:shadow-md dark:hover:shadow-gray-800 transition-all bg-white dark:bg-gray-700">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 transition-colors">{template.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors">{template.description}</p>
                        </div>
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded-full transition-colors">
                          {template.category}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300 transition-colors">
                          <span className="text-gray-500 dark:text-gray-400">Usage Count</span>
                          <span className="font-medium">{template.usageCount}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300 transition-colors">
                          <span className="text-gray-500 dark:text-gray-400">Rating</span>
                          <span className="font-medium text-amber-600">{template.rating}/5</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300 transition-colors">
                          <span className="text-gray-500 dark:text-gray-400">Est. Time</span>
                          <span className="font-medium">{template.estimatedTime}</span>
                        </div>
                        <div className="flex justify-between text-sm items-center">
                          <span className="text-gray-500 dark:text-gray-400">Complexity</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${getComplexityColor(template.complexity)}`}>
                            {template.complexity}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 transition-colors">
                        <button className="px-3 py-1 text-xs bg-teal-600 dark:bg-teal-500 text-white rounded hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors">
                          Use Template
                        </button>
                        <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 rounded-full hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors" title="Preview">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400 rounded-full hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors" title="Clone">
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
                  <Zap className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4 transition-colors" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 transition-colors">Dependencies & Triggers</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4 transition-colors">Configure task relationships and event-based triggers</p>
                  <div className="flex justify-center gap-3">
                    <button className="px-4 py-2 bg-teal-600 dark:bg-teal-500 text-white rounded-lg hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors">
                      Configure Triggers
                    </button>
                    <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors">
                      Manage Dependencies
                    </button>
                  </div>
                </div>

                {/* Dependencies overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-6 border border-yellow-200 dark:border-yellow-600 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-yellow-900 dark:text-yellow-300 transition-colors">Active Triggers</h4>
                      <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 transition-colors">12</p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2 transition-colors">Event-based triggers configured</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6 border border-blue-200 dark:border-blue-600 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-blue-900 dark:text-blue-300 transition-colors">Dependencies</h4>
                      <GitBranch className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 transition-colors">8</p>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-2 transition-colors">Task relationships defined</p>
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
