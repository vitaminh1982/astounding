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
  const previousMessageCount = useRef(initialMessages.length);
  const isInitialMount = useRef(true);

  // Auto-scroll to bottom only when new messages are added (not on initial mount)
  useEffect(() => {
    // Skip scroll on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      previousMessageCount.current = initialMessages.length;
      return;
    }

    // Only scroll if message count increased (new message added)
    const messageCountIncreased = initialMessages.length > previousMessageCount.current;
    
    if (messageCountIncreased && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    
    previousMessageCount.current = initialMessages.length;
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
