// src/components/documents/DocumentGrid.tsx
import React from 'react';
import { File, Trash2, Bot } from 'lucide-react';
import { Document } from '../../types';
import { availableAgents } from '../../constants/agents';

interface DocumentGridProps {
  documents: Document[];
  onDelete?: (id: string) => void;
  onAssignAgent?: (documentId: string, agentId: string) => void;
}

const DocumentGrid: React.FC<DocumentGridProps> = ({ 
  documents, 
  onDelete, 
  onAssignAgent 
}) => {
  const getAgentDetails = (agentId: string) => {
    return availableAgents.find(agent => agent.id === agentId);
  };

  if (!documents || documents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No available document</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map((document) => (
        <div
          key={document.id}
          className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <File className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 truncate max-w-[200px]">
                  {document.name}
                </h3>
                <p className="text-sm text-gray-500">{document.size}</p>
              </div>
            </div>
            <button
              onClick={() => onDelete?.(document.id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
              title="Supprimer"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-500">
              Last update : {document.lastModified}
            </p>
          </div>

          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Assigned Agents :
            </p>
            <div className="flex flex-wrap gap-2">
              {document.assignedAgents.map((agentId) => {
                const agentDetails = getAgentDetails(agentId);
                return agentDetails ? (
                  <span
                    key={agentId}
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${agentDetails.color}`}
                  >
                    <Bot className="h-3 w-3 mr-1" />
                    {agentDetails.name}
                  </span>
                ) : null;
              })}
            </div>
          </div>

          <div className="mt-4">
            <select
              onChange={(e) => onAssignAgent?.(document.id, e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Assign a new agent...</option>
              {availableAgents
                .filter(
                  (agent) => !document.assignedAgents.includes(agent.id)
                )
                .map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentGrid;
