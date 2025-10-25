import React from 'react';
import AgentsHeader from '../components/agents/AgentsHeader';
import AgentsSearch from '../components/agents/AgentsSearch';
import AgentsGrid from '../components/agents/AgentsGrid';

export default function AIAgentsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Container principal avec padding responsive */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <AgentsHeader />
        <AgentsSearch />
        <AgentsGrid />
      </div>
    </div>
  );
}
