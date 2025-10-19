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

    const threshold = 100;
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
   * Auto-scroll to bottom only when appropriate
   */
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      previousMessageCount.current = initialMessages.length;
      hasScrolledToInitialPosition.current = true;
      return;
    }

    const messageCountIncreased = initialMessages.length > previousMessageCount.current;
    
    if (messageCountIncreased && (isNearBottom || !hasScrolledToInitialPosition.current)) {
      scrollToBottom('smooth');
      hasScrolledToInitialPosition.current = true;
    }
    
    previousMessageCount.current = initialMessages.length;
  }, [initialMessages, isNearBottom, scrollToBottom]);

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
