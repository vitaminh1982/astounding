import React, { useState, useEffect, useRef } from 'react';
import { X, Search, Users, CheckCircle, Circle, Bot, Star, Award, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

// Agent interface with industry specializations
export interface SelectableAgent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  description: string;
  capabilities: string[];
  industries: string[];
  status: 'active' | 'inactive' | 'maintenance';
  rating: number;
  responseTime: string;
  successRate: number;
  monthlyPrice: number;
  isPopular?: boolean;
  isRecommended?: boolean;
}

// Project interface for filtering context
export interface ProjectContext {
  id: string;
  name: string;
  client: {
    name: string;
    industry: string;
  };
  requirements?: string[];
}

interface AgentSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProject: ProjectContext;
  selectedAgentIds: string[];
  onAgentsUpdate: (agentIds: string[]) => void;
  maxAgents?: number;
}

// Comprehensive agent marketplace data
const AVAILABLE_AGENTS: SelectableAgent[] = [
  // Project Management Specialists
  {
    id: 'pm-001',
    name: 'Alex Thompson',
    role: 'Senior Project Manager',
    avatar: '🧭',
    description: 'Expert in agile methodologies, timeline optimization, and cross-functional team coordination',
    capabilities: ['Agile/Scrum Management', 'Timeline Optimization', 'Risk Assessment', 'Stakeholder Communication'],
    industries: ['Technology', 'Financial Services', 'Healthcare', 'Manufacturing'],
    status: 'active',
    rating: 4.9,
    responseTime: '0.8s',
    successRate: 96.2,
    monthlyPrice: 2500,
    isPopular: true,
    isRecommended: true
  },
  {
    id: 'pm-002',
    name: 'Maria Rodriguez',
    role: 'Digital Transformation PM',
    avatar: '🚀',
    description: 'Specialized in digital transformation projects and change management',
    capabilities: ['Digital Strategy', 'Change Management', 'Process Optimization', 'Technology Integration'],
    industries: ['Technology', 'Retail', 'Manufacturing', 'Education'],
    status: 'active',
    rating: 4.8,
    responseTime: '1.1s',
    successRate: 94.7,
    monthlyPrice: 2800,
    isRecommended: true
  },

  // Business Analysts
  {
    id: 'ba-001',
    name: 'Sarah Chen',
    role: 'Senior Business Analyst',
    avatar: '📝',
    description: 'Expert in requirements gathering, process mapping, and stakeholder analysis',
    capabilities: ['Requirements Engineering', 'Process Mapping', 'User Story Creation', 'Stakeholder Analysis'],
    industries: ['Technology', 'Financial Services', 'Healthcare', 'Government'],
    status: 'active',
    rating: 4.7,
    responseTime: '1.2s',
    successRate: 92.5,
    monthlyPrice: 2200,
    isPopular: true
  },
  {
    id: 'ba-002',
    name: 'David Kim',
    role: 'Digital Business Analyst',
    avatar: '💡',
    description: 'Focuses on digital product requirements and user experience optimization',
    capabilities: ['Digital Product Analysis', 'UX Requirements', 'Data Flow Mapping', 'API Specifications'],
    industries: ['Technology', 'E-commerce', 'Media', 'Startups'],
    status: 'active',
    rating: 4.6,
    responseTime: '1.0s',
    successRate: 91.8,
    monthlyPrice: 2400
  },

  // Data Analysts
  {
    id: 'da-001',
    name: 'Marcus Johnson',
    role: 'Senior Data Analyst',
    avatar: '📊',
    description: 'Advanced analytics, machine learning, and business intelligence specialist',
    capabilities: ['Advanced Analytics', 'Machine Learning', 'Data Visualization', 'Statistical Modeling'],
    industries: ['Technology', 'Financial Services', 'Healthcare', 'Retail'],
    status: 'active',
    rating: 4.8,
    responseTime: '0.9s',
    successRate: 93.7,
    monthlyPrice: 2600,
    isRecommended: true
  },
  {
    id: 'da-002',
    name: 'Lisa Wang',
    role: 'Business Intelligence Analyst',
    avatar: '📈',
    description: 'Expert in KPI development, dashboard creation, and performance analytics',
    capabilities: ['KPI Development', 'Dashboard Design', 'Performance Analytics', 'Reporting Automation'],
    industries: ['Financial Services', 'Retail', 'Manufacturing', 'Healthcare'],
    status: 'active',
    rating: 4.5,
    responseTime: '1.3s',
    successRate: 90.2,
    monthlyPrice: 2100
  },

  // Strategy Consultants
  {
    id: 'sc-001',
    name: 'Diana Foster',
    role: 'Strategy Consultant',
    avatar: '🎯',
    description: 'Market analysis, competitive intelligence, and strategic planning expert',
    capabilities: ['Market Research', 'Competitive Analysis', 'Strategic Planning', 'Business Model Innovation'],
    industries: ['Technology', 'Financial Services', 'Retail', 'Consulting'],
    status: 'active',
    rating: 4.9,
    responseTime: '1.5s',
    successRate: 91.3,
    monthlyPrice: 3200,
    isPopular: true,
    isRecommended: true
  },
  {
    id: 'sc-002',
    name: 'Robert Taylor',
    role: 'Digital Strategy Consultant',
    avatar: '💼',
    description: 'Digital transformation strategy and innovation management specialist',
    capabilities: ['Digital Strategy', 'Innovation Management', 'Technology Roadmaps', 'Digital Marketing'],
    industries: ['Technology', 'Media', 'E-commerce', 'Startups'],
    status: 'active',
    rating: 4.6,
    responseTime: '1.4s',
    successRate: 89.8,
    monthlyPrice: 2900
  },

  // PMO Analysts
  {
    id: 'pmo-001',
    name: 'Jennifer Adams',
    role: 'PMO Analyst',
    avatar: '📋',
    description: 'Portfolio management, governance, and compliance specialist',
    capabilities: ['Portfolio Management', 'Governance Framework', 'Compliance Monitoring', 'Resource Optimization'],
    industries: ['Financial Services', 'Healthcare', 'Government', 'Manufacturing'],
    status: 'active',
    rating: 4.7,
    responseTime: '1.1s',
    successRate: 95.7,
    monthlyPrice: 2300,
    isRecommended: true
  },
  {
    id: 'pmo-002',
    name: 'Michael Brown',
    role: 'Enterprise PMO Specialist',
    avatar: '🏢',
    description: 'Large-scale enterprise project governance and methodology expert',
    capabilities: ['Enterprise Governance', 'Methodology Design', 'Quality Assurance', 'Risk Management'],
    industries: ['Financial Services', 'Technology', 'Healthcare', 'Energy'],
    status: 'active',
    rating: 4.8,
    responseTime: '1.0s',
    successRate: 94.1,
    monthlyPrice: 2700
  },

  // Specialized Consultants
  {
    id: 'fc-001',
    name: 'Emma Wilson',
    role: 'Financial Consultant',
    avatar: '💰',
    description: 'Financial modeling, investment analysis, and budget optimization expert',
    capabilities: ['Financial Modeling', 'Investment Analysis', 'Budget Planning', 'Cost Optimization'],
    industries: ['Financial Services', 'Investment', 'Real Estate', 'Technology'],
    status: 'active',
    rating: 4.6,
    responseTime: '1.2s',
    successRate: 92.4,
    monthlyPrice: 2800
  },
  {
    id: 'tc-001',
    name: 'James Miller',
    role: 'Technology Consultant',
    avatar: '💻',
    description: 'Enterprise architecture, cloud migration, and technology assessment specialist',
    capabilities: ['Enterprise Architecture', 'Cloud Strategy', 'Technology Assessment', 'Digital Infrastructure'],
    industries: ['Technology', 'Financial Services', 'Healthcare', 'Government'],
    status: 'active',
    rating: 4.7,
    responseTime: '1.0s',
    successRate: 93.1,
    monthlyPrice: 3000
  },
  {
    id: 'mc-001',
    name: 'Sophie Laurent',
    role: 'Marketing Consultant',
    avatar: '📢',
    description: 'Brand strategy, market positioning, and customer acquisition specialist',
    capabilities: ['Brand Strategy', 'Market Positioning', 'Customer Acquisition', 'Digital Marketing'],
    industries: ['Retail', 'E-commerce', 'Technology', 'Consumer Goods'],
    status: 'active',
    rating: 4.5,
    responseTime: '1.3s',
    successRate: 88.9,
    monthlyPrice: 2400
  },

  // Industry-Specific Specialists
  {
    id: 'hc-001',
    name: 'Dr. Amanda Clark',
    role: 'Healthcare Consultant',
    avatar: '🏥',
    description: 'Healthcare operations, compliance, and digital health transformation expert',
    capabilities: ['Healthcare Operations', 'HIPAA Compliance', 'Digital Health', 'Process Improvement'],
    industries: ['Healthcare', 'Pharmaceuticals', 'Medical Devices'],
    status: 'active',
    rating: 4.9,
    responseTime: '1.4s',
    successRate: 96.8,
    monthlyPrice: 3500
  },
  {
    id: 'rc-001',
    name: 'Carlos Mendez',
    role: 'Retail Consultant',
    avatar: '🛍️',
    description: 'Retail operations, supply chain optimization, and customer experience specialist',
    capabilities: ['Retail Operations', 'Supply Chain', 'Customer Experience', 'Inventory Management'],
    industries: ['Retail', 'E-commerce', 'Consumer Goods', 'Fashion'],
    status: 'active',
    rating: 4.4,
    responseTime: '1.1s',
    successRate: 87.6,
    monthlyPrice: 2200
  }
];

const AgentSelectionModal: React.FC<AgentSelectionModalProps> = ({
  isOpen,
  onClose,
  currentProject,
  selectedAgentIds,
  onAgentsUpdate,
  maxAgents = 5
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>(selectedAgentIds);
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter agents based on project industry and search query
  const filteredAgents = AVAILABLE_AGENTS.filter(agent => {
    // Only show active agents
    if (agent.status !== 'active') return false;

    // Filter by industry match
    const industryMatch = agent.industries.includes(currentProject.client.industry);
    
    // Filter by search query
    const searchMatch = searchQuery === '' || 
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.capabilities.some(cap => cap.toLowerCase().includes(searchQuery.toLowerCase()));

    return industryMatch && searchMatch;
  });

  // Sort agents by recommendation, popularity, then rating
  const sortedAgents = [...filteredAgents].sort((a, b) => {
    if (a.isRecommended && !b.isRecommended) return -1;
    if (!a.isRecommended && b.isRecommended) return 1;
    if (a.isPopular && !b.isPopular) return -1;
    if (!a.isPopular && b.isPopular) return 1;
    return b.rating - a.rating;
  });

  // Focus management for accessibility
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Reset temp selection when modal opens
  useEffect(() => {
    if (isOpen) {
      setTempSelectedIds(selectedAgentIds);
    }
  }, [isOpen, selectedAgentIds]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Toggle agent selection
  const toggleAgentSelection = (agentId: string) => {
    setTempSelectedIds(prev => {
      if (prev.includes(agentId)) {
        return prev.filter(id => id !== agentId);
      } else if (prev.length < maxAgents) {
        return [...prev, agentId];
      } else {
        toast.error(`Maximum ${maxAgents} agents allowed`);
        return prev;
      }
    });
  };

  // Handle save
  const handleSave = async () => {
    if (tempSelectedIds.length === 0) {
      toast.error('Please select at least one agent');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      onAgentsUpdate(tempSelectedIds);
      toast.success(`Successfully updated agent team (${tempSelectedIds.length}/${maxAgents} agents)`);
      onClose();
    } catch (error) {
      toast.error('Failed to update agents. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get agent selection status
  const isAgentSelected = (agentId: string) => tempSelectedIds.includes(agentId);
  const canSelectMore = tempSelectedIds.length < maxAgents;

  // Get industry match indicator
  const getIndustryMatchScore = (agent: SelectableAgent) => {
    const matches = agent.industries.filter(industry => 
      industry === currentProject.client.industry
    ).length;
    return matches;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={handleBackdropClick}
      >
        <motion.div
          ref={modalRef}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Select AI Agents</h2>
              <p className="text-sm text-gray-500 mt-1">
                Choose up to {maxAgents} agents for {currentProject.name} ({currentProject.client.industry})
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search and Selection Counter */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search agents by name, role, or capabilities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-medium">
                    {tempSelectedIds.length} of {maxAgents} selected
                  </span>
                </div>
                
                {tempSelectedIds.length > 0 && (
                  <button
                    onClick={() => setTempSelectedIds([])}
                    className="text-sm text-gray-500 hover:text-gray-700 underline"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Agents Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            {sortedAgents.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Bot className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No agents found</h3>
                <p className="text-gray-500">
                  {searchQuery 
                    ? 'Try adjusting your search criteria' 
                    : `No active agents available for ${currentProject.client.industry} industry`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedAgents.map((agent) => {
                  const isSelected = isAgentSelected(agent.id);
                  const canSelect = canSelectMore || isSelected;
                  const industryMatch = getIndustryMatchScore(agent);
                  
                  return (
                    <motion.div
                      key={agent.id}
                      whileHover={{ scale: canSelect ? 1.02 : 1 }}
                      whileTap={{ scale: canSelect ? 0.98 : 1 }}
                      onClick={() => canSelect && toggleAgentSelection(agent.id)}
                      className={`
                        relative p-6 border rounded-xl transition-all duration-200 cursor-pointer
                        ${isSelected 
                          ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200' 
                          : canSelect
                          ? 'border-gray-200 hover:border-indigo-300 hover:shadow-md'
                          : 'border-gray-200 opacity-50 cursor-not-allowed'
                        }
                      `}
                    >
                      {/* Selection indicator */}
                      <div className="absolute top-4 right-4">
                        {isSelected ? (
                          <CheckCircle className="w-6 h-6 text-indigo-600" />
                        ) : (
                          <Circle className="w-6 h-6 text-gray-300" />
                        )}
                      </div>

                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex gap-1">
                        {agent.isRecommended && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                            Recommended
                          </span>
                        )}
                        {agent.isPopular && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                            Popular
                          </span>
                        )}
                      </div>

                      {/* Agent Info */}
                      <div className="mt-8 mb-4">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-3xl">{agent.avatar}</span>
                          <div>
                            <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                            <p className="text-sm text-gray-600">{agent.role}</p>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {agent.description}
                        </p>

                        {/* Capabilities */}
                        <div className="mb-4">
                          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                            Key Capabilities
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {agent.capabilities.slice(0, 3).map((capability) => (
                              <span 
                                key={capability} 
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                              >
                                {capability}
                              </span>
                            ))}
                            {agent.capabilities.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                +{agent.capabilities.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Performance Metrics */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <Star className="w-3 h-3 text-yellow-500" />
                              <span className="text-sm font-semibold">{agent.rating}</span>
                            </div>
                            <p className="text-xs text-gray-500">Rating</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-semibold text-green-600">{agent.successRate}%</p>
                            <p className="text-xs text-gray-500">Success Rate</p>
                          </div>
                        </div>

                        {/* Industry Match Indicator */}
                        {industryMatch > 0 && (
                          <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-200">
                            <Award className="w-4 h-4 text-green-600" />
                            <span className="text-xs text-green-800 font-medium">
                              Perfect match for {currentProject.client.industry}
                            </span>
                          </div>
                        )}

                        {/* Pricing */}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex justify-between items-center">
                            
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {tempSelectedIds.length > 0 && (
                  <span>
                    Total monthly cost: €{sortedAgents
                      .filter(agent => tempSelectedIds.includes(agent.id))
                      .reduce((sum, agent) => sum + agent.monthlyPrice, 0)
                      .toLocaleString()}
                  </span>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading || tempSelectedIds.length === 0}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  {isLoading ? 'Updating...' : 'Save Selection'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AgentSelectionModal;