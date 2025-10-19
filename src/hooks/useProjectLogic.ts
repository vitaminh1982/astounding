/**
 * Custom hook for project-level logic with AI agents - Enhanced Version
 */
import { useState, useCallback, useMemo, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { Project } from '../components/projects/ProjectSwitchModal';

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

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent' | 'system';
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
  isStreaming?: boolean;
  error?: string;
}

interface ProjectMetrics {
  activeAgents: number;
  totalQueries: number;
  successRate: number;
  avgResponseTime: string;
  tasksGenerated: number;
  documentsCreated: number;
}

interface UseProjectLogicProps {
  initialProject: Project;
  initialAgents: Agent[];
  initialMetrics: ProjectMetrics;
  onError?: (error: Error) => void;
}

interface UseProjectLogicReturn {
  // State
  currentProject: Project;
  agents: Agent[];
  metrics: ProjectMetrics;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setMessages: (updater: Message[] | ((prev: Message[]) => Message[])) => void;
  handleSendMessage: (
    newMessage: string,
    selectedAgents: string[],
    visibility: 'project' | 'team' | 'private',
    attachments: Attachment[]
  ) => Promise<void>;
  handleProjectSwitch: (newProject: Project) => void;
  handleAgentsUpdate: (newAgentIds: string[]) => void;
  handleFeedback: (messageId: string, feedback: 'positive' | 'negative', comment?: string) => Promise<void>;
  handleMessageDelete: (messageId: string) => void;
  clearMessages: () => void;
  retryMessage: (messageId: string) => Promise<void>;
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Role-specific response templates - memoized outside component
 */
const ROLE_RESPONSES: Record<string, string[]> = {
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

const COLLABORATIVE_RESPONSES = [
  "Based on our collective analysis across PM, BA, and Strategy perspectives, here's our recommended approach:",
  "Our integrated team assessment suggests a phased implementation strategy:",
  "From project, data, and governance viewpoints, we align on these key priorities:",
  "Cross-functional analysis complete. Here's what each discipline recommends:",
];

const COLLABORATIVE_INSIGHTS = [
  "\n\n📊 **Data**: Metrics support this direction with 94% confidence",
  "\n🎯 **Strategy**: Aligns with Q2 objectives and market positioning",
  "\n📋 **Governance**: Meets all compliance requirements",
  "\n⏱️ **Timeline**: Achievable within current sprint capacity",
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate contextual additions based on query content
 */
const getContextualAdditions = (query: string): string[] => {
  const additions: string[] = [];
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('timeline') || lowerQuery.includes('schedule')) {
    additions.push('⏰ Timeline consideration noted');
  }
  if (lowerQuery.includes('budget') || lowerQuery.includes('cost')) {
    additions.push('💰 Budget impact will be assessed');
  }
  if (lowerQuery.includes('risk')) {
    additions.push('⚠️ Risk analysis included');
  }
  if (lowerQuery.includes('priority') || lowerQuery.includes('urgent')) {
    additions.push('🔥 Priority flag raised');
  }
  
  return additions;
};

/**
 * Create welcome message for project
 */
const createWelcomeMessage = (project: Project, agentList?: string): Message => ({
  id: `sys-${Date.now()}`,
  content: project.name 
    ? `Switched to project: ${project.name} 🔄\n\nClient: ${project.client.name}\nStatus: ${project.status}\nProgress: ${project.progress}%\nBudget: ${project.budget}\nTeam Size: ${project.teamSize}\n\n${agentList || 'Your AI team is now ready to assist with this project.'}\n\nHow can we help you today?`
    : `Welcome to your AI Project Workspace! 🚀\n\n${agentList}\n\nUse @mentions to direct questions to specific agents, or ask general questions for collaborative responses.`,
  sender: 'system',
  agentId: 'system',
  timestamp: new Date(),
  visibility: 'project',
  canConvertToTask: false,
  canConvertToDocument: false,
});

// ============================================================================
// MAIN HOOK
// ============================================================================

export const useProjectLogic = ({
  initialProject,
  initialAgents,
  initialMetrics,
  onError,
}: UseProjectLogicProps): UseProjectLogicReturn => {
  // ============================================================================
  // STATE
  // ============================================================================
  
  const [currentProject, setCurrentProject] = useState<Project>(initialProject);
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [metrics, setMetrics] = useState<ProjectMetrics>(initialMetrics);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize messages with welcome message
  const [messages, setMessages] = useState<Message[]>(() => {
    const agentList = initialAgents
      .map(a => `• ${a.avatar} ${a.name} (${a.role}) - ${a.description}`)
      .join('\n');
    return [createWelcomeMessage(initialProject, `Your specialized team of ${initialAgents.length} AI agents is ready to assist:\n${agentList}`)];
  });
  
  // ============================================================================
  // REFS
  // ============================================================================
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const messageQueueRef = useRef<Message[]>([]);
  
  // ============================================================================
  // MEMOIZED VALUES
  // ============================================================================
  
  /**
   * Agent lookup map for O(1) access
   */
  const agentMap = useMemo(() => {
    return new Map(agents.map(agent => [agent.id, agent]));
  }, [agents]);
  
  /**
   * Agent name lookup map for mentions
   */
  const agentNameMap = useMemo(() => {
    return new Map(agents.map(agent => [agent.name.toLowerCase(), agent.id]));
  }, [agents]);
  
  // ============================================================================
  // CORE FUNCTIONS
  // ============================================================================
  
  /**
   * Extract @mentions from message content
   */
  const extractMentions = useCallback((content: string): string[] => {
    const mentionRegex = /@(\w+)/g;
    const mentions: string[] = [];
    let match: RegExpExecArray | null;

    while ((match = mentionRegex.exec(content)) !== null) {
      const mentionedName = match[1].toLowerCase();
      const agentId = agentNameMap.get(mentionedName);
      if (agentId) {
        mentions.push(agentId);
      }
    }

    return mentions;
  }, [agentNameMap]);
  
  /**
   * Create agent-specific response with personality
   */
  const createAgentResponse = useCallback((agent: Agent, query: string): Message => {
    const responses = ROLE_RESPONSES[agent.role] || [
      "I'll help you with that request. Let me analyze this for you."
    ];
    
    const selectedResponse = responses[Math.floor(Math.random() * responses.length)];
    const contextualAdditions = getContextualAdditions(query);
    
    const fullResponse = contextualAdditions.length > 0
      ? `${selectedResponse}\n\n${contextualAdditions.join(' • ')}`
      : selectedResponse;

    return {
      id: `msg-${Date.now()}-${agent.id}-${Math.random().toString(36).substr(2, 9)}`,
      content: `**${agent.avatar} ${agent.name} (${agent.role})**: ${fullResponse}`,
      sender: 'agent',
      agentId: agent.id,
      timestamp: new Date(),
      visibility: 'project',
      mentions: [],
      canConvertToTask: agent.role === 'Project Manager',
      canConvertToDocument: agent.role === 'Business Analyst' || agent.role === 'Data Analyst',
    };
  }, []);
  
  /**
   * Generate collaborative response from multiple agents
   */
  const generateCollaborativeResponse = useCallback((query: string): Message => {
    const selectedResponse = COLLABORATIVE_RESPONSES[
      Math.floor(Math.random() * COLLABORATIVE_RESPONSES.length)
    ];
    
    const insightCount = 2 + Math.floor(Math.random() * 2);
    const selectedInsights = COLLABORATIVE_INSIGHTS
      .slice(0, insightCount)
      .join('');

    return {
      id: `msg-${Date.now()}-collab-${Math.random().toString(36).substr(2, 9)}`,
      content: `${selectedResponse}${selectedInsights}`,
      sender: 'agent',
      agentId: 'collaborative',
      timestamp: new Date(),
      visibility: 'project',
      mentions: [],
      canConvertToTask: true,
      canConvertToDocument: true,
    };
  }, []);
  
  /**
   * Update agent statuses
   */
  const updateAgentStatus = useCallback((
    agentIds: string[],
    status: Agent['status'],
    updateLastActivity = false
  ) => {
    setAgents(prev =>
      prev.map(agent =>
        agentIds.includes(agent.id)
          ? {
              ...agent,
              status,
              ...(updateLastActivity && { lastActivity: 'just now' })
            }
          : agent
      )
    );
  }, []);
  
  // ============================================================================
  // MESSAGE HANDLERS
  // ============================================================================
  
  /**
   * Send message handler with enhanced logic and error handling
   */
  const handleSendMessage = useCallback(async (
    newMessage: string,
    selectedAgents: string[],
    visibility: 'project' | 'team' | 'private',
    attachments: Attachment[]
  ): Promise<void> => {
    // Validation
    const trimmed = newMessage.trim();
    if (!trimmed && attachments.length === 0) {
      setError('Message cannot be empty');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const mentions = extractMentions(trimmed);

      // Create user message
      const userMsg: Message = {
        id: `msg-${Date.now()}-user-${Math.random().toString(36).substr(2, 9)}`,
        content: trimmed,
        sender: 'user',
        timestamp: new Date(),
        mentions,
        attachments: attachments.length ? attachments : undefined,
        visibility,
        canConvertToTask: false,
        canConvertToDocument: false,
      };

      setMessages(prev => [...prev, userMsg]);

      // Determine target agents
      const targetAgentIds = selectedAgents.length > 0 
        ? selectedAgents 
        : mentions.length > 0 
          ? mentions 
          : agents.map(a => a.id);

      // Validate target agents exist
      const validTargetIds = targetAgentIds.filter(id => agentMap.has(id));
      if (validTargetIds.length === 0) {
        throw new Error('No valid agents selected');
      }

      // Update agent statuses to thinking
      updateAgentStatus(validTargetIds, 'thinking');

      // Simulate realistic thinking time
      const responseDelay = 600 + Math.random() * 400;
      
      await new Promise(resolve => setTimeout(resolve, responseDelay));

      // Generate responses
      let responses: Message[];

      if (selectedAgents.length === 0 && mentions.length === 0) {
        // Collaborative response
        responses = [generateCollaborativeResponse(trimmed)];
      } else {
        // Individual agent responses
        responses = validTargetIds
          .map(id => agentMap.get(id))
          .filter((agent): agent is Agent => agent !== undefined)
          .map(agent => createAgentResponse(agent, trimmed));
      }

      setMessages(prev => [...prev, ...responses]);
      
      // Update agent statuses back to active
      updateAgentStatus(validTargetIds, 'active', true);

      // Update metrics
      setMetrics(m => ({
        ...m,
        totalQueries: m.totalQueries + 1,
        successRate: Math.min(100, m.successRate + 0.1), // Gradual improvement
      }));

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      
      // Create error message
      const errorMsg: Message = {
        id: `msg-${Date.now()}-error`,
        content: `❌ Error: ${errorMessage}`,
        sender: 'system',
        timestamp: new Date(),
        visibility: 'private',
        error: errorMessage,
      };
      
      setMessages(prev => [...prev, errorMsg]);
      
      if (onError) {
        onError(err instanceof Error ? err : new Error(errorMessage));
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [
    agents,
    agentMap,
    extractMentions,
    createAgentResponse,
    generateCollaborativeResponse,
    updateAgentStatus,
    onError
  ]);
  
  /**
   * Handle message feedback
   */
  const handleFeedback = useCallback(async (
    messageId: string,
    feedbackType: 'positive' | 'negative',
    comment?: string
  ): Promise<void> => {
    try {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId
            ? {
                ...msg,
                feedback: {
                  type: feedbackType,
                  comment,
                  timestamp: new Date().toISOString(),
                },
              }
            : msg
        )
      );

      // Update metrics
      if (feedbackType === 'positive') {
        setMetrics(m => ({
          ...m,
          successRate: Math.min(100, m.successRate + 0.5),
        }));
      }

      toast.success(
        feedbackType === 'positive' 
          ? 'Thanks for your feedback!' 
          : 'Feedback recorded. We\'ll improve!',
        { duration: 2000 }
      );
    } catch (err) {
      const errorMessage = 'Failed to submit feedback';
      toast.error(errorMessage);
      throw err;
    }
  }, []);
  
  /**
   * Delete message
   */
  const handleMessageDelete = useCallback((messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
    toast.success('Message deleted', { duration: 2000 });
  }, []);
  
  /**
   * Retry failed message
   */
  const retryMessage = useCallback(async (messageId: string): Promise<void> => {
    const message = messages.find(msg => msg.id === messageId);
    if (!message || message.sender !== 'user') return;

    // Remove error message and retry
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
    
    await handleSendMessage(
      message.content,
      message.mentions || [],
      message.visibility,
      message.attachments || []
    );
  }, [messages, handleSendMessage]);
  
  /**
   * Clear all messages
   */
  const clearMessages = useCallback(() => {
    const agentList = agents
      .map(a => `• ${a.avatar} ${a.name} (${a.role}) - ${a.description}`)
      .join('\n');
    setMessages([
      createWelcomeMessage(
        currentProject,
        `Your specialized team of ${agents.length} AI agents is ready to assist:\n${agentList}`
      )
    ]);
    toast.success('Chat cleared', { duration: 2000 });
  }, [agents, currentProject]);
  
  // ============================================================================
  // PROJECT & AGENT HANDLERS
  // ============================================================================
  
  /**
   * Handle project switching with context preservation
   */
  const handleProjectSwitch = useCallback((newProject: Project) => {
    setCurrentProject(newProject);
    
    const welcomeMessage = createWelcomeMessage(newProject);
    setMessages([welcomeMessage]);
    
    // Reset metrics for new project
    setMetrics({
      activeAgents: agents.filter(a => a.status === 'active').length,
      totalQueries: 0,
      successRate: 95,
      avgResponseTime: '0.8s',
      tasksGenerated: 0,
      documentsCreated: 0,
    });
    
    toast(`Switched to: ${newProject.name}`, {
      icon: '🔄',
      duration: 3000,
    });
  }, [agents]);
  
  /**
   * Handle agent selection update with validation
   */
  const handleAgentsUpdate = useCallback((newAgentIds: string[]) => {
    const updatedAgents = initialAgents.filter(agent => 
      newAgentIds.includes(agent.id)
    );
    
    if (updatedAgents.length === 0) {
      toast.error('At least one agent must be selected');
      return;
    }

    setAgents(updatedAgents);
    
    setMetrics(prev => ({
      ...prev,
      activeAgents: updatedAgents.filter(a => a.status === 'active').length,
    }));
    
    const agentList = updatedAgents
      .map(agent => `• ${agent.avatar} ${agent.name} (${agent.role})`)
      .join('\n');
      
    const systemMessage: Message = {
      id: `sys-${Date.now()}`,
      content: `Agent team updated! 🤖\n\nActive agents:\n${agentList}\n\nYour ${updatedAgents.length}-agent team is ready to assist with ${currentProject.name}.`,
      sender: 'system',
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
  }, [currentProject.name, initialAgents]);
  
  /**
   * Expose setMessages for external updates
   */
  const updateMessages = useCallback((
    updater: Message[] | ((prev: Message[]) => Message[])
  ) => {
    setMessages(updater);
  }, []);
  
  // ============================================================================
  // RETURN
  // ============================================================================
  
  return {
    // State
    currentProject,
    agents,
    metrics,
    messages,
    isLoading,
    error,
    
    // Actions
    setMessages: updateMessages,
    handleSendMessage,
    handleProjectSwitch,
    handleAgentsUpdate,
    handleFeedback,
    handleMessageDelete,
    clearMessages,
    retryMessage,
  };
};
