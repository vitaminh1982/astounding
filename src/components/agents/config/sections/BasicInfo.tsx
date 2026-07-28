import React from 'react';
import { AgentConfig } from '../../../../types/agent-config';

interface BasicInfoProps {
  agent: AgentConfig;
}

export default function BasicInfo({ agent }: BasicInfoProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground dark:text-foreground">Basic Information</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-on-surface dark:text-on-surface-variant">Name</label>
          <div className="mt-1 p-2 border border-border dark:border-border bg-white dark:bg-surface-container-highest text-foreground dark:text-foreground rounded-md transition-colors">{agent.name}</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-on-surface dark:text-on-surface-variant">ID</label>
          <div className="mt-1 p-2 border border-border dark:border-border bg-white dark:bg-surface-container-highest text-foreground dark:text-foreground rounded-md transition-colors">{agent.id}</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-on-surface dark:text-on-surface-variant">Status</label>
          <div className="mt-1 flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${agent.status === 'active' ? 'bg-green-500 dark:bg-green-400' : 'bg-destructive dark:bg-destructive'} transition-colors`}></span>
            <span className="text-foreground dark:text-foreground">{agent.status === 'active' ? 'Active' : 'Inactive'}</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-on-surface dark:text-on-surface-variant">Last update</label>
          <div className="mt-1 p-2 border border-border dark:border-border bg-white dark:bg-surface-container-highest text-foreground dark:text-foreground rounded-md transition-colors">{agent.lastUpdate}</div>
        </div>
      </div>
    </div>
  );
}
