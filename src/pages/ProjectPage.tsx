import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import ProjectHeader from '../components/projects/ProjectHeader';
import AgentPanel from '../components/projects/AgentPanel';
import ChatInterface from '../components/projects/ChatInterface';
import ConvertMessageModal from '../components/projects/ConvertMessageModal';
import ProjectSwitchModal, { Project } from '../components/projects/ProjectSwitchModal';
import AgentSelectionModal, { ProjectContext } from '../components/projects/AgentSelectionModal';
import { ProjectConfiguration } from '../components/projects/ProjectManagementModal';
import { useProjectLogic } from '../hooks/useProjectLogic';

// Types
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

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
}

interface ProjectMetrics {
  activeAgents: number;
  totalQueries: number;
  successRate: number;
  avgResponseTime: string;
  tasksGenerated: number;
  documentsCreated: number;
}

// Initial data
const CURRENT_PROJECT: Project = {
  id: 'proj-001',
  name: 'Project Athena',
  client: {
    name: 'Graude Corporation',
    industry: 'Technology'
  },
  status: 'active',
  progress: 65,
  startDate: '2025-01-15',
  endDate: '2025-06-30',
  teamSize: 8,
  description: 'Comprehensive digital transformation strategy and implementation',
  priority: 'high',
  budget: '€450,000',
  lastActivity: '2 hours ago'
};

const PROJECT_AGENTS: Agent[] = [
  {
    id: 'pm-001',
    name: 'Seiya',
    role: 'Project Manager',
    status: 'active',
    avatar: '🧭',
    description: 'Timeline, milestones, task orchestration',
    capabilities: ['Timeline Management', 'Task Assignment', 'Status Summaries'],
    lastActivity: '2 minutes ago',
    responseTime: '1.0s',
    successRate: 96.2,
    isConfigurable: true,
  },
  {
    id: 'ba-001',
    name: 'Ikki',
    role: 'Business Analyst',
    status: 'active',
    avatar: '📝',
    description: 'Requirements, user stories, acceptance criteria',
    capabilities: ['Requirement Capture', 'User Stories', 'Acceptance Criteria'],
    lastActivity: '10 minutes ago',
    responseTime: '1.8s',
    successRate: 92.5,
    isConfigurable: true,
  },
  {
    id: 'da-001',
    name: 'Shiryu',
    role: 'Data Analyst',
    status: 'active',
    avatar: '📊',
    description: 'Data ingestion, analysis, KPIs and visuals',
    capabilities: ['CSV Ingestion', 'Aggregation', 'Charts & Tables'],
    lastActivity: 'just now',
    responseTime: '0.9s',
    successRate: 93.7,
    isConfigurable: true,
  },
  {
    id: 'sc-001',
    name: 'Hyôga',
    role: 'Strategy Consultant',
    status: 'active',
    avatar: '🎯',
    description: 'Market analysis, strategic recommendations',
    capabilities: ['Market Research', 'Competitive Analysis', 'Strategy'],
    lastActivity: '8 minutes ago',
    responseTime: '1.5s',
    successRate: 91.3,
    isConfigurable: true,
  },
  {
    id: 'pmo-001',
    name: 'Shun',
    role: 'PMO Analyst',
    status: 'active',
    avatar: '📋',
    description: 'Governance, resource monitoring, reporting',
    capabilities: ['Governance', 'Resource Monitoring', 'Reporting'],
    lastActivity: '1 minute ago',
    responseTime: '1.1s',
    successRate: 95.7,
    isConfigurable: true,
  },
];

const INITIAL_METRICS: ProjectMetrics = {
  activeAgents: PROJECT_AGENTS.filter((a) => a.status === 'active').length,
  totalQueries: 1247,
  successRate: 94.2,
  avgResponseTime: '1.5s',
  tasksGenerated: 89,
  documentsCreated: 34,
};

export default function ProjectPage(): JSX.Element {
  // Use custom hook for project logic
  const {
    currentProject,
    agents,
    metrics,
    messages,
    handleSendMessage,
    handleProjectSwitch,
    handleAgentsUpdate
  } = useProjectLogic(CURRENT_PROJECT, PROJECT_AGENTS, INITIAL_METRICS);

  // Local state for UI
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'chat' | 'documents'>('chat');
  const [visibility, setVisibility] = useState<'project' | 'team' | 'private'>('project');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>(
    PROJECT_AGENTS.map(agent => agent.id)
  );
  const [showConvertModal, setShowConvertModal] = useState<{ type: 'task' | 'document'; messageId: string } | null>(null);

  // Toggle agent selection
  const toggleAgentSelection = (agentId: string) => {
    setSelectedAgents((prev) => {
      if (prev.includes(agentId)) return prev.filter((id) => id !== agentId);
      return [...prev, agentId];
    });
  };

  // File handling
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;
    
    const newAttachments: Attachment[] = files.map((file) => ({
      id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      name: file.name,
      type: file.type,
      size: file.size,
    }));

    setAttachments((prev) => [...prev, ...newAttachments]);
    toast.success(`${files.length} file(s) attached`);
  };

  const removeAttachment = (attachmentId: string) => {
    setAttachments((prev) => prev.filter((att) => att.id !== attachmentId));
  };

  // Send message wrapper
  const onSendMessage = () => {
    handleSendMessage(newMessage, selectedAgents, visibility, attachments);
    setNewMessage('');
    setAttachments([]);
  };

  // Convert message handlers
  const handleConvertMessage = (messageId: string, type: 'task' | 'document') => {
    setShowConvertModal({ type, messageId });
  };

  const confirmConvert = () => {
    if (!showConvertModal) return;
    toast.success(`${showConvertModal.type === 'task' ? 'Task' : 'Document'} created (demo)`);
    setShowConvertModal(null);
  };

  // Handle project configuration update
  const handleProjectConfigUpdate = (updatedProject: ProjectConfiguration) => {
    // Update the current project with new configuration
    const updatedCurrentProject: Project = {
      ...currentProject,
      name: updatedProject.name,
      description: updatedProject.description,
      budget: updatedProject.budget,
      priority: updatedProject.priority,
      startDate: updatedProject.startDate,
      endDate: updatedProject.endDate
    };
    
    handleProjectSwitch(updatedCurrentProject);
    toast.success('Project configuration updated successfully');
  };

  // Utility functions
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Create project context for agent filtering
  const projectContext: ProjectContext = {
    id: currentProject.id,
    name: currentProject.name,
    client: currentProject.client
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ProjectHeader
          currentProject={currentProject}
          metrics={metrics}
          onSwitchProject={() => setIsProjectModalOpen(true)}
        />

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Agent Management */}
          <div className="lg:col-span-3">
            <AgentPanel
              currentProject={currentProject}
              agents={agents}
              selectedAgents={selectedAgents}
              onToggleAgentSelection={toggleAgentSelection}
              onManageAgents={() => setIsAgentModalOpen(true)}
              onProjectUpdate={handleProjectConfigUpdate}
            />
          </div>

          {/* Center Panel - AI Collaboration Area */}
          <div className="lg:col-span-9">
            <ChatInterface
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              selectedAgents={selectedAgents}
              agents={agents}
              visibility={visibility}
              setVisibility={setVisibility}
              messages={messages}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              attachments={attachments}
              onSendMessage={onSendMessage}
              onFileUpload={handleFileUpload}
              onRemoveAttachment={removeAttachment}
              onConvertMessage={handleConvertMessage}
              formatFileSize={formatFileSize}
            />
          </div>
        </div>

        {/* Modals */}
        <ConvertMessageModal
          isOpen={!!showConvertModal}
          type={showConvertModal?.type || 'task'}
          onClose={() => setShowConvertModal(null)}
          onConfirm={confirmConvert}
        />

        <ProjectSwitchModal
          isOpen={isProjectModalOpen}
          onClose={() => setIsProjectModalOpen(false)}
          currentProjectId={currentProject.id}
          onProjectSelect={handleProjectSwitch}
        />

        <AgentSelectionModal
          isOpen={isAgentModalOpen}
          onClose={() => setIsAgentModalOpen(false)}
          currentProject={projectContext}
          selectedAgentIds={selectedAgentIds}
          onAgentsUpdate={handleAgentsUpdate}
          maxAgents={5}
        />
      </div>
    </div>
  );
}