import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  Search, 
  Settings, 
  Mic, 
  CornerUpLeft, 
  MessageSquare, 
  Users, 
  FileText, 
  Globe, 
  Lightbulb, 
  Cloud, 
  GitBranch, 
  Shield, 
  Package, 
  Layout,
  Table,
  Image,
  Play,
  Phone,
  Download,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Cpu,
  Server,
  Network,
  Share2,
  Zap,
  Eye,
  ArrowRight,
  RefreshCw,
  Filter,
  Calendar
} from 'lucide-react';
import { Page } from '../App';
import { motion, AnimatePresence } from 'framer-motion';

interface OrchestrationPageProps {
  onNavigate: (page: Page) => void;
}

// Define the structure for AI message content
interface AiContent {
  reasoningSteps?: string[];
  agentCalls?: { agentName: string; purpose: string; }[];
  finalResponse: string | JSX.Element;
}

interface Message {
  type: 'user' | 'ai';
  text?: string;
  content?: AiContent;
  timestamp: Date;
}

// Mock data for system metrics
const systemMetrics = [
  {
    id: 'active-agents',
    title: 'Active Agents',
    value: '24',
    change: '+3',
    changeLabel: 'since last week',
    icon: Bot,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    trend: 'up'
  },
  {
    id: 'workflows',
    title: 'Active Workflows',
    value: '8',
    change: '+2',
    changeLabel: 'new this month',
    icon: GitBranch,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    trend: 'up'
  },
  {
    id: 'system-health',
    title: 'System Health',
    value: '99.8%',
    change: '+0.2%',
    changeLabel: 'uptime improvement',
    icon: Activity,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    trend: 'up'
  },
  {
    id: 'resource-usage',
    title: 'Resource Usage',
    value: '78%',
    change: '-5%',
    changeLabel: 'optimization gain',
    icon: Cpu,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    trend: 'down'
  }
];

// Mock data for quick access cards
const quickAccessCards = [
  {
    title: 'Agent Management',
    description: 'Manage agent directory, configuration, and lifecycle',
    icon: Bot,
    page: 'agent-management' as Page
  },
  {
    title: 'Workflow Designer',
    description: 'Create and manage AI workflows visually',
    icon: GitBranch,
    page: 'workflow-management' as Page
  },
  {
    title: 'System Monitoring',
    description: 'Real-time analytics and performance metrics',
    icon: Activity,
    page: 'monitoring-analytics' as Page
  },
  {
    title: 'Resource Management',
    description: 'Manage system resources and scaling',
    icon: Server,
    page: 'resource-management' as Page
  },
  {
    title: 'Collaboration Hub',
    description: 'Human-AI collaboration and communication',
    icon: Users,
    page: 'collaboration' as Page
  },
  {
    title: 'AI Documentation',
    description: 'Access AI system documentation and guides',
    icon: FileText,
    page: 'documents' as Page
  }
];

export default function OrchestrationPage({ onNavigate }: OrchestrationPageProps) {
  const [promptInput, setPromptInput] = useState<string>('');
  const [conversationHistory, setConversationHistory] = useState<Message[]>([
    {
      type: 'ai',
      content: {
        finalResponse: (
          <span>
            Hello! I'm your Multi-Agent Orchestration AI. I can help you manage and understand your AI ecosystem.
            <br /><br />
            You can ask me anything, like:
            <ul className="list-disc list-inside mt-2 ml-4 text-gray-300">
              <li>"Show active agents"</li>
              <li>"Create a new customer onboarding workflow"</li>
              <li>"Analyze sales performance"</li>
              <li>"What's the system health?"</li>
            </ul>
          </span>
        ),
      },
      timestamp: new Date()
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversationHistory]);

  const handleSendPrompt = async () => {
    if (promptInput.trim() === '' || isLoading) return;

    const userMessage: Message = { 
      type: 'user', 
      text: promptInput,
      timestamp: new Date()
    };
    
    setConversationHistory((prev) => [...prev, userMessage]);
    setPromptInput('');
    setIsLoading(true);

    // Simulate AI processing delay
    setTimeout(() => {
      let aiContent: AiContent;
      const lowerCasePrompt = promptInput.toLowerCase();

      // Enhanced AI response logic
      if (lowerCasePrompt.includes('hello') || lowerCasePrompt.includes('hi')) {
        aiContent = {
          reasoningSteps: ["Acknowledging greeting and preparing assistance."],
          finalResponse: "Hello there! How can I assist you with your multi-agent ecosystem today?",
        };
      } else if (lowerCasePrompt.includes('active agents') || lowerCasePrompt.includes('agents status')) {
        aiContent = {
          reasoningSteps: [
            "Understanding request for agent status.",
            "Querying Agent Management System for active agents.",
            "Analyzing current performance metrics."
          ],
          agentCalls: [
            { agentName: 'Agent Management System', purpose: 'Retrieve active agent list and status' }
          ],
          finalResponse: (
            <div>
              <p className="mb-3">Currently, there are <strong>24 active agents</strong> in your ecosystem:</p>
              <div className="bg-gray-800 rounded-lg p-3 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>• Customer Support: <span className="text-green-400">Active</span></div>
                  <div>• Sales Assistant: <span className="text-green-400">Active</span></div>
                  <div>• Technical Support: <span className="text-yellow-400">High Load</span></div>
                  <div>• E-commerce: <span className="text-green-400">Active</span></div>
                </div>
              </div>
            </div>
          ),
        };
      } else if (lowerCasePrompt.includes('system health') || lowerCasePrompt.includes('health check')) {
        aiContent = {
          reasoningSteps: [
            "Assessing overall system status.",
            "Checking monitoring logs and performance metrics.",
            "Evaluating resource utilization."
          ],
          agentCalls: [
            { agentName: 'Monitoring & Analytics System', purpose: 'Retrieve system health metrics' },
            { agentName: 'Security Auditor Agent', purpose: 'Perform security compliance check' },
          ],
          finalResponse: (
            <div>
              <p className="mb-3">System health is <strong className="text-green-400">excellent</strong> with 99.8% uptime.</p>
              <div className="bg-gray-800 rounded-lg p-3 text-sm space-y-1">
                <div className="flex justify-between">
                  <span>CPU Usage:</span>
                  <span className="text-orange-400">78%</span>
                </div>
                <div className="flex justify-between">
                  <span>Memory:</span>
                  <span className="text-green-400">65%</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Connections:</span>
                  <span className="text-blue-400">1,247</span>
                </div>
              </div>
            </div>
          ),
        };
      } else {
        aiContent = {
          reasoningSteps: [
            "Analyzing user query for orchestration-related keywords.",
            "Preparing general assistance response."
          ],
          finalResponse: "I can help you with agent management, workflow creation, system monitoring, and more. What specific aspect of your AI ecosystem would you like to explore?",
        };
      }

      setConversationHistory((prev) => [...prev, { 
        type: 'ai', 
        content: aiContent,
        timestamp: new Date()
      }]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendPrompt();
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'deployment': return <Package className="w-4 h-4 text-blue-500" />;
      case 'workflow': return <GitBranch className="w-4 h-4 text-purple-500" />;
      case 'alert': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'collaboration': return <Share2 className="w-4 h-4 text-teal-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Filter quick access cards based on search
  const filteredCards = quickAccessCards.filter(card =>
    card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Orchestration Hub
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Central command center for multi-agent AI ecosystem management
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden">
                <Calendar className="ml-3 w-4 h-4 text-gray-500" />
                <select
                  className="w-full py-2 pl-2 pr-8 bg-transparent border-none focus:ring-0 text-sm"
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                >
                  <option value="1h">Last Hour</option>
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                </select>
              </div>
              <button className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* System Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {systemMetrics.map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${metric.bgColor} p-2 sm:p-3 rounded-full`}>
                  <metric.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${metric.color}`} />
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-50">
                  {metric.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                  )}
                  <span className="text-xs sm:text-sm font-medium text-green-600">
                    {metric.change}
                  </span>
                </div>
              </div>
              <div className="mb-2">
                <h3 className="text-sm sm:text-base font-medium text-gray-600">
                  {metric.title}
                </h3>
                <div className="mt-1 sm:mt-2">
                  <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {metric.value}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500">{metric.changeLabel}</p>
            </motion.div>
          ))}
        </div>


        {/* AI Assistant Chat Interface */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Orchestration AI Assistant
                </h2>
                    <div className="text-white">• Customer Support: <span className="text-green-400">Active</span></div>
                    <div className="text-white">• Sales Assistant: <span className="text-green-400">Active</span></div>
                    <div className="text-white">• Technical Support: <span className="text-yellow-400">High Load</span></div>
                    <div className="text-white">• E-commerce: <span className="text-green-400">Active</span></div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto p-6 bg-gray-50">
            <div className="space-y-4">
              <AnimatePresence>
                {conversationHistory.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`flex items-start max-w-[80%] p-4 rounded-xl shadow-sm ${
                        message.type === 'user'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white text-gray-800 border border-gray-200'
                      }`}
                    >
                      {message.type === 'ai' && (
                        <Bot className="w-5 h-5 text-indigo-500 mr-3 flex-shrink-0 mt-0.5" />
                      )}
                      {message.type === 'user' && (
                        <User className="w-5 h-5 text-indigo-200 mr-3 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="text-sm">
                        {message.type === 'user' && message.text}
                        {message.type === 'ai' && message.content && (
                          <>
                            {message.content.reasoningSteps && message.content.reasoningSteps.length > 0 && (
                              <div className="mb-3 p-3 bg-gray-100 rounded-lg border border-gray-200">
                                <p className="font-semibold text-gray-900 mb-2 flex items-center gap-1 text-sm">
                                  <Settings className="w-3 h-3" />
                                  Reasoning Process:
                                </p>
                                <ul className="list-disc list-inside space-y-1 text-xs text-gray-700">
                                  {message.content.reasoningSteps.map((step, i) => (
                                    <li key={i}>{step}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {message.content.agentCalls && message.content.agentCalls.length > 0 && (
                              <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="font-semibold text-blue-900 mb-2 flex items-center gap-1 text-sm">
                                  <Network className="w-3 h-3" />
                                  Agent Interactions:
                                </p>
                                <ul className="list-disc list-inside space-y-1 text-xs text-blue-800">
                                  {message.content.agentCalls.map((call, i) => (
                                    <li key={i}>
                                      <span className="font-medium text-blue-700">{call.agentName}:</span> {call.purpose}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            <div className="text-sm text-gray-800 leading-relaxed">
                              {message.content.finalResponse}
                            </div>
                          </>
                        )}
                        <div className="text-xs opacity-70 mt-2">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                    <Bot className="w-5 h-5 text-indigo-500 mr-3" />
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-600">Processing</span>
                      <div className="flex gap-1">
                        <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce"></div>
                        <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Chat Input */}
          <div className="p-6 bg-white border-t border-gray-200">
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-200 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
              <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <textarea
                className="flex-1 resize-none bg-transparent py-2 focus:outline-none text-gray-900 placeholder-gray-500 text-sm"
                rows={1}
                placeholder="Ask about agents, workflows, system status, or request assistance..."
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                style={{ minHeight: '40px', maxHeight: '120px' }}
              />
              <div className="flex items-center gap-2">
                <button 
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                  disabled={isLoading}
                >
                  <Mic className="w-4 h-4" />
                </button>
                <button
                  onClick={handleSendPrompt}
                  disabled={!promptInput.trim() || isLoading}
                  className={`p-2 rounded-lg transition-colors ${
                    promptInput.trim() && !isLoading
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* AI Tools Grid */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">AI-Powered Tools</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'AI Slides', icon: Layout, color: 'text-orange-500', bgColor: 'bg-orange-100', isNew: false },
              { name: 'AI Sheets', icon: Table, color: 'text-green-500', bgColor: 'bg-green-100', isNew: false },
              { name: 'AI Docs', icon: FileText, color: 'text-blue-500', bgColor: 'bg-blue-100', isNew: true },
              { name: 'AI Pods', icon: Lightbulb, color: 'text-purple-500', bgColor: 'bg-purple-100', isNew: true },
              { name: 'AI Chat', icon: MessageSquare, color: 'text-teal-500', bgColor: 'bg-teal-100', isNew: false },
              { name: 'AI Image', icon: Image, color: 'text-yellow-500', bgColor: 'bg-yellow-100', isNew: false },
              { name: 'AI Video', icon: Play, color: 'text-red-500', bgColor: 'bg-red-100', isNew: false },
              { name: 'Deep Research', icon: Globe, color: 'text-lime-500', bgColor: 'bg-lime-100', isNew: false },
              { name: 'Call For Me', icon: Phone, color: 'text-pink-500', bgColor: 'bg-pink-100', isNew: false },
              { name: 'Download For Me', icon: Download, color: 'text-cyan-500', bgColor: 'bg-cyan-100', isNew: false },
              { name: 'All Agents', icon: Bot, color: 'text-gray-500', bgColor: 'bg-gray-100', isNew: false },
              { name: 'Workflows', icon: GitBranch, color: 'text-indigo-500', bgColor: 'bg-indigo-100', isNew: false }
            ].map((tool, index) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200"
              >
                <div className="relative">
                  <div className={`w-12 h-12 ${tool.bgColor} rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                    <tool.icon className={`w-6 h-6 ${tool.color}`} />
                  </div>
                  {tool.isNew && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                      New
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-700 text-center font-medium group-hover:text-gray-900 transition-colors">
                  {tool.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}