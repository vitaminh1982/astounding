import React, { useRef, useEffect } from 'react';
import { Message, AgentConfig } from '../types';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

interface ChatAreaProps {
  agentConfig: AgentConfig;
  messages: Message[];
  isThinking: boolean;
  isTyping: boolean;
  displayText: string;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  agentConfig,
  messages,
  isThinking,
  isTyping,
  displayText
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, displayText, isThinking]);

  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md dark:shadow-gray-900 p-4 mb-4 transition-colors">
      <div className="space-y-4">
        {messages.map((message, index) => (
          <MessageBubble
            key={index}
            message={message}
            agentAvatar={agentConfig.avatar || '👩‍💼'}
          />
        ))}
        
        <TypingIndicator
          isThinking={isThinking}
          isTyping={isTyping}
          displayText={displayText}
          agentAvatar={agentConfig.avatar || '👩‍💼'}
        />
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default React.memo(ChatArea);
