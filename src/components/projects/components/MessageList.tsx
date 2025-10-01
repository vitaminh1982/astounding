/**
 * Message list component for displaying chat messages
 */
import React from 'react';
import MessageBubble from './MessageBubble';
import { Message } from '../types';

interface MessageListProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onConvertMessage: (messageId: string, type: 'task' | 'document') => void;
  formatFileSize: (bytes: number) => string;
}

/**
 * MessageList displays all chat messages in a scrollable container
 */
const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  messagesEndRef, 
  onConvertMessage, 
  formatFileSize 
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onConvertMessage={onConvertMessage}
            formatFileSize={formatFileSize}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;