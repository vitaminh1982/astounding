/**
 * Tasks tab component - Kanban Board Layout with proper height management
 */
import React, { useRef, useState, useEffect } from 'react';
import { CheckSquare, Search, Plus, Filter, LayoutGrid, ChevronLeft, ChevronRight } from 'lucide-react';
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

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

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
      color: 'bg-blue-500 dark:bg-teal-500',
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

  // Check scroll position to show/hide navigation arrows
  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScrollPosition();
    const handleResize = () => checkScrollPosition();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [filteredTasks]);

  // Smooth scroll functions
  const scrollToLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -350, behavior: 'smooth' });
  };

  const scrollToRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 350, behavior: 'smooth' });
  };

  // Mouse drag to scroll
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.style.cursor = 'grabbing';
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.style.cursor = 'grab';
      }
    }
  };

  const getTasksByStatus = (status: Task['status']) => {
    return filteredTasks.filter(task => task.status === status);
  };

  const showFilters = taskFilter.agent !== 'all' || taskFilter.search !== '';

  return (
    <div className="flex flex-col h-full min-h-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
      {/* Header - Fixed height */}
      <div className="flex-shrink-0 p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600 shadow-sm dark:shadow-gray-900 transition-colors">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex-shrink-0">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Task Board</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filteredTasks.length} tasks across {agents.length} agents
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto flex-shrink-0">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 pointer-events-none" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={taskFilter.search}
                onChange={(e) => setTaskFilter(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:border-indigo-500 dark:focus:border-teal-500 text-sm w-full sm:w-64 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all"
              />
            </div>

            {/* Agent Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 pointer-events-none" />
              <select
                value={taskFilter.agent}
                onChange={(e) => setTaskFilter(prev => ({ ...prev, agent: e.target.value }))}
                className="pl-10 pr-8 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:border-indigo-500 dark:focus:border-teal-500 w-full sm:w-auto cursor-pointer transition-all"
              >
                <option value="all">All Agents</option>
                {agents.map(agent => (
                  <option key={agent.id} value={agent.name}>{agent.name}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Add Task Button */}
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 dark:bg-teal-600 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-teal-700 active:bg-indigo-800 dark:active:bg-teal-800 transition-colors text-sm font-medium shadow-sm dark:shadow-gray-900 hover:shadow-md">
              <Plus className="w-4 h-4" />
              New Task
            </button>
          </div>
        </div>

        {/* Active Filters Badge */}
        {showFilters && (
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Active filters:</span>
            {taskFilter.agent !== 'all' && (
              <span className="px-3 py-1.5 bg-indigo-100 dark:bg-teal-900/30 text-indigo-700 dark:text-teal-300 rounded-full text-xs font-medium flex items-center gap-1.5">
                Agent: {taskFilter.agent}
                <button 
                  onClick={() => setTaskFilter(prev => ({ ...prev, agent: 'all' }))}
                  className="hover:bg-indigo-200 dark:hover:bg-teal-800/50 rounded-full p-0.5 transition-colors ml-1"
                  aria-label="Remove agent filter"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {taskFilter.search && (
              <span className="px-3 py-1.5 bg-indigo-100 dark:bg-teal-900/30 text-indigo-700 dark:text-teal-300 rounded-full text-xs font-medium flex items-center gap-1.5">
                Search: "{taskFilter.search.length > 20 ? taskFilter.search.substring(0, 20) + '...' : taskFilter.search}"
                <button 
                  onClick={() => setTaskFilter(prev => ({ ...prev, search: '' }))}
                  className="hover:bg-indigo-200 dark:hover:bg-teal-800/50 rounded-full p-0.5 transition-colors ml-1"
                  aria-label="Clear search"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            <button 
              onClick={() => setTaskFilter({ agent: 'all', status: 'all', search: '' })}
              className="text-xs text-indigo-600 dark:text-teal-400 hover:text-indigo-800 dark:hover:text-teal-300 font-medium hover:underline transition-colors"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Kanban Board Container - Takes remaining space */}
      <div className="flex-1 min-h-0 relative">
        {/* Left Scroll Button */}
        {canScrollLeft && (
          <button
            onClick={scrollToLeft}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 shadow-lg dark:shadow-gray-900 rounded-full p-3 transition-all duration-200 hover:scale-110 border border-gray-200 dark:border-gray-600"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        )}

        {/* Right Scroll Button */}
        {canScrollRight && (
          <button
            onClick={scrollToRight}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 shadow-lg dark:shadow-gray-900 rounded-full p-3 transition-all duration-200 hover:scale-110 border border-gray-200 dark:border-gray-600"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        )}

        {/* Scrollable Board Container */}
        <div 
          ref={scrollContainerRef}
          onScroll={checkScrollPosition}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="h-full overflow-x-auto overflow-y-hidden p-6 cursor-grab active:cursor-grabbing select-none"
          style={{ 
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgb(203 213 225) rgb(241 245 249)'
          }}
        >
          {/* Columns Container */}
          <div className="flex gap-6 h-full min-w-max">
            {columns.map(column => {
              const columnTasks = getTasksByStatus(column.id);
              return (
                <div 
                  key={column.id} 
                  className="flex flex-col w-80 h-full bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900 border border-gray-200 dark:border-gray-600 transition-colors"
                  onMouseDown={(e) => e.stopPropagation()} // Prevent drag on column interaction
                >
                  {/* Column Header - Fixed */}
                  <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-t-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${column.color} shadow-sm`}></div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">{column.title}</h4>
                      </div>
                      <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold px-2.5 py-1 rounded-full min-w-[2rem] text-center">
                        {columnTasks.length}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${column.color} transition-all duration-500 ease-out`}
                        style={{ width: `${filteredTasks.length > 0 ? (columnTasks.length / filteredTasks.length) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Column Content - Scrollable, takes remaining space */}
                  <div 
                    className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3 scrollbar-thin"
                    style={{ 
                      scrollbarWidth: 'thin',
                      scrollbarColor: 'rgb(203 213 225) rgb(241 245 249)'
                    }}
                  >
                    {columnTasks.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center py-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400 dark:text-gray-500">
                          {column.icon}
                        </div>
                        <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">No tasks</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Tasks will appear here</p>
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

                  {/* Column Footer - Fixed */}
                  <div className="flex-shrink-0 p-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 rounded-b-xl">
                    <button className="w-full py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-all duration-200 font-medium flex items-center justify-center gap-2 border border-transparent hover:border-gray-200 dark:hover:border-gray-500 hover:shadow-sm">
                      <Plus className="w-4 h-4" />
                      Add Task
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scroll Hint Tooltip */}
        <div 
          className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gray-900/90 dark:bg-gray-100/90 text-white dark:text-gray-900 text-xs px-4 py-2 rounded-full pointer-events-none transition-opacity duration-300 opacity-0 hover:opacity-0 flex items-center gap-2 shadow-lg"
          style={{ animation: 'fadeInOut 3s ease-in-out 1s' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
          </svg>
          Click and drag to scroll horizontally
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        /* Webkit browsers (Chrome, Safari, Edge) */
        .overflow-x-auto::-webkit-scrollbar {
          height: 10px;
        }
        .overflow-x-auto::-webkit-scrollbar-track {
          background: rgb(241 245 249);
          border-radius: 5px;
          margin: 0 1.5rem;
        }
        .dark .overflow-x-auto::-webkit-scrollbar-track {
          background: rgb(55 65 81);
        }
        .overflow-x-auto::-webkit-scrollbar-thumb {
          background: rgb(203 213 225);
          border-radius: 5px;
          border: 2px solid rgb(241 245 249);
        }
        .dark .overflow-x-auto::-webkit-scrollbar-thumb {
          background: rgb(107 114 128);
          border-color: rgb(55 65 81);
        }
        .overflow-x-auto::-webkit-scrollbar-thumb:hover {
          background: rgb(148 163 184);
        }
        .dark .overflow-x-auto::-webkit-scrollbar-thumb:hover {
          background: rgb(156 163 175);
        }

        .overflow-y-auto::-webkit-scrollbar,
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track,
        .scrollbar-thin::-webkit-scrollbar-track {
          background: rgb(241 245 249);
          border-radius: 3px;
        }
        .dark .overflow-y-auto::-webkit-scrollbar-track,
        .dark .scrollbar-thin::-webkit-scrollbar-track {
          background: rgb(55 65 81);
        }
        .overflow-y-auto::-webkit-scrollbar-thumb,
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgb(203 213 225);
          border-radius: 3px;
        }
        .dark .overflow-y-auto::-webkit-scrollbar-thumb,
        .dark .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgb(107 114 128);
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover,
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgb(148 163 184);
        }
        .dark .overflow-y-auto::-webkit-scrollbar-thumb:hover,
        .dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgb(156 163 175);
        }

        @keyframes fadeInOut {
          0%, 100% { opacity: 0; }
          10%, 90% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default TasksTab;
