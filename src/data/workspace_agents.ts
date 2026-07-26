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
    avatar: '/assets/images/agents/agent-customersupport.jpg',
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
    avatar: '/assets/images/agents/agent-projectmanager.jpg',
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
    avatar: '/assets/images/agents/agent-businessanalyst.jpg',
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
    avatar: '/assets/images/agents/agent-dataanalyst.jpg',
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
    avatar: '/assets/images/agents/agent-industryexpert.jpg',
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
    avatar: '/assets/images/agents/agent-pmo.jpg',
    email: 'pmo.agent@sendplex.ai'
  },
];
