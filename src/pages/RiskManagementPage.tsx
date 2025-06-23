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
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'mitigated': return 'bg-green-100 text-green-800';
      case 'monitored': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'investigating': return 'bg-orange-100 text-orange-800';
      case 'implemented': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'planned': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'implemented':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'mitigated':
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'monitored':
      case 'in-progress':
        return <Activity className="w-5 h-5 text-blue-500" />;
      case 'investigating':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'inactive':
      case 'planned':
        return <XCircle className="w-5 h-5 text-gray-500" />;
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Risk Management
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Assess risks, configure safety protocols, and manage incidents
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base">
                <Plus className="w-4 h-4" />
                <span className="whitespace-nowrap">
                  New Assessment
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="bg-white rounded-lg shadow">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('assessment')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'assessment'
                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Risk Assessment
              </button>
              <button
                onClick={() => setActiveTab('protocols')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'protocols'
                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Safety Protocols
              </button>
              <button
                onClick={() => setActiveTab('incidents')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'incidents'
                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Incident Reporting
              </button>
              <button
                onClick={() => setActiveTab('mitigation')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'mitigation'
                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Mitigation Strategies
              </button>
            </nav>
          </div>

          {/* Search and filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab === 'assessment' ? 'risk assessments' : activeTab === 'protocols' ? 'safety protocols' : activeTab === 'incidents' ? 'incident reports' : 'mitigation strategies'}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white hover:bg-gray-50">
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Content based on active tab */}
          <div className="p-6">
            {activeTab === 'assessment' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Probability</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impact</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRiskAssessments.map((risk) => (
                      <tr key={risk.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{risk.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{risk.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityColor(risk.severity)}`}>
                            {risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{risk.probability.charAt(0).toUpperCase() + risk.probability.slice(1)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{risk.impact.charAt(0).toUpperCase() + risk.impact.slice(1)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(risk.status)}`}>
                            {risk.status.charAt(0).toUpperCase() + risk.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-indigo-600 hover:text-indigo-900">View</button>
                            <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
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
                  <div key={protocol.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          <Shield className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{protocol.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">{protocol.description}</p>
                          <div className="mt-2 flex items-center space-x-4">
                            <div className="flex items-center">
                              {getStatusIcon(protocol.status)}
                              <span className={`ml-1.5 text-sm ${protocol.status === 'active' ? 'text-green-600' : 'text-gray-500'}`}>
                                {protocol.status.charAt(0).toUpperCase() + protocol.status.slice(1)}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">Last updated: {protocol.lastUpdated}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-gray-100">
                          <Edit2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button className="text-sm text-indigo-600 hover:text-indigo-900">Configure Protocol</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'incidents' && (
              <div className="space-y-6">
                {filteredIncidentReports.map((incident) => (
                  <div key={incident.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{incident.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">Agent: {incident.agent}</p>
                          <p className="text-sm text-gray-500">Date: {incident.date}</p>
                          <div className="mt-2 flex items-center space-x-4">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityColor(incident.severity)}`}>
                              {incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)}
                            </span>
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(incident.status)}`}>
                              {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-gray-100">
                          <Eye className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-gray-100">
                          <Edit2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Description:</h4>
                      <p className="text-sm text-gray-600">{incident.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'mitigation' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredMitigationStrategies.map((strategy) => (
                  <div key={strategy.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Shield className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{strategy.strategy}</h3>
                          <p className="text-sm text-gray-500 mt-1">Risk: {strategy.risk}</p>
                          <div className="mt-2 flex items-center">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(strategy.status)}`}>
                              {strategy.status.charAt(0).toUpperCase() + strategy.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-gray-100">
                          <Edit2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Description:</h4>
                      <p className="text-sm text-gray-600">{strategy.description}</p>
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