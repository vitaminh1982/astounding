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

export interface Message {
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
  feedback?: {
    type: 'positive' | 'negative';
    comment?: string;
    timestamp: string;
  };
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
      content: `Welcome to your AI Project Workspace! 🚀\n\nYour specialized team of 5 AI agents is ready to assist:\n• Seiya (PM) - Project management & timelines\n• Ikki (BA) - Requirements & user stories\n• Shiryu (DA) - Data analysis & insights\n• Hyôga (SC) - Strategy & market analysis\n• Shun (PMO) - Governance & compliance\n\nUse @mentions to direct questions to specific agents, or ask general questions for collaborative responses.`,
      sender: 'agent',
      agentId: 'collaborative',
      timestamp: new Date(),
      visibility: 'project',
      canConvertToTask: false,
      canConvertToDocument: false,
    },
  ]);

  // Simulate agent-specific response with personality
  const createAgentResponse = useCallback((agent: Agent, query: string): Message => {
    const roleResponses: Record<string, string[]> = {
      'Project Manager': [
        'From a project management perspective, I recommend focusing on the next milestone. Let me break down the timeline for you.',
        'I can update the project schedule and create actionable tasks if you confirm the approach.',
        'Based on current velocity, we should adjust our sprint goals. I\'ll create a revised timeline.',
        'I\'ve identified 3 critical path items that need attention. Shall I prioritize them?',
      ],
      'Business Analyst': [
        'I\'ve captured this requirement. Let me translate it into structured user stories with acceptance criteria.',
        'From a business perspective, this aligns with our value proposition. Here\'s how we can document it:',
        'Suggested acceptance criteria: [Given-When-Then format]. Should I create the full specification?',
        'This requirement impacts 3 existing features. I recommend a dependency analysis before proceeding.',
      ],
      'Data Analyst': [
        'I can run a quick aggregation on the provided dataset and return actionable insights.',
        'Preliminary analysis shows: the KPI increased by 12% month-over-month. Let me create a detailed report.',
        'I\'ve identified 3 data patterns that warrant investigation. Shall I deep-dive into each?',
        'Based on historical trends, I project a 15% improvement if we implement this change. Here\'s the data:',
      ],
      'Strategy Consultant': [
        'Market trend analysis indicates a significant shift towards digital transformation in this sector.',
        'From a strategic standpoint, I recommend pursuing a pilot program in this segment first.',
        'Competitive landscape assessment: 2 key players are vulnerable. Here\'s our opportunity window.',
        'Long-term strategic option: This positions us for market leadership within 18-24 months.',
      ],
      'PMO Analyst': [
        'Governance check complete: Resource allocation variance is 8% vs baseline - within tolerance.',
        'I can generate a comprehensive PMO report covering budget, timeline, and risk metrics.',
        'Portfolio health assessment: This project is tracking green on all governance indicators.',
        'Compliance review: All deliverables meet our quality gates. Documentation is audit-ready.',
      ],
    };

    const responses = roleResponses[agent.role] || ["I'll help you with that request. Let me analyze this for you."];
    const selectedResponse = responses[Math.floor(Math.random() * responses.length)];

    // Add contextual information based on query
    const contextualAdditions = [];
    if (query) {
      const lowerQuery = query.toLowerCase();
      if (lowerQuery.includes('timeline') || lowerQuery.includes('schedule')) {
        contextualAdditions.push('⏰ Timeline consideration noted');
      }
      if (lowerQuery.includes('budget') || lowerQuery.includes('cost')) {
        contextualAdditions.push('💰 Budget impact will be assessed');
      }
      if (lowerQuery.includes('risk')) {
        contextualAdditions.push('⚠️ Risk analysis included');
      }
    }

    const fullResponse = contextualAdditions.length > 0
      ? `${selectedResponse}\n\n${contextualAdditions.join(' • ')}`
      : selectedResponse;

    return {
      id: `msg-${Date.now()}-${agent.id}`,
      content: `**${agent.name} (${agent.role})**: ${fullResponse}`,
      sender: 'agent',
      agentId: agent.id,
      timestamp: new Date(),
      visibility: 'project',
      mentions: [],
      canConvertToTask: agent.role === 'Project Manager',
      canConvertToDocument: agent.role === 'Business Analyst' || agent.role === 'Data Analyst',
    };
  }, []); // ✅ No dependencies needed - uses only parameters

  // Generate collaborative response from multiple agents
  const generateCollaborativeResponse = useCallback((query: string): Message => {
    const collaborativeResponses = [
      "Based on our collective analysis across PM, BA, and Strategy perspectives, here's our recommended approach:",
      "Our integrated team assessment suggests a phased implementation strategy:",
      "From project, data, and governance viewpoints, we align on these key priorities:",
      "Cross-functional analysis complete. Here's what each discipline recommends:",
    ];

    const insights = [
      "\n\n📊 **Data**: Metrics support this direction with 94% confidence",
      "\n🎯 **Strategy**: Aligns with Q2 objectives and market positioning",
      "\n📋 **Governance**: Meets all compliance requirements",
      "\n⏱️ **Timeline**: Achievable within current sprint capacity",
    ];

    const selectedResponse = collaborativeResponses[Math.floor(Math.random() * collaborativeResponses.length)];
    const selectedInsights = insights.slice(0, 2 + Math.floor(Math.random() * 2)).join('');

    return {
      id: `msg-${Date.now()}`,
      content: `${selectedResponse}${selectedInsights}`,
      sender: 'agent',
      agentId: 'collaborative',
      timestamp: new Date(),
      visibility: 'project',
      mentions: [],
      canConvertToTask: true,
      canConvertToDocument: true,
    };
  }, []); // ✅ No dependencies needed

  // Extract @mentions from message - moved AFTER createAgentResponse
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
  }, [agents]); // ✅ Only depends on agents

  // Send message handler with enhanced logic
  const handleSendMessage = useCallback((
    newMessage: string,
    selectedAgents: string[],
    visibility: 'project' | 'team' | 'private',
    attachments: Attachment[]
  ) => {
    if (!newMessage) return;
    const trimmed = newMessage.trim();
    if (!trimmed && attachments.length === 0) return;

    const mentions = extractMentions(trimmed);

    // Create user message
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

    // Determine which agents should respond
    const targetAgentIds = selectedAgents.length > 0 
      ? selectedAgents 
      : mentions.length > 0 
        ? mentions 
        : agents.map((a) => a.id);

    // Mark selected agents as thinking
    setAgents((prev) =>
      prev.map((a) => (targetAgentIds.includes(a.id) ? { ...a, status: 'thinking' as const } : a)),
    );

    // Simulate agent response delay (realistic thinking time)
    const responseDelay = 600 + Math.random() * 400; // 600-1000ms

    setTimeout(() => {
      let responses: Message[];

      if (selectedAgents.length === 0 && mentions.length === 0) {
        // Collaborative response when no specific agents selected
        responses = [generateCollaborativeResponse(trimmed)];
      } else {
        // Individual agent responses
        responses = targetAgentIds
          .map((id) => agents.find((a) => a.id === id))
          .filter((agent): agent is Agent => agent !== undefined)
          .map((agent) => createAgentResponse(agent, trimmed));
      }

      setMessages((prev) => [...prev, ...responses]);
      
      // Update agent statuses back to active
      setAgents((prev) =>
        prev.map((a) => (targetAgentIds.includes(a.id) ? { ...a, status: 'active' as const, lastActivity: 'just now' } : a)),
      );

      // Update metrics
      setMetrics((m) => ({
        ...m,
        totalQueries: m.totalQueries + 1,
        activeAgents: agents.filter((a) => a.status === 'active').length,
      }));
    }, responseDelay);
  }, [agents, extractMentions, createAgentResponse, generateCollaborativeResponse]); // ✅ All dependencies included

  // Handle project switching with context preservation
  const handleProjectSwitch = useCallback((newProject: Project) => {
    setCurrentProject(newProject);
    
    const welcomeMessage: Message = {
      id: `sys-${Date.now()}`,
      content: `Switched to project: ${newProject.name} 🔄\n\nClient: ${newProject.client.name}\nStatus: ${newProject.status}\nProgress: ${newProject.progress}%\nBudget: ${newProject.budget}\nTeam Size: ${newProject.teamSize}\n\nYour AI team is now ready to assist with this project. How can we help you today?`,
      sender: 'agent',
      agentId: 'collaborative',
      timestamp: new Date(),
      visibility: 'project',
      canConvertToTask: false,
      canConvertToDocument: false,
    };
    
    setMessages([welcomeMessage]);
    
    toast(`Switched to: ${newProject.name}`, {
      icon: '🔄',
      duration: 3000,
    });
  }, []); // ✅ No dependencies needed

  // Handle agent selection update with validation
  const handleAgentsUpdate = useCallback((newAgentIds: string[]) => {
    const updatedAgents = initialAgents.filter(agent => newAgentIds.includes(agent.id));
    
    if (updatedAgents.length === 0) {
      toast.error('At least one agent must be selected');
      return;
    }

    setAgents(updatedAgents);
    
    setMetrics(prev => ({
      ...prev,
      activeAgents: updatedAgents.filter(a => a.status === 'active').length
    }));
    
    const agentNames = updatedAgents.map(agent => `${agent.avatar} ${agent.name} (${agent.role})`).join('\n• ');
    const systemMessage: Message = {
      id: `sys-${Date.now()}`,
      content: `Agent team updated! 🤖\n\nActive agents:\n• ${agentNames}\n\nYour ${updatedAgents.length}-agent team is ready to assist with ${currentProject.name}.`,
      sender: 'agent',
      agentId: 'system',
      timestamp: new Date(),
      visibility: 'project',
      canConvertToTask: false,
      canConvertToDocument: false,
    };
    
    setMessages(prev => [...prev, systemMessage]);
    
    toast.success(`Team updated: ${updatedAgents.length} agents active`, {
      duration: 3000,
    });
  }, [currentProject.name, initialAgents]); // ✅ All dependencies included

  // Expose setMessages for external updates (e.g., feedback)
  const updateMessages = useCallback((updater: Message[] | ((prev: Message[]) => Message[])) => {
    setMessages(updater);
  }, []);

  return {
    currentProject,
    agents,
    metrics,
    messages,
    setMessages: updateMessages,
    handleSendMessage,
    handleProjectSwitch,
    handleAgentsUpdate
  };
};


//