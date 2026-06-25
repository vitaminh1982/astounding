import React, { useState, useContext, memo, useRef, useEffect, useCallback } from 'react';
import {
  Settings, LogOut, User, Menu, ChevronRight, BarChart3, BookOpen,
  Sun, Moon, Globe
} from 'lucide-react';
import CreditConsumptionBar from './CreditConsumptionBar';
import { Page } from '../../App';
import LanguageSwitcher from "../LanguageSwitcher";
import { LanguageContext } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import WorkspaceModal from '../workspace/WorkspaceModal';
import { useWorkspace } from '../../context/WorkspaceContext';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onNavigate: (page: Page) => void;
  onMenuClick: () => void;
  currentPage?: Page;
  navigationItems?: { id: Page; label: string; icon: string }[];
  isSidebarExpanded?: boolean;
  onToggleSidebar?: () => void;
}



// Memoized Profile Dropdown Component
const ProfileDropdown = memo(({
  isOpen,
  onClose,
  onNavigate,
  t,
  onOpenWorkspaceModal,
  resolvedTheme,
  toggleTheme,
  language,
  toggleLanguage,
}: {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: Page) => void;
  t: any;
  onOpenWorkspaceModal: () => void;
  resolvedTheme: string;
  toggleTheme: () => void;
  language: string;
  toggleLanguage: () => void;
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { activeWorkspace } = useWorkspace();

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
        className="absolute right-0 mt-3 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl dark:shadow-gray-900 border border-gray-200 dark:border-gray-700 overflow-hidden z-50 transition-colors"
      >
        {/* User info section with gradient */}
        <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-teal-500 dark:to-teal-600 px-4 py-4 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/50 transition-colors">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold truncate transition-colors">Minh Nguyen</p>
              <p className="text-indigo-100 dark:text-teal-100 text-sm transition-colors">Admin</p>
            </div>
          </div>
          
          {/* Decorative gradient orbs */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-purple-400/20 dark:bg-teal-400/20 rounded-full blur-xl transition-colors" />
        </div>

        {/* Mobile credits display */}
        <div className="md:hidden px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 transition-colors">
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

        {/* Préférences : thème + langue */}
        <div className="border-t border-gray-200 dark:border-gray-700 py-2 transition-colors">
          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group focus:outline-none"
            aria-label={resolvedTheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            <span className="flex items-center gap-3">
              {resolvedTheme === 'light' ? (
                <Moon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              ) : (
                <Sun className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              )}
              <span className="font-medium">
                {resolvedTheme === 'light' ? 'Dark mode' : 'Light mode'}
              </span>
            </span>
          </button>

          {/* Language toggle */}
          <button
            onClick={toggleLanguage}
            className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group focus:outline-none"
            aria-label={language === 'en' ? 'Switch to French' : 'Passer en anglais'}
          >
            <span className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              <span className="font-medium">
                {language === 'fr' ? 'Français' : 'English'}
              </span>
            </span>
            <span className="text-lg">
              {language === 'fr' ? '🇫🇷' : '🇬🇧'}
            </span>
          </button>
        </div>

        {/* Workspaces section */}
        <div className="border-t border-gray-200 dark:border-gray-700 transition-colors">
          <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900/50 transition-colors">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors">
              Your Workspace
            </p>
          </div>
          <button
            className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            onClick={() => {
              onOpenWorkspaceModal();
              onClose();
            }}
            aria-label="Open workspace settings"
          >
            <span className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-teal-500 flex-shrink-0 shadow-sm transition-colors flex items-center justify-center text-white text-xs font-semibold">
                {activeWorkspace.name.charAt(0)}
              </span>
              <span className="font-medium transition-colors">{activeWorkspace.name}</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse transition-colors" />
              <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:translate-x-0.5 transition-all" />
            </span>
          </button>
        </div>

        {/* Sign out button */}
        <div className="border-t border-gray-200 dark:border-gray-700 py-2 transition-colors">
          <button
            onClick={onClose}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            aria-label="Sign out"
          >
            <LogOut className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-medium transition-colors">{t('navbar.disconnect')}</span>
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
    className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
  >
    <span className="flex items-center gap-3">
      <Icon className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-indigo-500 dark:group-hover:text-teal-400 transition-colors" />
      <span className="font-medium transition-colors">{label}</span>
    </span>
    {badge !== undefined && badge > 0 && (
      <span className="px-2 py-0.5 bg-indigo-100 dark:bg-teal-900/30 border border-indigo-200 dark:border-teal-800 text-indigo-600 dark:text-teal-400 text-xs font-semibold rounded-full transition-colors">
        {badge}
      </span>
    )}
  </button>
);



const Navbar = ({
  onNavigate,
  onMenuClick,
  currentPage,
  navigationItems,
  isSidebarExpanded = true,
  onToggleSidebar
}: NavbarProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { t, language, toggleLanguage } = useContext(LanguageContext);
  const { theme, resolvedTheme, toggleTheme } = useTheme();
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const handleProfileToggle = useCallback(() => {
    setIsProfileOpen(prev => !prev);
  }, []);

  const closeProfile = useCallback(() => {
    setIsProfileOpen(false);
  }, []);
  
  const handleOpenWorkspaceModal = useCallback(() => {
    setIsWorkspaceModalOpen(true);
    setIsProfileOpen(false);
  }, []);

  return (
    <nav className="bg-transparent sticky top-0 w-full z-20 transition-colors">
      <div className="px-4 py-2 lg:px-6">
        <div className="flex justify-between items-center">
          {/* Left section — mobile menu only */}
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5 text-gray-500 dark:text-gray-400 transition-colors" />
            </button>
          </div>
          
          {/* Right section */}
          <div className="flex items-center gap-2">
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
