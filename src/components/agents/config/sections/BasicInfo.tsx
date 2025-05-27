import React from 'react';
import { AgentConfig } from '../../../../types/agent-config';

interface BasicInfoProps {
  agent: AgentConfig;
}

export default function BasicInfo({ agent }: BasicInfoProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Basic Information</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <div className="mt-1 p-2 border rounded-md">{agent.name}</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">ID</label>
          <div className="mt-1 p-2 border rounded-md">{agent.id}</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <div className="mt-1 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span>{agent.status === 'active' ? 'Active' : 'Inactive'}</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Last update</label>
          <div className="mt-1 p-2 border rounded-md">{agent.lastUpdate}</div>
        </div>
      </div>
    </div>
  );
}