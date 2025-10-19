/**
 * Main chat interface component for project collaboration
 * Manages chat messages, tasks, documents, and conversation history
 */
import React, { useState, useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import TasksTab from './components/TasksTab';
import HistoryTab from './components/HistoryTab';
import DocumentsTab from './components/DocumentsTab';
import ScrollToBottomButton from './components/ScrollToBottomButton';
import { useChatInterface } from './hooks/useChatInterface';
import { Agent, Attachment, Message, TabType } from './types';

// ============================================================================
// TYPES
// ============================================================================

interface ChatInterfaceProps {
  selectedAgents: string[];
  agents: Agent[];
  visibility: 'project' | 'team' | 'private';
  setVisibility: (visibility: 'project' | 'team' | 'private') => void;
  messages: Message[];
  setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
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

interface FeedbackState {
  [messageId: string]: {
    loading: boolean;
    error: string | null;
  };
}

// ============================================================================
// CONSTANTS
// ============================================================================

const FEEDBACK_API_ENDPOINT = '/api/feedback';
const CONTEXT_MESSAGE_COUNT = 5;
const FEEDBACK_TIMEOUT = 10000; // 10 seconds

// ============================================================================
// COMPONENT
// ============================================================================

const ChatInterface: React.FC<ChatInterfaceProps> = ({
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
  
  const [feedbackStates, setFeedbackStates] = useState<FeedbackState>({});

  // ============================================================================
  // HOOKS
  // ============================================================================
  
  const {
    activeTab,
    setActiveTab,
    messagesEndRef,
    messageContainerRef,
    fileInputRef,
    handleFileButtonClick,
    handleScroll,
    scrollToBottom,
    handleScrollToBottomClick,
    showScrollButton,
    isNearBottom
  } = useChatInterface(
    messages,
    onSendMessage,
    onFileUpload,
    onRemoveAttachment,
    onConvertMessage
  );

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================
  
  const activeAgents = useMemo(() => 
    agents.filter(agent => selectedAgents.includes(agent.id)),
    [agents, selectedAgents]
  );

  // ============================================================================
  // FEEDBACK HANDLERS
  // ============================================================================
  
  /**
   * Get conversation context for feedback submission
   */
  const getConversationContext = useCallback(() => {
    return messages
      .slice(Math.max(0, messages.length - CONTEXT_MESSAGE_COUNT))
      .map(m => ({
        id: m.id,
        content: m.content,
        sender: m.sender,
        timestamp: m.timestamp
      }));
  }, [messages]);

  /**
   * Default feedback handler - sends to API endpoint
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

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FEEDBACK_TIMEOUT);

    try {
      const response = await fetch(FEEDBACK_API_ENDPOINT, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messageId,
          feedback,
          comment,
          timestamp: new Date().toISOString(),
          messageContent: message.content,
          selectedAgents,
          conversationContext: getConversationContext(),
          visibility
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to submit feedback');
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout - please try again');
        }
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }, [messages, selectedAgents, visibility, getConversationContext]);

  /**
   * Handle feedback submission with optimistic updates and error handling
   */
  const handleFeedbackSubmission = useCallback(async (
    messageId: string,
    feedback: 'positive' | 'negative',
    comment?: string
  ): Promise<void> => {
    // Prevent duplicate submissions
    if (feedbackStates[messageId]?.loading) {
      return;
    }

    // Set loading state
    setFeedbackStates(prev => ({
      ...prev,
      [messageId]: { loading: true, error: null }
    }));

    // Store original message for rollback
    const originalMessage = messages.find(m => m.id === messageId);
    if (!originalMessage) {
      setFeedbackStates(prev => ({
        ...prev,
        [messageId]: { loading: false, error: 'Message not found' }
      }));
      return;
    }

    // Optimistic update
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

    try {
      // Call the provided feedback handler or use default
      if (onFeedback) {
        await onFeedback(messageId, feedback, comment);
      } else {
        await defaultFeedbackHandler(messageId, feedback, comment);
      }

      // Success
      setFeedbackStates(prev => ({
        ...prev,
        [messageId]: { loading: false, error: null }
      }));

      // Show success toast
      toast.success(
        feedback === 'positive' 
          ? 'Thanks for your positive feedback!' 
          : 'Thanks for your feedback - we\'ll improve!',
        { duration: 3000 }
      );

    } catch (error) {
      console.error('Failed to submit feedback:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to submit feedback. Please try again.';

      // Revert optimistic update
      setMessages(prev => prev.map(msg =>
        msg.id === messageId
          ? { ...msg, feedback: originalMessage.feedback }
          : msg
      ));

      // Set error state
      setFeedbackStates(prev => ({
        ...prev,
        [messageId]: { loading: false, error: errorMessage }
      }));

      // Show error toast
      toast.error(errorMessage, { duration: 5000 });
    }
  }, [feedbackStates, messages, setMessages, onFeedback, defaultFeedbackHandler]);

  // ============================================================================
  // SESSION HANDLERS
  // ============================================================================
  
  /**
   * Handle resuming a previous conversation session
   */
  const handleResumeSession = useCallback(async (sessionId: string) => {
    try {
      setActiveTab('chat');
      
      // Show loading state
      toast.loading('Loading conversation...', { id: 'session-load' });

      // TODO: Implement actual session loading
      // const sessionMessages = await loadSessionMessages(sessionId);
      // setMessages(sessionMessages);
      
      // For now, just log
      console.log('Resuming session:', sessionId);
      
      // Scroll to bottom after loading
      setTimeout(() => scrollToBottom('auto'), 100);
      
      toast.success('Conversation loaded', { id: 'session-load' });
    } catch (error) {
      console.error('Failed to load session:', error);
      toast.error('Failed to load conversation', { id: 'session-load' });
    }
  }, [setActiveTab, scrollToBottom]);

  // ============================================================================
  // TAB CONTENT RENDERER
  // ============================================================================
  
  /**
   * Render content based on active tab
   * Memoized to prevent unnecessary re-renders
   */
  const tabContent = useMemo(() => {
    switch (activeTab) {
      case 'chat':
        return (
          <div className="flex-1 flex flex-col relative">
            <MessageList
              messages={messages}
              messagesEndRef={messagesEndRef}
              messageContainerRef={messageContainerRef}
              onConvertMessage={onConvertMessage}
              onFeedback={handleFeedbackSubmission}
              feedbackStates={feedbackStates}
              formatFileSize={formatFileSize}
              onScroll={handleScroll}
            />
            
            {/* Scroll to Bottom Button */}
            {showScrollButton && (
              <ScrollToBottomButton 
                onClick={handleScrollToBottomClick}
                messageCount={messages.length}
              />
            )}

            <MessageInput
              selectedAgents={selectedAgents}
              agents={activeAgents}
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
          </div>
        );

      case 'documents':
        return <DocumentsTab />;

      case 'tasks':
        return <TasksTab agents={activeAgents} />;

      case 'history':
        return (
          <HistoryTab 
            agents={activeAgents}
            onResumeSession={handleResumeSession}
          />
        );

      default:
        return (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <p>Select a tab to view content</p>
          </div>
        );
    }
  }, [
    activeTab,
    messages,
    messagesEndRef,
    messageContainerRef,
    onConvertMessage,
    handleFeedbackSubmission,
    feedbackStates,
    formatFileSize,
    handleScroll,
    showScrollButton,
    handleScrollToBottomClick,
    selectedAgents,
    activeAgents,
    visibility,
    setVisibility,
    newMessage,
    setNewMessage,
    attachments,
    onSendMessage,
    onFileUpload,
    onRemoveAttachment,
    fileInputRef,
    handleFileButtonClick,
    handleResumeSession
  ]);

  // ============================================================================
  // VALIDATION
  // ============================================================================
  
  // Warn if no agents are available
  React.useEffect(() => {
    if (agents.length === 0) {
      console.warn('ChatInterface: No agents available');
    }
    if (selectedAgents.length === 0) {
      console.warn('ChatInterface: No agents selected');
    }
  }, [agents, selectedAgents]);

  // ============================================================================
  // RENDER
  // ============================================================================
  
  return (
    <div className="bg-white rounded-lg shadow border h-[calc(100vh-14rem)] flex flex-col overflow-hidden">
      <ChatHeader 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        messageCount={messages.length}
        selectedAgentsCount={selectedAgents.length}
      />
      {tabContent}
    </div>
  );
};

// ============================================================================
// EXPORT
// ============================================================================

export default ChatInterface;
