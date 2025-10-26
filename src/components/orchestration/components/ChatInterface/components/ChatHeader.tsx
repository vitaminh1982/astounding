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
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-teal-600 dark:from-teal-400 dark:to-teal-500 rounded-lg flex items-center justify-center shadow-sm">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg transition-colors">AI Assistant</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium transition-colors">Multi-Agent Orchestration</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {!isModal ? (
          <button
            onClick={() => setIsChatMaximized(true)}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Maximize chat"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => setIsChatMaximized(false)}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
