/**
 * History tab component for chat session management
 */
import React from 'react';
import { Clock, Search } from 'lucide-react';
import SessionCard from './SessionCard';
import SessionDetailModal from './SessionDetailModal';
import { useChatHistory } from '../hooks/useChatHistory';
import { Agent } from '../types';

interface HistoryTabProps {
  agents: Agent[];
  onResumeSession: (sessionId: string) => void;
}

/**
 * HistoryTab displays and manages chat session history with filtering and grouping
 */
const HistoryTab: React.FC<HistoryTabProps> = ({ agents, onResumeSession }) => {
  const {
    historyFilter,
    setHistoryFilter,
    selectedSession,
    setSelectedSession,
    groupedSessions,
    handleViewSession,
    handleResumeSession
  } = useChatHistory();

  const handleResumeSessionWrapper = (session: any) => {
    handleResumeSession(session);
    onResumeSession(session.id);
  };

  return (
    <div className="flex flex-col h-full">
      {/* History Header with Filters */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Chat History</h3>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={historyFilter.search}
                onChange={(e) => setHistoryFilter(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>
            <select
              value={historyFilter.agent}
              onChange={(e) => setHistoryFilter(prev => ({ ...prev, agent: e.target.value }))}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="all">All Agents</option>
              {agents.map(agent => (
                <option key={agent.id} value={agent.name}>{agent.name}</option>
              ))}
            </select>
            <select
              value={historyFilter.groupBy}
              onChange={(e) => setHistoryFilter(prev => ({ ...prev, groupBy: e.target.value as 'agent' | 'date' }))}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="date">Group by Date</option>
              <option value="agent">Group by Agent</option>
            </select>
          </div>
        </div>
      </div>

      {/* History Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {Object.keys(groupedSessions).length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No chat history found</h3>
            <p className="text-gray-500">
              {historyFilter.search || historyFilter.agent !== 'all'
                ? 'Try adjusting your filters'
                : 'Previous conversations with agents will appear here'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedSessions).map(([groupKey, sessions]) => (
              <div key={groupKey}>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                  {historyFilter.groupBy === 'date' ? new Date(groupKey).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : groupKey}
                </h4>
                <div className="space-y-3">
                  {sessions.map((session) => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      onViewSession={handleViewSession}
                      onResumeSession={handleResumeSessionWrapper}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Session Detail Modal */}
      <SessionDetailModal
        session={selectedSession}
        onClose={() => setSelectedSession(null)}
        onResumeSession={handleResumeSessionWrapper}
      />
    </div>
  );
};

export default HistoryTab;