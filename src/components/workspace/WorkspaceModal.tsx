import React, { useState } from 'react';
import WorkspaceHeader from './modal/WorkspaceHeader';
import WorkspaceSidebar from './modal/WorkspaceSidebar';
import WorkspaceFooter from './modal/WorkspaceFooter';
import OverviewTab from './modal/tabs/OverviewTab';
import MembersTab from './modal/tabs/MembersTab';
import RolesTab from './modal/tabs/RolesTab';
import OnboardingTab from './modal/tabs/OnboardingTab';
import SettingsTab from './modal/tabs/SettingsTab';
import DataWalletTab from './modal/tabs/DataWalletTab';
import { WorkspaceData } from './modal/types';

interface WorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Main workspace modal component
 * Manages workspace settings and configuration
 */
export default function WorkspaceModal({ isOpen, onClose }: WorkspaceModalProps) {
  // Skip rendering if modal is not open
  if (!isOpen) return null;
  
  // State for active tab
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'roles' | 'onboarding' | 'data-wallet' | 'settings'>('overview');
  
  // Sample workspace data
  const [workspaceData, setWorkspaceData] = useState<WorkspaceData>({
    id: '1',
    name: 'Miranki',
    description: 'Main workspace for Miranki team',
    logo: null,
    color: '#10B981',
    members: [
      { id: '1', name: 'Minh Nguyen', email: 'minh@miranki.com', role: 'Admin', avatar: null },
      { id: '2', name: 'Sophie Martin', email: 'sophie@miranki.com', role: 'Owner', avatar: null },
      { id: '3', name: 'Thomas Dubois', email: 'thomas@miranki.com', role: 'Steward', avatar: null },
      { id: '4', name: 'Marie Lambert', email: 'marie@miranki.com', role: 'Custodian', avatar: null },
    ],
    roles: [
      { id: 'owner', name: 'Owner', description: 'Full access to all features', permissions: ['manage_workspace', 'manage_members', 'manage_roles', 'manage_billing'] },
      { id: 'admin', name: 'Admin', description: 'Can manage most settings', permissions: ['manage_workspace', 'manage_members', 'manage_roles'] },
      { id: 'steward', name: 'Steward', description: 'Can manage content and users', permissions: ['manage_content', 'view_members'] },
      { id: 'custodian', name: 'Custodian', description: 'Basic access to content', permissions: ['view_content'] },
    ],
    onboarding: {
      welcomeMessage: 'Welcome to Miranki! We\'re excited to have you join our workspace. Here you\'ll find all the tools and resources you need to get started.',
      defaultRole: 'Custodian',
      autoOnboarding: true,
      requiredTasks: ['Complete profile', 'Review documentation', 'Join team channel']
    }
  });
  
  // Function to handle form submission
  const handleSubmit = () => {
    // Save workspace data
    console.log('Saving workspace data:', workspaceData);
    onClose();
  };

  // Render the appropriate tab content based on activeTab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab workspaceData={workspaceData} />;
      case 'members':
        return <MembersTab workspaceData={workspaceData} />;
      case 'roles':
        return <RolesTab workspaceData={workspaceData} />;
      case 'onboarding':
        return <OnboardingTab workspaceData={workspaceData} setWorkspaceData={setWorkspaceData} />;
      case 'data-wallet':
        return <DataWalletTab workspaceData={workspaceData} />;
      case 'settings':
        return <SettingsTab workspaceData={workspaceData} setWorkspaceData={setWorkspaceData} />;
      default:
        return <OverviewTab workspaceData={workspaceData} />;
    }
  };
  
  return (
    <div 
      className="fixed inset-0 overflow-y-auto bg-black bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-80 flex items-center justify-center p-4 transition-colors" 
      style={{ zIndex: 9999 }}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl dark:shadow-gray-900 w-full max-w-6xl max-h-[90vh] flex flex-col relative transition-colors" 
        style={{ zIndex: 10000 }}
      >
        {/* Header */}
        <WorkspaceHeader onClose={onClose} />
        
        {/* Content */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Sidebar */}
          <WorkspaceSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          
          {/* Main content */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900 transition-colors">
            {renderTabContent()}
          </div>
        </div>
        
        {/* Footer */}
        <WorkspaceFooter onClose={onClose} onSave={handleSubmit} />
      </div>
    </div>
  );
}
