import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, FolderOpen, ArrowRight } from 'lucide-react';
import { useProjectCreation } from '../../context/ProjectCreationContext';
import { useWorkspace } from '../../context/WorkspaceContext';
import { toast } from 'react-hot-toast';

const COLOR_MAP: Record<string, { bg: string; text: string }> = {
  violet:  { bg: 'bg-violet-100 dark:bg-violet-900/30',  text: 'text-violet-700 dark:text-violet-400'  },
  amber:   { bg: 'bg-amber-100 dark:bg-amber-900/30',   text: 'text-amber-700 dark:text-amber-400'   },
  emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400' },
  sky:     { bg: 'bg-sky-100 dark:bg-sky-900/30',     text: 'text-sky-700 dark:text-sky-400'     },
  indigo:  { bg: 'bg-indigo-100 dark:bg-indigo-900/30',  text: 'text-indigo-700 dark:text-indigo-400'  },
  rose:    { bg: 'bg-rose-100 dark:bg-rose-900/30',    text: 'text-rose-700 dark:text-rose-400'    },
  teal:    { bg: 'bg-teal-100 dark:bg-teal-900/30',    text: 'text-teal-700 dark:text-teal-400'    },
  blue:    { bg: 'bg-blue-100 dark:bg-blue-900/30',    text: 'text-blue-700 dark:text-blue-400'    },
};

interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: 'work' | 'personal' | 'finance' | 'marketing' | 'team';
  deliveryTrackLabel: string;
  emoji: string;
  color: string;
  rating: number;
  featured?: boolean;
  previewText?: string;
}

const TEMPLATES: ProjectTemplate[] = [
  {
    id: 'tpl-plan-quarter',
    name: 'Plan your quarter',
    description: 'Roadmaps, milestones and reviews for product teams.',
    category: 'work',
    deliveryTrackLabel: 'Milestone Track',
    emoji: '🎯',
    color: 'violet',
    rating: 4.9,
    featured: true,
    previewText: 'roadmap preview',
  },
  {
    id: 'tpl-track-dollar',
    name: 'Track every dollar',
    description: 'Budgets, expenses and forecasts on a single board.',
    category: 'finance',
    deliveryTrackLabel: 'Kanban Flow',
    emoji: '💰',
    color: 'emerald',
    rating: 4.8,
    featured: true,
    previewText: 'budget preview',
  },
  {
    id: 'tpl-product-roadmap',
    name: 'Product Roadmap',
    description: 'Track features, releases, and high-level strategy.',
    category: 'work',
    deliveryTrackLabel: 'Milestone Track',
    emoji: '🗺️',
    color: 'indigo',
    rating: 4.9,
  },
  {
    id: 'tpl-crm-pipeline',
    name: 'CRM Pipeline',
    description: 'Manage sales deals, customer relations, and funnel stages.',
    category: 'finance',
    deliveryTrackLabel: 'Kanban Flow',
    emoji: '📈',
    color: 'sky',
    rating: 4.8,
  },
  {
    id: 'tpl-content-calendar',
    name: 'Content Calendar',
    description: 'Plan, schedule, and organize marketing content and articles.',
    category: 'marketing',
    deliveryTrackLabel: 'Sprint Board',
    emoji: '📅',
    color: 'rose',
    rating: 4.7,
  },
  {
    id: 'tpl-onboarding-plan',
    name: 'Employee Onboarding',
    description: 'Step-by-step checklist and guide for new team hires.',
    category: 'team',
    deliveryTrackLabel: 'Milestone Track',
    emoji: '👋',
    color: 'amber',
    rating: 4.6,
  },
  {
    id: 'tpl-personal-goals',
    name: 'Personal Goals',
    description: 'Track personal achievements, habits, and side projects.',
    category: 'personal',
    deliveryTrackLabel: 'Kanban Flow',
    emoji: '🏆',
    color: 'teal',
    rating: 4.7,
  }
];

export default function ProjectListView() {
  const { dispatch } = useProjectCreation();
  const { activeWorkspace, activeProject, switchProject, addProjectToWorkspace } = useWorkspace();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const templatesSectionRef = useRef<HTMLDivElement>(null);

  function handleNewProject() {
    dispatch({ type: 'RESET_INTAKE' });
  }

  function handleOpenProject(projectId: string) {
    switchProject(projectId);
  }

  function handleCreateFromTemplate(template: ProjectTemplate) {
    const newId = 'proj-' + Date.now();
    const newProject = {
      id: newId,
      name: template.name,
      deliveryTrackLabel: template.deliveryTrackLabel,
      emoji: template.emoji,
      color: template.color,
    };
    addProjectToWorkspace(newProject);
    toast.success(`Project created: ${template.name}`);
  }

  const scrollToTemplates = () => {
    setIsCreateModalOpen(false);
    setTimeout(() => {
      templatesSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const workspaceProjects = activeWorkspace?.projects ?? [];
  const categories = ['All', 'Work', 'Personal', 'Finance', 'Marketing', 'Team'];

  const filteredTemplates = TEMPLATES.filter(tpl => {
    const matchesSearch = tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tpl.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || tpl.category === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const featuredTemplates = filteredTemplates.filter(t => t.featured);
  const standardTemplates = filteredTemplates.filter(t => !t.featured);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">All Projects</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Create and manage AI-driven projects
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsCreateModalOpen(true)}
          className="cta-btn px-5 py-2.5 text-sm"
        >
          <Plus className="w-4 h-4" />
          Create Project
        </motion.button>
      </div>

      {/* Project Grid / Templates Dashboard */}
      {workspaceProjects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
            <FolderOpen className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">No projects yet</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
            Start your first AI-driven project. Our assistant will guide you through a conversational intake to configure the perfect setup.
          </p>
          <button
            onClick={handleNewProject}
            className="cta-btn px-5 py-2.5 text-sm"
          >
            <Plus className="w-4 h-4" />
            Create Your First Project
          </button>
        </motion.div>
      ) : (
        <div className="space-y-8">
          {/* Projects row */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
              Your Projects · {workspaceProjects.length}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workspaceProjects.map((project, i) => {
                const colors = COLOR_MAP[project.color] ?? COLOR_MAP['indigo'];
                const isActive = activeProject?.id === project.id;
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handleOpenProject(project.id)}
                    className={`bg-white dark:bg-gray-800 rounded-xl border p-4 cursor-pointer hover:shadow-lg dark:hover:shadow-gray-900/50 hover:border-blue-300 dark:hover:border-teal-600 transition-all group ${
                      isActive
                        ? 'border-blue-500 dark:border-teal-500 ring-1 ring-blue-500 dark:ring-teal-500'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center text-lg leading-none flex-shrink-0`}>
                          {project.emoji}
                        </span>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-teal-400 transition-colors">
                            {project.name}
                          </h3>
                          <div className="mt-1">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${colors.bg} ${colors.text}`}>
                              {project.deliveryTrackLabel}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 dark:group-hover:text-teal-400 transition-colors ml-1 flex-shrink-0" />
                    </div>
                  </motion.div>
                );
              })}

              {/* dashed card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: workspaceProjects.length * 0.05 }}
                onClick={() => setIsCreateModalOpen(true)}
                className="border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-teal-500 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl p-4 flex items-center justify-center cursor-pointer hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-teal-400 transition-colors font-medium text-sm">
                  <Plus className="w-4 h-4" />
                  <span>New blank project</span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Templates Section */}
          <div ref={templatesSectionRef} className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Start something new</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Browse ready-made project setups and launch in seconds
                </p>
              </div>
              <button
                onClick={scrollToTemplates}
                className="text-sm font-semibold text-primary-green hover:underline flex items-center gap-1 transition-colors"
              >
                See all <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What would you like to build?"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-teal-500 transition-all text-sm"
              />
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap gap-1.5 py-1">
              {categories.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      isActive
                        ? 'bg-primary-green/10 text-primary-green border-primary-green'
                        : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            {/* Featured templates */}
            {featuredTemplates.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {featuredTemplates.map((template) => {
                  const colors = COLOR_MAP[template.color] ?? COLOR_MAP['indigo'];
                  return (
                    <div
                      key={template.id}
                      onClick={() => handleCreateFromTemplate(template)}
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 hover:shadow-lg dark:hover:shadow-gray-900/50 hover:border-blue-300 dark:hover:border-teal-600 transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex-1 pr-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wider uppercase ${
                            template.id === 'tpl-plan-quarter'
                              ? 'bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400'
                              : 'bg-amber-100 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400'
                          }`}>
                            {template.id === 'tpl-plan-quarter' ? '🎯 Featured' : '🚀 Popular'}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-teal-400 transition-colors">
                          {template.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                          {template.description}
                        </p>
                      </div>
                      <div className={`w-32 h-24 rounded-xl ${colors.bg} bg-opacity-35 flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-600 relative overflow-hidden select-none flex-shrink-0`}>
                        <div className="absolute inset-0 opacity-10 bg-repeat bg-[length:10px_10px]" style={{ backgroundImage: 'linear-gradient(45deg, currentColor 25%, transparent 25%, transparent 50%, currentColor 50%, currentColor 75%, transparent 75%, transparent)' }}></div>
                        <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider relative z-10 text-center px-2">
                          {template.previewText}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Standard templates */}
            {standardTemplates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {standardTemplates.map((template) => {
                  const colors = COLOR_MAP[template.color] ?? COLOR_MAP['indigo'];
                  return (
                    <div
                      key={template.id}
                      onClick={() => handleCreateFromTemplate(template)}
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl hover:shadow-lg dark:hover:shadow-gray-900/50 hover:border-blue-300 dark:hover:border-teal-600 transition-all cursor-pointer overflow-hidden flex flex-col group"
                    >
                      <div className={`h-24 w-full ${colors.bg} bg-opacity-40 flex items-center justify-center relative overflow-hidden select-none border-b border-gray-100 dark:border-gray-700`}>
                        <div className="absolute inset-0 opacity-10 bg-repeat bg-[length:8px_8px]" style={{ backgroundImage: 'linear-gradient(45deg, currentColor 25%, transparent 25%, transparent 50%, currentColor 50%, currentColor 75%, transparent 75%, transparent)' }}></div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${colors.bg} ${colors.text} relative z-10`}>
                          {template.name.toLowerCase()}
                        </span>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-teal-400 transition-colors">
                            {template.name}
                          </h4>
                          <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-2 mt-1">
                            {template.description}
                          </p>
                        </div>
                        <div className="flex items-center justify-between text-xs pt-1">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${colors.bg} ${colors.text}`}>
                            {template.deliveryTrackLabel}
                          </span>
                          <span className="flex items-center gap-0.5 text-gray-500 dark:text-gray-400 font-medium">
                            ⭐ {template.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              searchQuery && (
                <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">
                  No templates found matching "{searchQuery}"
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-xl w-full p-6 relative border border-gray-100 dark:border-gray-700 shadow-2xl"
          >
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Create a new project</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Choose how you'd like to start.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => {
                  setIsCreateModalOpen(false);
                  handleNewProject();
                }}
                className="border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-teal-500 hover:bg-blue-50/5 dark:hover:bg-teal-950/5 rounded-2xl p-5 cursor-pointer flex flex-col items-center text-center space-y-3 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center text-gray-400 group-hover:text-blue-500 dark:group-hover:text-teal-400 transition-colors border border-gray-100 dark:border-gray-600">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-teal-400 transition-colors">
                    Blank project
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Start from scratch and set up your own structure.
                  </p>
                </div>
              </div>

              <div
                onClick={scrollToTemplates}
                className="border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-teal-500 hover:bg-blue-50/5 dark:hover:bg-teal-950/5 rounded-2xl p-5 cursor-pointer flex flex-col items-center text-center space-y-3 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center text-gray-400 group-hover:text-blue-500 dark:group-hover:text-teal-400 transition-colors border border-gray-100 dark:border-gray-600">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-teal-400 transition-colors">
                    From a template
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Browse ready-made setups and launch faster.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-700 pt-4">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>You can change the structure anytime.</span>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
