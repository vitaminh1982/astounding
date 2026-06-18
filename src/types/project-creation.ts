export interface ProjectPhase {
  id: string;
  name: string;
  description: string;
  status: 'locked' | 'active' | 'completed';
  estimatedDuration: string;
  order: number;
  deliverables: PhaseDeliverable[];
}

export interface PhaseDeliverable {
  id: string;
  name: string;
  completed: boolean;
  assignedAgentId: string;
}

export interface ProjectAgent {
  id: string;
  name: string;
  role: string;
  icon: string;
  currentTask: string;
  status: 'idle' | 'working' | 'blocked' | 'done';
  progress: number;
  color: string;
}

export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  assignedAgentId: string;
  status: 'backlog' | 'in-progress' | 'in-review' | 'done';
  priority: 'low' | 'medium' | 'high';
  phaseTag: string;
  createdAt: Date;
}

export interface ProjectDocument {
  id: string;
  name: string;
  description: string;
  phaseId: string;
  generatedBy: string;
  status: 'locked' | 'unlocked' | 'completed';
  content: string;
  category: string;
  createdAt: Date;
}

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  isOnline: boolean;
  lastActivity: string;
  avatar?: string;
}

export interface IntakeChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export interface IntakeData {
  projectName: string;
  goal: string;
  targetAudience: string;
  deliverables: string;
  timeline: string;
  teamSize: string;
  budget: string;
  constraints: string;
}

export type ComplexityLevel = 'low' | 'medium' | 'high' | 'enterprise';

export type DeliveryTrack =
  | 'lean-sprint'
  | 'prince2-agile-hybrid'
  | 'waterfall-classic'
  | 'kanban-flow';

export interface CreatedProject {
  id: string;
  name: string;
  goal: string;
  complexity: ComplexityLevel;
  deliveryTrack: DeliveryTrack;
  deliveryTrackLabel: string;
  deliveryTrackRationale: string;
  phases: ProjectPhase[];
  agents: ProjectAgent[];
  tasks: ProjectTask[];
  documents: ProjectDocument[];
  collaborators: Collaborator[];
  currentPhaseIndex: number;
  overallProgress: number;
  createdAt: Date;
  daysElapsed: number;
}

export type WorkspaceTab = 'dashboard' | 'kanban' | 'documents' | 'chat' | 'team';
