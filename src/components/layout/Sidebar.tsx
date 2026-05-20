import React, { useState, useContext, memo, useEffect } from 'react';
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
  Network,
  Server,
  Share2,
  Briefcase,
  PanelLeft,
} from 'lucide-react';
import { Page } from '../../App';
import { LanguageContext } from '../../context/LanguageContext';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isOpen?: boolean;
  onClose?: () => void;
  navigationItems?: { id: Page; label: string; icon: string }[];
  isExpanded?: boolean;
  onToggleExpand?: () => void;
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
        !isExpanded && 'justify-center',
      ].join(' ')}
    >
      <div className="relative flex-shrink-0">
        <Icon size={18} strokeWidth={1.75} />
        {hasNotification && (
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[#888888]" />
        )}
      </div>
      {isExpanded && <span className="truncate">{label}</span>}
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
        !isExpanded && 'justify-center',
      ].join(' ')}
    >
      <Icon size={16} strokeWidth={1.75} className="flex-shrink-0" />
      {isExpanded && <span className="truncate">{label}</span>}
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
        isExpanded ? 'justify-between' : 'justify-center',
      ].join(' ')}
    >
      <div className="flex items-center gap-3">
        <Icon size={18} strokeWidth={1.75} />
        {isExpanded && <span>{label}</span>}
      </div>
      {isExpanded && (
        <span className="text-[#aaaaaa]">
          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>
      )}
    </button>

    {isOpen && (
      <div className={`space-y-0.5 ${isExpanded ? 'pl-4' : ''}`}>
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

  const [isAgentsMenuOpen, setIsAgentsMenuOpen] = useState(false);
  const [isGovernanceMenuOpen, setIsGovernanceMenuOpen] = useState(false);
  const [isOrchestrationMenuOpen, setIsOrchestrationMenuOpen] = useState(false);

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
    if (isAnyAgentsActive()) setIsAgentsMenuOpen(true);
    if (isAnyGovernanceActive()) setIsGovernanceMenuOpen(true);
    if (isAnyOrchestrationActive()) setIsOrchestrationMenuOpen(true);
  }, [currentPage]);

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

  const handleExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <aside
      className={[
        'fixed left-[10px] top-[10px] h-[calc(100vh-20px)]',
        isExpanded ? 'w-64' : 'w-16',
        'flex flex-col z-40',
        'transition-all duration-300 ease-in-out',
        // Flottant : fond effet de glace dépoli ultra-premium
        'glass-sidebar',
        'rounded-2xl',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      ].join(' ')}
    >
      {/* ── Header : logo + toggle ──────────────────────────────── */}
      <div className={[
        'flex items-center h-14 px-3 flex-shrink-0',
        isExpanded ? 'justify-between' : 'justify-center',
      ].join(' ')}>
        {isExpanded ? (
          <>
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
              className="p-1.5 rounded-md text-[#888888] dark:text-[#bbbbbb] hover:bg-white/40 dark:hover:bg-white/10 hover:text-black dark:hover:text-white transition-colors"
              aria-label="Collapse sidebar"
            >
              <PanelLeft size={18} strokeWidth={1.75} />
            </button>
          </>
        ) : (
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
        )}
      </div>

      {/* ── Navigation ───────────────────────────────────────────── */}
      <div className="flex-grow overflow-y-auto p-2 space-y-0.5">
        <nav className="space-y-0.5">

          <MenuItem
            icon={LayoutDashboard}
            label={t('sidebar.dashboard')}
            page="dashboard"
            currentPage={currentPage}
            onClick={handleNav}
            isExpanded={isExpanded}
          />

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
        </nav>
      </div>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <div className="p-2 space-y-0.5 flex-shrink-0">
        <button
          onClick={() => handleExternalLink('https://miranki.app.n8n.cloud/form/c9ebaa6b-9dfd-4473-91a8-e536c587a2e6')}
          className={[
            'flex w-full items-center gap-3 px-3 py-2',
            'text-sm rounded-lg text-[#666666]',
            'hover:bg-[#efefef] hover:text-[#111111]',
            'transition-colors duration-150',
            !isExpanded && 'justify-center',
          ].join(' ')}
          aria-label="Contact us"
        >
          <Mail size={18} strokeWidth={1.75} />
          {isExpanded && <span>{t('sidebar.contact')}</span>}
        </button>

        <button
          onClick={() => handleExternalLink('https://meetings-eu1.hubspot.com/minh-hoang')}
          className={[
            'flex w-full items-center gap-3 px-3 py-2',
            'text-sm rounded-lg text-[#666666]',
            'hover:bg-[#efefef] hover:text-[#111111]',
            'transition-colors duration-150',
            !isExpanded && 'justify-center',
          ].join(' ')}
          aria-label="Request demo"
        >
          <PlayCircle size={18} strokeWidth={1.75} />
          {isExpanded && <span>{t('sidebar.askDemo')}</span>}
        </button>

        {isExpanded && (
          <p className="px-3 pt-1 pb-0.5 text-xs text-[#aaaaaa] text-center">
            {t('sidebar.developedBy')}
          </p>
        )}
      </div>
    </aside>
  );
};

export default memo(Sidebar);
