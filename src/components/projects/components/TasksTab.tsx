/**
 * Tasks tab component for project task management
 */
import React from 'react';
import { CheckSquare, Search } from 'lucide-react';
import TaskCard from './TaskCard';
import { useTaskManagement } from '../hooks/useTaskManagement';
import { Agent } from '../types';

interface TasksTabProps {
  agents: Agent[];
}

/**
 * TasksTab manages and displays project tasks with filtering capabilities
 */
const TasksTab: React.FC<TasksTabProps> = ({ agents }) => {
  const {
    taskFilter,
    setTaskFilter,
    filteredTasks,
    handleRetryTask
  } = useTaskManagement();

  return (
    <div className="flex flex-col h-full">
      {/* Tasks Header with Filters */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Project Tasks</h3>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={taskFilter.search}
                onChange={(e) => setTaskFilter(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>
            <select
              value={taskFilter.agent}
              onChange={(e) => setTaskFilter(prev => ({ ...prev, agent: e.target.value }))}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="all">All Agents</option>
              {agents.map(agent => (
                <option key={agent.id} value={agent.name}>{agent.name}</option>
              ))}
            </select>
            <select
              value={taskFilter.status}
              onChange={(e) => setTaskFilter(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-500">
              {taskFilter.search || taskFilter.agent !== 'all' || taskFilter.status !== 'all'
                ? 'Try adjusting your filters'
                : 'Tasks assigned to agents will appear here'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onRetryTask={handleRetryTask}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksTab;