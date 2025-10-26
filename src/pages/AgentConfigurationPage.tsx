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
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'inactive':
      case 'disconnected':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  // Filter agents based on search query
  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors">
                Agent Configuration
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 transition-colors">
                Configure behavior parameters, operating boundaries, and integration settings
              </p>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Agent list sidebar */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900 border border-gray-200 dark:border-gray-600 transition-colors">
              <div className="p-4 border-b border-gray-200 dark:border-gray-600 transition-colors">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search agents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-teal-500 dark:focus:border-teal-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
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
                          ? 'bg-teal-50 dark:bg-teal-900/30 border-teal-500 dark:border-teal-400 border'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700 border border-transparent'
                      }`}
                    >
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 dark:bg-teal-900/30 flex items-center justify-center mr-3 transition-colors">
                        <Bot className="h-5 w-5 text-indigo-600 dark:text-teal-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate transition-colors">{agent.name}</p>
                        <div className="flex items-center mt-1">
                          <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full transition-colors ${getStatusColor(agent.status)}`}>
                            {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                          </span>
                          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 transition-colors">Updated: {agent.lastUpdated}</span>
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
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900 border border-gray-200 dark:border-gray-600 transition-colors">
                {/* Agent header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-600 transition-colors">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-indigo-100 dark:bg-teal-900/30 flex items-center justify-center mr-4 transition-colors">
                        <Bot className="h-6 w-6 text-indigo-600 dark:text-teal-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 transition-colors">
                          {agents.find(a => a.id === selectedAgent)?.name}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">
                          Type: {agents.find(a => a.id === selectedAgent)?.type.charAt(0).toUpperCase() + agents.find(a => a.id === selectedAgent)?.type.slice(1)} • 
                          Last Updated: {agents.find(a => a.id === selectedAgent)?.lastUpdated}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:shadow-gray-900 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                      </button>
                      <button className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm dark:shadow-gray-900 text-sm font-medium text-white bg-teal-600 dark:bg-teal-500 hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors">
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </button>
                    </div>
                  </div>

                  {/* Configuration tabs */}
                  <div className="mt-6 border-b border-gray-200 dark:border-gray-600 transition-colors">
                    <nav className="flex -mb-px">
                      <button
                        onClick={() => setActiveTab('behavior')}
                        className={`py-4 px-6 text-sm font-medium transition-colors ${
                          activeTab === 'behavior'
                            ? 'border-b-2 border-teal-500 dark:border-teal-400 text-teal-600 dark:text-teal-400'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <div className="flex items-center">
                          <Settings2 className="h-4 w-4 mr-2" />
                          Behavior Parameters
                        </div>
                      </button>
                      <button
                        onClick={() => setActiveTab('knowledge')}
                        className={`py-4 px-6 text-sm font-medium transition-colors ${
                          activeTab === 'knowledge'
                            ? 'border-b-2 border-teal-500 dark:border-teal-400 text-teal-600 dark:text-teal-400'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <div className="flex items-center">
                          <Brain className="h-4 w-4 mr-2" />
                          Knowledge Sources
                        </div>
                      </button>
                      <button
                        onClick={() => setActiveTab('integration')}
                        className={`py-4 px-6 text-sm font-medium transition-colors ${
                          activeTab === 'integration'
                            ? 'border-b-2 border-teal-500 dark:border-teal-400 text-teal-600 dark:text-teal-400'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <div className="flex items-center">
                          <Link className="h-4 w-4 mr-2" />
                          Integration Settings
                        </div>
                      </button>
                      <button
                        onClick={() => setActiveTab('safety')}
                        className={`py-4 px-6 text-sm font-medium transition-colors ${
                          activeTab === 'safety'
                            ? 'border-b-2 border-teal-500 dark:border-teal-400 text-teal-600 dark:text-teal-400'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
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
                          <div key={param.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 transition-colors">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">{param.name}</label>
                            <select
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-teal-500 dark:focus:border-teal-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
                              defaultValue={param.value}
                            >
                              {param.options.map((option) => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>

                      <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 transition-colors">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">Custom Prompt Template</label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-teal-500 dark:focus:border-teal-400 sm:text-sm font-mono bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
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

                      <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 transition-colors">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 transition-colors">Operating Boundaries</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">Maximum Response Time</label>
                            <div className="flex items-center">
                              <input
                                type="range"
                                min="1"
                                max="30"
                                defaultValue="10"
                                className="flex-1 mr-4"
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300 transition-colors">10 seconds</span>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">Maximum Conversation Duration</label>
                            <div className="flex items-center">
                              <input
                                type="range"
                                min="5"
                                max="60"
                                defaultValue="30"
                                className="flex-1 mr-4"
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300 transition-colors">30 minutes</span>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">Maximum Consecutive Responses</label>
                            <div className="flex items-center">
                              <input
                                type="range"
                                min="1"
                                max="20"
                                defaultValue="5"
                                className="flex-1 mr-4"
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300 transition-colors">5 responses</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'knowledge' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 transition-colors">Knowledge Sources</h3>
                        <button className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm dark:shadow-gray-900 text-sm font-medium text-white bg-teal-600 dark:bg-teal-500 hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Source
                        </button>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                          <thead className="bg-gray-50 dark:bg-gray-700 transition-colors">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors">Source Name</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors">Type</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors">Status</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors">Last Updated</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600 transition-colors">
                            {knowledgeSources.map((source) => (
                              <tr key={source.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors">{source.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 transition-colors">{source.type.charAt(0).toUpperCase() + source.type.slice(1)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full transition-colors ${getStatusColor(source.status)}`}>
                                    {source.status.charAt(0).toUpperCase() + source.status.slice(1)}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 transition-colors">{source.lastUpdated}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <div className="flex space-x-3">
                                    <button className="text-teal-600 dark:text-teal-400 hover:text-teal-900 dark:hover:text-teal-300 transition-colors">Edit</button>
                                    <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors">Remove</button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 transition-colors">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 transition-colors">Knowledge Base Settings</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">Update Frequency</label>
                            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-teal-500 dark:focus:border-teal-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors">
                              <option>Real-time</option>
                              <option>Hourly</option>
                              <option selected>Daily</option>
                              <option>Weekly</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">Relevance Threshold</label>
                            <div className="flex items-center">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                defaultValue="75"
                                className="flex-1 mr-4"
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300 transition-colors">75%</span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="enable-learning"
                              type="checkbox"
                              className="h-4 w-4 text-teal-600 dark:text-teal-400 focus:ring-teal-500 dark:focus:ring-teal-400 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                              defaultChecked
                            />
                            <label htmlFor="enable-learning" className="ml-2 block text-sm text-gray-700 dark:text-gray-300 transition-colors">
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
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 transition-colors">Integrations</h3>
                        <button className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm dark:shadow-gray-900 text-sm font-medium text-white bg-teal-600 dark:bg-teal-500 hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Integration
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {integrations.map((integration) => (
                          <div key={integration.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 transition-colors">
                            <div className="flex justify-between items-start">
                              <div className="flex items-start space-x-4">
                                <div className="p-2 bg-indigo-100 dark:bg-teal-900/30 rounded-lg transition-colors">
                                  <Link className="h-6 w-6 text-indigo-600 dark:text-teal-400" />
                                </div>
                                <div>
                                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 transition-colors">{integration.name}</h3>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors">Type: {integration.type.charAt(0).toUpperCase() + integration.type.slice(1)}</p>
                                  <div className="mt-2">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full transition-colors ${getStatusColor(integration.status)}`}>
                                      {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <button className="text-sm text-teal-600 dark:text-teal-400 hover:text-teal-900 dark:hover:text-teal-300 transition-colors">Configure</button>
                              </div>
                            </div>
                            <div className="mt-4">
                              <div className="flex items-center">
                                <input
                                  id={`enable-${integration.id}`}
                                  type="checkbox"
                                  className="h-4 w-4 text-teal-600 dark:text-teal-400 focus:ring-teal-500 dark:focus:ring-teal-400 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                                  defaultChecked={integration.status === 'connected'}
                                />
                                <label htmlFor={`enable-${integration.id}`} className="ml-2 block text-sm text-gray-700 dark:text-gray-300 transition-colors">
                                  Enable for this agent
                                </label>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 transition-colors">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 transition-colors">API Access Settings</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">API Rate Limit</label>
                            <div className="flex items-center">
                              <input
                                type="number"
                                className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-teal-500 dark:focus:border-teal-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
                                defaultValue="100"
                              />
                              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 transition-colors">requests per minute</span>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">Timeout</label>
                            <div className="flex items-center">
                              <input
                                type="number"
                                className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-teal-500 dark:focus:border-teal-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
                                defaultValue="30"
                              />
                              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 transition-colors">seconds</span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="enable-retry"
                              type="checkbox"
                              className="h-4 w-4 text-teal-600 dark:text-teal-400 focus:ring-teal-500 dark:focus:ring-teal-400 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                              defaultChecked
                            />
                            <label htmlFor="enable-retry" className="ml-2 block text-sm text-gray-700 dark:text-gray-300 transition-colors">
                              Enable automatic retry on failure
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'safety' && (
                    <div className="space-y-6">
                      <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 transition-colors">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 transition-colors">Safety Settings</h3>
                        <div className="space-y-4">
                          {safetySettings.map((setting) => (
                            <div key={setting.id}>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">{setting.name}</label>
                              <select
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-teal-500 dark:focus:border-teal-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
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

                      <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 transition-colors">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 transition-colors">Escalation Settings</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">Escalation Threshold</label>
                            <div className="flex items-center">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                defaultValue="80"
                                className="flex-1 mr-4"
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300 transition-colors">80%</span>
                            </div>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 transition-colors">Escalate to human when confidence falls below this threshold</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">Maximum Retry Attempts</label>
                            <div className="flex items-center">
                              <input
                                type="number"
                                className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-teal-500 dark:focus:border-teal-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
                                defaultValue="3"
                              />
                              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 transition-colors">attempts</span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="enable-explicit-escalation"
                              type="checkbox"
                              className="h-4 w-4 text-teal-600 dark:text-teal-400 focus:ring-teal-500 dark:focus:ring-teal-400 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                              defaultChecked
                            />
                            <label htmlFor="enable-explicit-escalation" className="ml-2 block text-sm text-gray-700 dark:text-gray-300 transition-colors">
                              Allow users to explicitly request human assistance
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 transition-colors">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 transition-colors">Compliance Settings</h3>
                        <div className="space-y-4">
                          <div className="flex items-center">
                            <input
                              id="enable-gdpr"
                              type="checkbox"
                              className="h-4 w-4 text-teal-600 dark:text-teal-400 focus:ring-teal-500 dark:focus:ring-teal-400 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                              defaultChecked
                            />
                            <label htmlFor="enable-gdpr" className="ml-2 block text-sm text-gray-700 dark:text-gray-300 transition-colors">
                              Enable GDPR compliance mode
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="enable-logging"
                              type="checkbox"
                              className="h-4 w-4 text-teal-600 dark:text-teal-400 focus:ring-teal-500 dark:focus:ring-teal-400 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                              defaultChecked
                            />
                            <label htmlFor="enable-logging" className="ml-2 block text-sm text-gray-700 dark:text-gray-300 transition-colors">
                              Enable comprehensive activity logging
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="enable-pii-detection"
                              type="checkbox"
                              className="h-4 w-4 text-teal-600 dark:text-teal-400 focus:ring-teal-500 dark:focus:ring-teal-400 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                              defaultChecked
                            />
                            <label htmlFor="enable-pii-detection" className="ml-2 block text-sm text-gray-700 dark:text-gray-300 transition-colors">
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
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900 p-6 text-center border border-gray-200 dark:border-gray-600 transition-colors">
                <Bot className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 transition-colors" />
                <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100 transition-colors">No Agent Selected</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 transition-colors">
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
