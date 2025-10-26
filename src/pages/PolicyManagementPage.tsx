import React, { useState } from 'react';
import { FileText, Plus, Edit2, Trash2, Search, Filter, Check, X } from 'lucide-react';

export default function PolicyManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'behavior' | 'access' | 'compliance' | 'ethics'>('behavior');

  // Mock data for policies
  const policies = {
    behavior: [
      { id: 'b1', name: 'Response Content Guidelines', description: 'Defines acceptable content in agent responses', status: 'active', lastUpdated: '2025-03-15' },
      { id: 'b2', name: 'Conversation Flow Rules', description: 'Controls how agents manage conversation flow', status: 'active', lastUpdated: '2025-03-10' },
      { id: 'b3', name: 'Escalation Thresholds', description: 'Defines when agents should escalate to human operators', status: 'active', lastUpdated: '2025-03-05' },
    ],
    access: [
      { id: 'a1', name: 'Agent Access Levels', description: 'Defines access levels for different agent types', status: 'active', lastUpdated: '2025-03-12' },
      { id: 'a2', name: 'Data Access Permissions', description: 'Controls what data agents can access', status: 'active', lastUpdated: '2025-03-08' },
      { id: 'a3', name: 'User Role Permissions', description: 'Defines which users can manage agents', status: 'draft', lastUpdated: '2025-03-02' },
    ],
    compliance: [
      { id: 'c1', name: 'GDPR Compliance Rules', description: 'Ensures agents comply with GDPR requirements', status: 'active', lastUpdated: '2025-03-14' },
      { id: 'c2', name: 'Data Retention Policy', description: 'Defines how long conversation data is stored', status: 'active', lastUpdated: '2025-03-09' },
      { id: 'c3', name: 'Regulatory Reporting', description: 'Guidelines for regulatory compliance reporting', status: 'draft', lastUpdated: '2025-03-01' },
    ],
    ethics: [
      { id: 'e1', name: 'Ethical AI Guidelines', description: 'Principles for ethical AI behavior', status: 'active', lastUpdated: '2025-03-13' },
      { id: 'e2', name: 'Bias Prevention Rules', description: 'Guidelines to prevent bias in AI responses', status: 'active', lastUpdated: '2025-03-07' },
      { id: 'e3', name: 'Transparency Requirements', description: 'Rules for maintaining AI transparency', status: 'active', lastUpdated: '2025-03-03' },
    ],
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'draft': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'inactive': return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  const filteredPolicies = policies[activeTab].filter(policy => 
    policy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    policy.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors">
                Policy Management
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 transition-colors">
                Configure and manage AI agent behavior rules and constraints
              </p>
            </div>
            <div className="flex gap-3">
              <button           className="flex items-center gap-2 bg-indigo-600 dark:bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-teal-700 transition-colors shadow-sm dark:shadow-gray-900"
        >
                <Plus className="w-4 h-4" />
                <span className="whitespace-nowrap">
                  Create Policy
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
                onClick={() => setActiveTab('behavior')}
                className={`py-4 px-6 text-sm font-medium transition-colors ${
                  activeTab === 'behavior'
                    ? 'border-b-2 border-teal-500 dark:border-teal-400 text-teal-600 dark:text-teal-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                Behavior Rules
              </button>
              <button
                onClick={() => setActiveTab('access')}
                className={`py-4 px-6 text-sm font-medium transition-colors ${
                  activeTab === 'access'
                    ? 'border-b-2 border-teal-500 dark:border-teal-400 text-teal-600 dark:text-teal-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                Access Control
              </button>
              <button
                onClick={() => setActiveTab('compliance')}
                className={`py-4 px-6 text-sm font-medium transition-colors ${
                  activeTab === 'compliance'
                    ? 'border-b-2 border-teal-500 dark:border-teal-400 text-teal-600 dark:text-teal-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                Compliance Settings
              </button>
              <button
                onClick={() => setActiveTab('ethics')}
                className={`py-4 px-6 text-sm font-medium transition-colors ${
                  activeTab === 'ethics'
                    ? 'border-b-2 border-teal-500 dark:border-teal-400 text-teal-600 dark:text-teal-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                Ethics Guidelines
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
                  placeholder="Search policies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-teal-500 dark:focus:border-teal-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors">
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Policy list */}
          <div className="p-6">
            <div className="space-y-4">
              {filteredPolicies.length > 0 ? (
                filteredPolicies.map((policy) => (
                  <div
                    key={policy.id}
                    className={`p-4 border rounded-lg hover:shadow-md dark:hover:shadow-gray-800 transition-all cursor-pointer ${
                      selectedPolicy === policy.id 
                        ? 'border-teal-500 dark:border-teal-400 ring-1 ring-teal-500 dark:ring-teal-400' 
                        : 'border-gray-200 dark:border-gray-600'
                    }`}
                    onClick={() => setSelectedPolicy(policy.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-indigo-100 dark:bg-teal-900/30 rounded-lg transition-colors">
                          <FileText className="h-6 w-6 text-indigo-600 dark:text-teal-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 transition-colors">{policy.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors">{policy.description}</p>
                          <div className="mt-2 flex items-center space-x-4">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full transition-colors ${getStatusColor(policy.status)}`}>
                              {policy.status.charAt(0).toUpperCase() + policy.status.slice(1)}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors">Last updated: {policy.lastUpdated}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsEditModalOpen(true);
                          }}
                          className="p-2 text-gray-400 dark:text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 transition-colors" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors">No policies found</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 transition-colors">
                    {searchQuery
                      ? 'Try adjusting your search query'
                      : 'Get started by creating a new policy'}
                  </p>
                  {!searchQuery && (
                    <div className="mt-6">
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm dark:shadow-gray-900 text-sm font-medium rounded-md text-white bg-teal-600 dark:bg-teal-500 hover:bg-teal-700 dark:hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-teal-500 dark:focus:ring-teal-400 transition-colors"
                      >
                        <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        Create Policy
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 shadow-2xl dark:shadow-gray-900 border border-gray-200 dark:border-gray-600 transition-colors mx-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100 transition-colors">Edit Policy</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Policy Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-teal-500 dark:focus:border-teal-400 transition-colors"
                  defaultValue={filteredPolicies.find(p => p.id === selectedPolicy)?.name}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-teal-500 dark:focus:border-teal-400 transition-colors"
                  rows={3}
                  defaultValue={filteredPolicies.find(p => p.id === selectedPolicy)?.description}
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Status</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-teal-500 dark:focus:border-teal-400 transition-colors">
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Policy Content</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md font-mono text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-teal-500 dark:focus:border-teal-400 transition-colors"
                  rows={10}
                  defaultValue={`{
  "policy_type": "behavior",
  "rules": [
    {
      "id": "rule_1",
      "description": "Response must not contain harmful content",
      "priority": "high",
      "action": "filter"
    },
    {
      "id": "rule_2",
      "description": "Responses exceeding confidence threshold of 0.8",
      "priority": "medium",
      "action": "allow"
    }
  ],
  "enforcement": "strict",
  "version": "1.2"
}`}
                ></textarea>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 bg-teal-600 dark:bg-teal-500 text-white rounded-md hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors shadow-sm dark:shadow-gray-900"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-2xl dark:shadow-gray-900 border border-gray-200 dark:border-gray-600 transition-colors mx-4">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 mx-auto mb-4 transition-colors">
              <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-medium text-center text-gray-900 dark:text-gray-100 mb-2 transition-colors">Delete Policy</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6 transition-colors">
              Are you sure you want to delete this policy? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedPolicy(null);
                }}
                className="px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-md hover:bg-red-700 dark:hover:bg-red-600 transition-colors shadow-sm dark:shadow-gray-900"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
