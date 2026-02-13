import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { AgentConfig } from '../../../../types/agent-config';

interface PreviewProps {
  agent?: AgentConfig;
}

export default function Preview({ agent }: PreviewProps) {
  const [sessionId] = useState('dbf369d7-94ce-4f6a-96ca-b9ec1505c17e');
  const [messages, setMessages] = useState([
    {
      sender: 'agent',
      content: agent?.greeting || "Hello, I'm Lucia. How can I help you today?",
      timestamp: new Date(),
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const messagesEndRef = useRef(null);

  // Update initial message when agent changes
  useEffect(() => {
    if (agent?.greeting) {
      setMessages([{
        sender: 'agent',
        content: agent.greeting,
        timestamp: new Date(),
      }]);
    }
  }, [agent?.greeting]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll when messages change, display text changes, or thinking state changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, displayText, isThinking]);

  const simulateTyping = async (text) => {
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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading) return;

    const userMessageContent = newMessage.trim();
    
    // Clear input field immediately
    setNewMessage('');
    
    try {
      setIsLoading(true);
      
      const userMessage = {
        sender: 'user',
        content: userMessageContent,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, userMessage]);
      setDisplayText('');
      
      // Show thinking indicator right after user message is displayed
      setIsThinking(true);
      
      const payload = {
        chatInput: userMessageContent,
        sessionId: sessionId,
        conversation_history: messages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        // Optionally include agent configuration if you want to use it in your API call
        agentConfig: agent
      };

      
      const response = await axios.post(
        'https://miranki.app.n8n.cloud/webhook/invoke_agent',
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
          sender: 'agent',
          content: agentResponse,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, agentMessage]);
      }

    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      
      // Hide thinking indicator on error
      setIsThinking(false);
      
      const errorMessage = {
        sender: 'agent',
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Chat with {agent?.name || 'Agent'}</h3>
      </div>

      <div className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg p-4 space-y-4 transition-colors">
        <div className="space-y-4 h-[350px] overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.sender === 'agent' && (
                <span className="text-2xl">{agent?.avatar || '👩‍💼'}</span>
              )}
              <div
                className={`rounded-lg p-3 max-w-[70%] ${
                  message.sender === 'user'
                    ? 'bg-indigo-100 dark:bg-teal-900 text-gray-900 dark:text-gray-100'
                    : 'bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-gray-100'
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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
              <span className="text-2xl">{agent?.avatar || '👩‍💼'}</span>
              <div className="bg-gray-100 dark:bg-gray-600 rounded-lg p-3 max-w-[70%]">
                <div className="flex items-center">
                  <span className="text-gray-600 dark:text-gray-200 mr-2">Thinking</span>
                  <span className="inline-flex gap-1">
                    <span className="animate-pulse h-1 w-1 bg-gray-600 dark:bg-gray-300 rounded-full"></span>
                    <span className="animate-pulse h-1 w-1 bg-gray-600 dark:bg-gray-300 rounded-full" style={{ animationDelay: '0.2s' }}></span>
                    <span className="animate-pulse h-1 w-1 bg-gray-600 dark:bg-gray-300 rounded-full" style={{ animationDelay: '0.4s' }}></span>
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-start gap-3">
              <span className="text-2xl">{agent?.avatar || '👩‍💼'}</span>
              <div className="bg-gray-100 dark:bg-gray-600 rounded-lg p-3 max-w-[70%]">
                <p className="whitespace-pre-wrap break-words text-gray-900 dark:text-gray-100">{displayText}</p>
                <span className="inline-flex gap-1 ml-1">
                  <span className="animate-bounce text-gray-900 dark:text-gray-100">.</span>
                  <span className="animate-bounce text-gray-900 dark:text-gray-100" style={{ animationDelay: '0.2s' }}>.</span>
                  <span className="animate-bounce text-gray-900 dark:text-gray-100" style={{ animationDelay: '0.4s' }}>.</span>
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="mt-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-gray-500 dark:placeholder:text-gray-400"
              disabled={isLoading || isTyping}
            />
            <button
              type="submit"
              className={`bg-indigo-600 dark:bg-teal-600 text-white px-3 py-1 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-700 ${
                isLoading || isTyping || !newMessage.trim() 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-indigo-700 dark:hover:bg-teal-700'
              }`}
              disabled={isLoading || isTyping || !newMessage.trim()}
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
