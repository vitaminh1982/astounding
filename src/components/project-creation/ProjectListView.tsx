import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, FolderOpen, ArrowRight } from 'lucide-react';
import { useProjectCreation } from '../../context/ProjectCreationContext';
import { useWorkspace } from '../../context/WorkspaceContext';
import { toast } from 'react-hot-toast';
import PlexCreateModal from './PlexCreateModal';

const COLOR_MAP: Record<string, { bg: string; text: string }> = {
  violet: { bg: 'bg-violet-100 dark:bg-violet-900/30', text: 'text-violet-700 dark:text-violet-400' },
  amber: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-destructive' },
  emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400' },
  sky: { bg: 'bg-sky-100 dark:bg-sky-900/30', text: 'text-sky-700 dark:text-sky-400' },
  indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-700 dark:text-primary-green' },
  rose: { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-700 dark:text-rose-400' },
  green: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400' },
  blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-tertiary' },
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
  image: string;
}

import templatesRaw from '../../data/templates.json';
const TEMPLATES = templatesRaw as ProjectTemplate[];

export default function ProjectListView({ onNavigate }: { onNavigate?: (page: string) => void }) {
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
    onNavigate?.('project-detail');
  }

  function handleCreateFromTemplate(template: ProjectTemplate) {
    const newId = 'proj-' + Date.now();
    const newProject = {
      id: newId,
      name: template.name,
      deliveryTrackLabel: template.deliveryTrackLabel,
      emoji: template.emoji,
      color: template.color,
      image: template.image,
      industry: template.category.charAt(0).toUpperCase() + template.category.slice(1),
      description: template.description,
      phaseLabel: 'Discovery',
      phaseProgress: 0,
      teamSize: 1,
      vision: template.description,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground dark:text-foreground">All Projects</h1>
          <p className="text-sm text-muted-foreground dark:text-muted-foreground mt-1">
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
          <div className="w-16 h-16 rounded-2xl bg-surface-container-low dark:bg-surface-container-high flex items-center justify-center mb-4">
            <FolderOpen className="w-8 h-8 text-outline dark:text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-on-surface dark:text-muted-foreground mb-2">No projects yet</h3>
          <p className="text-sm text-muted-foreground dark:text-muted-foreground max-w-sm mb-6">
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
            <p className="text-[10px] font-bold text-outline dark:text-muted-foreground uppercase tracking-wider mb-3">
              Your Projects · {workspaceProjects.length}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workspaceProjects.map((project, i) => {
                const colors = COLOR_MAP['blue'];
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handleOpenProject(project.id)}
                    className="bg-white dark:bg-surface-container-high rounded-xl border border-border dark:border-border overflow-hidden cursor-pointer hover:shadow-lg dark:hover:shadow-gray-900/50 hover:border-green-400 dark:hover:border-green-600 transition-all group"
                  >
                    {/* Project Image */}
                    <div className="h-32 w-full overflow-hidden bg-surface-container-low dark:bg-background relative">
                      <img
                        src={project.image}
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className={`absolute bottom-3 left-3 w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center text-lg leading-none shadow-md backdrop-blur-sm`}>
                        {project.emoji}
                      </span>
                    </div>

                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-semibold text-foreground dark:text-foreground group-hover:text-primary-green dark:group-hover:text-green-400 transition-colors">
                            {project.name}
                          </h3>
                          <div className="mt-1">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${colors.bg} ${colors.text}`}>
                              {project.deliveryTrackLabel}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-outline group-hover:text-primary-green dark:group-hover:text-green-400 transition-colors ml-1 flex-shrink-0" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* dashed card — opens Plex modal */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: workspaceProjects.length * 0.05 }}
                onClick={() => setIsCreateModalOpen(true)}
                className="border-2 border-dashed border-border dark:border-border hover:border-green-500 dark:hover:border-green-500 bg-surface-container-low/50 dark:bg-surface-container-high/30 rounded-xl flex flex-col items-center justify-center min-h-[180px] cursor-pointer hover:shadow-md transition-all group"
              >
                <div className="flex flex-col items-center gap-2 text-outline dark:text-muted-foreground group-hover:text-primary-green dark:group-hover:text-green-400 transition-colors font-medium text-sm">
                  <Plus className="w-6 h-6" />
                  <span>New blank project</span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Templates Section */}
          <div ref={templatesSectionRef} className="pt-6 border-t border-border dark:border-gray-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground dark:text-foreground">Start something new</h2>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground mt-0.5">
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
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What would you like to build?"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border dark:border-border bg-white dark:bg-surface-container-high text-foreground dark:text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-ring transition-all text-sm"
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
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${isActive
                        ? 'bg-primary-green/10 text-primary-green border-primary-green'
                        : 'bg-white dark:bg-surface-container-high text-muted-foreground dark:text-muted-foreground border-border dark:border-border hover:bg-surface-container-low dark:hover:bg-surface-container-highest'
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
                  return (
                    <div
                      key={template.id}
                      onClick={() => handleCreateFromTemplate(template)}
                      className="bg-white dark:bg-surface-container-high border border-border dark:border-border rounded-2xl p-5 hover:shadow-lg dark:hover:shadow-gray-900/50 hover:border-green-400 dark:hover:border-green-600 transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex-1 pr-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wider uppercase ${template.id === 'tpl-plan-quarter'
                              ? 'bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-destructive'
                              : 'bg-amber-100 dark:bg-amber-950/30 text-amber-600 dark:text-destructive'
                            }`}>
                            {template.id === 'tpl-plan-quarter' ? '🎯 Featured' : '🚀 Popular'}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-foreground dark:text-foreground group-hover:text-primary-green dark:group-hover:text-green-400 transition-colors">
                          {template.name}
                        </h3>
                        <p className="text-xs text-muted-foreground dark:text-muted-foreground line-clamp-2">
                          {template.description}
                        </p>
                      </div>
                      <div className="w-32 h-24 rounded-xl overflow-hidden relative border border-border dark:border-border flex-shrink-0">
                        <img
                          src={template.image}
                          alt={template.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
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
                  const colors = COLOR_MAP['blue'];
                  return (
                    <div
                      key={template.id}
                      onClick={() => handleCreateFromTemplate(template)}
                      className="bg-white dark:bg-surface-container-high border border-border dark:border-border rounded-2xl hover:shadow-lg dark:hover:shadow-gray-900/50 hover:border-green-400 dark:hover:border-green-600 transition-all cursor-pointer overflow-hidden flex flex-col group"
                    >
                      <div className="h-28 w-full relative overflow-hidden border-b border-border dark:border-border">
                        <img
                          src={template.image}
                          alt={template.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <h4 className="text-sm font-bold text-foreground dark:text-foreground group-hover:text-primary-green dark:group-hover:text-green-400 transition-colors">
                            {template.name}
                          </h4>
                          <p className="text-xs text-outline dark:text-muted-foreground line-clamp-2 mt-1">
                            {template.description}
                          </p>
                        </div>
                        <div className="flex items-center justify-between text-xs pt-1">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${colors.bg} ${colors.text}`}>
                            {template.deliveryTrackLabel}
                          </span>
                          <span className="flex items-center gap-0.5 text-muted-foreground dark:text-muted-foreground font-medium">
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
                <div className="text-center py-8 text-outline dark:text-muted-foreground text-sm">
                  No templates found matching "{searchQuery}"
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Plex-style Create Project Modal */}
      {isCreateModalOpen && (
        <PlexCreateModal
          onClose={() => setIsCreateModalOpen(false)}
          onConfirm={(prompt) => {
            setIsCreateModalOpen(false);
            handleNewProject();
          }}
        />
      )}
    </div>
  );
}
