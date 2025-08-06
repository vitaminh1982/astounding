import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  Search, 
  Settings, 
  Mic, 
  MessageSquare, 
  Users, 
  FileText, 
  Globe, 
  Lightbulb, 
  GitBranch, 
  Package, 
  Layout,
  Table,
  Image,
  Play,
  Phone,
  Download,
  Activity,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Cpu,
  Server,
  Network,
  RefreshCw,
  Calendar,
  Maximize2,
  Minimize2,
  X
} from 'lucide-react';
import { Page } from '../App';
import { motion, AnimatePresence } from 'framer-motion';

interface OrchestrationPageProps {
  onNavigate: (page: Page) => void;
}

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

// Enhanced system metrics with better contrast
const systemMetrics = [
  {
    id: 'active-agents',
    title: 'Active Agents',
    value: '24',
    change: '+3',
    changeLabel: 'since last week',
    icon: Bot,
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    trend: 'up'
  },
  {
    id: 'workflows',
    title: 'Active Workflows',
    value: '8',
    change: '+2',
    changeLabel: 'new this month',
    icon: GitBranch,
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    trend: 'up'
  },
  {
    id: 'system-health',
    title: 'System Health',
    value: '99.8%',
    change: '+0.2%',
    changeLabel: 'uptime improvement',
    icon: Activity,
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    trend: 'up'
  },
  {
    id: 'resource-usage',
    title: 'Resource Usage',
    value: '78%',
    change: '-5%',
    changeLabel: 'optimization gain',
    icon: Cpu,
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    trend: 'down'
  }
];

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
          <div className="text-gray-800">
            <p className="mb-3 font-medium">
              Hello! I'm your Multi-Agent Orchestration AI. I can help you manage and understand your AI ecosystem.
            </p>
            <p className="mb-3 text-gray-700">
              You can ask me anything, like:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 bg-gray-50 p-3 rounded-lg">
              <li>&quot;Show active agents&quot;</li>
              <li>&quot;Create a new customer onboarding workflow&quot;</li>
              <li>&quot;Analyze sales performance&quot;</li>
              <li>&quot;What&apos;s the system health?&quot;</li>
            </ul>
          </div>
        ),
      },
      timestamp: new Date()
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [isChatMaximized, setIsChatMaximized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversationHistory]);

  const generateAIResponse = useCallback((prompt: string): AiContent => {
    const lowerCasePrompt = prompt.toLowerCase();
    
    if (lowerCasePrompt.includes('hello') || lowerCasePrompt.includes('hi')) {
      return {
        reasoningSteps: ["Acknowledging greeting and preparing assistance."],
        finalResponse: "Hello there! How can I assist you with your multi-agent ecosystem today?",
      };
    } 
    
    if (lowerCasePrompt.includes('active agents') || lowerCasePrompt.includes('agents status')) {
      return {
        reasoningSteps: [
          "Understanding request for agent status.",
          "Querying Agent Management System for active agents.",
          "Analyzing current performance metrics."
        ],
        agentCalls: [
          { agentName: 'Agent Management System', purpose: 'Retrieve active agent list and status' }
        ],
        finalResponse: (
          <div className="text-gray-800">
            <p className="mb-3 font-medium">
              Currently, there are <strong className="text-blue-700">24 active agents</strong> in your ecosystem:
            </p>
            <div className="bg-gray-800 rounded-lg p-4 max-h-80 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                  <span className="text-gray-200">Customer Support:</span>
                  <span className="text-green-400 font-medium">Active</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                  <span className="text-gray-200">Sales Assistant:</span>
                  <span className="text-green-400 font-medium">Active</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                  <span className="text-gray-200">Technical Support:</span>
                  <span className="text-yellow-400 font-medium">High Load</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                  <span className="text-gray-200">E-commerce:</span>
                  <span className="text-green-400 font-medium">Active</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                  <span className="text-gray-200">Data Analytics:</span>
                  <span className="text-green-400 font-medium">Active</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                  <span className="text-gray-200">Content Generator:</span>
                  <span className="text-green-400 font-medium">Active</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                  <span className="text-gray-200">Marketing Automation:</span>
                  <span className="text-blue-400 font-medium">Processing</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                  <span className="text-gray-200">HR Assistant:</span>
                  <span className="text-green-400 font-medium">Active</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                  <span className="text-gray-200">Financial Advisor:</span>
                  <span className="text-green-400 font-medium">Active</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                  <span className="text-gray-200">Security Monitor:</span>
                  <span className="text-green-400 font-medium">Active</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                  <span className="text-gray-200">Inventory Manager:</span>
                  <span className="text-green-400 font-medium">Active</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                  <span className="text-gray-200">Translation Service:</span>
                  <span className="text-yellow-400 font-medium">High Load</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                  <span className="text-gray-200">Email Classifier:</span>
                  <span className="text-green-400 font-medium">Active</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                  <span className="text-gray-200">Document Processor:</span>
                  <span className="text-blue-400 font-medium">Processing</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                  <span className="text-gray-200">Quality Assurance:</span>
                  <span className="text-green-400 font-medium">Active</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                  <span className="text-gray-200">Workflow Orchestrator:</span>
                  <span className="text-green-400 font-medium">Active</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                  <span className="text-gray-200">Image Recognition:</span>
                  <span className="text-green-400 font-medium">Active</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                  <span className="text-gray-200">Voice Assistant:</span>
                  <span className="text-green-400 font-medium">Active</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                  <span className="text-gray-200">Anomaly Detection:</span>
                  <span className="text-orange-400 font-medium">Maintenance</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                  <span className="text-gray-200">Knowledge Base:</span>
                  <span className="text-green-400 font-medium">Active</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                  <span className="text-gray-200">Backup Manager:</span>
                  <span className="text-green-400 font-medium">Active</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                  <span className="text-gray-200">Performance Monitor:</span>
                  <span className="text-green-400 font-medium">Active</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                  <span className="text-gray-200">API Gateway:</span>
                  <span className="text-yellow-400 font-medium">High Load</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                  <span className="text-gray-200">Report Generator:</span>
                  <span className="text-green-400 font-medium">Active</span>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 font-medium">
                📊 Status Summary: 19 Active • 3 High Load • 1 Processing • 1 Maintenance
              </p>
            </div>
          </div>
        )
      };
    }

    if (lowerCasePrompt.includes('system health') || lowerCasePrompt.includes('health')) {
      return {
        reasoningSteps: [
          "Checking system health metrics",
          "Analyzing performance indicators",
          "Generating health report"
        ],
        agentCalls: [
          { agentName: 'System Monitor', purpose: 'Retrieve system health metrics' }
        ],
        finalResponse: (
          <div className="text-gray-800">
            <p className="mb-3 font-medium">System Health Report:</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-bold text-green-800">Overall: 99.8%</span>
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <span className="font-bold text-blue-800">Uptime: 99.97%</span>
                </div>
              </div>
            </div>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>All critical systems operational</li>
              <li>Resource utilization within normal limits</li>
              <li>No security alerts detected</li>
            </ul>
          </div>
        )
      };
    }

    if (lowerCasePrompt.includes('workflow') || lowerCasePrompt.includes('create')) {
      return {
        reasoningSteps: [
          "Understanding workflow creation request",
          "Analyzing available workflow templates",
          "Preparing workflow designer interface"
        ],
        agentCalls: [
          { agentName: 'Workflow Manager', purpose: 'Initialize workflow creation process' }
        ],
        finalResponse: (
          <div className="text-gray-800">
            <p className="mb-3 font-medium">I can help you create a new workflow!</p>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-purple-800 font-medium mb-2">Available Templates:</p>
              <ul className="list-disc list-inside space-y-1 text-purple-700">
                <li>Customer Onboarding</li>
                <li>Data Processing Pipeline</li>
                <li>Content Generation</li>
                <li>Quality Assurance</li>
              </ul>
            </div>
            <p className="mt-3 text-gray-700">Would you like me to navigate you to the Workflow Designer?</p>
          </div>
        )
      };
    }

    return {
      reasoningSteps: [
        "Processing your request",
        "Searching knowledge base for relevant information",
        "Formulating comprehensive response"
      ],
      finalResponse: "I understand you're asking about: \"" + prompt + "\". Could you please provide more specific details so I can better assist you with your multi-agent system needs?"
    };
  }, []);

  const handleSendPrompt = useCallback(async () => {
    if (!promptInput.trim() || isLoading) return;

    const userMessage: Message = {
      type: 'user',
      text: promptInput,
      timestamp: new Date()
    };

    setConversationHistory(prev => [...prev, userMessage]);
    setIsLoading(true);
    setPromptInput('');

    // Simulate AI processing delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(promptInput);
      const aiMessage: Message = {
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };

      setConversationHistory(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  }, [promptInput, isLoading, generateAIResponse]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendPrompt();
    }
  }, [handleSendPrompt]);

  const handleRefresh = useCallback(() => {
    // Simulate refresh action
    console.log('Refreshing system metrics...');
  }, []);

  // Chat Interface Component
  const ChatInterface = React.memo(({ isModal }: { isModal: boolean }) => (
    <>
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">AI Assistant</h3>
            <p className="text-sm text-gray-600 font-medium">Multi-Agent Orchestration</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isModal ? (
            <button
              onClick={() => setIsChatMaximized(true)}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Maximize chat"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setIsChatMaximized(false)}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className={`overflow-y-auto p-6 bg-gray-50 ${isModal ? 'flex-1' : 'h-96'}`}>
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
                  className={`flex items-start max-w-[85%] p-4 rounded-xl shadow-sm ${
                    message.type === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  {message.type === 'ai' && (
                    <Bot className="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0 mt-0.5" />
                  )}
                  {message.type === 'user' && (
                    <User className="w-5 h-5 text-indigo-100 mr-3 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="text-sm">
                    {message.type === 'user' && (
                      <p className="text-white font-medium">{message.text}</p>
                    )}
                    {message.type === 'ai' && message.content && (
                      <>
                        {message.content.reasoningSteps && message.content.reasoningSteps.length > 0 && (
                          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="font-bold text-blue-900 mb-2 flex items-center gap-2 text-sm">
                              <Settings className="w-4 h-4" />
                              Reasoning Process:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                              {message.content.reasoningSteps.map((step, i) => (
                                <li key={i} className="font-medium">{step}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {message.content.agentCalls && message.content.agentCalls.length > 0 && (
                          <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                            <p className="font-bold text-green-900 mb-2 flex items-center gap-2 text-sm">
                              <Network className="w-4 h-4" />
                              Agent Interactions:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-sm text-green-800">
                              {message.content.agentCalls.map((call, i) => (
                                <li key={i}>
                                  <span className="font-bold text-green-700">{call.agentName}:</span>{' '}
                                  <span className="font-medium">{call.purpose}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <div className="text-sm text-gray-800 leading-relaxed font-medium">
                          {message.content.finalResponse}
                        </div>
                      </>
                    )}
                    <div className={`text-xs mt-2 font-medium ${
                      message.type === 'user' ? 'text-indigo-200' : 'text-gray-500'
                    }`}>
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
                <Bot className="w-5 h-5 text-indigo-600 mr-3" />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-800 font-medium">Processing</span>
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <div 
                        key={i}
                        className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
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
        <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200">
          <Search className="w-5 h-5 text-gray-500 flex-shrink-0" />
          <textarea
            className="flex-1 resize-none bg-transparent py-2 focus:outline-none text-gray-900 placeholder-gray-600 text-sm font-medium"
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
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              disabled={isLoading}
              aria-label="Voice input"
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              onClick={handleSendPrompt}
              disabled={!promptInput.trim() || isLoading}
              className={`p-2 rounded-lg transition-colors ${
                promptInput.trim() && !isLoading
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  ));

  ChatInterface.displayName = 'ChatInterface';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Enhanced Header with better contrast */}
        <header className="mb-6">
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
              <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                <Calendar className="ml-3 w-4 h-4 text-gray-600" />
                <select
                  className="w-full py-2 pl-2 pr-8 bg-transparent border-none focus:ring-0 text-sm text-gray-800 font-medium"
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                >
                  <option value="1h">Last Hour</option>
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                </select>
              </div>
              <button 
                onClick={handleRefresh}
                className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </header>

        {/* Enhanced System Metrics Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {systemMetrics.map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${metric.bgColor} p-3 rounded-xl`}>
                  <metric.icon className={`h-6 w-6 ${metric.color}`} />
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 border border-green-200">
                  {metric.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-green-600" />
                  )}
                  <span className="text-sm font-semibold text-green-700">
                    {metric.change}
                  </span>
                </div>
              </div>
              <div className="mb-2">
                <h3 className="text-sm font-semibold text-gray-700 mb-1">
                  {metric.title}
                </h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {metric.value}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 font-medium">{metric.changeLabel}</p>
            </motion.div>
          ))}
        </section>

        {/* Enhanced AI Assistant Chat Interface */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <ChatInterface isModal={false} />
        </section>


        {/* Enhanced AI Tools Grid */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">AI-Powered Tools</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'AI Slides', icon: Layout, color: 'text-orange-600', bgColor: 'bg-orange-50', isNew: false },
              { name: 'AI Sheets', icon: Table, color: 'text-green-600', bgColor: 'bg-green-50', isNew: false },
              { name: 'AI Docs', icon: FileText, color: 'text-blue-600', bgColor: 'bg-blue-50', isNew: true },
              { name: 'AI Pods', icon: Lightbulb, color: 'text-purple-600', bgColor: 'bg-purple-50', isNew: true },
              { name: 'AI Chat', icon: MessageSquare, color: 'text-teal-600', bgColor: 'bg-teal-50', isNew: false },
              { name: 'AI Image', icon: Image, color: 'text-yellow-600', bgColor: 'bg-yellow-50', isNew: false },
              { name: 'AI Video', icon: Play, color: 'text-red-600', bgColor: 'bg-red-50', isNew: false },
              { name: 'Deep Research', icon: Globe, color: 'text-lime-600', bgColor: 'bg-lime-50', isNew: false },
              { name: 'Call For Me', icon: Phone, color: 'text-pink-600', bgColor: 'bg-pink-50', isNew: false },
              { name: 'Download For Me', icon: Download, color: 'text-cyan-600', bgColor: 'bg-cyan-50', isNew: false },
              { name: 'All Agents', icon: Bot, color: 'text-gray-600', bgColor: 'bg-gray-50', isNew: false },
              { name: 'Workflows', icon: GitBranch, color: 'text-indigo-600', bgColor: 'bg-indigo-50', isNew: false }
            ].map((tool, index) => (
              <motion.button
                key={tool.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-200 border border-transparent hover:border-gray-200"
              >
                <div className="relative">
                  <div className={`w-12 h-12 ${tool.bgColor} rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-gray-200`}>
                    <tool.icon className={`w-6 h-6 ${tool.color}`} />
                  </div>
                  {tool.isNew && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                      New
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-800 text-center font-semibold group-hover:text-gray-900 transition-colors">
                  {tool.name}
                </span>
              </motion.button>
            ))}
          </div>
        </section>
      </div>

      {/* Full-Screen Chat Modal */}
      <AnimatePresence>
        {isChatMaximized && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
            onClick={(e) => {
              // Close modal when clicking on backdrop
              if (e.target === e.currentTarget) {
                setIsChatMaximized(false);
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <ChatInterface isModal={true} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
