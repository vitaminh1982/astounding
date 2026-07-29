// App.tsx
import React, { useState, useMemo, lazy, Suspense } from 'react';
import { Chat } from './types/plex';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { WorkspaceProvider } from './context/WorkspaceContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import FloatingAssistant from './components/assistant/FloatingAssistant';
import LoadingSpinner from './components/common/LoadingSpinner';

// Lazy load pages for better performance
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AIAgentsPage = lazy(() => import('./pages/AIAgentsPage'));
const TemplatesPage = lazy(() => import('./pages/TemplatesPage'));
const ConversationsPage = lazy(() => import('./pages/ConversationsPage'));
const ClientsPage = lazy(() => import('./pages/ClientsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const DocumentsPage = lazy(() => import('./pages/DocumentsPage'));
const WorkflowsPage = lazy(() => import('./pages/WorkflowsPage'));
const IntegrationsPage = lazy(() => import('./pages/IntegrationsPage'));
const PromptsPage = lazy(() => import('./pages/PromptsPage'));
const UsagePage = lazy(() => import('./pages/UsagePage'));
const GovernancePage = lazy(() => import('./pages/GovernancePage'));
const PolicyManagementPage = lazy(() => import('./pages/PolicyManagementPage'));
const AuditCompliancePage = lazy(() => import('./pages/AuditCompliancePage'));
const RiskManagementPage = lazy(() => import('./pages/RiskManagementPage'));
const PerformanceAnalyticsPage = lazy(() => import('./pages/PerformanceAnalyticsPage'));
const AgentConfigurationPage = lazy(() => import('./pages/AgentConfigurationPage'));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'));
const OrchestrationPage = lazy(() => import('./pages/OrchestrationPage'));
const AgentManagementPage = lazy(() => import('./components/orchestration/AgentManagementPage'));
const WorkflowManagementPage = lazy(() => import('./components/orchestration/WorkflowManagementPage'));
const MonitoringAnalyticsPage = lazy(() => import('./components/orchestration/MonitoringAnalyticsPage'));
const ResourceManagementPage = lazy(() => import('./components/orchestration/ResourceManagementPage'));
const CollaborationPage = lazy(() => import('./components/orchestration/CollaborationPage'));
const ProjectPage = lazy(() => import('./pages/ProjectPage'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));
const PlexPage = lazy(() => import('./pages/PlexPage'));
const WorkspaceAgentsPage = lazy(() => import('./pages/WorkspaceAgentsPage'));

// Types
export type Page =
  | 'dashboard'
  | 'agents'
  | 'templates'
  | 'conversations'
  | 'clients'
  | 'documents'
  | 'workflows'
  | 'integrations'
  | 'prompts'
  | 'governance'
  | 'policy-management'
  | 'audit-compliance'
  | 'risk-management'
  | 'performance-analytics'
  | 'onboarding'
  | 'agent-configuration'
  | 'usage'
  | 'orchestration'
  | 'projects'
  | 'project-detail'
  | 'agent-management'
  | 'workflow-management'
  | 'monitoring-analytics'
  | 'resource-management'
  | 'collaboration'
  | 'plex'
  | 'workspace-agents'
  | 'paramètres';

interface NavItem {
  id: Page;
  label: string;
  icon: string;
}

interface PageConfig {
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  requiresNavigation?: boolean;
}

// Constants
const NAVIGATION_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'agents', label: 'AI Agents', icon: 'robot' },
  { id: 'prompts', label: 'Prompts', icon: 'prompt' },
  { id: 'governance', label: 'Governance', icon: 'governance' },
  { id: 'onboarding', label: 'Onboarding', icon: 'onboarding' },
  { id: 'templates', label: 'Templates', icon: 'template' },
  { id: 'documents', label: 'Documents', icon: 'document' },
  { id: 'integrations', label: 'Integrations', icon: 'link' },
  { id: 'workflows', label: 'Workflows', icon: 'workflow' },
  { id: 'projects', label: 'All projects', icon: 'project' },
  { id: 'conversations', label: 'Conversations', icon: 'chat' },
  { id: 'clients', label: 'Clients', icon: 'users' },
  { id: 'usage', label: 'Usage', icon: 'chart' },
  { id: 'paramètres', label: 'Settings', icon: 'settings' }
];

const TOAST_OPTIONS = {
  position: 'top-right' as const,
  toastOptions: {
    duration: 3000,
    style: {
      background: '#363636',
      color: '#fff',
    },
    success: {
      style: {
        background: '#059669',
      },
    },
    error: {
      style: {
        background: '#DC2626',
      },
    },
  },
};

// Page configuration mapping
const PAGE_CONFIG: Record<Page, PageConfig> = {
  dashboard: { component: DashboardPage, requiresNavigation: true },
  agents: { component: AIAgentsPage },
  templates: { component: TemplatesPage },
  prompts: { component: PromptsPage },
  governance: { component: GovernancePage, requiresNavigation: true },
  'policy-management': { component: PolicyManagementPage },
  'audit-compliance': { component: AuditCompliancePage },
  'risk-management': { component: RiskManagementPage },
  'performance-analytics': { component: PerformanceAnalyticsPage },
  onboarding: { component: OnboardingPage, requiresNavigation: true },
  'agent-configuration': { component: AgentConfigurationPage },
  workflows: { component: WorkflowsPage },
  projects: { component: ProjectPage, requiresNavigation: true },
  'project-detail': { component: ProjectDetailPage },
  conversations: { component: ConversationsPage },
  clients: { component: ClientsPage },
  documents: { component: DocumentsPage },
  integrations: { component: IntegrationsPage },
  usage: { component: UsagePage },
  orchestration: { component: OrchestrationPage, requiresNavigation: true },
  'agent-management': { component: AgentManagementPage, requiresNavigation: true },
  'workflow-management': { component: WorkflowManagementPage, requiresNavigation: true },
  'monitoring-analytics': { component: MonitoringAnalyticsPage, requiresNavigation: true },
  'resource-management': { component: ResourceManagementPage, requiresNavigation: true },
  collaboration: { component: CollaborationPage, requiresNavigation: true },
  paramètres: { component: SettingsPage },
  plex: { component: PlexPage },
  'workspace-agents': { component: WorkspaceAgentsPage },
};

// Loading component
const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpinner size="large" />
  </div>
);

// Main App Content Component
function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>(
    () => (localStorage.getItem('app-current-page') as Page | null) || 'dashboard'
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  // Lifted Plex state
  const [plexChats, setPlexChats] = useState<Chat[]>([]);
  const [activePlexChatId, setActivePlexChatId] = useState<string | null>(null);

  const handleNavigation = useMemo(
    () => (page: Page) => {
      setCurrentPage(page);
      localStorage.setItem('app-current-page', page);
      setIsSidebarOpen(false);
    },
    []
  );

  const toggleSidebarExpand = useMemo(
    () => () => {
      setIsSidebarExpanded((prev) => !prev);
    },
    []
  );

  const closeSidebar = useMemo(
    () => () => {
      setIsSidebarOpen(false);
    },
    []
  );

  const openSidebar = useMemo(
    () => () => {
      setIsSidebarOpen(true);
    },
    []
  );

  const CurrentPageComponent = useMemo(() => {
    const pageConfig = PAGE_CONFIG[currentPage] || PAGE_CONFIG.dashboard;
    const Component = pageConfig.component;
    const props = {
      ...(pageConfig.requiresNavigation ? { onNavigate: handleNavigation } : {}),
      ...(currentPage === 'plex'
        ? {
          isSidebarExpanded,
          onToggleSidebar: toggleSidebarExpand,
          chats: plexChats,
          setChats: setPlexChats,
          activeChatId: activePlexChatId,
          setActiveChatId: setActivePlexChatId,
        }
        : {}),
      ...(currentPage === 'workspace-agents'
        ? {
          isSidebarExpanded,
          onToggleSidebar: toggleSidebarExpand,
        }
        : {}),
      ...(currentPage === 'project-detail'
        ? {
          isSidebarExpanded,
        }
        : {})
    };

    return <Component {...props} />;
  }, [currentPage, handleNavigation, isSidebarExpanded, plexChats, activePlexChatId]);

  const hasSidebar = currentPage !== 'dashboard' && currentPage !== 'paramètres' && currentPage !== 'onboarding' && currentPage !== 'usage';

  return (
    <div className="flex flex-col h-screen overflow-hidden app-bg transition-colors">
      <Toaster {...TOAST_OPTIONS} />

      {/* Full-width header */}
      <Navbar
        onNavigate={handleNavigation}
        onMenuClick={openSidebar}
        navigationItems={NAVIGATION_ITEMS}
        currentPage={currentPage}
        isSidebarExpanded={isSidebarExpanded}
        onToggleSidebar={toggleSidebarExpand}
      />

      {/* Content row: sidebar (in-flow) + main */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* Sidebar — in-flow on desktop, overlay on mobile */}
        <Sidebar
          currentPage={currentPage}
          onNavigate={handleNavigation}
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          navigationItems={NAVIGATION_ITEMS}
          isExpanded={isSidebarExpanded}
          onToggleExpand={toggleSidebarExpand}
          plexChats={plexChats}
          activePlexChatId={activePlexChatId}
          setActivePlexChatId={setActivePlexChatId}
          onStartNewPlexChat={() => setActivePlexChatId(null)}
        />

        {/* Mobile overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={closeSidebar}
            aria-hidden="true"
          />
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto px-4 min-h-0">
          <div className="max-w-7xl mx-auto pb-6">
            <Suspense fallback={<PageLoader />}>
              {CurrentPageComponent}
            </Suspense>
          </div>
        </main>
      </div>

      <div className="fixed bottom-4 right-4 z-40">
        <FloatingAssistant />
      </div>
    </div>
  );
}

// Root App Component
function App() {
  return (
    <Router>
      <ThemeProvider defaultTheme="system" storageKey="app-theme">
        <WorkspaceProvider>
          <LanguageProvider>
            <AppContent />
          </LanguageProvider>
        </WorkspaceProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
