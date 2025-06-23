// App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import DashboardPage from './pages/DashboardPage';
import AIAgentsPage from './pages/AIAgentsPage';
import TemplatesPage from './pages/TemplatesPage';
import ConversationsPage from './pages/ConversationsPage';
import ClientsPage from './pages/ClientsPage';
import SettingsPage from './pages/SettingsPage';
import DocumentsPage from './pages/DocumentsPage';
import WorkflowsPage from './pages/WorkflowsPage';
import IntegrationsPage from './pages/IntegrationsPage';
import PromptsPage from './pages/PromptsPage';
import UsagePage from './pages/UsagePage';
import GovernancePage from './pages/GovernancePage';
import PolicyManagementPage from './pages/PolicyManagementPage';
import AuditCompliancePage from './pages/AuditCompliancePage';
import RiskManagementPage from './pages/RiskManagementPage';
import PerformanceAnalyticsPage from './pages/PerformanceAnalyticsPage';
import AgentConfigurationPage from './pages/AgentConfigurationPage';
import OnboardingPage from './pages/OnboardingPage';
import FloatingAssistant from './components/assistant/FloatingAssistant';

// Update Page type to include 'prompts' and 'usage'
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
  | 'paramètres';

// You might want to create a type for navigation items
interface NavItem {
  id: Page;
  label: string;
  icon: string;
}

// Navigation items array with new prompts and usage items
const navigationItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'agents', label: 'AI Agents', icon: 'robot' },
  { id: 'prompts', label: 'Prompts', icon: 'prompt' }, // New prompts item
  { id: 'governance', label: 'Governance', icon: 'governance' },
  { id: 'onboarding', label: 'Onboarding', icon: 'onboarding' },
  { id: 'templates', label: 'Templates', icon: 'template' },
  { id: 'documents', label: 'Documents', icon: 'document' },
  { id: 'integrations', label: 'Integrations', icon: 'link' }, 
  { id: 'workflows', label: 'Workflows', icon: 'workflow' },
  { id: 'conversations', label: 'Conversations', icon: 'chat' },
  { id: 'clients', label: 'Clients', icon: 'users' },
  { id: 'usage', label: 'Usage', icon: 'chart' }, // New usage item
  { id: 'paramètres', label: 'Settings', icon: 'settings' }
];

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const handleNavigation = (page: Page) => {
    setCurrentPage(page);
    setIsSidebarOpen(false);
  };

  const toggleSidebarExpand = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  // Helper function to render the current page
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigation} />;
      case 'agents':
        return <AIAgentsPage />;
      case 'templates':
        return <TemplatesPage />;
      case 'prompts':
        return <PromptsPage />; // Render the new PromptsPage
      case 'governance':
        return <GovernancePage onNavigate={handleNavigation} />;
      case 'policy-management':
        return <PolicyManagementPage />;
      case 'audit-compliance':
        return <AuditCompliancePage />;
      case 'risk-management':
        return <RiskManagementPage />;
      case 'performance-analytics':
        return <PerformanceAnalyticsPage />;
      case 'onboarding':
        return <OnboardingPage />;
      case 'agent-configuration':
        return <AgentConfigurationPage />;
      case 'workflows':
        return <WorkflowsPage />;
      case 'conversations':
        return <ConversationsPage />;
      case 'clients':
        return <ClientsPage />;
      case 'documents':
        return <DocumentsPage />;
      case 'integrations':
        return <IntegrationsPage />; // New Integrations page
      case 'usage':
        return <UsagePage />; // Render the new UsagePage
      case 'paramètres':
        return <SettingsPage />;
      default:
        return <DashboardPage onNavigate={handleNavigation} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Add Toaster component here */}
      <Toaster 
        position="top-right" 
        toastOptions={{
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
        }}
      />

      <Navbar 
        onNavigate={handleNavigation} 
        onMenuClick={() => setIsSidebarOpen(true)}
        navigationItems={navigationItems}
        currentPage={currentPage}
        isSidebarExpanded={isSidebarExpanded}
        onToggleSidebar={toggleSidebarExpand}
      />

      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar 
        currentPage={currentPage} 
        onNavigate={handleNavigation}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        navigationItems={navigationItems}
        isExpanded={isSidebarExpanded}
        onToggleExpand={toggleSidebarExpand}
      />

      <main className={`
        flex-1
        overflow-y-auto
        pt-16 
        px-4
        transition-all 
        duration-300 
        ease-in-out
        ${isSidebarExpanded ? 'lg:ml-64' : 'lg:ml-20'}
      `}>
        <div className="max-w-7xl mx-auto py-6">
          {renderCurrentPage()}
        </div>
      </main>

      <div className="fixed bottom-4 right-4 z-40">
        <FloatingAssistant />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </Router>
  );
}

export default App;