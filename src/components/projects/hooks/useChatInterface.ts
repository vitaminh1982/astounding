/**
 * Custom hook for managing chat interface state and logic
 * Handles message scrolling, file uploads, and tab navigation
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { Message, Attachment, TabType } from '../types';

// ============================================================================
// CONSTANTS
// ============================================================================

const SCROLL_THRESHOLD = 100; // pixels from bottom to consider "near bottom"
const SCROLL_BUTTON_THRESHOLD = 200; // pixels from bottom to show scroll button
const INITIAL_RENDER_DELAY = 50; // ms to wait before checking initial scroll position

// ============================================================================
// TYPES
// ============================================================================

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

// ============================================================================
// HOOK
// ============================================================================

export const useChatInterface = (
  initialMessages: Message[],
  onSendMessage: () => void,
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void,
  onRemoveAttachment: (attachmentId: string) => void,
  onConvertMessage: (messageId: string, type: 'task' | 'document') => void
): UseChatInterfaceReturn => {
  
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
  
  // Track state without causing re-renders
  const previousMessageCount = useRef(initialMessages.length);
  const isInitialRender = useRef(true);
  const userHasScrolled = useRef(false);
  
  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================
  
  /**
   * Check if user is near the bottom of the scroll container
   * Pure function - no state updates
   */
  const isNearBottom = useCallback((): boolean => {
    const container = messageContainerRef.current;
    if (!container) return true;

    const distanceFromBottom = 
      container.scrollHeight - container.scrollTop - container.clientHeight;
    
    return distanceFromBottom < SCROLL_THRESHOLD;
  }, []);

  /**
   * Get current scroll position info
   */
  const getScrollInfo = useCallback(() => {
    const container = messageContainerRef.current;
    if (!container) {
      return {
        scrollHeight: 0,
        scrollTop: 0,
        clientHeight: 0,
        distanceFromBottom: 0,
        isAtBottom: true
      };
    }

    const distanceFromBottom = 
      container.scrollHeight - container.scrollTop - container.clientHeight;

    return {
      scrollHeight: container.scrollHeight,
      scrollTop: container.scrollTop,
      clientHeight: container.clientHeight,
      distanceFromBottom,
      isAtBottom: distanceFromBottom < SCROLL_THRESHOLD
    };
  }, []);

  /**
   * Scroll to bottom programmatically
   */
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth'): void => {
    // Use requestAnimationFrame for smoother scrolling
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ 
        behavior,
        block: 'end',
        inline: 'nearest'
      });
    });
  }, []);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  
  /**
   * Handle scroll events - track scroll position and show/hide scroll button
   * Throttled by browser's scroll event frequency
   */
  const handleScroll = useCallback((): void => {
    const scrollInfo = getScrollInfo();
    
    // Mark that user has interacted with scroll
    if (scrollInfo.scrollTop > 0) {
      userHasScrolled.current = true;
    }

    // Show scroll button when user scrolls up significantly
    const shouldShowButton = scrollInfo.distanceFromBottom > SCROLL_BUTTON_THRESHOLD;
    setShowScrollButton(shouldShowButton);
  }, [getScrollInfo]);

  /**
   * Handle tab changes
   */
  const handleTabChange = useCallback((tab: TabType): void => {
    setActiveTab(tab);
    
    // Scroll to bottom when switching to chat tab
    if (tab === 'chat') {
      setTimeout(() => scrollToBottom('auto'), 100);
    }
  }, [scrollToBottom]);

  /**
   * Trigger file input click
   */
  const handleFileButtonClick = useCallback((): void => {
    fileInputRef.current?.click();
  }, []);

  /**
   * Force scroll to bottom (for manual scroll button)
   */
  const handleScrollToBottomClick = useCallback((): void => {
    scrollToBottom('smooth');
    setShowScrollButton(false);
    userHasScrolled.current = false;
  }, [scrollToBottom]);

  // ============================================================================
  // EFFECTS
  // ============================================================================
  
  /**
   * Initial mount effect - set up initial scroll position
   */
  useEffect(() => {
    if (isInitialRender.current) {
      // Small delay to ensure DOM is fully rendered
      const timer = setTimeout(() => {
        const container = messageContainerRef.current;
        if (container && initialMessages.length > 0) {
          // Start at bottom for initial render
          container.scrollTop = container.scrollHeight;
        }
        isInitialRender.current = false;
      }, INITIAL_RENDER_DELAY);

      return () => clearTimeout(timer);
    }
  }, []); // Run only once

  /**
   * Auto-scroll effect when new messages arrive
   * Only scrolls if:
   * 1. Not initial render (already handled above)
   * 2. Message count increased (new message added)
   * 3. User is near bottom OR hasn't scrolled yet
   */
  useEffect(() => {
    // Skip on initial render
    if (isInitialRender.current) {
      previousMessageCount.current = initialMessages.length;
      return;
    }

    const messageCountIncreased = initialMessages.length > previousMessageCount.current;
    
    if (messageCountIncreased) {
      const shouldAutoScroll = isNearBottom() || !userHasScrolled.current;
      
      if (shouldAutoScroll) {
        scrollToBottom('smooth');
      } else {
        // Show notification that new messages arrived
        setShowScrollButton(true);
      }
    }
    
    previousMessageCount.current = initialMessages.length;
  }, [initialMessages.length, isNearBottom, scrollToBottom]); // Only depend on length, not entire array

  /**
   * Cleanup effect
   */
  useEffect(() => {
    return () => {
      // Reset refs on unmount
      isInitialRender.current = true;
      userHasScrolled.current = false;
      previousMessageCount.current = 0;
    };
  }, []);

  // ============================================================================
  // RETURN
  // ============================================================================
  
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

// ============================================================================
// EXPORT
// ============================================================================

export default useChatInterface;
