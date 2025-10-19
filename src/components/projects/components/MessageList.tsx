/**
 * Message list component with scroll-to-bottom button
 */
import React from 'react';
import { ArrowDown } from 'lucide-react';
import { Message } from '../types';
import MessageBubble from './MessageBubble';

interface MessageListProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
  messageContainerRef: React.RefObject<HTMLDivElement>;
  onConvertMessage: (messageId: string, type: 'task' | 'document') => void;
  onFeedback?: (messageId: string, feedback: 'positive' | 'negative', comment?: string) => void;
  formatFileSize: (bytes: number) => string;
  onScroll?: () => void;
  showScrollButton?: boolean;
  onScrollToBottom?: () => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  messagesEndRef,
  messageContainerRef,
  onConvertMessage,
  onFeedback,
  formatFileSize,
  onScroll,
  showScrollButton = false,
  onScrollToBottom
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
    <div className="relative flex-1">
      {/* Messages Container */}
      <div
        ref={messageContainerRef}
        onScroll={onScroll}
        className="absolute inset-0 overflow-y-auto p-6 space-y-4 scroll-smooth"
      >
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onConvertMessage={onConvertMessage}
            onFeedback={onFeedback}
            formatFileSize={formatFileSize}
          />
        ))}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Scroll to Bottom Button */}
      {showScrollButton && onScrollToBottom && (
        <button
          onClick={onScrollToBottom}
          className="absolute bottom-6 right-6 p-3 bg-white hover:bg-gray-50 rounded-full shadow-lg border border-gray-200 transition-all duration-200 hover:shadow-xl z-10 group"
          aria-label="Scroll to bottom"
          title="Scroll to bottom"
        >
          <ArrowDown className="w-5 h-5 text-gray-600 group-hover:text-indigo-600 transition-colors" />
          
          {/* Optional: Show unread count if available */}
          {/* <span className="absolute -top-1 -right-1 px-2 py-0.5 text-xs font-semibold bg-indigo-500 text-white rounded-full">
            3
          </span> */}
        </button>
      )}
    </div>
  );
};

export default MessageList;
