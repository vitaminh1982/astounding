import React, { useState } from 'react';
import { Settings, Briefcase } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ProjectManagementModal, { ProjectConfiguration } from './ProjectManagementModal';

interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'idle' | 'thinking' | 'offline';
  avatar: string;
  description: string;
  capabilities: string[];
  lastActivity: string;
  responseTime: string;
  successRate: number;
  isConfigurable: boolean;
}

interface AgentPanelProps {
  currentProject: {
    name: string;
  };
  agents: Agent[];
  selectedAgents: string[];
  onToggleAgentSelection: (agentId: string) => void;
  onManageAgents: () => void;
  onProjectUpdate?: (project: ProjectConfiguration) => void;
}

const AgentPanel: React.FC<AgentPanelProps> = ({
  currentProject,
  agents,
  selectedAgents,
  onToggleAgentSelection,
  onManageAgents,
  onProjectUpdate
}) => {
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // Convert current project to ProjectConfiguration format
  const projectConfiguration: ProjectConfiguration = {
    id: 'proj-001',
    name: currentProject.name,
    description: 'Digital transformation initiative for TechCorp Solutions',
    client: {
      id: 'client-001',
      name: 'TechCorp Solutions',
      industry: 'Technology',
      contactPerson: {
        name: 'John Smith',
        email: 'john.smith@techcorp.com',
        phone: '+1 (555) 123-4567',
        role: 'CTO'
      },
      address: {
        street: '123 Innovation Drive',
        city: 'San Francisco',
        country: 'USA',
        postalCode: '94105'
      },
      website: 'https://techcorp.com',
      description: 'Leading technology solutions provider specializing in enterprise software and digital transformation.'
    },
    status: 'active',
    startDate: '2025-01-15',
    endDate: '2025-06-30',
    budget: '€450,000',
    priority: 'high',
    securitySettings: {
      dataEncryption: true,
      accessLogging: true,
      sessionTimeout: 30,
      ipRestrictions: [],
      twoFactorRequired: true
    },
    knowledgeBase: [],
    authorizedUsers: [],
    createdBy: 'Admin',
    createdAt: '2025-01-15',
    lastModified: new Date().toISOString()
  };

  const handleProjectUpdate = (updatedProject: ProjectConfiguration) => {
    if (onProjectUpdate) {
      onProjectUpdate(updatedProject);
    }
    setIsProjectModalOpen(false);
  };

  const getAgentStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300';
      case 'idle':
        return 'bg-surface-container-low dark:bg-surface-container-high text-on-surface dark:text-muted-foreground';
      case 'thinking':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300';
      case 'offline':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300';
      default:
        return 'bg-surface-container-low dark:bg-surface-container-high text-on-surface dark:text-muted-foreground';
    }
  };

  return (
    <div className="bg-white dark:bg-surface-container-high rounded-lg shadow dark:shadow-gray-900 border border-border dark:border-border overflow-hidden transition-colors">
      <div className="p-4 border-b border-border dark:border-border">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-foreground dark:text-foreground">{currentProject.name}</h2>
          <div className="flex items-center gap-2">
            
            <button
              className="p-2 text-muted-foreground dark:text-muted-foreground hover:text-on-surface dark:hover:text-muted-foreground rounded-lg hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors"
              title="Project Settings"
              onClick={() => setIsProjectModalOpen(true)}
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground dark:text-muted-foreground mt-1">
          {agents.filter((a) => a.status === 'active').length} of {agents.length} AI agents active
        </p>
      </div>

      <div className="p-4">
        <div className="space-y-3">
          {agents.map((agent) => (
            <div
              key={agent.id}
              onClick={() => onToggleAgentSelection(agent.id)}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                selectedAgents.includes(agent.id)
                  ? 'border-primary-green dark:border-green-500 bg-indigo-50 dark:bg-green-900/20'
                  : 'border-border dark:border-border hover:border-border dark:hover:border-outline hover:bg-surface-container-low dark:hover:bg-surface-container-highest/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{agent.avatar}</span>
                  <div>
                    <h3 className="font-medium text-foreground dark:text-foreground">{agent.name}</h3>
                    <p className="text-xs text-muted-foreground dark:text-muted-foreground">{agent.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAgentStatusColor(agent.status)}`}>
                    {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="mt-2 flex flex-wrap gap-1">
                {agent.capabilities.slice(0, 2).map((capability) => (
                  <span key={capability} className="px-2 py-1 bg-surface-container-low dark:bg-surface-container-highest text-muted-foreground dark:text-muted-foreground text-xs rounded-full">
                    {capability}
                  </span>
                ))}
                {agent.capabilities.length > 2 && (
                  <span className="px-2 py-1 bg-surface-container-low dark:bg-surface-container-highest text-muted-foreground dark:text-muted-foreground text-xs rounded-full">
                    +{agent.capabilities.length - 2}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border dark:border-border">
          <button
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-indigo-100 dark:bg-green-900/30 text-indigo-700 dark:text-green-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-green-900/50 transition-colors"
            onClick={onManageAgents}
          >
            <Settings className="w-4 h-4" />
            <span>Manage Agents</span>
          </button>
        </div>
      </div>

      {/* Project Management Modal */}
      <ProjectManagementModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        currentProject={projectConfiguration}
        onProjectUpdate={handleProjectUpdate}
      />
    </div>
  );
};

export default AgentPanel;
