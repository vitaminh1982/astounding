import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  User,
  Search, // Added Search icon
  Settings, // Used for the "magic wand/settings" icon
  Mic, // Microphone icon
  CornerUpLeft, // Return/undo arrow icon
  MessageSquare, Users, FileText, Globe, Lightbulb, Cloud, GitBranch, Shield, Package, Layout
} from 'lucide-react';
import { Page } from '../App'; // Assuming 'Page' type is defined in App.tsx

interface OrchestrationPageProps {
  onNavigate: (page: Page) => void;
}

// Define the structure for AI message content, including reasoning and agent calls
interface AiContent {
  reasoningSteps?: string[];
  agentCalls?: { agentName: string; purpose: string; }[];
  finalResponse: string | JSX.Element; // Allow JSX for richer responses
}

interface Message {
  type: 'user' | 'ai';
  text?: string; // For user messages
  content?: AiContent; // For AI messages
}

// Mock data for AI agents that the Super AI might interact with
const mockAgents = [
  { id: 'customer-support', name: 'Customer Support Agent', capability: 'handles inquiries, provides solutions, generates FAQs' },
  { id: 'sales-assistant', name: 'Sales Assistant Agent', capability: 'qualifies leads, generates quotes, schedules demos' },
  { id: 'ecommerce-manager', name: 'E-commerce Manager Agent', capability: 'manages product listings, processes orders, updates inventory' },
  { id: 'billing-service', name: 'Billing Service Agent', capability: 'processes payments, handles billing inquiries, sends invoices' },
  { id: 'hr-assistant', name: 'HR Assistant Agent', capability: 'manages employee data, answers HR questions, processes leave requests' },
  { id: 'data-analyst', name: 'Data Analyst Agent', capability: 'processes data, generates reports, visualizes trends' },
  { id: 'workflow-manager', name: 'Workflow Manager Agent', capability: 'creates, modifies, and manages multi-agent workflows' },
  { id: 'security-auditor', name: 'Security Auditor Agent', capability: 'monitors system for vulnerabilities, performs compliance checks' },
  { id: 'deployment-engineer', name: 'Deployment Engineer Agent', capability: 'deploys and scales agents and services' },
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
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom of the conversation history
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); [1, 2, 4, 8, 9]
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversationHistory]);

  const handleSendPrompt = () => {
    if (promptInput.trim() === '') return;

    const userMessage: Message = { type: 'user', text: promptInput };
    setConversationHistory((prev) => [...prev, userMessage]);
    setPromptInput('');

    let aiContent: AiContent;
    const lowerCasePrompt = promptInput.toLowerCase();

    // --- Reasoning and Agent Call Simulation Logic ---
    if (lowerCasePrompt.includes('hello') || lowerCasePrompt.includes('hi')) {
      aiContent = {
        reasoningSteps: ["Acknowledging greeting."],
        finalResponse: "Hello there! How can I assist you with your multi-agent ecosystem today?",
      };
    } else if (lowerCasePrompt.includes('active agents') || lowerCasePrompt.includes('agents status')) {
      aiContent = {
        reasoningSteps: [
          "Understanding request for agent status.",
          "Querying Agent Management System for active agents.",
        ],
        agentCalls: [
          { agentName: 'Agent Management System', purpose: 'Retrieve active agent list' }
        ],
        finalResponse: "Currently, there are 24 active agents in your ecosystem. The most active ones are the Customer Support Agent and the Sales Assistant Agent.",
      };
    } else if (lowerCasePrompt.includes('new workflow') || lowerCasePrompt.includes('create workflow')) {
      const workflowNameMatch = promptInput.match(/(?:create|new)\s+(.+?)\s+workflow/i);
      const workflowName = workflowNameMatch ? workflowNameMatch[1] : 'a new unspecified';

      aiContent = {
        reasoningSteps: [
          `Interpreting request to create ${workflowName} workflow.`,
          "Identifying the need for workflow definition and agent allocation.",
          "Preparing to interact with Workflow Manager Agent.",
        ],
        agentCalls: [
          { agentName: 'Workflow Manager Agent', purpose: `Initiating creation of ${workflowName} workflow` },
          { agentName: 'Sales Assistant Agent', purpose: 'Potentially involving for lead handling in new workflow' },
          { agentName: 'Billing Service Agent', purpose: 'Potentially involving for financial processes in new workflow' },
        ],
        finalResponse: `Alright, I'm setting up ${workflowName} workflow. Please provide more details on its steps and involved agents, or I can suggest a template.`,
      };
    } else if (lowerCasePrompt.includes('system health') || lowerCasePrompt.includes('health check')) {
      aiContent = {
        reasoningSteps: [
          "Assessing overall system status.",
          "Checking monitoring logs and performance metrics.",
        ],
        agentCalls: [
          { agentName: 'Monitoring & Analytics System', purpose: 'Retrieve system health metrics' },
          { agentName: 'Security Auditor Agent', purpose: 'Perform quick security compliance check' },
        ],
        finalResponse: (
          <>
            System health is **excellent** with 99.8% uptime. All core services are operational.
            <div className="mt-2 text-xs text-gray-400">
              <CheckCircle className="inline-block w-4 h-4 mr-1 text-green-400" /> No critical alerts.
            </div>
          </>
        ),
      };
    } else if (lowerCasePrompt.includes('analyze sales performance') || lowerCasePrompt.includes('sales report')) {
      aiContent = {
        reasoningSteps: [
          "Understanding request for sales data analysis.",
          "Identifying relevant agents for data retrieval and processing.",
        ],
        agentCalls: [
          { agentName: 'Sales Assistant Agent', purpose: 'Extracting recent sales transaction data' },
          { agentName: 'Data Analyst Agent', purpose: 'Processing sales data and generating insights' },
        ],
        finalResponse: (
          <>
            Analyzing recent sales performance...
            <div className="mt-2 text-sm text-gray-300">
              <p>Sales increased by **10%** last quarter.</p>
              <p>Top performing product category: **Electronics**.</p>
              <p>Sales Assistant Agent successfully qualified **892 new leads** this month.</p>
            </div>
          </>
        ),
      };
    } else if (lowerCasePrompt.includes('deploy new agent')) {
        aiContent = {
            reasoningSteps: [
                "Interpreting request to deploy a new AI agent.",
                "Consulting with Deployment Engineer Agent for resource allocation and configuration.",
            ],
            agentCalls: [
                { agentName: 'Deployment Engineer Agent', purpose: 'Preparing environment for new agent deployment' },
                { agentName: 'Agent Management System', purpose: 'Registering new agent configuration' },
            ],
            finalResponse: "To deploy a new agent, please specify its type (e.g., 'Customer Support', 'Data Analyst') and any specific initial configurations. I'm ready to proceed once you provide these details."
        };
    }
    else {
      aiContent = {
        reasoningSteps: ["Attempting to understand the request.", "Looking for keywords related to agent management, workflow, or system status."],
        finalResponse: "I'm not sure how to respond to that specific query yet. Could you please rephrase or ask something related to managing your AI agents, workflows, or system status?",
      };
    }

    setTimeout(() => {
      setConversationHistory((prev) => [...prev, { type: 'ai', content: aiContent }]);
    }, 1000); // Simulate a short delay for AI response
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent new line in textarea
      handleSendPrompt();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col text-white">
      {/* Header - Aligned with the new design's feel */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
        <div className="p-2 bg-indigo-500 rounded-lg">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">
            Orchestration AI Assistant
          </h1>
          <p className="text-sm text-gray-400">
            Your command center for multi-agent AI ecosystems
          </p>
        </div>
      </div>

      {/* Conversation Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {conversationHistory.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex items-start max-w-[80%] p-3 rounded-xl shadow-md ${
                message.type === 'user'
                  ? 'bg-indigo-700 text-white'
                  : 'bg-gray-800 text-gray-100'
              }`}
            >
              {message.type === 'ai' && (
                <Bot className="w-5 h-5 text-indigo-400 mr-2 flex-shrink-0" />
              )}
              {message.type === 'user' && (
                <User className="w-5 h-5 text-indigo-200 mr-2 flex-shrink-0" />
              )}
              <div className="text-sm">
                {message.type === 'user' && message.text}
                {message.type === 'ai' && message.content && (
                  <>
                    {message.content.reasoningSteps && message.content.reasoningSteps.length > 0 && (
                      <div className="mb-2 p-2 bg-gray-700 rounded-lg text-gray-300 text-xs">
                        <p className="font-semibold text-gray-200 mb-1">Reasoning:</p>
                        <ul className="list-disc list-inside space-y-0.5">
                          {message.content.reasoningSteps.map((step, i) => (
                            <li key={i}>{step}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {message.content.agentCalls && message.content.agentCalls.length > 0 && (
                      <div className="mb-2 p-2 bg-gray-700 rounded-lg text-gray-300 text-xs">
                        <p className="font-semibold text-gray-200 mb-1">Agent Calls:</p>
                        <ul className="list-disc list-inside space-y-0.5">
                          {message.content.agentCalls.map((call, i) => (
                            <li key={i}>
                              <span className="font-medium text-indigo-300">{call.agentName}:</span> {call.purpose}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="text-base text-white">
                      {message.content.finalResponse}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* Scroll to this element */}
      </div>

      {/* Personalized Tools Banner (Simulated) */}
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8 mb-4">
        <div className="bg-gray-800 rounded-lg p-3 flex items-center justify-between text-sm text-gray-300 shadow-lg">
          <div className="flex items-center gap-2">
            {/* Replace with actual icons or images for integrated apps */}
            <span className="bg-red-600 rounded-full w-5 h-5 flex items-center justify-center text-xs">M</span>
            <span className="bg-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs">G</span>
            <span className="bg-yellow-600 rounded-full w-5 h-5 flex items-center justify-center text-xs">C</span>
            <span className="bg-green-600 rounded-full w-5 h-5 flex items-center justify-center text-xs">D</span>
            <span>Genspark supports personalized tools</span>
          </div>
          <button className="text-gray-400 hover:text-white" onClick={() => {/* Close banner */}}>
            &times;
          </button>
        </div>
      </div>

      {/* Prompt Input Area - Styled to match the image */}
      <div className="sticky bottom-0 bg-gray-900 pb-4 pt-2 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-3xl relative flex items-center bg-gray-700 rounded-3xl pr-2 shadow-lg">
          <button className="p-3 text-gray-400 hover:text-white rounded-l-3xl">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-3 text-gray-400 hover:text-white">
            <Settings className="w-5 h-5" /> {/* Using Settings for the magic wand look */}
          </button>
          <textarea
            className="flex-1 resize-none bg-transparent py-3 px-2 focus:outline-none text-white placeholder-gray-400 text-base"
            rows={1}
            placeholder="Ask anything, create anything"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ minHeight: '48px', maxHeight: '120px', overflowY: 'auto' }}
          />
          <button className="p-3 text-gray-400 hover:text-white">
            <Mic className="w-5 h-5" />
          </button>
          <button
            onClick={handleSendPrompt}
            className="p-3 text-gray-400 hover:text-white rounded-r-3xl"
            aria-label="Send message"
          >
            <CornerUpLeft className="w-5 h-5 transform rotate-90" /> {/* Rotated arrow for "return" */}
          </button>
        </div>

        {/* Bottom Row of Tool Icons */}
        <div className="flex justify-center flex-wrap gap-x-4 gap-y-2 mt-6">
          <div className="flex flex-col items-center cursor-pointer text-xs text-gray-300 hover:text-white transition-colors duration-200">
            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-1 border border-gray-700 hover:border-indigo-500">
              <Layout className="w-6 h-6 text-orange-400" />
            </div>
            AI Slides
          </div>
          <div className="flex flex-col items-center cursor-pointer text-xs text-gray-300 hover:text-white transition-colors duration-200">
            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-1 border border-gray-700 hover:border-indigo-500">
              <Table className="w-6 h-6 text-green-400" /> {/* Assuming Table for AI Sheets */}
            </div>
            AI Sheets
          </div>
          <div className="flex flex-col items-center cursor-pointer text-xs text-gray-300 hover:text-white transition-colors duration-200">
            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-1 border border-gray-700 hover:border-indigo-500">
              <FileText className="w-6 h-6 text-blue-400" />
            </div>
            AI Docs <span className="text-[10px] bg-red-500 text-white px-1 rounded-md ml-0.5">New</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer text-xs text-gray-300 hover:text-white transition-colors duration-200">
            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-1 border border-gray-700 hover:border-indigo-500">
              <Lightbulb className="w-6 h-6 text-purple-400" /> {/* Placeholder for AI Pods */}
            </div>
            AI Pods <span className="text-[10px] bg-red-500 text-white px-1 rounded-md ml-0.5">New</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer text-xs text-gray-300 hover:text-white transition-colors duration-200">
            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-1 border border-gray-700 hover:border-indigo-500">
              <MessageSquare className="w-6 h-6 text-teal-400" />
            </div>
            AI Chat
          </div>
          <div className="flex flex-col items-center cursor-pointer text-xs text-gray-300 hover:text-white transition-colors duration-200">
            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-1 border border-gray-700 hover:border-indigo-500">
              <Image className="w-6 h-6 text-yellow-400" /> {/* Assuming Image for AI Image */}
            </div>
            AI Image
          </div>
          <div className="flex flex-col items-center cursor-pointer text-xs text-gray-300 hover:text-white transition-colors duration-200">
            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-1 border border-gray-700 hover:border-indigo-500">
              <Play className="w-6 h-6 text-red-400" /> {/* Assuming Play for AI Video */}
            </div>
            AI Video
          </div>
          <div className="flex flex-col items-center cursor-pointer text-xs text-gray-300 hover:text-white transition-colors duration-200">
            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-1 border border-gray-700 hover:border-indigo-500">
              <Globe className="w-6 h-6 text-lime-400" /> {/* Assuming Globe for Deep Research */}
            </div>
            Deep Research
          </div>
          <div className="flex flex-col items-center cursor-pointer text-xs text-gray-300 hover:text-white transition-colors duration-200">
            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-1 border border-gray-700 hover:border-indigo-500">
              <Phone className="w-6 h-6 text-pink-400" /> {/* Assuming Phone for Call For Me */}
            </div>
            Call For Me
          </div>
          <div className="flex flex-col items-center cursor-pointer text-xs text-gray-300 hover:text-white transition-colors duration-200">
            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-1 border border-gray-700 hover:border-indigo-500">
              <Download className="w-6 h-6 text-cyan-400" /> {/* Assuming Download for Download For Me */}
            </div>
            Download For Me
          </div>
          <div className="flex flex-col items-center cursor-pointer text-xs text-gray-300 hover:text-white transition-colors duration-200">
            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-1 border border-gray-700 hover:border-indigo-500">
              <Bot className="w-6 h-6 text-gray-300" />
            </div>
            All Agents
          </div>
        </div>
      </div>
    </div>
  );
}

// Additional icons imported for the bottom bar, replace with actual if from specific library or custom SVGs
// For demonstration, these are placeholders if not already imported from 'lucide-react'
// If these are not part of lucide-react, you'd import them from elsewhere or define them as SVG components.
// For simplicity, I'm assuming they exist or using close equivalents from lucide-react.
import { Table, Image, Play, Phone, Download } from 'lucide-react';
