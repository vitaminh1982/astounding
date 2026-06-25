import React, { useState, useContext, memo, useEffect, useRef, useCallback } from 'react';
import ProjectSwitcher from '../workspace/ProjectSwitcher';
import {
  LayoutDashboard,
  Bot,
  ShieldAlert,
  FileText,
  ClipboardCheck,
  AlertTriangle,
  BarChart2,
  Settings2,
  MessageSquare,
  Users,
  Mail,
  PlayCircle,
  X,
  FolderOpen,
  GitBranch,
  Sparkles,
  Wrench,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  Network,
  Server,
  Share2,
  Briefcase,
  PanelLeft,
  Cpu,
  Shield,
  Settings,
  LogOut,
  Sun,
  Moon,
  Globe,
  HelpCircle,
  Check,
  Laptop,
  Building2,
  UserPlus,
  Plus,
  MoreHorizontal,
  ArrowUpCircle,
  Clock,
  Trash2,
  CheckCheck,
  AlertCircle,
  Inbox,
} from 'lucide-react';
import { Page } from '../../App';
import { LanguageContext } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useWorkspace } from '../../context/WorkspaceContext';
import { motion } from 'framer-motion';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isOpen?: boolean;
  onClose?: () => void;
  navigationItems?: { id: Page; label: string; icon: string }[];
  isExpanded?: boolean;
  onToggleExpand?: () => void;
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

// ─── MenuItem ─────────────────────────────────────────────────────────────────

const MenuItem = memo(({
  icon: Icon,
  label,
  page,
  currentPage,
  onClick,
  isExpanded,
  hasNotification,
}: {
  icon: React.ElementType;
  label: string;
  page: Page;
  currentPage: Page;
  onClick: (page: Page) => void;
  isExpanded: boolean;
  hasNotification?: boolean;
}) => {
  const isActive = page && currentPage === page;
  return (
    <button
      onClick={() => onClick(page)}
      className={[
        'flex w-full items-center gap-3 px-3 py-2',
        'text-sm rounded-lg transition-all duration-150',
        isActive
          ? 'bg-white dark:bg-white/15 text-black dark:text-white font-semibold'
          : 'text-[#444444] dark:text-[#bbbbbb] hover:bg-white/40 hover:text-black dark:hover:bg-white/10 dark:hover:text-white',
        !isExpanded && 'lg:justify-center',
      ].join(' ')}
    >
      <div className="relative flex-shrink-0">
        <Icon size={18} strokeWidth={1.75} />
        {hasNotification && (
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[#888888]" />
        )}
      </div>
      <span className={`truncate ${isExpanded ? '' : 'lg:hidden'}`}>{label}</span>
    </button>
  );
});

// ─── SubMenuItem ──────────────────────────────────────────────────────────────

const SubMenuItem = memo(({
  icon: Icon,
  label,
  page,
  currentPage,
  onClick,
  isExpanded,
}: {
  icon: React.ElementType;
  label: string;
  page: Page;
  currentPage: Page;
  onClick: (page: Page) => void;
  isExpanded: boolean;
}) => {
  const isActive = page && currentPage === page;
  return (
    <button
      onClick={() => onClick(page)}
      className={[
        'flex w-full items-center gap-3 px-3 py-1.5',
        'text-sm rounded-lg transition-all duration-150',
        isActive
          ? 'bg-white dark:bg-white/15 text-black dark:text-white font-semibold'
          : 'text-[#666666] dark:text-[#999999] hover:bg-white/40 hover:text-black dark:hover:bg-white/10 dark:hover:text-white',
        !isExpanded && 'lg:justify-center',
      ].join(' ')}
    >
      <Icon size={16} strokeWidth={1.75} className="flex-shrink-0" />
      <span className={`truncate ${isExpanded ? '' : 'lg:hidden'}`}>{label}</span>
    </button>
  );
});

// ─── CollapsibleSection ───────────────────────────────────────────────────────

const CollapsibleSection = memo(({
  icon: Icon,
  label,
  isOpen,
  isActive,
  isExpanded,
  onToggle,
  children,
}: {
  icon: React.ElementType;
  label: string;
  isOpen: boolean;
  isActive: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) => (
  <div className="space-y-0.5">
    <button
      onClick={onToggle}
      aria-expanded={isOpen}
      className={[
        'flex w-full items-center px-3 py-2',
        'text-sm rounded-lg transition-all duration-150',
        isActive
          ? 'bg-white dark:bg-white/15 text-black dark:text-white font-semibold'
          : 'text-[#444444] dark:text-[#bbbbbb] hover:bg-white/40 hover:text-black dark:hover:bg-white/10 dark:hover:text-white',
        isExpanded ? 'justify-between' : 'lg:justify-center justify-between',
      ].join(' ')}
    >
      <div className="flex items-center gap-3">
        <Icon size={18} strokeWidth={1.75} />
        <span className={isExpanded ? '' : 'lg:hidden'}>{label}</span>
      </div>
      <span className={`text-[#aaaaaa] ${isExpanded ? '' : 'lg:hidden'}`}>
        {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </span>
    </button>

    {isOpen && (
      <div className={`space-y-0.5 ${isExpanded ? 'pl-4' : 'lg:pl-0 pl-4'}`}>
        {children}
      </div>
    )}
  </div>
));

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const Sidebar = ({
  currentPage,
  onNavigate,
  isOpen,
  onClose,
  isExpanded = true,
  onToggleExpand,
}: SidebarProps) => {
  const { t } = useContext(LanguageContext);
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { accounts, activeAccount, activeWorkspace, switchWorkspace, createWorkspace, addAccount } = useWorkspace();

  const getPlanPillText = (plan: string) => {
    const p = plan.toLowerCase();
    if (p.includes('free')) return null;
    if (p.includes('pro')) return 'Pro';
    if (p.includes('starter')) return 'Starter';
    if (p.includes('enterprise')) return 'Enterprise';
    return plan;
  };

  const [workspaceMode, setWorkspaceMode] = useState<'work' | 'studio' | 'govern'>('work');
  const [isAgentsMenuOpen, setIsAgentsMenuOpen] = useState(false);
  const [isGovernanceMenuOpen, setIsGovernanceMenuOpen] = useState(false);
  const [isOrchestrationMenuOpen, setIsOrchestrationMenuOpen] = useState(false);

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [popoverView, setPopoverView] = useState<'main' | 'appearance' | 'help' | 'accounts' | 'notifications'>('main');
  const [addingWorkspaceToAccount, setAddingWorkspaceToAccount] = useState<string | null>(null);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [newAccountEmail, setNewAccountEmail] = useState('');
  const popoverRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);

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
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  const aiAgentsSubmenu = [
    { icon: Sparkles, label: t('sidebar.prompts'), page: 'prompts' as const },
    { icon: FileText, label: t('sidebar.templates'), page: 'templates' as const },
    { icon: FolderOpen, label: t('sidebar.knowledgeBase'), page: 'documents' as const },
    { icon: Wrench, label: t('sidebar.integrations'), page: 'integrations' as const },
    { icon: GitBranch, label: t('sidebar.workflows'), page: 'workflows' as const },
  ];

  const governanceSubmenu = [
    { icon: FileText, label: t('sidebar.policyManagement'), page: 'policy-management' as const },
    { icon: ClipboardCheck, label: t('sidebar.auditCompliance'), page: 'audit-compliance' as const },
    { icon: AlertTriangle, label: t('sidebar.riskManagement'), page: 'risk-management' as const },
    { icon: BarChart2, label: t('sidebar.performanceAnalytics'), page: 'performance-analytics' as const },
    { icon: Settings2, label: t('sidebar.agentConfiguration'), page: 'agent-configuration' as const },
  ];

  const orchestrationSubmenu = [
    { icon: Bot, label: t('sidebar.agentManagement'), page: 'agent-management' as const },
    { icon: GitBranch, label: t('sidebar.workflowManagement'), page: 'workflow-management' as const },
    { icon: BarChart2, label: t('sidebar.monitoringAnalytics'), page: 'monitoring-analytics' as const },
    { icon: Server, label: t('sidebar.resourceManagement'), page: 'resource-management' as const },
    { icon: Share2, label: t('sidebar.collaboration'), page: 'collaboration' as const },
  ];

  const isAnyAgentsActive = () =>
    aiAgentsSubmenu.some(i => i.page === currentPage) || currentPage === 'agents';
  const isAnyGovernanceActive = () =>
    governanceSubmenu.some(i => i.page === currentPage) || currentPage === 'governance';
  const isAnyOrchestrationActive = () =>
    orchestrationSubmenu.some(i => i.page === currentPage) || currentPage === 'orchestration';

  useEffect(() => {
    if (
      isAnyAgentsActive() ||
      currentPage === 'agents' ||
      currentPage === 'templates' ||
      currentPage === 'prompts' ||
      currentPage === 'documents' ||
      currentPage === 'integrations' ||
      currentPage === 'workflows'
    ) {
      setWorkspaceMode('studio');
      setIsAgentsMenuOpen(true);
    } else if (
      isAnyGovernanceActive() ||
      isAnyOrchestrationActive() ||
      currentPage === 'governance' ||
      currentPage === 'orchestration' ||
      currentPage === 'policy-management' ||
      currentPage === 'audit-compliance' ||
      currentPage === 'risk-management' ||
      currentPage === 'performance-analytics' ||
      currentPage === 'agent-configuration' ||
      currentPage === 'agent-management' ||
      currentPage === 'workflow-management' ||
      currentPage === 'monitoring-analytics' ||
      currentPage === 'resource-management' ||
      currentPage === 'collaboration'
    ) {
      setWorkspaceMode('govern');
      if (isAnyGovernanceActive()) setIsGovernanceMenuOpen(true);
      if (isAnyOrchestrationActive()) setIsOrchestrationMenuOpen(true);
    } else {
      setWorkspaceMode('work');
    }
  }, [currentPage]);

  const handleWorkspaceModeChange = (mode: 'work' | 'studio' | 'govern') => {
    setWorkspaceMode(mode);
    if (mode === 'work') {
      handleNav('dashboard');
    } else if (mode === 'studio') {
      handleNav('agents');
    } else if (mode === 'govern') {
      handleNav('orchestration');
    }
  };

  const handleNav = (page: Page) => {
    onNavigate(page);
    onClose?.();
  };

  const handleAgentsToggle = () => {
    if (isAnyAgentsActive() || currentPage === 'agents') {
      setIsAgentsMenuOpen(prev => !prev);
    } else {
      handleNav('agents');
      setIsAgentsMenuOpen(true);
    }
  };

  const handleGovernanceToggle = () => {
    if (isAnyGovernanceActive() || currentPage === 'governance') {
      setIsGovernanceMenuOpen(prev => !prev);
    } else {
      handleNav('governance');
      setIsGovernanceMenuOpen(true);
    }
  };

  const handleOrchestrationToggle = () => {
    if (isAnyOrchestrationActive() || currentPage === 'orchestration') {
      setIsOrchestrationMenuOpen(prev => !prev);
    } else {
      handleNav('orchestration');
      setIsOrchestrationMenuOpen(true);
    }
  };

  return (
    <aside
      className={[
        'fixed left-[10px] top-[10px] h-[calc(100vh-20px)]',
        isExpanded ? 'w-64' : 'w-64 lg:w-16',
        'flex flex-col z-40',
        'transition-all duration-300 ease-in-out',
        // Flottant : fond effet de glace dépoli ultra-premium
        'glass-sidebar',
        'rounded-2xl',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      ].join(' ')}
    >
      {/* ── Header : logo + toggle ──────────────────────────────── */}
      {/* Desktop Expanded Header & Mobile Header */}
      <div className={`flex items-center h-14 px-3 flex-shrink-0 justify-between ${isExpanded ? 'w-full' : 'lg:hidden w-full'}`}>
        <button
          onClick={() => handleNav('dashboard')}
          className="flex items-center focus:outline-none hover:opacity-80 transition-opacity"
          aria-label="Go to dashboard"
        >
          <img
            src="/assets/images/logo/sendplex-logo.svg"
            alt="Sendplex Logo"
            className="h-6 w-auto"
          />
        </button>
        <button
          onClick={onToggleExpand}
          className="hidden lg:block p-1.5 rounded-md text-[#888888] dark:text-[#bbbbbb] hover:bg-white/40 dark:hover:bg-white/10 hover:text-black dark:hover:text-white transition-colors"
          aria-label="Collapse sidebar"
        >
          <PanelLeft size={18} strokeWidth={1.75} />
        </button>
      </div>

      {/* Desktop Collapsed Header */}
      <div className={`flex items-center h-14 px-3 flex-shrink-0 justify-center ${!isExpanded ? 'hidden lg:flex w-full' : 'hidden'}`}>
        <button
          onClick={onToggleExpand}
          className="group relative w-9 h-9 flex items-center justify-center rounded-md hover:bg-white/40 dark:hover:bg-white/10 transition-all duration-200 focus:outline-none"
          aria-label="Expand sidebar"
        >
          {/* Logo par défaut */}
          <img
            src="/assets/images/logo/sendplex-logo.svg"
            alt="Sendplex Logo"
            className="h-6 w-auto transition-transform duration-200 group-hover:scale-0 group-hover:opacity-0 absolute"
          />
          {/* PanelLeft icon au survol */}
          <PanelLeft
            size={18}
            strokeWidth={1.75}
            className="text-[#888888] dark:text-[#bbbbbb] scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 group-hover:text-black dark:group-hover:text-white transition-all duration-200 absolute"
          />
        </button>
      </div>

      {/* ── Toggle (Work / Studio / Govern) ─────────────────────── */}
      <div className={`p-1 mx-2 mb-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl flex-shrink-0 relative ${isExpanded ? 'flex' : 'flex lg:hidden'
        }`}>
        <button
          onClick={() => handleWorkspaceModeChange('work')}
          className={`flex-1 py-1.5 px-2 flex items-center justify-center gap-1.5 rounded-lg text-xs font-medium transition-colors duration-200 relative z-10 ${workspaceMode === 'work'
              ? 'text-black dark:text-white font-semibold'
              : 'text-[#666666] dark:text-[#999999] hover:text-black dark:hover:text-white'
            }`}
          title={t('sidebar.work')}
        >
          <Briefcase size={14} strokeWidth={1.75} />
          <span>{t('sidebar.work')}</span>
          {workspaceMode === 'work' && (
            <motion.div
              layoutId="active-workspace-indicator"
              className="absolute inset-0 bg-white dark:bg-white/15 shadow-sm border border-black/5 dark:border-white/5 rounded-lg -z-10"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
        </button>
        <button
          onClick={() => handleWorkspaceModeChange('studio')}
          className={`flex-1 py-1.5 px-2 flex items-center justify-center gap-1.5 rounded-lg text-xs font-medium transition-colors duration-200 relative z-10 ${workspaceMode === 'studio'
              ? 'text-black dark:text-white font-semibold'
              : 'text-[#666666] dark:text-[#999999] hover:text-black dark:hover:text-white'
            }`}
          title={t('sidebar.studio')}
        >
          <Cpu size={14} strokeWidth={1.75} />
          <span>{t('sidebar.studio')}</span>
          {workspaceMode === 'studio' && (
            <motion.div
              layoutId="active-workspace-indicator"
              className="absolute inset-0 bg-white dark:bg-white/15 shadow-sm border border-black/5 dark:border-white/5 rounded-lg -z-10"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
        </button>
        <button
          onClick={() => handleWorkspaceModeChange('govern')}
          className={`flex-1 py-1.5 px-2 flex items-center justify-center gap-1.5 rounded-lg text-xs font-medium transition-colors duration-200 relative z-10 ${workspaceMode === 'govern'
              ? 'text-black dark:text-white font-semibold'
              : 'text-[#666666] dark:text-[#999999] hover:text-black dark:hover:text-white'
            }`}
          title={t('sidebar.govern')}
        >
          <Shield size={14} strokeWidth={1.75} />
          <span>{t('sidebar.govern')}</span>
          {workspaceMode === 'govern' && (
            <motion.div
              layoutId="active-workspace-indicator"
              className="absolute inset-0 bg-white dark:bg-white/15 shadow-sm border border-black/5 dark:border-white/5 rounded-lg -z-10"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
        </button>
      </div>

      <div className={`flex-col gap-1.5 p-1 mx-2 mb-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl items-center flex-shrink-0 relative ${isExpanded ? 'hidden' : 'hidden lg:flex'
        }`}>
        <button
          onClick={() => handleWorkspaceModeChange('work')}
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors duration-200 relative z-10 ${workspaceMode === 'work'
              ? 'text-black dark:text-white'
              : 'text-[#666666] dark:text-[#999999] hover:text-black dark:hover:text-white'
            }`}
          title={t('sidebar.work')}
        >
          <Briefcase size={16} strokeWidth={1.75} />
          {workspaceMode === 'work' && (
            <motion.div
              layoutId="active-workspace-indicator-collapsed"
              className="absolute inset-0 bg-white dark:bg-white/15 shadow-sm border border-black/5 dark:border-white/5 rounded-lg -z-10"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
        </button>
        <button
          onClick={() => handleWorkspaceModeChange('studio')}
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors duration-200 relative z-10 ${workspaceMode === 'studio'
              ? 'text-black dark:text-white'
              : 'text-[#666666] dark:text-[#999999] hover:text-black dark:hover:text-white'
            }`}
          title={t('sidebar.studio')}
        >
          <Cpu size={16} strokeWidth={1.75} />
          {workspaceMode === 'studio' && (
            <motion.div
              layoutId="active-workspace-indicator-collapsed"
              className="absolute inset-0 bg-white dark:bg-white/15 shadow-sm border border-black/5 dark:border-white/5 rounded-lg -z-10"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
        </button>
        <button
          onClick={() => handleWorkspaceModeChange('govern')}
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors duration-200 relative z-10 ${workspaceMode === 'govern'
              ? 'text-black dark:text-white'
              : 'text-[#666666] dark:text-[#999999] hover:text-black dark:hover:text-white'
            }`}
          title={t('sidebar.govern')}
        >
          <Shield size={16} strokeWidth={1.75} />
          {workspaceMode === 'govern' && (
            <motion.div
              layoutId="active-workspace-indicator-collapsed"
              className="absolute inset-0 bg-white dark:bg-white/15 shadow-sm border border-black/5 dark:border-white/5 rounded-lg -z-10"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
        </button>
      </div>

      {/* ── Project Switcher ─────────────────────────────────────── */}
      <div className={`px-2 mb-2 flex-shrink-0 ${isExpanded ? 'block' : 'hidden lg:hidden'}`}>
        <ProjectSwitcher onNavigate={handleNav} />
      </div>

      {/* ── Navigation ───────────────────────────────────────────── */}
      <div className="flex-grow overflow-y-auto p-2 space-y-0.5">
        <nav className="space-y-0.5">

          {workspaceMode === 'work' && (
            <>
              <MenuItem
                icon={LayoutDashboard}
                label={t('sidebar.dashboard')}
                page="dashboard"
                currentPage={currentPage}
                onClick={handleNav}
                isExpanded={isExpanded}
              />
              <MenuItem
                icon={MessageSquare}
                label={t('sidebar.discussions')}
                page="conversations"
                currentPage={currentPage}
                onClick={handleNav}
                isExpanded={isExpanded}
                hasNotification
              />
              <MenuItem
                icon={Users}
                label={t('sidebar.customers')}
                page="clients"
                currentPage={currentPage}
                onClick={handleNav}
                isExpanded={isExpanded}
              />
              <MenuItem
                icon={Briefcase}
                label={t('sidebar.projects')}
                page="projects"
                currentPage={currentPage}
                onClick={handleNav}
                isExpanded={isExpanded}
              />
            </>
          )}

          {workspaceMode === 'studio' && (
            <CollapsibleSection
              icon={Bot}
              label={t('sidebar.aiAgents')}
              isOpen={isAgentsMenuOpen}
              isActive={isAnyAgentsActive()}
              isExpanded={isExpanded}
              onToggle={handleAgentsToggle}
            >
              {aiAgentsSubmenu.map(item => (
                <SubMenuItem
                  key={item.page}
                  icon={item.icon}
                  label={item.label}
                  page={item.page}
                  currentPage={currentPage}
                  onClick={handleNav}
                  isExpanded={isExpanded}
                />
              ))}
            </CollapsibleSection>
          )}

          {workspaceMode === 'govern' && (
            <>
              <CollapsibleSection
                icon={Network}
                label="Orchestration"
                isOpen={isOrchestrationMenuOpen}
                isActive={isAnyOrchestrationActive()}
                isExpanded={isExpanded}
                onToggle={handleOrchestrationToggle}
              >
                {orchestrationSubmenu.map(item => (
                  <SubMenuItem
                    key={item.page}
                    icon={item.icon}
                    label={item.label}
                    page={item.page}
                    currentPage={currentPage}
                    onClick={handleNav}
                    isExpanded={isExpanded}
                  />
                ))}
              </CollapsibleSection>

              <CollapsibleSection
                icon={ShieldAlert}
                label={t('sidebar.governance')}
                isOpen={isGovernanceMenuOpen}
                isActive={isAnyGovernanceActive()}
                isExpanded={isExpanded}
                onToggle={handleGovernanceToggle}
              >
                {governanceSubmenu.map(item => (
                  <SubMenuItem
                    key={item.page}
                    icon={item.icon}
                    label={item.label}
                    page={item.page}
                    currentPage={currentPage}
                    onClick={handleNav}
                    isExpanded={isExpanded}
                  />
                ))}
              </CollapsibleSection>
            </>
          )}
        </nav>
      </div>

      {/* ── Footer / Profile Pill ────────────────────────────────── */}
      <div className="p-2 border-t border-black/5 dark:border-white/5 flex-shrink-0 relative">
        {/* Popover Menu */}
        {isProfileMenuOpen && (
          <div
            ref={popoverRef}
            onMouseLeave={() => setPopoverView('main')}
            className={`absolute bottom-14 bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 shadow-2xl rounded-2xl p-4 z-50 text-sm transition-all duration-150 ${isExpanded
                ? 'left-2 right-2 lg:left-2 lg:right-auto lg:w-[320px]'
                : 'left-2 right-2 lg:right-auto lg:w-[320px]'
              }`}
          >
            <div className="space-y-3">
              {/* 1. User Header Section */}
              <div
                className="flex items-center gap-3 pb-1"
                onMouseEnter={() => setPopoverView('main')}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-11 h-11 rounded-full bg-black/10 dark:bg-white/10 text-gray-800 dark:text-gray-200 font-medium flex items-center justify-center text-xs border border-black/5 dark:border-white/5 shadow-inner">
                    OA
                  </div>
                  {(() => {
                    const pill = getPlanPillText(activeWorkspace.plan);
                    return pill ? (
                      <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-black/5 dark:bg-white/10 text-gray-600 dark:text-gray-300 text-[10px] font-normal px-1.5 py-0.2 rounded border border-black/10 dark:border-white/10 shadow whitespace-nowrap scale-90">
                        {pill}
                      </span>
                    ) : null;
                  })()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate leading-tight">Oppie Adirono</p>
                  <p className="text-[10px] font-normal text-gray-500 dark:text-gray-400 truncate mt-0.5">{activeAccount.email}</p>
                </div>
              </div>

              <div className="border-t border-black/10 dark:border-white/10" />

              {/* 2. Workspace & Token Usage Section */}
              <div className="space-y-3">
                {/* Clickable Workspace Details Card with hover submenu */}
                <div
                  onMouseEnter={() => setPopoverView('accounts')}
                >
                  <button
                    onClick={() => setPopoverView(popoverView === 'accounts' ? 'main' : 'accounts')}
                    className={`w-full text-left p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center justify-between gap-3 border border-transparent ${popoverView === 'accounts' ? 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5' : 'hover:border-black/5 dark:hover:border-white/5'
                      }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-black/10 dark:bg-white/10 flex items-center justify-center text-sm flex-shrink-0">
                        <span>{activeWorkspace.icon === 'briefcase' ? '💼' : activeWorkspace.icon === 'user' ? '👤' : '🏢'}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate leading-tight">{activeWorkspace.name}</p>
                        <p className="text-[10px] font-normal text-gray-500 dark:text-gray-400 truncate mt-0.5">
                          {activeWorkspace.plan.toLowerCase().includes('plan') ? activeWorkspace.plan : `${activeWorkspace.plan} plan`} · {activeWorkspace.members}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
                  </button>

                  {/* Workspace switcher submenu nested next to its parent */}
                  {popoverView === 'accounts' && (
                    <div className="absolute z-50 bottom-[calc(100%+8px)] left-0 right-0 lg:bottom-0 lg:top-auto lg:left-full lg:right-auto lg:pl-2">
                      <div className="bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 shadow-2xl rounded-2xl p-4 text-sm w-full lg:w-[320px]">
                        <div className="space-y-3">
                          {/* Active workspace card */}
                          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-black/5 dark:bg-white/5">
                            <span className="w-8 h-8 rounded-lg bg-black/10 dark:bg-white/10 flex items-center justify-center text-sm flex-shrink-0">
                              {activeWorkspace.icon === 'briefcase' ? '💼' : activeWorkspace.icon === 'user' ? '👤' : '🏢'}
                            </span>
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">{activeWorkspace.name}</p>
                              <p className="text-[10px] font-normal text-gray-500 dark:text-gray-400">{activeWorkspace.plan} · {activeWorkspace.members}</p>
                            </div>
                          </div>

                          <div className="border-t border-black/10 dark:border-white/10" />

                          {/* Accounts + workspaces */}
                          <div className="max-h-[380px] overflow-y-auto space-y-3.5 px-0.5">
                            {accounts.map((account) => (
                              <div key={account.id} className="space-y-1">
                                {/* Account header */}
                                <div className="flex items-center justify-between px-1 mb-0.5 border-b border-black/5 dark:border-white/5 pb-0.5">
                                  <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 truncate">{account.email}</span>
                                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0 ml-1">
                                    <MoreHorizontal size={13} />
                                  </button>
                                </div>
                                {/* Workspaces */}
                                <div className="pl-1 space-y-0.5">
                                  {account.workspaces.map((ws) => {
                                    const isActive = ws.id === activeWorkspace.id;
                                    const pill = getPlanPillText(ws.plan);
                                    return (
                                      <button
                                        key={ws.id}
                                        onClick={() => {
                                          switchWorkspace(account.id, ws.id);
                                          setPopoverView('main');
                                          setIsProfileMenuOpen(false);
                                        }}
                                        className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg transition-colors text-left ${isActive
                                            ? 'bg-black/5 dark:bg-white/5 text-gray-900 dark:text-gray-100 font-medium'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 font-normal'
                                          }`}
                                      >
                                        <span className="flex items-center gap-2 truncate">
                                          <span className="text-xs">{ws.icon === 'briefcase' ? '💼' : ws.icon === 'user' ? '👤' : '🏢'}</span>
                                          <span className="text-xs truncate">{ws.name}</span>
                                          {pill && (
                                            <span className="text-[10px] bg-black/5 dark:bg-white/10 text-gray-600 dark:text-gray-300 border border-black/10 dark:border-white/10 px-1.5 py-0.5 rounded font-normal flex-shrink-0">
                                              {pill}
                                            </span>
                                          )}
                                        </span>
                                        {isActive && <Check size={13} className="flex-shrink-0 text-gray-800 dark:text-gray-200" />}
                                      </button>
                                    );
                                  })}
                                  {/* New workspace */}
                                  {addingWorkspaceToAccount === account.id ? (
                                    <div className="flex items-center gap-1 py-0.5">
                                      <input
                                        type="text"
                                        placeholder="Workspace name…"
                                        value={newWorkspaceName}
                                        onChange={(e) => setNewWorkspaceName(e.target.value)}
                                        className="flex-1 min-w-0 bg-transparent border border-black/20 dark:border-white/20 rounded px-2 py-1 text-xs font-normal focus:outline-none"
                                        autoFocus
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') { createWorkspace(account.id, newWorkspaceName.trim()); setNewWorkspaceName(''); setAddingWorkspaceToAccount(null); }
                                          if (e.key === 'Escape') setAddingWorkspaceToAccount(null);
                                        }}
                                      />
                                      <button
                                        onClick={() => { createWorkspace(account.id, newWorkspaceName.trim()); setNewWorkspaceName(''); setAddingWorkspaceToAccount(null); }}
                                        className="px-2 py-1 rounded bg-black dark:bg-white text-white dark:text-black text-xs font-medium"
                                      >Add</button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => setAddingWorkspaceToAccount(account.id)}
                                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-normal text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-left transition-colors"
                                    >
                                      <Plus size={11} />
                                      New workspace
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="border-t border-black/10 dark:border-white/10" />

                          {/* Add account */}
                          {isAddingAccount ? (
                            <div className="flex items-center gap-1 px-1 py-0.5">
                              <input
                                type="email"
                                placeholder="name@email.com"
                                value={newAccountEmail}
                                onChange={(e) => setNewAccountEmail(e.target.value)}
                                className="flex-1 min-w-0 bg-transparent border border-black/20 dark:border-white/20 rounded px-2 py-1 text-xs font-normal focus:outline-none"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') { addAccount(newAccountEmail.trim()); setNewAccountEmail(''); setIsAddingAccount(false); }
                                  if (e.key === 'Escape') setIsAddingAccount(false);
                                }}
                              />
                              <button
                                onClick={() => { addAccount(newAccountEmail.trim()); setNewAccountEmail(''); setIsAddingAccount(false); }}
                                className="px-2 py-1 rounded bg-black dark:bg-white text-white dark:text-black text-xs font-medium"
                              >Link</button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setIsAddingAccount(true)}
                              className="w-full px-3 py-2 flex items-center gap-2.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-left transition-colors"
                            >
                              <UserPlus size={14} />
                              <span className="text-xs font-medium">Add new account</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Token Usage metrics */}
                <div
                  className="px-1 space-y-2.5"
                  onMouseEnter={() => setPopoverView('main')}
                >
                  <p className="text-xs font-medium text-gray-900 dark:text-gray-100">Token Usage</p>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-normal text-gray-500 dark:text-gray-400">
                      <span>Active conversations</span>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">1,250 / 4,000</span>
                    </div>
                    <div className="w-full h-1.5 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-neutral-600 dark:bg-neutral-400 rounded-full" style={{ width: '31.25%' }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-normal text-gray-500 dark:text-gray-400">
                      <span>Background processing</span>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">350 / 1,000</span>
                    </div>
                    <div className="w-full h-1.5 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-neutral-600 dark:bg-neutral-400 rounded-full" style={{ width: '35%' }} />
                    </div>
                  </div>

                  <p className="text-[10px] font-normal text-gray-400 dark:text-gray-500 leading-normal">
                    Resets on the 1st of each month. Unused tokens don't roll over.
                  </p>
                </div>

                {/* Upgrade Plan row */}
                <div onMouseEnter={() => setPopoverView('main')}>
                  <button
                    onClick={() => {
                      handleNav('usage');
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left"
                  >
                    <span className="flex items-center gap-2.5">
                      <ArrowUpCircle size={16} className="text-indigo-600 dark:text-teal-400" />
                      <span className="text-xs font-medium text-indigo-600 dark:text-teal-400 hover:underline">
                        Upgrade plan
                      </span>
                    </span>
                    <span className="text-xs font-normal text-gray-400 dark:text-gray-500">
                      {activeWorkspace.plan}
                    </span>
                  </button>
                </div>
              </div>

              <div className="border-t border-black/10 dark:border-white/10" />

              {/* 3. Settings, Appearance, Help Section */}
              <div className="space-y-0.5">
                <button
                  onMouseEnter={() => setPopoverView('main')}
                  onClick={() => {
                    handleNav('paramètres');
                    setIsProfileMenuOpen(false);
                    setPopoverView('main');
                  }}
                  className="w-full px-2 py-2 flex items-center justify-between rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 transition-colors text-left"
                >
                  <span className="flex items-center gap-2.5">
                    <Settings size={16} className="text-gray-400" />
                    <span className="text-xs font-medium">Settings</span>
                  </span>
                </button>

                {/* Appearance option with hover submenu */}
                <div
                  className="relative"
                  onMouseEnter={() => setPopoverView('appearance')}
                >
                  <button
                    onClick={() => setPopoverView(popoverView === 'appearance' ? 'main' : 'appearance')}
                    className={`w-full px-2 py-2 flex items-center justify-between rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 transition-colors text-left ${popoverView === 'appearance' ? 'bg-black/5 dark:bg-white/5' : ''
                      }`}
                  >
                    <span className="flex items-center gap-2.5">
                      {resolvedTheme === 'dark' ? <Moon size={16} className="text-gray-400" /> : <Sun size={16} className="text-gray-400" />}
                      <span className="text-xs font-medium">Appearance</span>
                    </span>
                    <span className="text-xs font-normal text-gray-400 capitalize flex items-center gap-1">
                      {theme}
                      <ChevronRight size={14} className="text-gray-400" />
                    </span>
                  </button>

                  {/* Appearance submenu nested next to its parent */}
                  {popoverView === 'appearance' && (
                    <div className="absolute z-50 bottom-[calc(100%+8px)] left-0 right-0 lg:bottom-0 lg:top-auto lg:left-full lg:right-auto lg:pl-2">
                      <div className="bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 shadow-2xl rounded-2xl p-4 text-sm w-full lg:w-52">
                        <div className="space-y-0.5">
                          <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 px-2 py-1 uppercase tracking-wider mb-1">Appearance</p>
                          <button
                            onClick={() => setTheme('light')}
                            className="w-full px-2.5 py-1.5 flex items-center justify-between rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 transition-colors text-left text-xs font-normal"
                          >
                            <span className="flex items-center gap-2">
                              <Sun size={14} className="text-gray-400" />
                              <span>Light</span>
                            </span>
                            {theme === 'light' && <Check size={12} className="text-gray-800 dark:text-gray-200 flex-shrink-0" />}
                          </button>
                          <button
                            onClick={() => setTheme('dark')}
                            className="w-full px-2.5 py-1.5 flex items-center justify-between rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 transition-colors text-left text-xs font-normal"
                          >
                            <span className="flex items-center gap-2">
                              <Moon size={14} className="text-gray-400" />
                              <span>Dark</span>
                            </span>
                            {theme === 'dark' && <Check size={12} className="text-gray-800 dark:text-gray-200 flex-shrink-0" />}
                          </button>
                          <button
                            onClick={() => setTheme('system')}
                            className="w-full px-2.5 py-1.5 flex items-center justify-between rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 transition-colors text-left text-xs font-normal"
                          >
                            <span className="flex items-center gap-2">
                              <Laptop size={14} className="text-gray-400" />
                              <span>System</span>
                            </span>
                            {theme === 'system' && <Check size={12} className="text-gray-800 dark:text-gray-200 flex-shrink-0" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Help option with hover submenu */}
                <div
                  className="relative"
                  onMouseEnter={() => setPopoverView('help')}
                >
                  <button
                    onClick={() => setPopoverView(popoverView === 'help' ? 'main' : 'help')}
                    className={`w-full px-2 py-2 flex items-center justify-between rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 transition-colors text-left ${popoverView === 'help' ? 'bg-black/5 dark:bg-white/5' : ''
                      }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <HelpCircle size={16} className="text-gray-400" />
                      <span className="text-xs font-medium">Help</span>
                    </span>
                    <ChevronRight size={14} className="text-gray-400" />
                  </button>

                  {/* Help submenu nested next to its parent */}
                  {popoverView === 'help' && (
                    <div className="absolute z-50 bottom-[calc(100%+8px)] left-0 right-0 lg:bottom-0 lg:top-auto lg:left-full lg:right-auto lg:pl-2">
                      <div className="bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 shadow-2xl rounded-2xl p-4 text-sm w-full lg:w-52">
                        <div className="space-y-0.5">
                          <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 px-2 py-1 uppercase tracking-wider mb-1">Help & Resources</p>
                          <button
                            onClick={() => {
                              handleNav('onboarding');
                              setIsProfileMenuOpen(false);
                              setPopoverView('main');
                            }}
                            className="w-full px-2.5 py-1.5 flex items-center justify-between rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 transition-colors text-left text-xs font-normal"
                          >
                            <span>Onboarding</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-black/10 dark:border-white/10" />

              {/* 4. Sign out & Notifications Section */}
              <div className="flex items-center gap-2" onMouseEnter={() => setPopoverView('main')}>
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    setPopoverView('main');
                  }}
                  className="flex-grow px-2 py-2 flex items-center gap-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 transition-colors text-left font-medium text-xs"
                >
                  <LogOut size={16} className="text-gray-400" />
                  <span>Sign out</span>
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPopoverView(popoverView === 'notifications' ? 'main' : 'notifications');
                  }}
                  className={`p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 transition-colors border ${
                    popoverView === 'notifications'
                      ? 'bg-black/5 dark:bg-white/5 border-black/20 dark:border-white/20'
                      : 'border-black/10 dark:border-white/10'
                  } relative flex-shrink-0`}
                  title="Notifications"
                >
                  <Inbox size={16} className="text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-1 ring-white dark:ring-[#1a1a1a]" />
                  )}
                </button>
              </div>

              {/* Notifications submenu nested next to its parent */}
              {popoverView === 'notifications' && (
                <div className="absolute z-50 bottom-[calc(100%+8px)] left-0 right-0 lg:bottom-0 lg:top-auto lg:left-full lg:right-auto lg:pl-2">
                  <NotificationPanel
                    notifications={notifications}
                    onClose={() => setPopoverView('main')}
                    onMarkAsRead={markAsRead}
                    onMarkAllAsRead={markAllAsRead}
                    onClearAll={clearAllNotifications}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Profile Pill Button */}
        <button
          ref={profileButtonRef}
          onClick={() => {
            setIsProfileMenuOpen(!isProfileMenuOpen);
            setPopoverView('main');
          }}
          className={`flex items-center gap-3 w-full p-2 rounded-xl text-left hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none ${isExpanded ? '' : 'lg:justify-center'
            }`}
        >
          <div className="relative flex-shrink-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-black/10 dark:bg-white/10 text-gray-800 dark:text-gray-200 font-medium flex items-center justify-center text-xs border border-black/5 dark:border-white/5">
              OA
            </div>
            {(() => {
              const pill = getPlanPillText(activeWorkspace.plan);
              return pill ? (
                <div className="absolute -bottom-1 -right-1 bg-gray-900 border border-white dark:border-gray-800 text-[8px] text-white px-1 rounded-full font-medium scale-90">
                  {pill === 'Enterprise' ? 'Ent' : pill}
                </div>
              ) : null;
            })()}
          </div>

          <div className={`${isExpanded ? 'flex' : 'flex lg:hidden'} flex-1 min-w-0 items-center justify-between`}>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">Oppie Adirono</p>
              <p className="text-[10px] font-normal text-gray-500 dark:text-gray-400 truncate">{activeWorkspace.name}</p>
            </div>
            <ChevronUp size={16} className="text-gray-400" />
          </div>
        </button>
      </div>
    </aside>
  );
};

// Notification Panel Component for Sidebar Popover
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
    <div className="bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 shadow-2xl rounded-2xl p-4 text-sm w-full lg:w-[360px] overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <Inbox size={16} className="text-gray-500 dark:text-gray-400" />
          <span className="font-semibold text-gray-900 dark:text-gray-100">Notifications</span>
          {notifications.filter(n => !n.read).length > 0 && (
            <span className="px-1.5 py-0.5 bg-black/5 dark:bg-white/10 text-gray-700 dark:text-gray-300 text-[10px] font-semibold rounded-full">
              {notifications.filter(n => !n.read).length}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="Close notifications"
        >
          <X size={16} />
        </button>
      </div>

      {/* Action buttons */}
      {notifications.length > 0 && (
        <div className="flex items-center gap-2 mb-3 border-b border-black/5 dark:border-white/5 pb-2">
          <button
            onClick={onMarkAllAsRead}
            className="flex items-center gap-1 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-md transition-colors px-2 py-1"
          >
            <CheckCheck size={12} />
            Mark all read
          </button>
          <button
            onClick={onClearAll}
            className="flex items-center gap-1 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-md transition-colors px-2 py-1"
          >
            <Trash2 size={12} />
            Clear all
          </button>
        </div>
      )}

      {/* Notification List */}
      <div className="max-h-[300px] overflow-y-auto space-y-1.5 pr-0.5">
        {notifications.length === 0 ? (
          <div className="py-8 text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-gray-400 dark:text-gray-500">
              <Inbox size={24} />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium mb-0.5">No notifications</p>
            <p className="text-gray-400 dark:text-gray-500 text-xs">You're all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-black/5 dark:divide-white/5">
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
    </div>
  );
});

// Individual Notification Item for Sidebar Popover
const NotificationItem = memo(({ notification, onMarkAsRead, index }: {
  notification: Notification;
  onMarkAsRead: () => void;
  index: number;
}) => {
  const getIcon = () => {
    const iconClass = "h-4 w-4";
    const iconMap = {
      success: <Check className={`${iconClass} text-green-500 dark:text-green-400`} />,
      warning: <AlertCircle className={`${iconClass} text-amber-500 dark:text-amber-400`} />,
      error: <AlertCircle className={`${iconClass} text-red-500 dark:text-red-400`} />,
      info: <Inbox className={`${iconClass} text-blue-500 dark:text-blue-400`} />
    };
    return iconMap[notification.type] || iconMap.info;
  };

  const getIconBg = () => {
    const bgMap = {
      success: 'bg-green-500/10 border border-green-500/20',
      warning: 'bg-amber-500/10 border border-amber-500/20',
      error: 'bg-red-500/10 border border-red-500/20',
      info: 'bg-blue-500/10 border border-blue-500/20'
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
    <div
      className={`py-2 hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer group flex items-start gap-2.5 ${
        !notification.read ? 'font-medium' : ''
      }`}
      onClick={onMarkAsRead}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onMarkAsRead();
        }
      }}
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${getIconBg()} flex items-center justify-center`}>
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <p className={`text-xs text-gray-900 dark:text-gray-100 truncate ${
            !notification.read ? 'font-semibold' : 'text-gray-500 dark:text-gray-400'
          }`}>
            {notification.title}
          </p>
          {!notification.read && (
            <span className="h-1.5 w-1.5 bg-red-500 rounded-full flex-shrink-0 mt-1" />
          )}
        </div>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5 leading-normal">
          {notification.message}
        </p>
        <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400">
          <Clock size={10} />
          <span>{formatTime(notification.timestamp)}</span>
        </div>
      </div>
    </div>
  );
});

export default memo(Sidebar);
