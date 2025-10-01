/**
 * Custom hook for managing project tasks
 */
import { useState } from 'react';
import { Task, TaskFilter } from '../types';

// Mock task data
const INITIAL_TASKS: Task[] = [
  {
    id: 'task-001',
    name: 'Market Analysis Report',
    description: 'Analyze current market trends and competitive landscape for Q1 2025',
    assignedAgent: 'Shiryu',
    status: 'completed',
    createdAt: new Date('2025-01-15T09:00:00'),
    completedAt: new Date('2025-01-18T14:30:00'),
    priority: 'high',
    estimatedDuration: '3 days'
  },
  {
    id: 'task-002',
    name: 'Requirements Documentation',
    description: 'Document functional and non-functional requirements for the digital transformation',
    assignedAgent: 'Ikki',
    status: 'in-progress',
    createdAt: new Date('2025-01-16T10:15:00'),
    priority: 'high',
    estimatedDuration: '2 days'
  },
  {
    id: 'task-003',
    name: 'Timeline Optimization',
    description: 'Review and optimize project timeline based on current progress',
    assignedAgent: 'Seiya',
    status: 'pending',
    createdAt: new Date('2025-01-20T11:00:00'),
    priority: 'medium',
    estimatedDuration: '1 day'
  },
  {
    id: 'task-004',
    name: 'Risk Assessment',
    description: 'Identify and assess potential project risks and mitigation strategies',
    assignedAgent: 'Hyôga',
    status: 'failed',
    createdAt: new Date('2025-01-17T13:45:00'),
    priority: 'medium',
    estimatedDuration: '2 days'
  },
  {
    id: 'task-005',
    name: 'Compliance Review',
    description: 'Review project deliverables for compliance with industry standards',
    assignedAgent: 'Shun',
    status: 'completed',
    createdAt: new Date('2025-01-19T08:30:00'),
    completedAt: new Date('2025-01-21T16:00:00'),
    priority: 'low',
    estimatedDuration: '1 day'
  },
  {
    id: 'task-006',
    name: 'User Interface Design',
    description: 'Create mockups and prototypes for the new dashboard interface',
    assignedAgent: 'Shiryu',
    status: 'in-progress',
    createdAt: new Date('2025-01-21T09:00:00'),
    priority: 'high',
    estimatedDuration: '4 days'
  },
  {
    id: 'task-007',
    name: 'Database Migration',
    description: 'Migrate legacy database to new cloud infrastructure',
    assignedAgent: 'Ikki',
    status: 'pending',
    createdAt: new Date('2025-01-22T10:00:00'),
    priority: 'high',
    estimatedDuration: '5 days'
  },
  {
    id: 'task-008',
    name: 'Security Audit',
    description: 'Conduct comprehensive security audit of all systems',
    assignedAgent: 'Hyôga',
    status: 'pending',
    createdAt: new Date('2025-01-23T11:00:00'),
    priority: 'medium',
    estimatedDuration: '3 days'
  }
];

export const useTaskManagement = () => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [taskFilter, setTaskFilter] = useState<TaskFilter>({
    agent: 'all',
    status: 'all',
    search: ''
  });

  const handleRetryTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: 'pending' as const, completedAt: undefined }
        : task
    ));
  };

  const filteredTasks = tasks.filter(task => {
    const matchesAgent = taskFilter.agent === 'all' || task.assignedAgent === taskFilter.agent;
    const matchesStatus = taskFilter.status === 'all' || task.status === taskFilter.status;
    const matchesSearch = taskFilter.search === '' || 
      task.name.toLowerCase().includes(taskFilter.search.toLowerCase()) ||
      task.description.toLowerCase().includes(taskFilter.search.toLowerCase());
    
    return matchesAgent && matchesStatus && matchesSearch;
  });

  const getTaskStats = () => {
    return {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      failed: tasks.filter(t => t.status === 'failed').length,
    };
  };

  return {
    tasks,
    taskFilter,
    setTaskFilter,
    filteredTasks,
    handleRetryTask,
    getTaskStats
  };
};
