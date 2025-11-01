import React, { useState, useCallback, useMemo } from 'react';
import { Play, Pause, Stop } from 'lucide-react';
import type { AgentType } from '../../types/agent';
import AIAgentInterface from './AIAgentInterface';
import type { AgentConfig } from '../../types/agent-config';

interface AgentCardProps {
  agent: AgentType & { status: 'active' | 'inactive' | 'suspended' };
}

export default function AgentCard({ agent }: AgentCardProps) {
  const [showInterface, setShowInterface] = useState(false);

  // Normalize status → UI metadata (label, colors, icon)
  const statusMeta = useMemo(() => {
    switch (agent.status) {
      case 'active':
        return {
          label: 'Active',
          icon: Play,
          badgeClass:
            'bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400',
          iconClass: 'text-green-600 dark:text-green-400',
          openable: true,
        };
      case 'suspended':
        return {
          label: 'Suspended',
          icon: Pause,
          badgeClass:
            'bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400',
          iconClass: 'text-yellow-600 dark:text-yellow-400',
          openable: true, // allow viewing, or set to false if you want to block
        };
      case 'inactive':
      default:
        return {
          label: 'Inactive',
          icon: Stop,
          badgeClass:
            'bg-gray-100 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300',
          iconClass: 'text-gray-600 dark:text-gray-300',
          openable: false,
        };
    }
  }, [agent.status]);

  const StatusIcon = statusMeta.icon;
  const AgentIcon = agent.icon;

  const handleOpenInterface = useCallback(() => {
    if (!statusMeta.openable) return;
    setShowInterface(true);
  }, [statusMeta.openable]);

  const handleCloseInterface = useCallback(() => {
    setShowInterface(false);
  }, []);

  // If your AgentConfig.status supports 'suspended', this is fine.
  // Otherwise map 'suspended' → 'inactive' or adapt as needed.
  const configStatus: AgentConfig['status'] | 'suspended' =
    (['active', 'inactive', 'suspended'].includes(agent.status)
      ? agent.status
      : 'inactive') as AgentConfig['status'] | 'suspended';

  const mockConfig: AgentConfig = {
    id: 'AI_SC247_01',
    name: agent.name,
    // @ts-expect-error: if AgentConfig doesn't include 'suspended', update its type or map accordingly
    status: configStatus,
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
      bases: ['Product FAQ', 'Customer Service Procedures', 'Return Policy', 'Terms and Conditions'],
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
      sources: ['Past conversations', 'Customer feedback', 'Product updates', 'New procedures'],
      updateFrequency: 'daily'
    },
    integrations: ['CRM Enterprise', 'Knowledge base', 'Ticket system', 'Customer history'],
    metrics: {
      resolutionRate: 92,
      responseTime: '12s avg.',
      csatScore: 4.2
    }
  };

  const canOpen = statusMeta.openable;

  return (
    <>
      <div
        className={[
          'bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-200 border border-transparent dark:border-gray-700',
          canOpen
            ? 'cursor-pointer hover:border-indigo-200 dark:hover:border-teal-600'
            : 'cursor-not-allowed opacity-80 hover:border-transparent'
        ].join(' ')}
        onClick={canOpen ? handleOpenInterface : undefined}
        role={canOpen ? 'button' : 'group'}
        tabIndex={canOpen ? 0 : -1}
        onKeyDown={(e) => {
          if (!canOpen) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleOpenInterface();
          }
        }}
        aria-label={`Open ${agent.name} agent interface`}
        aria-disabled={!canOpen}
        title={!canOpen ? 'Agent inactive' : undefined}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 transition-colors">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors">
              {agent.name}
            </h3>
            <div className="flex items-center gap-2">
              {/* Status Badge */}
              <span
                className={[
                  'px-2 py-1 rounded-full text-xs font-medium transition-colors',
                  statusMeta.badgeClass
                ].join(' ')}
              >
                {statusMeta.label}
              </span>
              {/* Status Icon */}
              <StatusIcon className={`w-4 h-4 transition-colors ${statusMeta.iconClass}`} />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          {/* Metrics */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 transition-colors">
            <AgentIcon className="w-4 h-4" />
            <span>{agent.metrics}</span>
          </div>

          {/* Skills */}
          {agent.skills?.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 transition-colors">
                Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {agent.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-indigo-50 dark:bg-teal-900/30 border border-indigo-200 dark:border-teal-800 text-indigo-600 dark:text-teal-400 px-3 py-1 rounded-full text-xs font-medium transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full Screen AI Agent Interface Modal */}
      {showInterface && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 transition-colors">
          <AIAgentInterface onClose={handleCloseInterface} config={mockConfig} />
        </div>
      )}
    </>
  );
}
