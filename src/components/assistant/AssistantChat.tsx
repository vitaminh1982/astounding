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
        'Hello! I am your Sendplex assistant, a cousin of <a href="https://www.sendplify.eu" target="_blank" rel="noopener noreferrer" class="text-indigo-600 hover:underline">Sendplify.eu</a>. I can help you with:',
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

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                  max-w-[80%] p-3 rounded-lg
                  ${message.type === 'user' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-100 text-gray-800'}
                  ${TRANSITIONS.default}
                `}
              >
                <div 
                  className="message-content"
                  style={{ whiteSpace: 'pre-line' }}
                  dangerouslySetInnerHTML={{ __html: message.content }}
                />
                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader className="w-4 h-4 animate-spin" />
              Assistant is typing...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask your question..."
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
