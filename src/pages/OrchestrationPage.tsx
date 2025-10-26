import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Page } from '../App';
import OrchestrationHeader from '../components/orchestration/components/OrchestrationHeader';
import SystemMetricsGrid from '../components/orchestration/components/SystemMetricsGrid';
import ChatInterface from '../components/orchestration/components/ChatInterface';
import AIToolsGrid from '../components/orchestration/components/AIToolsGrid';
import ChatModal from '../components/orchestration/components/ChatModal';
import { useOrchestrationLogic } from '../components/orchestration/hooks/useOrchestrationLogic.tsx';
import { systemMetrics } from '../components/orchestration/data/mockData';
import { OrchestrationPageProps } from '../components/orchestration/types';

export default function OrchestrationPage({ onNavigate }: OrchestrationPageProps) {
  const {
    promptInput,
    setPromptInput,
    conversationHistory,
    isLoading,
    selectedTimeRange,
    setSelectedTimeRange,
    isChatMaximized,
    setIsChatMaximized,
    handleSendPrompt,
    handleKeyDown,
    handleRefresh
  } = useOrchestrationLogic();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <OrchestrationHeader
          selectedTimeRange={selectedTimeRange}
          onTimeRangeChange={setSelectedTimeRange}
          onRefresh={handleRefresh}
        />

        <SystemMetricsGrid metrics={systemMetrics} />

        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900 border border-gray-200 dark:border-gray-600 overflow-hidden mb-8 transition-colors">
          <ChatInterface 
            conversationHistory={conversationHistory}
            isLoading={isLoading}
            promptInput={promptInput}
            setPromptInput={setPromptInput}
            handleSendPrompt={handleSendPrompt}
            handleKeyDown={handleKeyDown}
            isModal={false}
            setIsChatMaximized={setIsChatMaximized}
          />
        </section>

        <AIToolsGrid />
      </div>

      <ChatModal
        conversationHistory={conversationHistory}
        isLoading={isLoading}
        promptInput={promptInput}
        setPromptInput={setPromptInput}
        handleSendPrompt={handleSendPrompt}
        handleKeyDown={handleKeyDown}
        isChatMaximized={isChatMaximized}
        setIsChatMaximized={setIsChatMaximized}
      />
    </div>
  );
}
