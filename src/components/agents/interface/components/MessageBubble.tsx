import React from 'react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  agentAvatar: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, agentAvatar }) => {
  return (
    <div
      className={`flex items-start gap-3 ${
        message.sender === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      {message.sender === 'agent' && (
        <span className="text-2xl">{agentAvatar}</span>
      )}
      <div
        className={`rounded-lg p-3 max-w-[70%] transition-colors ${
          message.sender === 'user'
            ? 'bg-indigo-100 dark:bg-teal-900 text-gray-900 dark:text-gray-100'
            : 'bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-gray-100'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
      {message.sender === 'user' && (
        <span className="text-2xl">👤</span>
      )}
    </div>
  );
};

export default React.memo(MessageBubble);
