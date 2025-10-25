import React, { useState } from 'react';
import { BarChart2, Calendar, Download, Filter, Search, TrendingUp, TrendingDown, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

import MetricComparisonChart from '../components/analytics/MetricComparisonChart';
import PerformanceChart from '../components/analytics/PerformanceChart';
export default function PerformanceAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'conversations' | 'efficiency'>('overview');

  // Mock data for performance metrics
  const performanceMetrics = {
    overview: {
      totalConversations: 12458,
      avgResponseTime: '1.2s',
      resolutionRate: 94.5,
      customerSatisfaction: 4.8,
      trend: {
        conversations: '+12%',
        responseTime: '-8%',
        resolutionRate: '+2.5%',
        satisfaction: '+0.3'
      }
    },
    agentPerformance: [
      { id: 1, name: 'Customer Support 24/7', conversations: 5621, responseTime: '0.9s', resolutionRate: 96.2, satisfaction: 4.9, status: 'excellent' },
      { id: 2, name: 'Sales Assistant', conversations: 3245, responseTime: '1.1s', resolutionRate: 93.5, satisfaction: 4.7, status: 'good' },
      { id: 3, name: 'Technical Support', conversations: 2156, responseTime: '1.5s', resolutionRate: 91.8, satisfaction: 4.6, status: 'good' },
      { id: 4, name: 'E-commerce Assistant', conversations: 1436, responseTime: '1.0s', resolutionRate: 95.3, satisfaction: 4.8, status: 'excellent' },
    ],
    conversationMetrics: [
      { category: 'Product Inquiries', count: 4532, avgDuration: '3m 45s', resolutionRate: 97.2, satisfaction: 4.8 },
      { category: 'Technical Issues', count: 3218, avgDuration: '8m 12s', resolutionRate: 89.5, satisfaction: 4.5 },
      { category: 'Billing Questions', count: 2145, avgDuration: '4m 30s', resolutionRate: 94.8, satisfaction: 4.7 },
      { category: 'Order Status', count: 1563, avgDuration: '2m 15s', resolutionRate: 98.3, satisfaction: 4.9 },
    ],
    resourceEfficiency: {
      cpuUsage: 42,
      memoryUsage: 38,
      apiCalls: 1245678,
      costPerConversation: '€0.012',
      trend: {
        cpuUsage: '-5%',
        memoryUsage: '-3%',
        apiCalls: '+8%',
        costPerConversation: '-7%'
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'average': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    if (trend.startsWith('+')) {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    } else if (trend.startsWith('-')) {
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    }
    return null;
  };

  // Filter agent performance data based on search query
  const filteredAgentPerformance = performanceMetrics.agentPerformance.filter(agent => 
    agent.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter conversation metrics data based on search query
  const filteredConversationMetrics = performanceMetrics.conversationMetrics.filter(metric => 
    metric.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Performance Analytics
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Monitor and analyze AI agent performance metrics
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
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="90d">Last 90 Days</option>
                  <option value="1y">Last Year</option>
                </select>
              </div>
              <button className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base">
                <Download className="w-4 h-4" />
                <span className="whitespace-nowrap">
                  Export Report
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
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Performance Overview
              </button>
              <button
                onClick={() => setActiveTab('agents')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'agents'
                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Agent Performance
              </button>
              <button
                onClick={() => setActiveTab('conversations')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'conversations'
                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Conversation Metrics
              </button>
              <button
                onClick={() => setActiveTab('efficiency')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'efficiency'
                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Resource Efficiency
              </button>
            </nav>
          </div>

          {/* Content based on active tab */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                {/* Overview metrics cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-lg border p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Total Conversations</h3>
                      <div className="flex items-center text-green-600">
                        {getTrendIcon(performanceMetrics.overview.trend.conversations)}
                        <span className="ml-1 text-sm">{performanceMetrics.overview.trend.conversations}</span>
                      </div>
                    </div>
                    <div className="text-3xl font-bold">{performanceMetrics.overview.totalConversations.toLocaleString()}</div>
                  </div>

                  <div className="bg-white rounded-lg border p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Avg Response Time</h3>
                      <div className="flex items-center text-green-600">
                        {getTrendIcon(performanceMetrics.overview.trend.responseTime)}
                        <span className="ml-1 text-sm">{performanceMetrics.overview.trend.responseTime}</span>
                      </div>
                    </div>
                    <div className="text-3xl font-bold">{performanceMetrics.overview.avgResponseTime}</div>
                  </div>

                  <div className="bg-white rounded-lg border p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Resolution Rate</h3>
                      <div className="flex items-center text-green-600">
                        {getTrendIcon(performanceMetrics.overview.trend.resolutionRate)}
                        <span className="ml-1 text-sm">{performanceMetrics.overview.trend.resolutionRate}</span>
                      </div>
                    </div>
                    <div className="text-3xl font-bold">{performanceMetrics.overview.resolutionRate}%</div>
                  </div>

                  <div className="bg-white rounded-lg border p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Customer Satisfaction</h3>
                      <div className="flex items-center text-green-600">
                        {getTrendIcon('+' + performanceMetrics.overview.trend.satisfaction)}
                        <span className="ml-1 text-sm">{performanceMetrics.overview.trend.satisfaction}</span>
                      </div>
                    </div>
                    <div className="text-3xl font-bold">{performanceMetrics.overview.customerSatisfaction}/5</div>
                  </div>
                </div>

                {/* Performance Chart Component */}
                <PerformanceChart 
                  title="Performance Trends" 
                  description="Track key performance indicators over time"
                  height={350}
                  className="mb-8"
                />

                {/* Top performing agents */}
                <div className="bg-white rounded-lg border p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium text-gray-900">Top Performing Agents</h3>
                    <button className="text-sm text-indigo-600 hover:text-indigo-900">View All</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversations</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response Time</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resolution Rate</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Satisfaction</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {performanceMetrics.agentPerformance.slice(0, 3).map((agent) => (
                          <tr key={agent.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{agent.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.conversations.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.responseTime}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.resolutionRate}%</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.satisfaction}/5</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(agent.status)}`}>
                                {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'agents' && (
              <div className="space-y-8">
                {/* Agent performance table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversations</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response Time</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resolution Rate</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Satisfaction</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredAgentPerformance.map((agent) => (
                        <tr key={agent.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{agent.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.conversations.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.responseTime}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.resolutionRate}%</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.satisfaction}/5</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(agent.status)}`}>
                              {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-indigo-600 hover:text-indigo-900">View Details</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Response Time Comparison Chart */}
                <MetricComparisonChart 
                  title="Response Time Comparison" 
                  description="Compare response times across different agents"
                  metric="responseTime"
                  unit="seconds"
                />
                
                {/* Resolution Rate Comparison Chart */}
                <MetricComparisonChart 
                  title="Resolution Rate Comparison" 
                  description="Compare resolution rates across different agents"
                  metric="resolutionRate"
                  unit="%"
                />
                
                {/* Satisfaction Comparison Chart */}
                <MetricComparisonChart 
                  title="Satisfaction Comparison" 
                  description="Compare satisfaction scores across different agents"
                  metric="satisfaction"
                  unit="score"
                />
              </div>
            )}

            {activeTab === 'conversations' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {filteredConversationMetrics.map((metric, index) => (
                    <div key={index} className="bg-white rounded-lg border p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">{metric.category}</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Conversations</p>
                          <p className="text-xl font-semibold">{metric.count.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Avg Duration</p>
                          <p className="text-xl font-semibold">{metric.avgDuration}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Resolution Rate</p>
                          <p className="text-xl font-semibold">{metric.resolutionRate}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Satisfaction</p>
                          <p className="text-xl font-semibold">{metric.satisfaction}/5</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-500"
                            style={{ width: `${(metric.count / performanceMetrics.overview.totalConversations) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {((metric.count / performanceMetrics.overview.totalConversations) * 100).toFixed(1)}% of total conversations
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Conversation flow visualization placeholder */}
                <PerformanceChart 
                  title="Conversation Metrics Over Time" 
                  description="Track conversation volume, duration, and outcomes"
                  height={350}
                />
              </div>
            )}

            {activeTab === 'efficiency' && (
              <div className="space-y-8">
                {/* Resource usage metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-lg border p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">CPU Usage</h3>
                      <div className="flex items-center text-green-600">
                        {getTrendIcon(performanceMetrics.resourceEfficiency.trend.cpuUsage)}
                        <span className="ml-1 text-sm">{performanceMetrics.resourceEfficiency.trend.cpuUsage}</span>
                      </div>
                    </div>
                    <div className="text-3xl font-bold">{performanceMetrics.resourceEfficiency.cpuUsage}%</div>
                    <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500"
                        style={{ width: `${performanceMetrics.resourceEfficiency.cpuUsage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Memory Usage</h3>
                      <div className="flex items-center text-green-600">
                        {getTrendIcon(performanceMetrics.resourceEfficiency.trend.memoryUsage)}
                        <span className="ml-1 text-sm">{performanceMetrics.resourceEfficiency.trend.memoryUsage}</span>
                      </div>
                    </div>
                    <div className="text-3xl font-bold">{performanceMetrics.resourceEfficiency.memoryUsage}%</div>
                    <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-500"
                        style={{ width: `${performanceMetrics.resourceEfficiency.memoryUsage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">API Calls</h3>
                      <div className="flex items-center text-red-600">
                        {getTrendIcon(performanceMetrics.resourceEfficiency.trend.apiCalls)}
                        <span className="ml-1 text-sm">{performanceMetrics.resourceEfficiency.trend.apiCalls}</span>
                      </div>
                    </div>
                    <div className="text-3xl font-bold">{performanceMetrics.resourceEfficiency.apiCalls.toLocaleString()}</div>
                  </div>

                  <div className="bg-white rounded-lg border p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Cost Per Conversation</h3>
                      <div className="flex items-center text-green-600">
                        {getTrendIcon(performanceMetrics.resourceEfficiency.trend.costPerConversation)}
                        <span className="ml-1 text-sm">{performanceMetrics.resourceEfficiency.trend.costPerConversation}</span>
                      </div>
                    </div>
                    <div className="text-3xl font-bold">{performanceMetrics.resourceEfficiency.costPerConversation}</div>
                  </div>
                </div>

                {/* Resource usage chart placeholder */}
                <PerformanceChart 
                  title="Resource Usage Over Time" 
                  description="Monitor CPU, memory, and API call usage"
                  height={350}
                  className="mb-8"
                />

                {/* Optimization recommendations */}
                <div className="bg-white rounded-lg border p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium text-gray-900">Optimization Recommendations</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-green-50">
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Implement Response Caching</h4>
                          <p className="text-sm text-gray-600 mt-1">Cache common responses to reduce API calls and improve response times.</p>
                          <div className="mt-2">
                            <span className="text-xs text-green-700">Potential savings: 15% API calls</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 mr-3" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Optimize Knowledge Base Queries</h4>
                          <p className="text-sm text-gray-600 mt-1">Refine knowledge base search algorithms to reduce query complexity.</p>
                          <div className="mt-2">
                            <span className="text-xs text-yellow-700">Potential savings: 8% CPU usage</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 mr-3" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Implement Batch Processing</h4>
                          <p className="text-sm text-gray-600 mt-1">Process non-time-sensitive tasks in batches to reduce resource overhead.</p>
                          <div className="mt-2">
                            <span className="text-xs text-yellow-700">Potential savings: 12% memory usage</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}