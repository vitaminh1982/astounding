/**
 * Chat header component with tab navigation - Enhanced
 */
import React, { useMemo, useCallback } from 'react';
import { MessageSquare, FileText, CheckSquare, Clock, LucideIcon } from 'lucide-react';
import { TabType } from '../types';

// ============================================================================
// TYPES
// ============================================================================

interface TabConfig {
  id: TabType;
  label: string;
  icon: LucideIcon;
  badge?: number;
  tooltip?: string;
  disabled?: boolean;
  visible?: boolean;
}

interface ChatHeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  unreadCount?: number;
  pendingTasksCount?: number;
  documentsCount?: number;
  historyCount?: number;
  loading?: boolean;
  disabledTabs?: TabType[];
  customTabs?: TabConfig[];
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format badge count for display (99+ for counts over 99)
 */
const formatBadgeCount = (count: number): string => {
  if (count > 99) return '99+';
  return count.toString();
};

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * ChatHeader component handles tab navigation with badges and accessibility
 */
const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  activeTab, 
  onTabChange,
  unreadCount = 0,
  pendingTasksCount = 0,
  documentsCount = 0,
  historyCount = 0,
  loading = false,
  disabledTabs = [],
  customTabs = []
}) => {
  // ============================================================================
  // MEMOIZED VALUES
  // ============================================================================
  
  /**
   * Default tab configuration
   */
  const defaultTabs: TabConfig[] = useMemo(() => [
    { 
      id: 'chat', 
      label: 'AI Chat', 
      icon: MessageSquare,
      badge: unreadCount,
      tooltip: 'Chat with AI agents',
      visible: true
    },
    { 
      id: 'documents', 
      label: 'Deliverables', 
      icon: FileText,
      badge: documentsCount,
      tooltip: 'View and manage deliverables',
      visible: true
    },
    { 
      id: 'tasks', 
      label: 'Tasks', 
      icon: CheckSquare,
      badge: pendingTasksCount,
      tooltip: 'Track and manage tasks',
      visible: true
    },
    { 
      id: 'history', 
      label: 'History', 
      icon: Clock,
      badge: historyCount,
      tooltip: 'View conversation history',
      visible: true
    }
  ], [unreadCount, documentsCount, pendingTasksCount, historyCount]);
  
  /**
   * Merge default tabs with custom tabs
   */
  const tabs: TabConfig[] = useMemo(() => {
    const merged = [...defaultTabs];
    
    // Add custom tabs
    customTabs.forEach(customTab => {
      const existingIndex = merged.findIndex(t => t.id === customTab.id);
      if (existingIndex >= 0) {
        // Override existing tab
        merged[existingIndex] = { ...merged[existingIndex], ...customTab };
      } else {
        // Add new tab
        merged.push(customTab);
      }
    });
    
    // Filter visible tabs and apply disabled state
    return merged
      .filter(tab => tab.visible !== false)
      .map(tab => ({
        ...tab,
        disabled: tab.disabled || disabledTabs.includes(tab.id) || loading
      }));
  }, [defaultTabs, customTabs, disabledTabs, loading]);
  
  // ============================================================================
  // CALLBACKS
  // ============================================================================
  
  /**
   * Handle tab change with validation
   */
  const handleTabChange = useCallback((tabId: TabType) => {
    const tab = tabs.find(t => t.id === tabId);
    
    // Don't change if disabled or already active
    if (tab?.disabled || tabId === activeTab) {
      return;
    }
    
    onTabChange(tabId);
  }, [tabs, activeTab, onTabChange]);
  
  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = useCallback((event: React.KeyboardEvent, tabId: TabType) => {
    const currentIndex = tabs.findIndex(t => t.id === tabId);
    
    let nextIndex = currentIndex;
    
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        break;
      case 'ArrowRight':
        event.preventDefault();
        nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        event.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        nextIndex = tabs.length - 1;
        break;
      default:
        return;
    }
    
    // Skip disabled tabs
    let attempts = 0;
    while (tabs[nextIndex]?.disabled && attempts < tabs.length) {
      nextIndex = event.key === 'ArrowLeft' || event.key === 'Home'
        ? nextIndex - 1 < 0 ? tabs.length - 1 : nextIndex - 1
        : nextIndex + 1 >= tabs.length ? 0 : nextIndex + 1;
      attempts++;
    }
    
    if (!tabs[nextIndex]?.disabled) {
      handleTabChange(tabs[nextIndex].id);
      
      // Focus the new tab
      const nextButton = document.querySelector(
        `button[data-tab-id="${tabs[nextIndex].id}"]`
      ) as HTMLButtonElement;
      nextButton?.focus();
    }
  }, [tabs, handleTabChange]);
  
  // ============================================================================
  // RENDER HELPERS
  // ============================================================================
  
  /**
   * Render badge if count > 0
   */
  const renderBadge = (count?: number) => {
    if (!count || count <= 0) return null;
    
    return (
      <span 
        className="ml-2 px-2 py-0.5 text-xs font-semibold bg-red-500 text-white rounded-full min-w-[20px] text-center"
        aria-label={`${count} items`}
      >
        {formatBadgeCount(count)}
      </span>
    );
  };
  
  /**
   * Render individual tab button
   */
  const renderTab = (tab: TabConfig) => {
    const { id, label, icon: Icon, badge, tooltip, disabled } = tab;
    const isActive = activeTab === id;
    
    return (
      <button
        key={id}
        data-tab-id={id}
        onClick={() => handleTabChange(id)}
        onKeyDown={(e) => handleKeyDown(e, id)}
        disabled={disabled}
        role="tab"
        aria-selected={isActive}
        aria-controls={`${id}-panel`}
        aria-label={tooltip || label}
        title={tooltip}
        tabIndex={isActive ? 0 : -1}
        className={`
          group relative flex items-center gap-2 px-6 py-4 text-sm font-medium 
          border-b-2 transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:focus:ring-teal-500
          disabled:opacity-50 disabled:cursor-not-allowed
          ${isActive 
            ? 'border-indigo-500 dark:border-teal-500 text-indigo-600 dark:text-teal-400' 
            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
          }
        `}
      >
        {/* Icon */}
        <Icon 
          className={`w-4 h-4 transition-transform duration-200 ${
            isActive ? 'scale-110' : 'group-hover:scale-105'
          }`}
          aria-hidden="true"
        />
        
        {/* Label */}
        <span className="whitespace-nowrap">{label}</span>
        
        {/* Badge */}
        {renderBadge(badge)}
        
        {/* Active indicator (animated underline) */}
        {isActive && (
          <span 
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 dark:bg-teal-500 animate-slide-in"
            aria-hidden="true"
          />
        )}
        
        {/* Loading indicator */}
        {loading && isActive && (
          <span 
            className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center"
            aria-label="Loading"
          >
            <svg 
              className="animate-spin h-4 w-4 text-indigo-600 dark:text-teal-400" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </span>
        )}
      </button>
    );
  };
  
  // ============================================================================
  // RENDER
  // ============================================================================
  
  return (
    <div className="border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 transition-colors">
      <nav 
        role="tablist" 
        aria-label="Chat navigation"
        className="flex overflow-x-auto scrollbar-hide"
      >
        {tabs.map(renderTab)}
      </nav>
      
      {/* Loading bar */}
      {loading && (
        <div className="h-0.5 w-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <div className="h-full bg-indigo-500 dark:bg-teal-500 animate-progress" />
        </div>
      )}
    </div>
  );
};

// ============================================================================
// STYLES
// ============================================================================

// Add these to your global CSS or Tailwind config
const styles = `
@keyframes slide-in {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

@keyframes progress {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-slide-in {
  animation: slide-in 0.2s ease-out;
  transform-origin: left;
}

.animate-progress {
  animation: progress 1s ease-in-out infinite;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
`;

// ============================================================================
// EXPORT
// ============================================================================

export default React.memo(ChatHeader);
