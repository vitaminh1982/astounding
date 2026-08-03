export interface WorkspaceAgent {
  id: string;
  name: string;
  role: string;
  type: string;
  status: 'active' | 'paused' | 'inactive';
  purpose: string;
  capabilities: string[];
  avatar: string;
  email: string;
}

export const WORKSPACE_AGENTS: WorkspaceAgent[] = [
  {
    id: 'agent-001',
    name: 'Aria',
    role: 'Customer Support 24/7',
    type: 'Support',
    status: 'active',
    purpose: "Gère les demandes de support client et les requêtes d'assistance en continu.",
    capabilities: ['Natural Language Processing', 'Sentiment Analysis', 'Escalation Management', 'Multi-language Support'],
    avatar: '/assets/images/agents/agent-customersupport.jpg',
    email: 'aria@sendplex.ai'
  },
  {
    id: 'agent-002',
    name: 'Oscar',
    role: 'Project Manager',
    type: 'Project Management',
    status: 'active',
    purpose: 'Planifie, coordonne et livre les projets dans le respect des délais, du budget et du périmètre.',
    capabilities: ['Milestone Planning', 'Scope Definition', 'Resource Allocation', 'Risk Management', 'Agile Facilitation'],
    avatar: '/assets/images/agents/agent-projectmanager.jpg',
    email: 'oscar@sendplex.ai'
  },
  {
    id: 'agent-003',
    name: 'Zara',
    role: 'Business Analyst',
    type: 'Business Analysis',
    status: 'active',
    purpose: 'Recueille les besoins, modélise les processus et traduit les exigences en spécifications claires.',
    capabilities: ['Requirements Elicitation', 'Process Modeling (BPMN)', 'User Stories', 'Gap Analysis', 'Value Stream Mapping'],
    avatar: '/assets/images/agents/agent-businessanalyst.jpg',
    email: 'zara@sendplex.ai'
  },
  {
    id: 'agent-004',
    name: 'Max',
    role: 'Data Analyst',
    type: 'Data Analytics',
    status: 'active',
    purpose: "Explore, analyse et visualise les données pour produire des rapports d'activité et des prévisions.",
    capabilities: ['SQL Queries', 'Data Wrangling', 'Dashboarding', 'A/B Testing', 'Time-Series Forecasting'],
    avatar: '/assets/images/agents/agent-dataanalyst.jpg',
    email: 'max@sendplex.ai'
  },
  {
    id: 'agent-005',
    name: 'Nova',
    role: 'Industry Expert (Finance)',
    type: 'Industry Expertise',
    status: 'active',
    purpose: 'Fournit des conseils sectoriels dans le domaine de la finance et des flux de paiements réglementés.',
    capabilities: ['Regulatory (PSD2, SEPA)', 'Payment Flows', 'Risk & Compliance', 'Customer Journey Optimization'],
    avatar: '/assets/images/agents/agent-industryexpert.jpg',
    email: 'nova@sendplex.ai'
  },
  {
    id: 'agent-006',
    name: 'Eli',
    role: 'PMO Analyst',
    type: 'PMO',
    status: 'paused',
    purpose: 'Standardise la livraison, assure la gouvernance et fournit des analyses au niveau du portefeuille.',
    capabilities: ['Portfolio Reporting', 'RAID Governance', 'Capacity Planning', 'Budget Tracking', 'OKR/KPI Frameworks'],
    avatar: '/assets/images/agents/agent-pmo.jpg',
    email: 'eli@sendplex.ai'
  },
];

