import React from 'react';
import { EdgeProps, getBezierPath } from 'reactflow';
import { Trash2 } from 'lucide-react';

/**
 * Custom workflow edge component with delete button
 * Displays curved connection between nodes with interactive delete option
 */
const WorkflowEdge: React.FC<EdgeProps> = ({
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

export default WorkflowEdge;
