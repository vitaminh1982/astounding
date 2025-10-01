/**
 * Shared types for Project Chat Interface components
 */

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'idle' | 'thinking' | 'offline';
  avatar: string;
  description: string;
  capabilities: string[];
  lastActivity: string;
  responseTime: string;
  successRate: number;
  isConfigurable: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  agentId?: string;
  timestamp: Date;
  mentions?: string[];
  attachments?: Attachment[];
  visibility: 'project' | 'team' | 'private';
  canConvertToTask?: boolean;
  canConvertToDocument?: boolean;
}

export interface Task {
  id: string;
  name: string;
  description: string;
  assignedAgent: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
  priority: 'low' | 'medium' | 'high';
  estimatedDuration?: string;
}

export interface ChatSession {
  id: string;
  agentName: string;
  timestamp: Date;
  summary: string;
  messageCount: number;
  duration: string;
  isAutonomous: boolean;
  status: 'active' | 'completed' | 'interrupted';
  messages: Message[];
}

export interface TaskFilter {
  agent: string;
  status: string;
  search: string;
}

export interface HistoryFilter {
  agent: string;
  search: string;
  groupBy: 'agent' | 'date';
}

export type TabType = 'chat' | 'documents' | 'tasks' | 'history';