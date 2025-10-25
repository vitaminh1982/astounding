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
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCollaborationTypeColor = (type: string) => {
    switch (type) {
      case 'human-handoff': return 'bg-blue-100 text-blue-800';
      case 'human-oversight': return 'bg-purple-100 text-purple-800';
      case 'expert-collaboration': return 'bg-orange-100 text-orange-800';
      case 'inter-agent': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header with breadcrumb */}
        <div className="mb-6">
         
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Collaboration & Hand-off</h1>
              <p className="text-gray-600">Human-AI and inter-agent coordination</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white hover:bg-gray-50">
                <Settings className="w-4 h-4" />
                Configure
              </button>
              <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                <Plus className="w-4 h-4" />
                New Collaboration Point
              </button>
            </div>
          </div>
        </div>

        {/* Collaboration overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Collaboration Points</p>
                <p className="text-2xl font-bold text-teal-600">15</p>
              </div>
              <Share2 className="w-8 h-8 text-teal-500" />
            </div>
            <div className="mt-2 text-xs text-green-600">All operational</div>
          </div>
          <div className="bg-white rounded-lg p-4 border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Daily Handoffs</p>
                <p className="text-2xl font-bold text-blue-600">77</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <div className="mt-2 text-xs text-green-600">+12 from yesterday</div>
          </div>
          <div className="bg-white rounded-lg p-4 border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg Handoff Time</p>
                <p className="text-2xl font-bold text-purple-600">2.1min</p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
            <div className="mt-2 text-xs text-green-600">-0.5min improvement</div>
          </div>
          <div className="bg-white rounded-lg p-4 border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Success Rate</p>
                <p className="text-2xl font-bold text-green-600">95.2%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <div className="mt-2 text-xs text-green-600">+1.8% this week</div>
          </div>
        </div>

        {/* Main content */}
        <div className="bg-white rounded-lg shadow">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {[
                { key: 'collaboration-points', label: 'Collaboration Points', icon: Share2 },
                { key: 'communication', label: 'Communication Channels', icon: MessageSquare },
                { key: 'protocols', label: 'Protocols & Standards', icon: Settings }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`py-4 px-6 text-sm font-medium flex items-center gap-2 ${
                    activeTab === key
                      ? 'border-b-2 border-indigo-500 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Search and filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab === 'collaboration-points' ? 'collaboration points' : activeTab === 'communication' ? 'channels' : 'protocols'}...`}
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
            {activeTab === 'collaboration-points' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredCollaborationPoints.map((point) => (
                    <div key={point.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${getCollaborationTypeColor(point.type)}`}>
                            {getCollaborationTypeIcon(point.type)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{point.name}</h3>
                            <p className="text-sm text-gray-500">{point.description}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(point.status)}`}>
                          {point.status.charAt(0).toUpperCase() + point.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Trigger Conditions</h4>
                          <div className="flex flex-wrap gap-2">
                            {point.triggerConditions.map((condition, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                {condition}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                          <div className="text-center">
                            <p className="text-sm font-bold text-blue-600">{point.dailyHandoffs}</p>
                            <p className="text-xs text-gray-500">Daily Handoffs</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-bold text-purple-600">{point.avgHandoffTime}</p>
                            <p className="text-xs text-gray-500">Avg Time</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-bold text-green-600">{point.successRate}%</p>
                            <p className="text-xs text-gray-500">Success Rate</p>
                          </div>
                        </div>

                        <div className="pt-2">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-gray-500">AI Agents:</span>
                            <span className="text-xs text-gray-500">Human Agents:</span>
                          </div>
                          <div className="flex justify-between">
                            <div className="flex flex-wrap gap-1">
                              {point.agents.map((agent, index) => (
                                <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                                  {agent}
                                </span>
                              ))}
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {point.humanAgents.length > 0 ? point.humanAgents.map((human, index) => (
                                <span key={index} className="px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded-full">
                                  {human}
                                </span>
                              )) : (
                                <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                                  Automated
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                        <button className="p-2 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-indigo-50" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-indigo-50" title="Configure">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 rounded-full hover:bg-green-50" title="Monitor">
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
                    <div key={channel.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{channel.name}</h3>
                          <p className="text-sm text-gray-500">{channel.type}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(channel.status)}`}>
                          {channel.status.charAt(0).toUpperCase() + channel.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-lg font-bold text-indigo-600">{channel.participants}</p>
                          <p className="text-xs text-gray-500">Participants</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-green-600">{channel.messagesPerDay}</p>
                          <p className="text-xs text-gray-500">Messages/Day</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-purple-600">{channel.responseTime}</p>
                          <p className="text-xs text-gray-500">Avg Response</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                        <button className="p-2 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-indigo-50" title="View Channel">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-indigo-50" title="Configure">
                          <Settings className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 rounded-full hover:bg-green-50" title="Monitor">
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
                  <Network className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Communication Protocols & Standards</h3>
                  <p className="text-gray-500 mb-4">Define and manage communication standards between agents and humans</p>
                  <div className="flex justify-center gap-3">
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                      Configure Protocols
                    </button>
                    <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                      View Standards
                    </button>
                  </div>
                </div>

                {/* Protocol overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 rounded-lg p-6 border">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-blue-900">Communication Standards</h4>
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-3xl font-bold text-blue-600">8</p>
                    <p className="text-sm text-blue-700 mt-2">Active protocols</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-6 border">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-green-900">Compliance Rate</h4>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-3xl font-bold text-green-600">98.7%</p>
                    <p className="text-sm text-green-700 mt-2">Protocol adherence</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-6 border">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-purple-900">Integration Points</h4>
                      <Network className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-3xl font-bold text-purple-600">23</p>
                    <p className="text-sm text-purple-700 mt-2">Active connections</p>
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