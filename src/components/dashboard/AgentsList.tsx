import React, { useState, useContext, useMemo, useCallback } from 'react';
import { Search, Bot, MessageCircle, AlertCircle, Users, ChevronRight, X } from 'lucide-react';
import { AgentConfig } from '../../../types/agent-config';
import AgentConfigModal from '../agents/config/AgentConfigModal';
import { LanguageContext } from '../../context/LanguageContext';

// Mock data for agents with enhanced type safety
const agents = [
  {
    id: 1,
    name: 'customerSupport',
    type: 'customerSupport',
    status: 'active' as const,
    icon: MessageCircle,
    conversations: 156,
    satisfaction: 98,
    color: 'indigo',
  },
  {
    id: 2,
    name: 'salesAssistant',
    type: 'salesAssistant',
    status: 'active' as const,
    icon: Bot,
    conversations: 89,
    satisfaction: 95,
    color: 'blue',
  },
  {
    id: 3,
    name: 'complaintsService',
    type: 'complaintsService',
    status: 'active' as const,
    icon: AlertCircle,
    conversations: 45,
    satisfaction: 92,
    color: 'orange',
  },
  {
    id: 4,
    name: 'hrAssistant',
    type: 'hrAssistant',
    status: 'inactive' as const,
    icon: Users,
    conversations: 67,
    satisfaction: 96,
    color: 'purple',
  },
];

interface AgentsListProps {
  onAgentSelect?: (agent: AgentConfig) => void;
}

export default function AgentsList({ onAgentSelect }: AgentsListProps) {
  const { t } = useContext(LanguageContext);
  const [selectedAgent, setSelectedAgent] = useState<AgentConfig | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredAgent, setHoveredAgent] = useState<number | null>(null);

  // Color configurations for agent types
  const colorConfig = useMemo(() => ({
    indigo: {
      bg: 'bg-indigo-100 dark:bg-indigo-900/20',
      hoverBg: 'group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/30',
      icon: 'text-indigo-600 dark:text-indigo-400',
      border: 'border-indigo-200 dark:border-indigo-800',
    },
    blue: {
      bg: 'bg-blue-100 dark:bg-blue-900/20',
      hoverBg: 'group-hover:bg-blue-200 dark:group-hover:bg-blue-900/30',
      icon: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800',
    },
    orange: {
      bg: 'bg-orange-100 dark:bg-orange-900/20',
      hoverBg: 'group-hover:bg-orange-200 dark:group-hover:bg-orange-900/30',
      icon: 'text-orange-600 dark:text-orange-400',
      border: 'border-orange-200 dark:border-orange-800',
    },
    purple: {
      bg: 'bg-purple-100 dark:bg-purple-900/20',
      hoverBg: 'group-hover:bg-purple-200 dark:group-hover:bg-purple-900/30',
      icon: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-200 dark:border-purple-800',
    },
  }), []);

  const createMockConfig = useCallback((agent: typeof agents[0]): AgentConfig => ({
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
  }), [t]);

  const handleAgentClick = useCallback((agent: typeof agents[0]) => {
    const config = createMockConfig(agent);
    setSelectedAgent(config);
    if (onAgentSelect) {
      onAgentSelect(config);
    }
  }, [createMockConfig, onAgentSelect]);

  const handleSave = useCallback((config: AgentConfig) => {
    console.log('Saving config:', config);
    setSelectedAgent(null);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const filteredAgents = useMemo(() => 
    agents.filter(agent =>
      t(`agentsList.agents.${agent.name}.name`)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      t(`agentsList.agents.${agent.type}.type`)
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    ), [searchQuery, t]
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-200">
      {/* Header with search bar */}
      <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 transition-colors">
              {t('agentsList.title')}
            </h2>
            <span className="inline-flex items-center justify-center min-w-[2rem] h-6 px-2 ml-3 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors">
              {filteredAgents.length}
            </span>
          </div>
          
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('agentsList.searchPlaceholder')}
              className="w-full sm:w-64 pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
              aria-label={t('agentsList.searchPlaceholder')}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 transition-colors" />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                aria-label="Clear search"
              >
                <X className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Agents list */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700 transition-colors">
        {filteredAgents.map((agent) => {
          const colors = colorConfig[agent.color as keyof typeof colorConfig];
          const isHovered = hoveredAgent === agent.id;
          
          return (
            <div 
              key={agent.id}
              onClick={() => handleAgentClick(agent)}
              onMouseEnter={() => setHoveredAgent(agent.id)}
              onMouseLeave={() => setHoveredAgent(null)}
              className="group p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Agent information */}
                <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                  {/* Icon */}
                  <div className={`p-2.5 ${colors.bg} ${colors.hoverBg} rounded-xl flex-shrink-0 transition-all duration-200 ${isHovered ? 'scale-110' : ''}`}>
                    <agent.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${colors.icon} transition-colors`} />
                  </div>
                  
                  {/* Name and Type */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100 truncate transition-colors">
                        {t(`agentsList.agents.${agent.name}.name`)}
                      </h3>
                      <ChevronRight className={`h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0 transition-all duration-200 ${isHovered ? 'translate-x-1' : ''}`} />
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-2 sm:line-clamp-1 mt-1 transition-colors">
                      {t(`agentsList.agents.${agent.type}.type`)}
                    </p>
                  </div>
                </div>

                {/* Metrics and status */}
                <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 mt-2 sm:mt-0">
                  {/* Metrics */}
                  <div className="grid grid-cols-2 sm:flex gap-4 sm:gap-6">
                    <div className="text-center sm:text-right">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 transition-colors">
                        {agent.conversations}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
                        {t('agentsList.metrics.discussions')}
                      </p>
                    </div>
                    <div className="text-center sm:text-right">
                      <div className="flex items-center justify-center sm:justify-end gap-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 transition-colors">
                          {agent.satisfaction}%
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
                        {t('agentsList.metrics.satisfaction')}
                      </p>
                    </div>
                  </div>
                  
                  {/* Status badge */}
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    agent.status === 'active' 
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' 
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                      agent.status === 'active'
                        ? 'bg-green-500 dark:bg-green-400'
                        : 'bg-gray-400 dark:bg-gray-500'
                    }`} />
                    {t(`agentsList.status.${agent.status}`)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredAgents.length === 0 && (
        <div className="p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4 transition-colors">
            <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium transition-colors">
            {t('agentsList.emptyState')}
          </p>
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="mt-4 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors"
            >
              {t('agentsList.clearSearch') || 'Clear search'}
            </button>
          )}
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
