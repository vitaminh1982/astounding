import React from 'react';

interface TypingIndicatorProps {
  isThinking: boolean;
  isTyping: boolean;
  displayText: string;
  agentAvatar: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  isThinking,
  isTyping,
  displayText,
  agentAvatar
}) => {
  if (!isThinking && !isTyping) return null;

  return (
    <>
      {/* Thinking indicator */}
      {isThinking && (
        <div className="flex items-start gap-3">
          <span className="text-2xl">{agentAvatar}</span>
          <div className="bg-surface-container-low dark:bg-surface-container-highest rounded-lg p-3 max-w-[70%] transition-colors">
            <div className="flex items-center">
              <span className="text-muted-foreground dark:text-on-surface-variant mr-2">Thinking</span>
              <span className="inline-flex gap-1">
                <span className="animate-pulse h-1 w-1 bg-surface-container-highest dark:bg-surface-container rounded-full"></span>
                <span className="animate-pulse h-1 w-1 bg-surface-container-highest dark:bg-surface-container rounded-full" style={{ animationDelay: '0.2s' }}></span>
                <span className="animate-pulse h-1 w-1 bg-surface-container-highest dark:bg-surface-container rounded-full" style={{ animationDelay: '0.4s' }}></span>
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* Typing indicator */}
      {isTyping && (
        <div className="flex items-start gap-3">
          <span className="text-2xl">{agentAvatar}</span>
          <div className="bg-surface-container-low dark:bg-surface-container-highest rounded-lg p-3 max-w-[70%] transition-colors">
            <p className="whitespace-pre-wrap break-words text-foreground dark:text-foreground">{displayText}</p>
            <span className="inline-flex gap-1 ml-1">
              <span className="animate-bounce text-foreground dark:text-foreground">.</span>
              <span className="animate-bounce text-foreground dark:text-foreground" style={{ animationDelay: '0.2s' }}>.</span>
              <span className="animate-bounce text-foreground dark:text-foreground" style={{ animationDelay: '0.4s' }}>.</span>
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(TypingIndicator);
