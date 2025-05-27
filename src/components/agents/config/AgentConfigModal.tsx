import React, { useState } from 'react';
import { X, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import BasicInfo from './sections/BasicInfo';
import PersonalityConfig from './sections/PersonalityConfig';
import KnowledgeConfig from './sections/KnowledgeConfig';
import RulesConfig from './sections/RulesConfig';
import LearningConfig from './sections/LearningConfig';
import IntegrationsConfig from './sections/IntegrationsConfig';
import AnalyticsConfig from './sections/AnalyticsConfig';
import ActionButtons from './sections/ActionButtons';
import Preview from './sections/Preview';
import { AgentConfig } from '../../../types/agent-config';

interface AgentConfigModalProps {
  agent: AgentConfig;
  onClose: () => void;
  onSave: (config: AgentConfig) => void;
}

export default function AgentConfigModal({ agent, onClose, onSave }: AgentConfigModalProps) {
  const [localAgent, setLocalAgent] = useState<AgentConfig>(agent);
  const [showPreview, setShowPreview] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setLocalAgent((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(localAgent);
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 md:p-0">
      <div className="flex flex-col md:flex-row items-start w-full max-w-[1200px] max-h-[90vh]">
        {/* Main Configuration Panel */}
        <div 
          className={`bg-white rounded-lg overflow-y-auto transition-all duration-300 ease-in-out
            ${showPreview ? 'md:w-1/2 hidden md:block' : 'w-full'} 
            max-h-[90vh] ${!showPreview || window.innerWidth < 768 ? 'max-w-[1000px]' : ''}`}
        >
          <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center z-10">
            <h2 className="text-xl font-semibold truncate">
              AI Agent Configuration - {localAgent.name || 'New Agent'}
            </h2>
            <div className="flex items-center gap-2 md:gap-4">
              <button 
                onClick={togglePreview} 
                className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors text-sm md:text-base"
              >
                {showPreview ? (
                  <>
                    <EyeOff className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="hidden md:inline">Hide Preview</span>
                    <span className="md:hidden">Hide</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="hidden md:inline">Show Preview</span>
                    <span className="md:hidden">Preview</span>
                  </>
                )}
              </button>
              <button onClick={onClose} className="p-1 md:p-2 hover:bg-gray-100 rounded-full">
                <X className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>

          <div className="p-4 md:p-6 space-y-6 md:space-y-8">
            <BasicInfo
              agent={localAgent}
              onChange={(field, value) => handleInputChange(field, value)}
            />
            <PersonalityConfig
              config={localAgent.communication}
              onChange={(value) => handleInputChange('communication', value)}
            />
            <KnowledgeConfig
              config={localAgent.knowledge}
              onChange={(value) => handleInputChange('knowledge', value)}
            />
            <RulesConfig
              config={localAgent.rules}
              onChange={(value) => handleInputChange('rules', value)}
            />
            <LearningConfig
              config={localAgent.learning}
              onChange={(value) => handleInputChange('learning', value)}
            />
            <IntegrationsConfig
              integrations={localAgent.integrations}
              onChange={(value) => handleInputChange('integrations', value)}
            />
            <AnalyticsConfig
              metrics={localAgent.metrics}
              onChange={(value) => handleInputChange('metrics', value)}
            />
            <ActionButtons onSave={handleSave} />
          </div>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="bg-white rounded-lg md:w-1/2 w-full md:ml-4 max-h-[90vh] overflow-y-auto shadow-lg border border-gray-200 transition-all duration-300 ease-in-out">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              {/* Back button on mobile */}
              <button 
                className="md:hidden mr-2 p-1 hover:bg-gray-100 rounded-full" 
                onClick={togglePreview}
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              
              <h2 className="text-lg md:text-xl font-semibold truncate">
                Agent Preview
              </h2>
              
              {/* Only show close button on desktop */}
              <button 
                className="hidden md:block p-1 md:p-2 hover:bg-gray-100 rounded-full" 
                onClick={togglePreview}
              >
                <X className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
            <div className="p-4">
              <Preview agent={localAgent} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
