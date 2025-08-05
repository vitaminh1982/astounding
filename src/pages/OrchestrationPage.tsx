import React, { useState } from 'react';
import { 
  Bot, 
  Workflow, 
  BarChart3, 
  Server, 
  Share2,
  ArrowRight,
  Activity,
  Network,
  Users,
  GitBranch,
  Monitor,
  Settings,
  UserCheck,
  Database,
  Zap,
  FileText,
  Bell,
  TrendingUp,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { Page } from '../App';

interface OrchestrationPageProps {
  onNavigate: (page: Page) => void;
}

// Define orchestration categories with their navigation pages
const orchestrationCategories = [
  {
    id: 'agent-management',
    title: 'Agent Management',
    description: 'Comprehensive agent lifecycle and configuration management',
    icon: Bot,
    color: 'bg-blue-100 text-blue-600',
    page: 'orchestration-agent-management' as Page,
    stats: {
      primary: '24 Active Agents',
      secondary: '12 Configurations',
      status: 'healthy'
    }
  },
  {
    id: 'workflow-task-management',
    title: 'Workflow & Task Management',
    description: 'Design, assign, and manage complex multi-agent workflows',
    icon: Workflow,
    color: 'bg-purple-100 text-purple-600',
    page: 'orchestration-workflow-management' as Page,
    stats: {
      primary: '8 Active Workflows',
      secondary: '156 Tasks Pending',
      status: 'active'
    }
  },
  {
    id: 'monitoring-analytics',
    title: 'Monitoring & Analytics',
    description: 'Real-time insights and performance tracking',
    icon: BarChart3,
    color: 'bg-green-100 text-green-600',
    page: 'orchestration-monitoring' as Page,
    stats: {
      primary: '99.8% Uptime',
      secondary: '94.2% Success Rate',
      status: 'excellent'
    }
  },
  {
    id: 'resource-environment',
    title: 'Resource & Environment Management',
    description: 'Infrastructure and resource optimization',
    icon: Server,
    color: 'bg-orange-100 text-orange-600',
    page: 'orchestration-resources' as Page,
    stats: {
      primary: '78% CPU Usage',
      secondary: '12 Environments',
      status: 'optimal'
    }
  },
  {
    id: 'collaboration-handoff',
    title: 'Collaboration & Hand-off',
    description: 'Human-AI and inter-agent coordination',
    icon: Share2,
    color: 'bg-teal-100 text-teal-600',
    page: 'orchestration-collaboration' as Page,
    stats: {
      primary: '15 Collaboration Points',
      secondary: '89 Active Channels',
      status: 'coordinated'
    }
  }
];

// Existing AI agent workflows data
const aiAgentWorkflows = [
  {
    id: 'customer-support-247',
    name: 'Customer Support 24/7',
    description: 'Handles customer inquiries and support requests around the clock',
    status: 'active',
    icon: MessageSquare,
    metrics: {
      conversations: 1523,
      responseTime: '1.2s',
      satisfaction: '4.8/5'
    },
    lastActivity: '2 min ago'
  },
  {
    id: 'sales-assistant',
    name: 'Sales Assistant',
    description: 'Qualifies leads and assists with sales processes',
    status: 'active',
    icon: Users,
    metrics: {
      conversations: 892,
      responseTime: '1.5s',
      satisfaction: '4.6/5'
    },
    lastActivity: '5 min ago'
  },
  {
    id: 'ecommerce-assistant',
    name: 'E-commerce Assistant',
    description: 'Manages product inquiries and order processing',
    status: 'active',
    icon: Bot,
    metrics: {
      conversations: 673,
      responseTime: '1.1s',
      satisfaction: '4.7/5'
    },
    lastActivity: '1 min ago'
  },
  {
    id: 'billing-service',
    name: 'Billing Service',
    description: 'Handles billing inquiries and payment processing',
    status: 'active',
    icon: FileText,
    metrics: {
      conversations: 445,
      responseTime: '1.8s',
      satisfaction: '4.5/5'
    },
    lastActivity: '8 min ago'
  },
  {
    id: 'technical-assistant',
    name: 'Technical Assistant',
    description: 'Provides technical support and troubleshooting',
    status: 'active',
    icon: Settings,
    metrics: {
      conversations: 234,
      responseTime: '2.1s',
      satisfaction: '4.4/5'
    },
    lastActivity: '12 min ago'
  },
  {
    id: 'hr-assistant',
    name: 'HR Assistant',
    description: 'Manages HR inquiries and employee support',
    status: 'paused',
    icon: UserCheck,
    metrics: {
      conversations: 156,
      responseTime: '1.9s',
      satisfaction: '4.3/5'
    },
    lastActivity: '2 hours ago'
  }
];

export default function OrchestrationPage({ onNavigate }: OrchestrationPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'excellent':
      case 'optimal':
      case 'coordinated':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'active':
        return <Activity className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Network className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Multi-Agent Orchestration Hub
              </h1>
              <p className="text-lg text-gray-600">
                Central command center for managing and coordinating AI agent workflows
              </p>
            </div>
          </div>
          
          {/* System overview stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Agents</p>
                  <p className="text-2xl font-bold text-indigo-600">24</p>
                </div>
                <Bot className="w-8 h-8 text-indigo-500" />
              </div>
              <div className="mt-2 text-xs text-green-600">+2 since last week</div>
            </div>
            <div className="bg-white rounded-lg p-4 border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Running Workflows</p>
                  <p className="text-2xl font-bold text-purple-600">8</p>
                </div>
                <Workflow className="w-8 h-8 text-purple-500" />
              </div>
              <div className="mt-2 text-xs text-green-600">All operational</div>
            </div>
            <div className="bg-white rounded-lg p-4 border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">System Health</p>
                  <p className="text-2xl font-bold text-green-600">99.8%</p>
                </div>
                <Activity className="w-8 h-8 text-green-500" />
              </div>
              <div className="mt-2 text-xs text-green-600">Excellent performance</div>
            </div>
            <div className="bg-white rounded-lg p-4 border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Resource Usage</p>
                  <p className="text-2xl font-bold text-orange-600">78%</p>
                </div>
                <Server className="w-8 h-8 text-orange-500" />
              </div>
              <div className="mt-2 text-xs text-yellow-600">Within optimal range</div>
            </div>
          </div>
        </div>

        {/* Main orchestration management sections */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Orchestration Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orchestrationCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => onNavigate(category.page)}
                className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md hover:border-indigo-300 transition-all duration-200 text-left group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 ${category.color} rounded-lg group-hover:scale-105 transition-transform`}>
                    <category.icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-center">
                    {getStatusIndicator(category.stats.status)}
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 ml-2 transition-colors" />
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-900">
                  {category.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {category.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Primary Metric</span>
                    <span className="text-sm font-medium text-indigo-600">{category.stats.primary}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Secondary</span>
                    <span className="text-sm font-medium text-gray-700">{category.stats.secondary}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Existing AI Agent Workflows Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Active AI Agent Workflows</h2>
            <button 
              onClick={() => onNavigate('orchestration-agent-management')}
              className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              Manage All Agents
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiAgentWorkflows.map((workflow) => (
              <div
                key={workflow.id}
                className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <workflow.icon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{workflow.name}</h3>
                      <p className="text-xs text-gray-500">{workflow.lastActivity}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(workflow.status)}`}>
                    {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {workflow.description}
                </p>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-indigo-600">{workflow.metrics.conversations}</p>
                    <p className="text-xs text-gray-500">Conversations</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-green-600">{workflow.metrics.responseTime}</p>
                    <p className="text-xs text-gray-500">Avg Response</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-amber-600">{workflow.metrics.satisfaction}</p>
                    <p className="text-xs text-gray-500">Satisfaction</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions section */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => onNavigate('orchestration-workflow-management')}
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
              onClick={() => onNavigate('orchestration-agent-management')}
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
              onClick={() => onNavigate('orchestration-monitoring')}
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

        {/* System alerts section */}
        <div className="mt-8 bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">System Alerts & Notifications</h3>
            <button 
              onClick={() => onNavigate('orchestration-monitoring')}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              View All
            </button>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">All systems operational</p>
                <p className="text-xs text-green-600">Last checked: 2 minutes ago</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800">HR Assistant workflow paused</p>
                <p className="text-xs text-yellow-600">Scheduled maintenance - resumes in 2 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}