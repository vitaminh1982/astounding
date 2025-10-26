import React, { useState } from 'react';
import { ClipboardCheck, Download, Search, Filter, Calendar, Eye, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function AuditCompliancePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('7d');
  const [selectedAudit, setSelectedAudit] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'audit' | 'compliance' | 'decisions'>('audit');

  // Mock data for audit logs
  const auditLogs = [
    { id: 'a1', agent: 'Customer Support 24/7', action: 'Response Generated', timestamp: '2025-03-15 14:32:45', user: 'System', status: 'success', details: 'Response generated for customer inquiry about product return policy' },
    { id: 'a2', agent: 'Sales Assistant', action: 'Access to CRM', timestamp: '2025-03-15 13:15:22', user: 'Sophie Martin', status: 'success', details: 'Accessed customer purchase history for lead qualification' },
    { id: 'a3', agent: 'Technical Support', action: 'Escalation', timestamp: '2025-03-15 11:47:10', user: 'System', status: 'warning', details: 'Escalated technical issue to human support due to complexity threshold' },
    { id: 'a4', agent: 'E-commerce Assistant', action: 'Product Recommendation', timestamp: '2025-03-15 10:23:18', user: 'System', status: 'success', details: 'Generated personalized product recommendations based on browsing history' },
    { id: 'a5', agent: 'Technical Support', action: 'API Access', timestamp: '2025-03-15 09:05:33', user: 'System', status: 'error', details: 'Failed to access knowledge base API due to authentication error' },
  ];

  // Mock data for compliance reports
  const complianceReports = [
    { id: 'c1', title: 'GDPR Compliance Audit', date: '2025-03-10', status: 'compliant', score: 98, issues: 1 },
    { id: 'c2', title: 'Data Privacy Assessment', date: '2025-03-01', status: 'compliant', score: 95, issues: 2 },
    { id: 'c3', title: 'Ethical AI Guidelines Review', date: '2025-02-15', status: 'compliant', score: 97, issues: 0 },
    { id: 'c4', title: 'Security Compliance Check', date: '2025-02-01', status: 'non-compliant', score: 82, issues: 5 },
  ];

  // Mock data for decision logs
  const decisionLogs = [
    { id: 'd1', agent: 'Customer Support 24/7', decision: 'Refund Approval', timestamp: '2025-03-15 15:42:18', confidence: 0.92, explanation: 'Approved refund based on return policy and purchase date within 30-day window' },
    { id: 'd2', agent: 'Sales Assistant', decision: 'Discount Offer', timestamp: '2025-03-15 14:23:05', confidence: 0.87, explanation: 'Offered 10% discount based on customer loyalty status and purchase history' },
    { id: 'd3', agent: 'Technical Support', decision: 'Solution Recommendation', timestamp: '2025-03-15 12:15:33', confidence: 0.78, explanation: 'Recommended software restart based on error code analysis and system logs' },
    { id: 'd4', agent: 'E-commerce Assistant', decision: 'Product Recommendation', timestamp: '2025-03-15 10:05:27', confidence: 0.95, explanation: 'Recommended complementary products based on current cart items and purchase patterns' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'warning': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'error': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'compliant': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'non-compliant': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
      case 'compliant':
        return <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />;
      case 'error':
      case 'non-compliant':
        return <XCircle className="w-5 h-5 text-red-500 dark:text-red-400" />;
      default:
        return null;
    }
  };

  const filteredAuditLogs = auditLogs.filter(log => 
    log.agent.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredComplianceReports = complianceReports.filter(report => 
    report.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDecisionLogs = decisionLogs.filter(log => 
    log.agent.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.decision.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.explanation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors">
                Audit & Compliance
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 transition-colors">
                Monitor activity logs, compliance reports, and decision explanations
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center justify-center gap-2 bg-teal-600 dark:bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors text-sm sm:text-base shadow-sm dark:shadow-gray-900">
                <Download className="w-4 h-4" />
                <span className="whitespace-nowrap">
                  Export Report
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900 border border-gray-200 dark:border-gray-600 transition-colors">
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-600 transition-colors">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('audit')}
                className={`py-4 px-6 text-sm font-medium transition-colors ${
                  activeTab === 'audit'
                    ? 'border-b-2 border-teal-500 dark:border-teal-400 text-teal-600 dark:text-teal-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                Activity Audit Trails
              </button>
              <button
                onClick={() => setActiveTab('compliance')}
                className={`py-4 px-6 text-sm font-medium transition-colors ${
                  activeTab === 'compliance'
                    ? 'border-b-2 border-teal-500 dark:border-teal-400 text-teal-600 dark:text-teal-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                Compliance Reports
              </button>
              <button
                onClick={() => setActiveTab('decisions')}
                className={`py-4 px-6 text-sm font-medium transition-colors ${
                  activeTab === 'decisions'
                    ? 'border-b-2 border-teal-500 dark:border-teal-400 text-teal-600 dark:text-teal-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                Decision Logs
              </button>
            </nav>
          </div>

          {/* Search and filters */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-600 transition-colors">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab === 'audit' ? 'audit logs' : activeTab === 'compliance' ? 'compliance reports' : 'decision logs'}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-teal-500 dark:focus:border-teal-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex items-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden transition-colors">
                  <Calendar className="ml-3 w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <select
                    className="w-full py-2 pl-2 pr-8 bg-transparent border-none focus:ring-0 text-sm text-gray-700 dark:text-gray-300 transition-colors"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                  >
                    <option value="24h">Last 24 Hours</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 90 Days</option>
                  </select>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors">
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content based on active tab */}
          <div className="p-6">
            {activeTab === 'audit' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                  <thead className="bg-gray-50 dark:bg-gray-700 transition-colors">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors">Agent</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors">Action</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors">Timestamp</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors">User</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors">Details</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600 transition-colors">
                    {filteredAuditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors">{log.agent}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 transition-colors">{log.action}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 transition-colors">{log.timestamp}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 transition-colors">{log.user}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full transition-colors ${getStatusColor(log.status)}`}>
                            {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 transition-colors">
                          <button
                            onClick={() => setSelectedAudit(log.id)}
                            className="text-teal-600 dark:text-teal-400 hover:text-teal-900 dark:hover:text-teal-300 transition-colors"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'compliance' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredComplianceReports.map((report) => (
                  <div key={report.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-6 hover:shadow-md dark:hover:shadow-gray-800 transition-all">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-indigo-100 dark:bg-teal-900/30 rounded-lg transition-colors">
                          <ClipboardCheck className="h-6 w-6 text-indigo-600 dark:text-teal-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 transition-colors">{report.title}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors">Date: {report.date}</p>
                          <div className="mt-2 flex items-center space-x-4">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full transition-colors ${getStatusColor(report.status)}`}>
                              {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Score: {report.score}%</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Issues: {report.issues}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <Eye className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <Download className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden transition-colors">
                        <div 
                          className={`h-full ${report.score >= 90 ? 'bg-green-500' : report.score >= 80 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${report.score}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'decisions' && (
              <div className="space-y-6">
                {filteredDecisionLogs.map((log) => (
                  <div key={log.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-6 hover:shadow-md dark:hover:shadow-gray-800 transition-all">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-indigo-100 dark:bg-teal-900/30 rounded-lg transition-colors">
                          <FileText className="h-6 w-6 text-indigo-600 dark:text-teal-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 transition-colors">{log.decision}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors">Agent: {log.agent}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Timestamp: {log.timestamp}</p>
                          <div className="mt-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">Confidence Score: </span>
                            <span className={`text-sm ${log.confidence >= 0.9 ? 'text-green-600 dark:text-green-400' : log.confidence >= 0.7 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'} transition-colors`}>
                              {(log.confidence * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <Eye className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-colors">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">Explanation:</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">{log.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Audit Detail Modal */}
      {selectedAudit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 shadow-2xl dark:shadow-gray-900 border border-gray-200 dark:border-gray-600 transition-colors mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100 transition-colors">Audit Log Details</h2>
            <div className="space-y-4">
              {auditLogs.find(log => log.id === selectedAudit) && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors">Agent</p>
                      <p className="text-base font-medium text-gray-900 dark:text-gray-100 transition-colors">{auditLogs.find(log => log.id === selectedAudit)?.agent}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors">Action</p>
                      <p className="text-base font-medium text-gray-900 dark:text-gray-100 transition-colors">{auditLogs.find(log => log.id === selectedAudit)?.action}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors">Timestamp</p>
                      <p className="text-base text-gray-900 dark:text-gray-100 transition-colors">{auditLogs.find(log => log.id === selectedAudit)?.timestamp}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors">User</p>
                      <p className="text-base text-gray-900 dark:text-gray-100 transition-colors">{auditLogs.find(log => log.id === selectedAudit)?.user}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors">Status</p>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full transition-colors ${getStatusColor(auditLogs.find(log => log.id === selectedAudit)?.status || '')}`}>
                        {(auditLogs.find(log => log.id === selectedAudit)?.status || '').charAt(0).toUpperCase() + (auditLogs.find(log => log.id === selectedAudit)?.status || '').slice(1)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 transition-colors">Details</p>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-colors">
                      <p className="text-sm text-gray-900 dark:text-gray-100 transition-colors">{auditLogs.find(log => log.id === selectedAudit)?.details}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 transition-colors">Raw Log</p>
                    <pre className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg overflow-x-auto text-xs font-mono text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 transition-colors">
                      {JSON.stringify({
                        id: auditLogs.find(log => log.id === selectedAudit)?.id,
                        timestamp: auditLogs.find(log => log.id === selectedAudit)?.timestamp,
                        agent_id: 'agent_' + auditLogs.find(log => log.id === selectedAudit)?.id,
                        agent_name: auditLogs.find(log => log.id === selectedAudit)?.agent,
                        action: auditLogs.find(log => log.id === selectedAudit)?.action,
                        user: auditLogs.find(log => log.id === selectedAudit)?.user,
                        status: auditLogs.find(log => log.id === selectedAudit)?.status,
                        details: auditLogs.find(log => log.id === selectedAudit)?.details,
                        metadata: {
                          ip_address: '192.168.1.1',
                          session_id: 'sess_' + Math.random().toString(36).substring(2, 10),
                          request_id: 'req_' + Math.random().toString(36).substring(2, 10)
                        }
                      }, null, 2)}
                    </pre>
                  </div>
                </>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedAudit(null)}
                className="px-4 py-2 bg-teal-600 dark:bg-teal-500 text-white rounded-md hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors shadow-sm dark:shadow-gray-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
