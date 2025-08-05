import React, { useState } from 'react';
import { 
  Settings, 
  Activity, 
  Users, 
  GitBranch, 
  BarChart3, 
  Server, 
  MessageSquare,
  ArrowRight,
  Bot,
  Workflow,
  Monitor,
  Zap,
  Database,
  Network,
  UserCheck,
  Share2,
  FileText,
  Bell,
  TrendingUp
} from 'lucide-react';
import { Page } from '../App';

interface OrchestrationPageProps {
  onNavigate: (page: Page) => void;
}

// Define orchestration categories with their sub-items
const orchestrationCategories = [
  {
    id: 'agent-management',
    title: 'Agent Management',
    description: 'Comprehensive agent lifecycle and configuration management',
    icon: Bot,
    color: 'bg-blue-100 text-blue-600',
    items: [
      {
        id: 'agent-directory',
        title: 'Agent Directory',
        description: 'Comprehensive list with status, purpose, and capabilities',
        page: 'agent-directory' as Page,
        icon: Users,
        metrics: '24 Active Agents'
      },
      {
        id: 'agent-config',
        title: 'Agent Configuration',
        description: 'Create, edit parameters, and define agent roles',
        page: 'agent-config' as Page,
        icon: Settings,
        metrics: '12 Configurations'
      },
      {
        id: 'agent-versioning',
        title: 'Agent Versioning',
        description: 'Version control, rollbacks, and updates',
        page: 'agent-versioning' as Page,
        icon: GitBranch,
        metrics: 'v2.1.3 Latest'
      },
      {
        id: 'agent-lifecycle',
        title: 'Agent Lifecycle Management',
        description: 'Deploy, stop, restart, and decommission agents',
        page: 'agent-lifecycle' as Page,
        icon: Activity,
        metrics: '18 Deployments'
      }
    ]
  },
  {
    id: 'workflow-task-management',
    title: 'Workflow & Task Management',
    description: 'Design, assign, and manage complex multi-agent workflows',
    icon: Workflow,
    color: 'bg-purple-100 text-purple-600',
    items: [
      {
        id: 'workflow-designer',
        title: 'Workflow Designer',
        description: 'Visual drag-and-drop interface for workflow creation',
        page: 'workflow-designer' as Page,
        icon: GitBranch,
        metrics: '8 Active Workflows'
      },
      {
        id: 'task-assignment',
        title: 'Task Assignment & Delegation',
        description: 'Prioritization, deadlines, and task distribution',
        page: 'task-assignment' as Page,
        icon: UserCheck,
        metrics: '156 Tasks Pending'
      },
      {
        id: 'workflow-templates',
        title: 'Workflow Templates',
        description: 'Reusable workflow patterns and blueprints',
        page: 'workflow-templates' as Page,
        icon: Database,
        metrics: '23 Templates'
      },
      {
        id: 'dependencies-triggers',
        title: 'Dependencies & Triggers',
        description: 'Task relationships and event-based triggers',
        page: 'dependencies-triggers' as Page,
        icon: Zap,
        metrics: '45 Triggers Active'
      }
    ]
  },
  {
    id: 'monitoring-analytics',
    title: 'Monitoring & Analytics',
    description: 'Real-time insights and performance tracking',
    icon: BarChart3,
    color: 'bg-green-100 text-green-600',
    items: [
      {
        id: 'activity-dashboard',
        title: 'Real-time Activity Dashboard',
        description: 'Live system view and operational status',
        page: 'activity-dashboard' as Page,
        icon: Monitor,
        metrics: '99.8% Uptime'
      },
      {
        id: 'performance-metrics',
        title: 'Performance Metrics',
        description: 'KPIs, execution times, and success rates',
        page: 'performance-metrics' as Page,
        icon: BarChart3,
        metrics: '94.2% Success Rate'
      },
      {
        id: 'logs-tracing',
        title: 'Logs & Tracing',
        description: 'Centralized logging and debugging tools',
        page: 'logs-tracing' as Page,
        icon: FileText,
        metrics: '2.3M Log Entries'
      },
      {
        id: 'alerts-notifications',
        title: 'Alerts & Notifications',
        description: 'Custom alerts and anomaly detection',
        page: 'alerts-notifications' as Page,
        icon: Bell,
        metrics: '3 Active Alerts'
      }
    ]
  },
  {
    id: 'resource-environment',
    title: 'Resource & Environment Management',
    description: 'Infrastructure and resource optimization',
    icon: Server,
    color: 'bg-orange-100 text-orange-600',
    items: [
      {
        id: 'resource-allocation',
        title: 'Resource Allocation',
        description: 'CPU, GPU, and memory management',
        page: 'resource-allocation' as Page,
        icon: Server,
        metrics: '78% CPU Usage'
      },
      {
        id: 'environment-config',
        title: 'Environment Configuration',
        description: 'Dependencies and integrations setup',
        page: 'environment-config' as Page,
        icon: Settings,
        metrics: '12 Environments'
      },
      {
        id: 'scalability-settings',
        title: 'Scalability Settings',
        description: 'Auto-scaling rules and capacity planning',
        page: 'scalability-settings' as Page,
        icon: TrendingUp,
        metrics: 'Auto-scaling On'
      }
    ]
  },
  {
    id: 'collaboration-handoff',
    title: 'Collaboration & Hand-off',
    description: 'Human-AI and inter-agent coordination',
    icon: Share2,
    color: 'bg-teal-100 text-teal-600',
    items: [
      {
        id: 'human-agent-collaboration',
        title: 'Human-Agent Collaboration Points',
        description: 'Workflow integration and handoff points',
        page: 'human-agent-collaboration' as Page,
        icon: UserCheck,
        metrics: '15 Collaboration Points'
      },
      {
        id: 'inter-agent-communication',
        title: 'Inter-Agent Communication',
        description: 'Communication channels and protocol monitoring',
        page: 'inter-agent-communication' as Page,
        icon: Network,
        metrics: '89 Active Channels'
      }
    ]
  }
];

export default function OrchestrationPage({ onNavigate }: OrchestrationPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Network className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Multi-Agent Orchestration
              </h1>
              <p className="text-lg text-gray-600">
                Central hub for managing and coordinating AI agent workflows
              </p>
            </div>
          </div>
          
          {/* Quick stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Agents</p>
                  <p className="text-2xl font-bold text-indigo-600">24</p>
                </div>
                <Bot className="w-8 h-8 text-indigo-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Running Workflows</p>
                  <p className="text-2xl font-bold text-purple-600">8</p>
                </div>
                <Workflow className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">System Health</p>
                  <p className="text-2xl font-bold text-green-600">99.8%</p>
                </div>
                <Activity className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Resource Usage</p>
                  <p className="text-2xl font-bold text-orange-600">78%</p>
                </div>
                <Server className="w-8 h-8 text-orange-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Main orchestration categories */}
        <div className="space-y-8">
          {orchestrationCategories.map((category) => (
            <div key={category.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
              {/* Category header */}
              <div className="p-6 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 ${category.color} rounded-lg`}>
                      <category.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{category.title}</h2>
                      <p className="text-gray-600">{category.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCategory(
                      selectedCategory === category.id ? null : category.id
                    )}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <ArrowRight 
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        selectedCategory === category.id ? 'rotate-90' : ''
                      }`} 
                    />
                  </button>
                </div>
              </div>

              {/* Category items */}
              <div className={`transition-all duration-300 ease-in-out ${
                selectedCategory === category.id ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
              } overflow-hidden`}>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => onNavigate(item.page)}
                        className="text-left p-4 border rounded-lg hover:border-indigo-300 hover:shadow-md transition-all duration-200 group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-gray-100 group-hover:bg-indigo-100 rounded-lg transition-colors">
                            <item.icon className="w-5 h-5 text-gray-600 group-hover:text-indigo-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 group-hover:text-indigo-900">
                              {item.title}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                              {item.description}
                            </p>
                            <div className="mt-2 text-xs text-indigo-600 font-medium">
                              {item.metrics}
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions footer */}
        <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => onNavigate('workflow-designer')}
              className="flex items-center gap-3 p-4 bg-white rounded-lg border hover:border-indigo-300 hover:shadow-md transition-all"
            >
              <div className="p-2 bg-indigo-100 rounded-lg">
                <GitBranch className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="text-left">
                <h4 className="font-medium">Create Workflow</h4>
                <p className="text-sm text-gray-500">Design new multi-agent workflow</p>
              </div>
            </button>
            
            <button 
              onClick={() => onNavigate('agent-directory')}
              className="flex items-center gap-3 p-4 bg-white rounded-lg border hover:border-purple-300 hover:shadow-md transition-all"
            >
              <div className="p-2 bg-purple-100 rounded-lg">
                <Bot className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-left">
                <h4 className="font-medium">Deploy Agent</h4>
                <p className="text-sm text-gray-500">Add new agent to ecosystem</p>
              </div>
            </button>
            
            <button 
              onClick={() => onNavigate('activity-dashboard')}
              className="flex items-center gap-3 p-4 bg-white rounded-lg border hover:border-green-300 hover:shadow-md transition-all"
            >
              <div className="p-2 bg-green-100 rounded-lg">
                <Monitor className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-left">
                <h4 className="font-medium">Monitor System</h4>
                <p className="text-sm text-gray-500">View real-time activity</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}