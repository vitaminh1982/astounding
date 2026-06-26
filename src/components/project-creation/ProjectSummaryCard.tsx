import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Users,
  Calendar,
  Target,
  DollarSign,
  Layers,
  Tag,
  Briefcase,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import type { CollectedProjectData } from './useProjectAgent';

interface ProjectSummaryCardProps {
  data: CollectedProjectData;
  onConfirm: () => void;
  onRevise: () => void;
}

const COMPLEXITY_COLORS: Record<string, string> = {
  low: 'bg-green-500/20 text-green-400 border-green-500/30',
  medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  enterprise: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const TRACK_LABELS: Record<string, string> = {
  'lean-sprint': 'Lean Sprint',
  'prince2-agile-hybrid': 'PRINCE2 Agile Hybrid',
  'waterfall-classic': 'Waterfall Classic',
  'kanban-flow': 'Kanban Flow',
};

export default function ProjectSummaryCard({ data, onConfirm, onRevise }: ProjectSummaryCardProps) {
  const complexityClass = COMPLEXITY_COLORS[data.complexity ?? 'medium'] ?? COMPLEXITY_COLORS.medium;
  const trackLabel = TRACK_LABELS[data.deliveryTrack ?? 'lean-sprint'] ?? 'Lean Sprint';

  const fields: { icon: React.ReactNode; label: string; value: string | undefined }[] = [
    { icon: <Briefcase size={14} />, label: 'Project Name', value: data.projectName },
    { icon: <Target size={14} />, label: 'Goal', value: data.goal },
    { icon: <Tag size={14} />, label: 'Type', value: data.projectType },
    { icon: <Users size={14} />, label: 'Target Audience', value: data.targetAudience },
    { icon: <Layers size={14} />, label: 'Key Deliverables', value: data.deliverables },
    { icon: <Calendar size={14} />, label: 'Timeline', value: data.timeline },
    { icon: <Users size={14} />, label: 'Team Size', value: data.teamSize },
    { icon: <DollarSign size={14} />, label: 'Budget', value: data.budget },
    { icon: <AlertTriangle size={14} />, label: 'Constraints / Risks', value: data.constraints },
    { icon: <Clock size={14} />, label: 'Priority', value: data.priority },
  ].filter((f) => f.value && f.value.trim() !== '');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-5 w-full"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 bg-indigo-500/20 rounded-lg flex items-center justify-center">
          <CheckCircle2 size={14} className="text-indigo-400" />
        </div>
        <p className="text-sm font-semibold text-white">Project Summary</p>
        <div className="ml-auto flex items-center gap-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${complexityClass}`}>
            {data.complexity ?? 'medium'} complexity
          </span>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 border border-slate-600">
            {trackLabel}
          </span>
        </div>
      </div>

      {/* Fields grid */}
      <div className="grid grid-cols-1 gap-2 mb-5">
        {fields.map((f) => (
          <div key={f.label} className="flex gap-3 items-start">
            <div className="text-slate-500 mt-0.5 flex-shrink-0">{f.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-500 leading-none mb-0.5">{f.label}</p>
              <p className="text-sm text-slate-200 leading-snug">{f.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onRevise}
          className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
        >
          Revise Details
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-4 py-2.5 text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
        >
          Create Project
        </button>
      </div>
    </motion.div>
  );
}
