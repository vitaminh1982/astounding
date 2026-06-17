import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, GripVertical, ClipboardList, ShieldAlert, Calendar, CheckCircle2, Cpu } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useProjectCreation } from '../../context/ProjectCreationContext';
import { ProjectTask, ProjectAgent } from '../../types/project-creation';

const COLUMNS: { id: ProjectTask['status']; label: string; color: string }[] = [
  { id: 'backlog', label: 'Backlog', color: 'border-gray-400' },
  { id: 'in-progress', label: 'In Progress', color: 'border-blue-400' },
  { id: 'in-review', label: 'In Review', color: 'border-amber-400' },
  { id: 'done', label: 'Done', color: 'border-green-400' },
];

const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
  medium: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  high: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
};

const AGENT_ICON_MAP: Record<string, React.ReactNode> = {
  'clipboard-list': <ClipboardList className="w-3 h-3" />,
  'shield-alert': <ShieldAlert className="w-3 h-3" />,
  'calendar': <Calendar className="w-3 h-3" />,
  'check-circle': <CheckCircle2 className="w-3 h-3" />,
  'cpu': <Cpu className="w-3 h-3" />,
};

interface Props {
  tasks: ProjectTask[];
  agents: ProjectAgent[];
}

export default function KanbanTab({ tasks, agents }: Props) {
  const { dispatch } = useProjectCreation();
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  function getAgent(agentId: string) {
    return agents.find((a) => a.id === agentId);
  }

  function handleDragStart(taskId: string) {
    setDraggedTask(taskId);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  function handleDrop(columnId: ProjectTask['status']) {
    if (draggedTask) {
      dispatch({ type: 'MOVE_TASK', payload: { taskId: draggedTask, newStatus: columnId } });
      setDraggedTask(null);
    }
  }

  function handleAddTask() {
    if (!newTitle.trim()) return;
    const newTask: ProjectTask = {
      id: uuidv4(),
      title: newTitle.trim(),
      description: '',
      assignedAgentId: agents[0]?.id || '',
      status: 'backlog',
      priority: 'medium',
      phaseTag: 'Initiation',
      createdAt: new Date(),
    };
    dispatch({ type: 'ADD_TASK', payload: newTask });
    setNewTitle('');
    setShowAddForm(false);
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Kanban Board</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 dark:bg-teal-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-teal-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
          >
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                placeholder="Task title..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <button
                onClick={handleAddTask}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map((column) => {
          const columnTasks = tasks.filter((t) => t.status === column.id);
          return (
            <div
              key={column.id}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column.id)}
              className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3 min-h-[300px]"
            >
              <div className={`flex items-center gap-2 mb-3 pb-2 border-b-2 ${column.color}`}>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{column.label}</h4>
                <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full px-2 py-0.5">
                  {columnTasks.length}
                </span>
              </div>

              <div className="space-y-2">
                <AnimatePresence>
                  {columnTasks.map((task) => {
                    const agent = getAgent(task.assignedAgentId);
                    return (
                      <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        draggable
                        onDragStart={() => handleDragStart(task.id)}
                        className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow ${
                          draggedTask === task.id ? 'opacity-50' : ''
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <GripVertical className="w-4 h-4 text-gray-300 dark:text-gray-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{task.title}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${PRIORITY_COLORS[task.priority]}`}>
                                {task.priority}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                                {task.phaseTag}
                              </span>
                            </div>
                            {agent && (
                              <div className="flex items-center gap-1.5 mt-2">
                                <span className="text-gray-400 dark:text-gray-500">
                                  {AGENT_ICON_MAP[agent.icon] || <Cpu className="w-3 h-3" />}
                                </span>
                                <span className="text-[10px] text-gray-500 dark:text-gray-400">{agent.name}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {columnTasks.length === 0 && (
                  <div className="text-center py-8 text-xs text-gray-400 dark:text-gray-500">
                    {column.id === 'backlog' ? 'No tasks yet' : 'Drop tasks here'}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
