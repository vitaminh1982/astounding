/**
 * Individual message bubble component
 */
import React from 'react';
import { Paperclip } from 'lucide-react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  onConvertMessage: (messageId: string, type: 'task' | 'document') => void;
  formatFileSize: (bytes: number) => string;
}

/**
 * MessageBubble displays an individual chat message with attachments and actions
 */
const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  onConvertMessage, 
  formatFileSize 
}) => {
  return (
    <div className="max-w-3xl">
      <div className="bg-gray-100 rounded-lg p-6 shadow-sm">
        {message.sender === 'agent' && (
          <div className="text-xs text-gray-500 mb-2">{/* Agent badge if needed */}</div>
        )}
        
        <div className="whitespace-pre-wrap text-gray-800">{message.content}</div>

        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-3 space-y-1">
            {message.attachments.map((att) => (
              <div key={att.id} className="flex items-center gap-2 text-xs opacity-85">
                <Paperclip className="w-3 h-3" />
                <span>{att.name}</span>
                <span className="ml-2 text-gray-400">({formatFileSize(att.size)})</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
          <span>{message.timestamp.toLocaleTimeString()}</span>

          {message.sender === 'agent' && (message.canConvertToTask || message.canConvertToDocument) && (
            <div className="flex gap-2">
              {message.canConvertToTask && (
                <button
                  onClick={() => onConvertMessage(message.id, 'task')}
                  className="text-xs text-indigo-600 hover:underline"
                >
                  Convert to task
                </button>
              )}
              {message.canConvertToDocument && (
                <button
                  onClick={() => onConvertMessage(message.id, 'document')}
                  className="text-xs text-indigo-600 hover:underline"
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