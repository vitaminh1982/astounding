import React, { useState, useContext } from 'react';
import { Search, Bot, MessageCircle, AlertCircle, Users } from 'lucide-react';
import { AgentConfig } from '../../../types/agent-config';
import AgentConfigModal from '../agents/config/AgentConfigModal';
import { LanguageContext } from '../../context/LanguageContext';

// Mock data for agents
const agents = [
  {
    id: 1,
    name: 'customerSupport',
    type: 'customerSupport',
    status: 'active',
    icon: MessageCircle,
    conversations: 156,
    satisfaction: 98,
  },
  {
    id: 2,
    name: 'salesAssistant',
    type: 'salesAssistant',
    status: 'active',
    icon: Bot,
    conversations: 89,
    satisfaction: 95,
  },
  {
    id: 3,
    name: 'complaintsService',
    type: 'complaintsService',
    status: 'active',
    icon: AlertCircle,
    conversations: 45,
    satisfaction: 92,
  },
  {
    id: 4,
    name: 'hrAssistant',
    type: 'hrAssistant',
    status: 'inactive',
    icon: Users,
    conversations: 67,
    satisfaction: 96,
  },
];

interface AgentsListProps {
  onAgentSelect?: (agent: AgentConfig) => void;
}

export default function AgentsList({ onAgentSelect }: AgentsListProps) {
  const { t } = useContext(LanguageContext);
  const [selectedAgent, setSelectedAgent] = useState<AgentConfig | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const createMockConfig = (agent: any): AgentConfig => ({
    id: `AI_${agent.id}`,
    name: t(`agentsList.agents.${agent.name}.name`),
    status: agent.status,
    lastUpdate: '15/03/2024 14:30',
    communication: {
      style: ['professional', 'empathetic', 'solution-oriented'],
      language: ['formal', 'courteous'],
      customTone: `You are Lucia, a professional and caring virtual customer service assistant, available 24/7. Your mission is to provide efficient and personalized first-level customer support.

Operating principles:

Always maintain a courteous, empathetic, and professional tone
Start each interaction with a brief introduction
Quickly identify the nature of the customer's request
Provide clear, precise, and structured responses
Remain patient and understanding even in difficult situations

Main skills:

Answer frequently asked questions by consulting the knowledge base
Solve first-level problems autonomously
Politely escalate complex cases to specialized services
Ensure follow-up until complete problem resolution
Collect customer feedback to improve service

Limitations and escalation:

If a request exceeds your capabilities, direct the customer to the appropriate service
For urgent or critical cases, provide relevant emergency contacts
Never make promises you cannot keep
Honestly admit when you cannot answer a question

For each interaction:

Warmly greet the customer
Listen to and analyze their request
Propose an adapted solution
Verify customer satisfaction
End the interaction professionally

Remember that your main goal is customer satisfaction while respecting company procedures and policies.`
    },
    knowledge: {
      bases: ['Product FAQ', 'After-Sales Procedures', 'Return Policy', 'Terms and Conditions'],
      languages: [
        { code: 'fr', name: 'French', flag: '🇫🇷', level: 'Native' },
        { code: 'en', name: 'English', flag: '🇬🇧', level: 'Advanced' },
        { code: 'nl', name: 'Dutch', flag: '🇳🇱', level: 'Intermediate' }
      ]
    },
    rules: {
      availability: '24/7',
      thresholds: {
        maxResponseTime: 30,
        maxSessionDuration: 15,
        maxAttempts: 3,
        confidenceScore: 85
      },
      escalationConditions: [
        'Explicit customer request',
        'Confidence score < 85%',
        'Sensitive topic detected',
        'Multiple failed attempts'
      ]
    },
    learning: {
      sources: [
        'Past conversations',
        'Customer feedback',
        'Product updates',
        'New procedures'
      ],
      updateFrequency: 'daily'
    },
    integrations: [
      'CRM Enterprise',
      'Knowledge base',
      'Ticket system',
      'Customer history'
    ],
    metrics: {
      resolutionRate: 92,
      responseTime: '12s avg.',
      csatScore: 4.2
    }
  });

  const handleAgentClick = (agent: any) => {
    const config = createMockConfig(agent);
    setSelectedAgent(config);
    if (onAgentSelect) {
      onAgentSelect(config);
    }
  };

  const handleSave = (config: AgentConfig) => {
    console.log('Saving config:', config);
    setSelectedAgent(null);
  };

  const filteredAgents = agents.filter(agent =>
    t(`agentsList.agents.${agent.name}.name`)
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) ||
    t(`agentsList.agents.${agent.type}.type`)
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header with search bar */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              {t('agentsList.title')}
            </h2>
            <span className="text-sm text-gray-500 ml-2">({filteredAgents.length})</span>
          </div>
          
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('agentsList.searchPlaceholder')}
              className="w-full sm:w-64 pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Agents list */}
      <div className="divide-y divide-gray-200">
        {filteredAgents.map((agent) => (
          <div 
            key={agent.id}
            onClick={() => handleAgentClick(agent)}
            className="p-4 sm:p-6 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Agent information */}
              <div className="flex items-start sm:items-center gap-4 flex-1">
                <div className="p-2 bg-indigo-100 rounded-lg flex-shrink-0">
                  <agent.icon className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-sm sm:text-base text-gray-900 truncate">
                    {t(`agentsList.agents.${agent.name}.name`)}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 sm:line-clamp-1 mt-0.5">
                    {t(`agentsList.agents.${agent.type}.type`)}
                  </p>
                </div>
              </div>

              {/* Metrics and status */}
              <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 mt-2 sm:mt-0">
                <div className="grid grid-cols-2 sm:flex gap-4 sm:gap-6">
                  <div className="text-center sm:text-right">
                    <p className="text-sm font-medium text-gray-900">{agent.conversations}</p>
                    <p className="text-xs text-gray-500">{t('agentsList.metrics.discussions')}</p>
                  </div>
                  <div className="text-center sm:text-right">
                    <p className="text-sm font-medium text-gray-900">{agent.satisfaction}%</p>
                    <p className="text-xs text-gray-500">{t('agentsList.metrics.satisfaction')}</p>
                  </div>
                </div>
                
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  agent.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {t(`agentsList.status.${agent.status}`)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredAgents.length === 0 && (
        <div className="p-8 text-center">
          <p className="text-gray-500 text-sm">{t('agentsList.emptyState')}</p>
        </div>
      )}

      {/* Configuration modal */}
      {selectedAgent && !onAgentSelect && (
        <AgentConfigModal
          agent={selectedAgent}
          onClose={() => setSelectedAgent(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
