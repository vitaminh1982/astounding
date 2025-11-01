import React, { useContext } from 'react';
import { MessageSquare, Users, Brain, Bot, Mail, ShoppingCart, CreditCard, HelpCircle, Headphones, Globe, BookOpen, BarChart, Calendar, Shield, Scale, ClipboardCheck, Compass, Target, ChartLine, UserCheck, Megaphone } from 'lucide-react';
import AgentCard from './AgentCard';
import { AgentType } from '../../types/agent';
import { LanguageContext } from '../../context/LanguageContext';

export default function AgentsGrid() {
  const { t } = useContext(LanguageContext);

  const agents: AgentType[] = [
    {
      id: 1,
      name: t('agents.list.customerSupport.name'),
      status: 'active',
      icon: MessageSquare,
      metrics: t('agents.list.customerSupport.metrics'),
      skills: [
        t('agents.skills.support'),
        t('agents.skills.escalation'),
        t('agents.skills.faq'),
        t('agents.skills.problemSolving')
      ],
    },
    {
      id: 2,
      name: t('agents.list.projectManager.name'),          // "AI Project Manager"
      status: 'active',
      icon: ClipboardCheck,
      metrics: t('agents.list.projectManager.metrics'),    // e.g., "23 milestones delivered"
      skills: [
        t('agents.skills.roadmapping'),
        t('agents.skills.riskManagement'),
        t('agents.skills.stakeholderComms'),
        t('agents.skills.agileScrum'),
      ],
    },
    {
      id: 3,
      name: t('agents.list.businessAnalyst.name'),         // "AI Business Analyst"
      status: 'active',
      icon: BarChart,
      metrics: t('agents.list.businessAnalyst.metrics'),   // e.g., "68 requirements clarified"
      skills: [
        t('agents.skills.requirements'),
        t('agents.skills.processModeling'),
        t('agents.skills.userStories'),
        t('agents.skills.acceptanceCriteria'),
      ],
    },
    {
      id: 4,
      name: t('agents.list.dataAnalyst.name'),             // "AI Data Analyst"
      status: 'active',
      icon: ChartLine,
      metrics: t('agents.list.dataAnalyst.metrics'),       // e.g., "34 insights generated"
      skills: [
        t('agents.skills.dataPrep'),
        t('agents.skills.sql'),
        t('agents.skills.dashboarding'),
        t('agents.skills.anomalyDetection'),
      ],
    },
    {
      id: 5,
      name: t('agents.list.industryExpert.name'),          // "AI Industry Expert (Finance & Payments)"
      status: 'active',
      icon: Shield,
      metrics: t('agents.list.industryExpert.metrics'),    // e.g., "26 compliance advisories"
      skills: [
        t('agents.skills.compliance'),
        t('agents.skills.payments'),
        t('agents.skills.riskControls'),
        t('agents.skills.bestPractices'),
      ],
    },
    {
      id: 6,
      name: t('agents.list.pmoAnalyst.name'),              // "AI PMO Analyst"
      status: 'active',
      icon: Compass,
      metrics: t('agents.list.pmoAnalyst.metrics'),        // e.g., "9 portfolio reports published"
      skills: [
        t('agents.skills.portfolioHealth'),
        t('agents.skills.governance'),
        t('agents.skills.reporting'),
        t('agents.skills.resourcePlanning'),
      ],
    },
 
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {agents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  );
}
