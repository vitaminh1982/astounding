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
    name: 'Customer Support 24/7',
    role: 'Support Client',
    type: 'Support',
    status: 'active',
    purpose: "Gère les demandes de support client et les requêtes d'assistance en continu.",
    capabilities: ['Natural Language Processing', 'Sentiment Analysis', 'Escalation Management', 'Multi-language Support'],
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200',
    email: 'support.agent@sendplex.ai'
  },
  {
    id: 'agent-002',
    name: 'AI Project Manager',
    role: 'Gestion de Projet',
    type: 'Project Management',
    status: 'active',
    purpose: 'Planifie, coordonne et livre les projets dans le respect des délais, du budget et du périmètre.',
    capabilities: ['Milestone Planning', 'Scope Definition', 'Resource Allocation', 'Risk Management', 'Agile Facilitation'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200',
    email: 'pm.agent@sendplex.ai'
  },
  {
    id: 'agent-003',
    name: 'AI Business Analyst',
    role: 'Analyse Métier',
    type: 'Business Analysis',
    status: 'active',
    purpose: 'Recueille les besoins, modélise les processus et traduit les exigences en spécifications claires.',
    capabilities: ['Requirements Elicitation', 'Process Modeling (BPMN)', 'User Stories', 'Gap Analysis', 'Value Stream Mapping'],
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200',
    email: 'ba.agent@sendplex.ai'
  },
  {
    id: 'agent-004',
    name: 'AI Data Analyst',
    role: 'Analyse de Données',
    type: 'Data Analytics',
    status: 'active',
    purpose: "Explore, analyse et visualise les données pour produire des rapports d'activité et des prévisions.",
    capabilities: ['SQL Queries', 'Data Wrangling', 'Dashboarding', 'A/B Testing', 'Time-Series Forecasting'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200',
    email: 'data.agent@sendplex.ai'
  },
  {
    id: 'agent-005',
    name: 'AI Industry Expert (Finance)',
    role: 'Expertise Sectorielle',
    type: 'Industry Expertise',
    status: 'active',
    purpose: 'Fournit des conseils sectoriels dans le domaine de la finance et des flux de paiements réglementés.',
    capabilities: ['Regulatory (PSD2, SEPA)', 'Payment Flows', 'Risk & Compliance', 'Customer Journey Optimization'],
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200',
    email: 'finance.agent@sendplex.ai'
  },
  {
    id: 'agent-006',
    name: 'AI PMO Analyst',
    role: 'Analyste PMO',
    type: 'PMO',
    status: 'paused',
    purpose: 'Standardise la livraison, assure la gouvernance et fournit des analyses au niveau du portefeuille.',
    capabilities: ['Portfolio Reporting', 'RAID Governance', 'Capacity Planning', 'Budget Tracking', 'OKR/KPI Frameworks'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200',
    email: 'pmo.agent@sendplex.ai'
  },
];
