/**
 * Custom hook for managing chat interface state and logic - Enhanced
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { Message, Attachment, TabType } from '../types';

export const useChatInterface = (
  initialMessages: Message[],
  onSendMessage: () => void,
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void,
  onRemoveAttachment: (attachmentId: string) => void,
  onConvertMessage: (messageId: string, type: 'task' | 'document') => void
) => {
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previousMessageCount = useRef(initialMessages.length);
  const isInitialMount = useRef(true);

  /**
   * Check if user is near the bottom of the scroll container
   */
  const checkIfNearBottom = useCallback(() => {
    const container = messageContainerRef.current;
    if (!container) return true;

    const threshold = 100; // pixels from bottom
    const position = container.scrollHeight - container.scrollTop - container.clientHeight;
    return position < threshold;
  }, []);

  /**
   * Handle scroll events - track scroll position and show/hide scroll button
   */
  const handleScroll = useCallback(() => {
    const container = messageContainerRef.current;
    if (!container) return;

    const nearBottom = checkIfNearBottom();
    setIsNearBottom(nearBottom);

    // Show scroll-to-bottom button when user scrolls up
    const scrolledUp = container.scrollHeight - container.scrollTop - container.clientHeight > 200;
    setShowScrollButton(scrolledUp);
  }, [checkIfNearBottom]);

  /**
   * Scroll to bottom programmatically
   */
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  /**
   * Auto-scroll to bottom only when:
   * 1. New messages are added (not on initial mount)
   * 2. User is already near the bottom (don't interrupt reading)
   */
  useEffect(() => {
    // Skip scroll on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      previousMessageCount.current = initialMessages.length;
      // Scroll to bottom instantly on first load
      scrollToBottom('auto');
      return;
    }

    // Only scroll if message count increased (new message added)
    const messageCountIncreased = initialMessages.length > previousMessageCount.current;
    
    // Auto-scroll only if user is near bottom or if it's their own message
    if (messageCountIncreased && isNearBottom) {
      scrollToBottom('smooth');
    }
    
    previousMessageCount.current = initialMessages.length;
  }, [initialMessages, isNearBottom, scrollToBottom]);

  /**
   * Handle tab changes
   */
  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
  }, []);

  /**
   * Trigger file input click
   */
  const handleFileButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  /**
   * Force scroll to bottom (for manual scroll button)
   */
  const handleScrollToBottomClick = useCallback(() => {
    scrollToBottom('smooth');
    setShowScrollButton(false);
  }, [scrollToBottom]);

  return {
    activeTab,
    setActiveTab: handleTabChange,
    messagesEndRef,
    messageContainerRef,
    fileInputRef,
    handleFileButtonClick,
    handleScroll,
    scrollToBottom,
    handleScrollToBottomClick,
    showScrollButton,
    isNearBottom
  };
};
