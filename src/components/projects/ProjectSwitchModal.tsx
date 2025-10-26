import React, { useState, useEffect, useRef } from 'react';
import { X, Search, Users, Calendar, BarChart3, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Project {
  id: string;
  name: string;
  client: {
    name: string;
    logo?: string;
    industry: string;
  };
  status: 'active' | 'planning' | 'on-hold' | 'completed';
  progress: number;
  startDate: string;
  endDate: string;
  teamSize: number;
  description: string;
  priority: 'high' | 'medium' | 'low';
  budget: string;
  lastActivity: string;
}

interface ProjectSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProjectId: string;
  onProjectSelect: (project: Project) => void;
}

// Mock data for available projects
const AVAILABLE_PROJECTS: Project[] = [
  {
    id: 'proj-001',
    name: 'Digital Transformation Initiative',
    client: {
      name: 'TechCorp Solutions',
      industry: 'Technology'
    },
    status: 'active',
    progress: 65,
    startDate: '2025-01-15',
    endDate: '2025-06-30',
    teamSize: 8,
    description: 'Comprehensive digital transformation strategy and implementation',
    priority: 'high',
    budget: '€450,000',
    lastActivity: '2 hours ago'
  },
  {
    id: 'proj-002',
    name: 'Market Expansion Analysis',
    client: {
      name: 'GlobalRetail Inc',
      industry: 'Retail'
    },
    status: 'active',
    progress: 40,
    startDate: '2025-02-01',
    endDate: '2025-05-15',
    teamSize: 5,
    description: 'Strategic analysis for European market expansion',
    priority: 'medium',
    budget: '€180,000',
    lastActivity: '1 day ago'
  },
  {
    id: 'proj-003',
    name: 'Process Optimization Study',
    client: {
      name: 'Manufacturing Plus',
      industry: 'Manufacturing'
    },
    status: 'planning',
    progress: 15,
    startDate: '2025-03-01',
    endDate: '2025-08-30',
    teamSize: 6,
    description: 'Operational efficiency improvement and cost reduction',
    priority: 'medium',
    budget: '€320,000',
    lastActivity: '3 days ago'
  },
  {
    id: 'proj-004',
    name: 'Financial Restructuring',
    client: {
      name: 'FinanceFirst Bank',
      industry: 'Financial Services'
    },
    status: 'on-hold',
    progress: 25,
    startDate: '2024-11-01',
    endDate: '2025-04-30',
    teamSize: 4,
    description: 'Comprehensive financial restructuring and risk assessment',
    priority: 'high',
    budget: '€680,000',
    lastActivity: '1 week ago'
  },
  {
    id: 'proj-005',
    name: 'Customer Experience Enhancement',
    client: {
      name: 'ServiceExcellence Ltd',
      industry: 'Hospitality'
    },
    status: 'completed',
    progress: 100,
    startDate: '2024-08-01',
    endDate: '2024-12-15',
    teamSize: 7,
    description: 'End-to-end customer journey optimization',
    priority: 'low',
    budget: '€275,000',
    lastActivity: '2 weeks ago'
  },
  {
    id: 'proj-006',
    name: 'AI Implementation Strategy',
    client: {
      name: 'InnovateNow Corp',
      industry: 'Technology'
    },
    status: 'active',
    progress: 80,
    startDate: '2024-10-01',
    endDate: '2025-03-31',
    teamSize: 9,
    description: 'AI adoption roadmap and implementation planning',
    priority: 'high',
    budget: '€520,000',
    lastActivity: '4 hours ago'
  }
];

const ProjectSwitchModal: React.FC<ProjectSwitchModalProps> = ({
  isOpen,
  onClose,
  currentProjectId,
  onProjectSelect
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter projects based on search query
  const filteredProjects = AVAILABLE_PROJECTS.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.client.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Focus management for accessibility
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle project selection
  const handleProjectSelect = async (project: Project) => {
    if (project.id === currentProjectId) {
      onClose();
      return;
    }

    setSelectedProject(project);
    setIsLoading(true);

    try {
      // Simulate project switching delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      onProjectSelect(project);
      onClose();
    } catch (error) {
      console.error('Error switching project:', error);
    } finally {
      setIsLoading(false);
      setSelectedProject(null);
    }
  };

  // Get status styling
  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300';
      case 'planning': return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300';
      case 'on-hold': return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300';
      case 'completed': return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
    }
  };

  // Get status icon
  const getStatusIcon = (status: Project['status']) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'planning': return <Clock className="w-4 h-4" />;
      case 'on-hold': return <AlertTriangle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  // Get priority color
  const getPriorityColor = (priority: Project['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-600 dark:text-red-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'low': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-60 z-50 flex items-center justify-center p-4"
        onClick={handleBackdropClick}
      >
        <motion.div
          ref={modalRef}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl dark:shadow-gray-900 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-200 dark:border-gray-600 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Switch Project</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Select a consulting project to work on</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-600">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search projects by name, client, or industry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:border-indigo-500 dark:focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
              />
            </div>
          </div>

          {/* Projects List */}
          <div className="flex-1 overflow-y-auto p-6">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 dark:text-gray-500 mb-4">
                  <Search className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No projects found</h3>
                <p className="text-gray-500 dark:text-gray-400">Try adjusting your search criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleProjectSelect(project)}
                    className={`
                      relative p-6 border rounded-xl cursor-pointer transition-all duration-200
                      ${project.id === currentProjectId 
                        ? 'border-indigo-500 dark:border-teal-500 bg-indigo-50 dark:bg-teal-900/20 ring-2 ring-indigo-200 dark:ring-teal-500/30' 
                        : 'border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-teal-400 hover:shadow-md dark:hover:shadow-gray-800 bg-white dark:bg-gray-700/50'
                      }
                      ${selectedProject?.id === project.id ? 'opacity-75' : ''}
                    `}
                  >
                    {/* Loading overlay */}
                    {selectedProject?.id === project.id && isLoading && (
                      <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-75 dark:bg-opacity-75 flex items-center justify-center rounded-xl">
                        <div className="flex items-center gap-2 text-indigo-600 dark:text-teal-400">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600 dark:border-teal-400"></div>
                          <span className="text-sm font-medium">Switching...</span>
                        </div>
                      </div>
                    )}

                    {/* Current project indicator */}
                    {project.id === currentProjectId && (
                      <div className="absolute top-4 right-4">
                        <div className="flex items-center gap-1 px-2 py-1 bg-indigo-600 dark:bg-teal-600 text-white text-xs rounded-full">
                          <CheckCircle className="w-3 h-3" />
                          Current
                        </div>
                      </div>
                    )}

                    {/* Project Header */}
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 pr-16">{project.name}</h3>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 dark:from-teal-500 dark:to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {project.client.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{project.client.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{project.client.industry}</p>
                        </div>
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 dark:text-gray-300">{project.description}</p>
                      
                      {/* Status and Priority */}
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {getStatusIcon(project.status)}
                          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </span>
                        <span className={`text-xs font-medium ${getPriorityColor(project.priority)}`}>
                          {project.priority.toUpperCase()} PRIORITY
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400">Progress</span>
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div 
                            className="bg-indigo-600 dark:bg-teal-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Project Metrics */}
                      <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-100 dark:border-gray-600">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-gray-500 dark:text-gray-400 mb-1">
                            <Users className="w-3 h-3" />
                            <span className="text-xs">Team</span>
                          </div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{project.teamSize}</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-gray-500 dark:text-gray-400 mb-1">
                            <Calendar className="w-3 h-3" />
                            <span className="text-xs">Duration</span>
                          </div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {Math.ceil((new Date(project.endDate).getTime() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30))}mo
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-gray-500 dark:text-gray-400 mb-1">
                            <BarChart3 className="w-3 h-3" />
                            <span className="text-xs">Budget</span>
                          </div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{project.budget}</p>
                        </div>
                      </div>

                      {/* Last Activity */}
                      <div className="pt-2 border-t border-gray-100 dark:border-gray-600">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Last activity: {project.lastActivity}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} available
              </p>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-indigo-600 dark:bg-teal-600 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-teal-700 transition-colors shadow-sm dark:shadow-gray-900"
                >
                  Stay on Current Project
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProjectSwitchModal;
