/**
 * History tab component - Enhanced Timeline View
 */
import React from 'react';
import { 
  Clock, 
  Search, 
  Filter, 
  Grid3x3, 
  List,
  Download,
  Trash2,
  TrendingUp,
  MessageSquare,
  Calendar as CalendarIcon
} from 'lucide-react';
import SessionCard from './SessionCard';
import SessionDetailModal from './SessionDetailModal';
import { useChatHistory } from '../hooks/useChatHistory';
import { Agent } from '../types';

interface HistoryTabProps {
  agents: Agent[];
  onResumeSession: (sessionId: string) => void;
}

type ViewMode = 'timeline' | 'grid';

/**
 * HistoryTab displays chat history with timeline and grid views
 */
const HistoryTab: React.FC<HistoryTabProps> = ({ agents, onResumeSession }) => {
  const {
    historyFilter,
    setHistoryFilter,
    selectedSession,
    setSelectedSession,
    groupedSessions,
    handleViewSession,
    handleResumeSession,
    getHistoryStats
  } = useChatHistory();

  const [viewMode, setViewMode] = React.useState<ViewMode>('timeline');

  const handleResumeSessionWrapper = (session: any) => {
    handleResumeSession(session);
    onResumeSession(session.id);
  };

  const stats = getHistoryStats();
  const showFilters = historyFilter.agent !== 'all' || historyFilter.search !== '';
  const totalSessions = Object.values(groupedSessions).flat().length;

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600 shadow-sm dark:shadow-gray-900 transition-colors">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Chat History</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Review and manage your conversations with AI agents
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-4">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-teal-900/20 dark:to-teal-800/20 rounded-xl px-4 py-3 border border-indigo-200 dark:border-teal-700 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-teal-400" />
                  <span className="text-xs font-medium text-indigo-600 dark:text-teal-400">Total Sessions</span>
                </div>
                <div className="text-2xl font-bold text-indigo-900 dark:text-teal-300">{stats.totalSessions}</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl px-4 py-3 border border-green-200 dark:border-green-700 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">This Week</span>
                </div>
                <div className="text-2xl font-bold text-green-900 dark:text-green-300">{stats.thisWeek}</div>
              </div>
            </div>
          </div>

          {/* Filters and View Controls */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search conversations, agents, topics..."
                  value={historyFilter.search}
                  onChange={(e) => setHistoryFilter(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:border-indigo-500 dark:focus:border-teal-500 text-sm w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all"
                />
              </div>

              {/* Agent Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 pointer-events-none" />
                <select
                  value={historyFilter.agent}
                  onChange={(e) => setHistoryFilter(prev => ({ ...prev, agent: e.target.value }))}
                  className="pl-10 pr-10 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:border-indigo-500 dark:focus:border-teal-500 min-w-[150px] transition-all"
                >
                  <option value="all">All Agents</option>
                  {agents.map(agent => (
                    <option key={agent.id} value={agent.name}>{agent.name}</option>
                  ))}
                </select>
              </div>

              {/* Group By */}
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 pointer-events-none" />
                <select
                  value={historyFilter.groupBy}
                  onChange={(e) => setHistoryFilter(prev => ({ ...prev, groupBy: e.target.value as 'agent' | 'date' }))}
                  className="pl-10 pr-10 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:border-indigo-500 dark:focus:border-teal-500 min-w-[150px] transition-all"
                >
                  <option value="date">Group by Date</option>
                  <option value="agent">Group by Agent</option>
                </select>
              </div>
            </div>

            {/* View Mode & Actions */}
            <div className="flex gap-2">
              {/* View Toggle */}
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 transition-colors">
                <button
                  onClick={() => setViewMode('timeline')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'timeline' 
                      ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-teal-400 shadow-sm' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                  title="Timeline View"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-teal-400 shadow-sm' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                  title="Grid View"
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
              </div>

              {/* Export Button */}
              <button className="p-2.5 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>

              {/* Clear Button */}
              <button className="p-2.5 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                <Trash2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Active Filters */}
          {showFilters && (
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Active filters:</span>
              {historyFilter.agent !== 'all' && (
                <span className="px-3 py-1 bg-indigo-100 dark:bg-teal-900/30 text-indigo-700 dark:text-teal-300 rounded-full text-xs font-medium flex items-center gap-1.5">
                  Agent: {historyFilter.agent}
                  <button 
                    onClick={() => setHistoryFilter(prev => ({ ...prev, agent: 'all' }))}
                    className="hover:bg-indigo-200 dark:hover:bg-teal-800/50 rounded-full p-0.5 transition-colors"
                  >
                    ×
                  </button>
                </span>
              )}
              {historyFilter.search && (
                <span className="px-3 py-1 bg-indigo-100 dark:bg-teal-900/30 text-indigo-700 dark:text-teal-300 rounded-full text-xs font-medium flex items-center gap-1.5">
                  Search: "{historyFilter.search}"
                  <button 
                    onClick={() => setHistoryFilter(prev => ({ ...prev, search: '' }))}
                    className="hover:bg-indigo-200 dark:hover:bg-teal-800/50 rounded-full p-0.5 transition-colors"
                  >
                    ×
                  </button>
                </span>
              )}
              <button 
                onClick={() => setHistoryFilter({ agent: 'all', status: 'all', search: '', groupBy: 'date' })}
                className="text-xs text-indigo-600 dark:text-teal-400 hover:text-indigo-800 dark:hover:text-teal-300 font-medium underline transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {Object.keys(groupedSessions).length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors">
              <Clock className="w-12 h-12 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No chat history found</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              {historyFilter.search || historyFilter.agent !== 'all'
                ? 'Try adjusting your filters to see more results'
                : 'Your conversations with AI agents will appear here. Start a chat to begin!'}
            </p>
            {showFilters && (
              <button 
                onClick={() => setHistoryFilter({ agent: 'all', status: 'all', search: '', groupBy: 'date' })}
                className="mt-6 px-6 py-2.5 bg-indigo-600 dark:bg-teal-600 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-teal-700 transition-colors font-medium shadow-sm dark:shadow-gray-900"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'space-y-8' : 'space-y-6'}>
            {Object.entries(groupedSessions).map(([groupKey, sessions]) => (
              <div key={groupKey}>
                {/* Group Header */}
                <div className="sticky top-0 z-10 bg-gradient-to-r from-gray-100 to-transparent dark:from-gray-700 dark:to-transparent backdrop-blur-sm py-3 px-4 rounded-lg mb-4 border-l-4 border-indigo-500 dark:border-teal-500 transition-colors">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                      {historyFilter.groupBy === 'date' 
                        ? new Date(groupKey).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })
                        : groupKey
                      }
                    </h4>
                    <span className="bg-white dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-medium shadow-sm dark:shadow-gray-900 transition-colors">
                      {sessions.length} {sessions.length === 1 ? 'session' : 'sessions'}
                    </span>
                  </div>
                </div>

                {/* Sessions */}
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {sessions.map((session) => (
                      <SessionCard
                        key={session.id}
                        session={session}
                        onViewSession={handleViewSession}
                        onResumeSession={handleResumeSessionWrapper}
                        viewMode="grid"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-0">
                    {sessions.map((session) => (
                      <SessionCard
                        key={session.id}
                        session={session}
                        onViewSession={handleViewSession}
                        onResumeSession={handleResumeSessionWrapper}
                        viewMode="timeline"
                      />
                    ))}
                  </div>
                )}
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
