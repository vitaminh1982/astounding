import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  Bot, 
  MessageSquare, 
  FileText, 
  Settings, 
  Plus, 
  Send, 
  Paperclip, 
  Eye, 
  EyeOff,
  CheckCircle,
  Clock,
  AlertTriangle,
  BarChart3,
  Target,
  Shield,
  User,
  AtSign,
  Download,
  Upload,
  Filter,
  Search,
  MoreVertical,
  Play,
  Pause,
  Loader,
  Calendar,
  TrendingUp,
  Database,
  Briefcase,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

// Types for the multi-agent system
interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'idle' | 'thinking' | 'offline';
  avatar: string;
  description: string;
  capabilities: string[];
  lastActivity: string;
  responseTime: string;
  successRate: number;
  isConfigurable: boolean;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  agentId?: string;
  timestamp: Date;
  mentions?: string[];
  attachments?: Attachment[];
  visibility: 'project' | 'team' | 'private';
  canConvertToTask?: boolean;
  canConvertToDocument?: boolean;
}

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
}

interface ProjectMetrics {
  activeAgents: number;
  totalQueries: number;
  successRate: number;
  avgResponseTime: string;
  tasksGenerated: number;
  documentsCreated: number;
}

// Mock data for the 5 specialized agents
const PROJECT_AGENTS: Agent[] = [
  {
    id: 'pm-001',
    name: 'Alex',
    role: 'Project Manager',
    status: 'active',
    avatar: '👨‍💼',
    description: 'Timeline management, milestone tracking, task assignments, project orchestration',
    capabilities: ['Timeline Management', 'Milestone Tracking', 'Task Assignment', 'Status Reporting', 'Risk Assessment'],
    lastActivity: '2 minutes ago',
    responseTime: '1.2s',
    successRate: 94.5,
    isConfigurable: true
  },
  {
    id: 'ba-001',
    name: 'Sarah',
    role: 'Business Analyst',
    status: 'active',
    avatar: '👩‍💻',
    description: 'Requirements capture, stakeholder mapping, user story creation, acceptance criteria',
    capabilities: ['Requirements Analysis', 'User Stories', 'Stakeholder Mapping', 'Process Documentation', 'Acceptance Criteria'],
    lastActivity: '5 minutes ago',
    responseTime: '1.8s',
    successRate: 92.1,
    isConfigurable: true
  },
  {
    id: 'da-001',
    name: 'Marcus',
    role: 'Data Analyst',
    status: 'idle',
    avatar: '📊',
    description: 'Dataset analysis, chart generation, KPI validation, data insights',
    capabilities: ['Data Processing', 'SQL Analysis', 'Chart Generation', 'Statistical Analysis', 'KPI Tracking'],
    lastActivity: '15 minutes ago',
    responseTime: '2.1s',
    successRate: 96.8,
    isConfigurable: true
  },
  {
    id: 'sc-001',
    name: 'Diana',
    role: 'Strategy Consultant',
    status: 'active',
    avatar: '🎯',
    description: 'Market analysis, competitive assessment, risk evaluation, strategic recommendations',
    capabilities: ['Market Research', 'Competitive Analysis', 'Strategic Planning', 'Risk Assessment', 'Business Intelligence'],
    lastActivity: '8 minutes ago',
    responseTime: '1.5s',
    successRate: 91.3,
    isConfigurable: true
  },
  {
    id: 'pmo-001',
    name: 'Robert',
    role: 'PMO Analyst',
    status: 'active',
    avatar: '📋',
    description: 'Governance tracking, resource monitoring, compliance reporting, variance analysis',
    capabilities: ['Governance Tracking', 'Resource Management', 'Compliance Monitoring', 'Variance Analysis', 'Reporting'],
    lastActivity: '1 minute ago',
    responseTime: '1.1s',
    successRate: 95.7,
    isConfigurable: true
  }
];

export default function ProjectPage() {
  // State management
  const [agents, setAgents] = useState<Agent[]>(PROJECT_AGENTS);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'chat' | 'documents'>('chat');
  const [visibility, setVisibility] = useState<'project' | 'team' | 'private'>('project');
  const [isAgentPanelOpen, setIsAgentPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showConvertModal, setShowConvertModal] = useState<{ type: 'task' | 'document', messageId: string } | null>(null);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Project metrics
  const [metrics, setMetrics] = useState<ProjectMetrics>({
    activeAgents: agents.filter(a => a.status === 'active').length,
    totalQueries: 1247,
    successRate: 94.2,
    avgResponseTime: '1.5s',
    tasksGenerated: 89,
    documentsCreated: 34
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: 'welcome-001',
      content: `Welcome to your AI Project Workspace! 🚀\n\nYour specialized team of 5 AI agents is ready to assist:\n• Alex (PM) - Project management & timelines\n• Sarah (BA) - Requirements & user stories\n• Marcus (DA) - Data analysis & insights\n• Diana (SC) - Strategy & market analysis\n• Robert (PMO) - Governance & compliance\n\nUse @mentions to direct questions to specific agents, or ask general questions for collaborative responses.`,
      sender: 'agent',
      agentId: 'system',
      timestamp: new Date(),
      visibility: 'project',
      mentions: []
    };
    setMessages([welcomeMessage]);
  }, []);

  // Agent management functions
  const toggleAgentStatus = (agentId: string) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { ...agent, status: agent.status === 'active' ? 'offline' : 'active' }
        : agent
    ));
    toast.success('Agent status updated');
  };

  const toggleAgentSelection = (agentId: string) => {
    setSelectedAgents(prev => 
      prev.includes(agentId) 
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    );
  };

  // Message handling
  const handleSendMessage = async () => {
    if (!newMessage.trim() && attachments.length === 0) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      content: newMessage,
      sender: 'user',
      timestamp: new Date(),
      mentions: extractMentions(newMessage),
      attachments: [...attachments],
      visibility,
      canConvertToTask: true,
      canConvertToDocument: true
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setAttachments([]);
    setIsLoading(true);

    // Simulate AI agent response
    setTimeout(() => {
      const mentionedAgents = userMessage.mentions || [];
      const targetAgents = mentionedAgents.length > 0 ? mentionedAgents : selectedAgents;
      
      if (targetAgents.length === 0) {
        // Multi-agent collaborative response
        const collaborativeResponse = generateCollaborativeResponse(userMessage.content);
        setMessages(prev => [...prev, collaborativeResponse]);
      } else {
        // Specific agent responses
        targetAgents.forEach((agentId, index) => {
          setTimeout(() => {
            const agent = agents.find(a => a.id === agentId);
            if (agent) {
              const agentResponse = generateAgentResponse(agent, userMessage.content);
              setMessages(prev => [...prev, agentResponse]);
            }
          }, index * 1000);
        });
      }
      
      setIsLoading(false);
    }, 1500);
  };

  // Extract @mentions from message
  const extractMentions = (content: string): string[] => {
    const mentionRegex = /@(\w+)/g;
    const mentions: string[] = [];
    let match;
    
    while ((match = mentionRegex.exec(content)) !== null) {
      const mentionedName = match[1].toLowerCase();
      const agent = agents.find(a => a.name.toLowerCase() === mentionedName);
      if (agent) {
        mentions.push(agent.id);
      }
    }
    
    return mentions;
  };

  // Generate collaborative response from multiple agents
  const generateCollaborativeResponse = (query: string): Message => {
    const responses = [
      "Based on our collective analysis, here's what we recommend...",
      "From a project management perspective, we should prioritize...",
      "The data suggests we need to focus on...",
      "Our strategic assessment indicates..."
    ];
    
    return {
      id: `msg-${Date.now()}`,
      content: responses[Math.floor(Math.random() * responses.length)],
      sender: 'agent',
      agentId: 'collaborative',
      timestamp: new Date(),
      visibility: 'project',
      mentions: [],
      canConvertToTask: true,
      canConvertToDocument: true
    };
  };

  // Generate specific agent response
  const generateAgentResponse = (agent: Agent, query: string): Message => {
    const roleResponses = {
      'Project Manager': [
        "I'll update the project timeline to reflect these changes.",
        "Let me break this down into actionable tasks with clear deadlines.",
        "Based on current progress, I recommend adjusting our milestone dates."
      ],
      'Business Analyst': [
        "I'll document these requirements and create user stories.",
        "Let me map out the stakeholder impact for this change.",
        "I'll update our acceptance criteria based on this feedback."
      ],
      'Data Analyst': [
        "I'll analyze the dataset and generate insights for you.",
        "Let me create visualizations to better understand this data.",
        "I'll run the statistical analysis and provide KPI updates."
      ],
      'Strategy Consultant': [
        "From a strategic perspective, this aligns with our market position.",
        "I'll conduct a competitive analysis to validate this approach.",
        "Let me assess the risks and opportunities for this initiative."
      ],
      'PMO Analyst': [
        "I'll track this in our governance framework and update compliance status.",
        "Let me analyze resource utilization and budget variance.",
        "I'll generate the compliance report for this change."
      ]
    };

    const responses = roleResponses[agent.role] || ["I'll help you with that request."];
    
    return {
      id: `msg-${Date.now()}-${agent.id}`,
      content: `**${agent.name} (${agent.role})**: ${responses[Math.floor(Math.random() * responses.length)]}`,
      sender: 'agent',
      agentId: agent.id,
      timestamp: new Date(),
      visibility: 'project',
      mentions: [],
      canConvertToTask: true,
      canConvertToDocument: true
    };
  };

  // File handling
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newAttachments: Attachment[] = files.map(file => ({
      id: `att-${Date.now()}-${Math.random()}`,
      name: file.name,
      type: file.type,
      size: file.size
    }));
    
    setAttachments(prev => [...prev, ...newAttachments]);
    toast.success(`${files.length} file(s) attached`);
  };

  const removeAttachment = (attachmentId: string) => {
    setAttachments(prev => prev.filter(att => att.id !== attachmentId));
  };

  // Convert message to task/document
  const handleConvertMessage = (messageId: string, type: 'task' | 'document') => {
    setShowConvertModal({ type, messageId });
  };

  const confirmConvert = () => {
    if (showConvertModal) {
      const message = messages.find(m => m.id === showConvertModal.messageId);
      if (message) {
        toast.success(`Message converted to ${showConvertModal.type} successfully`);
        // Here you would implement the actual conversion logic
      }
    }
    setShowConvertModal(null);
  };

  // Get agent status color
  const getAgentStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'idle': return 'bg-yellow-100 text-yellow-800';
      case 'thinking': return 'bg-blue-100 text-blue-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAgentStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'idle': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'thinking': return <Loader className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'offline': return <AlertTriangle className="w-4 h-4 text-gray-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Project Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">AI Project Workspace</h1>
              <p className="text-gray-600">Multi-agent collaboration for enhanced project management</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Metrics Display */}
              <div className="hidden md:flex items-center gap-4 bg-white rounded-lg px-4 py-2 border shadow-sm">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-medium">{metrics.activeAgents} Active Agents</span>
                </div>
                <div className="w-px h-4 bg-gray-300" />
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">{metrics.successRate}% Success Rate</span>
                </div>
              </div>
              
              <button
                onClick={() => setIsAgentPanelOpen(!isAgentPanelOpen)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Users className="w-4 h-4" />
                <span>Open Workspace</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Agent Management */}
          <div className={`lg:col-span-3 ${isAgentPanelOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow border">
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">AI Agents</h2>
                  <button
                    className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                    title="Manage Agents"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {agents.filter(a => a.status === 'active').length} of {agents.length} agents active
                </p>
              </div>
              
              <div className="p-4">
                <div className="space-y-3">
                  {agents.map(agent => (
                    <div
                      key={agent.id}
                      className={`p-3 rounded-lg border transition-all cursor-pointer ${
                        selectedAgents.includes(agent.id)
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => toggleAgentSelection(agent.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{agent.avatar}</span>
                          <div>
                            <h3 className="font-medium text-gray-900">{agent.name}</h3>
                            <p className="text-xs text-gray-500">{agent.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getAgentStatusIcon(agent.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAgentStatusColor(agent.status)}`}>
                            {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-600 mb-2">{agent.description}</p>
                      
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>Last: {agent.lastActivity}</span>
                        <span>{agent.successRate}% success</span>
                      </div>
                      
                      <div className="mt-2 flex flex-wrap gap-1">
                        {agent.capabilities.slice(0, 2).map(capability => (
                          <span key={capability} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {capability}
                          </span>
                        ))}
                        {agent.capabilities.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{agent.capabilities.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <button
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    onClick={() => toast.info('Agent management panel coming soon')}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Manage Agents</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Center Panel - AI Collaboration Area */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-lg shadow border h-[calc(100vh-12rem)]">
              {/* Tab Navigation */}
              <div className="border-b">
                <nav className="flex">
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 ${
                      activeTab === 'chat'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    AI Chat
                  </button>
                  <button
                    onClick={() => setActiveTab('documents')}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 ${
                      activeTab === 'documents'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    Documents
                  </button>
                </nav>
              </div>

              {activeTab === 'chat' && (
                <div className="flex flex-col h-full">
                  {/* Chat Controls */}
                  <div className="p-4 border-b bg-gray-50">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Selected Agents:</span>
                        {selectedAgents.length === 0 ? (
                          <span className="text-sm text-gray-500">All agents (collaborative mode)</span>
                        ) : (
                          <div className="flex gap-2">
                            {selectedAgents.map(agentId => {
                              const agent = agents.find(a => a.id === agentId);
                              return agent ? (
                                <span key={agentId} className="flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs">
                                  <span>{agent.avatar}</span>
                                  <span>{agent.name}</span>
                                </span>
                              ) : null;
                            })}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Visibility:</span>
                        <select
                          value={visibility}
                          onChange={(e) => setVisibility(e.target.value as any)}
                          className="text-sm border rounded-md px-2 py-1"
                        >
                          <option value="project">Project</option>
                          <option value="team">Team</option>
                          <option value="private">Private</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <AnimatePresence>
                      {messages.map(message => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] p-4 rounded-lg ${
                              message.sender === 'user'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {message.sender === 'agent' && message.agentId !== 'system' && message.agentId !== 'collaborative' && (
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">
                                  {agents.find(a => a.id === message.agentId)?.avatar}
                                </span>
                                <span className="text-xs font-medium opacity-75">
                                  {agents.find(a => a.id === message.agentId)?.name}
                                </span>
                              </div>
                            )}
                            
                            <div className="whitespace-pre-wrap">{message.content}</div>
                            
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {message.attachments.map(att => (
                                  <div key={att.id} className="flex items-center gap-2 text-xs opacity-75">
                                    <Paperclip className="w-3 h-3" />
                                    <span>{att.name}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            <div className="flex justify-between items-center mt-2 text-xs opacity-75">
                              <span>{message.timestamp.toLocaleTimeString()}</span>
                              {message.sender === 'agent' && (message.canConvertToTask || message.canConvertToDocument) && (
                                <div className="flex gap-2">
                                  {message.canConvertToTask && (
                                    <button
                                      onClick={() => handleConvertMessage(message.id, 'task')}
                                      className="px-2 py-1 bg-white bg-opacity-20 rounded text-xs hover:bg-opacity-30"
                                    >
                                      → Task
                                    </button>
                                  )}
                                  {message.canConvertToDocument && (
                                    <button
                                      onClick={() => handleConvertMessage(message.id, 'document')}
                                      className="px-2 py-1 bg-white bg-opacity-20 rounded text-xs hover:bg-opacity-30"
                                    >
                                      → Doc
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 p-4 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Loader className="w-4 h-4 animate-spin text-indigo-600" />
                            <span className="text-sm text-gray-600">AI agents are thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t">
                    {/* Attachments Preview */}
                    {attachments.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-2">
                        {attachments.map(attachment => (
                          <div key={attachment.id} className="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">{attachment.name}</span>
                            <span className="text-xs text-gray-500">({formatFileSize(attachment.size)})</span>
                            <button
                              onClick={() => removeAttachment(attachment.id)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.txt,.csv,.xlsx"
                      />
                      
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                        title="Attach files"
                      >
                        <Paperclip className="w-4 h-4" />
                      </button>
                      
                      <div className="flex-1 relative">
                        <textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          placeholder="Ask your AI agents anything... Use @Alex, @Sarah, @Marcus, @Diana, or @Robert to mention specific agents"
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                          rows={2}
                          disabled={isLoading}
                        />
                        
                        {/* @mention suggestions could be added here */}
                          <input
                            type="text"
                      
                      <button
                        onClick={handleSendMessage}
                        disabled={(!newMessage.trim() && attachments.length === 0) || isLoading}
                        className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                      <div className="flex items-center gap-4">
                        {selectedAgents.length > 0 && (
                          <span>{selectedAgents.length} agent{selectedAgents.length > 1 ? 's' : ''} selected</span>
                        )}
                        {attachments.length > 0 && (
                          <span>{attachments.length} file{attachments.length > 1 ? 's' : ''} attached</span>
                        )}
                      </div>
                      <span>Visibility: {visibility}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="p-6 h-full flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Document Management</h3>
                    <p className="text-gray-500 mb-4">
                      AI-generated documents and project artifacts will appear here
                    </p>
                    <div className="flex justify-center gap-3">
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                        Generate Document
                      </button>
                      <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                        Upload Document
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Agent Panel Overlay */}
        {isAgentPanelOpen && (
          <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold">AI Agents</h2>
                <button
                  onClick={() => setIsAgentPanelOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              {/* Agent list content would go here - same as desktop */}
            </div>
          </div>
        )}

        {/* Convert Message Modal */}
        {showConvertModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">
                Convert to {showConvertModal.type === 'task' ? 'Task' : 'Document'}
              </h3>
              <p className="text-gray-600 mb-6">
                This will create a new {showConvertModal.type} based on the AI agent's response. 
                You can edit the details after creation.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConvertModal(null)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmConvert}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Convert
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}