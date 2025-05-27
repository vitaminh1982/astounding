import React, { useState } from 'react';
import { Play, Pause } from 'lucide-react';
import { AgentType } from '../../types/agent';
// Import AIAgentInterface instead of AgentConfigModal
import AIAgentInterface from './AIAgentInterface';
import { AgentConfig } from '../../types/agent-config';

interface AgentCardProps {
  agent: AgentType;
}

export default function AgentCard({ agent }: AgentCardProps) {
  const [showInterface, setShowInterface] = useState(false);
  const isActive = agent.status === 'active';

  const mockConfig: AgentConfig = {
    id: 'AI_SC247_01',
    name: agent.name,
    status: isActive ? 'active' : 'inactive',
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

  return (
    <>
      <div
        className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => setShowInterface(true)} // Changed to show AIAgentInterface
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{agent.name}</h3>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-sm ${
                isActive ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
              }`}>
                {isActive ? 'Active' : 'Paused'}
              </span>
              {isActive ? (
                <Play className="w-4 h-4 text-gray-600" />
              ) : (
                <Pause className="w-4 h-4 text-gray-600" />
              )}
            </div>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <agent.icon className="w-4 h-4" />
            <span>{agent.metrics}</span>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {agent.skills.map((skill, index) => (
                <span 
                  key={index}
                  className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Use fixed positioning to make the AIAgentInterface take up the full screen */}
      {showInterface && (
        <div className="fixed inset-0 z-50">
          <AIAgentInterface onClose={() => setShowInterface(false)} />
        </div>
      )}
    </>
  );
}
