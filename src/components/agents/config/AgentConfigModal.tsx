import React, { useState, useCallback, useEffect } from 'react';
import { X, Eye, EyeOff, ArrowLeft, Maximize2, Minimize2 } from 'lucide-react';
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleInputChange = useCallback((field: string, value: any) => {
    setLocalAgent((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = useCallback(() => {
    onSave(localAgent);
  }, [localAgent, onSave]);

  const togglePreview = useCallback(() => {
    setShowPreview((prev) => !prev);
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 md:p-6 transition-colors duration-200"
      onClick={handleBackdropClick}
    >
      <div 
        className={`flex flex-col md:flex-row items-start w-full transition-all duration-300 ease-in-out ${
          isFullscreen 
            ? 'max-w-full max-h-full h-full' 
            : 'max-w-[1400px] max-h-[90vh]'
        }`}
      >
        {/* Main Configuration Panel */}
        <div 
          className={`bg-white dark:bg-gray-800 rounded-lg md:rounded-xl shadow-2xl dark:shadow-gray-900/50 overflow-hidden transition-all duration-300 ease-in-out border border-gray-200 dark:border-gray-600
            ${showPreview && !isMobile ? 'md:w-1/2' : 'w-full'} 
            ${showPreview && isMobile ? 'hidden' : 'flex flex-col'}
            ${isFullscreen ? 'h-full' : 'max-h-[90vh]'}`}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600 p-4 md:p-5 flex justify-between items-center z-20 transition-colors">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-2 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 dark:from-teal-500 dark:to-cyan-500 rounded-full transition-colors" />
              <div className="min-w-0 flex-1">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 truncate transition-colors">
                  {localAgent.name || 'New Agent'}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
                  AI Agent Configuration
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 ml-4">
              {/* Fullscreen toggle (desktop only) */}
              {!isMobile && (
                <button 
                  onClick={toggleFullscreen}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <Maximize2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  )}
                </button>
              )}
              
              {/* Preview toggle */}
              <button 
                onClick={togglePreview} 
                className="flex items-center gap-2 px-3 py-2 bg-indigo-50 dark:bg-teal-900/20 text-indigo-600 dark:text-teal-400 hover:bg-indigo-100 dark:hover:bg-teal-900/30 rounded-lg transition-colors text-sm font-medium border border-indigo-200 dark:border-teal-700"
                aria-label={showPreview ? "Hide preview" : "Show preview"}
              >
                {showPreview ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    <span className="hidden sm:inline">Hide</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">Preview</span>
                  </>
                )}
              </button>
              
              {/* Close button */}
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            <div className="p-4 md:p-6 space-y-6 md:space-y-8">
              <BasicInfo
                agent={localAgent}
                onChange={handleInputChange}
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
            </div>
          </div>

          {/* Footer with action buttons */}
          <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-600 p-4 md:p-5 transition-colors">
            <ActionButtons onSave={handleSave} onCancel={onClose} />
          </div>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div 
            className={`bg-white dark:bg-gray-800 rounded-lg md:rounded-xl shadow-2xl dark:shadow-gray-900/50 overflow-hidden transition-all duration-300 ease-in-out border border-gray-200 dark:border-gray-600
              ${isMobile ? 'w-full' : 'md:w-1/2 md:ml-4'} 
              ${isFullscreen ? 'h-full' : 'max-h-[90vh]'}
              flex flex-col`}
          >
            {/* Preview Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600 p-4 md:p-5 flex justify-between items-center z-20 transition-colors">
              {/* Back button on mobile */}
              {isMobile && (
                <button 
                  className="mr-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" 
                  onClick={togglePreview}
                  aria-label="Go back"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              )}
              
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 dark:from-blue-400 dark:to-cyan-400 rounded-full transition-colors" />
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 truncate transition-colors">
                  Live Preview
                </h2>
              </div>
              
              {/* Close button (desktop only) */}
              {!isMobile && (
                <button 
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors ml-4" 
                  onClick={togglePreview}
                  aria-label="Close preview"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              )}
            </div>
            
            {/* Preview Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-4 md:p-6 bg-gray-50 dark:bg-gray-900/50 transition-colors">
              <Preview agent={localAgent} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
