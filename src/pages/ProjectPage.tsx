import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import ProjectHeader from '../components/projects/ProjectHeader';
import AgentPanel from '../components/projects/AgentPanel';
import ChatInterface from '../components/projects/ChatInterface';
import ConvertMessageModal from '../components/projects/ConvertMessageModal';
import ProjectSwitchModal, { Project } from '../components/projects/ProjectSwitchModal';
import AgentSelectionModal, { ProjectContext } from '../components/projects/AgentSelectionModal';
import { ProjectConfiguration } from '../components/projects/ProjectManagementModal';
import { useProjectLogic } from '../hooks/useProjectLogic';

// ============================================================================
// TYPES
// ============================================================================

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

// ============================================================================
// CONSTANTS
// ============================================================================

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

// File upload constraints
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_ATTACHMENTS = 10;
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
  'text/plain',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp'
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const generateUniqueId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
};

const validateFile = (file: File): { valid: boolean; error?: string } => {
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File "${file.name}" exceeds ${formatFileSize(MAX_FILE_SIZE)} limit`
    };
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type) && file.type !== '') {
    return {
      valid: false,
      error: `File type "${file.type}" is not supported`
    };
  }

  return { valid: true };
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ProjectPage(): JSX.Element {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Use custom hook for project logic
  const {
    currentProject,
    agents,
    metrics,
    messages,
    setMessages,
    handleSendMessage,
    handleProjectSwitch,
    handleAgentsUpdate
  } = useProjectLogic(CURRENT_PROJECT, PROJECT_AGENTS, INITIAL_METRICS);

  // ============================================================================
  // LOCAL STATE
  // ============================================================================

  // Modal states
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState<{
    type: 'task' | 'document';
    messageId: string;
  } | null>(null);

  // Chat interface states
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [activeTab, setActiveTab] = useState<'chat' | 'documents'>('chat');
  const [visibility, setVisibility] = useState<'project' | 'team' | 'private'>('project');

  // Agent selection state (single source of truth)
  const [selectedAgents, setSelectedAgents] = useState<string[]>(() => 
    agents.map(agent => agent.id)
  );

  // Sync selectedAgents when agents change (e.g., after project switch)
  useEffect(() => {
    setSelectedAgents(prev => {
      // Keep only agent IDs that still exist
      const validIds = prev.filter(id => agents.some(agent => agent.id === id));
      // If all agents were removed, select all new agents
      if (validIds.length === 0) {
        return agents.map(agent => agent.id);
      }
      return validIds;
    });
  }, [agents]);

  // ============================================================================
  // EVENT HANDLERS - AGENT MANAGEMENT
  // ============================================================================

  const toggleAgentSelection = (agentId: string): void => {
    setSelectedAgents((prev) => {
      if (prev.includes(agentId)) {
        // Don't allow deselecting all agents
        if (prev.length === 1) {
          toast.error('At least one agent must be selected');
          return prev;
        }
        return prev.filter((id) => id !== agentId);
      }
      return [...prev, agentId];
    });
  };

  const handleAgentModalUpdate = (updatedAgentIds: string[]): void => {
    if (updatedAgentIds.length === 0) {
      toast.error('At least one agent must be selected');
      return;
    }
    
    handleAgentsUpdate(updatedAgentIds);
    setSelectedAgents(updatedAgentIds);
    
    const selectedAgentNames = agents
      .filter(agent => updatedAgentIds.includes(agent.id))
      .map(agent => agent.name)
      .join(', ');
    
    toast.success(`Active agents updated: ${selectedAgentNames}`);
  };

  // ============================================================================
  // EVENT HANDLERS - FILE MANAGEMENT
  // ============================================================================

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) return;

    // Check total attachment limit
    if (attachments.length + files.length > MAX_ATTACHMENTS) {
      toast.error(`Maximum ${MAX_ATTACHMENTS} attachments allowed`);
      return;
    }

    // Validate each file
    const validFiles: File[] = [];
    const errors: string[] = [];

    files.forEach(file => {
      const validation = validateFile(file);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        errors.push(validation.error!);
      }
    });

    // Show errors if any
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error, { duration: 4000 }));
    }

    // Add valid files
    if (validFiles.length > 0) {
      const newAttachments: Attachment[] = validFiles.map((file) => ({
        id: generateUniqueId('att'),
        name: file.name,
        type: file.type,
        size: file.size,
      }));

      setAttachments((prev) => [...prev, ...newAttachments]);
      
      const message = validFiles.length === 1
        ? `File "${validFiles[0].name}" attached`
        : `${validFiles.length} files attached`;
      
      toast.success(message);
    }

    // Reset input
    event.target.value = '';
  };

  const removeAttachment = (attachmentId: string): void => {
    setAttachments((prev) => {
      const attachment = prev.find(att => att.id === attachmentId);
      if (attachment) {
        toast.success(`Removed "${attachment.name}"`);
      }
      return prev.filter((att) => att.id !== attachmentId);
    });
  };

  // ============================================================================
  // EVENT HANDLERS - MESSAGE MANAGEMENT
  // ============================================================================

  const onSendMessage = (): void => {
    const trimmedMessage = newMessage.trim();

    // Validation
    if (!trimmedMessage && attachments.length === 0) {
      toast.error('Please enter a message or attach a file');
      return;
    }

    if (selectedAgents.length === 0) {
      toast.error('Please select at least one agent');
      return;
    }

    try {
      // Send message through hook
      handleSendMessage(trimmedMessage, selectedAgents, visibility, attachments);

      // Clear input and attachments
      setNewMessage('');
      setAttachments([]);

      // Success feedback
      const agentCount = selectedAgents.length;
      const agentText = agentCount === 1 
        ? agents.find(a => a.id === selectedAgents[0])?.name || 'agent'
        : `${agentCount} agents`;
      
      toast.success(`Message sent to ${agentText}`);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    }
  };

  const handleConvertMessage = (messageId: string, type: 'task' | 'document'): void => {
    setShowConvertModal({ type, messageId });
  };

  const confirmConvert = (): void => {
    if (!showConvertModal) return;

    const { type, messageId } = showConvertModal;
    const message = messages.find(m => m.id === messageId);
    
    if (message) {
      const typeText = type === 'task' ? 'Task' : 'Document';
      const preview = message.content.length > 50 
        ? message.content.substring(0, 50) + '...'
        : message.content;
      
      toast.success(
        `${typeText} created: "${preview}"`,
        { duration: 4000 }
      );
    }

    setShowConvertModal(null);
  };

  // ============================================================================
  // EVENT HANDLERS - FEEDBACK
  // ============================================================================

  const handleFeedback = async (
    messageId: string,
    feedback: 'positive' | 'negative',
    comment?: string
  ): Promise<void> => {
    try {
      // Find message and related data
      const messageIndex = messages.findIndex(m => m.id === messageId);
      const message = messages[messageIndex];
      
      if (!message) {
        throw new Error('Message not found');
      }

      const agent = agents.find(a => a.id === message.agentId);
      const agentName = agent?.name || 'Unknown Agent';

      // Build conversation context
      const conversationContext = messageIndex > 0
        ? messages.slice(Math.max(0, messageIndex - 5), messageIndex).map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.content,
            agentId: m.agentId,
            timestamp: m.timestamp
          }))
        : [];

      // Submit feedback to API
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageId,
          feedback,
          comment,
          timestamp: new Date().toISOString(),
          projectId: currentProject.id,
          agentId: message.agentId,
          conversationContext,
          metadata: {
            selectedAgents,
            visibility,
            projectName: currentProject.name,
            agentRole: agent?.role
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to submit feedback');
      }

      await response.json();

      // Show success feedback
      const icon = feedback === 'positive' ? '👍' : '📝';
      const successMessage = feedback === 'positive'
        ? comment
          ? `Thanks for the detailed feedback on ${agentName}'s response!`
          : `Feedback recorded! ${agentName} will continue to improve.`
        : comment
          ? `Thanks for helping ${agentName} improve!`
          : `Feedback noted. ${agentName} will learn from this.`;

      toast.success(successMessage, { duration: 3000, icon });

    } catch (error) {
      console.error('Error submitting feedback:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to submit feedback';
      toast.error(errorMessage);
      throw error;
    }
  };

  // ============================================================================
  // EVENT HANDLERS - PROJECT MANAGEMENT
  // ============================================================================

  const handleProjectConfigUpdate = (updatedProject: ProjectConfiguration): void => {
    try {
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
    } catch (error) {
      console.error('Error updating project configuration:', error);
      toast.error('Failed to update project configuration');
    }
  };

  const handleProjectSwitchWrapper = (project: Project): void => {
    try {
      handleProjectSwitch(project);
      setIsProjectModalOpen(false);
      toast.success(`Switched to ${project.name}`);
    } catch (error) {
      console.error('Error switching project:', error);
      toast.error('Failed to switch project');
    }
  };

  // ============================================================================
  // DERIVED DATA
  // ============================================================================

  const projectContext: ProjectContext = {
    id: currentProject.id,
    name: currentProject.name,
    client: currentProject.client
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section */}
        <ProjectHeader
          currentProject={currentProject}
          metrics={metrics}
          onSwitchProject={() => setIsProjectModalOpen(true)}
        />

        {/* Main Layout */}
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
              setMessages={setMessages}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              attachments={attachments}
              onSendMessage={onSendMessage}
              onFileUpload={handleFileUpload}
              onRemoveAttachment={removeAttachment}
              onConvertMessage={handleConvertMessage}
              onFeedback={handleFeedback}
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
          onProjectSelect={handleProjectSwitchWrapper}
        />

        <AgentSelectionModal
          isOpen={isAgentModalOpen}
          onClose={() => setIsAgentModalOpen(false)}
          currentProject={projectContext}
          selectedAgentIds={selectedAgents}
          onAgentsUpdate={handleAgentModalUpdate}
          maxAgents={5}
        />
      </div>
    </div>
  );
}
