// src/components/documents/DocumentGrid.tsx
import React, { useState, useEffect, useRef } from 'react';
import { File, Trash2, Bot, X } from 'lucide-react';
import { Document } from '../../types';
import { availableAgents } from '../../constants/agents';

interface DocumentGridProps {
  documents: Document[];
  onDelete?: (id: string) => void;
  onAssignAgent?: (documentId: string, agentId: string) => void;
  onUnassignAgent?: (documentId: string, agentId: string) => void;
}

const DocumentGrid: React.FC<DocumentGridProps> = ({
  documents,
  onDelete,
  onAssignAgent,
  onUnassignAgent
}) => {
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const getAgentDetails = (agentId: string) => {
    return availableAgents.find(agent => agent.id === agentId);
  };

  const toggleDropdown = (documentId: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [documentId]: !prev[documentId]
    }));
  };

  const handleAgentSelection = (documentId: string, agentId: string) => {
    onAssignAgent?.(documentId, agentId);
  };

  const handleAgentRemoval = (documentId: string, agentId: string) => {
    onUnassignAgent?.(documentId, agentId);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const clickedOutside = Object.entries(dropdownRefs.current).every(
        ([id, ref]) => ref && !ref.contains(event.target as Node)
      );

      if (clickedOutside) {
        setOpenDropdowns({});
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!documents || documents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground dark:text-muted-foreground transition-colors">No available document</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map((document) => (
        <div
          key={document.id}
          className="bg-white dark:bg-surface-container-high p-4 rounded-lg shadow dark:shadow-gray-900 hover:shadow-md dark:hover:shadow-gray-800 transition-all border border-border dark:border-border"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-surface-container-low dark:bg-surface-container-highest rounded-lg transition-colors">
                <File className="h-6 w-6 text-muted-foreground dark:text-muted-foreground transition-colors" />
              </div>
              <div>
                <h3 className="font-medium text-foreground dark:text-foreground truncate max-w-[200px] transition-colors">
                  {document.name}
                </h3>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground transition-colors">{document.size}</p>
              </div>
            </div>
            <button
              onClick={() => onDelete?.(document.id)}
              className="text-outline dark:text-muted-foreground hover:text-destructive dark:hover:text-destructive transition-colors p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              title="Supprimer"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4">
            <p className="text-sm text-muted-foreground dark:text-muted-foreground transition-colors">
              Last update: {document.lastModified}
            </p>
          </div>

          <div className="mt-4">
            <p className="text-sm font-medium text-on-surface dark:text-muted-foreground mb-2 transition-colors">
              Assigned Agents:
            </p>
            <div className="flex flex-wrap gap-2">
              {document.assignedAgents.length === 0 ? (
                <span className="text-sm text-muted-foreground dark:text-muted-foreground italic">
                  No agents assigned
                </span>
              ) : (
                document.assignedAgents.map((agent) => {
                  return agent ? (
                    <span
                      key={agent.id}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 text-teal-600 dark:text-teal-400 transition-colors group"
                    >
                      <Bot className="h-3 w-3 mr-1" />
                      {agent.name}
                      <button
                        onClick={() => handleAgentRemoval(document.id, agent.id)}
                        className="ml-1 hover:text-red-600 dark:hover:text-destructive focus:outline-none"
                        title={`Remove ${agent.name}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ) : null;
                })
              )}
            </div>
          </div>

          <div
            className="mt-4 relative"
            ref={(el) => (dropdownRefs.current[document.id] = el)}
          >
            <button
              onClick={() => toggleDropdown(document.id)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm border border-border dark:border-border rounded-md bg-white dark:bg-surface-container-highest text-on-surface dark:text-muted-foreground hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors focus:outline-none focus:ring-2 focus:ring-ring dark:focus:ring-ring"
            >
              <span className="flex items-center">
                <Bot className="h-4 w-4 mr-2" />
                Assign agents
              </span>
              <svg
                className={`h-5 w-5 transition-transform ${openDropdowns[document.id] ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {openDropdowns[document.id] && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-surface-container-highest border border-border dark:border-border rounded-md shadow-lg max-h-60 overflow-auto">
                {availableAgents.filter(
                  (agent) => !document.assignedAgents.some(a => a?.id === agent.id)
                ).length === 0 ? (
                  <div className="px-3 py-2 text-sm text-muted-foreground dark:text-muted-foreground italic">
                    All agents assigned
                  </div>
                ) : (
                  availableAgents
                    .filter((agent) => !document.assignedAgents.some(a => a?.id === agent.id))
                    .map((agent) => (
                      <button
                        key={agent.id}
                        onClick={() => {
                          handleAgentSelection(document.id, agent.id);
                          toggleDropdown(document.id);
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-surface-container-low dark:hover:bg-surface-container-highest text-foreground dark:text-foreground transition-colors flex items-center"
                      >
                        <Bot className="h-4 w-4 mr-2 text-primary-green" />
                        {agent.name}
                      </button>
                    ))
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentGrid;
