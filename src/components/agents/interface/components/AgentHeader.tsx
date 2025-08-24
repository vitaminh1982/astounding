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
    <header className="bg-white border-b p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-2">
        <div className="flex items-center gap-2">
          {onClose && (
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Back"
            >
              <ArrowLeft size={20} className="text-gray-700" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              AI Agent Interface
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Interact with {agentConfig.name} and manage agent settings
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2 sm:gap-1.5">
          <button
            onClick={onToggleStatus}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
              isAgentActive 
                ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-600' 
                : 'bg-green-500 hover:bg-green-600 text-white'
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
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base"
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