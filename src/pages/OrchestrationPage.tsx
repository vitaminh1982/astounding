import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send,
  Sparkles,
  User,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Page } from '../App'; // Assuming 'Page' type is defined in App.tsx

interface OrchestrationPageProps {
  onNavigate: (page: Page) => void;
}

interface Message {
  type: 'user' | 'ai';
  text: string;
}

export default function OrchestrationPage({ onNavigate }: OrchestrationPageProps) {
  const [promptInput, setPromptInput] = useState<string>('');
  const [conversationHistory, setConversationHistory] = useState<Message[]>([
    { type: 'ai', text: "Hello! I'm your Multi-Agent Orchestration AI. How can I assist you today? You can ask me things like 'Show active agents', 'Create a new workflow', or 'What's the system health?'" }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom of the conversation history
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversationHistory]);

  const handleSendPrompt = () => {
    if (promptInput.trim() === '') return;

    const userMessage: Message = { type: 'user', text: promptInput };
    setConversationHistory((prev) => [...prev, userMessage]);
    setPromptInput('');

    // Simulate AI response based on prompt
    let aiResponseText: string = "I'm not sure how to respond to that. Please try a different command, like 'show active agents' or 'create workflow'.";
    const lowerCasePrompt = promptInput.toLowerCase();

    if (lowerCasePrompt.includes('hello') || lowerCasePrompt.includes('hi')) {
      aiResponseText = "Hello! How can I assist you with your multi-agent ecosystem today?";
    } else if (lowerCasePrompt.includes('active agents') || lowerCasePrompt.includes('agents status')) {
      aiResponseText = "Currently, there are 24 active agents in your ecosystem.";
    } else if (lowerCasePrompt.includes('running workflows') || lowerCasePrompt.includes('workflows status')) {
      aiResponseText = "There are 8 active workflows currently running.";
    } else if (lowerCasePrompt.includes('system health') || lowerCasePrompt.includes('health check')) {
      aiResponseText = "System health is excellent with 99.8% uptime. All core services are operational.";
    } else if (lowerCasePrompt.includes('cpu usage') || lowerCasePrompt.includes('resource usage')) {
      aiResponseText = "Current resource usage is 78% CPU and 65% memory, which is within optimal range.";
    } else if (lowerCasePrompt.includes('create workflow') || lowerCasePrompt.includes('new workflow')) {
      aiResponseText = "To create a new workflow, please describe its purpose and the agents involved. For example: 'Create a workflow for customer onboarding using the Sales Assistant and Billing Service agents.'";
    } else if (lowerCasePrompt.includes('deploy agent') || lowerCasePrompt.includes('add agent')) {
      aiResponseText = "To deploy a new agent, please provide the agent's name, its primary function, and any specific configurations needed.";
    } else if (lowerCasePrompt.includes('monitor system') || lowerCasePrompt.includes('view activity')) {
      aiResponseText = "Navigating to the real-time activity dashboard for system monitoring. What specific metrics are you interested in?";
      // In a real app, this might trigger a navigation: onNavigate('orchestration-monitoring');
    } else if (lowerCasePrompt.includes('alerts') || lowerCasePrompt.includes('notifications')) {
      aiResponseText = "There is one active alert: HR Assistant workflow is paused due to scheduled maintenance, set to resume in 2 hours. All other systems are operational.";
    } else if (lowerCasePrompt.includes('agent management')) {
        aiResponseText = "Accessing Agent Management. Here you can configure, deploy, and manage all your AI agents.";
        // onNavigate('orchestration-agent-management');
    } else if (lowerCasePrompt.includes('workflow management')) {
        aiResponseText = "Accessing Workflow & Task Management. This section allows you to design, assign, and manage multi-agent workflows.";
        // onNavigate('orchestration-workflow-management');
    } else if (lowerCasePrompt.includes('resource management')) {
        aiResponseText = "Accessing Resource & Environment Management. Here you can optimize infrastructure and resource allocation.";
        // onNavigate('orchestration-resources');
    }

    setTimeout(() => {
      setConversationHistory((prev) => [...prev, { type: 'ai', text: aiResponseText }]);
    }, 500); // Simulate a short delay for AI response
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent new line in textarea
      handleSendPrompt();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3 shadow-sm">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Sparkles className="w-7 h-7 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            Orchestration AI Assistant
          </h1>
          <p className="text-sm text-gray-600">
            Interact with your multi-agent AI ecosystem through natural language
          </p>
        </div>
      </div>

      {/* Conversation Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-4">
        {conversationHistory.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`flex items-start max-w-[80%] p-3 rounded-lg shadow-sm ${
                message.type === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
              }`}
            >
              {message.type === 'ai' && (
                <Bot className="w-5 h-5 text-indigo-50 mr-2 flex-shrink-0" />
              )}
              {message.type === 'user' && (
                <User className="w-5 h-5 text-indigo-200 mr-2 flex-shrink-0" />
              )}
              <p className="text-sm break-words">{message.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* Scroll to this element */}
      </div>

      {/* Prompt Input Area */}
      <div className="border-t border-gray-200 bg-white p-4 sm:p-6 lg:p-8">
        <div className="relative flex items-center">
          <textarea
            className="flex-1 resize-none border border-gray-300 rounded-lg py-2 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 placeholder-gray-500 text-sm"
            rows={1}
            placeholder="Type your command or question..."
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ minHeight: '44px', maxHeight: '120px', overflowY: 'auto' }} // Added max-height and overflow-y
          />
          <button
            onClick={handleSendPrompt}
            className="absolute right-3 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">Press Enter to send. Shift+Enter for new line.</p>
      </div>
    </div>
  );
}
