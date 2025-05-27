import React, { useState, useContext, memo } from 'react';
import { Bell, Settings, LogOut, User, Menu, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { Page } from '../../App';
import LanguageSwitcher from "../LanguageSwitcher";
import { LanguageContext } from '../../context/LanguageContext';
import WorkspaceSelector from '../workspace/WorkspaceSelector';

interface NavbarProps {
  onNavigate: (page: Page) => void;
  onMenuClick: () => void;
  currentPage?: Page;
  navigationItems?: { id: Page; label: string; icon: string }[];
  isSidebarExpanded?: boolean;
  onToggleSidebar?: () => void;
}

// Memoized dropdown menu to prevent unnecessary re-renders
const ProfileDropdown = memo(({ 
  isOpen, 
  onClose, 
  onNavigate, 
  t 
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
        <p className="text-gray-800 font-medium">Owner</p>
      </div>

      {/* Mobile credits display */}
      <div className="md:hidden px-4 py-2 border-b border-gray-100 flex items-center justify-between">
        <span className="text-gray-700 text-sm">1250 / 4000 {t('navbar.credits')}</span>
        <button className="text-gray-500">
          <Info className="h-4 w-4" />
        </button>
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
            <span className="text-gray-400">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9H7V21H3V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 3H14V21H10V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 12H21V21H17V12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
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
      </div>

      {/* Workspaces section */}
      <div className="pt-2 pb-1 border-b border-gray-100">
        <p className="px-4 py-1 text-xs font-medium text-gray-500 uppercase">Your workspace</p>
        <button 
          className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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

  const handleProfileToggle = () => {
    setIsProfileOpen(prev => !prev);
  };

  const closeProfile = () => {
    setIsProfileOpen(false);
  };
  
  const handleWorkspaceChange = (workspaceId: string) => {
    console.log(`Switching to workspace: ${workspaceId}`);
    // In a real app, this would update the current workspace
  };

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-30 top-0">
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

          {/* Workspace Selector */}
          <WorkspaceSelector 
            currentWorkspace={currentWorkspace}
            workspaces={workspaces}
            onWorkspaceChange={handleWorkspaceChange}
          />

          {/* Credits display */}
          <div className="hidden md:flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
            <span className="text-gray-700 text-sm whitespace-nowrap">1250 / 4000 {t('navbar.credits')}</span>
            <button 
              className="text-gray-500 hover:text-gray-700"
              aria-label="Credit information"
            >
              <Info className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Right section */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Notifications */}
          <button 
            className="relative p-2 hover:bg-gray-100 rounded-full"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 lg:h-6 lg:w-6 text-gray-600" />
            <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
          </button>
          
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
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default memo(Navbar);