/**
 * ProjectKanbanBoard — Kanban board for the Board tab in ProjectDetailPage.
 * Columns: Backlog · In Progress · In Review · Done
 */
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Plus, GripVertical, CornerDownLeft, Calendar, Tag, User } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { WORKSPACE_AGENTS } from '../../data/workspace_agents';

// ─── Types ───────────────────────────────────────────────────────────────────

type KanbanStatus = 'backlog' | 'in-progress' | 'in-review' | 'done';
type Priority = 'low' | 'medium' | 'high';

interface KanbanTask {
  id: string;
  title: string;
  priority: Priority;
  category: string;
  /** undefined = assigned to current user; otherwise a WORKSPACE_AGENTS id */
  assignee?: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const ASSIGNEE_OPTIONS = [undefined, 'agent-001', 'agent-002', 'agent-003', 'agent-004', 'agent-005', 'agent-006'];
const getRandomAssignee = () => ASSIGNEE_OPTIONS[Math.floor(Math.random() * ASSIGNEE_OPTIONS.length)];

// Assignee = undefined (User) or WORKSPACE_AGENTS id
const MOCK_TASKS: KanbanTask[] = [
  { id: 't1', title: 'Map Stakeholders', priority: 'medium', category: 'Initiation', assignee: getRandomAssignee() },
  { id: 't2', title: 'Define Success Criteria', priority: 'medium', category: 'Initiation', assignee: getRandomAssignee() },
  { id: 't3', title: 'Establish Quality Baseline', priority: 'low', category: 'Planning', assignee: getRandomAssignee() },
  { id: 't4', title: 'Draft Project Charter', priority: 'high', category: 'Initiation', assignee: getRandomAssignee() },
  { id: 't5', title: 'Identify Key Risks', priority: 'high', category: 'Initiation', assignee: getRandomAssignee() },
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
  medium: 'bg-yellow-400/15 text-yellow-500  border-yellow-400/30',
  low: 'bg-primary/15    text-primary      border-primary/30',
};

const PriorityBadge: React.FC<{ priority: Priority }> = ({ priority }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${PRIORITY_CLASSES[priority]}`}>
    {priority}
  </span>
);

const CategoryBadge: React.FC<{ label: string }> = ({ label }) => (
  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-accent text-muted-foreground border border-border">
    {label}
  </span>
);

// ─── Assignee avatar ──────────────────────────────────────────────────────────

const AssigneeAvatar: React.FC<{ assignee?: string; size?: 'sm' | 'md'; showTooltip?: boolean }> = ({ assignee, size = 'sm', showTooltip = true }) => {
  const [hovered, setHovered] = useState(false);
  const dim = size === 'sm' ? 'w-5 h-5' : 'w-6 h-6';

  const agent = assignee ? WORKSPACE_AGENTS.find(a => a.id === assignee) : null;
  const label = agent ? `Assignee: ${agent.name.replace('AI ', '')}` : 'Assignee: None';

  return (
    <div
      className="relative flex-shrink-0 cursor-pointer"
      onMouseEnter={() => showTooltip && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {!agent ? (
        <div className={`${dim} rounded-full bg-surface-container-high dark:bg-surface-container border border-border flex items-center justify-center text-muted-foreground hover:border-outline transition-colors`}>
          <User size={size === 'sm' ? 10 : 12} strokeWidth={1.5} />
        </div>
      ) : (
        <img
          src={agent.avatar}
          alt={agent.name}
          className={`${dim} rounded-full object-cover border border-border hover:border-outline transition-colors`}
        />
      )}

      {showTooltip && hovered && (
        <div className="absolute top-[calc(100%+4px)] right-0 pointer-events-none z-[100]">
          <div className="bg-[#172b4d] dark:bg-slate-900 text-white text-[11px] font-medium px-2.5 py-1 rounded shadow-xl whitespace-nowrap border border-white/10">
            {label}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Kanban card ─────────────────────────────────────────────────────────────

interface KanbanCardProps {
  task: KanbanTask;
  colId: KanbanStatus;
  index: number;
  onDragStart: (e: React.DragEvent, taskId: string, colId: KanbanStatus) => void;
  onCardDragOver: (e: React.DragEvent, colId: KanbanStatus, index: number) => void;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ task, colId, index, onDragStart, onCardDragOver }) => {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div
      draggable
      onDragStart={(e) => {
        setIsDragging(true);
        onDragStart(e, task.id, colId);
      }}
      onDragEnd={() => setIsDragging(false)}
      onDragOver={(e) => onCardDragOver(e, colId, index)}
      className={`group bg-white dark:bg-surface-container rounded-xl border border-border/80 hover:border-outline transition-all duration-150 p-3.5 cursor-grab active:cursor-grabbing hover:shadow-sm select-none ${isDragging ? 'opacity-40 scale-[0.98]' : ''
        }`}
    >
      {/* Drag handle + title */}
      <div className="flex items-start gap-1.5">
        <GripVertical
          size={14}
          className="w-0 group-hover:w-3.5 -ml-1 group-hover:ml-0 opacity-0 group-hover:opacity-100 transition-all duration-150 flex-shrink-0 text-outline/50 mt-0.5 cursor-grab overflow-hidden"
        />
        <p className="text-sm font-normal text-foreground leading-snug flex-1 transition-colors">
          {task.title}
        </p>
      </div>

      {/* Badges + assignee row */}
      <div className="flex items-center justify-between mt-2.5 transition-all duration-150 group-hover:pl-5">
        <div className="flex flex-wrap items-center gap-1.5">
          <PriorityBadge priority={task.priority} />
          <CategoryBadge label={task.category} />
        </div>
        <AssigneeAvatar assignee={task.assignee} showTooltip />
      </div>
    </div>
  );
};

// ─── Inline add-task form (Jira-style) ────────────────────────────────────────

interface InlineAddFormProps {
  onAdd: (title: string) => void;
  onCancel: () => void;
}

const InlineAddForm: React.FC<InlineAddFormProps> = ({ onAdd, onCancel }) => {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) onAdd(value.trim());
    }
    if (e.key === 'Escape') onCancel();
  };

  const hasText = value.trim().length > 0;

  return (
    <div className="rounded-xl border-2 border-primary/60 bg-white dark:bg-surface-container-high shadow-sm overflow-hidden">
      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="What needs to be done?"
        rows={2}
        className="w-full resize-none px-3 pt-3 pb-1 text-sm text-foreground bg-transparent placeholder:text-outline focus:outline-none"
      />

      {/* Toolbar */}
      <div className="flex items-center justify-between px-2 pb-2 pt-1">
        <div className="flex items-center gap-1">
          {/* Priority picker (cosmetic) */}
          <button
            type="button"
            title="Priority"
            className="flex items-center gap-0.5 p-1.5 rounded-lg hover:bg-surface-container transition-colors text-muted-foreground hover:text-foreground"
          >
            <Tag size={13} strokeWidth={1.8} />
          </button>
          {/* Due date (cosmetic) */}
          <button
            type="button"
            title="Due date"
            className="p-1.5 rounded-lg hover:bg-surface-container transition-colors text-muted-foreground hover:text-foreground"
          >
            <Calendar size={13} strokeWidth={1.8} />
          </button>
          {/* Assignee (cosmetic) */}
          <button
            type="button"
            title="Assignee"
            className="p-1.5 rounded-lg hover:bg-surface-container transition-colors"
          >
            <AssigneeAvatar size="sm" />
          </button>
        </div>

        {/* Submit */}
        <button
          type="button"
          onClick={() => { if (hasText) onAdd(value.trim()); }}
          disabled={!hasText}
          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-150 ${hasText
            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
            : 'bg-surface-container-high text-muted-foreground cursor-not-allowed'
            }`}
        >
          <CornerDownLeft size={13} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

const ProjectKanbanBoard: React.FC = () => {
  const { activeProject } = useWorkspace();
  const [columns, setColumns] = useState<Record<KanbanStatus, KanbanTask[]>>(INITIAL_COLUMNS);
  const [addingInColumn, setAddingInColumn] = useState<KanbanStatus | null>(null);
  const [dragOverCol, setDragOverCol] = useState<KanbanStatus | null>(null);
  const [dropIndicator, setDropIndicator] = useState<{ colId: KanbanStatus; index: number } | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollEdges = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollWidth - el.clientWidth - el.scrollLeft > 4);
  }, []);

  const totalTasks = Object.values(columns).reduce((acc, col) => acc + col.length, 0);

  // ── Drag & Drop Tasks between columns & reordering ─────────────────────────
  const handleCardDragStart = (e: React.DragEvent, taskId: string, fromColId: KanbanStatus) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ taskId, fromColId }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, colId: KanbanStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverCol !== colId) setDragOverCol(colId);
  };

  const handleCardDragOver = (e: React.DragEvent, colId: KanbanStatus, cardIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverCol !== colId) setDragOverCol(colId);

    const rect = e.currentTarget.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const targetIdx = e.clientY < midY ? cardIndex : cardIndex + 1;

    setDropIndicator(prev => {
      if (prev?.colId === colId && prev?.index === targetIdx) return prev;
      return { colId, index: targetIdx };
    });
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverCol(null);
      setDropIndicator(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetColId: KanbanStatus) => {
    e.preventDefault();
    const targetIdx = dropIndicator?.colId === targetColId ? dropIndicator.index : columns[targetColId].length;
    setDragOverCol(null);
    setDropIndicator(null);

    try {
      const rawData = e.dataTransfer.getData('application/json');
      if (!rawData) return;
      const { taskId, fromColId } = JSON.parse(rawData) as { taskId: string; fromColId: KanbanStatus };

      setColumns(prev => {
        const fromList = [...(prev[fromColId] || [])];
        const taskIdx = fromList.findIndex(t => t.id === taskId);
        if (taskIdx === -1) return prev;

        const [movedTask] = fromList.splice(taskIdx, 1);

        if (fromColId === targetColId) {
          // Reorder within same column
          const finalIdx = targetIdx > taskIdx ? targetIdx - 1 : targetIdx;
          fromList.splice(finalIdx, 0, movedTask);
          return { ...prev, [targetColId]: fromList };
        } else {
          // Move to different column at index
          const toList = [...(prev[targetColId] || [])];
          const finalIdx = Math.min(targetIdx, toList.length);
          toList.splice(finalIdx, 0, movedTask);
          return {
            ...prev,
            [fromColId]: fromList,
            [targetColId]: toList,
          };
        }
      });
    } catch (err) {
      console.error('Failed to parse drag data:', err);
    }
  };

  // ── Inline add ──────────────────────────────────────────────────────────────
  const handleAddTask = useCallback((colId: KanbanStatus, title: string) => {
    const newTask: KanbanTask = {
      id: `t-${Date.now()}`,
      title,
      priority: 'medium',
      category: 'New',
      assignee: getRandomAssignee(),
    };
    setColumns(prev => ({ ...prev, [colId]: [...prev[colId], newTask] }));
    setAddingInColumn(null);
  }, []);

  // ── Drag-to-scroll ──────────────────────────────────────────────────────────
  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
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

  useEffect(() => {
    const onUp = () => stopDrag();
    window.addEventListener('mouseup', onUp);
    return () => window.removeEventListener('mouseup', onUp);
  }, []);

  useEffect(() => {
    updateScrollEdges();
    window.addEventListener('resize', updateScrollEdges);
    const el = scrollRef.current;
    let observer: ResizeObserver | null = null;
    if (el) {
      observer = new ResizeObserver(() => updateScrollEdges());
      observer.observe(el);
    }
    return () => {
      window.removeEventListener('resize', updateScrollEdges);
      if (observer && el) observer.disconnect();
    };
  }, [updateScrollEdges]);

  return (
    <div className="flex flex-col gap-0">
      {/* ── Header ── */}
      <div className="flex items-center justify-between pb-4">
        <p className="text-xs text-muted-foreground">
          {totalTasks} tâche{totalTasks !== 1 ? 's' : ''} · {activeProject?.name ?? 'Projet'}
        </p>
        <button
          id="kanban-add-task-btn"
          onClick={() => setAddingInColumn('backlog')}
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
            canScrollLeft ? 'linear-gradient(to right, transparent, black 24px)' : '',
            canScrollRight ? 'linear-gradient(to left,  transparent, black 24px)' : '',
          ].filter(Boolean).join(', ') || undefined,
          WebkitMaskImage: [
            canScrollLeft ? 'linear-gradient(to right, transparent, black 24px)' : '',
            canScrollRight ? 'linear-gradient(to left,  transparent, black 24px)' : '',
          ].filter(Boolean).join(', ') || undefined,
        }}
      >
        <div className="flex gap-4 w-full items-start">
          {COLUMNS.map((col) => {
            const tasks = columns[col.id];
            const isAdding = addingInColumn === col.id;
            const isTargeted = dragOverCol === col.id;

            return (
              <div
                key={col.id}
                data-no-drag
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, col.id)}
                className={`flex flex-col flex-1 min-w-[260px] rounded-2xl bg-white dark:bg-surface-container-high shadow-sm transition-all duration-150 ${isTargeted ? 'ring-2 ring-primary/60 bg-primary/5 dark:bg-primary/10' : ''
                  }`}
              >
                {/* Column header */}
                <div className="px-4 pt-4 pb-3">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-sm font-semibold text-foreground">{col.label}</span>
                    <span className="text-xs font-bold text-muted-foreground bg-surface dark:bg-surface-container-high border border-border rounded-full px-2 py-0.5 min-w-[1.5rem] text-center">
                      {tasks.length}
                    </span>
                  </div>
                  <div className={`h-0.5 w-full rounded-full ${col.accent} opacity-70`} />
                </div>

                {/* Cards */}
                <div className="flex flex-col gap-2 px-3 pb-1">
                  {tasks.map((task, idx) => (
                    <React.Fragment key={task.id}>
                      {dropIndicator?.colId === col.id && dropIndicator.index === idx && (
                        <div className="h-1 bg-primary rounded-full shadow-sm animate-pulse transition-all" />
                      )}
                      <KanbanCard
                        task={task}
                        colId={col.id}
                        index={idx}
                        onDragStart={handleCardDragStart}
                        onCardDragOver={handleCardDragOver}
                      />
                    </React.Fragment>
                  ))}

                  {dropIndicator?.colId === col.id && dropIndicator.index === tasks.length && (
                    <div className="h-1 bg-primary rounded-full shadow-sm animate-pulse transition-all" />
                  )}

                  {/* Inline add form */}
                  {isAdding && (
                    <InlineAddForm
                      onAdd={(title) => handleAddTask(col.id, title)}
                      onCancel={() => setAddingInColumn(null)}
                    />
                  )}
                </div>

                {/* Column footer */}
                <div className="px-3 pb-3 pt-1">
                  {isAdding ? (
                    <button
                      onClick={() => setAddingInColumn(null)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium text-outline hover:text-foreground hover:bg-surface-container-low border border-dashed border-border hover:border-outline transition-all duration-150"
                    >
                      Cancel
                    </button>
                  ) : (
                    <button
                      onClick={() => setAddingInColumn(col.id)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium text-outline hover:text-foreground hover:bg-surface dark:hover:bg-surface-container-high border border-dashed border-border hover:border-outline transition-all duration-150"
                    >
                      <Plus size={12} strokeWidth={2.5} />
                      Add task
                    </button>
                  )}
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
