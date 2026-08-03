/**
 * ProjectKanbanBoard — Kanban board for the Tasks tab in ProjectDetailPage.
 * Columns: Backlog · In Progress · In Review · Done
 */
import React, { useRef, useState, useEffect } from 'react';
import { Plus, GripVertical, Calendar } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

// ─── Types ───────────────────────────────────────────────────────────────────

type KanbanStatus = 'backlog' | 'in-progress' | 'in-review' | 'done';
type Priority = 'low' | 'medium' | 'high';

interface KanbanTask {
  id: string;
  title: string;
  priority: Priority;
  category: string;
  assignee: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_TASKS: KanbanTask[] = [
  { id: 't1', title: 'Map Stakeholders', priority: 'medium', category: 'Initiation', assignee: 'Aria' },
  { id: 't2', title: 'Define Success Criteria', priority: 'medium', category: 'Initiation', assignee: 'Oscar' },
  { id: 't3', title: 'Establish Quality Baseline', priority: 'low', category: 'Planning', assignee: 'Zara' },
  { id: 't4', title: 'Draft Project Charter', priority: 'high', category: 'Initiation', assignee: 'Aria' },
  { id: 't5', title: 'Identify Key Risks', priority: 'high', category: 'Initiation', assignee: 'Max' },
];

const INITIAL_COLUMNS: Record<KanbanStatus, KanbanTask[]> = {
  backlog: MOCK_TASKS.filter((_, i) => [0, 1, 2].includes(i)),
  'in-progress': MOCK_TASKS.filter((_, i) => [3, 4].includes(i)),
  'in-review': [],
  done: [],
};

// ─── Column config ────────────────────────────────────────────────────────────

interface ColumnConfig {
  id: KanbanStatus;
  label: string;
  /** Tailwind class for the accent bar under the column header */
  accent: string;
}

const COLUMNS: ColumnConfig[] = [
  { id: 'backlog', label: 'Backlog', accent: 'bg-muted-foreground' },
  { id: 'in-progress', label: 'In Progress', accent: 'bg-tertiary' },
  { id: 'in-review', label: 'In Review', accent: 'bg-yellow-400' },
  { id: 'done', label: 'Done', accent: 'bg-primary' },
];

// ─── Priority badge ───────────────────────────────────────────────────────────

const PRIORITY_CLASSES: Record<Priority, string> = {
  high: 'bg-destructive/15 text-destructive border-destructive/30',
  medium: 'bg-yellow-400/15 text-yellow-500 border-yellow-400/30',
  low: 'bg-primary/15 text-primary border-primary/30',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const PriorityBadge: React.FC<{ priority: Priority }> = ({ priority }) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${PRIORITY_CLASSES[priority]}`}
  >
    {priority}
  </span>
);

const CategoryBadge: React.FC<{ label: string }> = ({ label }) => (
  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-accent text-muted-foreground border border-border">
    {label}
  </span>
);

const AssigneeAvatar: React.FC<{ name: string }> = ({ name }) => (
  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
    <Calendar size={11} className="flex-shrink-0" />
    <span className="font-medium text-on-surface">{name}</span>
  </div>
);

interface KanbanCardProps {
  task: KanbanTask;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ task }) => (
  <div className="group bg-surface-container-low dark:bg-surface-container hover:bg-surface dark:hover:bg-surface-container-high rounded-xl border border-border/80 hover:border-outline transition-all duration-150 p-3.5 cursor-pointer hover:shadow-sm select-none">
    {/* Drag handle + title */}
    <div className="flex items-start gap-2">
      <GripVertical
        size={14}
        className="flex-shrink-0 text-outline/50 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
      />
      <p className="text-sm font-semibold text-foreground leading-snug flex-1 group-hover:text-primary transition-colors">
        {task.title}
      </p>
    </div>

    {/* Badges row */}
    <div className="flex flex-wrap items-center gap-1.5 mt-2.5 pl-4">
      <PriorityBadge priority={task.priority} />
      <CategoryBadge label={task.category} />
    </div>

    {/* Assignee */}
    <div className="mt-2.5 pl-4">
      <AssigneeAvatar name={task.assignee} />
    </div>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

const ProjectKanbanBoard: React.FC = () => {
  const { activeProject } = useWorkspace();
  const [columns] = useState(INITIAL_COLUMNS);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollEdges = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  };

  // Total task count across all columns
  const totalTasks = Object.values(columns).reduce((acc, col) => acc + col.length, 0);

  // ── Drag-to-scroll ──────────────────────────────────────────────────────────
  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    // Only trigger on the container itself, not on cards
    if ((e.target as HTMLElement).closest('[data-no-drag]')) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
    scrollRef.current.style.cursor = 'grabbing';
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    scrollRef.current.scrollLeft = scrollLeft - (x - startX) * 1.5;
  };

  const stopDrag = () => {
    setIsDragging(false);
    if (scrollRef.current) scrollRef.current.style.cursor = 'grab';
  };

  // Reset cursor if mouse leaves window
  useEffect(() => {
    const onUp = () => stopDrag();
    window.addEventListener('mouseup', onUp);
    return () => window.removeEventListener('mouseup', onUp);
  }, []);

  // Initialise scroll edges on mount
  useEffect(() => { updateScrollEdges(); }, []);

  return (
    <div className="flex flex-col gap-0">
      {/* ── Header ── */}
      <div className="flex items-center justify-between pb-4">
        <p className="text-xs text-muted-foreground">
          {totalTasks} tâche{totalTasks !== 1 ? 's' : ''} · {activeProject?.name ?? 'Projet'}
        </p>
        <button
          id="kanban-add-task-btn"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-150 shadow-sm"
        >
          <Plus size={13} strokeWidth={2.5} />
          Add Task
        </button>
      </div>

      {/* ── Board ── */}
      <div
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        onScroll={updateScrollEdges}
        className="overflow-x-auto cursor-grab pb-6"
        style={{
          scrollbarWidth: 'none',
          maskImage: [
            canScrollLeft  ? 'linear-gradient(to right,  transparent, black 24px)' : '',
            canScrollRight ? 'linear-gradient(to left,   transparent, black 24px)' : '',
          ].filter(Boolean).join(', ') || undefined,
          WebkitMaskImage: [
            canScrollLeft  ? 'linear-gradient(to right,  transparent, black 24px)' : '',
            canScrollRight ? 'linear-gradient(to left,   transparent, black 24px)' : '',
          ].filter(Boolean).join(', ') || undefined,
        }}
      >
        <div className="flex gap-4 min-w-max">
          {COLUMNS.map((col) => {
            const tasks = columns[col.id];
            return (
              <div
                key={col.id}
                data-no-drag
                className="flex flex-col w-72 rounded-2xl bg-white dark:bg-surface-container-high shadow-sm overflow-hidden"
              >
                {/* Column header */}
                <div className="px-4 pt-4 pb-3">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-sm font-semibold text-foreground">{col.label}</span>
                    <span className="text-xs font-bold text-muted-foreground bg-surface dark:bg-surface-container-high border border-border rounded-full px-2 py-0.5 min-w-[1.5rem] text-center">
                      {tasks.length}
                    </span>
                  </div>
                  {/* Accent bar */}
                  <div className={`h-0.5 w-full rounded-full ${col.accent} opacity-70`} />
                </div>

                {/* Cards */}
                <div className="flex flex-col gap-2 px-3 pb-3 flex-1 min-h-[200px]">
                  {tasks.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center py-10">
                      <p className="text-xs text-outline/70 font-medium">Drop tasks here</p>
                    </div>
                  ) : (
                    tasks.map((task) => (
                      <KanbanCard key={task.id} task={task} />
                    ))
                  )}
                </div>

                {/* Column footer — quick add */}
                <div className="px-3 pb-3">
                  <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium text-outline hover:text-foreground hover:bg-surface dark:hover:bg-surface-container-high border border-dashed border-border hover:border-outline transition-all duration-150">
                    <Plus size={12} strokeWidth={2.5} />
                    Add task
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProjectKanbanBoard;
