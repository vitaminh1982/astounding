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
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIndicator = (activity: string) => {
    switch (activity) {
      case 'high': return 'w-2 h-2 bg-green-500 rounded-full animate-pulse';
      case 'medium': return 'w-2 h-2 bg-blue-500 rounded-full';
      case 'low': return 'w-2 h-2 bg-yellow-500 rounded-full';
      default: return 'w-2 h-2 bg-gray-300 rounded-full';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'info': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>;
      case 'down': return <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>;
      default: return <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" /></svg>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Governance Monitoring
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Monitor and manage AI agent operations
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden">
                <Calendar className="ml-3 w-4 h-4 text-gray-500" />
                <select
                  className="w-full py-2 pl-2 pr-8 bg-transparent border-none focus:ring-0 text-sm"
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
                className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="whitespace-nowrap">
                  Refresh
                </span>
              </button>
              <button 
                className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base"
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
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Active Agents</h3>
                <div className="p-2 bg-green-100 rounded-lg">
                  <Bot className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="text-3xl font-bold">4</div>
              <div className="mt-2 text-sm text-gray-500">Out of 6 total agents</div>
              <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: '66.7%' }}></div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Incidents</h3>
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
              </div>
              <div className="text-3xl font-bold">3</div>
              <div className="mt-2 text-sm text-gray-500">Last 24 hours</div>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span>25% decrease from previous period</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Compliance Score</h3>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckSquare className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="text-3xl font-bold">95.5%</div>
              <div className="mt-2 text-sm text-gray-500">Overall compliance</div>
              <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: '95.5%' }}></div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Response Time</h3>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <div className="text-3xl font-bold">1.2s</div>
              <div className="mt-2 text-sm text-gray-500">Average response time</div>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span>15% improvement</span>
              </div>
            </div>
          </div>

          {/* Agent Status Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Agent Status</h3>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-3 py-1.5 border rounded-lg bg-white hover:bg-gray-50 text-sm">
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Errors</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {agentStatuses.map((agent) => (
                    <tr key={agent.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <Bot className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(agent.status)}`}>
                          {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={getActivityIndicator(agent.activity)}></div>
                          <span className="ml-2 text-sm text-gray-500">{agent.activity.charAt(0).toUpperCase() + agent.activity.slice(1)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {agent.lastActive}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {agent.errors > 0 ? (
                          <span className="text-red-600 font-medium">{agent.errors}</span>
                        ) : (
                          <span>0</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => onNavigate('agent-configuration')}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Configure
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
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
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Recent Incidents</h3>
                  <button className="text-sm text-indigo-600 hover:text-indigo-900">
                    View All
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentIncidents.map((incident) => (
                    <div key={incident.id} className="flex items-start p-4 border rounded-lg">
                      <div className={`p-2 rounded-lg ${getSeverityColor(incident.severity)} mr-4`}>
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="text-sm font-medium text-gray-900">{incident.message}</h4>
                          <span className="text-xs text-gray-500">{incident.time}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Agent: {incident.agent}</p>
                        <div className="mt-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(incident.severity)}`}>
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
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Compliance Metrics</h3>
                  <button 
                    onClick={() => onNavigate('audit-compliance')}
                    className="text-sm text-indigo-600 hover:text-indigo-900"
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
                        <h4 className="text-sm font-medium text-gray-900">{metric.name}</h4>
                        <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500"
                            style={{ width: metric.value }}
                          ></div>
                        </div>
                      </div>
                      <div className="ml-4 flex items-center">
                        <span className="text-lg font-semibold mr-2">{metric.value}</span>
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
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow text-left"
            >
              <div className="flex items-center mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg mr-4">
                  <FileText className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Policy Management</h3>
              </div>
              <p className="text-sm text-gray-500">Configure AI behavior rules, access controls, and compliance settings</p>
            </button>

            <button 
              onClick={() => onNavigate('risk-management')}
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow text-left"
            >
              <div className="flex items-center mb-4">
                <div className="p-2 bg-red-100 rounded-lg mr-4">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Risk Management</h3>
              </div>
              <p className="text-sm text-gray-500">Assess risks, configure safety protocols, and manage incident reporting</p>
            </button>

            <button 
              onClick={() => onNavigate('performance-analytics')}
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow text-left"
            >
              <div className="flex items-center mb-4">
                <div className="p-2 bg-green-100 rounded-lg mr-4">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Performance Analytics</h3>
              </div>
              <p className="text-sm text-gray-500">View detailed performance metrics, success rates, and efficiency reports</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}