/**
 * ScrollToBottomButton.tsx
 * Floating button that appears when user scrolls up from bottom of chat
 */
import React, { memo } from 'react';
import { ArrowDown, MessageCircle } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface ScrollToBottomButtonProps {
  /** Click handler to scroll to bottom */
  onClick: () => void;
  /** Optional count of new unread messages */
  messageCount?: number;
  /** Whether button should be visible */
  show?: boolean;
  /** Custom className for positioning/styling */
  className?: string;
  /** Position variant */
  position?: 'bottom-right' | 'bottom-center' | 'bottom-left';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Show pulse animation for new messages */
  pulse?: boolean;
  /** Custom label for accessibility */
  ariaLabel?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const POSITION_CLASSES = {
  'bottom-right': 'right-6',
  'bottom-center': 'left-1/2 -translate-x-1/2',
  'bottom-left': 'left-6',
} as const;

const SIZE_CLASSES = {
  sm: {
    button: 'p-2',
    icon: 'w-4 h-4',
    badge: 'text-[10px] min-w-[16px] h-4',
    bottom: 'bottom-20',
  },
  md: {
    button: 'p-3',
    icon: 'w-5 h-5',
    badge: 'text-xs min-w-[20px] h-5',
    bottom: 'bottom-24',
  },
  lg: {
    button: 'p-4',
    icon: 'w-6 h-6',
    badge: 'text-sm min-w-[24px] h-6',
    bottom: 'bottom-28',
  },
} as const;

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * ScrollToBottomButton - Floating action button for chat navigation
 * 
 * Features:
 * - Smooth animations when showing/hiding
 * - Optional message count badge
 * - Hover effects and interactions
 * - Fully accessible
 * - Customizable positioning and sizing
 * - Pulse animation for new messages
 * 
 * @example
 * ```tsx
 * <ScrollToBottomButton
 *   onClick={scrollToBottom}
 *   show={showButton}
 *   messageCount={3}
 *   pulse={hasNewMessages}
 * />
 * ```
 */
const ScrollToBottomButton: React.FC<ScrollToBottomButtonProps> = memo(({
  onClick,
  messageCount,
  show = true,
  className = '',
  position = 'bottom-right',
  size = 'md',
  pulse = false,
  ariaLabel = 'Scroll to bottom',
}) => {
  // ============================================================================
  // DERIVED STATE
  // ============================================================================
  
  const hasUnreadMessages = messageCount !== undefined && messageCount > 0;
  const displayCount = messageCount && messageCount > 99 ? '99+' : messageCount;
  
  const sizeClasses = SIZE_CLASSES[size];
  const positionClass = POSITION_CLASSES[position];
  
  // ============================================================================
  // RENDER
  // ============================================================================
  
  if (!show) return null;

  return (
    <div
      className={`
        fixed ${sizeClasses.bottom} ${positionClass} z-50
        transform transition-all duration-300 ease-out
        ${show ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}
        ${className}
      `}
      role="complementary"
      aria-live="polite"
    >
      {/* Main Button */}
      <button
        onClick={onClick}
        className={`
          relative group
          ${sizeClasses.button}
          bg-gradient-to-br from-blue-600 to-blue-700
          hover:from-blue-700 hover:to-blue-800
          active:from-blue-800 active:to-blue-900
          text-white rounded-full
          shadow-lg hover:shadow-xl
          transition-all duration-200
          hover:scale-110 active:scale-95
          focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
          ${pulse ? 'animate-pulse' : ''}
        `}
        aria-label={hasUnreadMessages ? `${ariaLabel} (${displayCount} new messages)` : ariaLabel}
        title={hasUnreadMessages ? `${displayCount} new messages` : ariaLabel}
        type="button"
      >
        {/* Icon with rotation animation on hover */}
        <div className="relative flex items-center justify-center">
          <ArrowDown 
            className={`
              ${sizeClasses.icon}
              transition-transform duration-300
              group-hover:translate-y-0.5
            `}
            strokeWidth={2.5}
            aria-hidden="true"
          />
        </div>
        
        {/* Ripple effect on click */}
        <span 
          className="
            absolute inset-0 rounded-full
            bg-white opacity-0 group-active:opacity-20
            transition-opacity duration-150
          "
          aria-hidden="true"
        />
        
        {/* Unread message badge */}
        {hasUnreadMessages && (
          <span
            className={`
              absolute -top-1 -right-1
              ${sizeClasses.badge}
              px-1.5 py-0.5
              bg-red-500 text-white
              rounded-full font-bold
              shadow-md
              flex items-center justify-center
              animate-bounce
              ring-2 ring-white
            `}
            aria-label={`${messageCount} unread messages`}
          >
            {displayCount}
          </span>
        )}
        
        {/* Pulse ring for new messages */}
        {pulse && (
          <span
            className="
              absolute inset-0 rounded-full
              bg-blue-400 opacity-75
              animate-ping
            "
            aria-hidden="true"
          />
        )}
      </button>
      
      {/* Optional tooltip on hover */}
      <div
        className="
          absolute bottom-full right-0 mb-2
          px-3 py-1.5 bg-gray-900 text-white text-sm
          rounded-lg shadow-lg whitespace-nowrap
          opacity-0 group-hover:opacity-100
          transition-opacity duration-200
          pointer-events-none
        "
        role="tooltip"
      >
        {hasUnreadMessages ? `${displayCount} new messages` : 'Scroll to bottom'}
        <div
          className="
            absolute top-full right-4
            border-4 border-transparent border-t-gray-900
          "
          aria-hidden="true"
        />
      </div>
    </div>
  );
});

// ============================================================================
// DISPLAY NAME
// ============================================================================

ScrollToBottomButton.displayName = 'ScrollToBottomButton';

// ============================================================================
// EXPORT
// ============================================================================

export default ScrollToBottomButton;
