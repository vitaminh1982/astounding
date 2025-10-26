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

  const getCategoryIconStyles = (color: string) => {
    switch (color) {
      case 'indigo': return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400';
      case 'blue': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
      case 'green': return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
      case 'purple': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400';
      case 'orange': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400';
      case 'teal': return 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400';
      case 'red': return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400';
      case 'pink': return 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl dark:shadow-gray-900 border border-gray-200 dark:border-gray-600 transition-colors">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-600">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Import AI Agent</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-teal-500"></div>
            </div>
          ) : (
            <>
              <div className="mb-6 space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  Select an AI agent to import to your workspace. Monthly subscription fees apply based on the agent selected.
                </p>
                
                {/* Search Input */}
                <input
                  type="text"
                  placeholder="Search agents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:border-indigo-500 dark:focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentAgents.map((agent) => {
                  const color = getCategoryColor(agent.category);
                  const IconComponent = agent.icon;
                  const isHovered = hoveredAgent === agent.id;
                  const isSelected = selectedAgent?.id === agent.id;
                  
                  return (
                    <div 
                      key={agent.id} 
                      className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md dark:hover:shadow-gray-900 relative ${
                        isSelected 
                          ? 'border-indigo-500 dark:border-teal-500 bg-indigo-50 dark:bg-teal-900/20' 
                          : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                      onClick={() => setSelectedAgent(agent)}
                      onMouseEnter={() => setHoveredAgent(agent.id)}
                      onMouseLeave={() => setHoveredAgent(null)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`h-12 w-12 rounded-md flex-shrink-0 flex items-center justify-center transition-colors ${getCategoryIconStyles(color)}`}>
                          <IconComponent size={24} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-gray-100">{agent.name}</h3>
                          <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded mt-1 inline-block transition-colors">
                            {agent.category}
                          </span>
                          
                          <p className={`text-sm text-gray-600 dark:text-gray-300 mt-2 ${isHovered ? '' : 'line-clamp-2'} transition-all duration-200`}>
                            {agent.description}
                          </p>
                          
                          {agent.skills && agent.skills.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1">
                              {agent.skills.map((skill, index) => (
                                <span key={index} className="text-xs px-2 py-1 bg-gray-50 dark:bg-gray-600/50 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-600 rounded transition-colors">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex-shrink-0">
                          <span className="font-medium text-indigo-700 dark:text-teal-400">{agent.pricePerMonth}€/mo</span>
                        </div>
                      </div>
                      
                      {/* Info indicator when content is truncated and not hovered */}
                      {!isHovered && agent.description.length > 100 && (
                        <div className="absolute bottom-2 right-2 text-indigo-500 dark:text-teal-400 bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 rounded-full p-1">
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
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm dark:shadow-gray-900 -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border text-sm font-medium transition-colors ${
                        currentPage === 1 
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed border-gray-300 dark:border-gray-600' 
                          : 'bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: pageCount }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors ${
                          currentPage === i + 1
                            ? 'bg-indigo-50 dark:bg-teal-900/30 border-indigo-500 dark:border-teal-500 text-indigo-600 dark:text-teal-400 z-10'
                            : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
                      disabled={currentPage === pageCount}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border text-sm font-medium transition-colors ${
                        currentPage === pageCount 
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed border-gray-300 dark:border-gray-600' 
                          : 'bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600'
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
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-600 flex justify-end gap-3 bg-gray-50 dark:bg-gray-700/50 transition-colors">
          <button 
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className={`px-4 py-2 rounded-md text-white transition-colors shadow-sm dark:shadow-gray-900 ${
              selectedAgent 
                ? 'bg-indigo-600 dark:bg-teal-600 hover:bg-indigo-700 dark:hover:bg-teal-700' 
                : 'bg-indigo-400 dark:bg-teal-400 cursor-not-allowed'
            }`}
            onClick={handleImport}
            disabled={!selectedAgent}
          >
            {selectedAgent 
              ? `Import Agent (${selectedAgent.pricePerMonth}€/mo)` 
              : 'Select an Agent'
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportAgentModal;
