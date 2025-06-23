import React, { useState, useContext, memo } from 'react';
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
  Settings, 
  Mail, 
  PlayCircle, 
  X, 
  FolderOpen,
  GitBranch,
  Sparkles,
  Wrench,
  ChevronDown,
  ChevronRight
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

// Create a memoized menu item component to prevent unnecessary re-renders
const MenuItem = memo(({ 
  icon: Icon, 
  label, 
  page, 
  currentPage, 
  onClick, 
  isExpanded, 
  hasNotification 
}) => (
  <button
    onClick={() => onClick(page)}
    className={`
      flex w-full items-center gap-3 px-4 py-3 
      text-sm rounded-lg 
      hover:bg-gray-800 
      transition-colors
      ${page && currentPage === page ? 'bg-gray-800' : ''}
      ${!isExpanded && 'justify-center'}
    `}
  >
    <div className="relative flex-shrink-0">
      <Icon size={20} />
      {hasNotification && (
        <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        </span>
      )}
    </div>
    {isExpanded && <span className="truncate">{label}</span>}
  </button>
));

// Create a memoized submenu item component
const SubMenuItem = memo(({ 
  icon: Icon, 
  label, 
  page, 
  currentPage, 
  onClick, 
  isExpanded 
}) => (
  <button
    onClick={() => onClick(page)}
    className={`
      flex w-full items-center gap-3 px-4 py-2.5
      text-sm rounded-lg 
      hover:bg-gray-800 
      transition-colors
      ${page && currentPage === page ? 'bg-gray-800' : ''}
      ${!isExpanded && 'justify-center'}
    `}
  >
    <Icon size={20} className="flex-shrink-0" />
    {isExpanded && <span className="truncate">{label}</span>}
  </button>
));

const Sidebar = ({ 
  currentPage, 
  onNavigate, 
  isOpen, 
  onClose, 
  navigationItems,
  isExpanded = true,
  onToggleExpand
}: SidebarProps) => {
  const { t } = useContext(LanguageContext);
  const [isAgentsMenuOpen, setIsAgentsMenuOpen] = useState(false);
  const [isGovernanceMenuOpen, setIsGovernanceMenuOpen] = useState(false);
  const [isOnboardingMenuOpen, setIsOnboardingMenuOpen] = useState(false);


  // Governance submenu items
  const governanceSubmenu = [
    { icon: FileText, label: t('sidebar.policyManagement'), page: 'policy-management' as const },
    { icon: ClipboardCheck, label: t('sidebar.auditCompliance'), page: 'audit-compliance' as const },
    { icon: AlertTriangle, label: t('sidebar.riskManagement'), page: 'risk-management' as const },
    { icon: BarChart2, label: t('sidebar.performanceAnalytics'), page: 'performance-analytics' as const },
    { icon: Settings2, label: t('sidebar.agentConfiguration'), page: 'agent-configuration' as const },
  ];

  // AI Agents submenu items - defined with direct icon references
  const aiAgentsSubmenu = [
    { icon: Sparkles, label: t('sidebar.prompts'), page: 'prompts' as const },
    { icon: FileText, label: t('sidebar.templates'), page: 'templates' as const },
    { icon: FolderOpen, label: t('sidebar.knowledgeBase'), page: 'documents' as const },
    { icon: Wrench, label: t('sidebar.integrations'), page: 'integrations' as const },
    { icon: GitBranch, label: t('sidebar.workflows'), page: 'workflows' as const },
  ];

  // Main menu items - defined with direct icon references
  const mainMenuItems = [
    { icon: LayoutDashboard, label: t('sidebar.dashboard'), page: 'dashboard' as const },
    { 
      icon: MessageSquare, 
      label: t('sidebar.discussions'), 
      page: 'conversations' as const,
      hasNotification: true
    },
    { icon: Users, label: t('sidebar.customers'), page: 'clients' as const }
    //{ icon: BarChart2, label: 'Usage', page: 'usage' as const },
    //{ icon: Settings, label: t('sidebar.settings'), page: 'paramètres' as const },
  ];

  const toggleAgentsMenu = () => {
    setIsAgentsMenuOpen(!isAgentsMenuOpen);
  };

  const isAnyAgentsSubmenuActive = () => {
    return aiAgentsSubmenu.some(item => item.page === currentPage);
  };

  const isAnyGovernanceSubmenuActive = () => {
    return governanceSubmenu.some(item => item.page === currentPage);
  };
  
  const isAnyOnboardingSubmenuActive = () => {
    return onboardingSubmenu.some(item => item.page === currentPage);
  };

  const handleMenuItemClick = (page: Page) => {
    onNavigate(page);
    onClose?.();
  };

  const handleExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <aside className={`
      fixed left-0 top-0 lg:top-16 
      h-full lg:h-[calc(100vh-4rem)] 
      ${isExpanded ? 'w-64' : 'w-20'} 
      bg-gray-900 
      text-white 
      flex flex-col
      z-30
      transition-all duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      {/* Mobile close button */}
      <div className="lg:hidden flex justify-between items-center p-4 border-b border-gray-800">
        <span className="text-lg font-semibold">{t('sidebar.menu')}</span>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      {/* Mobile logo */}
      <div className="lg:hidden p-4 border-b border-gray-800">
        <span className="text-xl font-bold text-[#10B981]">Sendplex</span>
      </div>

      {/* Main menu */}
      <div className="p-4 flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800">
        <nav className="space-y-1">
          {/* Dashboard item */}
          <MenuItem 
            icon={mainMenuItems[0].icon}
            label={mainMenuItems[0].label}
            page={mainMenuItems[0].page}
            currentPage={currentPage}
            onClick={handleMenuItemClick}
            isExpanded={isExpanded}
            hasNotification={mainMenuItems[0].hasNotification}
          />


          {/* AI Agents with collapsible submenu */}
          <div className="space-y-1">
            <button
              onClick={toggleAgentsMenu}
              className={`
                flex w-full items-center justify-between px-4 py-3 
                text-sm rounded-lg 
                hover:bg-gray-800 
                transition-colors
                ${isAnyAgentsSubmenuActive() || currentPage === 'agents' ? 'bg-gray-800' : ''}
                ${!isExpanded && 'justify-center'}
              `}
              aria-expanded={isAgentsMenuOpen}
            >
              <div className="flex items-center gap-3">
                <Bot size={20} />
                {isExpanded && <span>{t('sidebar.aiAgents')}</span>}
              </div>
              {isExpanded && (
                <span className="text-gray-400">
                  {isAgentsMenuOpen ? 
                    <ChevronDown size={16} /> : 
                    <ChevronRight size={16} />
                  }
                </span>
              )}
            </button>
            
            {/* Nested menu items for AI Agents */}
            {isAgentsMenuOpen && (
              <div className={`space-y-1 ${isExpanded ? 'pl-6' : ''}`}>
                {aiAgentsSubmenu.map((subItem) => (
                  <SubMenuItem
                    key={subItem.page}
                    icon={subItem.icon}
                    label={subItem.label}
                    page={subItem.page}
                    currentPage={currentPage}
                    onClick={handleMenuItemClick}
                    isExpanded={isExpanded}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Governance with collapsible submenu */}
          <div className="space-y-1">
            <button
              onClick={() => {
                if (currentPage === 'governance' || isAnyGovernanceSubmenuActive()) {
                  handleMenuItemClick('governance');
                } else {
                  setIsGovernanceMenuOpen(!isGovernanceMenuOpen);
                }
              }}
              className={`
                flex w-full items-center justify-between px-4 py-3 
                text-sm rounded-lg 
                hover:bg-gray-800 
                transition-colors
                ${currentPage === 'governance' || isAnyGovernanceSubmenuActive() ? 'bg-gray-800' : ''}
                ${!isExpanded && 'justify-center'}
              `}
              aria-expanded={isGovernanceMenuOpen}
            >
              <div className="flex items-center gap-3">
                <ShieldAlert size={20} />
                {isExpanded && <span>{t('sidebar.governance')}</span>}
              </div>
              {isExpanded && (
                <span className="text-gray-400">
                  {isGovernanceMenuOpen ? 
                    <ChevronDown size={16} /> : 
                    <ChevronRight size={16} />
                  }
                </span>
              )}
            </button>
            
            {/* Nested menu items for Governance */}
            {isGovernanceMenuOpen && (
              <div className={`space-y-1 ${isExpanded ? 'pl-6' : ''}`}>
                {governanceSubmenu.map((subItem) => (
                  <SubMenuItem
                    key={subItem.page}
                    icon={subItem.icon}
                    label={subItem.label}
                    page={subItem.page}
                    currentPage={currentPage}
                    onClick={handleMenuItemClick}
                    isExpanded={isExpanded}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Onboarding with collapsible submenu */}
          <div className="space-y-1">
            <button
              onClick={() => {
                if (currentPage === 'onboarding' || isAnyOnboardingSubmenuActive()) {
                  handleMenuItemClick('onboarding');
                } else {
                  setIsOnboardingMenuOpen(!isOnboardingMenuOpen);
                }
              }}
              className={`
                flex w-full items-center justify-between px-4 py-3 
                text-sm rounded-lg 
                hover:bg-gray-800 
                transition-colors
                ${currentPage === 'onboarding' || isAnyOnboardingSubmenuActive() ? 'bg-gray-800' : ''}
                ${!isExpanded && 'justify-center'}
              `}
              aria-expanded={isOnboardingMenuOpen}
            >
              <div className="flex items-center gap-3">
                <FileText size={20} />
                {isExpanded && <span>{t('sidebar.onboarding')}</span>}
              </div>
              {isExpanded && (
                <span className="text-gray-400">
                  {isOnboardingMenuOpen ? 
                    <ChevronDown size={16} /> : 
                    <ChevronRight size={16} />
                  }
                </span>
              )}
            </button>
            
            {/* Nested menu items for Onboarding */}
            {isOnboardingMenuOpen && (
              <div className={`space-y-1 ${isExpanded ? 'pl-6' : ''}`}>
                {onboardingSubmenu.map((subItem) => (
                  <SubMenuItem
                    key={subItem.page}
                    icon={subItem.icon}
                    label={subItem.label}
                    page={subItem.page}
                    currentPage={currentPage}
                    onClick={handleMenuItemClick}
                    isExpanded={isExpanded}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Regular menu items after AI Agents */}
          {mainMenuItems.slice(1).map((item) => (
            <MenuItem
              key={item.page}
              icon={item.icon}
              label={item.label}
              page={item.page}
              currentPage={currentPage}
              onClick={handleMenuItemClick}
              isExpanded={isExpanded}
              hasNotification={item.hasNotification}
            />
          ))}
        </nav>
      </div>
        
      
      {/* Contact and demo buttons */}
      <div className="p-4 border-t border-gray-800 space-y-2">
        <button
          onClick={() => handleExternalLink('https://n8n-b2xt.onrender.com/form/359cc987-10e4-47a2-93fd-376eb9c8b271')}
          className={`flex w-full items-center gap-3 px-4 py-3 text-sm rounded-lg hover:bg-gray-800 transition-colors ${!isExpanded && 'justify-center'}`}
          aria-label="Contact us"
        >
          <Mail size={20} />
          {isExpanded && <span>{t('sidebar.contact')}</span>}
        </button>
        <button
          onClick={() => handleExternalLink('https://meetings-eu1.hubspot.com/minh-hoang')}
          className={`flex w-full items-center gap-3 px-4 py-3 text-sm rounded-lg hover:bg-gray-800 transition-colors ${!isExpanded && 'justify-center'}`}
          aria-label="Request demo"
        >
          <PlayCircle size={20} />
          {isExpanded && <span>{t('sidebar.askDemo')}</span>}
        </button>
      </div>
      
      {/* Footer */}
      {isExpanded && (
        <div className="p-4 text-xs text-gray-500 text-center border-t border-gray-800">
          {t('sidebar.developedBy')}
        </div>
      )}
    </aside>
  );
};

export default memo(Sidebar);