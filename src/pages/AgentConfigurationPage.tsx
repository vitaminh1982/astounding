import React, { useState } from 'react';
import { Settings2, Save, RotateCcw, Bot, Shield, Brain, Activity, MessageSquare, Database, Link, AlertTriangle, Search, Filter, Plus } from 'lucide-react';

export default function AgentConfigurationPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'behavior' | 'knowledge' | 'integration' | 'safety'>('behavior');

  // Mock data for agents
  const agents = [
    { id: '1', name: 'Customer Support 24/7', type: 'support', status: 'active', lastUpdated: '2025-03-15' },
    { id: '2', name: 'Sales Assistant', type: 'sales', status: 'active', lastUpdated: '2025-03-10' },
    { id: '3', name: 'Technical Support', type: 'support', status: 'active', lastUpdated: '2025-03-08' },
    { id: '4', name: 'E-commerce Assistant', type: 'sales', status: 'active', lastUpdated: '2025-03-05' },
    { id: '5', name: 'Billing Service', type: 'support', status: 'inactive', lastUpdated: '2025-03-01' },
    { id: '6', name: 'HR Assistant', type: 'hr', status: 'active', lastUpdated: '2025-02-28' },
  ];

  // Mock data for behavior parameters
  const behaviorParameters = [
    { id: 'b1', name: 'Response Style', value: 'Professional', options: ['Professional', 'Casual', 'Technical', 'Friendly'] },
    { id: 'b2', name: 'Conversation Flow', value: 'Guided', options: ['Guided', 'Open', 'Structured'] },
    { id: 'b3', name: 'Response Length', value: 'Concise', options: ['Concise', 'Detailed', 'Balanced'] },
    { id: 'b4', name: 'Proactivity Level', value: 'Medium', options: ['Low', 'Medium', 'High'] },
    { id: 'b5', name: 'Personality Traits', value: 'Helpful, Knowledgeable', options: ['Helpful', 'Knowledgeable', 'Empathetic', 'Efficient'] },
  ];

  // Mock data for knowledge sources
  const knowledgeSources = [
    { id: 'k1', name: 'Product Documentation', type: 'document', status: 'active', lastUpdated: '2025-03-12' },
    { id: 'k2', name: 'FAQ Database', type: 'database', status: 'active', lastUpdated: '2025-03-10' },
    { id: 'k3', name: 'Customer Support Guidelines', type: 'document', status: 'active', lastUpdated: '2025-03-05' },
    { id: 'k4', name: 'Technical Specifications', type: 'document', status: 'inactive', lastUpdated: '2025-03-01' },
  ];

  // Mock data for integrations
  const integrations = [
    { id: 'i1', name: 'CRM System', type: 'api', status: 'connected', lastUpdated: '2025-03-14' },
    { id: 'i2', name: 'Knowledge Base', type: 'database', status: 'connected', lastUpdated: '2025-03-10' },
    { id: 'i3', name: 'Email Service', type: 'api', status: 'connected', lastUpdated: '2025-03-08' },
    { id: 'i4', name: 'Analytics Platform', type: 'api', status: 'disconnected', lastUpdated: '2025-03-01' },
  ];

  // Mock data for safety settings
  const safetySettings = [
    { id: 's1', name: 'Content Filtering', level: 'High', options: ['Low', 'Medium', 'High'] },
    { id: 's2', name: 'Sensitive Topic Handling', level: 'Strict', options: ['Permissive', 'Balanced', 'Strict'] },
    { id: 's3', name: 'Personal Data Protection', level: 'Maximum', options: ['Standard', 'Enhanced', 'Maximum'] },
    { id: 's4', name: 'Response Verification', level: 'Enabled', options: ['Disabled', 'Enabled'] },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'inactive':
      case 'disconnected':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter agents based on search query
  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Agent Configuration
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Configure behavior parameters, operating boundaries, and integration settings
              </p>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Agent list sidebar */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search agents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  {filteredAgents.map((agent) => (
                    <button
                      key={agent.id}
                      onClick={() => setSelectedAgent(agent.id)}
                      className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                        selectedAgent === agent.id
                          ? 'bg-indigo-50 border-indigo-500 border'
                          : 'hover:bg-gray-50 border border-transparent'
                      }`}
                    >
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                        <Bot className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{agent.name}</p>
                        <div className="flex items-center mt-1">
                          <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(agent.status)}`}>
                            {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                          </span>
                          <span className="ml-2 text-xs text-gray-500">Updated: {agent.lastUpdated}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Configuration panel */}
          <div className="lg:col-span-9">
            {selectedAgent ? (
              <div className="bg-white rounded-lg shadow">
                {/* Agent header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                        <Bot className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                          {agents.find(a => a.id === selectedAgent)?.name}
                        </h2>
                        <p className="text-sm text-gray-500">
                          Type: {agents.find(a => a.id === selectedAgent)?.type.charAt(0).toUpperCase() + agents.find(a => a.id === selectedAgent)?.type.slice(1)} • 
                          Last Updated: {agents.find(a => a.id === selectedAgent)?.lastUpdated}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                      </button>
                      <button className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </button>
                    </div>
                  </div>

                  {/* Configuration tabs */}
                  <div className="mt-6 border-b border-gray-200">
                    <nav className="flex -mb-px">
                      <button
                        onClick={() => setActiveTab('behavior')}
                        className={`py-4 px-6 text-sm font-medium ${
                          activeTab === 'behavior'
                            ? 'border-b-2 border-indigo-500 text-indigo-600'
                            : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center">
                          <Settings2 className="h-4 w-4 mr-2" />
                          Behavior Parameters
                        </div>
                      </button>
                      <button
                        onClick={() => setActiveTab('knowledge')}
                        className={`py-4 px-6 text-sm font-medium ${
                          activeTab === 'knowledge'
                            ? 'border-b-2 border-indigo-500 text-indigo-600'
                            : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center">
                          <Brain className="h-4 w-4 mr-2" />
                          Knowledge Sources
                        </div>
                      </button>
                      <button
                        onClick={() => setActiveTab('integration')}
                        className={`py-4 px-6 text-sm font-medium ${
                          activeTab === 'integration'
                            ? 'border-b-2 border-indigo-500 text-indigo-600'
                            : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center">
                          <Link className="h-4 w-4 mr-2" />
                          Integration Settings
                        </div>
                      </button>
                      <button
                        onClick={() => setActiveTab('safety')}
                        className={`py-4 px-6 text-sm font-medium ${
                          activeTab === 'safety'
                            ? 'border-b-2 border-indigo-500 text-indigo-600'
                            : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center">
                          <Shield className="h-4 w-4 mr-2" />
                          Safety Settings
                        </div>
                      </button>
                    </nav>
                  </div>
                </div>

                {/* Tab content */}
                <div className="p-6">
                  {activeTab === 'behavior' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {behaviorParameters.map((param) => (
                          <div key={param.id} className="border rounded-lg p-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">{param.name}</label>
                            <select
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              defaultValue={param.value}
                            >
                              {param.options.map((option) => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>

                      <div className="border rounded-lg p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Custom Prompt Template</label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono"
                          rows={8}
                          defaultValue={`You are a ${agents.find(a => a.id === selectedAgent)?.name}, a helpful AI assistant designed to provide excellent customer service.

Your primary goals are:
1. Answer customer questions accurately and completely
2. Solve customer problems efficiently
3. Maintain a professional and friendly tone
4. Escalate complex issues to human agents when necessary

When responding to customers:
- Be concise but thorough
- Use a professional tone
- Provide specific, actionable information
- Ask clarifying questions when needed`}
                        ></textarea>
                      </div>

                      <div className="border rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-4">Operating Boundaries</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Response Time</label>
                            <div className="flex items-center">
                              <input
                                type="range"
                                min="1"
                                max="30"
                                defaultValue="10"
                                className="flex-1 mr-4"
                              />
                              <span className="text-sm text-gray-700">10 seconds</span>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Conversation Duration</label>
                            <div className="flex items-center">
                              <input
                                type="range"
                                min="5"
                                max="60"
                                defaultValue="30"
                                className="flex-1 mr-4"
                              />
                              <span className="text-sm text-gray-700">30 minutes</span>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Consecutive Responses</label>
                            <div className="flex items-center">
                              <input
                                type="range"
                                min="1"
                                max="20"
                                defaultValue="5"
                                className="flex-1 mr-4"
                              />
                              <span className="text-sm text-gray-700">5 responses</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'knowledge' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">Knowledge Sources</h3>
                        <button className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Source
                        </button>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source Name</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {knowledgeSources.map((source) => (
                              <tr key={source.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{source.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{source.type.charAt(0).toUpperCase() + source.type.slice(1)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(source.status)}`}>
                                    {source.status.charAt(0).toUpperCase() + source.status.slice(1)}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{source.lastUpdated}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <div className="flex space-x-3">
                                    <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                    <button className="text-red-600 hover:text-red-900">Remove</button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="border rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-4">Knowledge Base Settings</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Update Frequency</label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                              <option>Real-time</option>
                              <option>Hourly</option>
                              <option selected>Daily</option>
                              <option>Weekly</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Relevance Threshold</label>
                            <div className="flex items-center">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                defaultValue="75"
                                className="flex-1 mr-4"
                              />
                              <span className="text-sm text-gray-700">75%</span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="enable-learning"
                              type="checkbox"
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              defaultChecked
                            />
                            <label htmlFor="enable-learning" className="ml-2 block text-sm text-gray-700">
                              Enable continuous learning from conversations
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'integration' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">Integrations</h3>
                        <button className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Integration
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {integrations.map((integration) => (
                          <div key={integration.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex items-start space-x-4">
                                <div className="p-2 bg-indigo-100 rounded-lg">
                                  <Link className="h-6 w-6 text-indigo-600" />
                                </div>
                                <div>
                                  <h3 className="text-lg font-medium text-gray-900">{integration.name}</h3>
                                  <p className="text-sm text-gray-500 mt-1">Type: {integration.type.charAt(0).toUpperCase() + integration.type.slice(1)}</p>
                                  <div className="mt-2">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(integration.status)}`}>
                                      {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <button className="text-sm text-indigo-600 hover:text-indigo-900">Configure</button>
                              </div>
                            </div>
                            <div className="mt-4">
                              <div className="flex items-center">
                                <input
                                  id={`enable-${integration.id}`}
                                  type="checkbox"
                                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                  defaultChecked={integration.status === 'connected'}
                                />
                                <label htmlFor={`enable-${integration.id}`} className="ml-2 block text-sm text-gray-700">
                                  Enable for this agent
                                </label>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-4">API Access Settings</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">API Rate Limit</label>
                            <div className="flex items-center">
                              <input
                                type="number"
                                className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                defaultValue="100"
                              />
                              <span className="ml-2 text-sm text-gray-500">requests per minute</span>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Timeout</label>
                            <div className="flex items-center">
                              <input
                                type="number"
                                className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                defaultValue="30"
                              />
                              <span className="ml-2 text-sm text-gray-500">seconds</span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="enable-retry"
                              type="checkbox"
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              defaultChecked
                            />
                            <label htmlFor="enable-retry" className="ml-2 block text-sm text-gray-700">
                              Enable automatic retry on failure
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'safety' && (
                    <div className="space-y-6">
                      <div className="border rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-4">Safety Settings</h3>
                        <div className="space-y-4">
                          {safetySettings.map((setting) => (
                            <div key={setting.id}>
                              <label className="block text-sm font-medium text-gray-700 mb-2">{setting.name}</label>
                              <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                defaultValue={setting.level}
                              >
                                {setting.options.map((option) => (
                                  <option key={option} value={option}>{option}</option>
                                ))}
                              </select>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-4">Escalation Settings</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Escalation Threshold</label>
                            <div className="flex items-center">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                defaultValue="80"
                                className="flex-1 mr-4"
                              />
                              <span className="text-sm text-gray-700">80%</span>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">Escalate to human when confidence falls below this threshold</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Retry Attempts</label>
                            <div className="flex items-center">
                              <input
                                type="number"
                                className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                defaultValue="3"
                              />
                              <span className="ml-2 text-sm text-gray-500">attempts</span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="enable-explicit-escalation"
                              type="checkbox"
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              defaultChecked
                            />
                            <label htmlFor="enable-explicit-escalation" className="ml-2 block text-sm text-gray-700">
                              Allow users to explicitly request human assistance
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-4">Compliance Settings</h3>
                        <div className="space-y-4">
                          <div className="flex items-center">
                            <input
                              id="enable-gdpr"
                              type="checkbox"
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              defaultChecked
                            />
                            <label htmlFor="enable-gdpr" className="ml-2 block text-sm text-gray-700">
                              Enable GDPR compliance mode
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="enable-logging"
                              type="checkbox"
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              defaultChecked
                            />
                            <label htmlFor="enable-logging" className="ml-2 block text-sm text-gray-700">
                              Enable comprehensive activity logging
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="enable-pii-detection"
                              type="checkbox"
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              defaultChecked
                            />
                            <label htmlFor="enable-pii-detection" className="ml-2 block text-sm text-gray-700">
                              Enable PII detection and redaction
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <Bot className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No Agent Selected</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Select an agent from the list to view and edit its configuration.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}