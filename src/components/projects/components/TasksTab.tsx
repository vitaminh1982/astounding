/**
 * Tasks tab component - Kanban Board Layout
 */
import React from 'react';
import { CheckSquare, Search, Plus, Filter, LayoutGrid } from 'lucide-react';
import TaskCard from './TaskCard';
import { useTaskManagement } from '../hooks/useTaskManagement';
import { Agent, Task } from '../types';

interface TasksTabProps {
  agents: Agent[];
}

interface ColumnConfig {
  id: Task['status'];
  title: string;
  color: string;
  icon: React.ReactNode;
}

/**
 * TasksTab displays tasks in a Kanban board layout
 */
const TasksTab: React.FC<TasksTabProps> = ({ agents }) => {
  const {
    taskFilter,
    setTaskFilter,
    filteredTasks,
    handleRetryTask
  } = useTaskManagement();

  const columns: ColumnConfig[] = [
    {
      id: 'pending',
      title: 'Pending',
      color: 'bg-yellow-500',
      icon: <CheckSquare className="w-4 h-4" />
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      color: 'bg-blue-500',
      icon: <LayoutGrid className="w-4 h-4" />
    },
    {
      id: 'completed',
      title: 'Completed',
      color: 'bg-green-500',
      icon: <CheckSquare className="w-4 h-4" />
    },
    {
      id: 'failed',
      title: 'Failed',
      color: 'bg-red-500',
      icon: <CheckSquare className="w-4 h-4" />
    }
  ];

  const getTasksByStatus = (status: Task['status']) => {
    return filteredTasks.filter(task => task.status === status);
  };

  const showFilters = taskFilter.agent !== 'all' || taskFilter.search !== '';

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="p-6 bg-white border-b shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">Task Board</h3>
            <p className="text-sm text-gray-500">
              {filteredTasks.length} tasks across {agents.length} agents
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={taskFilter.search}
                onChange={(e) => setTaskFilter(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm w-full sm:w-64 bg-white"
              />
            </div>

            {/* Agent Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={taskFilter.agent}
                onChange={(e) => setTaskFilter(prev => ({ ...prev, agent: e.target.value }))}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm appearance-none bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-auto"
              >
                <option value="all">All Agents</option>
                {agents.map(agent => (
                  <option key={agent.id} value={agent.name}>{agent.name}</option>
                ))}
              </select>
            </div>

            {/* Add Task Button */}
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm">
              <Plus className="w-4 h-4" />
              New Task
            </button>
          </div>
        </div>

        {/* Active Filters Badge */}
        {showFilters && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-gray-500">Active filters:</span>
            {taskFilter.agent !== 'all' && (
              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium flex items-center gap-1">
                Agent: {taskFilter.agent}
                <button 
                  onClick={() => setTaskFilter(prev => ({ ...prev, agent: 'all' }))}
                  className="hover:bg-indigo-200 rounded-full p-0.5"
                >
                  ×
                </button>
              </span>
            )}
            {taskFilter.search && (
              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium flex items-center gap-1">
                Search: "{taskFilter.search}"
                <button 
                  onClick={() => setTaskFilter(prev => ({ ...prev, search: '' }))}
                  className="hover:bg-indigo-200 rounded-full p-0.5"
                >
                  ×
                </button>
              </span>
            )}
            <button 
              onClick={() => setTaskFilter({ agent: 'all', status: 'all', search: '' })}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
        <div className="flex gap-6 h-full min-w-max">
          {columns.map(column => {
            const columnTasks = getTasksByStatus(column.id);
            return (
              <div key={column.id} className="flex flex-col w-80 bg-white rounded-xl shadow-sm border border-gray-200">
                {/* Column Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
                      <h4 className="font-semibold text-gray-900">{column.title}</h4>
                    </div>
                    <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                      {columnTasks.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${column.color} transition-all duration-300`}
                      style={{ width: `${filteredTasks.length > 0 ? (columnTasks.length / filteredTasks.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* Column Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {columnTasks.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        {column.icon}
                      </div>
                      <p className="text-sm text-gray-400">No tasks</p>
                    </div>
                  ) : (
                    columnTasks.map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onRetryTask={handleRetryTask}
                      />
                    ))
                  )}
                </div>

                {/* Column Footer */}
                <div className="p-3 border-t border-gray-100">
                  <button className="w-full py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors font-medium flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Task
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

export default TasksTab;
