import React from 'react';
import { AgentConfig } from '../../../../types/agent-config';

interface BasicInfoProps {
  agent: AgentConfig;
}

export default function BasicInfo({ agent }: BasicInfoProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Basic Information</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Name</label>
          <div className="mt-1 p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md transition-colors">{agent.name}</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">ID</label>
          <div className="mt-1 p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md transition-colors">{agent.id}</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Status</label>
          <div className="mt-1 flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${agent.status === 'active' ? 'bg-green-500 dark:bg-green-400' : 'bg-red-500 dark:bg-red-400'} transition-colors`}></span>
            <span className="text-gray-900 dark:text-gray-100">{agent.status === 'active' ? 'Active' : 'Inactive'}</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Last update</label>
          <div className="mt-1 p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md transition-colors">{agent.lastUpdate}</div>
        </div>
      </div>
    </div>
  );
}
