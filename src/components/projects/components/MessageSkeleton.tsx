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
        <div className="w-8 h-8 bg-surface-container dark:bg-surface-container-highest rounded-full flex-shrink-0 transition-colors" />
      )}
      
      <div className={`max-w-[70%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
        <div className="h-4 bg-surface-container dark:bg-surface-container-highest rounded w-24 transition-colors" />
        <div className={`p-4 rounded-lg transition-colors ${isUser ? 'bg-surface-container dark:bg-surface-container-highest' : 'bg-surface-container-low dark:bg-surface-container-highest'}`}>
          <div className="space-y-2">
            <div className="h-3 bg-surface-container dark:bg-outline rounded w-full transition-colors" />
            <div className="h-3 bg-surface-container dark:bg-outline rounded w-5/6 transition-colors" />
            <div className="h-3 bg-surface-container dark:bg-outline rounded w-4/6 transition-colors" />
          </div>
        </div>
      </div>
      
      {isUser && (
        <div className="w-8 h-8 bg-surface-container dark:bg-surface-container-highest rounded-full flex-shrink-0 transition-colors" />
      )}
    </div>
  );
};

export default MessageSkeleton;
