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
      case 'indigo': return 'bg-indigo-100 dark:bg-indigo-900/30 text-primary-green dark:text-primary-green';
      case 'blue': return 'bg-blue-100 dark:bg-blue-900/30 text-tertiary dark:text-tertiary';
      case 'green': return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
      case 'purple': return 'bg-purple-100 dark:bg-purple-900/30 text-tertiary dark:text-tertiary';
      case 'orange': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400';
      case 'teal': return 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400';
      case 'red': return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-destructive';
      case 'pink': return 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400';
      default: return 'bg-surface-container-low dark:bg-surface-container-highest text-muted-foreground dark:text-muted-foreground';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-surface-container-high rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl dark:shadow-gray-900 border border-border dark:border-border transition-colors">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-border dark:border-border">
          <h2 className="text-xl font-semibold text-foreground dark:text-foreground">Import AI Agent</h2>
          <button 
            onClick={onClose}
            className="text-muted-foreground dark:text-muted-foreground hover:text-on-surface dark:hover:text-muted-foreground p-2 rounded-lg hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors"
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
                <p className="text-muted-foreground dark:text-muted-foreground">
                  Select an AI agent to import to your workspace. Monthly subscription fees apply based on the agent selected.
                </p>
                
                {/* Search Input */}
                <input
                  type="text"
                  placeholder="Search agents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-border dark:border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring dark:focus:ring-ring focus:border-primary-green dark:focus:border-teal-500 bg-white dark:bg-surface-container-highest text-foreground dark:text-foreground placeholder-gray-500 dark:placeholder-gray-400 transition-all"
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
                          ? 'border-primary-green dark:border-teal-500 bg-indigo-50 dark:bg-teal-900/20' 
                          : 'border-border dark:border-border bg-white dark:bg-surface-container-highest hover:border-border dark:hover:border-outline'
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
                          <h3 className="font-medium text-foreground dark:text-foreground">{agent.name}</h3>
                          <span className="text-xs px-2 py-1 bg-surface-container-low dark:bg-surface-container-highest text-on-surface dark:text-on-surface-variant rounded mt-1 inline-block transition-colors">
                            {agent.category}
                          </span>
                          
                          <p className={`text-sm text-muted-foreground dark:text-muted-foreground mt-2 ${isHovered ? '' : 'line-clamp-2'} transition-all duration-200`}>
                            {agent.description}
                          </p>
                          
                          {agent.skills && agent.skills.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1">
                              {agent.skills.map((skill, index) => (
                                <span key={index} className="text-xs px-2 py-1 bg-surface-container-low dark:bg-surface-container-highest/50 text-muted-foreground dark:text-muted-foreground border border-border dark:border-border rounded transition-colors">
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
                        <div className="absolute bottom-2 right-2 text-indigo-500 dark:text-teal-400 bg-white dark:bg-surface-container-high bg-opacity-80 dark:bg-opacity-80 rounded-full p-1">
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
                          ? 'bg-surface-container-low dark:bg-surface-container-highest text-outline dark:text-muted-foreground cursor-not-allowed border-border dark:border-border' 
                          : 'bg-white dark:bg-surface-container-highest text-muted-foreground dark:text-muted-foreground hover:bg-surface-container-low dark:hover:bg-surface-container-highest border-border dark:border-border'
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
                            ? 'bg-indigo-50 dark:bg-teal-900/30 border-primary-green dark:border-teal-500 text-primary-green dark:text-teal-400 z-10'
                            : 'bg-white dark:bg-surface-container-highest border-border dark:border-border text-muted-foreground dark:text-muted-foreground hover:bg-surface-container-low dark:hover:bg-surface-container-highest'
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
                          ? 'bg-surface-container-low dark:bg-surface-container-highest text-outline dark:text-muted-foreground cursor-not-allowed border-border dark:border-border' 
                          : 'bg-white dark:bg-surface-container-highest text-muted-foreground dark:text-muted-foreground hover:bg-surface-container-low dark:hover:bg-surface-container-highest border-border dark:border-border'
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
        <div className="px-6 py-4 border-t border-border dark:border-border flex justify-end gap-3 bg-surface-container-low dark:bg-surface-container-highest/50 transition-colors">
          <button 
            className="px-4 py-2 border border-border dark:border-border rounded-md text-on-surface dark:text-muted-foreground bg-white dark:bg-surface-container-highest hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className={`px-4 py-2 rounded-md text-white transition-colors shadow-sm dark:shadow-gray-900 ${
              selectedAgent 
                ? 'bg-primary dark:bg-teal-600 hover:bg-indigo-700 dark:hover:bg-teal-700' 
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
