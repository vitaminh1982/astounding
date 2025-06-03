import React from 'react';
import { Briefcase, Users, Shield, Calendar, Settings } from 'lucide-react';

interface TabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface WorkspaceSidebarProps {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
}

/**
 * Sidebar navigation component for the workspace modal
 * Displays tabs for different sections of workspace settings
 */
const WorkspaceSidebar: React.FC<WorkspaceSidebarProps> = ({ activeTab, setActiveTab }) => {
  // Tabs configuration
  const tabs: TabItem[] = [
    { id: 'overview', label: 'Overview', icon: <Briefcase className="w-5 h-5" /> },
    { id: 'members', label: 'Members', icon: <Users className="w-5 h-5" /> },
    { id: 'roles', label: 'Roles & Permissions', icon: <Shield className="w-5 h-5" /> },
    { id: 'onboarding', label: 'Onboarding', icon: <Calendar className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200 bg-gray-50">
      <nav className="p-4">
        <ul className="space-y-1">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default WorkspaceSidebar;