import React from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  NodeTypes,
  EdgeTypes,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { WorkflowDesignerProps } from './types/workflowTypes';
import { useWorkflowState } from './hooks/useWorkflowState';
import WorkflowNode from './components/WorkflowNode';
import WorkflowEdge from './components/WorkflowEdge';
import WorkflowComponentsPanel from './components/WorkflowComponentsPanel';
import WorkflowNodeSettings from './components/WorkflowNodeSettings';
import WorkflowToolbar from './components/WorkflowToolbar';

/**
 * Main workflow designer component
 * Provides visual workflow editor with drag-and-drop nodes and connections
 *
 * @component
 * @example
 * ```
 * <WorkflowDesigner
 *   workflow={myWorkflow}
 *   onWorkflowUpdate={(updated) => handleUpdate(updated)}
 * />
 * ```
 */
const WorkflowDesigner: React.FC<WorkflowDesignerProps> = ({
  workflow,
  onWorkflowUpdate,
}) => {
  // Use custom hook for state management
  const {
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
  } = useWorkflowState(workflow, onWorkflowUpdate);

  // Custom node types
  const customNodeTypes: NodeTypes = {
    custom: WorkflowNode,
  };

  // Custom edge types
  const customEdgeTypes: EdgeTypes = {
    custom: WorkflowEdge,
  };

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
        className="bg-gray-50 dark:bg-gray-900 transition-colors"
      >
        <Background
          className="bg-gray-50 dark:bg-gray-900 transition-colors"
          gap={16}
          color="var(--grid-color)"
          style={{
            '--grid-color': 'rgb(156 163 175)', // gray-400
          } as React.CSSProperties & { '--grid-color': string }}
        />
        <Controls className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg dark:shadow-gray-900 transition-colors [&_button]:text-gray-700 dark:[&_button]:text-gray-200 [&_button:hover]:bg-gray-100 dark:[&_button:hover]:bg-gray-700 [&_button]:transition-colors" />
        <MiniMap
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg dark:shadow-gray-900 transition-colors"
          maskColor="rgb(0, 0, 0, 0.1)"
          nodeColor={(node) => {
            const isDark = document.documentElement.classList.contains('dark');
            return isDark ? '#1f2937' : '#ffffff'; // Dark: slate-800, Light: white
          }}
          zoomable
          pannable
        />

        {/* Top Right Toolbar */}
        <Panel position="top-right">
          <WorkflowToolbar onSave={handleSave} onLoad={handleLoad} />
        </Panel>

        {/* Components Panel - Top Left */}
        <Panel position="top-left">
          <WorkflowComponentsPanel
            isMinimized={isComponentsPanelMinimized}
            onToggleMinimize={toggleComponentsPanel}
          />
        </Panel>

        {/* Node Settings Panel - Bottom Right */}
        {selectedNode && (
          <Panel position="bottom-right">
            <WorkflowNodeSettings
              selectedNode={selectedNode}
              onClose={closeNodeSettings}
              onUpdateNode={handleUpdateNode}
            />
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
};

export default WorkflowDesigner;

// Re-export initial data for backward compatibility
export { initialNodes, initialEdges } from './constants/workflowConstants.tsx';
export { nodeTypes } from './constants/workflowConstants.tsx';
