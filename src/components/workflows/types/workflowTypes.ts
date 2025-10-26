import { Node, Edge, Position } from 'reactflow';
import { Workflow } from '../../../types/workflow';

/**
 * Handle configuration for node connections
 */
export interface HandleConfig {
  type: 'source' | 'target';
  position: Position;
  id: string;
}

/**
 * Data structure for workflow nodes
 */
export interface NodeData {
  label: string;
  icon: React.ReactNode;
  handles: HandleConfig[];
  type?: string;
  description?: string;
  config?: Record<string, any>;
  dbId?: string;
}

/**
 * Props for WorkflowDesigner main component
 */
export interface WorkflowDesignerProps {
  workflow: Workflow;
  onWorkflowUpdate?: (workflow: Workflow) => void;
}

/**
 * Props for WorkflowNode component
 */
export interface WorkflowNodeProps {
  data: NodeData;
  id: string;
}

/**
 * Props for WorkflowComponentsPanel component
 */
export interface WorkflowComponentsPanelProps {
  isMinimized: boolean;
  onToggleMinimize: () => void;
}

/**
 * Props for WorkflowNodeSettings component
 */
export interface WorkflowNodeSettingsProps {
  selectedNode: Node | null;
  onClose: () => void;
  onUpdateNode: (nodeId: string, updates: Partial<NodeData>) => void;
}

/**
 * Props for WorkflowToolbar component
 */
export interface WorkflowToolbarProps {
  onSave: () => void;
  onLoad: () => void;
}
