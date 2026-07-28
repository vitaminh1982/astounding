import React from 'react';
import { Briefcase, Bot, BarChart3 } from 'lucide-react';
import { Project } from './ProjectSwitchModal';

interface ProjectMetrics {
  activeAgents: number;
  totalQueries: number;
  successRate: number;
  avgResponseTime: string;
  tasksGenerated: number;
  documentsCreated: number;
}

interface ProjectHeaderProps {
  currentProject: Project;
  metrics: ProjectMetrics;
  onSwitchProject: () => void;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  currentProject,
  metrics,
  onSwitchProject
}) => {
  return (
    <div className="mb-6 flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-on-surface dark:text-foreground">{currentProject.name}</h1>
        <p className="text-muted-foreground dark:text-muted-foreground">{currentProject.client.name} • {currentProject.client.industry}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-4 bg-white dark:bg-surface-container-high rounded-lg px-4 py-2 border border-border dark:border-border shadow-sm dark:shadow-gray-900">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-primary-green dark:text-primary-green" />
            <span className="text-sm font-medium text-on-surface dark:text-on-surface-variant">{metrics.activeAgents} Active Agents</span>
          </div>
          <div className="w-px h-4 bg-surface-container dark:bg-surface-container-highest" />
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-on-surface dark:text-on-surface-variant">{metrics.successRate}% Success Rate</span>
          </div>
        </div>

        <button
          onClick={onSwitchProject}
          className="flex items-center gap-2 bg-primary dark:bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-green-700 transition-colors shadow-sm dark:shadow-gray-900"
        >
          <Briefcase className="w-4 h-4" />
          <span>Switch Project</span>
        </button>
      </div>
    </div>
  );
};

export default ProjectHeader;
