import { useState, useCallback } from 'react';
import {
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  Connection,
  applyNodeChanges,
  applyEdgeChanges,
  NodeMouseHandler,
  EdgeMouseHandler,
  XYPosition,
} from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import { Workflow } from '../../../types/workflow';
import { NodeData } from '../types/workflowTypes';
import { nodeTypes, initialNodes, initialEdges } from '../constants/workflowConstants.tsx';

/**
 * Custom hook for managing workflow state and interactions
 * Handles nodes, edges, selections, and all workflow operations
 */
export const useWorkflowState = (
  workflow: Workflow,
  onWorkflowUpdate?: (workflow: Workflow) => void
) => {
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
  const [isComponentsPanelMinimized, setIsComponentsPanelMinimized] = useState(true);

  // Workflow change handler
  const handleWorkflowChange = useCallback(
    (changes: Partial<{ nodes: Node[]; edges: Edge[] }>) => {
      if (onWorkflowUpdate) {
        onWorkflowUpdate({
          ...workflow,
          design: {
            nodes: changes.nodes || nodes,
            edges: changes.edges || edges,
          },
        });
      }
    },
    [workflow, nodes, edges, onWorkflowUpdate]
  );

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
  const onNodeClick: NodeMouseHandler = useCallback(
    (event, node) => {
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
    },
    [nodes, edges, handleWorkflowChange]
  );

  // Edge click handler
  const onEdgeClick: EdgeMouseHandler = useCallback(
    (event, edge) => {
      if ((event.target as HTMLElement).dataset.edgeId) {
        const updatedEdges = edges.filter((e) => e.id !== edge.id);
        setEdges(updatedEdges);
        handleWorkflowChange({ edges: updatedEdges });
      }
    },
    [edges, handleWorkflowChange]
  );

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

  // Update node handler
  const handleUpdateNode = useCallback(
    (nodeId: string, updates: Partial<NodeData>) => {
      const updatedNodes = nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, ...updates } } : n
      );
      setNodes(updatedNodes);

      // Update selected node if it's the one being edited
      if (selectedNode && selectedNode.id === nodeId) {
        setSelectedNode({ ...selectedNode, data: { ...selectedNode.data, ...updates } });
      }

      handleWorkflowChange({ nodes: updatedNodes });
    },
    [nodes, selectedNode, handleWorkflowChange]
  );

  // Handle save workflow
  const handleSave = useCallback(() => {
    handleWorkflowChange({ nodes, edges });
    console.log('Workflow saved!');
  }, [nodes, edges, handleWorkflowChange]);

  // Handle load workflow
  const handleLoad = useCallback(() => {
    console.log('Load workflow');
  }, []);

  // Toggle components panel
  const toggleComponentsPanel = useCallback(() => {
    setIsComponentsPanelMinimized((prev) => !prev);
  }, []);

  // Close node settings
  const closeNodeSettings = useCallback(() => {
    setSelectedNode(null);
  }, []);

  return {
    nodes,
    edges,
    selectedNode,
    isComponentsPanelMinimized,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeClick,
    onEdgeClick,
    onDragOver,
    onDrop,
    handleUpdateNode,
    handleSave,
    handleLoad,
    toggleComponentsPanel,
    closeNodeSettings,
  };
};
