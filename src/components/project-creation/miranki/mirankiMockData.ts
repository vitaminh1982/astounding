import { v4 as uuidv4 } from 'uuid';

export interface MirankiTeamMember {
  id: string;
  name: string;
  initials: string;
  role: string;
  color: string;
  bgColor: string;
  textColor: string;
}

export interface MirankiAgent {
  id: string;
  name: string;
  fullName: string;
  role: string;
  status: 'active' | 'processing' | 'standby';
  currentTask: string;
  supervisorId: string;
  metrics: {
    primary: { label: string; value: string };
    tasksCompleted: number;
    avgTime: string;
  };
  color: string;
  icon: string;
}

export interface MirankiMilestone {
  id: string;
  phase: number;
  name: string;
  duration: string;
  status: 'in-progress' | 'upcoming' | 'planned';
  progress: number;
}

export interface MirankiDeliverable {
  id: string;
  name: string;
  status: 'completed' | 'in-progress' | 'pending';
  phase: number;
}

export interface WeeklyActivity {
  week: string;
  ARIA: number;
  NEXUS: number;
  FORGE: number;
  DELTA: number;
  ORACLE: number;
}

export const MIRANKI_TEAM: MirankiTeamMember[] = [
  {
    id: uuidv4(),
    name: 'Sarah Chen',
    initials: 'SC',
    role: 'Principal Strategy Consultant & Project Lead',
    color: 'indigo',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
    textColor: 'text-indigo-600 dark:text-indigo-400',
  },
  {
    id: uuidv4(),
    name: 'Marcus Okafor',
    initials: 'MO',
    role: 'Senior Technology Consultant',
    color: 'emerald',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    textColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    id: uuidv4(),
    name: 'Priya Nair',
    initials: 'PN',
    role: 'Senior Delivery & Methodology Consultant',
    color: 'violet',
    bgColor: 'bg-violet-100 dark:bg-violet-900/30',
    textColor: 'text-violet-600 dark:text-violet-400',
  },
];

export const MIRANKI_AGENTS: MirankiAgent[] = [
  {
    id: 'agent-aria',
    name: 'ARIA',
    fullName: 'Adaptive Research & Intelligence Agent',
    role: 'Market research, competitive intelligence, trend synthesis',
    status: 'active',
    currentTask: 'Synthesizing Q2 consulting market landscape report',
    supervisorId: MIRANKI_TEAM[0].id,
    metrics: { primary: { label: 'Accuracy', value: '94%' }, tasksCompleted: 127, avgTime: '2.3h' },
    color: 'amber',
    icon: 'search',
  },
  {
    id: 'agent-nexus',
    name: 'NEXUS',
    fullName: 'Network & Experience Unification System',
    role: 'Stakeholder mapping, relationship graph building, communication drafting',
    status: 'active',
    currentTask: 'Building client stakeholder influence map for Phase 2',
    supervisorId: MIRANKI_TEAM[0].id,
    metrics: { primary: { label: 'Satisfaction', value: '89%' }, tasksCompleted: 84, avgTime: '1.8h' },
    color: 'cyan',
    icon: 'network',
  },
  {
    id: 'agent-forge',
    name: 'FORGE',
    fullName: 'Framework Optimization & Requirements Generation Engine',
    role: 'Methodology design, process framework generation, requirements documentation',
    status: 'processing',
    currentTask: 'Generating PMO framework templates for agile consulting workflows',
    supervisorId: MIRANKI_TEAM[2].id,
    metrics: { primary: { label: 'Adoption', value: '91%' }, tasksCompleted: 203, avgTime: '4.1h' },
    color: 'orange',
    icon: 'wrench',
  },
  {
    id: 'agent-delta',
    name: 'DELTA',
    fullName: 'Data Engineering & Learning Task Agent',
    role: 'Data pipeline management, model training coordination, performance analytics',
    status: 'active',
    currentTask: 'Training specialized NLP model on consulting domain corpus',
    supervisorId: MIRANKI_TEAM[1].id,
    metrics: { primary: { label: 'Uptime', value: '99.2%' }, tasksCompleted: 1200, avgTime: '0.8h' },
    color: 'teal',
    icon: 'database',
  },
  {
    id: 'agent-oracle',
    name: 'ORACLE',
    fullName: 'Outcome Reasoning & Advisory Cognitive Layer Engine',
    role: 'Strategic recommendations, risk assessment, decision support synthesis',
    status: 'standby',
    currentTask: 'Awaiting Phase 2 milestone data to generate strategic pivot recommendations',
    supervisorId: MIRANKI_TEAM[1].id,
    metrics: { primary: { label: 'Acceptance', value: '87%' }, tasksCompleted: 56, avgTime: '6.7h' },
    color: 'rose',
    icon: 'brain',
  },
];

export const MIRANKI_MILESTONES: MirankiMilestone[] = [
  { id: uuidv4(), phase: 1, name: 'Foundation & PM Agent MVP', duration: 'Year 1 (Months 1-12)', status: 'in-progress', progress: 68 },
  { id: uuidv4(), phase: 2, name: 'Consulting Domain Expansion', duration: 'Year 2 (Months 13-24)', status: 'upcoming', progress: 0 },
  { id: uuidv4(), phase: 3, name: 'Collective Intelligence Layer', duration: 'Year 3 (Months 25-36)', status: 'planned', progress: 0 },
  { id: uuidv4(), phase: 4, name: 'Cross-Methodology Integration', duration: 'Year 4 (Months 37-48)', status: 'planned', progress: 0 },
  { id: uuidv4(), phase: 5, name: 'Full SuperIntelligence Deployment', duration: 'Year 5 (Months 49-60)', status: 'planned', progress: 0 },
];

export const MIRANKI_DELIVERABLES: MirankiDeliverable[] = [
  { id: uuidv4(), name: 'Core agentic infrastructure deployed', status: 'completed', phase: 1 },
  { id: uuidv4(), name: 'ARIA and DELTA agents operational', status: 'completed', phase: 1 },
  { id: uuidv4(), name: 'PM user research completed (42 interviews)', status: 'completed', phase: 1 },
  { id: uuidv4(), name: 'Initial consulting domain NLP corpus built', status: 'completed', phase: 1 },
  { id: uuidv4(), name: 'FORGE framework generation engine', status: 'in-progress', phase: 1 },
  { id: uuidv4(), name: 'NEXUS stakeholder mapping module', status: 'in-progress', phase: 1 },
  { id: uuidv4(), name: 'ORACLE strategic synthesis layer', status: 'pending', phase: 1 },
  { id: uuidv4(), name: 'Beta launch with 5 pilot PM clients', status: 'pending', phase: 1 },
  { id: uuidv4(), name: 'Expanded consulting domain taxonomy', status: 'pending', phase: 2 },
  { id: uuidv4(), name: 'Multi-methodology agent adaptation', status: 'pending', phase: 2 },
  { id: uuidv4(), name: 'Client onboarding automation pipeline', status: 'pending', phase: 2 },
  { id: uuidv4(), name: 'Cross-agent knowledge transfer protocol', status: 'pending', phase: 3 },
  { id: uuidv4(), name: 'Collective reasoning engine v1', status: 'pending', phase: 3 },
  { id: uuidv4(), name: 'Full methodology matrix integration', status: 'pending', phase: 4 },
  { id: uuidv4(), name: 'SuperIntelligence coordination layer', status: 'pending', phase: 5 },
];

export const WEEKLY_ACTIVITY: WeeklyActivity[] = [
  { week: 'W1', ARIA: 12, NEXUS: 8, FORGE: 15, DELTA: 22, ORACLE: 3 },
  { week: 'W2', ARIA: 10, NEXUS: 11, FORGE: 18, DELTA: 19, ORACLE: 5 },
  { week: 'W3', ARIA: 14, NEXUS: 7, FORGE: 21, DELTA: 25, ORACLE: 2 },
  { week: 'W4', ARIA: 11, NEXUS: 13, FORGE: 16, DELTA: 20, ORACLE: 7 },
  { week: 'W5', ARIA: 15, NEXUS: 9, FORGE: 19, DELTA: 23, ORACLE: 4 },
  { week: 'W6', ARIA: 13, NEXUS: 12, FORGE: 22, DELTA: 18, ORACLE: 6 },
  { week: 'W7', ARIA: 9, NEXUS: 14, FORGE: 17, DELTA: 26, ORACLE: 3 },
  { week: 'W8', ARIA: 16, NEXUS: 10, FORGE: 20, DELTA: 21, ORACLE: 8 },
  { week: 'W9', ARIA: 12, NEXUS: 15, FORGE: 14, DELTA: 24, ORACLE: 5 },
  { week: 'W10', ARIA: 14, NEXUS: 8, FORGE: 23, DELTA: 19, ORACLE: 4 },
  { week: 'W11', ARIA: 11, NEXUS: 16, FORGE: 18, DELTA: 22, ORACLE: 6 },
  { week: 'W12', ARIA: 13, NEXUS: 11, FORGE: 21, DELTA: 27, ORACLE: 7 },
];

export const PROJECT_HEALTH = [
  { label: 'Timeline Health', value: 72, color: '#3b82f6' },
  { label: 'Budget Health', value: 81, color: '#10b981' },
  { label: 'Team Velocity', value: 88, color: '#8b5cf6' },
  { label: 'AI Agent Efficiency', value: 93, color: '#f59e0b' },
  { label: 'Stakeholder Satisfaction', value: 79, color: '#06b6d4' },
];

export const TASK_DISTRIBUTION = [
  { agent: 'ARIA', tasks: 127, color: '#f59e0b' },
  { agent: 'NEXUS', tasks: 84, color: '#06b6d4' },
  { agent: 'FORGE', tasks: 203, color: '#f97316' },
  { agent: 'DELTA', tasks: 1200, color: '#14b8a6' },
  { agent: 'ORACLE', tasks: 56, color: '#f43f5e' },
];
