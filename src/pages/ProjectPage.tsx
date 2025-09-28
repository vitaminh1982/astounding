import React, { useEffect, useRef, useState } from 'react';
import {
  Users,
  Briefcase,
  Bot,
  MessageSquare,
  FileText,
  Settings,
  Paperclip,
  Send,
  BarChart3,
  Calendar,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import ProjectSwitchModal, { Project } from '../components/projects/ProjectSwitchModal';
import AgentSelectionModal, { SelectableAgent, ProjectContext } from '../components/projects/AgentSelectionModal';

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

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
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

interface ProjectMetrics {
  activeAgents: number;
  totalQueries: number;
  successRate: number;
  avgResponseTime: string;
  tasksGenerated: number;
  documentsCreated: number;
}

// Current project data
const CURRENT_PROJECT: Project = {
  id: 'proj-001',
  name: 'Digital Transformation Initiative',
  client: {
    name: 'TechCorp Solutions',
    industry: 'Technology'
  },
  status: 'active',
  progress: 65,
  startDate: '2025-01-15',
  endDate: '2025-06-30',
  teamSize: 8,
  description: 'Comprehensive digital transformation strategy and implementation',
  priority: 'high',
  budget: '€450,000',
  lastActivity: '2 hours ago'
};

// Sample agents (5 agents)
const PROJECT_AGENTS: Agent[] = [
  {
    id: 'pm-001',
    name: 'Alex',
    role: 'Project Manager',
    status: 'active',
    avatar: '🧭',
    description: 'Timeline, milestones, task orchestration',
    capabilities: ['Timeline Management', 'Task Assignment', 'Status Summaries'],
    lastActivity: '2 minutes ago',
    responseTime: '1.0s',
    successRate: 96.2,
    isConfigurable: true,
  },
  {
    id: 'ba-001',
    name: 'Sarah',
    role: 'Business Analyst',
    status: 'idle',
    avatar: '📝',
    description: 'Requirements, user stories, acceptance criteria',
    capabilities: ['Requirement Capture', 'User Stories', 'Acceptance Criteria'],
    lastActivity: '10 minutes ago',
    responseTime: '1.8s',
    successRate: 92.5,
    isConfigurable: true,
  },
  {
    id: 'da-001',
    name: 'Marcus',
    role: 'Data Analyst',
    status: 'active',
    avatar: '📊',
    description: 'Data ingestion, analysis, KPIs and visuals',
    capabilities: ['CSV Ingestion', 'Aggregation', 'Charts & Tables'],
    lastActivity: 'just now',
    responseTime: '0.9s',
    successRate: 93.7,
    isConfigurable: true,
  },
  {
    id: 'sc-001',
    name: 'Diana',
    role: 'Strategy Consultant',
    status: 'active',
    avatar: '🎯',
    description: 'Market analysis, strategic recommendations',
    capabilities: ['Market Research', 'Competitive Analysis', 'Strategy'],
    lastActivity: '8 minutes ago',
    responseTime: '1.5s',
    successRate: 91.3,
    isConfigurable: true,
  },
  {
    id: 'pmo-001',
    name: 'Robert',
    role: 'PMO Analyst',
    status: 'active',
    avatar: '📋',
    description: 'Governance, resource monitoring, reporting',
    capabilities: ['Governance', 'Resource Monitoring', 'Reporting'],
    lastActivity: '1 minute ago',
    responseTime: '1.1s',
    successRate: 95.7,
    isConfigurable: true,
  },
];

export default function ProjectPage(): JSX.Element {
  // State management
  const [agents, setAgents] = useState<Agent[]>(PROJECT_AGENTS);
  const [currentProject, setCurrentProject] = useState<Project>(CURRENT_PROJECT);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: `sys-${Date.now()}`,
      content: `Welcome to your AI Project Workspace! 🚀\n\nProject: ${currentProject.name}\nClient: ${currentProject.client.name}\n\nYour specialized team of 5 AI agents is ready to assist:\n• Alex (PM) - Project management & timelines\n• Sarah (BA) - Requirements & user stories\n• Marcus (DA) - Data analysis & insights\n• Diana (SC) - Strategy & market analysis\n• Robert (PMO) - Governance & compliance\n\nUse @mentions to direct questions to specific agents, or ask general questions for collaborative responses.`,
      sender: 'agent',
      agentId: 'collaborative',
      timestamp: new Date(),
      visibility: 'project',
      canConvertToTask: false,
      canConvertToDocument: false,
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'chat' | 'documents'>('chat');
  const [visibility, setVisibility] = useState<'project' | 'team' | 'private'>('project');
  const [isAgentPanelOpen, setIsAgentPanelOpen] = useState(true);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>(
    PROJECT_AGENTS.map(agent => agent.id) // Initially select all current agents
  );
  const [metrics, setMetrics] = useState<ProjectMetrics>({
    activeAgents: PROJECT_AGENTS.filter((a) => a.status === 'active').length,
    totalQueries: 1247,
    successRate: 94.2,
    avgResponseTime: '1.5s',
    tasksGenerated: 89,
    documentsCreated: 34,
  });

  // Refs
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Toggle agent selection
  const toggleAgentSelection = (agentId: string) => {
    setSelectedAgents((prev) => {
      if (prev.includes(agentId)) return prev.filter((id) => id !== agentId);
      return [...prev, agentId];
    });
  };

  // Extract @mentions from message
  const extractMentions = (content: string): string[] => {
    const mentionRegex = /@(\w+)/g;
    const mentions: string[] = [];
    let match: RegExpExecArray | null;

    while ((match = mentionRegex.exec(content)) !== null) {
      const mentionedName = match[1].toLowerCase();
      const agent = agents.find((a) => a.name.toLowerCase() === mentionedName);
      if (agent) {
        mentions.push(agent.id);
      }
    }

    return mentions;
  };

  // Simulate agent-specific response
  const createAgentResponse = (agent: Agent, query: string): Message => {
    const roleResponses: Record<string, string[]> = {
      'Project Manager': [
        'From a project management perspective, I recommend focusing on the next milestone.',
        'I can update the timeline and create tasks if you confirm.',
      ],
      'Business Analyst': [
        'I captured the requirement: we should translate this into user stories.',
        'Suggested acceptance criteria: ...',
      ],
      'Data Analyst': [
        'I can run a quick aggregation on the provided dataset and return a summary.',
        'Preliminary insight: the KPI increased by 12% month-over-month.',
      ],
      'Strategy Consultant': [
        'Market trend indicates a shift towards ...',
        'Recommended strategic option: pursue a pilot in this segment.',
      ],
      'PMO Analyst': [
        'Governance check: resource allocation variance is 8% vs baseline.',
        'I can create a PMO report and share it.',
      ],
    };

    const responses = roleResponses[agent.role] || ["I'll help you with that request."];
    const content = `${responses[Math.floor(Math.random() * responses.length)]}`;

    return {
      id: `msg-${Date.now()}-${agent.id}`,
      content: `**${agent.name} (${agent.role})**: ${content}`,
      sender: 'agent',
      agentId: agent.id,
      timestamp: new Date(),
      visibility: 'project',
      mentions: [],
      canConvertToTask: true,
      canConvertToDocument: true,
    };
  };

  // Generate collaborative response (all selected or all)
  const generateCollaborativeResponse = (query: string): Message => {
    const responses = [
      "Based on our collective analysis, here's what we recommend...",
      "From a project management perspective, we should prioritize the next milestone.",
      "The data suggests we need to focus on the top 3 drivers.",
      "Our strategic assessment indicates opportunity in the new segment.",
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
      canConvertToDocument: true,
    };
  };

  // Send message (user) -> triggers agent responses (simulated)
  const handleSendMessage = () => {
    const trimmed = newMessage.trim();
    if (!trimmed && attachments.length === 0) return;

    const mentions = extractMentions(trimmed);

    const userMsg: Message = {
      id: `msg-${Date.now()}-user`,
      content: trimmed,
      sender: 'user',
      timestamp: new Date(),
      mentions,
      attachments: attachments.length ? attachments : undefined,
      visibility,
      canConvertToTask: false,
      canConvertToDocument: false,
    };

    setMessages((prev) => [...prev, userMsg]);
    setNewMessage('');
    setAttachments([]);

    // Simulate "thinking" state for chosen agents and then add responses
    const targetAgentIds = selectedAgents.length > 0 ? selectedAgents : agents.map((a) => a.id);

    // Mark selected agents as thinking briefly
    setAgents((prev) =>
      prev.map((a) => (targetAgentIds.includes(a.id) ? { ...a, status: 'thinking' } : a)),
    );

    setTimeout(() => {
      const responses: Message[] =
        selectedAgents.length === 0
          ? [generateCollaborativeResponse(trimmed)]
          : targetAgentIds
              .map((id) => agents.find((a) => a.id === id))
              .filter(Boolean)
              .map((a) => createAgentResponse(a as Agent, trimmed));

      setMessages((prev) => [...prev, ...responses]);
      setAgents((prev) =>
        prev.map((a) => (targetAgentIds.includes(a.id) ? { ...a, status: 'active' } : a)),
      );

      // Update metrics (demo)
      setMetrics((m) => ({
        ...m,
        totalQueries: m.totalQueries + 1,
        activeAgents: agents.filter((a) => a.status === 'active').length,
      }));
    }, 800); // simulated latency
  };

  // File handling
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;
    const newAttachments: Attachment[] = files.map((file) => ({
      id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      name: file.name,
      type: file.type,
      size: file.size,
    }));

    setAttachments((prev) => [...prev, ...newAttachments]);
    toast.success(`${files.length} file(s) attached`);
    // Clear the input so same file can be reselected if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (attachmentId: string) => {
    setAttachments((prev) => prev.filter((att) => att.id !== attachmentId));
  };

  // Convert message to task/document (simple stub)
  const [showConvertModal, setShowConvertModal] = useState<{ type: 'task' | 'document'; messageId: string } | null>(null);

  // Handle project switching
  const handleProjectSwitch = (newProject: Project) => {
    setCurrentProject(newProject);
    
    // Update welcome message with new project info
    const welcomeMessage = {
      id: `sys-${Date.now()}`,
      content: `Switched to project: ${newProject.name} 🔄\n\nClient: ${newProject.client.name}\nStatus: ${newProject.status}\nProgress: ${newProject.progress}%\n\nYour AI team is now ready to assist with this project. How can we help you today?`,
      sender: 'agent',
      agentId: 'collaborative',
      timestamp: new Date(),
      visibility: 'project',
      canConvertToTask: false,
      canConvertToDocument: false,
    };
    
    setMessages([welcomeMessage]);
    setSelectedAgents([]);
    
    toast(`Switched to project: ${newProject.name}`, {
      icon: '🔄'
    });
    
    // Reset agent selection when switching projects
    setSelectedAgentIds(PROJECT_AGENTS.map(agent => agent.id));
  };

  // Handle agent selection update
  const handleAgentsUpdate = (newAgentIds: string[]) => {
    setSelectedAgentIds(newAgentIds);
    
    // Update the agents list to reflect the new selection
    // In a real implementation, this would fetch the selected agents from an API
    const updatedAgents = PROJECT_AGENTS.filter(agent => newAgentIds.includes(agent.id));
    setAgents(updatedAgents);
    
    // Update metrics
    setMetrics(prev => ({
      ...prev,
      activeAgents: updatedAgents.filter(a => a.status === 'active').length
    }));
    
    // Add system message about agent team update
    const agentNames = updatedAgents.map(agent => `${agent.name} (${agent.role})`).join(', ');
    const systemMessage: Message = {
      id: `sys-${Date.now()}`,
      content: `Agent team updated! 🤖\n\nActive agents: ${agentNames}\n\nYour new AI team is ready to assist with ${currentProject.name}.`,
      sender: 'agent',
      agentId: 'system',
      timestamp: new Date(),
      visibility: 'project',
      canConvertToTask: false,
      canConvertToDocument: false,
    };
    
    setMessages(prev => [...prev, systemMessage]);
  };

  // Create project context for agent filtering
  const projectContext: ProjectContext = {
    id: currentProject.id,
    name: currentProject.name,
    client: currentProject.client
  };

  const handleConvertMessage = (messageId: string, type: 'task' | 'document') => {
    setShowConvertModal({ type, messageId });
  };

  const confirmConvert = () => {
    if (!showConvertModal) return;
    toast.success(`${showConvertModal.type === 'task' ? 'Task' : 'Document'} created (demo)`);
    setShowConvertModal(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // UI Helpers
  const getAgentStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'idle':
        return 'bg-gray-100 text-gray-700';
      case 'thinking':
        return 'bg-yellow-100 text-yellow-800';
      case 'offline':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{currentProject.name}</h1>
            <p className="text-gray-600">{currentProject.client.name} • {currentProject.client.industry}</p>
          </div>

          <div className="flex items-center gap-4">
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
              onClick={() => setIsAgentPanelOpen((s) => !s)}
              onClick={() => setIsProjectModalOpen(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Briefcase className="w-4 h-4" />
              <span>Switch Project</span>
            </button>
            
          </div>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Agent Management */}
          <div className={`lg:col-span-3 ${isAgentPanelOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow border overflow-hidden">
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">{currentProject.name}</h2>
                  <button
                    className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                    title="Manage Projects"
                    onClick={() => toast('Project management panel coming soon', { icon: '⚙️' })}
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {agents.filter((a) => a.status === 'active').length} of {agents.length} AI agents active
                </p>
              </div>

              <div className="p-4">
                <div className="space-y-3">
                  {agents.map((agent) => (
                    <div
                      key={agent.id}
                      onClick={() => toggleAgentSelection(agent.id)}
                      className={`p-3 rounded-lg border transition-all cursor-pointer ${
                        selectedAgents.includes(agent.id)
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
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
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAgentStatusColor(agent.status)}`}>
                            {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-1">
                        {agent.capabilities.slice(0, 2).map((capability) => (
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
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                    onClick={() => setIsAgentModalOpen(true)}
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
            {/* Panel with sticky input + scroller */}
            <div className="bg-white rounded-lg shadow border h-[calc(100vh-14rem)] flex flex-col overflow-hidden">
              {/* Tab Navigation */}
              <div className="border-b">
                <nav className="flex">
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 ${
                      activeTab === 'chat' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    AI Chat
                  </button>
                  <button
                    onClick={() => setActiveTab('documents')}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 ${
                      activeTab === 'documents' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    Documents
                  </button>
                </nav>
              </div>

              {activeTab === 'chat' && (
                <>
                  {/* Chat controls (selected agents, visibility) */}
                  <div className="p-4 border-b bg-gray-50">
                    <div className="flex flex-wrap items-center gap-4 justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Selected Agents:</span>
                        {selectedAgents.length === 0 ? (
                          <span className="text-sm text-gray-500">All agents (collaborative mode)</span>
                        ) : (
                          <div className="flex gap-2">
                            {selectedAgents.map((agentId) => {
                              const agent = agents.find((a) => a.id === agentId);
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
                          aria-label="Message visibility"
                        >
                          <option value="project">Project</option>
                          <option value="team">Team</option>
                          <option value="private">Private</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Messages area (scrollable) */}
                  <div className="flex-1 overflow-y-auto p-6 pb-28">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div key={message.id} className="max-w-3xl">
                          <div className="bg-gray-100 rounded-lg p-6 shadow-sm">
                            {message.sender === 'agent' && (
                              <div className="text-xs text-gray-500 mb-2">{/* Agent badge if needed */}</div>
                            )}
                            <div className="whitespace-pre-wrap text-gray-800">{message.content}</div>

                            {message.attachments && message.attachments.length > 0 && (
                              <div className="mt-3 space-y-1">
                                {message.attachments.map((att) => (
                                  <div key={att.id} className="flex items-center gap-2 text-xs opacity-85">
                                    <Paperclip className="w-3 h-3" />
                                    <span>{att.name}</span>
                                    <span className="ml-2 text-gray-400">({formatFileSize(att.size)})</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                              <span>{message.timestamp.toLocaleTimeString()}</span>

                              {message.sender === 'agent' && (message.canConvertToTask || message.canConvertToDocument) && (
                                <div className="flex gap-2">
                                  {message.canConvertToTask && (
                                    <button
                                      onClick={() => handleConvertMessage(message.id, 'task')}
                                      className="text-xs text-indigo-600 hover:underline"
                                    >
                                      Convert to task
                                    </button>
                                  )}
                                  {message.canConvertToDocument && (
                                    <button
                                      onClick={() => handleConvertMessage(message.id, 'document')}
                                      className="text-xs text-indigo-600 hover:underline"
                                    >
                                      Convert to document
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </div>

                  {/* Sticky input (inside same rounded panel) */}
                  <div className="sticky bottom-0 bg-white border-t px-4 py-3">
                    <div className="flex items-center gap-3 max-w-4xl mx-auto">
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.png,.jpg"
                        aria-hidden
                      />

                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-50"
                        title="Attach files"
                      >
                        <Paperclip className="w-5 h-5" />
                      </button>

                      <div className="flex-1">
                        <textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          placeholder="Ask your AI agents anything..."
                          className="w-full resize-none h-12 px-3 py-2 border rounded-md focus:outline-none placeholder-gray-500"
                          aria-label="Message input"
                        />
                        {/* Attachment preview */}
                        {attachments.length > 0 && (
                          <div className="mt-2 flex gap-2 items-center">
                            {attachments.map((att) => (
                              <div
                                key={att.id}
                                className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-md text-xs border"
                              >
                                <span>{att.name}</span>
                                <button
                                  onClick={() => removeAttachment(att.id)}
                                  className="text-gray-400 hover:text-gray-700 ml-2"
                                  aria-label={`Remove ${att.name}`}
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={handleSendMessage}
                        className="ml-2 inline-flex items-center justify-center w-12 h-12 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                        aria-label="Send message"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'documents' && (
                <div className="p-6 h-full flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Document Management</h3>
                    <p className="text-gray-500 mb-4">AI-generated documents and project artifacts will appear here.</p>
                    <div className="flex justify-center gap-3">
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Generate Document</button>
                      <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">Upload Document</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Convert Message Modal */}
        {showConvertModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">
                Convert to {showConvertModal.type === 'task' ? 'Task' : 'Document'}
              </h3>
              <p className="text-gray-600 mb-6">
                This will create a new {showConvertModal.type} based on the AI agent&apos;s response. You can edit the details
                after creation.
              </p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowConvertModal(null)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button onClick={confirmConvert} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  Convert
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Project Switch Modal */}
      <ProjectSwitchModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        currentProjectId={currentProject.id}
        onProjectSelect={handleProjectSwitch}
      />

      {/* Agent Selection Modal */}
      <AgentSelectionModal
        isOpen={isAgentModalOpen}
        onClose={() => setIsAgentModalOpen(false)}
        currentProject={projectContext}
        selectedAgentIds={selectedAgentIds}
        onAgentsUpdate={handleAgentsUpdate}
        maxAgents={5}
      />
    </div>
  );
}
