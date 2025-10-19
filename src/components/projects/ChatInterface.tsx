/**
 * Main chat interface component for project collaboration - Enhanced with Feedback
 */
import React, { useState } from 'react';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import TasksTab from './components/TasksTab';
import HistoryTab from './components/HistoryTab';
import DocumentsTab from './components/DocumentsTab';
import ScrollToBottomButton from './components/ScrollToBottomButton';
import { useChatInterface } from './hooks/useChatInterface';
import { Agent, Attachment, Message, TabType } from './types';

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

/**
 * ChatInterface is the main container for project collaboration features
 * including chat, tasks, documents, and history management
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
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  const {
    messagesEndRef,
    messageContainerRef,
    fileInputRef,
    handleFileButtonClick,
    handleScroll,
    showScrollButton,
    handleScrollToBottomClick
  } = useChatInterface(
    messages,
    onSendMessage,
    onFileUpload,
    onRemoveAttachment,
    onConvertMessage
  );

  /**
   * Handle feedback submission with error handling and optimistic updates
   */
  const handleFeedbackSubmission = async (
    messageId: string,
    feedback: 'positive' | 'negative',
    comment?: string
  ) => {
    setFeedbackError(null);

    // Optimistic update - immediately update UI
    if (setMessages) {
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
    }

    // Call the provided feedback handler or use default
    if (onFeedback) {
      try {
        await onFeedback(messageId, feedback, comment);
      } catch (error) {
        console.error('Failed to submit feedback:', error);
        setFeedbackError('Failed to submit feedback. Please try again.');
        
        // Revert optimistic update on error
        if (setMessages) {
          setMessages(prev => prev.map(msg =>
            msg.id === messageId
              ? {
                  ...msg,
                  feedback: undefined
                }
              : msg
          ));
        }
      }
    } else {
      // Default feedback handler if none provided
      try {
        await defaultFeedbackHandler(messageId, feedback, comment);
      } catch (error) {
        console.error('Failed to submit feedback:', error);
        setFeedbackError('Failed to submit feedback. Please try again.');
        
        // Revert optimistic update on error
        if (setMessages) {
          setMessages(prev => prev.map(msg =>
            msg.id === messageId
              ? {
                  ...msg,
                  feedback: undefined
                }
              : msg
          ));
        }
      }
    }
  };

  /**
   * Default feedback handler - sends to API endpoint
   */
  const defaultFeedbackHandler = async (
    messageId: string,
    feedback: 'positive' | 'negative',
    comment?: string
  ) => {
    const message = messages.find(m => m.id === messageId);
    if (!message) return;

    // Get recent conversation context (last 5 messages)
    const contextMessages = messages
      .slice(Math.max(0, messages.length - 5))
      .map(m => ({
        id: m.id,
        content: m.content,
        sender: m.sender,
        timestamp: m.timestamp
      }));

    const response = await fetch('/api/feedback', {
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
        conversationContext: contextMessages,
        visibility
      })
    });

    if (!response.ok) {
      throw new Error('Failed to submit feedback');
    }

    return response.json();
  };

  const handleResumeSession = (sessionId: string) => {
    // Switch to chat tab and populate with session context
    setActiveTab('chat');
    console.log('Resuming session:', sessionId);
    
    // TODO: Load session messages
    // if (setMessages) {
    //   loadSessionMessages(sessionId).then(setMessages);
    // }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return (
          <div className="relative flex flex-col h-full">
            {/* Feedback Error Toast */}
            {feedbackError && (
              <div className="mx-4 mt-4 mb-2 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-red-800">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{feedbackError}</span>
                </div>
                <button
                  onClick={() => setFeedbackError(null)}
                  className="text-red-600 hover:text-red-800"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}

            <MessageList
              messages={messages}
              messagesEndRef={messagesEndRef}
              messageContainerRef={messageContainerRef}
              onConvertMessage={onConvertMessage}
              onFeedback={handleFeedbackSubmission}
              formatFileSize={formatFileSize}
              onScroll={handleScroll}
            />

            {/* Scroll to bottom button */}
            {showScrollButton && (
              <ScrollToBottomButton onClick={handleScrollToBottomClick} />
            )}

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
          </div>
        );
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
  };

  return (
    <div className="bg-white rounded-lg shadow border h-[calc(100vh-14rem)] flex flex-col overflow-hidden">
      <ChatHeader activeTab={activeTab} onTabChange={setActiveTab} />
      {renderTabContent()}
    </div>
  );
};

export default ChatInterface;
