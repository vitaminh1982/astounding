/**
 * Individual message bubble component with feedback system
 */
import React, { useState } from 'react';
import { Paperclip, ThumbsUp, ThumbsDown, MessageSquare, AlertCircle } from 'lucide-react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  onConvertMessage: (messageId: string, type: 'task' | 'document') => void;
  formatFileSize: (bytes: number) => string;
  onFeedback?: (messageId: string, feedback: 'positive' | 'negative', comment?: string) => void;
}

type FeedbackState = 'positive' | 'negative' | null;

/**
 * MessageBubble displays an individual chat message with attachments, actions, and feedback
 */
const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  onConvertMessage, 
  formatFileSize,
  onFeedback 
}) => {
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFeedbackClick = (type: 'positive' | 'negative') => {
    if (feedback === type) {
      // Clicking the same button again removes the feedback
      setFeedback(null);
      setShowFeedbackForm(false);
      setFeedbackComment('');
      return;
    }

    setFeedback(type);
    
    if (type === 'positive') {
      // Positive feedback can be submitted immediately
      if (onFeedback) {
        onFeedback(message.id, type);
      }
      setShowFeedbackForm(false);
    } else {
      // Negative feedback should ask for details
      setShowFeedbackForm(true);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!onFeedback || !feedback) return;

    setIsSubmitting(true);
    try {
      await onFeedback(message.id, feedback, feedbackComment || undefined);
      setShowFeedbackForm(false);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelFeedback = () => {
    setShowFeedbackForm(false);
    setFeedback(null);
    setFeedbackComment('');
  };

  return (
    <div className="max-w-3xl">
      <div className="bg-gray-100 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
        {message.sender === 'agent' && (
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-xs font-semibold text-white">AI</span>
            </div>
            <span className="text-xs font-medium text-gray-600">AI Assistant</span>
          </div>
        )}
        
        <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
          {message.content}
        </div>

        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-4 space-y-2">
            {message.attachments.map((att) => (
              <div 
                key={att.id} 
                className="flex items-center gap-2 text-xs bg-white rounded-lg px-3 py-2 border border-gray-200 hover:border-indigo-300 transition-colors"
              >
                <Paperclip className="w-3.5 h-3.5 text-gray-500" />
                <span className="font-medium text-gray-700">{att.name}</span>
                <span className="ml-auto text-gray-400">({formatFileSize(att.size)})</span>
              </div>
            ))}
          </div>
        )}

        {/* Feedback Form */}
        {showFeedbackForm && feedback === 'negative' && (
          <div className="mt-4 p-4 bg-white rounded-lg border border-orange-200 shadow-sm">
            <div className="flex items-start gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h5 className="text-sm font-semibold text-gray-900 mb-1">
                  Help us improve
                </h5>
                <p className="text-xs text-gray-600">
                  What could have been better about this response?
                </p>
              </div>
            </div>
            <textarea
              value={feedbackComment}
              onChange={(e) => setFeedbackComment(e.target.value)}
              placeholder="Optional: Share your thoughts..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
              rows={3}
              disabled={isSubmitting}
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleSubmitFeedback}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 active:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
              <button
                onClick={handleCancelFeedback}
                disabled={isSubmitting}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 active:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Footer with actions */}
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>

            {/* Feedback buttons - only for agent messages */}
            {message.sender === 'agent' && onFeedback && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleFeedbackClick('positive')}
                  className={`p-1.5 rounded-lg transition-all duration-200 ${
                    feedback === 'positive'
                      ? 'bg-green-100 text-green-600 hover:bg-green-200'
                      : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                  }`}
                  title="Helpful response"
                  aria-label="Mark as helpful"
                >
                  <ThumbsUp className={`w-4 h-4 ${feedback === 'positive' ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => handleFeedbackClick('negative')}
                  className={`p-1.5 rounded-lg transition-all duration-200 ${
                    feedback === 'negative'
                      ? 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                      : 'text-gray-400 hover:text-orange-600 hover:bg-orange-50'
                  }`}
                  title="Not helpful"
                  aria-label="Mark as not helpful"
                >
                  <ThumbsDown className={`w-4 h-4 ${feedback === 'negative' ? 'fill-current' : ''}`} />
                </button>
              </div>
            )}

            {/* Feedback confirmation */}
            {feedback && !showFeedbackForm && (
              <span className="text-xs font-medium text-gray-600 flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                Thanks for your feedback!
              </span>
            )}
          </div>

          {/* Convert actions */}
          {message.sender === 'agent' && (message.canConvertToTask || message.canConvertToDocument) && (
            <div className="flex gap-2">
              {message.canConvertToTask && (
                <button
                  onClick={() => onConvertMessage(message.id, 'task')}
                  className="px-3 py-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  Convert to task
                </button>
              )}
              {message.canConvertToDocument && (
                <button
                  onClick={() => onConvertMessage(message.id, 'document')}
                  className="px-3 py-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  Convert to deliverable
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
