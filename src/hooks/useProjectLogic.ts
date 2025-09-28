import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { Project } from '../components/projects/ProjectSwitchModal';

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

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  agentId?: string;
  timestamp: Date;
  mentions?: string[];
  attachments?: Attachment[];
  visibility: 'project' | 'team' | 'private';
  canConvertToTask?: boolean;
  canConvertToDocument?: boolean;
}

interface ProjectMetrics {
  activeAgents: number;
  totalQueries: number;
  successRate: number;
  avgResponseTime: string;
  tasksGenerated: number;
  documentsCreated: number;
}

export const useProjectLogic = (
  initialProject: Project,
  initialAgents: Agent[],
  initialMetrics: ProjectMetrics
) => {
  const [currentProject, setCurrentProject] = useState<Project>(initialProject);
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [metrics, setMetrics] = useState<ProjectMetrics>(initialMetrics);
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: `sys-${Date.now()}`,
      content: `Welcome to your AI Project Workspace! 🚀\n\nProject: ${initialProject.name}\nClient: ${initialProject.client.name}\n\nYour specialized team of 5 AI agents is ready to assist:\n• Alex (PM) - Project management & timelines\n• Sarah (BA) - Requirements & user stories\n• Marcus (DA) - Data analysis & insights\n• Diana (SC) - Strategy & market analysis\n• Robert (PMO) - Governance & compliance\n\nUse @mentions to direct questions to specific agents, or ask general questions for collaborative responses.`,
      sender: 'agent',
      agentId: 'collaborative',
      timestamp: new Date(),
      visibility: 'project',
      canConvertToTask: false,
      canConvertToDocument: false,
    },
  ]);

  // Extract @mentions from message
  const extractMentions = useCallback((content: string): string[] => {
    const mentionRegex = /@(\w+)/g;
    const mentions: string[] = [];
    let match: RegExpExecArray | null;

    while ((match = mentionRegex.exec(content)) !== null) {
      const mentionedName = match[1].toLowerCase();
      const agent = agents.find((a) => a.name.toLowerCase() === mentionedName);
      if (agent) {
        mentions.push(agent.id);
      }
    }

    return mentions;
  }, [agents]);

  // Simulate agent-specific response
  const createAgentResponse = useCallback((agent: Agent, query: string): Message => {
    const roleResponses: Record<string, string[]> = {
      'Project Manager': [
        'From a project management perspective, I recommend focusing on the next milestone.',
        'I can update the timeline and create tasks if you confirm.',
      ],
      'Business Analyst': [
        'I captured the requirement: we should translate this into user stories.',
        'Suggested acceptance criteria: ...',
      ],
      'Data Analyst': [
        'I can run a quick aggregation on the provided dataset and return a summary.',
        'Preliminary insight: the KPI increased by 12% month-over-month.',
      ],
      'Strategy Consultant': [
        'Market trend indicates a shift towards ...',
        'Recommended strategic option: pursue a pilot in this segment.',
      ],
      'PMO Analyst': [
        'Governance check: resource allocation variance is 8% vs baseline.',
        'I can create a PMO report and share it.',
      ],
    };

    const responses = roleResponses[agent.role] || ["I'll help you with that request."];
    const content = `${responses[Math.floor(Math.random() * responses.length)]}`;

    return {
      id: `msg-${Date.now()}-${agent.id}`,
      content: `**${agent.name} (${agent.role})**: ${content}`,
      sender: 'agent',
      agentId: agent.id,
      timestamp: new Date(),
      visibility: 'project',
      mentions: [],
      canConvertToTask: true,
      canConvertToDocument: true,
    };
  }, []);

  // Generate collaborative response
  const generateCollaborativeResponse = useCallback((query: string): Message => {
    const responses = [
      "Based on our collective analysis, here's what we recommend...",
      "From a project management perspective, we should prioritize the next milestone.",
      "The data suggests we need to focus on the top 3 drivers.",
      "Our strategic assessment indicates opportunity in the new segment.",
    ];

    return {
      id: `msg-${Date.now()}`,
      content: responses[Math.floor(Math.random() * responses.length)],
      sender: 'agent',
      agentId: 'collaborative',
      timestamp: new Date(),
      visibility: 'project',
      mentions: [],
      canConvertToTask: true,
      canConvertToDocument: true,
    };
  }, []);

  // Send message handler
  const handleSendMessage = useCallback((
    newMessage: string,
    selectedAgents: string[],
    visibility: 'project' | 'team' | 'private',
    attachments: Attachment[]
  ) => {
    const trimmed = newMessage.trim();
    if (!trimmed && attachments.length === 0) return;

    const mentions = extractMentions(trimmed);

    const userMsg: Message = {
      id: `msg-${Date.now()}-user`,
      content: trimmed,
      sender: 'user',
      timestamp: new Date(),
      mentions,
      attachments: attachments.length ? attachments : undefined,
      visibility,
      canConvertToTask: false,
      canConvertToDocument: false,
    };

    setMessages((prev) => [...prev, userMsg]);

    // Simulate agent responses
    const targetAgentIds = selectedAgents.length > 0 ? selectedAgents : agents.map((a) => a.id);

    // Mark selected agents as thinking
    setAgents((prev) =>
      prev.map((a) => (targetAgentIds.includes(a.id) ? { ...a, status: 'thinking' } : a)),
    );

    setTimeout(() => {
      const responses: Message[] =
        selectedAgents.length === 0
          ? [generateCollaborativeResponse(trimmed)]
          : targetAgentIds
              .map((id) => agents.find((a) => a.id === id))
              .filter(Boolean)
              .map((a) => createAgentResponse(a as Agent, trimmed));

      setMessages((prev) => [...prev, ...responses]);
      setAgents((prev) =>
        prev.map((a) => (targetAgentIds.includes(a.id) ? { ...a, status: 'active' } : a)),
      );

      // Update metrics
      setMetrics((m) => ({
        ...m,
        totalQueries: m.totalQueries + 1,
        activeAgents: agents.filter((a) => a.status === 'active').length,
      }));
    }, 800);
  }, [agents, extractMentions, createAgentResponse, generateCollaborativeResponse]);

  // Handle project switching
  const handleProjectSwitch = useCallback((newProject: Project) => {
    setCurrentProject(newProject);
    
    const welcomeMessage = {
      id: `sys-${Date.now()}`,
      content: `Switched to project: ${newProject.name} 🔄\n\nClient: ${newProject.client.name}\nStatus: ${newProject.status}\nProgress: ${newProject.progress}%\n\nYour AI team is now ready to assist with this project. How can we help you today?`,
      sender: 'agent',
      agentId: 'collaborative',
      timestamp: new Date(),
      visibility: 'project',
      canConvertToTask: false,
      canConvertToDocument: false,
    };
    
    setMessages([welcomeMessage]);
    
    toast(`Switched to project: ${newProject.name}`, {
      icon: '🔄'
    });
  }, []);

  // Handle agent selection update
  const handleAgentsUpdate = useCallback((newAgentIds: string[]) => {
    const updatedAgents = initialAgents.filter(agent => newAgentIds.includes(agent.id));
    setAgents(updatedAgents);
    
    setMetrics(prev => ({
      ...prev,
      activeAgents: updatedAgents.filter(a => a.status === 'active').length
    }));
    
    const agentNames = updatedAgents.map(agent => `${agent.name} (${agent.role})`).join(', ');
    const systemMessage: Message = {
      id: `sys-${Date.now()}`,
      content: `Agent team updated! 🤖\n\nActive agents: ${agentNames}\n\nYour new AI team is ready to assist with ${currentProject.name}.`,
      sender: 'agent',
      agentId: 'system',
      timestamp: new Date(),
      visibility: 'project',
      canConvertToTask: false,
      canConvertToDocument: false,
    };
    
    setMessages(prev => [...prev, systemMessage]);
  }, [currentProject.name, initialAgents]);

  return {
    currentProject,
    agents,
    metrics,
    messages,
    setMessages,
    handleSendMessage,
    handleProjectSwitch,
    handleAgentsUpdate
  };
};