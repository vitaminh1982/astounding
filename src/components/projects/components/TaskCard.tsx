/**
 * Individual task card component
 */
import React from 'react';
import { CheckCircle, Clock, AlertCircle, XCircle, User, Calendar, RotateCcw, Eye } from 'lucide-react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onRetryTask: (taskId: string) => void;
}

/**
 * TaskCard displays an individual task with status and actions
 */
const TaskCard: React.FC<TaskCardProps> = ({ task, onRetryTask }) => {
  const getTaskStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getTaskStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'pending': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };
  
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="text-lg font-semibold text-gray-900">{task.name}</h4>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTaskStatusColor(task.status)}`}>
              {getTaskStatusIcon(task.status)}
              <span className="ml-1">{task.status.charAt(0).toUpperCase() + task.status.slice(1)}</span>
            </span>
            <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
              {task.priority.toUpperCase()} PRIORITY
            </span>
          </div>
          <p className="text-gray-600 mb-3">{task.description}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>Assigned to: {task.assignedAgent}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Created: {task.createdAt.toLocaleDateString()}</span>
            </div>
            {task.estimatedDuration && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Est. Duration: {task.estimatedDuration}</span>
              </div>
            )}
            {task.completedAt && (
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                <span>Completed: {task.completedAt.toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {(task.status === 'failed' || task.status === 'completed') && (
            <button
              onClick={() => onRetryTask(task.id)}
              className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Retry
            </button>
          )}
          <button className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
            <Eye className="w-4 h-4" />
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;