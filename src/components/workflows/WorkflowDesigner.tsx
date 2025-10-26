// components/workflows/WorkflowDesigner.tsx
import React, { useCallback, useState } from 'react';
import ReactFlow, { 
  Background, 
  Controls,
  MiniMap,
  NodeTypes,
  EdgeTypes,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  Connection,
  Position,
  Handle,
  getBezierPath,
  EdgeProps,
  applyNodeChanges,
  applyEdgeChanges,
  Panel,
  NodeMouseHandler,
  EdgeMouseHandler,
  XYPosition
} from 'reactflow';
import 'reactflow/dist/style.css';
import { 
  Mail, 
  Bot, 
  Slack, 
  PenTool as Tool, 
  Database, 
  FileOutput, 
  Plus,
  X,
  Trash2,
  Save,
  FolderOpen,
  MessageSquare,
  Calendar,
  AlertCircle,
  Settings,
  Code,
  GripHorizontal
} from 'lucide-react';
import { Workflow } from '../../types/workflow';
import { v4 as uuidv4 } from 'uuid';

// Types
interface HandleConfig {
  type: 'source' | 'target';
  position: Position;
  id: string;
}

interface NodeData {
  label: string;
  icon: React.ReactNode;
  handles: HandleConfig[];
  type?: string;
  description?: string;
  config?: Record<string, any>;
  dbId?: string;
}

interface WorkflowDesignerProps {
  workflow: Workflow;
  onWorkflowUpdate?: (workflow: Workflow) => void;
}

// Enhanced Custom Edge Component with delete button
const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <path
        id={id}
        style={{ 
          ...style, 
          strokeWidth: 2,
        }}
        className="react-flow__edge-path stroke-indigo-500 dark:stroke-teal-400"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <g
        transform={`translate(${labelX - 10} ${labelY - 10})`}
        className="react-flow__edge-button"
        style={{ cursor: 'pointer' }}
      >
        <circle 
          r="12" 
          className="fill-white dark:fill-gray-700 transition-colors"
          style={{ filter: 'drop-shadow(0 2px 4px rgb(0 0 0 / 0.1))' }}
        />
        <Trash2 
          className="w-4 h-4 text-red-500 dark:text-red-400" 
          style={{ transform: 'translate(-8px, -8px)' }}
          data-edge-id={id}
        />
      </g>
    </>
  );
};

// Enhanced Custom Node Component with delete button and dark mode
const CustomNode = ({ data, id }: { data: NodeData; id: string }) => {
  return (
    <div className="relative px-4 py-2 shadow-lg rounded-lg bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 group transition-colors">
      {/* Delete Button */}
      <div className="absolute top-0 right-0 mt-1 mr-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button 
          className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          data-node-id={id}
          aria-label="Delete node"
        >
          <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />
        </button>
      </div>
      
      {/* Drag Handle */}
      <div className="absolute top-0 left-0 mt-1 ml-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
        <GripHorizontal className="w-4 h-4 text-gray-400 dark:text-gray-500" />
      </div>
      
      {/* Content */}
      <div className="flex items-center mt-4">
        {/* React Flow Handles */}
        {data.handles.map((handle) => (
          <Handle
            key={handle.id}
            type={handle.type}
            position={handle.position}
            id={handle.id}
            className="!bg-indigo-500 dark:!bg-teal-400"
            style={{ 
              width: 8,
              height: 8,
              [handle.position === Position.Top ? 'top' : 
               handle.position === Position.Bottom ? 'bottom' : 
               handle.position === Position.Left ? 'left' : 'right']: -4,
            }}
          />
        ))}
        
        {/* Node Content */}
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 transition-colors">
            {data.icon}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-sm text-gray-900 dark:text-gray-100 transition-colors">
              {data.label}
            </span>
            {data.description && (
              <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
                {data.description}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Node Types with dark mode icons
export const nodeTypes = {
  trigger: {
    icon: <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />,
    label: 'Email Trigger',
    description: 'Triggers on new email',
    handles: [
      { type: 'source' as const, position: Position.Bottom, id: 'email' }
    ],
  },
  agent: {
    icon: <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />,
    label: 'AI Agent',
    description: 'Process with AI',
    handles: [
      { type: 'target' as const, position: Position.Top, id: 'in' },
      { type: 'source' as const, position: Position.Bottom, id: 'out' },
      { type: 'source' as const, position: Position.Right, id: 'tools' }
    ],
  },
  action: {
    icon: <Tool className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />,
    label: 'Action',
    description: 'Perform an action',
    handles: [
      { type: 'target' as const, position: Position.Top, id: 'in' },
      { type: 'source' as const, position: Position.Bottom, id: 'out' },
    ],
  },
  notification: {
    icon: <Slack className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />,
    label: 'Notification',
    description: 'Send notification',
    handles: [
      { type: 'target' as const, position: Position.Top, id: 'message' }
    ],
  },
  database: {
    icon: <Database className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />,
    label: 'Vector Database',
    description: 'Search vector database',
    handles: [
      { type: 'target' as const, position: Position.Top, id: 'in' },
      { type: 'source' as const, position: Position.Bottom, id: 'out' },
    ],
  },
  output: {
    icon: <FileOutput className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />,
    label: 'Email Output',
    description: 'Process output',
    handles: [
      { type: 'target' as const, position: Position.Top, id: 'in' },
    ],
  },
};

// Initial nodes with top-to-bottom layout
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

// Initial edges with top-to-bottom connections
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

const WorkflowDesigner: React.FC<WorkflowDesignerProps> = ({
  workflow,
  onWorkflowUpdate,
}) => {
  // Node state
  const [nodes, setNodes] = useState<Node[]>(() => {
    if (workflow?.design?.nodes?.length > 0) {
      return workflow.design.nodes;
    }
    return initialNodes;
  });
  
  // Edge state
  const [edges, setEdges] = useState<Edge[]>(() => {
    if (workflow?.design?.edges?.length > 0) {
      return workflow.design.edges;
    }
    return initialEdges;
  });
  
  // Selected node state
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  
  // Panel state
  const [isComponentsPanelMinimized, setIsComponentsPanelMinimized] = useState(false);

  // Workflow change handler
  const handleWorkflowChange = useCallback((changes: Partial<{ nodes: Node[]; edges: Edge[] }>) => {
    if (onWorkflowUpdate) {
      onWorkflowUpdate({
        ...workflow,
        design: {
          nodes: changes.nodes || nodes,
          edges: changes.edges || edges,
        },
      });
    }
  }, [workflow, nodes, edges, onWorkflowUpdate]);

  // Node changes handler
  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      const updatedNodes = applyNodeChanges(changes, nodes);
      setNodes(updatedNodes);
      handleWorkflowChange({ nodes: updatedNodes });
    },
    [nodes, handleWorkflowChange]
  );

  // Edge changes handler
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      const updatedEdges = applyEdgeChanges(changes, edges);
      setEdges(updatedEdges);
      handleWorkflowChange({ edges: updatedEdges });
    },
    [edges, handleWorkflowChange]
  );

  // Connection handler
  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      const newEdge: Edge = {
        ...connection,
        id: `edge-${connection.source}-${connection.target}`,
        type: 'custom',
        animated: true,
      };
      
      const updatedEdges = [...edges, newEdge];
      setEdges(updatedEdges);
      handleWorkflowChange({ edges: updatedEdges });
    },
    [edges, handleWorkflowChange]
  );

  // Node click handler
  const onNodeClick: NodeMouseHandler = useCallback((event, node) => {
    if ((event.target as HTMLElement).dataset.nodeId) {
      // Delete node when clicking the delete button
      const updatedNodes = nodes.filter((n) => n.id !== node.id);
      const updatedEdges = edges.filter(
        (e) => e.source !== node.id && e.target !== node.id
      );
      setNodes(updatedNodes);
      setEdges(updatedEdges);
      setSelectedNode(null);
      handleWorkflowChange({ nodes: updatedNodes, edges: updatedEdges });
    } else {
      // Select node for editing
      setSelectedNode(node);
    }
  }, [nodes, edges, handleWorkflowChange]);

  // Edge click handler
  const onEdgeClick: EdgeMouseHandler = useCallback((event, edge) => {
    if ((event.target as HTMLElement).dataset.edgeId) {
      const updatedEdges = edges.filter((e) => e.id !== edge.id);
      setEdges(updatedEdges);
      handleWorkflowChange({ edges: updatedEdges });
    }
  }, [edges, handleWorkflowChange]);

  // Custom node types
  const customNodeTypes: NodeTypes = {
    custom: CustomNode,
  };

  // Custom edge types
  const customEdgeTypes: EdgeTypes = {
    custom: CustomEdge,
  };

  // Drag over handler
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Drop handler
  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      // Get position of new node
      const position: XYPosition = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      // Create new node
      const newNode: Node = {
        id: `${type}-${uuidv4().substring(0, 8)}`,
        type: 'custom',
        position,
        data: {
          ...nodeTypes[type as keyof typeof nodeTypes],
          type,
          dbId: uuidv4(),
        },
      };

      // Add node to state
      const updatedNodes = [...nodes, newNode];
      setNodes(updatedNodes);
      handleWorkflowChange({ nodes: updatedNodes });
    },
    [nodes, handleWorkflowChange]
  );

  // Handle save workflow
  const handleSave = useCallback(() => {
    handleWorkflowChange({ nodes, edges });
    // Add notification/toast here
    console.log('Workflow saved!');
  }, [nodes, edges, handleWorkflowChange]);

  // Handle load workflow
  const handleLoad = useCallback(() => {
    // Implement load logic here
    console.log('Load workflow');
  }, []);

  return (
    <div className="h-full bg-white dark:bg-gray-900 transition-colors">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        nodeTypes={customNodeTypes}
        edgeTypes={customEdgeTypes}
        onDragOver={onDragOver}
        onDrop={onDrop}
        fitView
        className="bg-gray-50 dark:bg-gray-900"
      >
        <Background 
          className="bg-gray-50 dark:bg-gray-900"
          gap={16}
          color="#9ca3af"
        />
        <Controls className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg [&_button]:text-gray-700 dark:[&_button]:text-gray-200 [&_button:hover]:bg-gray-100 dark:[&_button:hover]:bg-gray-700" />
        <MiniMap 
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
          maskColor="rgb(0, 0, 0, 0.1)"
          nodeColor={(node) => {
            const isDark = document.documentElement.classList.contains('dark');
            return isDark ? '#1f2937' : '#ffffff';
          }}
          zoomable 
          pannable 
        />

        {/* Top Right Actions */}
        <Panel position="top-right" className="flex gap-2">
          <button 
            onClick={handleSave}
            className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
            aria-label="Save workflow"
          >
            <Save className="w-5 h-5 text-gray-700 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-teal-400 transition-colors" />
          </button>
          <button 
            onClick={handleLoad}
            className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
            aria-label="Load workflow"
          >
            <FolderOpen className="w-5 h-5 text-gray-700 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-teal-400 transition-colors" />
          </button>
        </Panel>

        {/* Components Panel - Top Left */}
        <Panel position="top-left" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden transition-colors">
          <div className="w-64">
            {/* Panel Header */}
            <div 
              className="p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-gray-800 dark:to-gray-750 flex items-center justify-between cursor-pointer border-b border-indigo-200 dark:border-gray-700 transition-colors"
              onClick={() => setIsComponentsPanelMinimized(!isComponentsPanelMinimized)}
              role="button"
              tabIndex={0}
              aria-expanded={!isComponentsPanelMinimized}
            >
              <h3 className="text-base font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <Tool className="w-4 h-4 text-indigo-600 dark:text-teal-400" strokeWidth={2.5} />
                Components
              </h3>
              <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors rounded-lg p-1 hover:bg-white/50 dark:hover:bg-gray-700">
                {isComponentsPanelMinimized ? (
                  <Plus className="w-5 h-5" strokeWidth={2.5} />
                ) : (
                  <X className="w-5 h-5" strokeWidth={2.5} />
                )}
              </button>
            </div>
            
            {/* Components List */}
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
              isComponentsPanelMinimized 
                ? 'max-h-0 opacity-0' 
                : 'max-h-[600px] opacity-100'
            }`}>
              <div className="p-4 space-y-2 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                {Object.entries(nodeTypes).map(([key, config]) => (
                  <div
                    key={key}
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.setData('application/reactflow', key);
                      event.dataTransfer.effectAllowed = 'move';
                    }}
                    className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-move hover:bg-gray-50 dark:hover:bg-gray-750 hover:border-indigo-300 dark:hover:border-teal-600 transition-all duration-200 active:scale-95 group bg-white dark:bg-gray-800"
                    role="button"
                    tabIndex={0}
                  >
                    <div className="p-1.5 rounded-md bg-indigo-50 dark:bg-indigo-900/30 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
                      {config.icon}
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors">
                        {config.label}
                      </span>
                      {config.description && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate transition-colors">
                          {config.description}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Panel>

        {/* Node Settings Panel - Bottom Right */}
        {selectedNode && (
          <Panel position="bottom-right" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 rounded-xl shadow-xl w-80 transition-colors">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100 transition-colors">
                  <Settings className="w-5 h-5 text-indigo-600 dark:text-teal-400" strokeWidth={2.5} />
                  Node Settings
                </h3>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Close settings"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Form Fields */}
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                    Name
                  </label>
                  <input
                    type="text"
                    value={selectedNode.data.label}
                    onChange={(e) => {
                      const updatedNodes = nodes.map((n) =>
                        n.id === selectedNode.id
                          ? { ...n, data: { ...n.data, label: e.target.value } }
                          : n
                      );
                      setNodes(updatedNodes);
                      setSelectedNode({ ...selectedNode, data: { ...selectedNode.data, label: e.target.value } });
                      handleWorkflowChange({ nodes: updatedNodes });
                    }}
                    className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="Enter node name"
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                    Description
                  </label>
                  <textarea
                    value={selectedNode.data.description || ''}
                    onChange={(e) => {
                      const updatedNodes = nodes.map((n) =>
                        n.id === selectedNode.id
                          ? { ...n, data: { ...n.data, description: e.target.value } }
                          : n
                      );
                      setNodes(updatedNodes);
                      setSelectedNode({ ...selectedNode, data: { ...selectedNode.data, description: e.target.value } });
                      handleWorkflowChange({ nodes: updatedNodes });
                    }}
                    className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                    rows={3}
                    placeholder="Enter description"
                  />
                </div>

                {/* Node Type Badge */}
                <div className="flex items-center gap-2 pt-2">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Type:</span>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 dark:bg-teal-900/30 text-indigo-700 dark:text-teal-300 transition-colors">
                    {selectedNode.data.type}
                  </span>
                </div>
              </div>
            </div>
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
};

export default WorkflowDesigner;
