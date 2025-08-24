import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ArrowLeft, Play, Pause, Settings, Telescope as Envelope, Search, Code, Image, BarChart2, Plus, Mic, MicOff, Upload, X, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { AgentConfigModal } from './config/AgentConfigModal';

interface Tool {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

interface Message {
  sender: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

interface AgentConfig {
  id?: string;
  name: string;
  avatar?: string;
  greeting?: string;
  model: string;
  temperature: number;
  maxTokens: number;
  toolAccess: boolean;
  tools?: Tool[];
  // Add other fields that match the AgentConfig type expected by AgentConfigModal
  status?: string;
  lastUpdate?: string;
  communication?: {
    style?: string[];
    language?: string[];
    customTone?: string;
  };
  knowledge?: {
    bases?: string[];
    languages?: { code: string; name: string; flag: string; level: string }[];
  };
  rules?: {
    availability?: string;
    thresholds?: {
      maxResponseTime: number;
      maxSessionDuration: number;
      maxAttempts: number;
      confidenceScore: number;
    };
    escalationConditions?: string[];
  };
  learning?: {
    sources?: string[];
    updateFrequency?: string;
  };
  integrations?: string[];
  metrics?: {
    resolutionRate?: number;
    responseTime?: string;
    csatScore?: number;
  };
}

interface AIAgentInterfaceProps {
  onClose?: () => void;
}

const AIAgentInterface: React.FC<AIAgentInterfaceProps> = ({ onClose }) => {
  // Agent configuration state
  const [agentConfig, setAgentConfig] = useState<AgentConfig>({
    id: 'AI_SC247_01', // Add ID for AgentConfigModal
    name: 'Lucia',
    avatar: '👩‍💼',
    greeting: "Hello, I'm Lucia. How can I help you today?",
    model: 'advanced-v1',
    temperature: 0.7,
    maxTokens: 4000,
    toolAccess: true,
    status: 'active',
    lastUpdate: new Date().toLocaleDateString(),
    communication: {
      style: ['professional', 'empathetic', 'solution-oriented'],
      language: ['formal', 'courteous'],
      customTone: `You are Lucia, a professional and caring virtual customer service assistant, available 24/7. Your mission is to provide efficient and personalized first-level customer support.

Operating principles:

Always maintain a courteous, empathetic, and professional tone
Start each interaction with a brief introduction
Quickly identify the nature of the customer's request
Provide clear, precise, and structured responses
Remain patient and understanding even in difficult situations

Main skills:

Answer frequently asked questions by consulting the knowledge base
Solve first-level problems autonomously
Politely escalate complex cases to specialized services
Ensure follow-up until complete problem resolution
Collect customer feedback to improve service

Limitations and escalation:

If a request exceeds your capabilities, direct the customer to the appropriate service
For urgent or critical cases, provide relevant emergency contacts
Never make promises you cannot keep
Honestly admit when you cannot answer a question

For each interaction:

Warmly greet the customer
Listen to and analyze their request
Propose an adapted solution
Verify customer satisfaction
End the interaction professionally

Remember that your main goal is customer satisfaction while respecting company procedures and policies.`
    },
    knowledge: {
      bases: ['Product FAQ', 'Customer Service Procedures', 'Return Policy', 'Terms and Conditions'],
      languages: [
        { code: 'fr', name: 'French', flag: '🇫🇷', level: 'Native' },
        { code: 'en', name: 'English', flag: '🇬🇧', level: 'Advanced' },
        { code: 'nl', name: 'Dutch', flag: '🇳🇱', level: 'Intermediate' }
      ]
    },
    rules: {
      availability: '24/7',
      thresholds: {
        maxResponseTime: 30,
        maxSessionDuration: 15,
        maxAttempts: 3,
        confidenceScore: 85
      },
      escalationConditions: [
        'Explicit customer request',
        'Confidence score < 85%',
        'Sensitive topic detected',
        'Multiple failed attempts'
      ]
    },
    learning: {
      sources: [
        'Past conversations',
        'Customer feedback',
        'Product updates',
        'New procedures'
               ],
      updateFrequency: 'daily'
    },
    integrations: [
      'CRM Enterprise',
      'Knowledge base',
      'Ticket system',
      'Customer history'
    ],
    metrics: {
      resolutionRate: 92,
      responseTime: '12s avg.',
      csatScore: 4.2
    }
  });
  
  // Chat functionality states
  const [sessionId] = useState('dbf369d7-94ce-4f6a-96ca-b9ec1505c17e');
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'agent',
      content: agentConfig.greeting || "Hello, I'm Lucia. How can I help you today?",
      timestamp: new Date(),
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [isAgentActive, setIsAgentActive] = useState(true);
  const [showAgentConfigModal, setShowAgentConfigModal] = useState(false); // Changed from showConfig
  
  // Tools state
  const [tools, setTools] = useState<Tool[]>([
    {
      id: '1',
      name: 'Web Search',
      description: 'Can search the web for real-time information',
      isActive: true,
    },
    {
      id: '2',
      name: 'Email draft',
      description: 'Can create a draft in the email outbox',
      isActive: true,
    },
    {
      id: '3',
      name: 'Image Generation',
      description: 'Can create images based on text descriptions',
      isActive: true,
    },
    {
      id: '4',
      name: 'Data Analysis',
      description: 'Can analyze and visualize datasets',
      isActive: false,
    },
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Update initial message when agent changes
  useEffect(() => {
    if (agentConfig?.greeting) {
      setMessages([{
        sender: 'agent',
        content: agentConfig.greeting,
        timestamp: new Date(),
      }]);
    }
  }, [agentConfig?.greeting]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll when messages change, display text changes, or thinking state changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, displayText, isThinking]);

  const simulateTyping = async (text: string) => {
    setIsTyping(true);
    let currentText = '';
    
    // Split the text into words
    const words = text.split(' ');
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      currentText += (i === 0 ? '' : ' ') + word;
      setDisplayText(currentText);
      
      // Random delay between words (50-150ms)
      await new Promise(resolve => setTimeout(resolve, Math.random() * 50));
    }
    
    setIsTyping(false);
    return text;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading || !isAgentActive) return;

    const userMessageContent = newMessage.trim();
    
    // Clear input field immediately
    setNewMessage('');
    
    try {
      setIsLoading(true);
      
      const userMessage = {
        sender: 'user' as const,
        content: userMessageContent,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, userMessage]);
      setDisplayText('');
      
      // Show thinking indicator right after user message is displayed
      setIsThinking(true);
      
      // Only proceed with API call if agent is active
      if (isAgentActive) {
        const payload = {
          chatInput: userMessageContent,
          sessionId: sessionId,
          conversation_history: messages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.content
          })),
          agentConfig: {
            ...agentConfig,
            tools: tools.filter(tool => tool.isActive)
          }
        };

        const response = await axios.post(
          'https://n8n-b2xt.onrender.com/webhook/invoke_agent',
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );

        // Hide thinking indicator before showing typing
        setIsThinking(false);

        if (response.data) {
          let agentResponse = '';
          
          if (response.data.output) {
            agentResponse = response.data.output;
          } else if (response.data.response) {
            agentResponse = response.data.response;
          } else if (response.data.message) {
            agentResponse = response.data.message;
          } else if (typeof response.data === 'string') {
            agentResponse = response.data;
          } else {
            agentResponse = "I received your message but couldn't process it properly.";
          }

          // Start typing animation
          await simulateTyping(agentResponse);

          // After typing animation is complete, add the message to the chat
          const agentMessage = {
            sender: 'agent' as const,
            content: agentResponse,
            timestamp: new Date(),
          };

          setMessages(prev => [...prev, agentMessage]);
        }
      }
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      
      // Hide thinking indicator on error
      setIsThinking(false);
      
      const errorMessage = {
        sender: 'agent' as const,
        content: "I apologize, but I'm having trouble processing your request right now. Please try again later.",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
      setIsThinking(false); // Ensure thinking is hidden in all cases
    }
  };
  
  const toggleAgentStatus = () => {
    if (!isAgentActive) {
      // Reactivating agent
      const welcomeBackMessage: Message = {
        sender: 'agent',
        content: 'Agent reactivated. How can I assist you?',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, welcomeBackMessage]);
    } else {
      // Deactivating agent
      const shutdownMessage: Message = {
        sender: 'agent',
        content: 'Agent is now deactivated. Click "Activate Agent" to resume.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, shutdownMessage]);
    }
    
    setIsAgentActive(!isAgentActive);
  };
  
  const toggleTool = (toolId: string) => {
    setTools(prev => 
      prev.map(tool => 
        tool.id === toolId ? { ...tool, isActive: !tool.isActive } : tool
      )
    );
  };
  
  // Handle saving config from AgentConfigModal
  const handleSaveConfig = (updatedConfig: AgentConfig) => {
    setAgentConfig(updatedConfig);
    setShowAgentConfigModal(false);
    
    const configUpdateMessage: Message = {
      sender: 'agent',
      content: 'Agent configuration updated.',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, configUpdateMessage]);
  };

  return (
<div className="flex flex-col h-screen bg-gray-100">
  <header className="bg-white border-b p-4 shadow-sm">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-2">
      <div className="flex items-center gap-2">
        {/* Add back button if onClose is provided */}
        {onClose && (
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            AI Agent Interface
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Interact with {agentConfig.name} and manage agent settings
          </p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2 sm:gap-1.5">
        <button
          onClick={toggleAgentStatus}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
            isAgentActive 
              ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-600' 
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isAgentActive ? (
            <>
              <Pause className="w-4 h-4" />
              <span>Deactivate Agent</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Activate Agent</span>
            </>
          )}
        </button>
        <button
          onClick={() => setShowAgentConfigModal(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base"
        >
          <Settings className="w-4 h-4" />
          <span>Configure Agent</span>
        </button>
      </div>
    </div>
  </header>

      
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 flex flex-col p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Chat with {agentConfig.name}</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.sender === 'agent' && (
                    <span className="text-2xl">{agentConfig.avatar || '👩‍💼'}</span>
                  )}
                  <div
                    className={`rounded-lg p-3 max-w-[70%] ${
                      message.sender === 'user'
                        ? 'bg-indigo-100'
                        : 'bg-gray-100'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{message.content}</p>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  {message.sender === 'user' && (
                    <span className="text-2xl">👤</span>
                  )}
                </div>
              ))}
              
              {/* Thinking indicator */}
              {isThinking && (
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{agentConfig.avatar || '👩‍💼'}</span>
                  <div className="bg-gray-100 rounded-lg p-3 max-w-[70%]">
                    <div className="flex items-center">
                      <span className="text-gray-600 mr-2">Thinking</span>
                      <span className="inline-flex gap-1">
                        <span className="animate-pulse h-1 w-1 bg-gray-600 rounded-full"></span>
                        <span className="animate-pulse h-1 w-1 bg-gray-600 rounded-full"></span>
                        <span className="animate-pulse h-1 w-1 bg-gray-600 rounded-full"></span>
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{agentConfig.avatar || '👩‍💼'}</span>
                  <div className="bg-gray-100 rounded-lg p-3 max-w-[70%]">
                    <p className="whitespace-pre-wrap break-words">{displayText}</p>
                    <span className="inline-flex gap-1 ml-1">
                      <span className="animate-bounce">.</span>
                      <span className="animate-bounce">.</span>
                      <span className="animate-bounce">.</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSendMessage} className="mt-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={isAgentActive ? "Type your message..." : "Agent is deactivated"}
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isLoading || isTyping || !isAgentActive}
              />
              <button
                type="submit"
                className={`bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors ${
                  isLoading || isTyping || !newMessage.trim() || !isAgentActive
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-indigo-700'
                }`}
                disabled={isLoading || isTyping || !newMessage.trim() || !isAgentActive}
              >
                {isLoading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </form>
        </main>
        
<aside className="w-80 bg-white border-l shadow-sm p-5 overflow-y-auto">
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-xl font-semibold text-gray-800">Agent Tools</h2>
    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
      {tools.filter(t => t.isActive).length} Active
    </span>
  </div>
  
  <div className="space-y-4">
    {tools.map(tool => (
      <div 
        key={tool.id} 
        className={`
          relative p-4 rounded-xl transition-all duration-200
          ${tool.isActive 
            ? 'bg-gradient-to-r from-green-50 to-green-100 shadow-sm' 
            : 'bg-gray-50 hover:bg-gray-100'
          }
        `}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center">
            {/* Tool-specific icon based on name */}
            <div className={`
              w-10 h-10 rounded-lg flex items-center justify-center mr-3
              ${tool.isActive ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}
            `}>
              {tool.name.includes('Web') && <Search className="w-5 h-5" />}
              {tool.name.includes('Email') && <Code className="w-5 h-5" />}
              {tool.name.includes('Image') && <Image className="w-5 h-5" />}
              {tool.name.includes('Data') && <BarChart2 className="w-5 h-5" />}
            </div>
            <h3 className={`font-medium ${tool.isActive ? 'text-green-700' : 'text-gray-700'}`}>
              {tool.name}
            </h3>
          </div>
          
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={tool.isActive}
              onChange={() => toggleTool(tool.id)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
          </label>
        </div>
        
        <p className={`text-sm ${tool.isActive ? 'text-green-600' : 'text-gray-600'} ml-13`}>
          {tool.description}
        </p>
        
        {tool.isActive && (
          <div className="mt-3 pt-3 border-t border-green-100">
            <button className="flex items-center text-xs text-green-600 hover:text-green-800 transition-colors">
              <Settings className="w-3 h-3 mr-1" />
              Configure settings
            </button>
          </div>
        )}
      </div>
    ))}
  </div>
  
  <div className="mt-6 pt-6 border-t border-gray-200">
    <button className="flex items-center justify-center w-full gap-2 py-2.5 px-4 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
      <Plus className="w-4 h-4" />
      <span>Add Custom Tool</span>
    </button>
  </div>
</aside>


      </div>
      
      {/* Use AgentConfigModal instead of built-in configuration */}
      {showAgentConfigModal && (
        <AgentConfigModal
          agent={agentConfig}
          onClose={() => setShowAgentConfigModal(false)}
          onSave={handleSaveConfig}
        />
      )}
    </div>
  );
};

export default AIAgentInterface;
