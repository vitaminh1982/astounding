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
    <div className="bg-white dark:bg-surface-container-high rounded-lg shadow-sm dark:shadow-gray-900 border border-border dark:border-border p-6 transition-colors">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-foreground dark:text-foreground">Agent Usage</h3>
        <div className="p-2 bg-indigo-100 dark:bg-teal-900 rounded-lg transition-colors">
          <Bot className="w-5 h-5 text-primary-green dark:text-teal-300" />
        </div>
      </div>
      
      <div className="space-y-6">
        {sortedAgents.map((agent) => (
          <div key={agent.id} className="border border-border dark:border-border bg-white dark:bg-surface-container-highest rounded-lg p-4 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg mr-3 transition-colors ${
                  agent.isActive 
                    ? 'bg-green-100 dark:bg-green-900' 
                    : 'bg-surface-container-low dark:bg-surface-container-highest'
                }`}>
                  <Bot className={`w-5 h-5 ${
                    agent.isActive 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-muted-foreground dark:text-muted-foreground'
                  }`} />
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-foreground">{agent.name}</h4>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                    {((agent.messageCount / totalMessages) * 100).toFixed(1)}% of total messages
                  </p>
                </div>
              </div>
              <div className="text-sm px-2 py-1 rounded-full bg-surface-container-low dark:bg-surface-container-highest text-on-surface dark:text-on-surface-variant transition-colors">
                {agent.messageCount} messages
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-outline dark:text-muted-foreground mr-2" />
                <div>
                  <p className="text-xs text-muted-foreground dark:text-muted-foreground">Avg. Response Time</p>
                  <p className="font-medium text-foreground dark:text-foreground">{agent.responseTime}s</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-outline dark:text-muted-foreground mr-2" />
                <div>
                  <p className="text-xs text-muted-foreground dark:text-muted-foreground">Resolution Rate</p>
                  <p className="font-medium text-foreground dark:text-foreground">{agent.resolutionRate}%</p>
                </div>
              </div>
            </div>
            
            <div className="mt-3">
              <div className="w-full h-2 bg-surface-container dark:bg-surface-container-highest rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary dark:bg-primary transition-colors"
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
