import { Node, Edge, Position } from 'reactflow';
import {
  Mail,
  Bot,
  Slack,
  PenTool as Tool,
  Database,
  FileOutput
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

/**
 * Node type configurations with icons, labels, and handle positions
 */
export const nodeTypes = {
  trigger: {
    icon: <Mail className="w-4 h-4 text-teal-600 dark:text-teal-400 transition-colors" />,
    label: 'Email Trigger',
    description: 'Triggers on new email',
    handles: [
      { type: 'source' as const, position: Position.Bottom, id: 'email' }
    ],
  },
  agent: {
    icon: <Bot className="w-4 h-4 text-teal-600 dark:text-teal-400 transition-colors" />,
    label: 'AI Agent',
    description: 'Process with AI',
    handles: [
      { type: 'target' as const, position: Position.Top, id: 'in' },
      { type: 'source' as const, position: Position.Bottom, id: 'out' },
      { type: 'source' as const, position: Position.Right, id: 'tools' }
    ],
  },
  action: {
    icon: <Tool className="w-4 h-4 text-teal-600 dark:text-teal-400 transition-colors" />,
    label: 'Action',
    description: 'Perform an action',
    handles: [
      { type: 'target' as const, position: Position.Top, id: 'in' },
      { type: 'source' as const, position: Position.Bottom, id: 'out' },
    ],
  },
  notification: {
    icon: <Slack className="w-4 h-4 text-teal-600 dark:text-teal-400 transition-colors" />,
    label: 'Notification',
    description: 'Send notification',
    handles: [
      { type: 'target' as const, position: Position.Top, id: 'message' }
    ],
  },
  database: {
    icon: <Database className="w-4 h-4 text-teal-600 dark:text-teal-400 transition-colors" />,
    label: 'Vector Database',
    description: 'Search vector database',
    handles: [
      { type: 'target' as const, position: Position.Top, id: 'in' },
      { type: 'source' as const, position: Position.Bottom, id: 'out' },
    ],
  },
  output: {
    icon: <FileOutput className="w-4 h-4 text-teal-600 dark:text-teal-400 transition-colors" />,
    label: 'Email Output',
    description: 'Process output',
    handles: [
      { type: 'target' as const, position: Position.Top, id: 'in' },
    ],
  },
};

/**
 * Initial nodes with top-to-bottom layout
 */
export const initialNodes: Node[] = [
  {
    id: 'gmail-trigger',
    type: 'custom',
    position: { x: 300, y: 50 },
    data: {
      ...nodeTypes.trigger,
      type: 'trigger',
      dbId: uuidv4(),
    },
  },
  {
    id: 'ai-agent',
    type: 'custom',
    position: { x: 300, y: 200 },
    data: {
      ...nodeTypes.agent,
      type: 'agent',
      dbId: uuidv4(),
    },
  },
  {
    id: 'create-task',
    type: 'custom',
    position: { x: 300, y: 350 },
    data: {
      ...nodeTypes.action,
      label: 'Create Task',
      type: 'action',
      dbId: uuidv4(),
    },
  },
  {
    id: 'notify-team',
    type: 'custom',
    position: { x: 300, y: 500 },
    data: {
      ...nodeTypes.notification,
      label: 'Notify Team',
      type: 'notification',
      dbId: uuidv4(),
    },
  },
  {
    id: 'tool-start',
    type: 'custom',
    position: { x: 550, y: 200 },
    data: {
      ...nodeTypes.action,
      label: 'Tool Start',
      type: 'action',
      dbId: uuidv4(),
    },
  },
  {
    id: 'vector-db-search',
    type: 'custom',
    position: { x: 550, y: 350 },
    data: {
      ...nodeTypes.database,
      type: 'database',
      dbId: uuidv4(),
    },
  },
  {
    id: 'tool-output',
    type: 'custom',
    position: { x: 550, y: 500 },
    data: {
      ...nodeTypes.output,
      type: 'output',
      dbId: uuidv4(),
    },
  },
];

/**
 * Initial edges with top-to-bottom connections
 */
export const initialEdges: Edge[] = [
  {
    id: 'gmail-to-ai',
    source: 'gmail-trigger',
    target: 'ai-agent',
    sourceHandle: 'email',
    targetHandle: 'in',
    animated: true,
    type: 'custom',
  },
  {
    id: 'ai-to-task',
    source: 'ai-agent',
    target: 'create-task',
    sourceHandle: 'out',
    targetHandle: 'in',
    animated: true,
    type: 'custom',
  },
  {
    id: 'task-to-notify',
    source: 'create-task',
    target: 'notify-team',
    sourceHandle: 'out',
    targetHandle: 'message',
    animated: true,
    type: 'custom',
  },
  {
    id: 'ai-to-tool',
    source: 'ai-agent',
    target: 'tool-start',
    sourceHandle: 'tools',
    targetHandle: 'in',
    animated: true,
    type: 'custom',
  },
  {
    id: 'tool-to-vector',
    source: 'tool-start',
    target: 'vector-db-search',
    sourceHandle: 'out',
    targetHandle: 'in',
    animated: true,
    type: 'custom',
  },
  {
    id: 'vector-to-output',
    source: 'vector-db-search',
    target: 'tool-output',
    sourceHandle: 'out',
    targetHandle: 'in',
    animated: true,
    type: 'custom',
  },
];
