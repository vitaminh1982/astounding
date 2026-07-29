import React, { useState } from 'react';
import { AlertTriangle, Shield, Activity, Search, Filter, Plus, Edit2, Trash2, Eye, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function RiskManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'assessment' | 'protocols' | 'incidents' | 'mitigation'>('assessment');

  // Mock data for risk assessments
  const riskAssessments = [
    { id: 'r1', name: 'Data Privacy Risk Assessment', category: 'Privacy', severity: 'medium', probability: 'low', impact: 'high', lastUpdated: '2025-03-10', status: 'monitored' },
    { id: 'r2', name: 'Response Accuracy Risk', category: 'Quality', severity: 'low', probability: 'medium', impact: 'medium', lastUpdated: '2025-03-05', status: 'mitigated' },
    { id: 'r3', name: 'System Availability Risk', category: 'Technical', severity: 'high', probability: 'low', impact: 'critical', lastUpdated: '2025-03-01', status: 'active' },
    { id: 'r4', name: 'Compliance Violation Risk', category: 'Regulatory', severity: 'medium', probability: 'low', impact: 'high', lastUpdated: '2025-02-25', status: 'monitored' },
  ];

  // Mock data for safety protocols
  const safetyProtocols = [
    { id: 'p1', name: 'Content Filtering Protocol', description: 'Filters harmful or inappropriate content from agent responses', status: 'active', lastUpdated: '2025-03-12' },
    { id: 'p2', name: 'Data Access Control', description: 'Restricts agent access to sensitive customer data', status: 'active', lastUpdated: '2025-03-08' },
    { id: 'p3', name: 'Response Verification', description: 'Verifies agent responses for accuracy before delivery', status: 'inactive', lastUpdated: '2025-03-03' },
    { id: 'p4', name: 'Escalation Protocol', description: 'Defines when and how to escalate issues to human operators', status: 'active', lastUpdated: '2025-02-28' },
  ];

  // Mock data for incident reports
  const incidentReports = [
    { id: 'i1', title: 'Data Access Anomaly', date: '2025-03-14', severity: 'medium', status: 'resolved', agent: 'Sales Assistant', description: 'Unusual pattern of customer data access detected' },
    { id: 'i2', title: 'Response Latency Spike', date: '2025-03-12', severity: 'low', status: 'resolved', agent: 'Customer Support 24/7', description: 'Temporary increase in response times due to high traffic' },
    { id: 'i3', title: 'Incorrect Information Provided', date: '2025-03-08', severity: 'high', status: 'investigating', agent: 'Technical Support', description: 'Agent provided outdated troubleshooting steps to customer' },
    { id: 'i4', title: 'API Integration Failure', date: '2025-03-05', severity: 'medium', status: 'resolved', agent: 'E-commerce Assistant', description: 'Temporary failure in product catalog API integration' },
  ];

  // Mock data for mitigation strategies
  const mitigationStrategies = [
    { id: 'm1', risk: 'Data Privacy', strategy: 'Data Minimization', description: 'Limit collection and processing of personal data to what is necessary', status: 'implemented' },
    { id: 'm2', risk: 'Response Accuracy', strategy: 'Confidence Thresholds', description: 'Only provide responses that meet minimum confidence thresholds', status: 'implemented' },
    { id: 'm3', risk: 'System Availability', strategy: 'Redundant Systems', description: 'Implement backup systems and failover mechanisms', status: 'in-progress' },
    { id: 'm4', risk: 'Compliance Violation', strategy: 'Regulatory Monitoring', description: 'Continuously monitor and adapt to regulatory changes', status: 'planned' },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'high': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300';
      case 'critical': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default: return 'bg-surface-container-low dark:bg-surface-container-highest text-on-surface dark:text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'mitigated': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'monitored': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'resolved': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'investigating': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300';
      case 'implemented': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'in-progress': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'planned': return 'bg-surface-container-low dark:bg-surface-container-highest text-on-surface dark:text-muted-foreground';
      default: return 'bg-surface-container-low dark:bg-surface-container-highest text-on-surface dark:text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'implemented':
        return <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />;
      case 'mitigated':
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />;
      case 'monitored':
      case 'in-progress':
        return <Activity className="w-5 h-5 text-tertiary dark:text-tertiary" />;
      case 'investigating':
        return <AlertCircle className="w-5 h-5 text-orange-500 dark:text-orange-400" />;
      case 'inactive':
      case 'planned':
        return <XCircle className="w-5 h-5 text-muted-foreground dark:text-muted-foreground" />;
      default:
        return null;
    }
  };

  // Filter data based on search query
  const filteredRiskAssessments = riskAssessments.filter(risk => 
    risk.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    risk.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSafetyProtocols = safetyProtocols.filter(protocol => 
    protocol.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    protocol.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredIncidentReports = incidentReports.filter(incident => 
    incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    incident.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    incident.agent.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMitigationStrategies = mitigationStrategies.filter(strategy => 
    strategy.risk.toLowerCase().includes(searchQuery.toLowerCase()) ||
    strategy.strategy.toLowerCase().includes(searchQuery.toLowerCase()) ||
    strategy.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-full transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-on-surface dark:text-foreground transition-colors">
                Risk Management
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground dark:text-muted-foreground transition-colors">
                Assess risks, configure safety protocols, and manage incidents
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-primary dark:bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-green-700 transition-colors shadow-sm dark:shadow-gray-900">
                <Plus className="w-4 h-4" />
                <span className="whitespace-nowrap">
                  New Assessment
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="bg-white dark:bg-surface-container-high rounded-lg shadow dark:shadow-gray-900 border border-border dark:border-border transition-colors">
          {/* Tabs */}
          <div className="border-b border-border dark:border-border transition-colors">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('assessment')}
                className={`py-4 px-6 text-sm font-medium transition-colors ${
                  activeTab === 'assessment'
                    ? 'border-b-2 border-green-500 dark:border-green-400 text-green-600 dark:text-green-400'
                    : 'text-muted-foreground dark:text-muted-foreground hover:text-on-surface dark:hover:text-muted-foreground hover:border-border dark:hover:border-outline'
                }`}
              >
                Risk Assessment
              </button>
              <button
                onClick={() => setActiveTab('protocols')}
                className={`py-4 px-6 text-sm font-medium transition-colors ${
                  activeTab === 'protocols'
                    ? 'border-b-2 border-green-500 dark:border-green-400 text-green-600 dark:text-green-400'
                    : 'text-muted-foreground dark:text-muted-foreground hover:text-on-surface dark:hover:text-muted-foreground hover:border-border dark:hover:border-outline'
                }`}
              >
                Safety Protocols
              </button>
              <button
                onClick={() => setActiveTab('incidents')}
                className={`py-4 px-6 text-sm font-medium transition-colors ${
                  activeTab === 'incidents'
                    ? 'border-b-2 border-green-500 dark:border-green-400 text-green-600 dark:text-green-400'
                    : 'text-muted-foreground dark:text-muted-foreground hover:text-on-surface dark:hover:text-muted-foreground hover:border-border dark:hover:border-outline'
                }`}
              >
                Incident Reporting
              </button>
              <button
                onClick={() => setActiveTab('mitigation')}
                className={`py-4 px-6 text-sm font-medium transition-colors ${
                  activeTab === 'mitigation'
                    ? 'border-b-2 border-green-500 dark:border-green-400 text-green-600 dark:text-green-400'
                    : 'text-muted-foreground dark:text-muted-foreground hover:text-on-surface dark:hover:text-muted-foreground hover:border-border dark:hover:border-outline'
                }`}
              >
                Mitigation Strategies
              </button>
            </nav>
          </div>

          {/* Search and filters */}
          <div className="p-6 border-b border-border dark:border-border transition-colors">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-outline dark:text-muted-foreground w-5 h-5" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab === 'assessment' ? 'risk assessments' : activeTab === 'protocols' ? 'safety protocols' : activeTab === 'incidents' ? 'incident reports' : 'mitigation strategies'}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-border dark:border-border rounded-lg focus:ring-2 focus:ring-ring dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400 bg-white dark:bg-surface-container-highest text-foreground dark:text-foreground placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-border dark:border-border rounded-lg bg-white dark:bg-surface-container-highest hover: dark:hover:bg-surface-container-highest text-on-surface dark:text-muted-foreground transition-colors">
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Content based on active tab */}
          <div className="p-6">
            {activeTab === 'assessment' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                  <thead className="dark:bg-surface-container-highest transition-colors">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground dark:text-muted-foreground uppercase tracking-wider transition-colors">Risk Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground dark:text-muted-foreground uppercase tracking-wider transition-colors">Category</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground dark:text-muted-foreground uppercase tracking-wider transition-colors">Severity</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground dark:text-muted-foreground uppercase tracking-wider transition-colors">Probability</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground dark:text-muted-foreground uppercase tracking-wider transition-colors">Impact</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground dark:text-muted-foreground uppercase tracking-wider transition-colors">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground dark:text-muted-foreground uppercase tracking-wider transition-colors">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-surface-container-high divide-y divide-gray-200 dark:divide-gray-600 transition-colors">
                    {filteredRiskAssessments.map((risk) => (
                      <tr key={risk.id} className="hover: dark:hover:bg-surface-container-highest transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground dark:text-foreground transition-colors">{risk.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground dark:text-muted-foreground transition-colors">{risk.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full transition-colors ${getSeverityColor(risk.severity)}`}>
                            {risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground dark:text-muted-foreground transition-colors">{risk.probability.charAt(0).toUpperCase() + risk.probability.slice(1)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground dark:text-muted-foreground transition-colors">{risk.impact.charAt(0).toUpperCase() + risk.impact.slice(1)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full transition-colors ${getStatusColor(risk.status)}`}>
                            {risk.status.charAt(0).toUpperCase() + risk.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 transition-colors">View</button>
                            <button className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 transition-colors">Edit</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'protocols' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredSafetyProtocols.map((protocol) => (
                  <div key={protocol.id} className="border border-border dark:border-border rounded-lg p-6 hover:shadow-md dark:hover:shadow-gray-800 transition-all">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-indigo-100 dark:bg-green-900/30 rounded-lg transition-colors">
                          <Shield className="h-6 w-6 text-primary-green dark:text-green-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-foreground dark:text-foreground transition-colors">{protocol.name}</h3>
                          <p className="text-sm text-muted-foreground dark:text-muted-foreground mt-1 transition-colors">{protocol.description}</p>
                          <div className="mt-2 flex items-center space-x-4">
                            <div className="flex items-center">
                              {getStatusIcon(protocol.status)}
                              <span className={`ml-1.5 text-sm ${protocol.status === 'active' ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground dark:text-muted-foreground'} transition-colors`}>
                                {protocol.status.charAt(0).toUpperCase() + protocol.status.slice(1)}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground dark:text-muted-foreground transition-colors">Last updated: {protocol.lastUpdated}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-outline dark:text-muted-foreground hover:text-green-600 dark:hover:text-green-400 rounded-full hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors">
                          <Edit2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button className="text-sm text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 transition-colors">Configure Protocol</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'incidents' && (
              <div className="space-y-6">
                {filteredIncidentReports.map((incident) => (
                  <div key={incident.id} className="border border-border dark:border-border rounded-lg p-6 hover:shadow-md dark:hover:shadow-gray-800 transition-all">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg transition-colors">
                          <AlertTriangle className="h-6 w-6 text-red-600 dark:text-destructive" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-foreground dark:text-foreground transition-colors">{incident.title}</h3>
                          <p className="text-sm text-muted-foreground dark:text-muted-foreground mt-1 transition-colors">Agent: {incident.agent}</p>
                          <p className="text-sm text-muted-foreground dark:text-muted-foreground transition-colors">Date: {incident.date}</p>
                          <div className="mt-2 flex items-center space-x-4">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full transition-colors ${getSeverityColor(incident.severity)}`}>
                              {incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)}
                            </span>
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full transition-colors ${getStatusColor(incident.status)}`}>
                              {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-outline dark:text-muted-foreground hover:text-green-600 dark:hover:text-green-400 rounded-full hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors">
                          <Eye className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-outline dark:text-muted-foreground hover:text-green-600 dark:hover:text-green-400 rounded-full hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors">
                          <Edit2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 p-4 dark:bg-surface-container-highest/50 rounded-lg transition-colors">
                      <h4 className="text-sm font-medium text-on-surface dark:text-muted-foreground mb-2 transition-colors">Description:</h4>
                      <p className="text-sm text-muted-foreground dark:text-muted-foreground transition-colors">{incident.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'mitigation' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredMitigationStrategies.map((strategy) => (
                  <div key={strategy.id} className="border border-border dark:border-border rounded-lg p-6 hover:shadow-md dark:hover:shadow-gray-800 transition-all">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg transition-colors">
                          <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-foreground dark:text-foreground transition-colors">{strategy.strategy}</h3>
                          <p className="text-sm text-muted-foreground dark:text-muted-foreground mt-1 transition-colors">Risk: {strategy.risk}</p>
                          <div className="mt-2 flex items-center">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full transition-colors ${getStatusColor(strategy.status)}`}>
                              {strategy.status.charAt(0).toUpperCase() + strategy.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-outline dark:text-muted-foreground hover:text-green-600 dark:hover:text-green-400 rounded-full hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors">
                          <Edit2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 p-4 dark:bg-surface-container-highest/50 rounded-lg transition-colors">
                      <h4 className="text-sm font-medium text-on-surface dark:text-muted-foreground mb-2 transition-colors">Description:</h4>
                      <p className="text-sm text-muted-foreground dark:text-muted-foreground transition-colors">{strategy.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
