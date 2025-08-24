import { 
  Bot, GitBranch, Activity, Cpu, CheckCircle, TrendingUp, TrendingDown, Award, 
  BarChart2, Clock 
} from 'lucide-react';
import { SystemMetric, QuickAccessCard } from '../types';

// Enhanced system metrics with better contrast
export const systemMetrics: SystemMetric[] = [
  {
    id: 'active-agents',
    title: 'Active Agents',
    value: '24',
    change: '+3',
    changeLabel: 'since last week',
    icon: Bot,
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    trend: 'up'
  },
  {
    id: 'workflows',
    title: 'Active Workflows',
    value: '8',
    change: '+2',
    changeLabel: 'new this month',
    icon: GitBranch,
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    trend: 'up'
  },
  {
    id: 'system-health',
    title: 'System Health',
    value: '99.8%',
    change: '+0.2%',
    changeLabel: 'uptime improvement',
    icon: Activity,
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    trend: 'up'
  },
  {
    id: 'resource-usage',
    title: 'Resource Usage',
    value: '78%',
    change: '-5%',
    changeLabel: 'optimization gain',
    icon: Cpu,
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    trend: 'down'
  }
];

export const quickAccessCards: QuickAccessCard[] = [
  {
    title: 'Agent Management',
    description: 'Manage agent directory, configuration, and lifecycle',
    icon: Bot,
    page: 'agent-management'
  },
  {
    title: 'Workflow Designer',
    description: 'Create and manage AI workflows visually',
    icon: GitBranch,
    page: 'workflow-management'
  },
  {
    title: 'System Monitoring',
    description: 'Real-time analytics and performance metrics',
    icon: Activity,
    page: 'monitoring-analytics'
  },
  {
    title: 'Resource Management',
    description: 'Manage system resources and scaling',
    icon: Cpu,
    page: 'resource-management'
  },
  {
    title: 'Collaboration Hub',
    description: 'Human-AI collaboration and communication',
    icon: Award,
    page: 'collaboration'
  },
  {
    title: 'AI Documentation',
    description: 'Access AI system documentation and guides',
    icon: BarChart2,
    page: 'documents'
  }
];