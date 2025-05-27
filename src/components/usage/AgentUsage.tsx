import React from 'react';
import { Bot, Clock, CheckCircle } from 'lucide-react';
import { UsageMetrics } from '../../types/usage';

interface AgentUsageProps {
  usageData: UsageMetrics;
}

export default function AgentUsage({ usageData }: AgentUsageProps) {
  const { agents } = usageData;
  
  // Sort agents by message count (descending)
  const sortedAgents = [...agents].sort((a, b) => b.messageCount - a.messageCount);
  
  // Calculate total messages across all agents
  const totalMessages = agents.reduce((sum, agent) => sum + agent.messageCount, 0);
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Agent Usage</h3>
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Bot className="w-5 h-5 text-indigo-600" />
        </div>
      </div>
      
      <div className="space-y-6">
        {sortedAgents.map((agent) => (
          <div key={agent.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${agent.isActive ? 'bg-green-100' : 'bg-gray-100'} mr-3`}>
                  <Bot className={`w-5 h-5 ${agent.isActive ? 'text-green-600' : 'text-gray-500'}`} />
                </div>
                <div>
                  <h4 className="font-medium">{agent.name}</h4>
                  <p className="text-sm text-gray-500">
                    {((agent.messageCount / totalMessages) * 100).toFixed(1)}% of total messages
                  </p>
                </div>
              </div>
              <div className="text-sm px-2 py-1 rounded-full bg-gray-100">
                {agent.messageCount} messages
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-gray-400 mr-2" />
                <div>
                  <p className="text-xs text-gray-500">Avg. Response Time</p>
                  <p className="font-medium">{agent.responseTime}s</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-gray-400 mr-2" />
                <div>
                  <p className="text-xs text-gray-500">Resolution Rate</p>
                  <p className="font-medium">{agent.resolutionRate}%</p>
                </div>
              </div>
            </div>
            
            <div className="mt-3">
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500"
                  style={{ width: `${(agent.messageCount / totalMessages) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}