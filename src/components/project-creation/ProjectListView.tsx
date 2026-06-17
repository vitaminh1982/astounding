import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Bot, Users, TrendingUp, Layers, FolderOpen, ArrowRight, Calendar, LayoutDashboard, GitBranch, BarChart3, ListChecks } from 'lucide-react';
import { format } from 'date-fns';
import { useProjectCreation } from '../../context/ProjectCreationContext';
import MirankiDashboard from './miranki/MirankiDashboard';

export default function ProjectListView() {
  const { state, dispatch } = useProjectCreation();

  function handleNewProject() {
    dispatch({ type: 'RESET_INTAKE' });
  }

  function handleOpenProject(projectId: string) {
    dispatch({ type: 'SELECT_PROJECT', payload: projectId });
  }

  const COMPLEXITY_COLORS: Record<string, string> = {
    low: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    medium: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    high: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    enterprise: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Projects</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            AI-driven project creation and management
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNewProject}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-teal-700 transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          Create Project
        </motion.button>
      </div>

      {/* Comparison Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800 dark:bg-slate-800 border border-slate-700 rounded-xl p-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs font-semibold text-slate-200">Miranki</span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Bot className="w-3.5 h-3.5 text-amber-400" /> 5 agents
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <Users className="w-3.5 h-3.5 text-indigo-400" /> 3 team
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <TrendingUp className="w-3.5 h-3.5 text-green-400" /> Phase 1 (68%)
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <Layers className="w-3.5 h-3.5 text-cyan-400" /> 1,670 tasks done
              </span>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-600" />

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-500" />
              <span className="text-xs font-semibold text-slate-400">New Project</span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-500">
                <Bot className="w-3.5 h-3.5" /> 0 agents
              </span>
              <span className="flex items-center gap-1.5 text-slate-500">
                <Users className="w-3.5 h-3.5" /> 0 team
              </span>
              <span className="flex items-center gap-1.5 text-slate-500">
                <TrendingUp className="w-3.5 h-3.5" /> Not started
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Side-by-Side Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Panel - Miranki (60%) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-3 bg-slate-900 dark:bg-slate-900 border border-slate-700 rounded-xl p-5 min-h-[600px] flex flex-col"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <span className="text-xs font-bold text-white">M</span>
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Miranki</h2>
                <p className="text-[10px] text-slate-500">AI Startup / Collective SuperIntelligence</p>
              </div>
            </div>
            <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-green-900/50 text-green-400 border border-green-700/50">
              Active
            </span>
          </div>
          <div className="flex-1">
            <MirankiDashboard />
          </div>
        </motion.div>

        {/* Right Panel - New Project (40%) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-4"
        >
          {/* New Project Scaffold */}
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5 min-h-[350px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
                  <Plus className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">New Project</h3>
                  <p className="text-[10px] text-gray-500 dark:text-slate-500">Start AI-driven project creation</p>
                </div>
              </div>
            </div>

            {/* Empty tabs scaffold */}
            <div className="flex gap-1 mb-4 bg-gray-100 dark:bg-slate-700/30 rounded-lg p-1">
              {[
                { icon: <LayoutDashboard className="w-3 h-3" />, label: 'Overview' },
                { icon: <GitBranch className="w-3 h-3" />, label: 'Workflow' },
                { icon: <BarChart3 className="w-3 h-3" />, label: 'Analytics' },
                { icon: <ListChecks className="w-3 h-3" />, label: 'Deliverables' },
              ].map((tab, i) => (
                <div key={i} className="flex items-center gap-1 px-2 py-1.5 rounded text-[10px] text-gray-400 dark:text-slate-600 flex-1 justify-center">
                  {tab.icon}
                  <span className="hidden xl:inline">{tab.label}</span>
                </div>
              ))}
            </div>

            {/* Empty state */}
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-slate-700/30 flex items-center justify-center mb-4">
                <FolderOpen className="w-7 h-7 text-gray-300 dark:text-slate-600" />
              </div>
              <h4 className="text-sm font-medium text-gray-600 dark:text-slate-400 mb-1">Ready to build</h4>
              <p className="text-xs text-gray-400 dark:text-slate-500 max-w-[200px] mb-5">
                Start a conversational intake to configure agents, phases, and deliverables.
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleNewProject}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-teal-700 transition-all shadow-lg shadow-blue-500/20"
              >
                <Plus className="w-4 h-4" />
                Create Project
              </motion.button>
            </div>
          </div>

          {/* Created Projects List */}
          {state.projects.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wide">Your Projects</h4>
              {state.projects.map((project, i) => {
                const currentPhase = project.phases[project.currentPhaseIndex];
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handleOpenProject(project.id)}
                    className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4 cursor-pointer hover:shadow-md dark:hover:shadow-slate-900/50 hover:border-blue-300 dark:hover:border-teal-600 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-teal-400 transition-colors">
                        {project.name}
                      </h5>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500 dark:group-hover:text-teal-400 transition-colors" />
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-slate-400 line-clamp-1 mb-3">{project.goal}</p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <span className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full ${COMPLEXITY_COLORS[project.complexity]}`}>
                        {project.complexity}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400 font-medium">
                        {project.deliveryTrackLabel}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-teal-500 rounded-full" style={{ width: `${project.overallProgress}%` }} />
                      </div>
                      <span className="text-[10px] font-medium text-gray-600 dark:text-slate-400">{Math.round(project.overallProgress)}%</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2 text-[10px] text-gray-400 dark:text-slate-500">
                      <Calendar className="w-3 h-3" />
                      {format(project.createdAt, 'MMM d, yyyy')}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
