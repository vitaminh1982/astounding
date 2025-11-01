import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader } from 'lucide-react';
import { TRANSITIONS } from '../../utils/animations';
import { getContextualHelp } from './assistantUtils';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AssistantChatProps {
  currentPath: string;
}

export default function AssistantChat({ currentPath }: AssistantChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{
      id: '1',
      type: 'assistant',
      content: [
        'Hello! I am your Sendplex assistant, a cousin of <a href="https://www.sendplify.eu" target="_blank" rel="noopener noreferrer" class="text-indigo-600 dark:text-teal-400 hover:text-indigo-700 dark:hover:text-teal-300 hover:underline transition-colors">Sendplify.eu</a>. I can help you with:',
        '- Navigating the interface',
        '- Understanding the features', 
        '- Following step-by-step guides',
        '- Solving basic technical problems',
        '',
        'What would you like to explore?'
      ].join('\n'),
      timestamp: new Date()
    }]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const contextualHelp = await getContextualHelp(currentPath, input);
    
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: contextualHelp,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 transition-colors">
      {/* Messages area */}
      <div className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                  max-w-[80%] p-3 rounded-lg shadow-sm transition-all duration-200
                  ${message.type === 'user' 
                    ? 'bg-indigo-600 dark:bg-teal-600 text-white shadow-md dark:shadow-gray-900' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 shadow-sm dark:shadow-gray-900'}
                `}
              >
                <div 
                  className="message-content prose prose-sm max-w-none"
                  style={{ whiteSpace: 'pre-line' }}
                  dangerouslySetInnerHTML={{ __html: message.content }}
                />
                <div className={`text-xs mt-1 transition-colors ${
                  message.type === 'user' 
                    ? 'text-white/70' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[80%] p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-sm dark:shadow-gray-900 transition-colors">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 transition-colors">
                  <Loader className="w-4 h-4 animate-spin text-indigo-600 dark:text-teal-500" />
                  <span className="text-sm">Assistant is typing...</span>
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                    <div className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 transition-colors">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask your question..."
            disabled={isTyping}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                     placeholder-gray-500 dark:placeholder-gray-400
                     focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 
                     focus:border-indigo-500 dark:focus:border-teal-500 
                     focus:ring-offset-2 dark:focus:ring-offset-gray-800
                     disabled:opacity-50 disabled:cursor-not-allowed
                     shadow-sm dark:shadow-gray-900 transition-all duration-200"
            aria-label="Type your message to the assistant"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="p-2 bg-indigo-600 dark:bg-teal-600 text-white rounded-lg 
                     hover:bg-indigo-700 dark:hover:bg-teal-700 
                     focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 
                     focus:ring-offset-2 dark:focus:ring-offset-gray-800
                     disabled:opacity-50 disabled:cursor-not-allowed
                     shadow-sm dark:shadow-gray-900 hover:shadow-md dark:hover:shadow-gray-800
                     transition-all duration-200 focus:outline-none"
            aria-label="Send message"
          >
            <Send className={`w-5 h-5 transition-transform ${
              !input.trim() || isTyping ? '' : 'hover:translate-x-0.5'
            }`} />
          </button>
        </div>
        
        {/* Helper text */}
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 transition-colors">
          Press Enter to send • Shift+Enter for new line
        </div>
      </div>

      {/* Custom styles for message content links */}
      <style jsx>{`
        .message-content a {
          color: #4F46E5;
          text-decoration: none;
          transition: colors 0.2s;
        }
        .message-content a:hover {
          color: #4338CA;
          text-decoration: underline;
        }
        @media (prefers-color-scheme: dark) {
          .message-content a {
            color: #2DD4BF;
          }
          .message-content a:hover {
            color: #14B8A6;
          }
        }
      `}</style>
    </div>
  );
}
