import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Users, Sparkles, CheckCircle2, Clock, Package } from 'lucide-react';

interface ProjectSkeletonBackgroundProps {
  /** Number of intake questions answered so far (0 = nothing answered yet). */
  step: number;
  totalSteps: number;
}

const NAV_ITEMS = ['Overview', 'Tasks', 'Deliverables'];

/**
 * Purely decorative stand-in for the real project overview page, shown
 * (blurred) behind PlexCreateModal while the intake chat runs. Labels are
 * static from the start; the values next to them fade in progressively as
 * the user answers questions, to sell the "AI is filling this in" feeling.
 * None of the revealed content is tied to the user's actual answers.
 */
export default function ProjectSkeletonBackground({ step, totalSteps }: ProjectSkeletonBackgroundProps) {
  const revealHeader = step >= 1;
  const revealTeamAgents = step >= 2;
  const revealVision = step >= Math.min(4, totalSteps - 1);
  const revealStats = step >= totalSteps - 1;

  const progressPct = revealVision ? (revealStats ? 60 : 32) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 select-none">
      {/* Title row */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-surface-container-low dark:bg-surface-container-high flex items-center justify-center text-xl flex-shrink-0">
          <Rocket className="w-5 h-5 text-outline dark:text-muted-foreground" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <SkeletonReveal show={revealHeader} className="h-5 w-40">
              <h1 className="text-xl font-bold text-foreground dark:text-foreground">New Project</h1>
            </SkeletonReveal>
            <SkeletonReveal show={revealHeader} className="h-4 w-20" delay={0.1}>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400">
                Technology
              </span>
            </SkeletonReveal>
          </div>
          <SkeletonReveal show={revealHeader} className="h-3.5 w-64 mt-1.5" delay={0.15}>
            <p className="text-sm text-outline dark:text-muted-foreground">
              Configuring your project workspace…
            </p>
          </SkeletonReveal>
        </div>
      </div>

      {/* Tabs — labels always present */}
      <div className="flex items-center gap-1 bg-surface-container-low dark:bg-surface-container-high rounded-full p-1 w-fit">
        {NAV_ITEMS.map((label, i) => (
          <span
            key={label}
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${
              i === 0
                ? 'bg-white dark:bg-background text-foreground dark:text-foreground shadow-sm'
                : 'text-outline dark:text-muted-foreground'
            }`}
          >
            {label}
          </span>
        ))}
      </div>

      <div className="bg-white dark:bg-surface-container-high rounded-2xl border border-border dark:border-border p-6 space-y-6">
        {/* Team + Agents row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 rounded-xl border border-dashed border-border dark:border-border px-4 py-3">
            <Users className="w-4 h-4 text-outline dark:text-muted-foreground flex-shrink-0" />
            <span className="text-[10px] font-bold text-outline dark:text-muted-foreground uppercase tracking-wide">Team</span>
            <SkeletonReveal show={revealTeamAgents} className="h-4 w-32 ml-1">
              <span className="text-sm text-foreground dark:text-foreground">5 people have access</span>
            </SkeletonReveal>
          </div>
          <div className="flex-1 flex items-center justify-between gap-2 rounded-xl bg-black dark:bg-surface-container-highest text-white px-4 py-3">
            <div className="flex items-center gap-2">
              <SkeletonReveal show={revealTeamAgents} className="h-5 w-5" dark>
                <span className="text-lg font-bold leading-none">6</span>
              </SkeletonReveal>
              <span className="text-sm">Active agents</span>
            </div>
            <span className="text-xs text-white/60 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Ask Agent
            </span>
          </div>
        </div>

        {/* Vision card */}
        <div className="rounded-2xl bg-surface-container-low dark:bg-surface-container-highest p-6 space-y-3">
          <span className="text-[10px] font-bold text-outline dark:text-muted-foreground uppercase tracking-wide">Vision</span>
          <SkeletonReveal show={revealVision} className="h-10 w-full" lines={2}>
            <p className="text-sm italic text-foreground dark:text-foreground leading-relaxed">
              "Defining the vision and goals that will guide this project from kickoff to delivery."
            </p>
          </SkeletonReveal>
          <div className="flex items-center gap-3 pt-1">
            <div className="flex-1 h-1.5 rounded-full bg-surface-container dark:bg-surface-container-highest overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-green-500"
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <span className="text-xs text-outline dark:text-muted-foreground whitespace-nowrap">
              Progress: {progressPct}%
            </span>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatCard icon={Clock} label="Pending gates" value="3" show={revealStats} />
          <StatCard icon={CheckCircle2} label="Overdue tasks" value="5" show={revealStats} delay={0.1} />
          <StatCard icon={Package} label="Deliverables completed" value="12/20" show={revealStats} delay={0.2} />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  show,
  delay = 0,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  show: boolean;
  delay?: number;
}) {
  return (
    <div className="rounded-xl border border-border dark:border-border px-4 py-3 flex items-center gap-3">
      <Icon className="w-4 h-4 text-outline dark:text-muted-foreground flex-shrink-0" />
      <div className="min-w-0">
        <SkeletonReveal show={show} className="h-5 w-10" delay={delay}>
          <span className="text-base font-bold text-foreground dark:text-foreground">{value}</span>
        </SkeletonReveal>
        <p className="text-[10px] text-outline dark:text-muted-foreground uppercase tracking-wide">{label}</p>
      </div>
    </div>
  );
}

/**
 * Shows a pulsing gray placeholder block until `show` flips true, then
 * crossfades into the real (generic) content passed as children.
 */
function SkeletonReveal({
  show,
  className,
  delay = 0,
  lines = 1,
  dark = false,
  children,
}: {
  show: boolean;
  className: string;
  delay?: number;
  lines?: number;
  dark?: boolean;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      {show ? (
        <motion.div
          key="content"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay }}
        >
          {children}
        </motion.div>
      ) : (
        <motion.div
          key="skeleton"
          exit={{ opacity: 0 }}
          className={`rounded-md animate-pulse ${dark ? 'bg-white/20' : 'bg-surface-container dark:bg-surface-container-highest'} ${className}`}
          style={lines > 1 ? { display: 'flex', flexDirection: 'column', gap: 6 } : undefined}
        />
      )}
    </AnimatePresence>
  );
}
