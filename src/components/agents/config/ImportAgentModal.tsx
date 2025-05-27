import React, { useState } from 'react';
import { X, Info } from 'lucide-react';
import { useAgents, MarketplaceAgent } from '../../../hooks/useAgents';

interface ImportAgentModalProps {
  onClose: () => void;
  onImportComplete: (agent: MarketplaceAgent) => void;
}

const ImportAgentModal: React.FC<ImportAgentModalProps> = ({ onClose, onImportComplete }) => {
  const { agents, isLoading, getCategoryColor } = useAgents();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAgent, setSelectedAgent] = useState<MarketplaceAgent | null>(null);
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const itemsPerPage = 20;

  // Filter agents based on search term
  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (agent.skills && agent.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const pageCount = Math.ceil(filteredAgents.length / itemsPerPage);

  const currentAgents = filteredAgents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleImport = () => {
    if (selectedAgent) {
      onImportComplete(selectedAgent);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Import AI Agent</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-gray-600">Select an AI agent to import to your workspace. Monthly subscription fees apply based on the agent selected.</p>
                {/* Search Input */}
                <input
                  type="text"
                  placeholder="Search agents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentAgents.map((agent) => {
                  const color = getCategoryColor(agent.category);
                  const IconComponent = agent.icon;
                  const isHovered = hoveredAgent === agent.id;
                  
                  return (
                    <div 
                      key={agent.id} 
                      className={`border rounded-lg p-4 cursor-pointer transition hover:shadow-md relative ${
                        selectedAgent?.id === agent.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedAgent(agent)}
                      onMouseEnter={() => setHoveredAgent(agent.id)}
                      onMouseLeave={() => setHoveredAgent(null)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`h-12 w-12 rounded-md flex-shrink-0 flex items-center justify-center ${
                          color === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
                          color === 'blue' ? 'bg-blue-100 text-blue-600' :
                          color === 'green' ? 'bg-green-100 text-green-600' :
                          color === 'purple' ? 'bg-purple-100 text-purple-600' :
                          color === 'orange' ? 'bg-orange-100 text-orange-600' :
                          color === 'teal' ? 'bg-teal-100 text-teal-600' :
                          color === 'red' ? 'bg-red-100 text-red-600' :
                          color === 'pink' ? 'bg-pink-100 text-pink-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          <IconComponent size={24} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{agent.name}</h3>
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded mt-1 inline-block">
                            {agent.category}
                          </span>
                          
                          <p className={`text-sm text-gray-600 mt-2 ${isHovered ? '' : 'line-clamp-2'} transition-all duration-200`}>
                            {agent.description}
                          </p>
                          
                          {agent.skills && agent.skills.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1">
                              {agent.skills.map((skill, index) => (
                                <span key={index} className="text-xs px-2 py-1 bg-gray-50 text-gray-600 border border-gray-100 rounded">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex-shrink-0">
                          <span className="font-medium text-indigo-700">{agent.pricePerMonth}€/mo</span>
                        </div>
                      </div>
                      
                      {/* Info indicator when content is truncated and not hovered */}
                      {!isHovered && agent.description.length > 100 && (
                        <div className="absolute bottom-2 right-2 text-indigo-500 bg-white bg-opacity-80 rounded-full p-1">
                          <Info size={16} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Pagination */}
              {pageCount > 1 && (
                <div className="flex justify-center mt-8">
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                        currentPage === 1 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: pageCount }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === i + 1
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-600 z-10'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
                      disabled={currentPage === pageCount}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                        currentPage === pageCount 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-end gap-3 bg-gray-50">
          <button 
            className="px-4 py-2 border rounded-md text-gray-700 bg-white hover:bg-gray-50"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className={`px-4 py-2 rounded-md text-white ${
              selectedAgent 
                ? 'bg-indigo-600 hover:bg-indigo-700' 
                : 'bg-indigo-400 cursor-not-allowed'
            }`}
            onClick={handleImport}
            disabled={!selectedAgent}
          >
            {selectedAgent 
              ? `Import Agent ($${selectedAgent.pricePerMonth}/mo)` 
              : 'Select an Agent'
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportAgentModal;