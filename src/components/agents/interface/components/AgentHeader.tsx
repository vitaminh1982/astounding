import React from 'react';
import { ArrowLeft, Play, Pause, Settings } from 'lucide-react';
import { AgentConfig } from '../types';

interface AgentHeaderProps {
  agentConfig: AgentConfig;
  isAgentActive: boolean;
  onClose?: () => void;
  onToggleStatus: () => void;
  onOpenConfig: () => void;
}

const AgentHeader: React.FC<AgentHeaderProps> = ({
  agentConfig,
  isAgentActive,
  onClose,
  onToggleStatus,
  onOpenConfig
}) => {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 shadow-sm dark:shadow-gray-900 transition-colors">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-2">
        <div className="flex items-center gap-2">
          {onClose && (
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              aria-label="Back"
            >
              <ArrowLeft size={20} className="text-gray-700 dark:text-gray-200" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              AI Agent Interface
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Interact with {agentConfig.name} and manage agent settings
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2 sm:gap-1.5">
          <button
            onClick={onToggleStatus}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
              isAgentActive 
                ? 'bg-yellow-100 dark:bg-yellow-900 hover:bg-yellow-200 dark:hover:bg-yellow-800 text-yellow-600 dark:text-yellow-200 focus:ring-yellow-500' 
                : 'bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700 text-white focus:ring-green-500'
            }`}
          >
            {isAgentActive ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Deactivate Agent</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Activate Agent</span>
              </>
            )}
          </button>
          <button
            onClick={onOpenConfig}
            className="flex items-center justify-center gap-2 bg-indigo-600 dark:bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-teal-700 transition-colors text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            <Settings className="w-4 h-4" />
            <span>Configure Agent</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default React.memo(AgentHeader);
