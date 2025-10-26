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
    <div className="relative px-4 py-2 shadow-lg dark:shadow-gray-900 rounded-lg bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 group transition-colors">
      {/* Delete Button */}
      <div className="absolute top-0 right-0 mt-1 mr-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          data-node-id={id}
          aria-label="Delete node"
        >
          <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400 transition-colors" />
        </button>
      </div>

      {/* Drag Handle */}
      <div className="absolute top-0 left-0 mt-1 ml-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
        <GripHorizontal className="w-4 h-4 text-gray-400 dark:text-gray-500 transition-colors" />
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
            className="!bg-teal-500 dark:!bg-teal-400"
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
          <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-900/30 transition-colors">
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

export default WorkflowNode;


