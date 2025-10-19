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
  const hasScrolledToInitialPosition = useRef(false);

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
   * 1. NOT on initial mount (respect page-level scroll position)
   * 2. New messages are added
   * 3. User is already near the bottom (don't interrupt reading)
   */
  useEffect(() => {
    // Skip ALL scrolling on initial mount to respect page scroll position
    if (isInitialMount.current) {
      isInitialMount.current = false;
      previousMessageCount.current = initialMessages.length;
      
      // Mark that we've handled initial position (but don't scroll)
      hasScrolledToInitialPosition.current = true;
      return;
    }

    // Only scroll if message count increased (new message added)
    const messageCountIncreased = initialMessages.length > previousMessageCount.current;
    
    // Auto-scroll only if:
    // - New message was added
    // - User is near bottom OR it's their first interaction after page load
    if (messageCountIncreased && (isNearBottom || !hasScrolledToInitialPosition.current)) {
      scrollToBottom('smooth');
      hasScrolledToInitialPosition.current = true;
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
