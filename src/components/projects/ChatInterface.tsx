/**
 * Main chat interface component for project collaboration
 * Handles chat messages, tasks, documents, and conversation history
 */
import React, { useState, useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import TasksTab from './components/TasksTab';
import HistoryTab from './components/HistoryTab';
import DocumentsTab from './components/DocumentsTab';
import { useChatInterface } from './hooks/useChatInterface';
import { Agent, Attachment, Message, TabType } from './types';

// ============================================================================
// TYPES
// ============================================================================

interface ChatInterfaceProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  selectedAgents: string[];
  agents: Agent[];
  visibility: 'project' | 'team' | 'private';
  setVisibility: (visibility: 'project' | 'team' | 'private') => void;
  messages: Message[];
  setMessages?: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
  newMessage: string;
  setNewMessage: (message: string) => void;
  attachments: Attachment[];
  onSendMessage: () => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveAttachment: (attachmentId: string) => void;
  onConvertMessage: (messageId: string, type: 'task' | 'document') => void;
  onFeedback?: (messageId: string, feedback: 'positive' | 'negative', comment?: string) => Promise<void>;
  formatFileSize: (bytes: number) => string;
}

interface FeedbackPayload {
  messageId: string;
  feedback: 'positive' | 'negative';
  comment?: string;
  timestamp: string;
  messageContent: string;
  selectedAgents: string[];
  conversationContext: Array<{
    id: string;
    content: string;
    sender: string;
    timestamp: Date;
  }>;
  visibility: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const CONTEXT_MESSAGE_COUNT = 5;
const FEEDBACK_API_ENDPOINT = '/api/feedback';
const TOAST_DURATION = 3000;

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * ChatInterface - Main container for project collaboration features
 * 
 * Features:
 * - Real-time chat with AI agents
 * - Task management
 * - Document collaboration
 * - Conversation history
 * - Feedback system with optimistic updates
 * - Auto-scroll behavior
 */
const ChatInterface: React.FC<ChatInterfaceProps> = ({
  activeTab,
  setActiveTab,
  selectedAgents,
  agents,
  visibility,
  setVisibility,
  messages,
  setMessages,
  newMessage,
  setNewMessage,
  attachments,
  onSendMessage,
  onFileUpload,
  onRemoveAttachment,
  onConvertMessage,
  onFeedback,
  formatFileSize
}) => {
  // ============================================================================
  // STATE
  // ============================================================================
  
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  // ============================================================================
  // CUSTOM HOOKS
  // ============================================================================
  
  const {
    messagesEndRef,
    messageContainerRef,
    fileInputRef,
    handleFileButtonClick,
    handleScroll,
    scrollToBottom,
    handleScrollToBottomClick,
    showScrollButton,
  } = useChatInterface({
    initialMessages: messages,
    onSendMessage,
  });

  // ============================================================================
  // MEMOIZED VALUES
  // ============================================================================
  
  /**
   * Get conversation context for feedback
   * Memoized to avoid recalculating on every render
   */
  const conversationContext = useMemo(() => {
    return messages
      .slice(Math.max(0, messages.length - CONTEXT_MESSAGE_COUNT))
      .map(m => ({
        id: m.id,
        content: m.content,
        sender: m.sender,
        timestamp: m.timestamp
      }));
  }, [messages]);

  // ============================================================================
  // CALLBACKS
  // ============================================================================
  
  /**
   * Default feedback handler - sends to API endpoint
   * Extracted and memoized for better performance
   */
  const defaultFeedbackHandler = useCallback(async (
    messageId: string,
    feedback: 'positive' | 'negative',
    comment?: string
  ): Promise<void> => {
    const message = messages.find(m => m.id === messageId);
    if (!message) {
      throw new Error('Message not found');
    }

    const payload: FeedbackPayload = {
      messageId,
      feedback,
      comment,
      timestamp: new Date().toISOString(),
      messageContent: message.content,
      selectedAgents,
      conversationContext,
      visibility
    };

    const response = await fetch(FEEDBACK_API_ENDPOINT, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to submit feedback');
    }

    return response.json();
  }, [messages, selectedAgents, conversationContext, visibility]);

  /**
   * Apply optimistic update to message feedback
   */
  const applyOptimisticUpdate = useCallback((
    messageId: string,
    feedback: 'positive' | 'negative',
    comment?: string
  ) => {
    if (!setMessages) return;

    setMessages(prev => prev.map(msg =>
      msg.id === messageId
        ? {
            ...msg,
            feedback: {
              type: feedback,
              comment,
              timestamp: new Date()
            }
          }
        : msg
    ));
  }, [setMessages]);

  /**
   * Revert optimistic update on error
   */
  const revertOptimisticUpdate = useCallback((messageId: string) => {
    if (!setMessages) return;

    setMessages(prev => prev.map(msg =>
      msg.id === messageId
        ? {
            ...msg,
            feedback: undefined
          }
        : msg
    ));
  }, [setMessages]);

  /**
   * Handle feedback submission with error handling and optimistic updates
   * Memoized to prevent unnecessary re-renders
   */
  const handleFeedbackSubmission = useCallback(async (
    messageId: string,
    feedback: 'positive' | 'negative',
    comment?: string
  ) => {
    // Clear any existing errors
    setFeedbackError(null);

    // Apply optimistic update immediately
    applyOptimisticUpdate(messageId, feedback, comment);

    try {
      // Use provided handler or default
      const feedbackHandler = onFeedback || defaultFeedbackHandler;
      await feedbackHandler(messageId, feedback, comment);
      
      // Show success toast
      toast.success(
        feedback === 'positive' 
          ? 'Thank you for your feedback!' 
          : 'Feedback recorded. We\'ll improve!',
        { duration: TOAST_DURATION }
      );
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      
      // Show error message
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to submit feedback. Please try again.';
      
      setFeedbackError(errorMessage);
      
      // Revert optimistic update
      revertOptimisticUpdate(messageId);
      
      // Show error toast
      toast.error(errorMessage, { duration: TOAST_DURATION });
    }
  }, [onFeedback, defaultFeedbackHandler, applyOptimisticUpdate, revertOptimisticUpdate]);

  /**
   * Handle session resume from history
   * Memoized to prevent unnecessary re-renders
   */
  const handleResumeSession = useCallback((sessionId: string) => {
    setActiveTab('chat');
    
    // Clear any existing errors
    setFeedbackError(null);
    
    console.log('Resuming session:', sessionId);
    
    // TODO: Implement session loading
    // Example implementation:
    // if (setMessages) {
    //   loadSessionMessages(sessionId)
    //     .then(setMessages)
    //     .catch(error => {
    //       console.error('Failed to load session:', error);
    //       toast.error('Failed to load session');
    //     });
    // }
    
    toast.success('Session resumed', { duration: TOAST_DURATION });
  }, [setActiveTab]);

  /**
   * Clear feedback error
   */
  const clearFeedbackError = useCallback(() => {
    setFeedbackError(null);
  }, []);

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================
  
  /**
   * Render feedback error toast
   * Extracted for better readability
   */
  const renderFeedbackError = () => {
    if (!feedbackError) return null;

    return (
      <div className="mx-4 mt-4 mb-2 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between animate-slide-down">
        <div className="flex items-center gap-2 text-sm text-red-800">
          <svg 
            className="w-4 h-4 flex-shrink-0" 
            fill="currentColor" 
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path 
              fillRule="evenodd" 
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
              clipRule="evenodd" 
            />
          </svg>
          <span>{feedbackError}</span>
        </div>
        <button
          onClick={clearFeedbackError}
          className="text-red-600 hover:text-red-800 transition-colors p-1 rounded hover:bg-red-100"
          aria-label="Dismiss error"
          type="button"
        >
          <svg 
            className="w-4 h-4" 
            fill="currentColor" 
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path 
              fillRule="evenodd" 
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
              clipRule="evenodd" 
            />
          </svg>
        </button>
      </div>
    );
  };

  /**
   * Render chat tab content
   */
  const renderChatTab = () => (
    <>
      {renderFeedbackError()}
      
      <MessageList
        messages={messages}
        messagesEndRef={messagesEndRef}
        messageContainerRef={messageContainerRef}
        onConvertMessage={onConvertMessage}
        onFeedback={handleFeedbackSubmission}
        formatFileSize={formatFileSize}
        onScroll={handleScroll}
        showScrollButton={showScrollButton}
        onScrollToBottom={handleScrollToBottomClick}
      />
      
      <MessageInput
        selectedAgents={selectedAgents}
        agents={agents}
        visibility={visibility}
        setVisibility={setVisibility}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        attachments={attachments}
        onSendMessage={onSendMessage}
        onFileUpload={onFileUpload}
        onRemoveAttachment={onRemoveAttachment}
        formatFileSize={formatFileSize}
        fileInputRef={fileInputRef}
        onFileButtonClick={handleFileButtonClick}
      />
    </>
  );

  /**
   * Render active tab content
   * Memoized to prevent unnecessary re-renders
   */
  const renderTabContent = useMemo(() => {
    switch (activeTab) {
      case 'chat':
        return renderChatTab();
      
      case 'documents':
        return <DocumentsTab />;
      
      case 'tasks':
        return <TasksTab agents={agents} />;
      
      case 'history':
        return (
          <HistoryTab 
            agents={agents} 
            onResumeSession={handleResumeSession}
          />
        );
      
      default:
        return null;
    }
  }, [
    activeTab, 
    messages, 
    agents, 
    feedbackError,
    selectedAgents,
    visibility,
    newMessage,
    attachments,
    showScrollButton
  ]);

  // ============================================================================
  // RENDER
  // ============================================================================
  
  return (
    <div className="bg-white rounded-lg shadow border h-[calc(100vh-14rem)] flex flex-col overflow-hidden">
      <ChatHeader 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      {renderTabContent}
    </div>
  );
};

// ============================================================================
// DISPLAY NAME
// ============================================================================

ChatInterface.displayName = 'ChatInterface';

// ============================================================================
// EXPORT
// ============================================================================

export default ChatInterface;
