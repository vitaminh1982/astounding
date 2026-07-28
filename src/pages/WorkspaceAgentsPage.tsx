import React, { useMemo, useState } from 'react';
import { Bot, CheckCircle2, Clock, ChevronRight, Search } from 'lucide-react';
import { WORKSPACE_AGENTS, WorkspaceAgent as Agent } from '../data/workspace_agents';


export default function WorkspaceAgentsPage({
  isSidebarExpanded = true,
  onToggleSidebar,
}: {
  isSidebarExpanded?: boolean;
  onToggleSidebar?: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused'>('all');

  const filteredAgents = useMemo(() => {
    return WORKSPACE_AGENTS.filter(agent => {
      const matchesSearch = 
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.capabilities.some(cap => cap.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || agent.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Workspace Agents
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gérez et collaborez avec les agents intelligents affectés à votre espace de travail.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg px-4 py-2 border border-gray-200 dark:border-gray-600 shadow-sm dark:shadow-gray-900">
              <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-pulse" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {WORKSPACE_AGENTS.filter(a => a.status === 'active').length} Active Agents
              </span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Nom, rôle, compétence..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-450 focus:outline-none focus:ring-1 focus:ring-teal-500 text-sm"
            />
          </div>

          <div className="flex items-center gap-1.5">
            {[
              { value: 'all', label: 'Tous', count: WORKSPACE_AGENTS.length },
              { value: 'active', label: 'Actifs', count: WORKSPACE_AGENTS.filter(a => a.status === 'active').length },
              { value: 'paused', label: 'En pause', count: WORKSPACE_AGENTS.filter(a => a.status === 'paused').length },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value as 'all' | 'active' | 'paused')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${statusFilter === tab.value
                  ? 'bg-gray-900 dark:bg-white/15 text-white dark:text-white font-semibold'
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${statusFilter === tab.value ? 'bg-white/15 text-white' : 'bg-black/5 dark:bg-white/5 text-gray-500 dark:text-gray-450'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Grid Layout */}
          <div className="flex-1 min-w-0">
            {filteredAgents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAgents.map((agent) => (
                  <div
                    key={agent.id}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-teal-500/50 transition-all duration-200 flex flex-col p-5 relative"
                  >
                    {/* Header: Photo + Info */}
                    <div className="flex items-start gap-4 mb-3">
                      <div className="relative flex-shrink-0">
                        {/* Photo de profil */}
                        <img
                          src={agent.avatar}
                          alt={agent.name}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                        />
                        {/* Status Dot */}
                        <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white dark:border-gray-850 bg-green-500 flex items-center justify-center">
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            agent.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
                          }`} />
                        </span>
                      </div>

                      <div className="flex-grow min-w-0">
                        <h3 className="font-semibold text-gray-950 dark:text-gray-100 text-base truncate">
                          {agent.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {agent.role}
                        </p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">
                          {agent.email}
                        </p>
                      </div>
                    </div>

                    {/* Body: Purpose */}
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 mb-4 line-clamp-2 min-h-[2.5rem] leading-relaxed">
                      {agent.purpose}
                    </p>

                    {/* Capabilities */}
                    <div className="space-y-1.5 mb-4 flex-grow">
                      <h4 className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                        Compétences Clés
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {agent.capabilities.map((cap, i) => (
                          <span
                            key={i}
                            className="bg-gray-50 dark:bg-gray-750/50 border border-gray-200/50 dark:border-gray-700/55 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-md text-[10px] font-medium"
                          >
                            {cap}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer / Action */}
                    <div className="border-t border-gray-100 dark:border-gray-700 pt-3 flex items-center justify-between mt-auto">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        agent.status === 'active'
                          ? 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400'
                          : 'bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-400'
                      }`}>
                        {agent.status === 'active' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                        {agent.status === 'active' ? 'Actif' : 'En pause'}
                      </span>
                      
                      <button className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-teal-400 hover:text-indigo-700 dark:hover:text-teal-300 transition-colors">
                        <span>Collaborer</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-16 bg-white dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg shadow-sm">
                <Bot className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  Aucun agent trouvé
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs mx-auto">
                  Nous n'avons trouvé aucun agent correspondant à vos critères de recherche.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
