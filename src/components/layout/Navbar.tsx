import React, { useState, useContext, memo, useRef, useEffect, useCallback } from 'react';
import {
  Bell, Settings, LogOut, User, Menu, ChevronLeft, ChevronRight,
  Check, Clock, X, AlertCircle, MessageSquare, FileText, Mail, BarChart3, BookOpen,
  Sun, Moon, Trash2, CheckCheck, Globe
} from 'lucide-react';
import CreditConsumptionBar from './CreditConsumptionBar';
import { Page } from '../../App';
import LanguageSwitcher from "../LanguageSwitcher";
import { LanguageContext } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
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

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
  link?: string;
  avatar?: string;
}

// Memoized Profile Dropdown Component
const ProfileDropdown = memo(({
  isOpen,
  onClose,
  onNavigate,
  t,
  onOpenWorkspaceModal
}: {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: Page) => void;
  t: any;
  onOpenWorkspaceModal: () => void;
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={dropdownRef}
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.15 }}
        className="absolute right-0 mt-3 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
      >
        {/* User info section with gradient */}
        <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/50">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold truncate">Minh Nguyen</p>
              <p className="text-indigo-100 text-sm">Admin</p>
            </div>
          </div>
          
          {/* Decorative gradient orbs */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-purple-400/20 rounded-full blur-xl" />
        </div>

        {/* Mobile credits display */}
        <div className="md:hidden px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
          <CreditConsumptionBar 
            directCredits={{ used: 1250, total: 4000 }}
            backgroundCredits={{ used: 350, total: 1000 }}
            className="w-full"
          />
        </div>

        {/* Navigation items */}
        <div className="py-2">
          <MenuItem
            icon={BarChart3}
            label="Usage"
            onClick={() => {
              onNavigate('usage');
              onClose();
            }}
          />
          <MenuItem
            icon={Settings}
            label={t('navbar.settings')}
            onClick={() => {
              onNavigate('paramètres');
              onClose();
            }}
          />
          <MenuItem
            icon={BookOpen}
            label="Onboarding"
            onClick={() => {
              onNavigate('onboarding');
              onClose();
            }}
          />
        </div>

        {/* Workspaces section */}
        <div className="border-t border-gray-200 dark:border-gray-700">
          <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900/50">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Your Workspace
            </p>
          </div>
          <button
            className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
            onClick={() => {
              onOpenWorkspaceModal();
              onClose();
            }}
          >
            <span className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-teal-500 flex-shrink-0 shadow-sm" />
              <span className="font-medium">Miranki</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </button>
        </div>

        {/* Sign out button */}
        <div className="border-t border-gray-200 dark:border-gray-700 py-2">
          <button
            onClick={onClose}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
          >
            <LogOut className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-medium">{t('navbar.disconnect')}</span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
});

// Menu Item Component
const MenuItem = ({ icon: Icon, label, onClick, badge }: {
  icon: any;
  label: string;
  onClick: () => void;
  badge?: number;
}) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
  >
    <span className="flex items-center gap-3">
      <Icon className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors" />
      <span className="font-medium">{label}</span>
    </span>
    {badge !== undefined && badge > 0 && (
      <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-full">
        {badge}
      </span>
    )}
  </button>
);

// Notification Panel Component
const NotificationPanel = memo(({ 
  notifications, 
  onClose, 
  onMarkAsRead, 
  onMarkAllAsRead,
  onClearAll 
}: {
  notifications: Notification[];
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
    >
      {/* Header with gradient */}
      <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-white" />
            <h3 className="font-semibold text-white">Notifications</h3>
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close notifications"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>
        
        {/* Action buttons */}
        {notifications.length > 0 && (
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={onMarkAllAsRead}
              className="flex items-center gap-1 px-2 py-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs font-medium rounded-md transition-colors"
            >
              <CheckCheck className="w-3 h-3" />
              Mark all read
            </button>
            <button
              onClick={onClearAll}
              className="flex items-center gap-1 px-2 py-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs font-medium rounded-md transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              Clear all
            </button>
          </div>
        )}
        
        {/* Decorative gradient orbs */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
      </div>
      
      {/* Notification List */}
      <div className="max-h-[420px] overflow-y-auto overscroll-contain">
        {notifications.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
              <Bell className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">No notifications</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">You're all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {notifications.map((notification, index) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={() => onMarkAsRead(notification.id)}
                index={index}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-center">
          <button className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
            View all notifications
          </button>
        </div>
      )}
    </motion.div>
  );
});

// Individual Notification Item
const NotificationItem = memo(({ notification, onMarkAsRead, index }: {
  notification: Notification;
  onMarkAsRead: () => void;
  index: number;
}) => {
  const getIcon = () => {
    const iconClass = "h-5 w-5";
    const iconMap = {
      success: <Check className={`${iconClass} text-green-500 dark:text-green-400`} />,
      warning: <AlertCircle className={`${iconClass} text-amber-500 dark:text-amber-400`} />,
      error: <AlertCircle className={`${iconClass} text-red-500 dark:text-red-400`} />,
      info: <Bell className={`${iconClass} text-blue-500 dark:text-blue-400`} />
    };
    return iconMap[notification.type] || iconMap.info;
  };

  const getIconBg = () => {
    const bgMap = {
      success: 'bg-green-100 dark:bg-green-900/30',
      warning: 'bg-amber-100 dark:bg-amber-900/30',
      error: 'bg-red-100 dark:bg-red-900/30',
      info: 'bg-blue-100 dark:bg-blue-900/30'
    };
    return bgMap[notification.type] || bgMap.info;
  };
  
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
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all cursor-pointer group ${
        !notification.read ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''
      }`}
      onClick={onMarkAsRead}
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${getIconBg()} flex items-center justify-center`}>
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <p className={`text-sm font-medium leading-snug ${
              !notification.read 
                ? 'text-gray-900 dark:text-gray-100' 
                : 'text-gray-600 dark:text-gray-400'
            }`}>
              {notification.title}
            </p>
            {!notification.read && (
              <span className="h-2 w-2 bg-indigo-500 dark:bg-indigo-400 rounded-full flex-shrink-0 mt-1.5 animate-pulse" />
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
            {notification.message}
          </p>
          <div className="flex items-center gap-1 mt-2 text-xs text-gray-400 dark:text-gray-500">
            <Clock className="h-3 w-3" />
            <span>{formatTime(notification.timestamp)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

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
  const { theme, toggleTheme } = useTheme();
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationPanelRef = useRef<HTMLDivElement>(null);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);
  
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New message received',
      message: 'You have received a new message from Sophie Martin regarding her account issue.',
      timestamp: new Date(Date.now() - 15 * 60000),
      read: false,
      type: 'info',
      link: '/conversations'
    },
    {
      id: '2',
      title: 'Task completed',
      message: 'The document processing task has been completed successfully.',
      timestamp: new Date(Date.now() - 2 * 3600000),
      read: false,
      type: 'success',
      link: '/documents'
    },
    {
      id: '3',
      title: 'System update',
      message: 'The system will undergo maintenance tonight at 2 AM UTC. Please save your work.',
      timestamp: new Date(Date.now() - 5 * 3600000),
      read: true,
      type: 'warning'
    },
    {
      id: '4',
      title: 'Payment failed',
      message: 'Your monthly subscription payment has failed. Please update your payment method.',
      timestamp: new Date(Date.now() - 24 * 3600000),
      read: true,
      type: 'error',
      link: '/settings'
    },
    {
      id: '5',
      title: 'New template available',
      message: 'A new email template "Customer Feedback" has been added to your collection.',
      timestamp: new Date(Date.now() - 2 * 24 * 3600000),
      read: true,
      type: 'info',
      link: '/templates'
    }
  ]);

  const handleProfileToggle = useCallback(() => {
    setIsProfileOpen(prev => !prev);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
  }, [isNotificationsOpen]);

  const closeProfile = useCallback(() => {
    setIsProfileOpen(false);
  }, []);
  
  const handleOpenWorkspaceModal = useCallback(() => {
    setIsWorkspaceModalOpen(true);
    setIsProfileOpen(false);
  }, []);
  
  const toggleNotifications = useCallback(() => {
    setIsNotificationsOpen(prev => !prev);
    if (isProfileOpen) setIsProfileOpen(false);
  }, [isProfileOpen]);
  
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
  }, []);
  
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);
  
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
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
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed w-full z-40 top-0 transition-colors shadow-sm">
      <div className="px-4 py-3 lg:px-6">
        <div className="flex justify-between items-center">
          {/* Left section */}
          <div className="flex items-center gap-3 lg:gap-4">
            {/* Mobile menu button */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            </button>

            {/* Sidebar toggle - desktop only */}
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="hidden lg:flex p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group"
                aria-label={isSidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
              >
                {isSidebarExpanded ? (
                  <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:-translate-x-0.5 transition-transform" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:translate-x-0.5 transition-transform" />
                )}
              </button>
            )}

            {/* Logo */}
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-gradient-to-br from-teal-400 to-teal-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <span className="text-white font-bold text-lg lg:text-xl">S</span>
              </div>
              <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-teal-500 to-teal-600 dark:from-teal-400 dark:to-teal-500 bg-clip-text text-transparent">
                Sendplex
              </span>
            </button>

            {/* Credits - desktop only */}
            <div className="hidden md:block">
              <CreditConsumptionBar 
                directCredits={{ used: 1250, total: 4000 }}
                backgroundCredits={{ used: 350, total: 1000 }}
              />
            </div>
          </div>
          
          {/* Right section */}
          <div className="flex items-center gap-2 lg:gap-3">
            {/* Notifications */}
            <div className="relative" ref={notificationPanelRef}>
              <button
                ref={notificationButtonRef}
                onClick={toggleNotifications}
                className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group"
                aria-label="Notifications"
              >
                <Bell className={`h-5 w-5 lg:h-6 lg:w-6 transition-colors ${
                  unreadCount > 0 
                    ? 'text-indigo-600 dark:text-indigo-400' 
                    : 'text-gray-600 dark:text-gray-300'
                }`} />
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 text-[10px] font-bold text-white shadow-lg ring-2 ring-white dark:ring-gray-800"
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </motion.span>
                )}
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <NotificationPanel
                    notifications={notifications}
                    onClose={() => setIsNotificationsOpen(false)}
                    onMarkAsRead={markAsRead}
                    onMarkAllAsRead={markAllAsRead}
                    onClearAll={clearAllNotifications}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group"
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              <AnimatePresence mode="wait">
                {theme === 'light' ? (
                  <motion.div
                    key="moon"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="h-5 w-5 lg:h-6 lg:w-6 text-gray-600 group-hover:text-indigo-600 transition-colors" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="sun"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="h-5 w-5 lg:h-6 lg:w-6 text-gray-300 group-hover:text-yellow-400 transition-colors" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Language Switcher - desktop only */}
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
            
            {/* Mobile language switcher */}
            <button
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Change language"
            >
              <Globe className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
            
            {/* Profile */}
            <div className="relative">
              <button
                onClick={handleProfileToggle}
                className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 flex items-center justify-center hover:shadow-lg transition-shadow ring-2 ring-white dark:ring-gray-800"
                aria-label="Profile menu"
                aria-expanded={isProfileOpen}
              >
                <User className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
              </button>

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
      </div>
      
      {/* Workspace Modal */}
      <AnimatePresence>
        {isWorkspaceModalOpen && (
          <WorkspaceModal 
            isOpen={isWorkspaceModalOpen} 
            onClose={() => setIsWorkspaceModalOpen(false)} 
          />
        )}
      </AnimatePresence>
    </nav>
  );
};

export default memo(Navbar);
