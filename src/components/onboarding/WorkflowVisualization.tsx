import React, { useState, useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  NodeTypes,
  EdgeTypes,
  Connection,
  Edge as EdgeType,
  addEdge,
  Position,
  Handle,
  useNodesState,
  useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';

// Custom node component
const CustomNode: React.FC<{
  data: { label: string; icon: React.ReactNode; description?: string };
  id: string;
}> = ({ data, id }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900 p-3 border-2 border-indigo-200 dark:border-teal-600 transition-colors">
      <Handle 
        type="target" 
        position={Position.Top} 
        id={`${id}-target`} 
        style={{ background: 'var(--handle-color, #4F46E5)' }}
        className="dark:[--handle-color:#14B8A6]"
      />
      <div className="flex items-center gap-2">
        <div className="p-2 bg-indigo-100 dark:bg-teal-900 rounded-lg transition-colors">
          {data.icon}
        </div>
        <div>
          <div className="font-medium text-sm text-gray-900 dark:text-gray-100">{data.label}</div>
          {data.description && (
            <div className="text-xs text-gray-500 dark:text-gray-400">{data.description}</div>
          )}
        </div>
      </div>
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id={`${id}-source`} 
        style={{ background: 'var(--handle-color, #4F46E5)' }}
        className="dark:[--handle-color:#14B8A6]"
      />
    </div>
  );
};

// Custom edge component
const CustomEdge: React.FC<any> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) => {
  // Calculate path
  const getBezierPath = () => {
    const midX = (sourceX + targetX) / 2;
    const midY = (sourceY + targetY) / 2;
    
    return `M ${sourceX},${sourceY} C ${midX},${sourceY} ${midX},${targetY} ${targetX},${targetY}`;
  };

  return (
    <>
      <path
        id={id}
        style={{ 
          ...style, 
          strokeWidth: 2,
          stroke: 'var(--edge-color, #4F46E5)',
        }}
        className="react-flow__edge-path dark:[--edge-color:#14B8A6]"
        d={getBezierPath()}
        markerEnd={markerEnd}
      />
    </>
  );
};

// Define node types
const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

// Define edge types
const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
};

// Initial nodes
const initialNodes: Node[] = [
  {
    id: 'trigger',
    type: 'custom',
    position: { x: 250, y: 50 },
    data: { 
      label: 'Email Trigger', 
      icon: <svg className="w-4 h-4 text-indigo-600 dark:text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>,
      description: 'Starts on new email' 
    },
  },
  {
    id: 'agent',
    type: 'custom',
    position: { x: 250, y: 150 },
    data: { 
      label: 'AI Agent', 
      icon: <svg className="w-4 h-4 text-indigo-600 dark:text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>,
      description: 'Processes request' 
    },
  },
  {
    id: 'decision',
    type: 'custom',
    position: { x: 250, y: 250 },
    data: { 
      label: 'Decision', 
      icon: <svg className="w-4 h-4 text-indigo-600 dark:text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>,
      description: 'Routes based on content' 
    },
  },
  {
    id: 'action',
    type: 'custom',
    position: { x: 250, y: 350 },
    data: { 
      label: 'Action', 
      icon: <svg className="w-4 h-4 text-indigo-600 dark:text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>,
      description: 'Executes task' 
    },
  },
];

// Initial edges
const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: 'trigger',
    target: 'agent',
    type: 'custom',
    animated: true,
  },
  {
    id: 'e2-3',
    source: 'agent',
    target: 'decision',
    type: 'custom',
    animated: true,
  },
  {
    id: 'e3-4',
    source: 'decision',
    target: 'action',
    type: 'custom',
    animated: true,
  },
];

interface WorkflowVisualizationProps {
  className?: string;
  height?: number | string;
}

/**
 * WorkflowVisualization component
 * 
 * Displays an interactive workflow diagram using ReactFlow
 * 
 * @param {string} className - Optional CSS class for the container
 * @param {number|string} height - Height of the visualization container
 */
const WorkflowVisualization: React.FC<WorkflowVisualizationProps> = ({ 
  className = '', 
  height = 300 
}) => {
  // Initialize nodes and edges with React Flow hooks
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Handle new connections between nodes
  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge({ ...params, type: 'custom', animated: true }, eds)),
    [setEdges]
  );

  // Handle errors in node rendering
  const [nodeError, setNodeError] = useState<string | null>(null);

  // Error boundary for node rendering
  const handleNodeError = (error: Error) => {
    console.error('Error rendering node:', error);
    setNodeError('Failed to render workflow nodes. Please refresh the page.');
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors ${className}`} style={{ height }}>
      {nodeError ? (
        <div className="h-full flex items-center justify-center text-red-500 dark:text-red-400 p-4 text-center">
          <div>
            <svg className="w-10 h-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p>{nodeError}</p>
          </div>
        </div>
      ) : (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          attributionPosition="bottom-right"
          onError={handleNodeError}
        >
          <Controls />
          <MiniMap 
            nodeStrokeWidth={3}
            zoomable
            pannable
            nodeBorderRadius={2}
            nodeColor={(node) => {
              switch (node.id) {
                case 'trigger':
                  return '#14B8A6'; // teal-500 for consistency in both modes
                case 'agent':
                  return '#06B6D4'; // cyan-500
                case 'decision':
                  return '#F59E0B'; // amber-500
                case 'action':
                  return '#10B981'; // emerald-500
                default:
                  return '#6B7280'; // gray-500
              }
            }}
            style={{
              backgroundColor: 'var(--minimap-bg, rgba(255, 255, 255, 0.8))',
            }}
            className="dark:[--minimap-bg:rgba(31,41,55,0.8)]"
          />
          <Background 
            color="var(--background-pattern, #f1f5f9)" 
            gap={16}
            className="dark:[--background-pattern:#374151]"
          />
        </ReactFlow>
      )}
    </div>
  );
};

export default WorkflowVisualization;
