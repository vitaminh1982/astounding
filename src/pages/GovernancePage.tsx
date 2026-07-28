import React, { useState, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { Page } from '../App';
import { 
  ShieldAlert, 
  Activity, 
  AlertTriangle, 
  CheckSquare, 
  Clock, 
  Bot, 
  RefreshCw,
  Download,
  Filter,
  Calendar,
  FileText
} from 'lucide-react';

interface GovernancePageProps {
  onNavigate: (page: Page) => void;
}

export default function GovernancePage({ onNavigate }: GovernancePageProps) {
  const { t } = useContext(LanguageContext);
  const [timeRange, setTimeRange] = useState('24h');
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  // Mock data for the dashboard
  const agentStatuses = [
    { id: 1, name: 'Customer Support 24/7', status: 'active', activity: 'high', lastActive: '2 min ago', errors: 0 },
    { id: 2, name: 'Sales Assistant', status: 'active', activity: 'medium', lastActive: '5 min ago', errors: 0 },
    { id: 3, name: 'Technical Support', status: 'active', activity: 'low', lastActive: '15 min ago', errors: 2 },
    { id: 4, name: 'Billing Service', status: 'inactive', activity: 'none', lastActive: '3 hours ago', errors: 0 },
    { id: 5, name: 'E-commerce Assistant', status: 'active', activity: 'high', lastActive: '1 min ago', errors: 1 },
    { id: 6, name: 'HR Assistant', status: 'paused', activity: 'none', lastActive: '2 days ago', errors: 0 },
  ];

  const recentIncidents = [
    { id: 1, agent: 'Technical Support', type: 'Error', message: 'API connection timeout', time: '15 min ago', severity: 'medium' },
    { id: 2, agent: 'E-commerce Assistant', type: 'Warning', message: 'Slow response time detected', time: '1 hour ago', severity: 'low' },
    { id: 3, agent: 'Customer Support 24/7', type: 'Info', message: 'Scheduled maintenance completed', time: '3 hours ago', severity: 'info' },
  ];

  const complianceMetrics = [
    { name: 'GDPR Compliance', value: '98%', trend: 'up' },
    { name: 'Data Privacy', value: '95%', trend: 'up' },
    { name: 'Response Accuracy', value: '92%', trend: 'down' },
    { name: 'Ethical Guidelines', value: '97%', trend: 'stable' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'inactive': return 'bg-surface-container-low dark:bg-surface-container-highest text-on-surface dark:text-muted-foreground';
      case 'paused': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      default: return 'bg-surface-container-low dark:bg-surface-container-highest text-on-surface dark:text-muted-foreground';
    }
  };

  const getActivityIndicator = (activity: string) => {
    switch (activity) {
      case 'high': return 'w-2 h-2 bg-green-500 rounded-full animate-pulse';
      case 'medium': return 'w-2 h-2 bg-tertiary rounded-full';
      case 'low': return 'w-2 h-2 bg-yellow-500 rounded-full';
      default: return 'w-2 h-2 bg-surface-container dark:bg-surface-container-highest rounded-full';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'low': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'info': return 'bg-surface-container-low dark:bg-surface-container-highest text-on-surface dark:text-muted-foreground';
      default: return 'bg-surface-container-low dark:bg-surface-container-highest text-on-surface dark:text-muted-foreground';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>;
      case 'down': return <svg className="w-4 h-4 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>;
      default: return <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" /></svg>;
    }
  };

  return (
    <div className="min-h-screen transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-on-surface dark:text-foreground transition-colors">
                Governance Monitoring
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground dark:text-muted-foreground transition-colors">
                Monitor and manage AI agent operations
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center bg-white dark:bg-surface-container-high border border-border dark:border-border rounded-lg overflow-hidden transition-colors">
                <Calendar className="ml-3 w-4 h-4 text-muted-foreground dark:text-muted-foreground" />
                <select
                  className="w-full py-2 pl-2 pr-8 bg-transparent text-on-surface dark:text-on-surface-variant border-none focus:ring-0 text-sm transition-colors"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="90d">Last 90 Days</option>
                </select>
              </div>
              <button 
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 bg-white dark:bg-surface-container-high border border-border dark:border-border text-on-surface dark:text-on-surface-variant px-4 py-2 rounded-lg hover: dark:hover:bg-surface-container-highest transition-colors text-sm sm:text-base disabled:opacity-50 shadow-sm dark:shadow-gray-900"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="whitespace-nowrap">
                  Refresh
                </span>
              </button>
              <button 
          className="flex items-center gap-2 bg-primary dark:bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-green-700 transition-colors shadow-sm dark:shadow-gray-900"
        >
                <Download className="w-4 h-4" />
                <span className="whitespace-nowrap">
                  Export Report
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-surface-container-high rounded-lg shadow dark:shadow-gray-900 p-6 border border-border dark:border-border transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-foreground dark:text-foreground transition-colors">Active Agents</h3>
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg transition-colors">
                  <Bot className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground dark:text-foreground transition-colors">4</div>
              <div className="mt-2 text-sm text-muted-foreground dark:text-muted-foreground transition-colors">Out of 6 total agents</div>
              <div className="mt-4 h-2 bg-surface-container dark:bg-surface-container-highest rounded-full overflow-hidden transition-colors">
                <div className="h-full bg-green-500" style={{ width: '66.7%' }}></div>
              </div>
            </div>

            <div className="bg-white dark:bg-surface-container-high rounded-lg shadow dark:shadow-gray-900 p-6 border border-border dark:border-border transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-foreground dark:text-foreground transition-colors">Incidents</h3>
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg transition-colors">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-destructive" />
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground dark:text-foreground transition-colors">3</div>
              <div className="mt-2 text-sm text-muted-foreground dark:text-muted-foreground transition-colors">Last 24 hours</div>
              <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-400 transition-colors">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span>25% decrease from previous period</span>
              </div>
            </div>

            <div className="bg-white dark:bg-surface-container-high rounded-lg shadow dark:shadow-gray-900 p-6 border border-border dark:border-border transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-foreground dark:text-foreground transition-colors">Compliance Score</h3>
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg transition-colors">
                  <CheckSquare className="w-5 h-5 text-tertiary dark:text-tertiary" />
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground dark:text-foreground transition-colors">95.5%</div>
              <div className="mt-2 text-sm text-muted-foreground dark:text-muted-foreground transition-colors">Overall compliance</div>
              <div className="mt-4 h-2 bg-surface-container dark:bg-surface-container-highest rounded-full overflow-hidden transition-colors">
                <div className="h-full bg-tertiary" style={{ width: '95.5%' }}></div>
              </div>
            </div>

            <div className="bg-white dark:bg-surface-container-high rounded-lg shadow dark:shadow-gray-900 p-6 border border-border dark:border-border transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-foreground dark:text-foreground transition-colors">Response Time</h3>
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg transition-colors">
                  <Clock className="w-5 h-5 text-tertiary dark:text-tertiary" />
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground dark:text-foreground transition-colors">1.2s</div>
              <div className="mt-2 text-sm text-muted-foreground dark:text-muted-foreground transition-colors">Average response time</div>
              <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-400 transition-colors">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span>15% improvement</span>
              </div>
            </div>
          </div>

          {/* Agent Status Table */}
          <div className="bg-white dark:bg-surface-container-high rounded-lg shadow dark:shadow-gray-900 overflow-hidden border border-border dark:border-border transition-colors">
            <div className="p-6 border-b border-border dark:border-border transition-colors">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-foreground dark:text-foreground transition-colors">Agent Status</h3>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-3 py-1.5 border border-border dark:border-border rounded-lg bg-white dark:bg-surface-container-highest hover: dark:hover:bg-surface-container-highest text-on-surface dark:text-muted-foreground text-sm transition-colors">
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                <thead className="dark:bg-surface-container-highest transition-colors">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground dark:text-muted-foreground uppercase tracking-wider transition-colors">Agent</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground dark:text-muted-foreground uppercase tracking-wider transition-colors">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground dark:text-muted-foreground uppercase tracking-wider transition-colors">Activity</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground dark:text-muted-foreground uppercase tracking-wider transition-colors">Last Active</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground dark:text-muted-foreground uppercase tracking-wider transition-colors">Errors</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground dark:text-muted-foreground uppercase tracking-wider transition-colors">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-surface-container-high divide-y divide-gray-200 dark:divide-gray-600 transition-colors">
                  {agentStatuses.map((agent) => (
                    <tr key={agent.id} className="hover: dark:hover:bg-surface-container-highest transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center transition-colors">
                            <Bot className="h-5 w-5 text-primary-green dark:text-primary-green" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-foreground dark:text-foreground transition-colors">{agent.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full transition-colors ${getStatusColor(agent.status)}`}>
                          {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={getActivityIndicator(agent.activity)}></div>
                          <span className="ml-2 text-sm text-muted-foreground dark:text-muted-foreground transition-colors">{agent.activity.charAt(0).toUpperCase() + agent.activity.slice(1)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground dark:text-muted-foreground transition-colors">
                        {agent.lastActive}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground dark:text-muted-foreground transition-colors">
                        {agent.errors > 0 ? (
                          <span className="text-red-600 dark:text-destructive font-medium">{agent.errors}</span>
                        ) : (
                          <span>0</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => onNavigate('agent-configuration')}
                          className="text-primary-green dark:text-green-400 hover:text-indigo-900 dark:hover:text-green-300 mr-4 transition-colors"
                        >
                          Configure
                        </button>
                        <button className="text-muted-foreground dark:text-muted-foreground hover:text-foreground dark:hover:text-muted-foreground transition-colors">
                          View Logs
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Two-column layout for Incidents and Compliance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Incidents */}
            <div className="bg-white dark:bg-surface-container-high rounded-lg shadow dark:shadow-gray-900 border border-border dark:border-border transition-colors">
              <div className="p-6 border-b border-border dark:border-border transition-colors">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-foreground dark:text-foreground transition-colors">Recent Incidents</h3>
                  <button className="text-sm text-primary-green dark:text-green-400 hover:text-indigo-900 dark:hover:text-green-300 transition-colors">
                    View All
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentIncidents.map((incident) => (
                    <div key={incident.id} className="flex items-start p-4 border border-border dark:border-border rounded-lg transition-colors">
                      <div className={`p-2 rounded-lg transition-colors ${getSeverityColor(incident.severity)} mr-4`}>
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="text-sm font-medium text-foreground dark:text-foreground transition-colors">{incident.message}</h4>
                          <span className="text-xs text-muted-foreground dark:text-muted-foreground transition-colors">{incident.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-1 transition-colors">Agent: {incident.agent}</p>
                        <div className="mt-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${getSeverityColor(incident.severity)}`}>
                            {incident.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Compliance Metrics */}
            <div className="bg-white dark:bg-surface-container-high rounded-lg shadow dark:shadow-gray-900 border border-border dark:border-border transition-colors">
              <div className="p-6 border-b border-border dark:border-border transition-colors">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-foreground dark:text-foreground transition-colors">Compliance Metrics</h3>
                  <button 
                    onClick={() => onNavigate('audit-compliance')}
                    className="text-sm text-primary-green dark:text-green-400 hover:text-indigo-900 dark:hover:text-green-300 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {complianceMetrics.map((metric) => (
                    <div key={metric.name} className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-foreground dark:text-foreground transition-colors">{metric.name}</h4>
                        <div className="mt-2 h-2 bg-surface-container dark:bg-surface-container-highest rounded-full overflow-hidden transition-colors">
                          <div 
                            className="h-full bg-tertiary"
                            style={{ width: metric.value }}
                          ></div>
                        </div>
                      </div>
                      <div className="ml-4 flex items-center">
                        <span className="text-lg font-semibold text-foreground dark:text-foreground mr-2 transition-colors">{metric.value}</span>
                        {getTrendIcon(metric.trend)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Access Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button 
              onClick={() => onNavigate('policy-management')}
              className="bg-white dark:bg-surface-container-high rounded-lg shadow dark:shadow-gray-900 p-6 hover:shadow-md dark:hover:shadow-gray-800 transition-all text-left border border-border dark:border-border"
            >
              <div className="flex items-center mb-4">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg mr-4 transition-colors">
                  <FileText className="h-6 w-6 text-primary-green dark:text-primary-green" />
                </div>
                <h3 className="text-lg font-medium text-foreground dark:text-foreground transition-colors">Policy Management</h3>
              </div>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground transition-colors">Configure AI behavior rules, access controls, and compliance settings</p>
            </button>

            <button 
              onClick={() => onNavigate('risk-management')}
              className="bg-white dark:bg-surface-container-high rounded-lg shadow dark:shadow-gray-900 p-6 hover:shadow-md dark:hover:shadow-gray-800 transition-all text-left border border-border dark:border-border"
            >
              <div className="flex items-center mb-4">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg mr-4 transition-colors">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-destructive" />
                </div>
                <h3 className="text-lg font-medium text-foreground dark:text-foreground transition-colors">Risk Management</h3>
              </div>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground transition-colors">Assess risks, configure safety protocols, and manage incident reporting</p>
            </button>

            <button 
              onClick={() => onNavigate('performance-analytics')}
              className="bg-white dark:bg-surface-container-high rounded-lg shadow dark:shadow-gray-900 p-6 hover:shadow-md dark:hover:shadow-gray-800 transition-all text-left border border-border dark:border-border"
            >
              <div className="flex items-center mb-4">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg mr-4 transition-colors">
                  <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-medium text-foreground dark:text-foreground transition-colors">Performance Analytics</h3>
              </div>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground transition-colors">View detailed performance metrics, success rates, and efficiency reports</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
