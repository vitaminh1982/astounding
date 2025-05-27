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
import { useWorkflowStore } from '/stores/workflowStore';
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
          stroke: '#2563eb',
        }}
        className="react-flow__edge-path"
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
          fill="#fff" 
          className="edge-button-circle"
          style={{ filter: 'drop-shadow(0 2px 2px rgb(0 0 0 / 0.1))' }}
        />
        <Trash2 
          className="w-4 h-4 text-red-500" 
          style={{ transform: 'translate(-8px, -8px)' }}
          data-edge-id={id}
        />
      </g>
    </>
  );
};

// Enhanced Custom Node Component with delete button
const CustomNode = ({ data, id }: { data: NodeData; id: string }) => {
  return (
    <div className="relative px-4 py-2 shadow-lg rounded-lg bg-white border-2 border-gray-200 group">
      <div className="absolute top-0 right-0 mt-1 mr-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          className="p-1 rounded-full hover:bg-red-100"
          data-node-id={id}
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </button>
      </div>
      <div className="absolute top-0 left-0 mt-1 ml-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
        <GripHorizontal className="w-4 h-4 text-gray-400" />
      </div>
      <div className="flex items-center mt-4">
        {data.handles.map((handle) => (
          <Handle
            key={handle.id}
            type={handle.type}
            position={handle.position}
            id={handle.id}
            style={{ 
              background: '#2563eb',
              width: 8,
              height: 8,
              [handle.position === Position.Top ? 'top' : 
               handle.position === Position.Bottom ? 'bottom' : 
               handle.position === Position.Left ? 'left' : 'right']: -4,
            }}
          />
        ))}
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-50">
            {data.icon}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-sm">{data.label}</span>
            {data.description && (
              <span className="text-xs text-gray-500">{data.description}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Node Types
export const nodeTypes = {
  trigger: {
    icon: <Mail className="w-4 h-4 text-indigo-600" />,
    label: 'Email Trigger',
    description: 'Triggers on new email',
    handles: [
      { type: 'source', position: Position.Bottom, id: 'email' }
    ],
  },
  agent: {
    icon: <Bot className="w-4 h-4 text-indigo-600" />,
    label: 'AI Agent',
    description: 'Process with AI',
    handles: [
      { type: 'target', position: Position.Top, id: 'in' },
      { type: 'source', position: Position.Bottom, id: 'out' },
      { type: 'source', position: Position.Right, id: 'tools' }
    ],
  },
  action: {
    icon: <Tool className="w-4 h-4 text-indigo-600" />,
    label: 'Action',
    description: 'Perform an action',
    handles: [
      { type: 'target', position: Position.Top, id: 'in' },
      { type: 'source', position: Position.Bottom, id: 'out' },
    ],
  },
  notification: {
    icon: <Slack className="w-4 h-4 text-indigo-600" />,
    label: 'Notification',
    description: 'Send notification',
    handles: [
      { type: 'target', position: Position.Top, id: 'message' }
    ],
  },
  database: {
    icon: <Database className="w-4 h-4 text-indigo-600" />,
    label: 'Vector Database',
    description: 'Search vector database',
    handles: [
      { type: 'target', position: Position.Top, id: 'in' },
      { type: 'source', position: Position.Bottom, id: 'out' },
    ],
  },
  output: {
    icon: <FileOutput className="w-4 h-4 text-indigo-600" />,
    label: 'Email Output',
    description: 'Process output',
    handles: [
      { type: 'target', position: Position.Top, id: 'in' },
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
    if (workflow?.nodes?.length > 0) {
      return workflow.nodes;
    }
    return initialNodes;
  });
  
  // Edge state
  const [edges, setEdges] = useState<Edge[]>(() => {
    if (workflow?.edges?.length > 0) {
      return workflow.edges;
    }
    return initialEdges;
  });
  
  // Selected node state
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  
  // Panel state
  const [isComponentsPanelMinimized, setIsComponentsPanelMinimized] = useState(true);

  // Node changes handler
  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      const updatedNodes = applyNodeChanges(changes, nodes);
      setNodes(updatedNodes);
      handleWorkflowChange({ nodes: updatedNodes });
    },
    [nodes]
  );

  // Edge changes handler
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      const updatedEdges = applyEdgeChanges(changes, edges);
      setEdges(updatedEdges);
      handleWorkflowChange({ edges: updatedEdges });
    },
    [edges]
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
    [edges]
  );

  // Workflow change handler
  const handleWorkflowChange = (changes: Partial<Workflow>) => {
    if (onWorkflowUpdate) {
      onWorkflowUpdate({
        ...workflow,
        nodes: changes.nodes || nodes,
        edges: changes.edges || edges,
      });
    }
  };

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
  }, [nodes, edges]);

  // Edge click handler
  const onEdgeClick: EdgeMouseHandler = useCallback((event, edge) => {
    if ((event.target as HTMLElement).dataset.edgeId) {
      const updatedEdges = edges.filter((e) => e.id !== edge.id);
      setEdges(updatedEdges);
      handleWorkflowChange({ edges: updatedEdges });
    }
  }, [edges]);

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
          ...nodeTypes[type],
          type,
          dbId: uuidv4(),
        },
      };

      // Add node to state
      const updatedNodes = [...nodes, newNode];
      setNodes(updatedNodes);
      handleWorkflowChange({ nodes: updatedNodes });
    },
    [nodes]
  );

  return (
    <div className="h-full">
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
        direction="TB" // Top-to-Bottom direction
        fitView
      >
        <Background />
        <Controls />
        <MiniMap zoomable pannable />

        <Panel position="top-right" className="flex gap-2">
          <button className="p-2 bg-white rounded-md shadow-md hover:bg-gray-50">
            <Save className="w-4 h-4" />
          </button>
          <button className="p-2 bg-white rounded-md shadow-md hover:bg-gray-50">
            <FolderOpen className="w-4 h-4" />
          </button>
        </Panel>

        <Panel position="top-left" className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="w-64">
            <div className="p-3 bg-indigo-50 flex items-center justify-between cursor-pointer"
                 onClick={() => setIsComponentsPanelMinimized(!isComponentsPanelMinimized)}>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Tool className="w-4 h-4" />
                Components
              </h3>
              <button className="text-gray-500 hover:text-gray-700 transition-colors">
                {isComponentsPanelMinimized ? (
                  <Plus className="w-4 h-4" />
                ) : (
                  <X className="w-4 h-4" />
                )}
              </button>
            </div>
            
            {/* Components list with transition */}
            <div className={`transition-all duration-300 ease-in-out ${
              isComponentsPanelMinimized 
                ? 'max-h-0 opacity-0' 
                : 'max-h-[500px] opacity-100'
            }`}>
              <div className="p-4 space-y-2">
                {Object.entries(nodeTypes).map(([key, config]) => (
                  <div
                    key={key}
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.setData('application/reactflow', key);
                    }}
                    className="flex items-center gap-2 p-2 border rounded-md cursor-move hover:bg-gray-50 transition-colors"
                  >
                    {config.icon}
                    <span className="text-sm">{config.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Panel>

        {selectedNode && (
          <Panel position="bottom-right" className="bg-white p-4 rounded-lg shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Node Settings
                </h3>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Name</label>
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
                      handleWorkflowChange({ nodes: updatedNodes });
                    }}
                    className="border rounded-md px-2 py-1 text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <input
                    type="text"
                    value={selectedNode.data.description}
                    onChange={(e) => {
                      const updatedNodes = nodes.map((n) =>
                        n.id === selectedNode.id
                          ? { ...n, data: { ...n.data, description: e.target.value } }
                          : n
                      );
                      setNodes(updatedNodes);
                      handleWorkflowChange({ nodes: updatedNodes });
                    }}
                    className="border rounded-md px-2 py-1 text-sm"
                  />
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
