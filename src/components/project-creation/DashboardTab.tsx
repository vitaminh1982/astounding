import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Layers, Users, AlertTriangle, Calendar } from 'lucide-react';
import { CreatedProject } from '../../types/project-creation';
import PhasePipeline from './PhasePipeline';
import AgentSquadCards from './AgentSquadCards';

interface Props {
  project: CreatedProject;
}

export default function DashboardTab({ project }: Props) {
  const currentPhase = project.phases[project.currentPhaseIndex];
  const completedDeliverables = project.phases.reduce(
    (acc, p) => acc + p.deliverables.filter((d) => d.completed).length,
    0
  );
  const totalDeliverables = project.phases.reduce(
    (acc, p) => acc + p.deliverables.length,
    0
  );
  const blockers = project.agents.filter((a) => a.status === 'blocked').length;

  const metrics = [
    { label: 'Deliverables', value: `${completedDeliverables}/${totalDeliverables}`, icon: Layers, color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Phases Unlocked', value: `${project.currentPhaseIndex + 1}/${project.phases.length}`, icon: TrendingUp, color: 'text-green-600 dark:text-green-400' },
    { label: 'Blockers', value: blockers, icon: AlertTriangle, color: blockers > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400' },
    { label: 'Days Elapsed', value: project.daysElapsed, icon: Calendar, color: 'text-amber-600 dark:text-amber-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Project Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{project.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{project.goal}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
              project.complexity === 'enterprise' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
              project.complexity === 'high' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
              project.complexity === 'medium' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
              'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
            }`}>
              {project.complexity}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              {project.deliveryTrackLabel}
            </span>
          </div>
        </div>

        {/* Overall progress */}
        <div className="mb-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-600 dark:text-gray-400">Overall Progress</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{Math.round(project.overallProgress)}%</span>
          </div>
          <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-teal-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${project.overallProgress}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <metric.icon className={`w-4 h-4 ${metric.color}`} />
              <span className="text-xs text-gray-500 dark:text-gray-400">{metric.label}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{metric.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Phase Pipeline */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Phase Pipeline</h3>
        <PhasePipeline phases={project.phases} currentPhaseIndex={project.currentPhaseIndex} />
      </motion.div>

      {/* Agent Squad */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">AI Agent Squad</h3>
        <AgentSquadCards agents={project.agents} />
      </motion.div>

      {/* Delivery Track Rationale */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/10 dark:to-teal-900/10 border border-blue-200 dark:border-blue-800/50 rounded-xl p-5"
      >
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300">Delivery Track Rationale</h4>
        </div>
        <p className="text-sm text-blue-800 dark:text-blue-200/80">{project.deliveryTrackRationale}</p>
      </motion.div>
    </div>
  );
}
