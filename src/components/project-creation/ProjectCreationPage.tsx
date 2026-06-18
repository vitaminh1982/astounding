import React from 'react';
import { ProjectCreationProvider, useProjectCreation } from '../../context/ProjectCreationContext';
import ProjectListView from './ProjectListView';
import ConversationalIntake from './ConversationalIntake';
import InitializingView from './InitializingView';
import ProjectWorkspace from './ProjectWorkspace';

function ProjectCreationContent() {
  const { state } = useProjectCreation();

  switch (state.view) {
    case 'list':
      return <ProjectListView />;
    case 'intake':
      return <ConversationalIntake />;
    case 'initializing':
      return <InitializingView />;
    case 'workspace':
      return <ProjectWorkspace />;
    default:
      return <ProjectListView />;
  }
}

export default function ProjectCreationPage() {
  return (
    <ProjectCreationProvider>
      <ProjectCreationContent />
    </ProjectCreationProvider>
  );
}
