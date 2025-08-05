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
  TrendingDown
} from 'lucide-react';
import { Page } from '../../App';

interface OrchestrationMonitoringPageProps {
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
    message: 'High CPU usage detected on Agent-003',
    timestamp: '2025-03-15 15:30',
    severity: 'medium',
    resolved: false
  },
  {
    id: 'alert-002',
    type: 'info',
    message: 'Scheduled maintenance completed successfully',
    timestamp: '2025-03-15 14:00',
    severity: 'low',
    resolved: true
  },
  {
    id: 'alert-003',
    type: 'error',
    message: 'Workflow timeout in Customer Onboarding Flow',
    timestamp: '2025-03-15 13:45',
    severity: 'high',
    resolved: true
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
    duration: '1.2s'
  },
  {
    id: 'log-002',
    timestamp: '2025-03-15 15:31:20',
    level: 'warning',
    source: 'Technical Assistant',
    message: 'Response time exceeded threshold (2.5s)',
    duration: '2.5s'
  },
  {
    id: 'log-003',
    timestamp: '2025-03-15 15:30:15',
    level: 'error',
    source: 'Workflow Engine',
    message: 'Task execution failed: timeout after 30s',
    duration: '30.0s'
  }
];

export default function OrchestrationMonitoringPage({ onNavigate }: OrchestrationMonitoringPageProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'metrics' | 'logs' | 'alerts'>('dashboard');
  const [timeRange, setTimeRange] = useState('24h');

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info': return <CheckCircle className="w-5 h-5 text-blue-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
            <span className="text-gray-600">Monitoring & Analytics</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Monitoring & Analytics</h1>
              <p className="text-gray-600">Real-time insights and performance tracking</p>
            </div>
            <div className="flex gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border rounded-lg bg-white"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white hover:bg-gray-50">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                <Download className="w-4 h-4" />
                Export Report
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
                { key: 'dashboard', label: 'Real-time Dashboard', icon: Monitor },
                { key: 'metrics', label: 'Performance Metrics', icon: BarChart3 },
                { key: 'logs', label: 'Logs & Tracing', icon: FileText },
                { key: 'alerts', label: 'Alerts & Notifications', icon: Bell }
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
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* System metrics cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {systemMetrics.map((metric) => (
                    <div key={metric.id} className="bg-white rounded-lg border p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-medium text-gray-500">{metric.name}</h3>
                        <div className="flex items-center text-sm">
                          {metric.trend === 'up' ? (
                            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                          )}
                          <span className={metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                            {metric.change}
                          </span>
                        </div>
                      </div>
                      <div className="text-3xl font-bold">{metric.value}</div>
                    </div>
                  ))}
                </div>

                {/* Live activity feed */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Live Activity Feed</h3>
                  <div className="space-y-3">
                    {[
                      { time: '15:32', event: 'Customer Support Agent processed inquiry #CS-2024-001', status: 'success' },
                      { time: '15:31', event: 'Sales Assistant qualified new lead from website', status: 'success' },
                      { time: '15:30', event: 'Technical Assistant escalated complex issue to human', status: 'warning' },
                      { time: '15:29', event: 'E-commerce Assistant completed order processing', status: 'success' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center p-3 bg-white rounded-lg border">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500 font-mono">{activity.time}</span>
                          <div className={`w-2 h-2 rounded-full ${
                            activity.status === 'success' ? 'bg-green-500' :
                            activity.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}></div>
                          <span className="text-sm">{activity.event}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'metrics' && (
              <div className="text-center py-12">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Performance Metrics</h3>
                <p className="text-gray-500">Detailed KPIs, execution times, and success rates</p>
              </div>
            )}

            {activeTab === 'logs' && (
              <div className="space-y-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {performanceLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                            {log.timestamp}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getLogLevelColor(log.level)}`}>
                              {log.level.charAt(0).toUpperCase() + log.level.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.source}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{log.message}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{log.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'alerts' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  {recentAlerts.map((alert) => (
                    <div key={alert.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getAlertIcon(alert.type)}
                          <div>
                            <h3 className="font-medium text-gray-900">{alert.message}</h3>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {alert.timestamp}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                                alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)} Priority
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {alert.resolved && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Resolved
                            </span>
                          )}
                          <button className="text-gray-400 hover:text-gray-600">
                            <Eye className="w-4 h-4" />
                          </button>
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