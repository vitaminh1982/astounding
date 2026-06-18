import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Play, CheckCircle, ChevronRight } from 'lucide-react';
import { ProjectPhase } from '../../types/project-creation';

interface Props {
  phases: ProjectPhase[];
  currentPhaseIndex: number;
}

export default function PhasePipeline({ phases, currentPhaseIndex }: Props) {
  const getPhaseIcon = (status: ProjectPhase['status']) => {
    switch (status) {
      case 'locked': return <Lock className="w-4 h-4" />;
      case 'active': return <Play className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getPhaseColors = (status: ProjectPhase['status']) => {
    switch (status) {
      case 'locked': return 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500';
      case 'active': return 'bg-blue-50 dark:bg-blue-900/20 border-blue-400 dark:border-blue-500 text-blue-600 dark:text-blue-400';
      case 'completed': return 'bg-green-50 dark:bg-green-900/20 border-green-400 dark:border-green-500 text-green-600 dark:text-green-400';
    }
  };

  const getConnectorColor = (index: number) => {
    if (index < currentPhaseIndex) return 'bg-green-400 dark:bg-green-500';
    if (index === currentPhaseIndex) return 'bg-blue-400 dark:bg-blue-500';
    return 'bg-gray-300 dark:bg-gray-600';
  };

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex items-center gap-2 min-w-max px-2">
        {phases.map((phase, index) => (
          <React.Fragment key={phase.id}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 min-w-[140px] transition-all ${getPhaseColors(phase.status)}`}
            >
              {phase.status === 'active' && (
                <motion.div
                  className="absolute inset-0 rounded-xl border-2 border-blue-400 dark:border-blue-500"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
              <div className="flex items-center gap-2">
                {getPhaseIcon(phase.status)}
                <span className="text-sm font-semibold">{phase.name}</span>
              </div>
              <span className="text-xs opacity-70">{phase.estimatedDuration}</span>
              {phase.status === 'active' && (
                <div className="mt-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-800/40 text-blue-700 dark:text-blue-300">
                    Active
                  </span>
                </div>
              )}
              {phase.status === 'completed' && (
                <div className="mt-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-800/40 text-green-700 dark:text-green-300">
                    Complete
                  </span>
                </div>
              )}
            </motion.div>
            {index < phases.length - 1 && (
              <div className="flex items-center">
                <div className={`w-8 h-0.5 ${getConnectorColor(index)} rounded-full`} />
                <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500 -ml-1" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
