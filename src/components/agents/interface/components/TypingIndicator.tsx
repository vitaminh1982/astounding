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
          <div className="bg-gray-100 rounded-lg p-3 max-w-[70%]">
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">Thinking</span>
              <span className="inline-flex gap-1">
                <span className="animate-pulse h-1 w-1 bg-gray-600 rounded-full"></span>
                <span className="animate-pulse h-1 w-1 bg-gray-600 rounded-full" style={{ animationDelay: '0.2s' }}></span>
                <span className="animate-pulse h-1 w-1 bg-gray-600 rounded-full" style={{ animationDelay: '0.4s' }}></span>
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* Typing indicator */}
      {isTyping && (
        <div className="flex items-start gap-3">
          <span className="text-2xl">{agentAvatar}</span>
          <div className="bg-gray-100 rounded-lg p-3 max-w-[70%]">
            <p className="whitespace-pre-wrap break-words">{displayText}</p>
            <span className="inline-flex gap-1 ml-1">
              <span className="animate-bounce">.</span>
              <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(TypingIndicator);