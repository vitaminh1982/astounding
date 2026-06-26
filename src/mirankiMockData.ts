import { v4 as uuidv4 } from 'uuid';

// ─── Types ───────────────────────────────────────────────────────────────────

export type AgentStatus = 'Active' | 'Processing' | 'Standby';
export type AgentColor = 'indigo' | 'blue' | 'cyan' | 'purple' | 'amber' | 'rose';

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  iconName: string;
  color: AgentColor;
  capabilities: string[];
  usageStats: { tasksCompleted: number; avgResponseTime: string; accuracy: string };
  description: string;
  lastActive: string;
}

export type DeliverableStatus = 'completed' | 'in-progress' | 'pending';

export interface Deliverable {
  id: string;
  name: string;
  status: DeliverableStatus;
}

export interface Phase {
  id: string;
  name: string;
  progress: number;
  deliverables: Deliverable[];
}

export type DocType = 'PDF' | 'DOC' | 'TXT' | 'CSV';
export type DocStatus = 'indexed';

export interface KBDocument {
  id: string;
  name: string;
  type: DocType;
  size: string;
  uploadedAt: string;
  status: DocStatus;
  usedByAgents: string[];
}

export type MilestoneStatus = 'completed' | 'in-progress' | 'upcoming';

export interface Milestone {
  id: string;
  name: string;
  date: string;
  status: MilestoneStatus;
}

export interface TeamMember {
  id: string;
  name: string;
  initials: string;
  role: string;
  badgeColor: string;
}

export interface MirankiProject {
  name: string;
  subtitle: string;
  overallProgress: number;
  status: string;
  duration: string;
  teamSize: number;
  agentCount: number;
  industry: string;
  vision: string;
}

// ─── Project ─────────────────────────────────────────────────────────────────

export const MIRANKI_PROJECT: MirankiProject = {
  name: 'Miranki',
  subtitle: 'AI Startup Development · Collective SuperIntelligence Platform',
  overallProgress: 35,
  status: 'Active',
  duration: '5 Years',
  teamSize: 3,
  agentCount: 6,
  industry: 'Consulting',
  vision:
    'Building a Collective SuperIntelligence platform starting with the consulting sector — empowering Project Managers first, then expanding to all consultant types and methodologies.',
};

// ─── Team ────────────────────────────────────────────────────────────────────

export const MIRANKI_TEAM: TeamMember[] = [
  {
    id: uuidv4(),
    name: 'Alex Rivera',
    initials: 'AR',
    role: 'Founder & CEO',
    badgeColor: 'bg-purple-500/20 text-purple-400',
  },
  {
    id: uuidv4(),
    name: 'Sam Chen',
    initials: 'SC',
    role: 'Lead Engineer',
    badgeColor: 'bg-blue-500/20 text-blue-400',
  },
  {
    id: uuidv4(),
    name: 'Jordan Lee',
    initials: 'JL',
    role: 'AI Research Lead',
    badgeColor: 'bg-cyan-500/20 text-cyan-400',
  },
];

// ─── Milestones ───────────────────────────────────────────────────────────────

export const MIRANKI_MILESTONES: Milestone[] = [
  { id: uuidv4(), name: 'Platform Architecture', date: 'Jan 2024', status: 'completed' },
  { id: uuidv4(), name: 'Core AI Engine v1', date: 'Mar 2024', status: 'completed' },
  { id: uuidv4(), name: 'PM Module Beta', date: 'Jun 2024', status: 'in-progress' },
  { id: uuidv4(), name: 'Consultant Onboarding', date: 'Sep 2024', status: 'upcoming' },
  { id: uuidv4(), name: 'Public Launch', date: 'Dec 2024', status: 'upcoming' },
];

// ─── Agents ──────────────────────────────────────────────────────────────────

export const MIRANKI_AGENTS: Agent[] = [
  {
    id: uuidv4(),
    name: 'Strategy Advisor',
    role: 'Business Strategy',
    status: 'Active',
    iconName: 'Lightbulb',
    color: 'indigo',
    capabilities: ['Market positioning', 'Competitive analysis', 'Growth planning', 'Pivot assessment'],
    usageStats: { tasksCompleted: 142, avgResponseTime: '1.8s', accuracy: '94%' },
    description:
      'Provides high-level strategic guidance for business direction, market positioning, and growth planning across all project phases.',
    lastActive: '2 minutes ago',
  },
  {
    id: uuidv4(),
    name: 'Market Analyst',
    role: 'Market Intelligence',
    status: 'Active',
    iconName: 'BarChart2',
    color: 'blue',
    capabilities: ['TAM/SAM/SOM analysis', 'Competitor tracking', 'Trend forecasting', 'Customer segmentation'],
    usageStats: { tasksCompleted: 89, avgResponseTime: '2.1s', accuracy: '91%' },
    description:
      'Analyzes market opportunities, tracks competitors, and provides data-driven insights to guide product-market fit decisions.',
    lastActive: '15 minutes ago',
  },
  {
    id: uuidv4(),
    name: 'Tech Architect',
    role: 'Technical Planning',
    status: 'Processing',
    iconName: 'Cpu',
    color: 'cyan',
    capabilities: ['System design', 'Tech stack selection', 'Scalability planning', 'API architecture'],
    usageStats: { tasksCompleted: 67, avgResponseTime: '3.2s', accuracy: '96%' },
    description:
      'Designs robust technical systems, recommends optimal tech stacks, and plans scalable architectures for AI-powered products.',
    lastActive: 'Active now',
  },
  {
    id: uuidv4(),
    name: 'PM Coach',
    role: 'Project Management',
    status: 'Active',
    iconName: 'ClipboardList',
    color: 'purple',
    capabilities: ['Sprint planning', 'Risk assessment', 'Stakeholder mapping', 'OKR alignment'],
    usageStats: { tasksCompleted: 203, avgResponseTime: '1.4s', accuracy: '93%' },
    description:
      'Coaches the team on best-in-class project management practices, OKR frameworks, and agile methodologies tailored to startup velocity.',
    lastActive: '5 minutes ago',
  },
  {
    id: uuidv4(),
    name: 'Data Scientist',
    role: 'Data & Analytics',
    status: 'Standby',
    iconName: 'Database',
    color: 'amber',
    capabilities: ['Predictive modeling', 'KPI dashboards', 'A/B testing', 'Data pipeline design'],
    usageStats: { tasksCompleted: 34, avgResponseTime: '4.1s', accuracy: '97%' },
    description:
      'Builds predictive models, designs KPI dashboards, and establishes data infrastructure to power evidence-based decisions.',
    lastActive: '2 hours ago',
  },
  {
    id: uuidv4(),
    name: 'UX Researcher',
    role: 'User Experience',
    status: 'Standby',
    iconName: 'Users',
    color: 'rose',
    capabilities: ['User interviews', 'Persona creation', 'Journey mapping', 'Usability testing'],
    usageStats: { tasksCompleted: 28, avgResponseTime: '2.8s', accuracy: '89%' },
    description:
      'Conducts user research, creates detailed personas, and maps customer journeys to ensure Miranki solves real consultant pain points.',
    lastActive: '3 hours ago',
  },
];

// ─── Phases / Deliverables ───────────────────────────────────────────────────

export const MIRANKI_PHASES: Phase[] = [
  {
    id: uuidv4(),
    name: 'Phase 1 — Foundation',
    progress: 100,
    deliverables: [
      { id: uuidv4(), name: 'Technical architecture document', status: 'completed' },
      { id: uuidv4(), name: 'Team formation & roles defined', status: 'completed' },
      { id: uuidv4(), name: 'Development environment setup', status: 'completed' },
      { id: uuidv4(), name: 'Core AI engine prototype', status: 'completed' },
      { id: uuidv4(), name: 'Initial investor pitch deck', status: 'completed' },
    ],
  },
  {
    id: uuidv4(),
    name: 'Phase 2 — Beta Development',
    progress: 60,
    deliverables: [
      { id: uuidv4(), name: 'PM Module core features', status: 'completed' },
      { id: uuidv4(), name: 'AI agent framework deployed', status: 'completed' },
      { id: uuidv4(), name: 'User testing with 10 PMs', status: 'in-progress' },
      { id: uuidv4(), name: 'Feedback integration loop', status: 'in-progress' },
      { id: uuidv4(), name: 'Beta launch to 50 users', status: 'pending' },
    ],
  },
  {
    id: uuidv4(),
    name: 'Phase 3 — Launch Preparation',
    progress: 0,
    deliverables: [
      { id: uuidv4(), name: 'Full consultant module suite', status: 'pending' },
      { id: uuidv4(), name: 'Onboarding flow finalized', status: 'pending' },
      { id: uuidv4(), name: 'Marketing site live', status: 'pending' },
      { id: uuidv4(), name: 'Payment integration', status: 'pending' },
      { id: uuidv4(), name: 'Public launch', status: 'pending' },
    ],
  },
];

// ─── Knowledge Base ──────────────────────────────────────────────────────────

export const MIRANKI_KB_DOCUMENTS: KBDocument[] = [
  {
    id: uuidv4(),
    name: 'Miranki_Vision_Document_v2.pdf',
    type: 'PDF',
    size: '2.4 MB',
    uploadedAt: 'Jan 15, 2024',
    status: 'indexed',
    usedByAgents: ['Strategy Advisor', 'PM Coach'],
  },
  {
    id: uuidv4(),
    name: 'Technical_Architecture_Spec.pdf',
    type: 'PDF',
    size: '5.1 MB',
    uploadedAt: 'Jan 22, 2024',
    status: 'indexed',
    usedByAgents: ['Tech Architect', 'Data Scientist'],
  },
  {
    id: uuidv4(),
    name: 'Market_Research_Q1_2024.csv',
    type: 'CSV',
    size: '890 KB',
    uploadedAt: 'Feb 3, 2024',
    status: 'indexed',
    usedByAgents: ['Market Analyst', 'Strategy Advisor'],
  },
  {
    id: uuidv4(),
    name: 'PM_Methodology_Framework.doc',
    type: 'DOC',
    size: '1.2 MB',
    uploadedAt: 'Feb 18, 2024',
    status: 'indexed',
    usedByAgents: ['PM Coach', 'UX Researcher'],
  },
  {
    id: uuidv4(),
    name: 'Competitor_Analysis_Report.txt',
    type: 'TXT',
    size: '340 KB',
    uploadedAt: 'Mar 5, 2024',
    status: 'indexed',
    usedByAgents: ['Market Analyst', 'Strategy Advisor'],
  },
];

// ─── Chat Responses ──────────────────────────────────────────────────────────

export const MIRANKI_CHAT_RESPONSES: Record<string, string> = {
  progress:
    "Miranki is currently 35% complete overall, with Year 1 actively in progress. The Platform Architecture and Core AI Engine v1 milestones are completed. The PM Module Beta is currently in progress targeting June 2024.",
  agents:
    "Miranki has 6 deployed AI agents: Strategy Advisor, Market Analyst, Tech Architect, PM Coach, Data Scientist, and UX Researcher. Each is specialized for startup development in the AI consulting space.",
  milestone:
    "The next upcoming milestone is Consultant Onboarding, targeted for September 2024, followed by the Public Launch in December 2024.",
  team: "The Miranki team has 3 members: Alex Rivera (Founder & CEO), Sam Chen (Lead Engineer), and Jordan Lee (AI Research Lead).",
  default:
    "I'm the Miranki Project Assistant. I have full context on this project's vision, team, agents, and roadmap. Ask me anything about Miranki's development progress, strategy, or technical architecture.",
};
