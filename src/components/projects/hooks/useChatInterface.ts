/**
 * Custom hook for chat interface logic with proper auto-scroll
 */
import { useState, useRef, useCallback, useEffect } from 'react';
import { TabType } from '../types';

type ScrollBehavior = 'auto' | 'smooth';

interface UseChatInterfaceProps {
  initialMessages: any[];
  onSendMessage?: (message: string) => void;
}

interface UseChatInterfaceReturn {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  messageContainerRef: React.RefObject<HTMLDivElement>;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileButtonClick: () => void;
  handleScroll: () => void;
  scrollToBottom: (behavior?: ScrollBehavior) => void;
  handleScrollToBottomClick: () => void;
  showScrollButton: boolean;
  isNearBottom: () => boolean;
}

export const useChatInterface = ({ 
  initialMessages,
  onSendMessage 
}: UseChatInterfaceProps): UseChatInterfaceReturn => {
  // ============================================================================
  // STATE
  // ============================================================================
  
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  // ============================================================================
  // REFS
  // ============================================================================
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previousMessageCount = useRef(0);
  const isUserScrolling = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout>();
  const lastScrollTop = useRef(0);
  
  // ============================================================================
  // CALLBACKS
  // ============================================================================
  
  /**
   * Check if user is near bottom of scroll container
   */
  const isNearBottom = useCallback((): boolean => {
    if (!messageContainerRef.current) return true;
    
    const { scrollTop, scrollHeight, clientHeight } = messageContainerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    
    // Consider "near bottom" if within 150px of bottom
    return distanceFromBottom < 150;
  }, []);
  
  /**
   * Scroll to bottom of messages
   */
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    // Use messagesEndRef for more reliable scrolling
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior,
        block: 'end',
        inline: 'nearest'
      });
    }
    
    // Fallback to container scroll
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTo({
        top: messageContainerRef.current.scrollHeight,
        behavior
      });
    }
  }, []);
  
  /**
   * Handle scroll button click
   */
  const handleScrollToBottomClick = useCallback(() => {
    isUserScrolling.current = false;
    scrollToBottom('smooth');
  }, [scrollToBottom]);
  
  /**
   * Handle scroll events with debouncing
   */
  const handleScroll = useCallback(() => {
    if (!messageContainerRef.current) return;
    
    const { scrollTop } = messageContainerRef.current;
    
    // Detect if user is manually scrolling up
    if (scrollTop < lastScrollTop.current) {
      isUserScrolling.current = true;
    }
    
    lastScrollTop.current = scrollTop;
    
    // Clear existing timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
    
    // Set new timeout to detect when scrolling stops
    scrollTimeout.current = setTimeout(() => {
      const nearBottom = isNearBottom();
      
      // If user scrolled back to bottom, reset manual scroll flag
      if (nearBottom) {
        isUserScrolling.current = false;
      }
      
      // Show/hide scroll button
      setShowScrollButton(!nearBottom);
    }, 150);
  }, [isNearBottom]);
  
  /**
   * Handle file button click
   */
  const handleFileButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);
  
  // ============================================================================
  // EFFECTS
  // ============================================================================
  
  /**
   * Auto-scroll on new messages
   */
  useEffect(() => {
    const messageCount = initialMessages.length;
    const hasNewMessages = messageCount > previousMessageCount.current;
    
    if (!hasNewMessages) {
      previousMessageCount.current = messageCount;
      return;
    }
    
    // Get the last message to check if it's from user or agent
    const lastMessage = initialMessages[messageCount - 1];
    const isUserMessage = lastMessage?.sender === 'user';
    
    // Scroll behavior logic:
    // 1. Always scroll on user's own messages (instant)
    // 2. Scroll on AI responses if user is near bottom or hasn't manually scrolled up
    // 3. Don't scroll if user has manually scrolled up (unless it's their own message)
    
    const shouldScroll = isUserMessage || !isUserScrolling.current || isNearBottom();
    
    if (shouldScroll) {
      // Use instant scroll for user messages, smooth for AI responses
      const behavior = isUserMessage ? 'auto' : 'smooth';
      
      // Small delay to ensure DOM has updated
      requestAnimationFrame(() => {
        scrollToBottom(behavior);
      });
    }
    
    previousMessageCount.current = messageCount;
  }, [initialMessages, isNearBottom, scrollToBottom]);
  
  /**
   * Reset scroll state when tab changes
   */
  useEffect(() => {
    isUserScrolling.current = false;
    lastScrollTop.current = 0;
    setShowScrollButton(false);
  }, [activeTab]);
  
  /**
   * Cleanup timeout on unmount
   */
  useEffect(() => {
    return () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);
  
  // ============================================================================
  // RETURN
  // ============================================================================
  
  return {
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
  };
};
