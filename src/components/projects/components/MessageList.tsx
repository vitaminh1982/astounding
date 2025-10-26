/**
 * Message list component with feedback support and performance optimizations
 */
import React, { useMemo, useCallback } from 'react';
import { Message } from '../types';
import MessageBubble from './MessageBubble';
import MessageSkeleton from './MessageSkeleton';
import DateSeparator from './DateSeparator';

// ============================================================================
// TYPES
// ============================================================================

interface FeedbackState {
  loading: boolean;
  error: string | null;
}

interface MessageListProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
  messageContainerRef?: React.RefObject<HTMLDivElement>;
  onConvertMessage: (messageId: string, type: 'task' | 'document') => void;
  onFeedback?: (messageId: string, feedback: 'positive' | 'negative', comment?: string) => Promise<void>;
  feedbackStates?: Record<string, FeedbackState>;
  formatFileSize: (bytes: number) => string;
  onScroll?: () => void;
  isLoading?: boolean;
  error?: string | null;
  selectedAgentsCount?: number;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Group messages by date for date separators
 */
const groupMessagesByDate = (messages: Message[]): Map<string, Message[]> => {
  const groups = new Map<string, Message[]>();
  
  messages.forEach(message => {
    const date = new Date(message.timestamp).toDateString();
    if (!groups.has(date)) {
      groups.set(date, []);
    }
    groups.get(date)!.push(message);
  });
  
  return groups;
};

/**
 * Format date for separator display
 */
const formatDateSeparator = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
};

// ============================================================================
// COMPONENT
// ============================================================================

const MessageList: React.FC<MessageListProps> = ({
  messages,
  messagesEndRef,
  messageContainerRef,
  onConvertMessage,
  onFeedback,
  feedbackStates,
  formatFileSize,
  onScroll,
  isLoading = false,
  error = null,
  selectedAgentsCount = 0
}) => {
  
  // ============================================================================
  // MEMOIZED VALUES
  // ============================================================================
  
  /**
   * Group messages by date for separators
   */
  const messagesByDate = useMemo(() => 
    groupMessagesByDate(messages),
    [messages]
  );

  /**
   * Check if feedback is available
   */
  const hasFeedbackSupport = useMemo(() => 
    typeof onFeedback === 'function',
    [onFeedback]
  );

  // ============================================================================
  // CALLBACKS
  // ============================================================================
  
  /**
   * Handle message conversion with error boundary
   */
  const handleConvertMessage = useCallback((messageId: string, type: 'task' | 'document') => {
    try {
      onConvertMessage(messageId, type);
    } catch (error) {
      console.error('Failed to convert message:', error);
    }
  }, [onConvertMessage]);

  /**
   * Handle feedback submission with error boundary
   */
  const handleFeedback = useCallback(async (
    messageId: string, 
    feedback: 'positive' | 'negative', 
    comment?: string
  ) => {
    if (!onFeedback) return;
    
    try {
      await onFeedback(messageId, feedback, comment);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  }, [onFeedback]);

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================
  
  /**
   * Render empty state
   */
  const renderEmptyState = () => (
    <div 
      className="flex-1 flex items-center justify-center p-8"
      role="status"
      aria-live="polite"
    >
      <div className="text-center max-w-sm">
        <div className="text-gray-400 dark:text-gray-500 mb-4 text-6xl" aria-hidden="true">
          💬
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          Start a Conversation
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {selectedAgentsCount > 0 
            ? `You have ${selectedAgentsCount} agent${selectedAgentsCount !== 1 ? 's' : ''} selected. Type your message below to begin.`
            : 'Select one or more agents and type your message below to start collaborating.'
          }
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500">
          <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded border border-gray-300 dark:border-gray-600 transition-colors">
            Shift + Enter
          </kbd>
          <span>for new line</span>
        </div>
      </div>
    </div>
  );

  /**
   * Render loading state
   */
  const renderLoadingState = () => (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      <MessageSkeleton />
      <MessageSkeleton isUser />
      <MessageSkeleton />
    </div>
  );

  /**
   * Render error state
   */
  const renderErrorState = () => (
    <div 
      className="flex-1 flex items-center justify-center p-8"
      role="alert"
      aria-live="assertive"
    >
      <div className="text-center max-w-sm">
        <div className="text-red-400 dark:text-red-500 mb-4 text-5xl" aria-hidden="true">
          ⚠️
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          Failed to Load Messages
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {error || 'An unexpected error occurred while loading messages.'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 dark:bg-teal-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-teal-700 transition-colors shadow-sm dark:shadow-gray-900"
        >
          Reload Page
        </button>
      </div>
    </div>
  );

  /**
   * Render messages with date separators
   */
  const renderMessages = () => {
    const elements: JSX.Element[] = [];
    
    messagesByDate.forEach((dateMessages, dateString) => {
      // Add date separator
      elements.push(
        <DateSeparator 
          key={`date-${dateString}`}
          date={formatDateSeparator(dateString)}
        />
      );
      
      // Add messages for this date
      dateMessages.forEach((message, index) => {
        try {
          const feedbackState = feedbackStates?.[message.id];
          
          elements.push(
            <MessageBubble
              key={message.id}
              message={message}
              onConvertMessage={handleConvertMessage}
              onFeedback={hasFeedbackSupport ? handleFeedback : undefined}
              feedbackLoading={feedbackState?.loading}
              feedbackError={feedbackState?.error}
              formatFileSize={formatFileSize}
              isFirst={index === 0}
              isLast={index === dateMessages.length - 1}
            />
          );
        } catch (error) {
          console.error('Failed to render message:', message.id, error);
          
          // Render error placeholder instead of crashing
          elements.push(
            <div 
              key={`error-${message.id}`}
              className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg transition-colors"
              role="alert"
            >
              <p className="text-sm text-red-800 dark:text-red-300">
                Failed to render message. Please refresh the page.
              </p>
            </div>
          );
        }
      });
    });
    
    return elements;
  };

  // ============================================================================
  // RENDER
  // ============================================================================
  
  // Show loading state
  if (isLoading) {
    return renderLoadingState();
  }

  // Show error state
  if (error) {
    return renderErrorState();
  }

  // Show empty state
  if (messages.length === 0) {
    return renderEmptyState();
  }

  // Render messages
  return (
    <div
      ref={messageContainerRef}
      onScroll={onScroll}
      className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth"
      role="log"
      aria-live="polite"
      aria-label="Chat messages"
    >
      {renderMessages()}
      
      {/* Scroll anchor */}
      <div 
        ref={messagesEndRef} 
        className="h-px" 
        aria-hidden="true"
      />
    </div>
  );
};

// ============================================================================
// EXPORT
// ============================================================================

export default React.memo(MessageList);
