// types/workflow.ts

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'draft' | 'paused' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  agents: any[]; // Define proper agent type if needed
  triggers: any[];
  integrations: any[];
  rules: any[];
  errorHandlers: any[];
  design?: {
    nodes: Node[];
    edges: Edge[];
  };
}

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  condition: string;
  action: string;
  isActive: boolean;
}


export interface ErrorHandler {
  id: string;
  name: string;
  description: string;
  type: 'retry' | 'fallback' | 'notification' | 'custom';
  config: {
    maxRetries?: number;
    retryDelay?: number;
    fallbackAction?: string;
    notificationChannels?: string[];
    customHandler?: string;
  };
  isActive: boolean;
}

// types/workflow.ts
export interface Integration {
  id: string;
  name: string;
  type: 'api' | 'database' | 'messaging' | 'custom';
  description: string;
  config: {
    endpoint?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    authentication?: {
      type: 'basic' | 'bearer' | 'oauth2';
      credentials: Record<string, string>;
    };
    parameters?: Record<string, string>;
  };
  isActive: boolean;
}

// types/workflow.ts
export interface Trigger {
  id: string;
  name: string;
  type: 'schedule' | 'event' | 'webhook' | 'manual';
  description: string;
  config: {
    schedule?: string;
    eventType?: string;
    webhookUrl?: string;
    conditions?: Record<string, any>;
  };
  isActive: boolean;
}

export enum NodeType {
  TRIGGER = 'trigger',
  AI_AGENT = 'ai_agent',
  ACTION = 'action',
  TOOL = 'tool'
}

export interface Port {
  id: string;
  type: 'input' | 'output';
  label: string;
  dataType: string;
}

export interface NodeData {
  label: string;
  type: NodeType;
  configuration: Record<string, any>;
  inputs: Port[];
  outputs: Port[];
}

export interface WorkflowNode {
  id: string;
  type: NodeType;
  position: {
    x: number;
    y: number;
  };
  data: NodeData;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
}