/**
 * Main chat interface component for project collaboration
 */
import React from 'react';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import TasksTab from './components/TasksTab';
import HistoryTab from './components/HistoryTab';
import DocumentsTab from './components/DocumentsTab';
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
  newMessage: string;
  setNewMessage: (message: string) => void;
  attachments: Attachment[];
  onSendMessage: () => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveAttachment: (attachmentId: string) => void;
  onConvertMessage: (messageId: string, type: 'task' | 'document') => void;
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
  newMessage,
  setNewMessage,
  attachments,
  onSendMessage,
  onFileUpload,
  onRemoveAttachment,
  onConvertMessage,
  formatFileSize
}) => {
  const {
    messagesEndRef,
    fileInputRef,
    handleFileButtonClick
  } = useChatInterface(
    messages,
    onSendMessage,
    onFileUpload,
    onRemoveAttachment,
    onConvertMessage
  );

  const handleResumeSession = (sessionId: string) => {
    // Switch to chat tab and populate with session context
    setActiveTab('chat');
    console.log('Resuming session:', sessionId);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return (
          <>
            <MessageList
              messages={messages}
              messagesEndRef={messagesEndRef}
              onConvertMessage={onConvertMessage}
              formatFileSize={formatFileSize}
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