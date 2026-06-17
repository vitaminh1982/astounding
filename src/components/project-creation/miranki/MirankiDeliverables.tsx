import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, Circle } from 'lucide-react';
import { MIRANKI_DELIVERABLES, MIRANKI_MILESTONES } from './mirankiMockData';

export default function MirankiDeliverables() {
  const phases = MIRANKI_MILESTONES;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'in-progress': return <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />;
      default: return <Circle className="w-4 h-4 text-slate-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'in-progress': return 'text-amber-400';
      default: return 'text-slate-500';
    }
  };

  return (
    <div className="space-y-4">
      {phases.map((phase, phaseIdx) => {
        const phaseDeliverables = MIRANKI_DELIVERABLES.filter((d) => d.phase === phase.phase);
        if (phaseDeliverables.length === 0) return null;

        const completedCount = phaseDeliverables.filter((d) => d.status === 'completed').length;
        const totalCount = phaseDeliverables.length;

        return (
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: phaseIdx * 0.1 }}
            className="bg-slate-800/80 border border-slate-700/50 rounded-xl p-4"
          >
            {/* Phase header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded flex items-center justify-center bg-slate-700 text-[10px] font-bold text-slate-300">
                  {phase.phase}
                </span>
                <h4 className="text-sm font-semibold text-slate-200">{phase.name}</h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500">{completedCount}/{totalCount}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                  phase.status === 'in-progress' ? 'bg-blue-900/50 text-blue-400' :
                  phase.status === 'upcoming' ? 'bg-amber-900/50 text-amber-400' :
                  'bg-slate-700/50 text-slate-500'
                }`}>
                  {phase.status === 'in-progress' ? 'Active' : phase.status === 'upcoming' ? 'Next' : 'Planned'}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all"
                style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
              />
            </div>

            {/* Deliverables list */}
            <div className="space-y-1.5">
              {phaseDeliverables.map((deliverable) => (
                <div key={deliverable.id} className="flex items-center gap-2.5 py-1.5 px-2 rounded-md hover:bg-slate-700/30 transition-colors">
                  {getStatusIcon(deliverable.status)}
                  <span className={`text-xs ${getStatusLabel(deliverable.status)} ${deliverable.status === 'completed' ? 'line-through opacity-70' : ''}`}>
                    {deliverable.name}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
