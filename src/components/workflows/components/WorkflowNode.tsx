import React from 'react';
import { Position, Handle } from 'reactflow';
import { Trash2, GripHorizontal } from 'lucide-react';
import { WorkflowNodeProps } from '../types/workflowTypes';

/**
 * Custom workflow node component with delete button and dark mode support
 * Displays node with icon, label, description, and connection handles
 */
const WorkflowNode: React.FC<WorkflowNodeProps> = ({ data, id }) => {
  return (
    <div className="relative px-4 py-2 shadow-lg dark:shadow-gray-900 rounded-lg bg-white dark:bg-surface-container-high border-2 border-border dark:border-border group transition-colors">
      {/* Delete Button */}
      <div className="absolute top-0 right-0 mt-1 mr-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          data-node-id={id}
          aria-label="Delete node"
        >
          <Trash2 className="w-4 h-4 text-destructive dark:text-destructive transition-colors" />
        </button>
      </div>

      {/* Drag Handle */}
      <div className="absolute top-0 left-0 mt-1 ml-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
        <GripHorizontal className="w-4 h-4 text-outline dark:text-muted-foreground transition-colors" />
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
            className="!bg-primary dark:!bg-green-400"
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
          <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/30 transition-colors">
            {data.icon}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-sm text-foreground dark:text-foreground transition-colors">
              {data.label}
            </span>
            {data.description && (
              <span className="text-xs text-muted-foreground dark:text-muted-foreground transition-colors">
                {data.description}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowNode;


