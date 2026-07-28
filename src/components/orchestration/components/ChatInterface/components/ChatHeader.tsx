import React from 'react';
import { Bot, Maximize2, Minimize2, X } from 'lucide-react';

interface ChatHeaderProps {
  isModal: boolean;
  setIsChatMaximized: (value: boolean) => void;
}

/**
 * ChatHeader Component
 * Displays the chat header with title, status, and maximize/minimize controls
 */
const ChatHeader: React.FC<ChatHeaderProps> = ({
  isModal,
  setIsChatMaximized
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-surface-container-high border-b border-border dark:border-border transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-400 dark:to-green-500 rounded-lg flex items-center justify-center shadow-sm">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-foreground dark:text-foreground text-lg transition-colors">AI Assistant</h3>
          <p className="text-sm text-muted-foreground dark:text-muted-foreground font-medium transition-colors">Multi-Agent Orchestration</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {!isModal ? (
          <button
            onClick={() => setIsChatMaximized(true)}
            className="p-2 text-muted-foreground dark:text-muted-foreground hover:text-on-surface dark:hover:text-muted-foreground rounded-lg hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors"
            aria-label="Maximize chat"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => setIsChatMaximized(false)}
            className="p-2 text-muted-foreground dark:text-muted-foreground hover:text-on-surface dark:hover:text-muted-foreground rounded-lg hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors"
            aria-label="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default React.memo(ChatHeader);


