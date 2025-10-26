import React, { useState } from 'react';
import { 
  Server, 
  Settings, 
  TrendingUp,
  ArrowLeft,
  Cpu,
  HardDrive,
  Zap,
  Database,
  Monitor,
  Activity,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Plus,
  Edit2,
  Eye,
  Trash2
} from 'lucide-react';
import { Page } from '../../App';

interface ResourceManagementPageProps {
  onNavigate: (page: Page) => void;
}

// Mock data for resource usage
const resourceMetrics = [
  {
    id: 'cpu',
    name: 'CPU Usage',
    current: 78,
    max: 100,
    unit: '%',
    status: 'optimal',
    trend: 'stable',
    details: 'Distributed across 12 cores'
  },
  {
    id: 'memory',
    name: 'Memory Usage',
    current: 12.4,
    max: 32,
    unit: 'GB',
    status: 'good',
    trend: 'increasing',
    details: 'Peak usage: 15.2 GB'
  },
  {
    id: 'gpu',
    name: 'GPU Usage',
    current: 45,
    max: 100,
    unit: '%',
    status: 'optimal',
    trend: 'stable',
    details: 'NVIDIA A100 cluster'
  },
  {
    id: 'storage',
    name: 'Storage Usage',
    current: 245,
    max: 500,
    unit: 'GB',
    status: 'good',
    trend: 'increasing',
    details: 'SSD storage pool'
  },
  {
    id: 'network',
    name: 'Network I/O',
    current: 2.8,
    max: 10,
    unit: 'Gbps',
    status: 'optimal',
    trend: 'stable',
    details: 'Inbound/Outbound traffic'
  },
  {
    id: 'api-calls',
    name: 'API Calls/Min',
    current: 1247,
    max: 5000,
    unit: '',
    status: 'good',
    trend: 'increasing',
    details: 'External API requests'
  }
];

// Mock data for environments
const environments = [
  {
    id: 'prod',
    name: 'Production',
    status: 'active',
    agents: 18,
    uptime: '99.9%',
    lastDeployment: '2025-03-15 14:30',
    region: 'EU-West',
    resources: { cpu: 85, memory: 78, storage: 45 }
  },
  {
    id: 'staging',
    name: 'Staging',
    status: 'active',
    agents: 6,
    uptime: '99.5%',
    lastDeployment: '2025-03-15 12:15',
    region: 'EU-West',
    resources: { cpu: 45, memory: 38, storage: 25 }
  },
  {
    id: 'dev',
    name: 'Development',
    status: 'active',
    agents: 3,
    uptime: '98.2%',
    lastDeployment: '2025-03-15 16:45',
    region: 'EU-Central',
    resources: { cpu: 25, memory: 22, storage: 15 }
  },
  {
    id: 'test',
    name: 'Testing',
    status: 'inactive',
    agents: 0,
    uptime: '0%',
    lastDeployment: '2025-03-10 09:30',
    region: 'US-East',
    resources: { cpu: 0, memory: 0, storage: 5 }
  }
];

// Mock data for scaling rules
const scalingRules = [
  {
    id: 'rule-001',
    name: 'CPU Auto-scaling',
    condition: 'CPU > 80% for 5 minutes',
    action: 'Scale up by 2 instances',
    status: 'active',
    lastTriggered: '2025-03-14 22:15',
    triggerCount: 3
  },
  {
    id: 'rule-002',
    name: 'Memory Auto-scaling',
    condition: 'Memory > 90% for 3 minutes',
    action: 'Scale up by 1 instance',
    status: 'active',
    lastTriggered: 'Never',
    triggerCount: 0
  },
  {
    id: 'rule-003',
    name: 'Load-based Scaling',
    condition: 'Queue length > 100 requests',
    action: 'Scale up by 3 instances',
    status: 'active',
    lastTriggered: '2025-03-15 08:30',
    triggerCount: 7
  },
  {
    id: 'rule-004',
    name: 'Off-hours Scaling',
    condition: 'Time between 22:00-06:00',
    action: 'Scale down to minimum',
    status: 'active',
    lastTriggered: '2025-03-15 22:00',
    triggerCount: 15
  }
];

export default function ResourceManagementPage({ onNavigate }: ResourceManagementPageProps) {
  const [activeTab, setActiveTab] = useState<'allocation' | 'environment' | 'scalability'>('allocation');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'inactive': return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
      case 'error': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  const getResourceStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'text-green-600 dark:text-green-400';
      case 'good': return 'text-blue-600 dark:text-blue-400';
      case 'warning': return 'text-yellow-600 dark:text-yellow-400';
      case 'critical': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getResourceBarColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header with breadcrumb */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors">Resource & Environment Management</h1>
              <p className="text-gray-600 dark:text-gray-400 transition-colors">Infrastructure and resource optimization</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button className="flex items-center gap-2 bg-indigo-600 dark:bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-teal-700 transition-colors shadow-sm dark:shadow-gray-900">
                <Settings className="w-4 h-4" />
                Configure
              </button>
            </div>
          </div>
        </div>

        {/* Resource overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600 shadow-sm dark:shadow-gray-900 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Total Resources</p>
                <p className="text-2xl font-bold text-teal-600 dark:text-teal-400 transition-colors">78%</p>
              </div>
              <Server className="w-8 h-8 text-teal-500 dark:text-teal-400" />
            </div>
            <div className="mt-2 text-xs text-green-600 dark:text-green-400 transition-colors">Within optimal range</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600 shadow-sm dark:shadow-gray-900 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Active Environments</p>
                <p className="text-2xl font-bold text-green-600">3</p>
              </div>
              <Monitor className="w-8 h-8 text-green-500" />
            </div>
            <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 transition-colors">1 inactive</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600 shadow-sm dark:shadow-gray-900 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Auto-scaling Rules</p>
                <p className="text-2xl font-bold text-purple-600">4</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
            <div className="mt-2 text-xs text-green-600 dark:text-green-400 transition-colors">All active</div>
          </div>
        </div>

        {/* Main content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900 border border-gray-200 dark:border-gray-600 transition-colors">
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-600 transition-colors">
            <nav className="flex -mb-px">
              {[
                { key: 'allocation', label: 'Resource Allocation', icon: Server },
                { key: 'environment', label: 'Environment Configuration', icon: Settings },
                { key: 'scalability', label: 'Scalability Settings', icon: TrendingUp }
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

          {/* Content based on active tab */}
          <div className="p-6">
            {activeTab === 'allocation' && (
              <div className="space-y-6">
                {/* Resource usage cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {resourceMetrics.map((resource) => (
                    <div key={resource.id} className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-6 transition-colors">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors">{resource.name}</h3>
                        <div className={`text-sm font-medium transition-colors ${getResourceStatusColor(resource.status)}`}>
                          {resource.status.charAt(0).toUpperCase() + resource.status.slice(1)}
                        </div>
                      </div>
                      <div className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100 transition-colors">
                        {resource.current}{resource.unit}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-3 transition-colors">
                        of {resource.max}{resource.unit}
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-3">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getResourceBarColor(resource.status)}`}
                          style={{ width: `${(resource.current / resource.max) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">{resource.details}</p>
                    </div>
                  ))}
                </div>

                {/* Resource allocation chart placeholder */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-8 text-center transition-colors">
                  <BarChart3 className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4 transition-colors" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 transition-colors">Resource Usage Over Time</h3>
                  <p className="text-gray-500 dark:text-gray-400 transition-colors">Interactive chart showing resource consumption patterns and trends</p>
                  <button className="mt-4 px-4 py-2 bg-teal-600 dark:bg-teal-500 text-white rounded-lg hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors">
                    View Detailed Analytics
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'environment' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 transition-colors">Environment Configuration</h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 dark:bg-teal-500 text-white rounded-lg hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors">
                    <Plus className="w-4 h-4" />
                    New Environment
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {environments.map((env) => (
                    <div key={env.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-6 bg-white dark:bg-gray-700 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 transition-colors">{env.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Region: {env.region}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Last deployment: {env.lastDeployment}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${getStatusColor(env.status)}`}>
                          {env.status.charAt(0).toUpperCase() + env.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Active Agents</p>
                          <p className="text-xl font-bold text-teal-600 dark:text-teal-400 transition-colors">{env.agents}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Uptime</p>
                          <p className="text-xl font-bold text-green-600">{env.uptime}</p>
                        </div>
                      </div>

                      {/* Resource usage for this environment */}
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300 transition-colors">
                          <span>CPU</span>
                          <span>{env.resources.cpu}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                          <div 
                            className="bg-blue-500 h-1.5 rounded-full"
                            style={{ width: `${env.resources.cpu}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300 transition-colors">
                          <span>Memory</span>
                          <span>{env.resources.memory}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                          <div 
                            className="bg-purple-500 h-1.5 rounded-full"
                            style={{ width: `${env.resources.memory}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-600 transition-colors">
                        <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 rounded-full hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 rounded-full hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors" title="Configure">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {env.status === 'inactive' && (
                          <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'scalability' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 transition-colors">Auto-scaling Rules</h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 dark:bg-teal-500 text-white rounded-lg hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors">
                    <Plus className="w-4 h-4" />
                    New Rule
                  </button>
                </div>

                <div className="space-y-4">
                  {scalingRules.map((rule) => (
                    <div key={rule.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-6 bg-white dark:bg-gray-700 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 transition-colors">{rule.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors">
                            Last triggered: {rule.lastTriggered} • Triggered {rule.triggerCount} times
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${getStatusColor(rule.status)}`}>
                          {rule.status.charAt(0).toUpperCase() + rule.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-600/50 rounded-lg p-4 transition-colors">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">Condition</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">{rule.condition}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">Action</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">{rule.action}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2 mt-4">
                        <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 rounded-full hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 rounded-full hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors" title="Edit Rule">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="px-3 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors">
                          Test Rule
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Scaling metrics */}
                <div className="bg-teal-50 dark:bg-teal-900/30 rounded-lg p-6 border border-teal-200 dark:border-teal-600 transition-colors">
                  <h4 className="font-medium text-teal-900 dark:text-teal-300 mb-4 transition-colors">Scaling Performance</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-teal-600 dark:text-teal-400 transition-colors">2.3min</p>
                      <p className="text-sm text-teal-700 dark:text-teal-300 transition-colors">Avg Scale-up Time</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-teal-600 dark:text-teal-400 transition-colors">98.5%</p>
                      <p className="text-sm text-teal-700 dark:text-teal-300 transition-colors">Scaling Success Rate</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-teal-600 dark:text-teal-400 transition-colors">25</p>
                      <p className="text-sm text-teal-700 dark:text-teal-300 transition-colors">Scaling Events (24h)</p>
                    </div>
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
