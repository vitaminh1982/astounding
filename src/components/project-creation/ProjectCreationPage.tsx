import React from 'react';
import { ProjectCreationProvider, useProjectCreation } from '../../context/ProjectCreationContext';
import ProjectListView from './ProjectListView';
import ConversationalIntake from './ConversationalIntake';
import InitializingView from './InitializingView';
import ProjectWorkspace from './ProjectWorkspace';

function ProjectCreationContent({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const { state } = useProjectCreation();

  switch (state.view) {
    case 'list':
      return <ProjectListView onNavigate={onNavigate} />;
    case 'intake':
      return <ConversationalIntake />;
    case 'initializing':
      return <InitializingView />;
    case 'workspace':
      return <ProjectWorkspace />;
    default:
      return <ProjectListView onNavigate={onNavigate} />;
  }
}

export default function ProjectCreationPage({ onNavigate }: { onNavigate?: (page: string) => void }) {
  return (
    <ProjectCreationProvider>
      <ProjectCreationContent onNavigate={onNavigate} />
    </ProjectCreationProvider>
  );
}
