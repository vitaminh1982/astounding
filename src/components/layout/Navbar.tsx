import React, { useState, useContext, memo, useRef, useEffect } from 'react';
import { 
  Bell, Settings, LogOut, User, Menu, ChevronLeft, ChevronRight, Info, 
  Check, Clock, X, AlertCircle, MessageSquare, FileText, Mail, BarChart3, BookOpen
} from 'lucide-react';
import CreditConsumptionBar from './CreditConsumptionBar';
import { Page } from '../../App';
import LanguageSwitcher from "../LanguageSwitcher";
import { LanguageContext } from '../../context/LanguageContext';
import WorkspaceSelector from '../workspace/WorkspaceSelector';
import WorkspaceModal from '../workspace/WorkspaceModal';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onNavigate: (page: Page) => void;
  onMenuClick: () => void;
  currentPage?: Page;
  navigationItems?: { id: Page; label: string; icon: string }[];
  isSidebarExpanded?: boolean;
  onToggleSidebar?: () => void;
}

// Notification type definition
interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
  link?: string;
}

// Memoized dropdown menu to prevent unnecessary re-renders
const ProfileDropdown = memo(({ 
  isOpen, 
  onClose, 
  onNavigate, 
  t,
  onOpenWorkspaceModal
}) => {
  if (!isOpen) return null;
  
  return (
    <div 
      className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-50"
      onMouseLeave={onClose}
    >
      {/* User info section */}
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-gray-500 text-sm">Minh Nguyen</p>
        <p className="text-gray-800 font-medium">Admin</p>
      </div>

      {/* Mobile credits display */}
      <div className="md:hidden px-4 py-2 border-b border-gray-100 flex items-center justify-between">
        <CreditConsumptionBar 
          directCredits={{ used: 1250, total: 4000 }}
          backgroundCredits={{ used: 350, total: 1000 }}
          className="w-full"
        />
      </div>

      {/* Navigation items */}
      <div className="py-2 border-b border-gray-100">
        <button 
          onClick={() => {
            onNavigate('usage');
            onClose();
          }}
          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <span className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-gray-400" />
            Usage
          </span>
        </button>
        <button 
          onClick={() => {
            onNavigate('paramètres');
            onClose();
          }}
          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <span className="flex items-center gap-3">
            <Settings className="h-5 w-5 text-gray-400" />
            {t('navbar.settings')}
          </span>
        </button>
        <button 
          onClick={() => {
            onNavigate('onboarding');
            onClose();
          }}
          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <span className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-gray-400" />
            Onboarding
          </span>
        </button>
      </div>



      {/* Workspaces section */}
      <div className="pt-2 pb-1 border-b border-gray-100">
        <p className="px-4 py-1 text-xs font-medium text-gray-500 uppercase">Your workspace</p>
        <button 
          className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          onClick={onOpenWorkspaceModal}
        >
          <span className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-md bg-teal-400 flex-shrink-0"></span>
            <span className="font-medium truncate">Miranki</span>
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></span>
        </button>
      </div>

      {/* Sign out button */}
      <div className="py-2">
        <button 
          onClick={onClose}
          className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
        >
          <span className="flex items-center gap-3">
            <LogOut className="h-5 w-5" />
            {t('navbar.disconnect')}
          </span>
        </button>
      </div>
    </div>
  );
});

// Notification Panel Component
const NotificationPanel = ({ notifications, onClose, onMarkAsRead, onClearAll }) => {
  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <h3 className="font-medium text-gray-700">Notifications</h3>
        <div className="flex items-center gap-2">
          <button 
            onClick={onClearAll}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Clear all
          </button>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Notification List */}
      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="py-8 text-center">
            <Bell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <NotificationItem 
                key={notification.id} 
                notification={notification} 
                onMarkAsRead={() => onMarkAsRead(notification.id)}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 text-center">
        <button className="text-sm text-indigo-600 hover:text-indigo-800">
          View all notifications
        </button>
      </div>
    </div>
  );
};

// Individual Notification Item
const NotificationItem = ({ notification, onMarkAsRead }) => {
  // Get icon based on notification type
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'info':
      default:
        if (notification.message.includes('message')) {
          return <MessageSquare className="h-5 w-5 text-blue-500" />;
        } else if (notification.message.includes('document')) {
          return <FileText className="h-5 w-5 text-blue-500" />;
        } else if (notification.message.includes('email')) {
          return <Mail className="h-5 w-5 text-blue-500" />;
        } else {
          return <Bell className="h-5 w-5 text-blue-500" />;
        }
    }
  };
  
  // Format timestamp
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };
  
  return (
    <div 
      className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
      onClick={onMarkAsRead}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
              {notification.title}
            </p>
            <span className="text-xs text-gray-500 whitespace-nowrap ml-2 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {formatTime(notification.timestamp)}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {notification.message}
          </p>
        </div>
        {!notification.read && (
          <span className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0 ml-2 mt-1"></span>
        )}
      </div>
    </div>
  );
};

const Navbar = ({ 
  onNavigate, 
  onMenuClick, 
  currentPage,
  navigationItems,
  isSidebarExpanded = true,
  onToggleSidebar
}: NavbarProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { t } = useContext(LanguageContext);
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationPanelRef = useRef<HTMLDivElement>(null);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);
  
  // Sample workspaces data
  const currentWorkspace = {
    id: '1',
    name: 'Miranki',
    color: '#10B981'
  };
  
  const workspaces = [
    {
      id: '1',
      name: 'Miranki',
      color: '#10B981'
    },
    {
      id: '2',
      name: 'Personal',
      color: '#6366F1'
    },
    {
      id: '3',
      name: 'Client Project',
      color: '#F59E0B'
    }
  ];
  
  // Sample notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New message received',
      message: 'You have received a new message from Sophie Martin regarding her account issue.',
      timestamp: new Date(Date.now() - 15 * 60000), // 15 minutes ago
      read: false,
      type: 'info',
      link: '/conversations'
    },
    {
      id: '2',
      title: 'Task completed',
      message: 'The document processing task has been completed successfully.',
      timestamp: new Date(Date.now() - 2 * 3600000), // 2 hours ago
      read: false,
      type: 'success',
      link: '/documents'
    },
    {
      id: '3',
      title: 'System update',
      message: 'The system will undergo maintenance tonight at 2 AM UTC. Please save your work.',
      timestamp: new Date(Date.now() - 5 * 3600000), // 5 hours ago
      read: true,
      type: 'warning'
    },
    {
      id: '4',
      title: 'Payment failed',
      message: 'Your monthly subscription payment has failed. Please update your payment method.',
      timestamp: new Date(Date.now() - 24 * 3600000), // 1 day ago
      read: true,
      type: 'error',
      link: '/settings'
    },
    {
      id: '5',
      title: 'New template available',
      message: 'A new email template "Customer Feedback" has been added to your collection.',
      timestamp: new Date(Date.now() - 2 * 24 * 3600000), // 2 days ago
      read: true,
      type: 'info',
      link: '/templates'
    }
  ]);

  const handleProfileToggle = () => {
    setIsProfileOpen(prev => !prev);
    // Close notifications panel if open
    if (isNotificationsOpen) setIsNotificationsOpen(false);
  };

  const closeProfile = () => {
    setIsProfileOpen(false);
  };
  
  const handleWorkspaceChange = (workspaceId: string) => {
    console.log(`Switching to workspace: ${workspaceId}`);
    // In a real app, this would update the current workspace
  };
  
  const handleOpenWorkspaceModal = () => {
    setIsWorkspaceModalOpen(true);
    setIsProfileOpen(false);
  };
  
  // Toggle notifications panel
  const toggleNotifications = () => {
    setIsNotificationsOpen(prev => !prev);
    // Close profile dropdown if open
    if (isProfileOpen) setIsProfileOpen(false);
  };
  
  // Mark a notification as read
  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };
  
  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };
  
  // Get unread notifications count
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  // Handle click outside to close notifications panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isNotificationsOpen && 
        notificationPanelRef.current && 
        notificationButtonRef.current && 
        !notificationPanelRef.current.contains(event.target as Node) &&
        !notificationButtonRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationsOpen]);

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-40 top-0">
      <div className="px-4 py-3 lg:px-6 flex justify-between items-center">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>

          {/* Sidebar toggle button - only visible on desktop */}
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="hidden lg:flex p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label={isSidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
            >
              {isSidebarExpanded ? (
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-600" />
              )}
            </button>
          )}

          <button 
            onClick={() => onNavigate('dashboard')}
            className="text-xl lg:text-2xl font-bold text-[#10B981] cursor-pointer hover:opacity-80 transition-opacity"
          >
            Sendplex
          </button>

          {/* Credits display */}
          <CreditConsumptionBar 
            directCredits={{ used: 1250, total: 4000 }}
            backgroundCredits={{ used: 350, total: 1000 }}
            className="hidden md:flex"
          />
        </div>
        
        {/* Right section */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Notifications */}
          <div className="relative">
            <button 
              ref={notificationButtonRef}
              onClick={toggleNotifications}
              className="relative p-2 hover:bg-gray-100 rounded-full"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5 lg:h-6 lg:w-6 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            
            {/* Notification Panel */}
            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div
                  ref={notificationPanelRef}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <NotificationPanel 
                    notifications={notifications}
                    onClose={() => setIsNotificationsOpen(false)}
                    onMarkAsRead={markAsRead}
                    onClearAll={clearAllNotifications}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Language Switcher */}
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>
          
          {/* Profile section */}
          <div className="relative">
            <button 
              onClick={handleProfileToggle}
              className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
              aria-label="Profile menu"
              aria-expanded={isProfileOpen}
            >
              <User className="h-5 w-5 lg:h-6 lg:w-6 text-gray-600" />
            </button>

            {/* Dropdown menu as separate component */}
            <ProfileDropdown 
              isOpen={isProfileOpen}
              onClose={closeProfile}
              onNavigate={onNavigate}
              t={t}
              onOpenWorkspaceModal={handleOpenWorkspaceModal}
            />
          </div>
        </div>
      </div>
      
      {/* Workspace Modal */}
      {isWorkspaceModalOpen && (
        <WorkspaceModal 
          isOpen={isWorkspaceModalOpen} 
          onClose={() => setIsWorkspaceModalOpen(false)} 
        />
      )}
    </nav>
  );
};

export default memo(Navbar);