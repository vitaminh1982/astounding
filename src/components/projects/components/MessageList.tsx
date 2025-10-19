/**
 * Message list component
 */
import React from 'react';
import { Message } from '../types';
import MessageBubble from './MessageBubble';

interface MessageListProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
  messageContainerRef?: React.RefObject<HTMLDivElement>;
  onConvertMessage: (messageId: string, type: 'task' | 'document') => void;
  formatFileSize: (bytes: number) => string;
  onScroll?: () => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  messagesEndRef,
  messageContainerRef,
  onConvertMessage,
  formatFileSize,
  onScroll
}) => {
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-gray-400 mb-2 text-4xl">💬</div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            Start a Conversation
          </h3>
          <p className="text-sm text-gray-500">
            Select agents and type your message below
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={messageContainerRef}
      onScroll={onScroll}
      className="flex-1 overflow-y-auto p-6 space-y-4"
    >
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
  );
};

export default MessageList;
