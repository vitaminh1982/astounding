import React from 'react';
import { motion } from 'framer-motion';
import {
  ClipboardList, ShieldAlert, Palette, Database, Cpu, Calendar,
  CheckCircle2,
} from 'lucide-react';
import { ProjectAgent } from '../../types/project-creation';

interface Props {
  agents: ProjectAgent[];
}

const ICON_MAP: Record<string, React.ReactNode> = {
  'clipboard-list': <ClipboardList className="w-5 h-5" />,
  'shield-alert': <ShieldAlert className="w-5 h-5" />,
  'palette': <Palette className="w-5 h-5" />,
  'database': <Database className="w-5 h-5" />,
  'cpu': <Cpu className="w-5 h-5" />,
  'calendar': <Calendar className="w-5 h-5" />,
  'check-circle': <CheckCircle2 className="w-5 h-5" />,
};

const COLOR_MAP: Record<string, { bg: string; text: string; ring: string; progress: string }> = {
  blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-tertiary dark:text-tertiary', ring: 'ring-blue-400', progress: 'bg-tertiary' },
  amber: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-destructive', ring: 'ring-amber-400', progress: 'bg-destructive' },
  pink: { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-600 dark:text-pink-400', ring: 'ring-pink-400', progress: 'bg-pink-500' },
  green: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', ring: 'ring-green-400', progress: 'bg-green-500' },
  emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400', ring: 'ring-emerald-400', progress: 'bg-emerald-500' },
  violet: { bg: 'bg-violet-100 dark:bg-violet-900/30', text: 'text-violet-600 dark:text-violet-400', ring: 'ring-violet-400', progress: 'bg-violet-500' },
  green: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', ring: 'ring-green-400', progress: 'bg-green-500' },
};

const STATUS_LABELS: Record<string, { label: string; dotColor: string }> = {
  idle: { label: 'Idle', dotColor: 'bg-outline-variant' },
  working: { label: 'Working', dotColor: 'bg-green-500' },
  blocked: { label: 'Blocked', dotColor: 'bg-destructive' },
  done: { label: 'Done', dotColor: 'bg-tertiary' },
};

export default function AgentSquadCards({ agents }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {agents.map((agent, index) => {
        const colors = COLOR_MAP[agent.color] || COLOR_MAP.blue;
        const statusInfo = STATUS_LABELS[agent.status] || STATUS_LABELS.idle;

        return (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="relative bg-white dark:bg-surface-container-high rounded-xl border border-border dark:border-border p-4 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-shadow"
          >
            {/* Avatar with pulse */}
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <div className={`w-10 h-10 rounded-full ${colors.bg} ${colors.text} flex items-center justify-center`}>
                  {ICON_MAP[agent.icon] || <Cpu className="w-5 h-5" />}
                </div>
                {agent.status === 'working' && (
                  <motion.div
                    className={`absolute inset-0 rounded-full ring-2 ${colors.ring} opacity-50`}
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-foreground dark:text-foreground truncate">{agent.name}</h4>
                <p className="text-xs text-muted-foreground dark:text-muted-foreground truncate">{agent.role}</p>
              </div>
            </div>

            {/* Status badge */}
            <div className="flex items-center gap-1.5 mb-3">
              <span className={`w-2 h-2 rounded-full ${statusInfo.dotColor}`} />
              <span className="text-xs text-muted-foreground dark:text-muted-foreground">{statusInfo.label}</span>
            </div>

            {/* Current task */}
            <p className="text-xs text-muted-foreground dark:text-muted-foreground mb-3 line-clamp-2 min-h-[2rem]">
              {agent.currentTask}
            </p>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-surface-container dark:bg-surface-container-highest rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${colors.progress}`}
                initial={{ width: 0 }}
                animate={{ width: `${agent.progress}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              />
            </div>
            <span className="text-[10px] text-outline dark:text-muted-foreground mt-1 block text-right">
              {agent.progress}%
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
