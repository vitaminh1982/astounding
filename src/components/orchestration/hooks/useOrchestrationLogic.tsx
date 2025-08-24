import { useState, useCallback } from 'react';
import { Message, AiContent } from '../types';

export const useOrchestrationLogic = () => {
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
              <li>"Show active agents"</li>
              <li>"Create a new customer onboarding workflow"</li>
              <li>"Analyze sales performance"</li>
              <li>"What's the system health?"</li>
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
                {[
                  'Customer Support', 'Sales Assistant', 'Technical Support', 'E-commerce',
                  'Data Analytics', 'Content Generator', 'Marketing Automation', 'HR Assistant',
                  'Financial Advisor', 'Security Monitor', 'Inventory Manager', 'Translation Service',
                  'Email Classifier', 'Document Processor', 'Quality Assurance', 'Workflow Orchestrator',
                  'Image Recognition', 'Voice Assistant', 'Anomaly Detection', 'Knowledge Base',
                  'Backup Manager', 'Performance Monitor', 'API Gateway', 'Report Generator'
                ].map((agent, index) => {
                  const statuses = ['Active', 'High Load', 'Processing', 'Maintenance'];
                  const colors = ['text-green-400', 'text-yellow-400', 'text-blue-400', 'text-orange-400'];
                  const statusIndex = index % statuses.length;
                  
                  return (
                    <div key={agent} className="flex justify-between items-center p-2 bg-gray-700 rounded">
                      <span className="text-gray-200">{agent}:</span>
                      <span className={`font-medium ${colors[statusIndex]}`}>
                        {statuses[statusIndex]}
                      </span>
                    </div>
                  );
                })}
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
                  <span className="text-green-600">✓</span>
                  <span className="font-bold text-green-800">Overall: 99.8%</span>
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">📊</span>
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

  const handleSendPrompt = useCallback(() => {
    if (!promptInput.trim() || isLoading) return;

    const userMessage: Message = {
      type: 'user',
      text: promptInput,
      timestamp: new Date()
    };

    setConversationHistory(prev => [...prev, userMessage]);
    setIsLoading(true);
    setPromptInput('');

    // Simulate AI processing
    setTimeout(() => {
      const aiResponse = generateAIResponse(promptInput);
      const aiMessage: Message = {
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };

      setConversationHistory(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  }, [promptInput, isLoading, generateAIResponse]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendPrompt();
    }
  }, [handleSendPrompt]);

  const handleRefresh = useCallback(() => {
    console.log('Refreshing system metrics...');
  }, []);

  return {
    promptInput,
    setPromptInput,
    conversationHistory,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedTimeRange,
    setSelectedTimeRange,
    isChatMaximized,
    setIsChatMaximized,
    handleSendPrompt,
    handleKeyDown,
    handleRefresh
  };
};