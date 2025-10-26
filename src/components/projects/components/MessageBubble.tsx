/**
 * Individual message bubble component with feedback system
 */
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Paperclip, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  AlertCircle,
  Loader2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Message } from '../types';

// ============================================================================
// TYPES
// ============================================================================

interface MessageBubbleProps {
  message: Message;
  onConvertMessage: (messageId: string, type: 'task' | 'document') => void;
  onFeedback?: (messageId: string, feedback: 'positive' | 'negative', comment?: string) => Promise<void>;
  feedbackLoading?: boolean;
  feedbackError?: string | null;
  formatFileSize: (bytes: number) => string;
  isFirst?: boolean;
  isLast?: boolean;
}

type FeedbackType = 'positive' | 'negative';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format timestamp with date context
 */
const formatMessageTime = (timestamp: Date): string => {
  const now = new Date();
  const messageDate = new Date(timestamp);
  const isToday = messageDate.toDateString() === now.toDateString();
  
  const timeStr = messageDate.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  if (isToday) {
    return timeStr;
  }
  
  const dateStr = messageDate.toLocaleDateString([], { 
    month: 'short', 
    day: 'numeric' 
  });
  
  return `${dateStr} ${timeStr}`;
};

/**
 * Get agent avatar/name from message
 */
const getAgentInfo = (message: Message): { name: string; avatar: string } => {
  // Fallback if no agent info
  if (!message.agentName) {
    return { name: 'AI Assistant', avatar: 'AI' };
  }
  
  // Extract initials for avatar
  const initials = message.agentName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  return {
    name: message.agentName,
    avatar: initials
  };
};

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * MessageBubble displays an individual chat message with attachments, actions, and feedback
 */
const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  onConvertMessage, 
  onFeedback,
  feedbackLoading = false,
  feedbackError = null,
  formatFileSize,
  isFirst = false,
  isLast = false
}) => {
  // ============================================================================
  // STATE
  // ============================================================================
  
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  
  // Use message.feedback as source of truth
  const currentFeedback = message.feedback || null;
  
  // ============================================================================
  // EFFECTS
  // ============================================================================
  
  /**
   * Sync error state with props
   */
  useEffect(() => {
    setLocalError(feedbackError);
  }, [feedbackError]);
  
  /**
   * Close feedback form when feedback is successfully submitted
   */
  useEffect(() => {
    if (currentFeedback && !feedbackLoading && !feedbackError) {
      setShowFeedbackForm(false);
      setFeedbackComment('');
    }
  }, [currentFeedback, feedbackLoading, feedbackError]);
  
  // ============================================================================
  // CALLBACKS
  // ============================================================================
  
  /**
   * Handle feedback button click
   */
  const handleFeedbackClick = useCallback(async (type: FeedbackType) => {
    if (!onFeedback) return;
    
    // Clear any previous errors
    setLocalError(null);
    
    // If clicking the same feedback type, remove it (toggle off)
    if (currentFeedback === type) {
      try {
        await onFeedback(message.id, type, undefined); // API should handle removal
        setShowFeedbackForm(false);
        setFeedbackComment('');
      } catch (error) {
        console.error('Failed to remove feedback:', error);
        setLocalError('Failed to update feedback');
      }
      return;
    }
    
    // For positive feedback, submit immediately
    if (type === 'positive') {
      try {
        await onFeedback(message.id, type);
      } catch (error) {
        console.error('Failed to submit positive feedback:', error);
        setLocalError('Failed to submit feedback');
      }
    } else {
      // For negative feedback, show form to collect details
      setShowFeedbackForm(true);
    }
  }, [onFeedback, message.id, currentFeedback]);
  
  /**
   * Submit negative feedback with comment
   */
  const handleSubmitFeedback = useCallback(async () => {
    if (!onFeedback) return;
    
    setLocalError(null);
    
    try {
      await onFeedback(message.id, 'negative', feedbackComment || undefined);
      // Form will close automatically via useEffect when currentFeedback updates
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      setLocalError('Failed to submit feedback. Please try again.');
    }
  }, [onFeedback, message.id, feedbackComment]);
  
  /**
   * Cancel feedback form
   */
  const handleCancelFeedback = useCallback(() => {
    setShowFeedbackForm(false);
    setFeedbackComment('');
    setLocalError(null);
  }, []);
  
  /**
   * Handle convert to task/document
   */
  const handleConvert = useCallback((type: 'task' | 'document') => {
    try {
      onConvertMessage(message.id, type);
    } catch (error) {
      console.error('Failed to convert message:', error);
    }
  }, [onConvertMessage, message.id]);
  
  // ============================================================================
  // RENDER HELPERS
  // ============================================================================
  
  const agentInfo = getAgentInfo(message);
  const isUser = message.sender === 'user';
  const isAgent = message.sender === 'agent';
  const formattedTime = formatMessageTime(message.timestamp);
  
  /**
   * Render feedback status indicator
   */
  const renderFeedbackStatus = () => {
    if (feedbackLoading) {
      return (
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
          <Loader2 className="w-3 h-3 animate-spin" />
          Submitting...
        </span>
      );
    }
    
    if (localError || feedbackError) {
      return (
        <span className="text-xs font-medium text-red-600 dark:text-red-400 flex items-center gap-1.5">
          <XCircle className="w-3 h-3" />
          {localError || feedbackError}
        </span>
      );
    }
    
    if (currentFeedback && !showFeedbackForm) {
      return (
        <span className="text-xs font-medium text-green-600 dark:text-green-400 flex items-center gap-1.5">
          <CheckCircle className="w-3 h-3" />
          Thanks for your feedback!
        </span>
      );
    }
    
    return null;
  };
  
  /**
   * Render feedback buttons
   */
  const renderFeedbackButtons = () => {
    if (!isAgent || !onFeedback) return null;
    
    return (
      <div className="flex items-center gap-1" role="group" aria-label="Feedback buttons">
        <button
          onClick={() => handleFeedbackClick('positive')}
          disabled={feedbackLoading}
          className={`p-1.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
            currentFeedback === 'positive'
              ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
              : 'text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
          }`}
          title="Helpful response"
          aria-label="Mark as helpful"
          aria-pressed={currentFeedback === 'positive'}
        >
          <ThumbsUp 
            className={`w-4 h-4 ${currentFeedback === 'positive' ? 'fill-current' : ''}`} 
          />
        </button>
        
        <button
          onClick={() => handleFeedbackClick('negative')}
          disabled={feedbackLoading}
          className={`p-1.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
            currentFeedback === 'negative'
              ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50'
              : 'text-gray-400 dark:text-gray-500 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20'
          }`}
          title="Not helpful"
          aria-label="Mark as not helpful"
          aria-pressed={currentFeedback === 'negative'}
        >
          <ThumbsDown 
            className={`w-4 h-4 ${currentFeedback === 'negative' ? 'fill-current' : ''}`} 
          />
        </button>
      </div>
    );
  };
  
  /**
   * Render feedback form for negative feedback
   */
  const renderFeedbackForm = () => {
    if (!showFeedbackForm || currentFeedback !== 'negative') return null;
    
    return (
      <div 
        className="mt-4 p-4 bg-white dark:bg-gray-700 rounded-lg border border-orange-200 dark:border-orange-700 shadow-sm dark:shadow-gray-900 transition-colors"
        role="form"
        aria-label="Feedback form"
      >
        <div className="flex items-start gap-2 mb-3">
          <AlertCircle className="w-4 h-4 text-orange-500 dark:text-orange-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
          <div className="flex-1">
            <h5 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
              Help us improve
            </h5>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              What could have been better about this response?
            </p>
          </div>
        </div>
        
        <textarea
          value={feedbackComment}
          onChange={(e) => setFeedbackComment(e.target.value)}
          placeholder="Optional: Share your thoughts..."
          className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400 resize-none bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all"
          rows={3}
          disabled={feedbackLoading}
          aria-label="Feedback comment"
        />
        
        {(localError || feedbackError) && (
          <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
            <XCircle className="w-3 h-3 flex-shrink-0" />
            <span>{localError || feedbackError}</span>
          </div>
        )}
        
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleSubmitFeedback}
            disabled={feedbackLoading}
            className="flex-1 px-4 py-2 bg-orange-500 dark:bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-600 dark:hover:bg-orange-700 active:bg-orange-700 dark:active:bg-orange-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {feedbackLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Feedback'
            )}
          </button>
          <button
            onClick={handleCancelFeedback}
            disabled={feedbackLoading}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 active:bg-gray-300 dark:active:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };
  
  /**
   * Render convert actions
   */
  const renderConvertActions = () => {
    if (!isAgent || (!message.canConvertToTask && !message.canConvertToDocument)) {
      return null;
    }
    
    return (
      <div className="flex gap-2">
        {message.canConvertToTask && (
          <button
            onClick={() => handleConvert('task')}
            className="px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-teal-400 hover:text-indigo-700 dark:hover:text-teal-300 hover:bg-indigo-50 dark:hover:bg-teal-900/20 rounded-lg transition-colors"
            aria-label="Convert message to task"
          >
            Convert to task
          </button>
        )}
        {message.canConvertToDocument && (
          <button
            onClick={() => handleConvert('document')}
            className="px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-teal-400 hover:text-indigo-700 dark:hover:text-teal-300 hover:bg-indigo-50 dark:hover:bg-teal-900/20 rounded-lg transition-colors"
            aria-label="Convert message to deliverable"
          >
            Convert to deliverable
          </button>
        )}
      </div>
    );
  };
  
  // ============================================================================
  // RENDER
  // ============================================================================
  
  return (
    <div 
      className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} ${
        isFirst ? 'mt-2' : ''
      } ${isLast ? 'mb-2' : ''}`}
    >
      {/* Agent Avatar */}
      {isAgent && (
        <div 
          className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-teal-500 dark:to-cyan-600 flex items-center justify-center flex-shrink-0 transition-colors"
          aria-label={`${agentInfo.name} avatar`}
        >
          <span className="text-xs font-semibold text-white">
            {agentInfo.avatar}
          </span>
        </div>
      )}
      
      {/* Message Content */}
      <div className={`max-w-[70%] ${isUser ? 'max-w-[80%]' : ''}`}>
        {/* Agent Name */}
        {isAgent && (
          <div className="flex items-center gap-2 mb-1 px-1">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {agentInfo.name}
            </span>
          </div>
        )}
        
        {/* Message Bubble */}
        <div 
          className={`rounded-lg p-4 shadow-sm hover:shadow-md dark:shadow-gray-900 dark:hover:shadow-gray-800 transition-all duration-200 ${
            isUser 
              ? 'bg-indigo-600 dark:bg-teal-600 text-white' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
          }`}
        >
          {/* Message Text */}
          <div className="whitespace-pre-wrap leading-relaxed">
            {message.content}
          </div>
          
          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-3 space-y-2">
              {message.attachments.map((att) => (
                <div 
                  key={att.id} 
                  className={`flex items-center gap-2 text-xs rounded-lg px-3 py-2 border transition-colors ${
                    isUser
                      ? 'bg-indigo-500 dark:bg-teal-500 border-indigo-400 dark:border-teal-400 hover:bg-indigo-400 dark:hover:bg-teal-400'
                      : 'bg-white dark:bg-gray-600 border-gray-200 dark:border-gray-500 hover:border-indigo-300 dark:hover:border-teal-400'
                  }`}
                >
                  <Paperclip className={`w-3.5 h-3.5 ${isUser ? 'text-indigo-200 dark:text-teal-200' : 'text-gray-500 dark:text-gray-400'}`} />
                  <span className={`font-medium ${isUser ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                    {att.name}
                  </span>
                  <span className={`ml-auto ${isUser ? 'text-indigo-200 dark:text-teal-200' : 'text-gray-400 dark:text-gray-500'}`}>
                    ({formatFileSize(att.size)})
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Feedback Form */}
        {renderFeedbackForm()}
        
        {/* Footer with timestamp, feedback, and actions */}
        <div className={`flex justify-between items-center mt-2 px-1 ${
          isUser ? 'flex-row-reverse' : 'flex-row'
        }`}>
          <div className="flex items-center gap-3">
            {/* Timestamp */}
            <span className={`text-xs ${isUser ? 'text-gray-600 dark:text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
              {formattedTime}
            </span>
            
            {/* Feedback Buttons (agent messages only) */}
            {renderFeedbackButtons()}
            
            {/* Feedback Status */}
            {renderFeedbackStatus()}
          </div>
          
          {/* Convert Actions */}
          {renderConvertActions()}
        </div>
      </div>
      
      {/* User Avatar */}
      {isUser && (
        <div 
          className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-teal-600 flex items-center justify-center flex-shrink-0 transition-colors"
          aria-label="Your avatar"
        >
          <span className="text-xs font-semibold text-white">
            You
          </span>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// EXPORT
// ============================================================================

export default React.memo(MessageBubble);
