import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { AgentChatMessage } from './ChatMessage';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ProjectType =
  | 'software'
  | 'marketing'
  | 'design'
  | 'research'
  | 'operations'
  | 'construction'
  | 'unknown';

export type ComplexityLevel = 'low' | 'medium' | 'high' | 'enterprise';
export type DeliveryTrack = 'lean-sprint' | 'prince2-agile-hybrid' | 'waterfall-classic' | 'kanban-flow';

export type AgentStep =
  | 'greeting'
  | 'project_name'
  | 'goal'
  | 'project_type'
  | 'target_audience'
  | 'deliverables'
  | 'timeline'
  | 'team_size'
  | 'budget'
  | 'priority'
  | 'constraints'
  | 'summary'
  | 'confirmed'
  | 'revising';

export interface CollectedProjectData {
  projectName?: string;
  goal?: string;
  projectType?: string;
  targetAudience?: string;
  deliverables?: string;
  timeline?: string;
  teamSize?: string;
  budget?: string;
  priority?: string;
  constraints?: string;
  complexity?: ComplexityLevel;
  deliveryTrack?: DeliveryTrack;
}

export interface UserPreferences {
  lastProjectType?: string;
  lastTeamSize?: string;
  lastTimeline?: string;
  lastBudget?: string;
  projectCount: number;
  preferredTrack?: DeliveryTrack;
}

export interface UseProjectAgentReturn {
  messages: AgentChatMessage[];
  isTyping: boolean;
  currentStep: AgentStep;
  collectedData: CollectedProjectData;
  isSummaryReady: boolean;
  isConfirmed: boolean;
  sendMessage: (text: string) => void;
  reset: () => void;
  userPrefs: UserPreferences;
}

// ─── Local storage keys ───────────────────────────────────────────────────────

const PREFS_KEY = 'project_agent_prefs';
const CHAT_STATE_KEY = 'project_agent_chat_state';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loadPrefs(): UserPreferences {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (raw) return JSON.parse(raw) as UserPreferences;
  } catch {}
  return { projectCount: 0 };
}

function savePrefs(prefs: UserPreferences): void {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {}
}

function saveChatState(messages: AgentChatMessage[], data: CollectedProjectData, step: AgentStep): void {
  try {
    localStorage.setItem(CHAT_STATE_KEY, JSON.stringify({ messages, data, step }));
  } catch {}
}

function loadChatState(): { messages: AgentChatMessage[]; data: CollectedProjectData; step: AgentStep } | null {
  try {
    const raw = localStorage.getItem(CHAT_STATE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Revive Date objects
      parsed.messages = parsed.messages.map((m: AgentChatMessage) => ({
        ...m,
        timestamp: new Date(m.timestamp),
      }));
      return parsed;
    }
  } catch {}
  return null;
}

function clearChatState(): void {
  try {
    localStorage.removeItem(CHAT_STATE_KEY);
  } catch {}
}

function makeMessage(
  content: string,
  sender: 'user' | 'assistant',
  quickReplies?: string[]
): AgentChatMessage {
  return {
    id: uuidv4(),
    content,
    sender,
    timestamp: new Date(),
    isQuickReplies: !!quickReplies?.length,
    quickReplies,
  };
}

// ─── Project type detection ───────────────────────────────────────────────────

function detectProjectType(text: string): ProjectType {
  const lower = text.toLowerCase();
  if (/\b(app|software|web|mobile|api|backend|frontend|saas|platform|code|develop|engineer)\b/.test(lower)) return 'software';
  if (/\b(market|campaign|brand|social|ads|content|seo|email|launch|audience|funnel)\b/.test(lower)) return 'marketing';
  if (/\b(design|ux|ui|prototype|figma|visual|brand|logo|creative)\b/.test(lower)) return 'design';
  if (/\b(research|study|analysis|report|survey|data|science|ml|ai)\b/.test(lower)) return 'research';
  if (/\b(operation|process|workflow|automat|system|infra|deploy|devops)\b/.test(lower)) return 'operations';
  if (/\b(build|construct|renovation|architect|physical|site)\b/.test(lower)) return 'construction';
  return 'unknown';
}

// ─── Complexity inference ─────────────────────────────────────────────────────

function inferComplexity(data: CollectedProjectData): ComplexityLevel {
  const teamNum = parseInt(data.teamSize ?? '1', 10);
  const budget = (data.budget ?? '').toLowerCase();
  const timeline = (data.timeline ?? '').toLowerCase();

  const isLargeBudget = /\d{5,}|\$\s*\d{4,}|k\b|thousand|million/.test(budget);
  const isLongTimeline = /year|month[s]?\s*[3-9]|6\s*month|quarter[s]?\s*[2-9]/.test(timeline);
  const isLargeTeam = teamNum >= 10;

  if (isLargeTeam && isLargeBudget && isLongTimeline) return 'enterprise';
  if ((isLargeTeam && isLargeBudget) || (isLargeTeam && isLongTimeline)) return 'high';
  if (teamNum >= 4 || isLargeBudget || isLongTimeline) return 'medium';
  return 'low';
}

// ─── Delivery track inference ─────────────────────────────────────────────────

function inferDeliveryTrack(data: CollectedProjectData, projectType: ProjectType): DeliveryTrack {
  const timeline = (data.timeline ?? '').toLowerCase();
  const isSprint = /sprint|week|agile|iterati/.test(timeline);
  const isWaterfall = /waterfall|sequential|stage|phase|milestone/.test(timeline);

  if (projectType === 'software' && isSprint) return 'lean-sprint';
  if (projectType === 'software') return 'lean-sprint';
  if (projectType === 'marketing') return 'kanban-flow';
  if (projectType === 'design') return 'kanban-flow';
  if (projectType === 'research') return 'prince2-agile-hybrid';
  if (projectType === 'construction') return 'waterfall-classic';
  if (isWaterfall) return 'waterfall-classic';
  if (isSprint) return 'lean-sprint';
  return 'kanban-flow';
}

// ─── Step ordering per project type ──────────────────────────────────────────

function getStepOrder(projectType: ProjectType, hasPrefs: boolean): AgentStep[] {
  const base: AgentStep[] = ['project_name', 'goal', 'project_type', 'deliverables', 'timeline', 'team_size'];

  if (projectType === 'software') {
    return [...base, 'target_audience', 'budget', 'priority', 'summary'];
  }
  if (projectType === 'marketing') {
    return ['project_name', 'goal', 'project_type', 'target_audience', 'deliverables', 'timeline', 'team_size', 'budget', 'summary'];
  }
  if (projectType === 'research') {
    return ['project_name', 'goal', 'project_type', 'deliverables', 'timeline', 'team_size', 'constraints', 'summary'];
  }
  if (projectType === 'construction') {
    return ['project_name', 'goal', 'project_type', 'deliverables', 'timeline', 'budget', 'team_size', 'constraints', 'summary'];
  }
  // default
  return [...base, 'target_audience', 'budget', 'priority', 'constraints', 'summary'];
}

// ─── Question prompts ─────────────────────────────────────────────────────────

function getPromptForStep(
  step: AgentStep,
  data: CollectedProjectData,
  prefs: UserPreferences,
  projectType: ProjectType
): { text: string; quickReplies?: string[] } {
  switch (step) {
    case 'project_name':
      return { text: "Great! Let's start with the basics. **What's the name of your project?**" };

    case 'goal':
      return {
        text: `Nice name! Now, **what's the primary goal or problem this project solves?** Be as specific as you like — one clear sentence works great.`,
      };

    case 'project_type': {
      const detected = projectType !== 'unknown' ? ` (it sounds like a **${projectType}** project — confirm?)` : '';
      return {
        text: `What **type of project** is this?${detected}`,
        quickReplies: ['Software / App', 'Marketing Campaign', 'Design / Creative', 'Research / Analysis', 'Operations / Process', 'Other'],
      };
    }

    case 'target_audience':
      return {
        text: `Who is the **target audience or end user** for this project? Who will benefit most from it?`,
      };

    case 'deliverables': {
      const examples: Record<ProjectType, string> = {
        software: 'e.g. MVP web app, API endpoints, mobile app',
        marketing: 'e.g. campaign landing page, email sequence, ad creatives',
        design: 'e.g. brand kit, UI mockups, prototype',
        research: 'e.g. research report, data analysis, recommendations',
        operations: 'e.g. automated workflow, process documentation, dashboards',
        construction: 'e.g. architectural plans, completed structure, inspection reports',
        unknown: 'e.g. final report, working prototype, campaign materials',
      };
      return {
        text: `What are the **key deliverables** for this project? ${examples[projectType]}`,
      };
    }

    case 'timeline': {
      const prefSuggestion = prefs.lastTimeline ? ` Last time you used **${prefs.lastTimeline}** — want something similar?` : '';
      return {
        text: `What's your **target timeline or deadline**?${prefSuggestion}`,
        quickReplies: ['2 weeks', '1 month', '3 months', '6 months', '1 year', 'Flexible'],
      };
    }

    case 'team_size': {
      const prefSuggestion = prefs.lastTeamSize ? ` Based on your history, you usually work with around **${prefs.lastTeamSize}** — same this time?` : '';
      return {
        text: `How large is the **team** working on this?${prefSuggestion}`,
        quickReplies: ['Just me (1)', '2–3 people', '4–7 people', '8–15 people', '15+ people'],
      };
    }

    case 'budget': {
      const prefSuggestion = prefs.lastBudget ? ` Your last project had a budget of **${prefs.lastBudget}**.` : '';
      return {
        text: `Do you have a **budget** in mind for this project?${prefSuggestion} (Say "none" or "flexible" if not applicable)`,
        quickReplies: ['Under $5k', '$5k–$20k', '$20k–$100k', '$100k+', 'Flexible / TBD'],
      };
    }

    case 'priority':
      return {
        text: `What's the **priority level** of this project?`,
        quickReplies: ['Critical — must ship ASAP', 'High — important this quarter', 'Medium — steady pace', 'Low — when time allows'],
      };

    case 'constraints':
      return {
        text: `Any known **constraints, risks, or blockers** I should factor in? (e.g. limited resources, dependencies, regulatory requirements)`,
        quickReplies: ['No major constraints', 'Limited budget', 'Small team', 'Tight deadline', 'Technical dependencies'],
      };

    case 'summary':
      return { text: "I've gathered all the information I need. Let me put together a summary for you!" };

    default:
      return { text: 'Tell me more.' };
  }
}

// ─── Revision detection ───────────────────────────────────────────────────────

function detectRevisionIntent(text: string): AgentStep | null {
  const lower = text.toLowerCase();
  if (/name|title/.test(lower)) return 'project_name';
  if (/goal|purpose|objective/.test(lower)) return 'goal';
  if (/type|categor/.test(lower)) return 'project_type';
  if (/audience|user|customer/.test(lower)) return 'target_audience';
  if (/deliver|output|result/.test(lower)) return 'deliverables';
  if (/timeline|deadline|date|schedule/.test(lower)) return 'timeline';
  if (/team|people|size/.test(lower)) return 'team_size';
  if (/budget|cost|money|fund/.test(lower)) return 'budget';
  if (/priority|urgent|important/.test(lower)) return 'priority';
  if (/constraint|risk|block|issue/.test(lower)) return 'constraints';
  return null;
}

// ─── Map user input → field ───────────────────────────────────────────────────

function extractFieldFromStep(step: AgentStep, text: string): Partial<CollectedProjectData> {
  switch (step) {
    case 'project_name': return { projectName: text };
    case 'goal': return { goal: text };
    case 'project_type': {
      const lower = text.toLowerCase();
      let type = text;
      if (/software|app/.test(lower)) type = 'Software / App';
      else if (/market/.test(lower)) type = 'Marketing Campaign';
      else if (/design/.test(lower)) type = 'Design / Creative';
      else if (/research|analys/.test(lower)) type = 'Research / Analysis';
      else if (/operat|process/.test(lower)) type = 'Operations / Process';
      return { projectType: type };
    }
    case 'target_audience': return { targetAudience: text };
    case 'deliverables': return { deliverables: text };
    case 'timeline': return { timeline: text };
    case 'team_size': return { teamSize: text };
    case 'budget': return { budget: text };
    case 'priority': return { priority: text };
    case 'constraints': return { constraints: text };
    default: return {};
  }
}

// ─── Acknowledgement phrases ──────────────────────────────────────────────────

const ACK: Record<AgentStep, string> = {
  project_name: "Love it! ",
  goal: "Clear goal — ",
  project_type: "Got it. ",
  target_audience: "Understood. ",
  deliverables: "Perfect. ",
  timeline: "Noted. ",
  team_size: "Great. ",
  budget: "Okay. ",
  priority: "Understood. ",
  constraints: "Duly noted. ",
  greeting: '',
  summary: '',
  confirmed: '',
  revising: '',
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useProjectAgent(sessionKey?: string): UseProjectAgentReturn {
  const [userPrefs] = useState<UserPreferences>(loadPrefs);

  const buildGreeting = useCallback(
    (prefs: UserPreferences): AgentChatMessage => {
      let text: string;
      if (prefs.projectCount > 0 && prefs.lastProjectType) {
        text = `Welcome back! You've created **${prefs.projectCount}** project${prefs.projectCount > 1 ? 's' : ''} so far — great work. Last time you built a **${prefs.lastProjectType}** project. Ready to start a new one?\n\nI'll guide you through everything step by step. Let's begin — what's your new project about?`;
      } else {
        text = `Hi! I'm your **Project Setup Assistant**. I'll guide you through creating your project in a natural conversation — no forms to fill out.\n\nI'll ask a few focused questions to understand what you're building, then put together a complete project plan for you. Let's get started!`;
      }
      return makeMessage(text, 'assistant');
    },
    []
  );

  const initState = useCallback(() => {
    const saved = loadChatState();
    if (saved && saved.step !== 'confirmed') {
      return { messages: saved.messages, data: saved.data, step: saved.step };
    }
    const prefs = loadPrefs();
    const greeting = buildGreeting(prefs);
    const firstQ = makeMessage("What's the name of your project?", 'assistant');
    return {
      messages: [greeting, firstQ],
      data: {} as CollectedProjectData,
      step: 'project_name' as AgentStep,
    };
  }, [buildGreeting, sessionKey]);

  const init = initState();
  const [messages, setMessages] = useState<AgentChatMessage[]>(init.messages);
  const [collectedData, setCollectedData] = useState<CollectedProjectData>(init.data);
  const [currentStep, setCurrentStep] = useState<AgentStep>(init.step);
  const [isTyping, setIsTyping] = useState(false);
  const [projectType, setProjectType] = useState<ProjectType>('unknown');
  const [stepOrder, setStepOrder] = useState<AgentStep[]>(getStepOrder('unknown', false));

  // Persist chat state
  useEffect(() => {
    if (currentStep !== 'confirmed') {
      saveChatState(messages, collectedData, currentStep);
    }
  }, [messages, collectedData, currentStep]);

  const addMessage = useCallback((msg: AgentChatMessage) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const advanceToNextStep = useCallback(
    (
      fromStep: AgentStep,
      updatedData: CollectedProjectData,
      detectedType: ProjectType,
      order: AgentStep[]
    ) => {
      const currentIdx = order.indexOf(fromStep);
      const nextStep = order[currentIdx + 1] ?? 'summary';

      const delay = 800 + Math.random() * 600;
      setIsTyping(true);

      setTimeout(() => {
        setIsTyping(false);

        if (nextStep === 'summary') {
          const complexity = inferComplexity(updatedData);
          const track = inferDeliveryTrack(updatedData, detectedType);
          setCollectedData((prev) => ({ ...prev, complexity, deliveryTrack: track }));
          setCurrentStep('summary');
          addMessage(
            makeMessage(
              `I've gathered all the information I need. Here's a summary of your project — please review and confirm or let me know what you'd like to change.`,
              'assistant'
            )
          );
        } else {
          setCurrentStep(nextStep);
          const { text, quickReplies } = getPromptForStep(nextStep, updatedData, loadPrefs(), detectedType);
          addMessage(makeMessage(text, 'assistant', quickReplies));
        }
      }, delay);
    },
    [addMessage]
  );

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim()) return;

      // Add user message
      const userMsg = makeMessage(text, 'user');
      setMessages((prev) => [...prev, userMsg]);

      // ── Revision mode ──
      if (currentStep === 'summary' || currentStep === 'revising') {
        const revisionField = detectRevisionIntent(text);
        if (revisionField) {
          setCurrentStep('revising');
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            setCurrentStep(revisionField);
            addMessage(
              makeMessage(
                `Of course! Let's update that. ${getPromptForStep(revisionField, collectedData, loadPrefs(), projectType).text}`,
                'assistant',
                getPromptForStep(revisionField, collectedData, loadPrefs(), projectType).quickReplies
              )
            );
          }, 700);
          return;
        }
        // Check for confirmation words
        const lower = text.toLowerCase();
        if (/\b(yes|confirm|looks good|create|go|proceed|perfect|great|ok|okay|start)\b/.test(lower)) {
          setCurrentStep('confirmed');
          clearChatState();
          // Save prefs
          const newPrefs: UserPreferences = {
            ...userPrefs,
            projectCount: (userPrefs.projectCount ?? 0) + 1,
            lastProjectType: collectedData.projectType ?? userPrefs.lastProjectType,
            lastTeamSize: collectedData.teamSize ?? userPrefs.lastTeamSize,
            lastTimeline: collectedData.timeline ?? userPrefs.lastTimeline,
            lastBudget: collectedData.budget ?? userPrefs.lastBudget,
            preferredTrack: collectedData.deliveryTrack ?? userPrefs.preferredTrack,
          };
          savePrefs(newPrefs);
          addMessage(makeMessage("Creating your project now...", 'assistant'));
          return;
        }
        // Unknown reply at summary — prompt again
        addMessage(
          makeMessage(
            `Got it! If you'd like to change anything, just tell me what to update (e.g. "change the timeline" or "update the team size"). Or say **"confirm"** to create the project.`,
            'assistant',
            ['Looks good, confirm!', 'Change the timeline', 'Update team size', 'Change the budget']
          )
        );
        return;
      }

      // ── Normal step flow ──
      const fieldData = extractFieldFromStep(currentStep, text);
      const updatedData = { ...collectedData, ...fieldData };
      setCollectedData(updatedData);

      // Detect project type from name + goal
      let detectedType = projectType;
      if (currentStep === 'project_name' || currentStep === 'goal') {
        const combined = `${updatedData.projectName ?? ''} ${updatedData.goal ?? ''}`;
        detectedType = detectProjectType(combined);
        if (detectedType !== 'unknown') {
          setProjectType(detectedType);
          const newOrder = getStepOrder(detectedType, userPrefs.projectCount > 0);
          setStepOrder(newOrder);
          advanceToNextStep(currentStep, updatedData, detectedType, newOrder);
          return;
        }
      }

      // After getting project type explicitly
      if (currentStep === 'project_type') {
        const typeText = text.toLowerCase();
        let resolved: ProjectType = 'unknown';
        if (/software|app/.test(typeText)) resolved = 'software';
        else if (/market/.test(typeText)) resolved = 'marketing';
        else if (/design/.test(typeText)) resolved = 'design';
        else if (/research/.test(typeText)) resolved = 'research';
        else if (/operat|process/.test(typeText)) resolved = 'operations';
        else if (/construct/.test(typeText)) resolved = 'construction';

        if (resolved !== 'unknown') {
          setProjectType(resolved);
          const newOrder = getStepOrder(resolved, userPrefs.projectCount > 0);
          setStepOrder(newOrder);
          // Acknowledge with context-aware message
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            const ack = `${ACK[currentStep]}I'll tailor the remaining questions for a **${resolved}** project.`;
            addMessage(makeMessage(ack, 'assistant'));
            setTimeout(() => {
              advanceToNextStep(currentStep, updatedData, resolved, newOrder);
            }, 600);
          }, 600);
          return;
        }
      }

      advanceToNextStep(currentStep, updatedData, detectedType, stepOrder);
    },
    [currentStep, collectedData, projectType, stepOrder, userPrefs, addMessage, advanceToNextStep]
  );

  const reset = useCallback(() => {
    clearChatState();
    const prefs = loadPrefs();
    const greeting = buildGreeting(prefs);
    const firstQ = makeMessage("What's the name of your project?", 'assistant');
    setMessages([greeting, firstQ]);
    setCollectedData({});
    setCurrentStep('project_name');
    setIsTyping(false);
    setProjectType('unknown');
    setStepOrder(getStepOrder('unknown', false));
  }, [buildGreeting]);

  return {
    messages,
    isTyping,
    currentStep,
    collectedData,
    isSummaryReady: currentStep === 'summary',
    isConfirmed: currentStep === 'confirmed',
    sendMessage,
    reset,
    userPrefs,
  };
}
