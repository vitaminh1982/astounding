/**
 * Individual task card component - Kanban style
 */
import React from 'react';
import { CheckCircle, Clock, AlertCircle, XCircle, User, Calendar, RotateCcw, Eye, MoreVertical } from 'lucide-react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onRetryTask: (taskId: string) => void;
}

/**
 * TaskCard displays an individual task in Kanban card format
 */
const TaskCard: React.FC<TaskCardProps> = ({ task, onRetryTask }) => {
  const getPriorityStyles = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50/30 dark:bg-red-900/10';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50/30 dark:bg-yellow-900/10';
      case 'low': return 'border-l-green-500 bg-green-50/30 dark:bg-green-900/10';
      default: return 'border-l-gray-500 bg-surface-container-low/30 dark:bg-surface-container-highest/30';
    }
  };

  const getPriorityBadge = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700';
      case 'low': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700';
      default: return 'bg-surface-container-low dark:bg-surface-container-highest text-on-surface dark:text-muted-foreground border-border dark:border-border';
    }
  };

  return (
    <div 
      className={`bg-white dark:bg-surface-container-high rounded-lg border-l-4 shadow-sm dark:shadow-gray-900 hover:shadow-md dark:hover:shadow-gray-800 transition-all duration-200 cursor-pointer group ${getPriorityStyles(task.priority)}`}
      onClick={(e) => {
        // Handle card click (e.g., open modal)
        console.log('Task clicked:', task.id);
      }}
    >
      {/* Card Header */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-semibold text-foreground dark:text-foreground text-sm leading-tight flex-1 pr-2 group-hover:text-primary-green dark:group-hover:text-green-400 transition-colors">
            {task.name}
          </h4>
          <button 
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-surface-container-low dark:hover:bg-surface-container-highest rounded"
            onClick={(e) => {
              e.stopPropagation();
              // Handle more options
            }}
          >
            <MoreVertical className="w-4 h-4 text-outline dark:text-muted-foreground" />
          </button>
        </div>

        <p className="text-xs text-muted-foreground dark:text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
          {task.description}
        </p>

        {/* Priority Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border transition-colors ${getPriorityBadge(task.priority)}`}>
            {task.priority.toUpperCase()}
          </span>
          {task.estimatedDuration && (
            <span className="text-xs text-muted-foreground dark:text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {task.estimatedDuration}
            </span>
          )}
        </div>

        {/* Agent & Date Info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground dark:text-muted-foreground mb-3 pb-3 border-b border-border dark:border-border">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 dark:from-green-400 dark:to-green-500 flex items-center justify-center text-white text-xs font-medium ring-2 ring-white dark:ring-gray-800 shadow-sm transition-colors">
              {task.assignedAgent.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium text-on-surface dark:text-muted-foreground text-xs">{task.assignedAgent}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{task.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {(task.status === 'failed' || task.status === 'completed') && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRetryTask(task.id);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-50 dark:bg-green-900/20 text-indigo-700 dark:text-green-300 rounded-lg hover:bg-indigo-100 dark:hover:bg-green-900/30 active:bg-indigo-200 dark:active:bg-green-900/40 transition-colors text-xs font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retry
            </button>
          )}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              // Handle view action
            }}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-surface-container-low dark:bg-surface-container-highest text-on-surface dark:text-muted-foreground rounded-lg hover:bg-surface-container-low dark:hover:bg-surface-container-highest active:bg-surface-container dark:active:bg-outline transition-colors text-xs font-medium"
          >
            <Eye className="w-3.5 h-3.5" />
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
