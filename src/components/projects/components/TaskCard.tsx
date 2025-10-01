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
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getPriorityBadge = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className={`bg-white rounded-lg border-l-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group ${getPriorityStyles(task.priority)}`}>
      {/* Card Header */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-semibold text-gray-900 text-sm leading-tight flex-1 pr-2 group-hover:text-indigo-600 transition-colors">
            {task.name}
          </h4>
          <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded">
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>

        {/* Priority Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityBadge(task.priority)}`}>
            {task.priority.toUpperCase()}
          </span>
          {task.estimatedDuration && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {task.estimatedDuration}
            </span>
          )}
        </div>

        {/* Agent & Date Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
              {task.assignedAgent.charAt(0)}
            </div>
            <span className="font-medium text-gray-700">{task.assignedAgent}</span>
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
              className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100 transition-colors text-xs font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              Retry
            </button>
          )}
          <button 
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-gray-50 text-gray-700 rounded hover:bg-gray-100 transition-colors text-xs font-medium"
          >
            <Eye className="w-3 h-3" />
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
