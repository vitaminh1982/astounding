import React from 'react';
import { motion } from 'framer-motion';
import { Plus, FolderOpen, ArrowRight, Calendar } from 'lucide-react';
import { useProjectCreation } from '../../context/ProjectCreationContext';
import { format } from 'date-fns';

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
            Create and manage AI-driven projects
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNewProject}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-400 text-[#0d2b1a] rounded-xl font-semibold hover:from-green-400 hover:to-emerald-300 transition-all shadow-md shadow-green-500/25"
        >
          <Plus className="w-4 h-4" />
          Create Project
        </motion.button>
      </div>

      {/* Project Grid */}
      {state.projects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
            <FolderOpen className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">No projects yet</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
            Start your first AI-driven project. Our assistant will guide you through a conversational intake to configure the perfect setup.
          </p>
          <button
            onClick={handleNewProject}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-400 text-[#0d2b1a] rounded-xl font-semibold hover:from-green-400 hover:to-emerald-300 transition-all shadow-md shadow-green-500/25"
          >
            <Plus className="w-4 h-4" />
            Create Your First Project
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {state.projects.map((project, i) => {
            const currentPhase = project.phases[project.currentPhaseIndex];
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleOpenProject(project.id)}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 cursor-pointer hover:shadow-lg dark:hover:shadow-gray-900/50 hover:border-blue-300 dark:hover:border-teal-600 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-teal-400 transition-colors">
                    {project.name}
                  </h3>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 dark:group-hover:text-teal-400 transition-colors" />
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">{project.goal}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${COMPLEXITY_COLORS[project.complexity]}`}>
                    {project.complexity}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 font-medium">
                    {project.deliveryTrackLabel}
                  </span>
                </div>

                {/* Progress */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500 dark:text-gray-400">{currentPhase.name}</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{Math.round(project.overallProgress)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-teal-500 rounded-full" style={{ width: `${project.overallProgress}%` }} />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                  <Calendar className="w-3 h-3" />
                  Created {format(project.createdAt, 'MMM d, yyyy')}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
