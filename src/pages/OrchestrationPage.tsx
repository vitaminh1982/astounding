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
    id: 'completion-rate',
    title: 'Task Completion',
    value: '94.7%',
    change: '+1.3%',
    changeLabel: 'efficiency gain',
    icon: CheckCircle,
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    trend: 'up'
  }
];

// Enhanced quick access cards
const quickAccessCards = [
  {
    title: 'Agent Builder',
    description: 'Create and deploy new AI agents with custom capabilities and workflows.',
    icon: Bot,
    page: 'agent-builder' as Page
  },
  {
    title: 'Knowledge Base',
    description: 'Manage documents, data sources, and training materials for your agents.',
    icon: FileText,
    page: 'knowledge-base' as Page
  },
  {
    title: 'Analytics Hub',
    description: 'Monitor performance, track metrics, and optimize agent effectiveness.',
    icon: TrendingUp,
    page: 'analytics' as Page
  },
  {
    title: 'System Settings',
    description: 'Configure system preferences, permissions, and integration settings.',
    icon: Settings,
    page: 'settings' as Page
  },
  {
    title: 'Team Management',
    description: 'Manage users, roles, and collaborative workflows across your organization.',
    icon: Users,
    page: 'team' as Page
  },
  {
    title: 'Integration Hub',
    description: 'Connect external tools, APIs, and services to extend agent capabilities.',
    icon: Globe,
    page: 'integrations' as Page
  }
];

// AI Tools with enhanced data
const aiTools = [
  { name: 'AI Slides', icon: Layout, color: 'text-orange-600', bgColor: 'bg-orange-50', isNew: false },
  { name: 'AI Sheets', icon: Table, color: 'text-green-600', bgColor: 'bg-green-50', isNew: false },
  { name: 'AI Docs', icon: FileText, color: 'text-blue-600', bgColor: 'bg-blue-50', isNew: false },
  { name: 'AI Images', icon: Image, color: 'text-purple-600', bgColor: 'bg-purple-50', isNew: true },
  { name: 'AI Videos', icon: Play, color: 'text-red-600', bgColor: 'bg-red-50', isNew: true },
  { name: 'AI Voice', icon: Phone, color: 'text-indigo-600', bgColor: 'bg-indigo-50', isNew: false }
];

// Simple debounce utility
function debounce<T extends (...args: any[]) => void>(func: T, delay: number): T {
  let timeoutId: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  }) as T;
}

const generateAIResponse = (prompt: string): AiContent => {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('agent') || lowerPrompt.includes('24')) {
    return {
      reasoningSteps: [
        'Analyzing current agent ecosystem status',
        'Retrieving active agent configurations',
        'Checking system performance metrics',
        'Compiling comprehensive agent overview'
      ],
      agentCalls: [
        { agentName: 'System Monitor', purpose: 'Retrieve current system status' },
        { agentName: 'Agent Registry', purpose: 'List all active agents' },
        { agentName: 'Performance Analyzer', purpose: 'Generate performance metrics' }
      ],
      finalResponse: (
        <div className="text-gray-800">
          <p className="mb-3 font-medium">
            Currently, there are <strong className="text-blue-700">24 active agents</strong> in your ecosystem:
          </p>
          <div className="bg-gray-800 rounded-lg p-4 max-h-80 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Customer Service Agents */}
              <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                <span className="text-gray-200">Customer Support Bot:</span>
                <span className="text-green-400 font-medium">Active</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                <span className="text-gray-200">Live Chat Assistant:</span>
                <span className="text-green-400 font-medium">Active</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                <span className="text-gray-200">Email Response Agent:</span>
                <span className="text-green-400 font-medium">Active</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                <span className="text-gray-200">Ticket Classifier:</span>
                <span className="text-green-400 font-medium">Active</span>
              </div>
              
              {/* Analytics & Monitoring */}
              <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                <span className="text-gray-200">Data Analytics Agent:</span>
                <span className="text-green-400 font-medium">Active</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                <span className="text-gray-200">Performance Monitor:</span>
                <span className="text-green-400 font-medium">Active</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                <span className="text-gray-200">Log Analyzer:</span>
                <span className="text-green-400 font-medium">Active</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                <span className="text-gray-200">Anomaly Detector:</span>
                <span className="text-yellow-400 font-medium">Monitoring</span>
              </div>
              
              {/* Content & Marketing */}
              <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                <span className="text-gray-200">Content Generator:</span>
                <span className="text-green-400 font-medium">Active</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                <span className="text-gray-200">Social Media Manager:</span>
                <span className="text-green-400 font-medium">Active</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                <span className="text-gray-200">SEO Optimizer:</span>
                <span className="text-green-400 font-medium">Active</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                <span className="text-gray-200">Brand Monitor:</span>
                <span className="text-green-400 font-medium">Active</span>
              </div>
              
              {/* Automation & Workflow */}
              <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                <span className="text-gray-200">Process Automation:</span>
                <span className="text-green-400 font-medium">Active</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                <span className="text-gray-200">Workflow Orchestrator:</span>
                <span className="text-green-400 font-medium">Active</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                <span className="text-gray-200">Task Scheduler:</span>
                <span className="text-green-400 font-medium">Active</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                <span className="text-gray-200">Integration Manager:</span>
                <span className="text-green-400 font-medium">Active</span>
              </div>
              
              {/* Security & Compliance */}
              <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                <span className="text-gray-200">Security Scanner:</span>
                <span className="text-green-400 font-medium">Active</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                <span className="text-gray-200">Compliance Monitor:</span>
                <span className="text-green-400 font-medium">Active</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                <span className="text-gray-200">Access Control Agent:</span>
                <span className="text-green-400 font-medium">Active</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                <span className="text-gray-200">Audit Logger:</span>
                <span className="text-green-400 font-medium">Active</span>
              </div>
              
              {/* System Management */}
              <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                <span className="text-gray-200">Resource Manager:</span>
                <span className="text-yellow-400 font-medium">High Load</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                <span className="text-gray-200">Backup Coordinator:</span>
                <span className="text-green-400 font-medium">Active</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                <span className="text-gray-200">Health Checker:</span>
                <span className="text-green-400 font-medium">Active</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                <span className="text-gray-200">E-commerce Agent:</span>
                <span className="text-green-400 font-medium">Active</span>
              </div>
            </div>
            
            {/* Status Summary */}
            <div className="mt-4 p-3 bg-gray-700 rounded-lg">
              <h4 className="text-gray-200 font-medium mb-2">Status Summary:</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-green-400 font-bold text-lg">22</div>
                  <div className="text-gray-400">Active</div>
                </div>
                <div className="text-center">
                  <div className="text-yellow-400 font-bold text-lg">2</div>
                  <div className="text-gray-400">Monitoring</div>
                </div>
                <div className="text-center">
                  <div className="text-red-400 font-bold text-lg">0</div>
                  <div className="text-gray-400">Offline</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    };
  }

  if (lowerPrompt.includes('workflow') || lowerPrompt.includes('process')) {
    return {
      reasoningSteps: [
        'Scanning active workflows and processes',
        'Analyzing workflow performance metrics',
        'Identifying optimization opportunities'
      ],
      agentCalls: [
        { agentName: 'Workflow Monitor', purpose: 'Track active workflows' },
        { agentName: 'Process Optimizer', purpose: 'Analyze efficiency metrics' }
      ],
      finalResponse: (
        <div className="text-gray-800">
          <p className="mb-3 font-medium">
            <strong className="text-purple-700">8 active workflows</strong> are currently running:
          </p>
          <div className="space-y-3">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-semibold text-purple-800 mb-2">Customer Onboarding Pipeline</h4>
              <p className="text-gray-700 text-sm">Automated workflow handling new customer registration, verification, and account setup.</p>
              <div className="flex justify-between items-center mt-2 text-sm">
                <span className="text-gray-600">Status: <span className="text-green-600 font-medium">Active</span></span>
                <span className="text-gray-600">Completion Rate: <span className="text-green-600 font-medium">96%</span></span>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Content Publishing Workflow</h4>
              <p className="text-gray-700 text-sm">Multi-stage content review, approval, and publishing process.</p>
              <div className="flex justify-between items-center mt-2 text-sm">
                <span className="text-gray-600">Status: <span className="text-green-600 font-medium">Active</span></span>
                <span className="text-gray-600">Articles Today: <span className="text-blue-600 font-medium">12</span></span>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Data Processing Pipeline</h4>
              <p className="text-gray-700 text-sm">Real-time data ingestion, processing, and analysis workflow.</p>
              <div className="flex justify-between items-center mt-2 text-sm">
                <span className="text-gray-600">Status: <span className="text-green-600 font-medium">Active</span></span>
                <span className="text-gray-600">Records/hr: <span className="text-green-600 font-medium">2.3K</span></span>
              </div>
            </div>
          </div>
        </div>
      )
    };
  }

  // Default response
  return {
    reasoningSteps: [
      'Processing your request and gathering relevant information',
      'Consulting available system resources and documentation',
      'Generating comprehensive response based on current system state'
    ],
    agentCalls: [
      { agentName: 'Knowledge Assistant', purpose: 'Research relevant information' },
      { agentName: 'System Status Agent', purpose: 'Check current system state' }
    ],
    finalResponse: (
      <div className="text-gray-800">
        <p className="mb-3 font-medium">
          I&apos;m here to help you with your AI agent ecosystem! Here are some things I can assist you with:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li><strong className="text-indigo-700">Agent Management:</strong> View, create, and configure AI agents</li>
          <li><strong className="text-purple-700">Workflow Orchestration:</strong> Monitor and optimize automated processes</li>
          <li><strong className="text-green-700">System Performance:</strong> Check health metrics and performance data</li>
          <li><strong className="text-blue-700">Integration Support:</strong> Help with connecting external tools and APIs</li>
          <li><strong className="text-orange-700">Troubleshooting:</strong> Diagnose and resolve system issues</li>
        </ul>
        <p className="mt-4 text-gray-600 text-sm">
          Try asking about specific agents, workflows, or system status for more detailed information!
        </p>
      </div>
    )
  };
};

interface ChatInterfaceProps {
  isModal: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ isModal }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [promptInput, setPromptInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Updated input change handler
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setPromptInput(value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, []);

  // Updated textarea resize handler
  const handleTextareaResize = useCallback((e: React.FormEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  }, []);

  // Updated send prompt handler
  const handleSendPrompt = useCallback(() => {
    if (!promptInput.trim() || isLoading) return;
    
    const message = promptInput.trim();
    setPromptInput(''); // Clear input immediately
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = '40px';
    }
    
    // Add user message
    const userMessage: Message = {
      type: 'user',
      text: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    // Process the message
    setTimeout(() => {
      const aiResponse = generateAIResponse(message);
      const aiMessage: Message = {
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  }, [promptInput, isLoading]);

  // Updated key down handler
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (promptInput.trim() && !isLoading) {
        handleSendPrompt();
      }
    }
  }, [promptInput, isLoading, handleSendPrompt]);

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="border-b border-gray-200 p-4 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <Bot className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">AI Assistant</h3>
              <p className="text-sm text-gray-600">Ask about agents, workflows, or system status</p>
            </div>
          </div>
          {isModal && (
            <button
              onClick={() => setIsChatMaximized(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Welcome to AI Assistant</h3>
            <p className="text-gray-600 max-w-md mx-auto text-sm">
              I can help you manage your agents, monitor workflows, check system status, and answer questions about your AI ecosystem.
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <div key={index} className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              message.type === 'user' 
                ? 'bg-indigo-100' 
                : 'bg-gray-100'
            } mt-1`}>
              {message.type === 'user' ? (
                <User className="w-4 h-4 text-indigo-600" />
              ) : (
                <Bot className="w-4 h-4 text-gray-600" />
              )}
            </div>
            
            <div className={`flex-1 max-w-2xl ${message.type === 'user' ? 'text-right' : ''}`}>
              <div className={`inline-block px-4 py-3 rounded-2xl ${
                message.type === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-900'
              }`}>
                {message.type === 'user' ? (
                  <p className="text-sm font-medium">{message.text}</p>
                ) : (
                  <div>
                    {message.content?.reasoningSteps && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-800 mb-2 text-sm">Reasoning Process:</h4>
                        <ol className="list-decimal list-inside space-y-1 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
                          {message.content.reasoningSteps.map((step, stepIndex) => (
                            <li key={stepIndex}>{step}</li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {message.content?.agentCalls && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-800 mb-2 text-sm">Agent Calls:</h4>
                        <div className="space-y-2">
                          {message.content.agentCalls.map((call, callIndex) => (
                            <div key={callIndex} className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                              <div className="flex items-center gap-2">
                                <Bot className="w-4 h-4 text-blue-600" />
                                <span className="font-medium text-blue-800 text-xs">{call.agentName}</span>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">{call.purpose}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="text-sm">
                      {typeof message.content?.finalResponse === 'string'
                        ? message.content.finalResponse
                        : message.content?.finalResponse
                      }
                    </div>
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-500 mt-1 px-1">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-gray-600" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-xs text-gray-500">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-gray-200">
        <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200">
          <Search className="w-5 h-5 text-gray-500 flex-shrink-0" />
          <textarea
            ref={textareaRef}
            className="flex-1 resize-none bg-transparent py-2 focus:outline-none text-gray-900 placeholder-gray-600 text-sm font-medium"
            rows={1}
            placeholder="Ask about agents, workflows, system status, or request assistance..."
            value={promptInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onInput={handleTextareaResize}
            disabled={isLoading}
            style={{ 
              minHeight: '40px', 
              maxHeight: '120px',
              lineHeight: '1.5'
            }}
            spellCheck="true"
            autoComplete="off"
            autoCorrect="on"
          />
          <div className="flex items-center gap-2">
            <button 
              type="button"
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              disabled={isLoading}
              aria-label="Voice input"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Voice input logic here
              }}
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              type="button"
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
    </div>
  );
};

export default function OrchestrationPage({ onNavigate }: OrchestrationPageProps) {
  const [isChatMaximized, setIsChatMaximized] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
                {/* Enhanced Header with better contrast */}
        <header className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              AI Agent Orchestration Hub
            </h1>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto font-medium">
              Manage your AI agents, monitor workflows, and orchestrate intelligent automation 
              across your organization with advanced analytics and real-time insights.
            </p>
          </motion.div>
        </header>

        {/* Enhanced System Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {systemMetrics.map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${metric.bgColor} p-3 rounded-xl`}>
                  <metric.icon className={`h-6 w-6 ${metric.color}`} />
                </div>
                <div className="text-right">
                  {metric.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
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
          <div className="h-96">
            <ChatInterface isModal={false} />
          </div>
        </section>

        {/* Enhanced Quick Access Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {quickAccessCards.map((card, index) => (
            <motion.button
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onNavigate(card.page)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-left hover:shadow-md hover:border-indigo-300 transition-all duration-200 group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-indigo-50 p-3 rounded-xl group-hover:bg-indigo-100 transition-colors">
                  <card.icon className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-700 transition-colors">
                {card.title}
              </h3>
              <p className="text-gray-600 text-sm font-medium leading-relaxed">
                {card.description}
              </p>
            </motion.button>
          ))}
        </section>

        {/* Enhanced AI Tools Section */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">AI Creation Tools</h2>
                <p className="text-gray-600 text-sm">Generate content across multiple formats</p>
              </div>
            </div>
            <button 
              onClick={() => onNavigate('ai-tools')}
              className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1"
            >
              View All Tools
              <span>→</span>
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {aiTools.map((tool, index) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative group cursor-pointer"
                onClick={() => onNavigate('ai-tools')}
              >
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 text-center">
                  {tool.isNew && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      NEW
                    </div>
                  )}
                  <div className={`${tool.bgColor} p-3 rounded-xl inline-flex mb-3 group-hover:scale-110 transition-transform`}>
                    <tool.icon className={`h-6 w-6 ${tool.color}`} />
                  </div>
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-gray-700">
                    {tool.name}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Enhanced Recent Activity */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                <p className="text-gray-600 text-sm">Latest system events and updates</p>
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">New Agent Deployed</h4>
                  <span className="text-sm text-gray-500">2 minutes ago</span>
                </div>
                <p className="text-gray-600 text-sm mt-1">
                  E-commerce Agent successfully deployed and is now processing customer inquiries.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                <GitBranch className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">Workflow Completed</h4>
                  <span className="text-sm text-gray-500">15 minutes ago</span>
                </div>
                <p className="text-gray-600 text-sm mt-1">
                  Content Publishing Workflow completed successfully with 8 articles published.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="bg-yellow-100 p-2 rounded-lg flex-shrink-0">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">High Resource Usage</h4>
                  <span className="text-sm text-gray-500">1 hour ago</span>
                </div>
                <p className="text-gray-600 text-sm mt-1">
                  Resource Manager agent detected high CPU usage. Automatic scaling was triggered.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced System Status */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Server className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">System Status</h2>
                <p className="text-gray-600 text-sm">Real-time infrastructure monitoring</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-700 font-medium">All Systems Operational</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <Cpu className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">CPU Usage</h3>
              <p className="text-2xl font-bold text-green-700 mt-1">23%</p>
              <p className="text-sm text-gray-600">Normal</p>
            </div>

            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Server className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Memory</h3>
              <p className="text-2xl font-bold text-blue-700 mt-1">67%</p>
              <p className="text-sm text-gray-600">Optimal</p>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <Network className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Network</h3>
              <p className="text-2xl font-bold text-purple-700 mt-1">1.2GB/s</p>
              <p className="text-sm text-gray-600">Excellent</p>
            </div>
          </div>
        </section>
      </div>

      {/* Maximized Chat Modal */}
      <AnimatePresence>
        {isChatMaximized && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsChatMaximized(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <Bot className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">AI Assistant - Expanded View</h3>
                    <p className="text-sm text-gray-600">Enhanced chat experience with full capabilities</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsChatMaximized(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close expanded chat"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <ChatInterface isModal={true} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

