/**
 * Custom hook for managing chat interface state and logic
 */
import { useState, useRef, useEffect } from 'react';
import { Message, Attachment, TabType } from '../types';

export const useChatInterface = (
  initialMessages: Message[],
  onSendMessage: () => void,
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void,
  onRemoveAttachment: (attachmentId: string) => void,
  onConvertMessage: (messageId: string, type: 'task' | 'document') => void
) => {
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [initialMessages]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  return {
    activeTab,
    setActiveTab: handleTabChange,
    messagesEndRef,
    fileInputRef,
    handleFileButtonClick
  };
};