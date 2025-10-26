/**
 * Skeleton loader for messages
 */
import React from 'react';

interface MessageSkeletonProps {
  isUser?: boolean;
}

const MessageSkeleton: React.FC<MessageSkeletonProps> = ({ isUser = false }) => {
  return (
    <div className={`flex gap-3 animate-pulse ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex-shrink-0 transition-colors" />
      )}
      
      <div className={`max-w-[70%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-24 transition-colors" />
        <div className={`p-4 rounded-lg transition-colors ${isUser ? 'bg-gray-200 dark:bg-gray-600' : 'bg-gray-100 dark:bg-gray-700'}`}>
          <div className="space-y-2">
            <div className="h-3 bg-gray-300 dark:bg-gray-500 rounded w-full transition-colors" />
            <div className="h-3 bg-gray-300 dark:bg-gray-500 rounded w-5/6 transition-colors" />
            <div className="h-3 bg-gray-300 dark:bg-gray-500 rounded w-4/6 transition-colors" />
          </div>
        </div>
      </div>
      
      {isUser && (
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex-shrink-0 transition-colors" />
      )}
    </div>
  );
};

export default MessageSkeleton;
