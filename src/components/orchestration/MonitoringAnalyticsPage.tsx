import React, { useState } from 'react';
import { 
  BarChart3, 
  Monitor, 
  FileText, 
  Bell,
  ArrowLeft,
  Search, 
  Filter,
  Download,
  RefreshCw,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Eye,
  Settings,
  Zap,
  Database,
  Users,
  MessageSquare
} from 'lucide-react';
import { Page } from '../../App';

interface MonitoringAnalyticsPageProps {
  onNavigate: (page: Page) => void;
}

// Mock data for monitoring metrics
const systemMetrics = [
  {
    id: 'uptime',
    name: 'System Uptime',
    value: '99.8%',
    trend: 'up',
    change: '+0.2%',
    status: 'excellent'
  },
  {
    id: 'response-time',
    name: 'Avg Response Time',
    value: '1.4s',
    trend: 'down',
    change: '-0.3s',
    status: 'good'
  },
  {
    id: 'success-rate',
    name: 'Success Rate',
    value: '94.2%',
    trend: 'up',
    change: '+2.1%',
    status: 'excellent'
  },
  {
    id: 'active-sessions',
    name: 'Active Sessions',
    value: '1,247',
    trend: 'up',
    change: '+156',
    status: 'normal'
  }
];

// Mock data for recent alerts
const recentAlerts = [
  {
    id: 'alert-001',
    type: 'warning',
    message: 'High CPU usage detected on Technical Assistant',
    timestamp: '2025-03-15 15:30',
    severity: 'medium',
    resolved: false,
    agent: 'Technical Assistant'
  },
  {
    id: 'alert-002',
    type: 'info',
    message: 'Scheduled maintenance completed successfully',
    timestamp: '2025-03-15 14:00',
    severity: 'low',
    resolved: true,
    agent: 'System'
  },
  {
    id: 'alert-003',
    type: 'error',
    message: 'Workflow timeout in Customer Onboarding Flow',
    timestamp: '2025-03-15 13:45',
    severity: 'high',
    resolved: true,
    agent: 'Customer Support'
  },
  {
    id: 'alert-004',
    type: 'success',
    message: 'Sales Assistant achieved 95% success rate milestone',
    timestamp: '2025-03-15 12:30',
    severity: 'low',
    resolved: true,
    agent: 'Sales Assistant'
  }
];

// Mock data for performance logs
const performanceLogs = [
  {
    id: 'log-001',
    timestamp: '2025-03-15 15:32:45',
    level: 'info',
    source: 'Customer Support Agent',
    message: 'Successfully processed customer inquiry #CS-2024-001',
    duration: '1.2s',
    requestId: 'req_abc123'
  },
  {
    id: 'log-002',
    timestamp: '2025-03-15 15:31:20',
    level: 'warning',
    source: 'Technical Assistant',
    message: 'Response time exceeded threshold (2.5s)',
    duration: '2.5s',
    requestId: 'req_def456'
  },
  {
    id: 'log-003',
    timestamp: '2025-03-15 15:30:15',
    level: 'error',
    source: 'Workflow Engine',
    message: 'Task execution failed: timeout after 30s',
    duration: '30.0s',
    requestId: 'req_ghi789'
  },
  {
    id: 'log-004',
    timestamp: '2025-03-15 15:29:30',
    level: 'info',
    source: 'Sales Assistant',
    message: 'Lead qualification completed successfully',
    duration: '1.8s',
    requestId: 'req_jkl012'
  }
];

export default function MonitoringAnalyticsPage({ onNavigate }: MonitoringAnalyticsPageProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'metrics' | 'logs' | 'alerts'>('dashboard');
  const [timeRange, setTimeRange] = useState('24h');
  const [searchQuery, setSearchQuery] = useState('');

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertTriangle className="w-5 h-5 text-destructive dark:text-destructive" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />;
      case 'info': return <CheckCircle className="w-5 h-5 text-tertiary dark:text-tertiary" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />;
      default: return <Bell className="w-5 h-5 text-muted-foreground dark:text-muted-foreground" />;
    }
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'warning': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'info': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      default: return 'bg-surface-container-low dark:bg-surface-container-highest text-on-surface dark:text-muted-foreground';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'low': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      default: return 'bg-surface-container-low dark:bg-surface-container-highest text-on-surface dark:text-muted-foreground';
    }
  };

  const filteredLogs = performanceLogs.filter(log =>
    log.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAlerts = recentAlerts.filter(alert =>
    alert.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
    alert.agent.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-surface-container-low dark:bg-background transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header with breadcrumb */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-on-surface dark:text-foreground transition-colors">Monitoring & Analytics</h1>
              <p className="text-muted-foreground dark:text-muted-foreground transition-colors">Real-time insights and performance tracking</p>
            </div>
            <div className="flex gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-border dark:border-border rounded-lg bg-white dark:bg-surface-container-high text-foreground dark:text-foreground transition-colors"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 border border-border dark:border-border rounded-lg bg-white dark:bg-surface-container-high hover:bg-surface-container-low dark:hover:bg-surface-container-highest text-on-surface dark:text-muted-foreground transition-colors">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button className="flex items-center gap-2 bg-primary dark:bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-green-700 transition-colors shadow-sm dark:shadow-gray-900">
                <Download className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* System health overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {systemMetrics.map((metric) => (
            <div key={metric.id} className="bg-white dark:bg-surface-container-high rounded-lg border border-border dark:border-border p-6 shadow-sm dark:shadow-gray-900 transition-colors">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-muted-foreground dark:text-muted-foreground transition-colors">{metric.name}</h3>
                <div className="flex items-center text-sm">
                  {metric.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-500 dark:text-green-400 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-destructive dark:text-destructive mr-1" />
                  )}
                  <span className={metric.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-destructive'}>
                    {metric.change}
                  </span>
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground dark:text-foreground transition-colors">{metric.value}</div>
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="bg-white dark:bg-surface-container-high rounded-lg shadow dark:shadow-gray-900 border border-border dark:border-border transition-colors">
          {/* Tabs */}
          <div className="border-b border-border dark:border-border transition-colors">
            <nav className="flex -mb-px">
              {[
                { key: 'dashboard', label: 'Real-time Dashboard', icon: Monitor },
                { key: 'metrics', label: 'Performance Metrics', icon: BarChart3 },
                { key: 'logs', label: 'Logs & Tracing', icon: FileText },
                { key: 'alerts', label: 'Alerts & Notifications', icon: Bell }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`py-4 px-6 text-sm font-medium flex items-center gap-2 transition-colors ${
                    activeTab === key
                      ? 'border-b-2 border-green-500 dark:border-green-400 text-green-600 dark:text-green-400'
                      : 'text-muted-foreground dark:text-muted-foreground hover:text-on-surface dark:hover:text-muted-foreground hover:border-border dark:hover:border-outline'
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
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Live activity feed */}
                <div className="bg-surface-container-low dark:bg-surface-container-highest/50 rounded-lg p-6 transition-colors">
                  <h3 className="text-lg font-medium text-foreground dark:text-foreground mb-4 transition-colors">Live Activity Feed</h3>
                  <div className="space-y-3">
                    {[
                      { time: '15:32', event: 'Customer Support Agent processed inquiry #CS-2024-001', status: 'success', agent: 'Customer Support' },
                      { time: '15:31', event: 'Sales Assistant qualified new lead from website', status: 'success', agent: 'Sales Assistant' },
                      { time: '15:30', event: 'Technical Assistant escalated complex issue to human', status: 'warning', agent: 'Technical Assistant' },
                      { time: '15:29', event: 'E-commerce Assistant completed order processing', status: 'success', agent: 'E-commerce Assistant' },
                      { time: '15:28', event: 'Billing Service processed refund request', status: 'success', agent: 'Billing Service' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center p-3 bg-white dark:bg-surface-container-high rounded-lg border border-border dark:border-border transition-colors">
                        <div className="flex items-center gap-3 flex-1">
                          <span className="text-xs text-muted-foreground dark:text-muted-foreground font-mono w-12 transition-colors">{activity.time}</span>
                          <div className={`w-2 h-2 rounded-full ${
                            activity.status === 'success' ? 'bg-green-500' :
                            activity.status === 'warning' ? 'bg-yellow-500' : 'bg-destructive'
                          }`}></div>
                          <span className="text-sm flex-1 text-foreground dark:text-foreground transition-colors">{activity.event}</span>
                          <span className="text-xs text-muted-foreground dark:text-muted-foreground px-2 py-1 bg-surface-container-low dark:bg-surface-container-highest rounded-full transition-colors">
                            {activity.agent}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Real-time metrics grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6 border border-blue-200 dark:border-tertiary transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-blue-900 dark:text-blue-300 transition-colors">Active Conversations</h4>
                      <MessageSquare className="w-5 h-5 text-tertiary dark:text-tertiary" />
                    </div>
                    <p className="text-3xl font-bold text-tertiary dark:text-tertiary transition-colors">89</p>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-2 transition-colors">Across all agents</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-6 border border-green-200 dark:border-green-600 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-green-900 dark:text-green-300 transition-colors">Requests/Min</h4>
                      <Zap className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400 transition-colors">247</p>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-2 transition-colors">Peak: 312/min</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-6 border border-purple-200 dark:border-purple-600 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-purple-900 dark:text-purple-300 transition-colors">Data Processed</h4>
                      <Database className="w-5 h-5 text-tertiary dark:text-tertiary" />
                    </div>
                    <p className="text-3xl font-bold text-tertiary dark:text-tertiary transition-colors">2.4GB</p>
                    <p className="text-sm text-purple-700 dark:text-purple-300 mt-2 transition-colors">Today</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'metrics' && (
              <div className="space-y-6">
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 text-outline dark:text-muted-foreground mx-auto mb-4 transition-colors" />
                  <h3 className="text-lg font-medium text-foreground dark:text-foreground mb-2 transition-colors">Performance Metrics</h3>
                  <p className="text-muted-foreground dark:text-muted-foreground mb-4 transition-colors">Detailed KPIs, execution times, and success rates</p>
                  <button className="px-4 py-2 bg-green-600 dark:bg-primary text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors">
                    View Detailed Analytics
                  </button>
                </div>

                {/* Metrics overview cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Requests', value: '12,456', change: '+8.2%', trend: 'up' },
                    { label: 'Avg Processing Time', value: '1.7s', change: '-0.4s', trend: 'down' },
                    { label: 'Error Rate', value: '0.8%', change: '-0.3%', trend: 'down' },
                    { label: 'Throughput', value: '245/min', change: '+12/min', trend: 'up' }
                  ].map((metric, index) => (
                    <div key={index} className="bg-white dark:bg-surface-container-highest rounded-lg border border-border dark:border-border p-4 transition-colors">
                      <p className="text-sm text-muted-foreground dark:text-muted-foreground transition-colors">{metric.label}</p>
                      <p className="text-xl font-bold text-foreground dark:text-foreground transition-colors">{metric.value}</p>
                      <div className={`flex items-center text-xs mt-1 transition-colors ${
                        metric.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-destructive'
                      }`}>
                        {metric.trend === 'up' ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {metric.change}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'logs' && (
              <div className="space-y-6">
                {/* Search for logs */}
                <div className="flex gap-4">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-outline dark:text-muted-foreground w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search logs by source, message, or request ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border border-border dark:border-border rounded-lg focus:ring-2 focus:ring-ring dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400 bg-white dark:bg-surface-container-highest text-foreground dark:text-foreground placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                    />
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 border border-border dark:border-border rounded-lg bg-white dark:bg-surface-container-high hover:bg-surface-container-low dark:hover:bg-surface-container-highest text-on-surface dark:text-muted-foreground transition-colors">
                    <Filter className="w-4 h-4" />
                    Filter
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                    <thead className="bg-surface-container-low dark:bg-surface-container-highest transition-colors">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground dark:text-muted-foreground uppercase tracking-wider transition-colors">Timestamp</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground dark:text-muted-foreground uppercase tracking-wider transition-colors">Level</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground dark:text-muted-foreground uppercase tracking-wider transition-colors">Source</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground dark:text-muted-foreground uppercase tracking-wider transition-colors">Message</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground dark:text-muted-foreground uppercase tracking-wider transition-colors">Duration</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground dark:text-muted-foreground uppercase tracking-wider transition-colors">Request ID</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-surface-container-high divide-y divide-gray-200 dark:divide-gray-600 transition-colors">
                      {filteredLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground dark:text-muted-foreground font-mono transition-colors">
                            {log.timestamp}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full transition-colors ${getLogLevelColor(log.level)}`}>
                              {log.level.charAt(0).toUpperCase() + log.level.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground dark:text-foreground transition-colors">{log.source}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground dark:text-muted-foreground max-w-md truncate transition-colors">{log.message}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground dark:text-muted-foreground font-mono transition-colors">{log.duration}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground dark:text-muted-foreground font-mono transition-colors">{log.requestId}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'alerts' && (
              <div className="space-y-6">
                {/* Search for alerts */}
                <div className="flex gap-4">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-outline dark:text-muted-foreground w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search alerts by message or agent..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border border-border dark:border-border rounded-lg focus:ring-2 focus:ring-ring dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400 bg-white dark:bg-surface-container-highest text-foreground dark:text-foreground placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                    />
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 border border-border dark:border-border rounded-lg bg-white dark:bg-surface-container-high hover:bg-surface-container-low dark:hover:bg-surface-container-highest text-on-surface dark:text-muted-foreground transition-colors">
                    <Filter className="w-4 h-4" />
                    Filter
                  </button>
                </div>

                <div className="space-y-4">
                  {filteredAlerts.map((alert) => (
                    <div key={alert.id} className="border border-border dark:border-border rounded-lg p-4 bg-white dark:bg-surface-container-high transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getAlertIcon(alert.type)}
                          <div className="flex-1">
                            <h3 className="font-medium text-foreground dark:text-foreground transition-colors">{alert.message}</h3>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground dark:text-muted-foreground transition-colors">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {alert.timestamp}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {alert.agent}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${getSeverityColor(alert.severity)}`}>
                                {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)} Priority
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {alert.resolved && (
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded-full transition-colors">
                              Resolved
                            </span>
                          )}
                          <button className="text-outline dark:text-muted-foreground hover:text-muted-foreground dark:hover:text-outline transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          {!alert.resolved && (
                            <button className="text-outline dark:text-muted-foreground hover:text-green-600 dark:hover:text-green-400 transition-colors">
                              <Settings className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
