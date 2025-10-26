import React, { useState } from 'react';
import { 
  Bot, 
  Users, 
  Settings, 
  GitBranch, 
  Activity, 
  Plus, 
  Search, 
  Filter,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Trash2,
  Edit2,
  Eye,
  Download,
  Upload,
  CheckCircle,
  AlertTriangle,
  Clock,
  Cpu,
  BarChart3
} from 'lucide-react';
import { Page } from '../../App';

interface AgentManagementPageProps {
  onNavigate: (page: Page) => void;
}

// Mock data for agents with comprehensive details
const agents = [
  {
    id: 'agent-001',
    name: 'Customer Support 24/7',
    type: 'Support',
    status: 'active',
    version: 'v2.1.3',
    purpose: 'Handle customer inquiries and support requests around the clock',
    capabilities: ['Natural Language Processing', 'Sentiment Analysis', 'Escalation Management', 'Multi-language Support'],
    lastDeployed: '2025-03-15',
    performance: { 
      uptime: '99.9%', 
      responseTime: '1.2s', 
      satisfaction: 4.8,
      conversationsToday: 156,
      resolutionRate: 94.2
    },
    resources: {
      cpu: 45,
      memory: 2.1,
      requests: 1247
    }
  },
  {
    id: 'agent-002',
    name: 'Sales Assistant',
    type: 'Sales',
    status: 'active',
    version: 'v1.8.2',
    purpose: 'Qualify leads and assist with sales processes',
    capabilities: ['Lead Qualification', 'CRM Integration', 'Product Recommendations', 'Pipeline Management'],
    lastDeployed: '2025-03-12',
    performance: { 
      uptime: '99.7%', 
      responseTime: '1.5s', 
      satisfaction: 4.6,
      conversationsToday: 89,
      resolutionRate: 91.8
    },
    resources: {
      cpu: 38,
      memory: 1.8,
      requests: 892
    }
  },
  {
    id: 'agent-003',
    name: 'Technical Assistant',
    type: 'Technical',
    status: 'active',
    version: 'v2.0.1',
    purpose: 'Provide technical support and troubleshooting assistance',
    capabilities: ['Technical Diagnostics', 'Documentation Search', 'Issue Resolution', 'Code Analysis'],
    lastDeployed: '2025-03-10',
    performance: { 
      uptime: '99.5%', 
      responseTime: '2.1s', 
      satisfaction: 4.4,
      conversationsToday: 67,
      resolutionRate: 88.5
    },
    resources: {
      cpu: 52,
      memory: 2.4,
      requests: 445
    }
  },
  {
    id: 'agent-004',
    name: 'E-commerce Assistant',
    type: 'E-commerce',
    status: 'active',
    version: 'v1.9.0',
    purpose: 'Manage product inquiries and order processing',
    capabilities: ['Product Search', 'Order Management', 'Inventory Tracking', 'Payment Processing'],
    lastDeployed: '2025-03-14',
    performance: { 
      uptime: '99.8%', 
      responseTime: '1.1s', 
      satisfaction: 4.7,
      conversationsToday: 123,
      resolutionRate: 95.3
    },
    resources: {
      cpu: 41,
      memory: 1.9,
      requests: 673
    }
  },
  {
    id: 'agent-005',
    name: 'Billing Service',
    type: 'Finance',
    status: 'active',
    version: 'v1.6.1',
    purpose: 'Handle billing inquiries and payment processing',
    capabilities: ['Payment Processing', 'Invoice Management', 'Refund Processing', 'Account Management'],
    lastDeployed: '2025-03-11',
    performance: { 
      uptime: '99.6%', 
      responseTime: '1.8s', 
      satisfaction: 4.5,
      conversationsToday: 78,
      resolutionRate: 92.1
    },
    resources: {
      cpu: 35,
      memory: 1.6,
      requests: 334
    }
  },
  {
    id: 'agent-006',
    name: 'HR Assistant',
    type: 'HR',
    status: 'paused',
    version: 'v1.5.0',
    purpose: 'Manage HR inquiries and employee support',
    capabilities: ['Policy Information', 'Leave Management', 'Employee Onboarding', 'Benefits Administration'],
    lastDeployed: '2025-03-08',
    performance: { 
      uptime: '98.2%', 
      responseTime: '1.9s', 
      satisfaction: 4.3,
      conversationsToday: 12,
      resolutionRate: 87.6
    },
    resources: {
      cpu: 15,
      memory: 0.8,
      requests: 89
    }
  }
];

export default function AgentManagementPage({ onNavigate }: AgentManagementPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'directory' | 'configuration' | 'versioning' | 'lifecycle'>('directory');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'paused': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'inactive': return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
      case 'error': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />;
      case 'paused': return <Clock className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />;
      case 'inactive': return <AlertTriangle className="w-4 h-4 text-gray-500 dark:text-gray-400" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500 dark:text-red-400" />;
      default: return <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />;
    }
  };

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.purpose.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header with breadcrumb */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors">Agent Management</h1>
              <p className="text-gray-600 dark:text-gray-400 transition-colors">Comprehensive agent lifecycle and configuration management</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Upload className="w-4 h-4" />
                Import Agent
              </button>
              <button className="flex items-center gap-2 bg-teal-600 dark:bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors shadow-sm dark:shadow-gray-900">
                <Plus className="w-4 h-4" />
                New Agent
              </button>
            </div>
          </div>
        </div>

        {/* Overview metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-gray-900 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Total Agents</p>
                <p className="text-2xl font-bold text-teal-600 dark:text-teal-400 transition-colors">{agents.length}</p>
              </div>
              <Bot className="w-8 h-8 text-indigo-500" />
            </div>
            <div className="mt-2 text-xs text-green-600 dark:text-green-400 transition-colors">
              {agents.filter(a => a.status === 'active').length} active
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-gray-900 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Avg Response Time</p>
                <p className="text-2xl font-bold text-green-600">1.5s</p>
              </div>
              <Clock className="w-8 h-8 text-green-500" />
            </div>
            <div className="mt-2 text-xs text-green-600 dark:text-green-400 transition-colors">-0.3s improvement</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-gray-900 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">System Health</p>
                <p className="text-2xl font-bold text-green-600">99.6%</p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
            <div className="mt-2 text-xs text-green-600 dark:text-green-400 transition-colors">All systems operational</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-gray-900 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Resource Usage</p>
                <p className="text-2xl font-bold text-orange-600">38%</p>
              </div>
              <Cpu className="w-8 h-8 text-orange-500" />
            </div>
            <div className="mt-2 text-xs text-yellow-600">Optimal range</div>
          </div>
        </div>

        {/* Main content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900 border border-gray-200 dark:border-gray-600 transition-colors">
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-600 transition-colors">
            <nav className="flex -mb-px">
              {[
                { key: 'directory', label: 'Agent Directory', icon: Users },
                { key: 'configuration', label: 'Configuration', icon: Settings },
                { key: 'versioning', label: 'Versioning', icon: GitBranch },
                { key: 'lifecycle', label: 'Lifecycle', icon: Activity }
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
                  placeholder="Search agents by name, type, or purpose..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-teal-500 dark:focus:border-teal-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                />
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors">
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                </button>
                <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-2 text-sm transition-colors ${viewMode === 'grid' ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-2 text-sm border-l border-gray-300 dark:border-gray-600 transition-colors ${viewMode === 'list' ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                  >
                    List
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content based on active tab */}
          <div className="p-6">
            {activeTab === 'directory' && (
              <div className="space-y-6">
                {/* Agent cards/list */}
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}>
                  {filteredAgents.map((agent) => (
                    <div
                      key={agent.id}
                      className={`border border-gray-200 dark:border-gray-600 rounded-lg p-6 hover:shadow-md dark:hover:shadow-gray-800 transition-all cursor-pointer ${
                        selectedAgent === agent.id ? 'border-teal-500 dark:border-teal-400 bg-teal-50 dark:bg-teal-900/30' : ''
                      } ${viewMode === 'list' ? 'flex items-center justify-between' : ''}`}
                      onClick={() => setSelectedAgent(agent.id)}
                    >
                      <div className={`${viewMode === 'list' ? 'flex items-center gap-4 flex-1' : ''}`}>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-indigo-100 dark:bg-teal-900/30 rounded-lg transition-colors">
                            <Bot className="w-6 h-6 text-indigo-600 dark:text-teal-400" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-900 dark:text-gray-100 transition-colors">{agent.name}</h3>
                              {getStatusIcon(agent.status)}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">{agent.type} • {agent.version}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${getStatusColor(agent.status)} ml-auto`}>
                            {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                          </span>
                        </div>
                        
                        {viewMode === 'grid' && (
                          <>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 transition-colors">{agent.purpose}</p>
                            
                            <div className="space-y-3">
                              <div>
                                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 transition-colors">Capabilities</h4>
                                <div className="flex flex-wrap gap-2">
                                  {agent.capabilities.slice(0, 3).map((capability, index) => (
                                    <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full transition-colors">
                                      {capability}
                                    </span>
                                  ))}
                                  {agent.capabilities.length > 3 && (
                                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full transition-colors">
                                      +{agent.capabilities.length - 3} more
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-200 dark:border-gray-600 transition-colors">
                                <div className="text-center">
                                  <p className="text-sm font-bold text-green-600">{agent.performance.uptime}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">Uptime</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-sm font-bold text-blue-600">{agent.performance.responseTime}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">Response</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-sm font-bold text-amber-600">{agent.performance.satisfaction}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">Rating</p>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      
                      {viewMode === 'list' && (
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <p className="text-sm font-bold text-green-600">{agent.performance.uptime}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">Uptime</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-bold text-blue-600">{agent.performance.conversationsToday}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">Today</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-bold text-amber-600">{agent.performance.satisfaction}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">Rating</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 transition-colors">
                        <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 rounded-full hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 rounded-full hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors" title="Configure">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400 rounded-full hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors" title="Start/Resume">
                          <Play className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-yellow-600 dark:hover:text-yellow-400 rounded-full hover:bg-yellow-50 dark:hover:bg-yellow-900/30 transition-colors" title="Pause">
                          <Pause className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Empty state */}
                {filteredAgents.length === 0 && (
                  <div className="text-center py-12">
                    <Bot className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4 transition-colors" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 transition-colors">No agents found</h3>
                    <p className="text-gray-500 dark:text-gray-400 transition-colors">
                      {searchQuery 
                        ? 'Try adjusting your search criteria' 
                        : 'Get started by creating your first AI agent'}
                    </p>
                    {!searchQuery && (
                      <button className="mt-4 px-4 py-2 bg-teal-600 dark:bg-teal-500 text-white rounded-lg hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors">
                        Create Agent
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'configuration' && (
              <div className="text-center py-12">
                <Settings className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4 transition-colors" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 transition-colors">Agent Configuration</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4 transition-colors">Configure agent parameters, roles, and behavior settings</p>
                <div className="flex justify-center gap-3">
                  <button className="px-4 py-2 bg-teal-600 dark:bg-teal-500 text-white rounded-lg hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors">
                    Configure Selected Agent
                  </button>
                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors">
                    Bulk Configuration
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'versioning' && (
              <div className="text-center py-12">
                <GitBranch className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4 transition-colors" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 transition-colors">Version Control</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4 transition-colors">Manage agent versions, rollbacks, and updates</p>
                <div className="flex justify-center gap-3">
                  <button className="px-4 py-2 bg-teal-600 dark:bg-teal-500 text-white rounded-lg hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors">
                    View Version History
                  </button>
                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors">
                    Create Version
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'lifecycle' && (
              <div className="text-center py-12">
                <Activity className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4 transition-colors" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 transition-colors">Lifecycle Management</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4 transition-colors">Deploy, stop, restart, and decommission agents</p>
                <div className="flex justify-center gap-3">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Deploy Agent
                  </button>
                  <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                    Restart Agent
                  </button>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    Decommission
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
