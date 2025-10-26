import React, { useState } from 'react';
import { 
  Share2, 
  Users, 
  MessageSquare, 
  ArrowLeft,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Settings,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  Bot,
  User,
  Network,
  Zap,
  Bell,
  GitBranch
} from 'lucide-react';
import { Page } from '../../App';

interface CollaborationPageProps {
  onNavigate: (page: Page) => void;
}

// Mock data for collaboration points
const collaborationPoints = [
  {
    id: 'collab-001',
    name: 'Customer Escalation Point',
    type: 'human-handoff',
    description: 'Seamless handoff from AI to human agent when complex issues arise',
    status: 'active',
    agents: ['Customer Support 24/7'],
    humanAgents: ['Sarah Johnson', 'Mike Chen'],
    triggerConditions: ['Confidence < 80%', 'Customer requests human', 'Complex technical issue'],
    dailyHandoffs: 23,
    avgHandoffTime: '45s',
    successRate: 96.8
  },
  {
    id: 'collab-002',
    name: 'Sales Qualification Review',
    type: 'human-oversight',
    description: 'Human review of AI-qualified leads before advancing to sales team',
    status: 'active',
    agents: ['Sales Assistant'],
    humanAgents: ['Jennifer Lopez', 'David Kim'],
    triggerConditions: ['High-value lead detected', 'Enterprise prospect', 'Custom requirements'],
    dailyHandoffs: 12,
    avgHandoffTime: '2.3min',
    successRate: 94.2
  },
  {
    id: 'collab-003',
    name: 'Technical Expert Consultation',
    type: 'expert-collaboration',
    description: 'AI agent collaborates with technical experts for complex problem solving',
    status: 'active',
    agents: ['Technical Assistant'],
    humanAgents: ['Alex Rodriguez', 'Emma Thompson'],
    triggerConditions: ['Advanced technical query', 'System integration issue', 'Custom development'],
    dailyHandoffs: 8,
    avgHandoffTime: '5.7min',
    successRate: 91.5
  },
  {
    id: 'collab-004',
    name: 'Multi-Agent Coordination',
    type: 'inter-agent',
    description: 'Coordination between multiple AI agents for complex workflows',
    status: 'active',
    agents: ['Customer Support 24/7', 'Sales Assistant', 'Technical Assistant'],
    humanAgents: [],
    triggerConditions: ['Cross-functional request', 'Multi-step workflow', 'Data sharing required'],
    dailyHandoffs: 34,
    avgHandoffTime: '1.2min',
    successRate: 98.1
  }
];

// Mock data for communication channels
const communicationChannels = [
  {
    id: 'channel-001',
    name: 'Support Escalation Channel',
    type: 'Slack Integration',
    status: 'active',
    participants: 15,
    messagesPerDay: 156,
    responseTime: '3.2min'
  },
  {
    id: 'channel-002',
    name: 'Sales Coordination Channel',
    type: 'Microsoft Teams',
    status: 'active',
    participants: 8,
    messagesPerDay: 89,
    responseTime: '1.8min'
  },
  {
    id: 'channel-003',
    name: 'Technical Expert Network',
    type: 'Internal Chat',
    status: 'active',
    participants: 12,
    messagesPerDay: 67,
    responseTime: '4.5min'
  },
  {
    id: 'channel-004',
    name: 'AI Agent Coordination',
    type: 'API Communication',
    status: 'active',
    participants: 6,
    messagesPerDay: 1247,
    responseTime: '0.2s'
  }
];

export default function CollaborationPage({ onNavigate }: CollaborationPageProps) {
  const [activeTab, setActiveTab] = useState<'collaboration-points' | 'communication' | 'protocols'>('collaboration-points');
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'inactive': return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
      case 'error': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  const getCollaborationTypeColor = (type: string) => {
    switch (type) {
      case 'human-handoff': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'human-oversight': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300';
      case 'expert-collaboration': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300';
      case 'inter-agent': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  const getCollaborationTypeIcon = (type: string) => {
    switch (type) {
      case 'human-handoff': return <User className="w-5 h-5" />;
      case 'human-oversight': return <Eye className="w-5 h-5" />;
      case 'expert-collaboration': return <Users className="w-5 h-5" />;
      case 'inter-agent': return <Bot className="w-5 h-5" />;
      default: return <Share2 className="w-5 h-5" />;
    }
  };

  const filteredCollaborationPoints = collaborationPoints.filter(point =>
    point.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    point.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    point.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredChannels = communicationChannels.filter(channel =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    channel.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header with breadcrumb */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors">Collaboration & Hand-off</h1>
              <p className="text-gray-600 dark:text-gray-400 transition-colors">Human-AI and inter-agent coordination</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors">
                <Settings className="w-4 h-4" />
                Configure
              </button>
              <button className="flex items-center gap-2 bg-indigo-600 dark:bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-teal-700 transition-colors shadow-sm dark:shadow-gray-900">
                <Plus className="w-4 h-4" />
                New Collaboration Point
              </button>
            </div>
          </div>
        </div>

        {/* Collaboration overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600 shadow-sm dark:shadow-gray-900 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Active Collaboration Points</p>
                <p className="text-2xl font-bold text-teal-600 dark:text-teal-400 transition-colors">15</p>
              </div>
              <Share2 className="w-8 h-8 text-teal-500" />
            </div>
            <div className="mt-2 text-xs text-green-600 dark:text-green-400 transition-colors">All operational</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600 shadow-sm dark:shadow-gray-900 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Daily Handoffs</p>
                <p className="text-2xl font-bold text-blue-600">77</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <div className="mt-2 text-xs text-green-600 dark:text-green-400 transition-colors">+12 from yesterday</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600 shadow-sm dark:shadow-gray-900 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Avg Handoff Time</p>
                <p className="text-2xl font-bold text-purple-600">2.1min</p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
            <div className="mt-2 text-xs text-green-600 dark:text-green-400 transition-colors">-0.5min improvement</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600 shadow-sm dark:shadow-gray-900 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Success Rate</p>
                <p className="text-2xl font-bold text-green-600">95.2%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <div className="mt-2 text-xs text-green-600 dark:text-green-400 transition-colors">+1.8% this week</div>
          </div>
        </div>

        {/* Main content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900 border border-gray-200 dark:border-gray-600 transition-colors">
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-600 transition-colors">
            <nav className="flex -mb-px">
              {[
                { key: 'collaboration-points', label: 'Collaboration Points', icon: Share2 },
                { key: 'communication', label: 'Communication Channels', icon: MessageSquare },
                { key: 'protocols', label: 'Protocols & Standards', icon: Settings }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`py-4 px-6 text-sm font-medium flex items-center gap-2 transition-colors ${
                    activeTab === key
                      ? 'border-b-2 border-teal-500 dark:border-teal-400 text-teal-600 dark:text-teal-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Search and filters */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-600 transition-colors">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab === 'collaboration-points' ? 'collaboration points' : activeTab === 'communication' ? 'channels' : 'protocols'}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-teal-500 dark:focus:border-teal-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors">
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Content based on active tab */}
          <div className="p-6">
            {activeTab === 'collaboration-points' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredCollaborationPoints.map((point) => (
                    <div key={point.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-6 hover:shadow-md dark:hover:shadow-gray-800 transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg transition-colors ${getCollaborationTypeColor(point.type)}`}>
                            {getCollaborationTypeIcon(point.type)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 transition-colors">{point.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">{point.description}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${getStatusColor(point.status)}`}>
                          {point.status.charAt(0).toUpperCase() + point.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 transition-colors">Trigger Conditions</h4>
                          <div className="flex flex-wrap gap-2">
                            {point.triggerConditions.map((condition, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full transition-colors">
                                {condition}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-200 dark:border-gray-600 transition-colors">
                          <div className="text-center">
                            <p className="text-sm font-bold text-blue-600">{point.dailyHandoffs}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">Daily Handoffs</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-bold text-purple-600">{point.avgHandoffTime}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">Avg Time</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-bold text-green-600">{point.successRate}%</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">Success Rate</p>
                          </div>
                        </div>

                        <div className="pt-2">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors">AI Agents:</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors">Human Agents:</span>
                          </div>
                          <div className="flex justify-between">
                            <div className="flex flex-wrap gap-1">
                              {point.agents.map((agent, index) => (
                                <span key={index} className="px-2 py-1 bg-indigo-100 dark:bg-teal-900/30 text-indigo-700 dark:text-teal-300 text-xs rounded-full transition-colors">
                                  {agent}
                                </span>
                              ))}
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {point.humanAgents.length > 0 ? point.humanAgents.map((human, index) => (
                                <span key={index} className="px-2 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs rounded-full transition-colors">
                                  {human}
                                </span>
                              )) : (
                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded-full transition-colors">
                                  Automated
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 transition-colors">
                        <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 rounded-full hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 rounded-full hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors" title="Configure">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400 rounded-full hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors" title="Monitor">
                          <Activity className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'communication' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredChannels.map((channel) => (
                    <div key={channel.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-6 hover:shadow-md dark:hover:shadow-gray-800 transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 transition-colors">{channel.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">{channel.type}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${getStatusColor(channel.status)}`}>
                          {channel.status.charAt(0).toUpperCase() + channel.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-lg font-bold text-indigo-600">{channel.participants}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">Participants</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-green-600">{channel.messagesPerDay}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">Messages/Day</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-purple-600">{channel.responseTime}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">Avg Response</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 transition-colors">
                        <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 rounded-full hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors" title="View Channel">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 rounded-full hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors" title="Configure">
                          <Settings className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400 rounded-full hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors" title="Monitor">
                          <Activity className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'protocols' && (
              <div className="space-y-6">
                <div className="text-center py-8">
                  <Network className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4 transition-colors" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 transition-colors">Communication Protocols & Standards</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4 transition-colors">Define and manage communication standards between agents and humans</p>
                  <div className="flex justify-center gap-3">
                    <button className="px-4 py-2 bg-teal-600 dark:bg-teal-500 text-white rounded-lg hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors">
                      Configure Protocols
                    </button>
                    <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors">
                      View Standards
                    </button>
                  </div>
                </div>

                {/* Protocol overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6 border border-blue-200 dark:border-blue-600 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-blue-900 dark:text-blue-300 transition-colors">Communication Standards</h4>
                      <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 transition-colors">8</p>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-2 transition-colors">Active protocols</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-6 border border-green-200 dark:border-green-600 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-green-900 dark:text-green-300 transition-colors">Compliance Rate</h4>
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400 transition-colors">98.7%</p>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-2 transition-colors">Protocol adherence</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-6 border border-purple-200 dark:border-purple-600 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-purple-900 dark:text-purple-300 transition-colors">Integration Points</h4>
                      <Network className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 transition-colors">23</p>
                    <p className="text-sm text-purple-700 dark:text-purple-300 mt-2 transition-colors">Active connections</p>
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
