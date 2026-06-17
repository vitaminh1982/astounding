import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import {
  CreatedProject,
  IntakeChatMessage,
  IntakeData,
  ProjectTask,
  WorkspaceTab,
} from '../types/project-creation';

type ProjectCreationView = 'list' | 'intake' | 'initializing' | 'workspace';

interface ProjectCreationState {
  view: ProjectCreationView;
  intakeMessages: IntakeChatMessage[];
  intakeData: Partial<IntakeData>;
  intakeStep: number;
  isAssistantTyping: boolean;
  project: CreatedProject | null;
  activeTab: WorkspaceTab;
  projects: CreatedProject[];
}

type Action =
  | { type: 'SET_VIEW'; payload: ProjectCreationView }
  | { type: 'ADD_INTAKE_MESSAGE'; payload: IntakeChatMessage }
  | { type: 'SET_INTAKE_DATA'; payload: { key: string; value: string } }
  | { type: 'INCREMENT_INTAKE_STEP' }
  | { type: 'SET_ASSISTANT_TYPING'; payload: boolean }
  | { type: 'SET_PROJECT'; payload: CreatedProject }
  | { type: 'SET_ACTIVE_TAB'; payload: WorkspaceTab }
  | { type: 'UPDATE_TASK'; payload: ProjectTask }
  | { type: 'MOVE_TASK'; payload: { taskId: string; newStatus: ProjectTask['status'] } }
  | { type: 'ADD_TASK'; payload: ProjectTask }
  | { type: 'COMPLETE_DELIVERABLE'; payload: { phaseId: string; deliverableId: string } }
  | { type: 'ADVANCE_PHASE' }
  | { type: 'UPDATE_AGENT_STATUS'; payload: { agentId: string; status: string; progress: number; task: string } }
  | { type: 'ADD_PROJECT'; payload: CreatedProject }
  | { type: 'SELECT_PROJECT'; payload: string }
  | { type: 'RESET_INTAKE' };

const initialState: ProjectCreationState = {
  view: 'list',
  intakeMessages: [],
  intakeData: {},
  intakeStep: 0,
  isAssistantTyping: false,
  project: null,
  activeTab: 'dashboard',
  projects: [],
};

function reducer(state: ProjectCreationState, action: Action): ProjectCreationState {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, view: action.payload };

    case 'ADD_INTAKE_MESSAGE':
      return { ...state, intakeMessages: [...state.intakeMessages, action.payload] };

    case 'SET_INTAKE_DATA':
      return { ...state, intakeData: { ...state.intakeData, [action.payload.key]: action.payload.value } };

    case 'INCREMENT_INTAKE_STEP':
      return { ...state, intakeStep: state.intakeStep + 1 };

    case 'SET_ASSISTANT_TYPING':
      return { ...state, isAssistantTyping: action.payload };

    case 'SET_PROJECT':
      return { ...state, project: action.payload };

    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };

    case 'UPDATE_TASK':
      if (!state.project) return state;
      return {
        ...state,
        project: {
          ...state.project,
          tasks: state.project.tasks.map((t) => (t.id === action.payload.id ? action.payload : t)),
        },
      };

    case 'MOVE_TASK':
      if (!state.project) return state;
      return {
        ...state,
        project: {
          ...state.project,
          tasks: state.project.tasks.map((t) =>
            t.id === action.payload.taskId ? { ...t, status: action.payload.newStatus } : t
          ),
        },
      };

    case 'ADD_TASK':
      if (!state.project) return state;
      return {
        ...state,
        project: {
          ...state.project,
          tasks: [...state.project.tasks, action.payload],
        },
      };

    case 'COMPLETE_DELIVERABLE':
      if (!state.project) return state;
      return {
        ...state,
        project: {
          ...state.project,
          phases: state.project.phases.map((p) =>
            p.id === action.payload.phaseId
              ? {
                  ...p,
                  deliverables: p.deliverables.map((d) =>
                    d.id === action.payload.deliverableId ? { ...d, completed: true } : d
                  ),
                }
              : p
          ),
        },
      };

    case 'ADVANCE_PHASE':
      if (!state.project) return state;
      const nextIndex = state.project.currentPhaseIndex + 1;
      if (nextIndex >= state.project.phases.length) return state;
      return {
        ...state,
        project: {
          ...state.project,
          currentPhaseIndex: nextIndex,
          overallProgress: Math.min(100, ((nextIndex + 1) / state.project.phases.length) * 100),
          phases: state.project.phases.map((p, i) => {
            if (i === state.project!.currentPhaseIndex) return { ...p, status: 'completed' as const };
            if (i === nextIndex) return { ...p, status: 'active' as const };
            return p;
          }),
          documents: state.project.documents.map((d) => {
            const phase = state.project!.phases[nextIndex];
            if (d.phaseId === phase?.id) return { ...d, status: 'unlocked' as const };
            return d;
          }),
        },
      };

    case 'UPDATE_AGENT_STATUS':
      if (!state.project) return state;
      return {
        ...state,
        project: {
          ...state.project,
          agents: state.project.agents.map((a) =>
            a.id === action.payload.agentId
              ? { ...a, status: action.payload.status as any, progress: action.payload.progress, currentTask: action.payload.task }
              : a
          ),
        },
      };

    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] };

    case 'SELECT_PROJECT': {
      const found = state.projects.find((p) => p.id === action.payload);
      if (!found) return state;
      return { ...state, project: found, view: 'workspace' };
    }

    case 'RESET_INTAKE':
      return {
        ...state,
        view: 'intake',
        intakeMessages: [],
        intakeData: {},
        intakeStep: 0,
        isAssistantTyping: false,
        project: null,
      };

    default:
      return state;
  }
}

interface ProjectCreationContextType {
  state: ProjectCreationState;
  dispatch: React.Dispatch<Action>;
}

const ProjectCreationContext = createContext<ProjectCreationContextType | null>(null);

export function ProjectCreationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <ProjectCreationContext.Provider value={{ state, dispatch }}>
      {children}
    </ProjectCreationContext.Provider>
  );
}

export function useProjectCreation() {
  const ctx = useContext(ProjectCreationContext);
  if (!ctx) throw new Error('useProjectCreation must be used within ProjectCreationProvider');
  return ctx;
}
