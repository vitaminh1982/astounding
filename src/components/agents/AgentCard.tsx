import React, { useState, useCallback } from 'react';
import { Play, Pause, Square } from 'lucide-react';
import { AgentType } from '../../types/agent';
import AIAgentInterface from './AIAgentInterface';
import { AgentConfig } from '../../types/agent-config';

interface AgentCardProps {
  agent: AgentType;
}

// Status configuration mapping
const STATUS_CONFIG = {
  active: {
    label: 'Active',
    icon: Play,
    badgeClasses: 'bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400',
    iconClasses: 'text-green-600 dark:text-green-400',
  },
  suspended: {
    label: 'Suspended',
    icon: Pause,
    badgeClasses: 'bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400',
    iconClasses: 'text-yellow-600 dark:text-yellow-400',
  },
  inactive: {
    label: 'Inactive',
    icon: Square,
    badgeClasses: 'bg-surface-container-low dark:bg-surface-container-highest/50 border border-border dark:border-border text-on-surface dark:text-muted-foreground',
    iconClasses: 'text-muted-foreground dark:text-muted-foreground',
  },
} as const;

export default function AgentCard({ agent }: AgentCardProps) {
  const [showInterface, setShowInterface] = useState(false);
  const statusConfig = STATUS_CONFIG[agent.status] || STATUS_CONFIG.inactive;
  const StatusIcon = statusConfig.icon;

  const handleOpenInterface = useCallback(() => {
    // Only allow opening if agent is active or suspended (not fully inactive)
    if (agent.status !== 'inactive') {
      setShowInterface(true);
    }
  }, [agent.status]);

  const handleCloseInterface = useCallback(() => {
    setShowInterface(false);
  }, []);

  const mockConfig: AgentConfig = {
    id: 'AI_SC247_01',
    name: agent.name,
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
  };

  const isClickable = agent.status !== 'inactive';

  return (
    <>
      <div
        className={`bg-white dark:bg-surface-container-high rounded-lg shadow dark:shadow-gray-900 transition-all duration-200 border border-transparent dark:border-border ${
          isClickable
            ? 'hover:shadow-lg dark:hover:shadow-gray-900/50 hover:border-indigo-200 dark:hover:border-green-600 cursor-pointer'
            : 'opacity-60 cursor-not-allowed'
        }`}
        onClick={isClickable ? handleOpenInterface : undefined}
        role="button"
        tabIndex={isClickable ? 0 : -1}
        onKeyDown={(e) => {
          if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            handleOpenInterface();
          }
        }}
        aria-label={`${isClickable ? 'Open' : 'View'} ${agent.name} agent interface`}
        aria-disabled={!isClickable}
      >
        {/* Header */}
        <div className="p-4 border-b border-border dark:border-border transition-colors">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground dark:text-foreground transition-colors">
              {agent.name}
            </h3>
            <div className="flex items-center gap-2">
              {/* Status Badge */}
              <span className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${statusConfig.badgeClasses}`}>
                {statusConfig.label}
              </span>
              {/* Status Icon */}
              <StatusIcon className={`w-4 h-4 transition-colors ${statusConfig.iconClasses}`} />
            </div>
          </div>
        </div>
        
        {/* Body */}
        <div className="p-4 space-y-4">
          {/* Metrics */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-muted-foreground transition-colors">
            <agent.icon className="w-4 h-4" />
            <span>{agent.metrics}</span>
          </div>
          
          {/* Skills */}
          <div className="space-y-2">
            <h4 className="font-medium text-foreground dark:text-foreground transition-colors">
              Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {agent.skills.map((skill, index) => (
                <span 
                  key={index}
                  className="bg-indigo-50 dark:bg-green-900/30 border border-indigo-200 dark:border-green-800 text-primary-green dark:text-green-400 px-3 py-1 rounded-full text-xs font-medium transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Inactive message */}
          {agent.status === 'inactive' && (
            <div className="pt-2 border-t border-border dark:border-border">
              <p className="text-xs text-muted-foreground dark:text-muted-foreground italic">
                This agent is currently inactive and cannot be accessed.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Full Screen AI Agent Interface Modal */}
      {showInterface && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-background transition-colors">
          <AIAgentInterface onClose={handleCloseInterface} />
        </div>
      )}
    </>
  );
}
