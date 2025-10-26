import React from 'react';
import { PenTool as Tool, Plus, X } from 'lucide-react';
import { WorkflowComponentsPanelProps } from '../types/workflowTypes';
import { nodeTypes } from '../constants/workflowConstants.tsx'; // Assuming this path is correct

/**
 * Draggable components panel for workflow designer
 * Displays available node types that can be dragged onto the canvas
 */
const WorkflowComponentsPanel: React.FC<WorkflowComponentsPanelProps> = ({
  isMinimized,
  onToggleMinimize,
}) => {
  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl dark:shadow-gray-900 overflow-hidden transition-colors">
      <div className="w-64">
        {/* Panel Header */}
        <div
          className="p-4 bg-gradient-to-r from-teal-50 to-teal-100 dark:from-gray-800 dark:to-gray-700 flex items-center justify-between cursor-pointer border-b border-teal-200 dark:border-gray-600 transition-colors"
          onClick={onToggleMinimize}
          role="button"
          tabIndex={0}
          aria-expanded={!isMinimized}
        >
          <h3 className="text-base font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100 transition-colors">
            <Tool className="w-4 h-4 text-teal-600 dark:text-teal-400 transition-colors" strokeWidth={2.5} />
            Components
          </h3>
          <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors rounded-lg p-1 hover:bg-white/50 dark:hover:bg-gray-600">
            {isMinimized ? (
              <Plus className="w-5 h-5" strokeWidth={2.5} />
            ) : (
              <X className="w-5 h-5" strokeWidth={2.5} />
            )}
          </button>
        </div>

        {/* Components List */}
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isMinimized
              ? 'max-h-0 opacity-0'
              : 'max-h-[600px] opacity-100'
          }`}
        >
          <div className="p-4 space-y-2 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
            {Object.entries(nodeTypes).map(([key, config]) => (
              <div
                key={key}
                draggable
                onDragStart={(event) => handleDragStart(event, key)}
                className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-move hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-teal-300 dark:hover:border-teal-500 transition-all duration-200 active:scale-95 group bg-white dark:bg-gray-800"
                role="button"
                tabIndex={0}
              >
                <div className="p-1.5 rounded-md bg-teal-50 dark:bg-teal-900/30 group-hover:bg-teal-100 dark:group-hover:bg-teal-900/50 transition-colors">
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
    </div>
  );
};

export default WorkflowComponentsPanel;
