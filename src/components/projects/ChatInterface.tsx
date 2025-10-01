import React, { useRef, useEffect } from 'react';
import { MessageSquare, FileText, Paperclip, Send, CheckSquare, Clock, Play, RotateCcw, Search, Filter, Eye, Calendar, User, Bot, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

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

interface Task {
  id: string;
  name: string;
  description: string;
  assignedAgent: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
  priority: 'low' | 'medium' | 'high';
  estimatedDuration?: string;
}

interface ChatSession {
  id: string;
  agentName: string;
  timestamp: Date;
  summary: string;
  messageCount: number;
  duration: string;
  isAutonomous: boolean;
  status: 'active' | 'completed' | 'interrupted';
  messages: Message[];
}

interface ChatInterfaceProps {
  activeTab: 'chat' | 'documents' | 'tasks' | 'history';
  setActiveTab: (tab: 'chat' | 'documents' | 'tasks' | 'history') => void;
  selectedAgents: string[];
  agents: Agent[];
  visibility: 'project' | 'team' | 'private';
  setVisibility: (visibility: 'project' | 'team' | 'private') => void;
  messages: Message[];
  newMessage: string;
  setNewMessage: (message: string) => void;
  attachments: Attachment[];
  onSendMessage: () => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveAttachment: (attachmentId: string) => void;
  onConvertMessage: (messageId: string, type: 'task' | 'document') => void;
  formatFileSize: (bytes: number) => string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  activeTab,
  setActiveTab,
  selectedAgents,
  agents,
  visibility,
  setVisibility,
  messages,
  newMessage,
  setNewMessage,
  attachments,
  onSendMessage,
  onFileUpload,
  onRemoveAttachment,
  onConvertMessage,
  formatFileSize
}) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  // State for Tasks tab
  const [tasks, setTasks] = React.useState<Task[]>([
    {
      id: 'task-001',
      name: 'Market Analysis Report',
      description: 'Analyze current market trends and competitive landscape for Q1 2025',
      assignedAgent: 'Shiryu',
      status: 'completed',
      createdAt: new Date('2025-01-15T09:00:00'),
      completedAt: new Date('2025-01-18T14:30:00'),
      priority: 'high',
      estimatedDuration: '3 days'
    },
    {
      id: 'task-002',
      name: 'Requirements Documentation',
      description: 'Document functional and non-functional requirements for the digital transformation',
      assignedAgent: 'Ikki',
      status: 'in-progress',
      createdAt: new Date('2025-01-16T10:15:00'),
      priority: 'high',
      estimatedDuration: '2 days'
    },
    {
      id: 'task-003',
      name: 'Timeline Optimization',
      description: 'Review and optimize project timeline based on current progress',
      assignedAgent: 'Seiya',
      status: 'pending',
      createdAt: new Date('2025-01-20T11:00:00'),
      priority: 'medium',
      estimatedDuration: '1 day'
    },
    {
      id: 'task-004',
      name: 'Risk Assessment',
      description: 'Identify and assess potential project risks and mitigation strategies',
      assignedAgent: 'Hyôga',
      status: 'failed',
      createdAt: new Date('2025-01-17T13:45:00'),
      priority: 'medium',
      estimatedDuration: '2 days'
    },
    {
      id: 'task-005',
      name: 'Compliance Review',
      description: 'Review project deliverables for compliance with industry standards',
      assignedAgent: 'Shun',
      status: 'completed',
      createdAt: new Date('2025-01-19T08:30:00'),
      completedAt: new Date('2025-01-21T16:00:00'),
      priority: 'low',
      estimatedDuration: '1 day'
    }
  ]);
  
  const [taskFilter, setTaskFilter] = React.useState<{
    agent: string;
    status: string;
    search: string;
  }>({
    agent: 'all',
    status: 'all',
    search: ''
  });
  
  // State for History tab
  const [chatSessions, setChatSessions] = React.useState<ChatSession[]>([
    {
      id: 'session-001',
      agentName: 'Seiya',
      timestamp: new Date('2025-01-21T14:30:00'),
      summary: 'Discussed project timeline adjustments and milestone priorities',
      messageCount: 12,
      duration: '8 minutes',
      isAutonomous: false,
      status: 'completed',
      messages: [
        {
          id: 'msg-001',
          content: 'Can you review the current project timeline?',
          sender: 'user',
          timestamp: new Date('2025-01-21T14:30:00'),
          visibility: 'project'
        },
        {
          id: 'msg-002',
          content: 'I\'ve analyzed the timeline. We\'re currently 2 days ahead of schedule on the requirements phase.',
          sender: 'agent',
          agentId: 'pm-001',
          timestamp: new Date('2025-01-21T14:31:00'),
          visibility: 'project'
        }
      ]
    },
    {
      id: 'session-002',
      agentName: 'Shiryu',
      timestamp: new Date('2025-01-20T16:15:00'),
      summary: 'Data analysis results and visualization recommendations',
      messageCount: 8,
      duration: '12 minutes',
      isAutonomous: true,
      status: 'completed',
      messages: [
        {
          id: 'msg-003',
          content: 'I\'ve completed the market data analysis. Here are the key findings...',
          sender: 'agent',
          agentId: 'da-001',
          timestamp: new Date('2025-01-20T16:15:00'),
          visibility: 'project'
        }
      ]
    },
    {
      id: 'session-003',
      agentName: 'Ikki',
      timestamp: new Date('2025-01-19T11:20:00'),
      summary: 'Requirements gathering session for user authentication module',
      messageCount: 15,
      duration: '18 minutes',
      isAutonomous: false,
      status: 'completed',
      messages: []
    },
    {
      id: 'session-004',
      agentName: 'Hyôga',
      timestamp: new Date('2025-01-18T09:45:00'),
      summary: 'Strategic planning discussion for market expansion',
      messageCount: 6,
      duration: '15 minutes',
      isAutonomous: false,
      status: 'interrupted',
      messages: []
    }
  ]);
  
  const [historyFilter, setHistoryFilter] = React.useState<{
    agent: string;
    search: string;
    groupBy: 'agent' | 'date';
  }>({
    agent: 'all',
    search: '',
    groupBy: 'date'
  });
  
  const [selectedSession, setSelectedSession] = React.useState<ChatSession | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Task management functions
  const handleRetryTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: 'pending' as const }
        : task
    ));
  };
  
  const getTaskStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getTaskStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'pending': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };
  
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };
  
  // Filter tasks based on current filters
  const filteredTasks = tasks.filter(task => {
    const matchesAgent = taskFilter.agent === 'all' || task.assignedAgent === taskFilter.agent;
    const matchesStatus = taskFilter.status === 'all' || task.status === taskFilter.status;
    const matchesSearch = taskFilter.search === '' || 
      task.name.toLowerCase().includes(taskFilter.search.toLowerCase()) ||
      task.description.toLowerCase().includes(taskFilter.search.toLowerCase());
    
    return matchesAgent && matchesStatus && matchesSearch;
  });
  
  // Filter and group chat sessions
  const filteredSessions = chatSessions.filter(session => {
    const matchesAgent = historyFilter.agent === 'all' || session.agentName === historyFilter.agent;
    const matchesSearch = historyFilter.search === '' ||
      session.summary.toLowerCase().includes(historyFilter.search.toLowerCase()) ||
      session.agentName.toLowerCase().includes(historyFilter.search.toLowerCase());
    
    return matchesAgent && matchesSearch;
  });
  
  const groupedSessions = React.useMemo(() => {
    if (historyFilter.groupBy === 'agent') {
      return filteredSessions.reduce((groups, session) => {
        const agent = session.agentName;
        if (!groups[agent]) groups[agent] = [];
        groups[agent].push(session);
        return groups;
      }, {} as Record<string, ChatSession[]>);
    } else {
      return filteredSessions.reduce((groups, session) => {
        const date = session.timestamp.toDateString();
        if (!groups[date]) groups[date] = [];
        groups[date].push(session);
        return groups;
      }, {} as Record<string, ChatSession[]>);
    }
  }, [filteredSessions, historyFilter.groupBy]);
  
  const handleViewSession = (session: ChatSession) => {
    setSelectedSession(session);
  };
  
  const handleResumeSession = (session: ChatSession) => {
    // Switch to chat tab and populate with session context
    setActiveTab('chat');
    // In a real implementation, you would load the session context
    console.log('Resuming session:', session.id);
  };

  return (
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
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 ${
              activeTab === 'tasks' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            Tasks
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 ${
              activeTab === 'history' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Clock className="w-4 h-4" />
            History
          </button>
        </nav>
      </div>

      {activeTab === 'chat' && (
        <>
          {/* Chat controls */}
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

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-6">
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
                              onClick={() => onConvertMessage(message.id, 'task')}
                              className="text-xs text-indigo-600 hover:underline"
                            >
                              Convert to task
                            </button>
                          )}
                          {message.canConvertToDocument && (
                            <button
                              onClick={() => onConvertMessage(message.id, 'document')}
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

          {/* Chat input */}
          <div className="border-t">
            <div className="bg-white rounded-lg border m-4">
              <div className="flex items-center gap-3 p-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={onFileUpload}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.png,.jpg"
                  aria-hidden
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-50 flex-shrink-0"
                  title="Attach files"
                >
                  <Paperclip className="w-5 h-5" />
                </button>

                <div className="flex-1">
                  <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        onSendMessage();
                      }
                    }}
                    placeholder="Ask your AI agents anything... Use @Seiya, @Shiryu, @Hyôga, @Shun, or @Ikki to mention specific agents"
                    className="w-full px-4 py-2 border-0 focus:outline-none placeholder-gray-500"
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
                            onClick={() => onRemoveAttachment(att.id)}
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
                  onClick={onSendMessage}
                  className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 flex-shrink-0"
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
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

      {activeTab === 'tasks' && (
        <div className="flex flex-col h-full">
          {/* Tasks Header with Filters */}
          <div className="p-4 border-b bg-gray-50">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Project Tasks</h3>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={taskFilter.search}
                    onChange={(e) => setTaskFilter(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  />
                </div>
                <select
                  value={taskFilter.agent}
                  onChange={(e) => setTaskFilter(prev => ({ ...prev, agent: e.target.value }))}
                  className="px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="all">All Agents</option>
                  {agents.map(agent => (
                    <option key={agent.id} value={agent.name}>{agent.name}</option>
                  ))}
                </select>
                <select
                  value={taskFilter.status}
                  onChange={(e) => setTaskFilter(prev => ({ ...prev, status: e.target.value }))}
                  className="px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tasks Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                <p className="text-gray-500">
                  {taskFilter.search || taskFilter.agent !== 'all' || taskFilter.status !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Tasks assigned to agents will appear here'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTasks.map((task) => (
                  <div key={task.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">{task.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTaskStatusColor(task.status)}`}>
                            {getTaskStatusIcon(task.status)}
                            <span className="ml-1">{task.status.charAt(0).toUpperCase() + task.status.slice(1)}</span>
                          </span>
                          <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority.toUpperCase()} PRIORITY
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{task.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>Assigned to: {task.assignedAgent}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Created: {task.createdAt.toLocaleDateString()}</span>
                          </div>
                          {task.estimatedDuration && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>Est. Duration: {task.estimatedDuration}</span>
                            </div>
                          )}
                          {task.completedAt && (
                            <div className="flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" />
                              <span>Completed: {task.completedAt.toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {(task.status === 'failed' || task.status === 'completed') && (
                          <button
                            onClick={() => handleRetryTask(task.id)}
                            className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                          >
                            <RotateCcw className="w-4 h-4" />
                            Retry
                          </button>
                        )}
                        <button className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                          <Eye className="w-4 h-4" />
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="flex flex-col h-full">
          {/* History Header with Filters */}
          <div className="p-4 border-b bg-gray-50">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Chat History</h3>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={historyFilter.search}
                    onChange={(e) => setHistoryFilter(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  />
                </div>
                <select
                  value={historyFilter.agent}
                  onChange={(e) => setHistoryFilter(prev => ({ ...prev, agent: e.target.value }))}
                  className="px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="all">All Agents</option>
                  {agents.map(agent => (
                    <option key={agent.id} value={agent.name}>{agent.name}</option>
                  ))}
                </select>
                <select
                  value={historyFilter.groupBy}
                  onChange={(e) => setHistoryFilter(prev => ({ ...prev, groupBy: e.target.value as 'agent' | 'date' }))}
                  className="px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="date">Group by Date</option>
                  <option value="agent">Group by Agent</option>
                </select>
              </div>
            </div>
          </div>

          {/* History Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {Object.keys(groupedSessions).length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No chat history found</h3>
                <p className="text-gray-500">
                  {historyFilter.search || historyFilter.agent !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Previous conversations with agents will appear here'}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedSessions).map(([groupKey, sessions]) => (
                  <div key={groupKey}>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                      {historyFilter.groupBy === 'date' ? new Date(groupKey).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) : groupKey}
                    </h4>
                    <div className="space-y-3">
                      {sessions.map((session) => (
                        <div key={session.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="flex items-center gap-2">
                                  {session.isAutonomous ? (
                                    <Bot className="w-5 h-5 text-purple-600" />
                                  ) : (
                                    <User className="w-5 h-5 text-blue-600" />
                                  )}
                                  <span className="font-medium text-gray-900">{session.agentName}</span>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  session.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  session.status === 'active' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                                </span>
                                {session.isAutonomous && (
                                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                                    Autonomous
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600 mb-3">{session.summary}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>{session.timestamp.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MessageSquare className="w-4 h-4" />
                                  <span>{session.messageCount} messages</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{session.duration}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleViewSession(session)}
                                className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                              >
                                <Eye className="w-4 h-4" />
                                View
                              </button>
                              <button
                                onClick={() => handleResumeSession(session)}
                                className="flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-sm"
                              >
                                <Play className="w-4 h-4" />
                                Resume
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Session Detail Modal */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Chat Session Details</h3>
                  <p className="text-sm text-gray-500">
                    {selectedSession.agentName} • {selectedSession.timestamp.toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedSession(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Session Summary</h4>
                  <p className="text-gray-700">{selectedSession.summary}</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <span>Duration: {selectedSession.duration}</span>
                    <span>Messages: {selectedSession.messageCount}</span>
                    <span>Status: {selectedSession.status}</span>
                  </div>
                </div>
                
                {selectedSession.messages.length > 0 ? (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Conversation Transcript</h4>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {selectedSession.messages.map((message) => (
                        <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[70%] p-3 rounded-lg ${
                            message.sender === 'user' 
                              ? 'bg-indigo-600 text-white' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            <p className="whitespace-pre-wrap">{message.content}</p>
                            <div className="text-xs mt-1 opacity-70">
                              {message.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2" />
                    <p>No detailed transcript available for this session</p>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setSelectedSession(null)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleResumeSession(selectedSession);
                    setSelectedSession(null);
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Resume Conversation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;