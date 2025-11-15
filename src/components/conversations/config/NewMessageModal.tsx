import React, { useState } from 'react';
import { X, MessageSquare, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const agentTypes = [
  { 
    id: 'customer-support', 
    name: 'Customer Support', 
    icon: '👩‍💼',
    description: 'Handle customer inquiries and support requests',
    color: 'blue'
  },
  { 
    id: 'technical-support', 
    name: 'Technical Support', 
    icon: '👨‍💻',
    description: 'Resolve technical issues and provide solutions',
    color: 'purple'
  },
  { 
    id: 'sales-assistant', 
    name: 'Sales Assistant', 
    icon: '🤝',
    description: 'Assist with sales inquiries and product information',
    color: 'green'
  },
  { 
    id: 'ecommerce-assistant', 
    name: 'E-Commerce Assistant', 
    icon: '🛒',
    description: 'Help with orders, shopping, and product recommendations',
    color: 'amber'
  },
  { 
    id: 'billing-assistant', 
    name: 'Billing Assistant', 
    icon: '💳',
    description: 'Manage billing, payments, and invoices',
    color: 'indigo'
  }
];

interface NewMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateConversation: (data: {
    name: string;
    agents: string[];
    isGroup: boolean;
  }) => void;
}

export default function NewMessageModal({ isOpen, onClose, onCreateConversation }: NewMessageModalProps) {
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [conversationName, setConversationName] = useState('');
  const [isGroup, setIsGroup] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAgentToggle = (agentId: string) => {
    setError(null);
    if (selectedAgents.includes(agentId)) {
      setSelectedAgents(selectedAgents.filter(id => id !== agentId));
    } else {
      setSelectedAgents([...selectedAgents, agentId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedAgents.length === 0) {
      setError('Please select at least one agent to start a conversation');
      return;
    }
    
    onCreateConversation({
      name: conversationName || 'New Conversation',
      agents: selectedAgents,
      isGroup: isGroup || selectedAgents.length > 1
    });
    
    // Reset form
    setSelectedAgents([]);
    setConversationName('');
    setIsGroup(false);
    setError(null);
    onClose();
  };

  const handleClose = () => {
    setSelectedAgents([]);
    setConversationName('');
    setIsGroup(false);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 dark:bg-black/80 z-50 flex items-center justify-center p-4 transition-colors"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleClose();
          }
        }}
      >
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full shadow-2xl dark:shadow-gray-900 border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto transition-colors"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-teal-900/30 border border-indigo-200 dark:border-teal-800 rounded-lg transition-colors">
                <MessageSquare className="w-6 h-6 text-indigo-600 dark:text-teal-400 transition-colors" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 transition-colors">
                  Start New Conversation
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">
                  Select one or more agents to begin chatting
                </p>
              </div>
            </div>
            <button 
              onClick={handleClose} 
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            {/* Conversation Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                Conversation Name
                <span className="text-gray-500 dark:text-gray-400 font-normal ml-1">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={conversationName}
                  onChange={(e) => setConversationName(e.target.value)}
                  placeholder="Enter a name for your conversation"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:border-indigo-500 dark:focus:border-teal-500 shadow-sm dark:shadow-gray-900 transition-colors focus:outline-none"
                  maxLength={50}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 transition-colors">
                {conversationName.length}/50 characters
              </p>
            </div>

            {/* Agent Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                  Select Agent(s) *
                </p>
                {selectedAgents.length > 0 && (
                  <span className="text-sm text-indigo-600 dark:text-teal-400 font-medium transition-colors">
                    {selectedAgents.length} selected
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {agentTypes.map((agent, index) => {
                  const isSelected = selectedAgents.includes(agent.id);
                  
                  return (
                    <motion.div
                      key={agent.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleAgentToggle(agent.id)}
                      className={`
                        p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 shadow-sm dark:shadow-gray-900 hover:shadow-md dark:hover:shadow-gray-800
                        ${isSelected 
                          ? 'border-indigo-500 dark:border-teal-500 bg-indigo-50 dark:bg-teal-900/20' 
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-300 dark:hover:border-teal-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }
                      `}
                    >
                      <div className="flex items-center">
                        <div className={`text-3xl mr-4 p-2 rounded-lg transition-colors ${
                          isSelected 
                            ? 'bg-indigo-100 dark:bg-teal-900/50' 
                            : 'bg-gray-100 dark:bg-gray-700'
                        }`}>
                          {agent.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-semibold transition-colors ${
                            isSelected 
                              ? 'text-indigo-900 dark:text-teal-100' 
                              : 'text-gray-900 dark:text-gray-100'
                          }`}>
                            {agent.name}
                          </h3>
                          <p className={`text-sm mt-1 transition-colors ${
                            isSelected 
                              ? 'text-indigo-700 dark:text-teal-300' 
                              : 'text-gray-600 dark:text-gray-400'
                          }`}>
                            {agent.description}
                          </p>
                        </div>
                        <div className="ml-4">
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="h-6 w-6 bg-indigo-600 dark:bg-teal-600 rounded-full flex items-center justify-center shadow-sm transition-colors"
                            >
                              <CheckCircle className="h-4 w-4 text-white" />
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0 transition-colors" />
                  <p className="text-sm text-red-700 dark:text-red-300 transition-colors">
                    {error}
                  </p>
                </div>
              </motion.div>
            )}
            
            {/* Group Conversation Option */}
            {selectedAgents.length > 1 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isGroup"
                    checked={isGroup || selectedAgents.length > 1}
                    onChange={() => setIsGroup(!isGroup)}
                    disabled={selectedAgents.length > 1}
                    className="h-4 w-4 text-indigo-600 dark:text-teal-600 focus:ring-indigo-500 dark:focus:ring-teal-500 border-gray-300 dark:border-gray-600 rounded transition-colors"
                  />
                  <label htmlFor="isGroup" className="ml-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600 dark:text-blue-400 transition-colors" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors">
                      Group conversation
                    </span>
                    {selectedAgents.length > 1 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
                        (Automatically enabled with multiple agents)
                      </span>
                    )}
                  </label>
                </div>
              </motion.div>
            )}

            {/* Summary */}
            {selectedAgents.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors"
              >
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 transition-colors">
                  Conversation Summary
                </h4>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 transition-colors">
                  <p>
                    <span className="font-medium text-gray-900 dark:text-gray-100">Name:</span>{' '}
                    {conversationName || 'New Conversation'}
                  </p>
                  <p>
                    <span className="font-medium text-gray-900 dark:text-gray-100">Type:</span>{' '}
                    {selectedAgents.length > 1 || isGroup ? 'Group' : 'Direct'}
                  </p>
                  <p>
                    <span className="font-medium text-gray-900 dark:text-gray-100">Agents:</span>{' '}
                    {selectedAgents.map(id => agentTypes.find(a => a.id === id)?.name).join(', ')}
                  </p>
                </div>
              </motion.div>
            )}
            
            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700 transition-colors">
              <button 
                type="button" 
                onClick={handleClose}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium shadow-sm dark:shadow-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={selectedAgents.length === 0}
                className="px-6 py-3 bg-indigo-600 dark:bg-teal-600 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-teal-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors font-medium shadow-sm dark:shadow-gray-900 hover:shadow-md dark:hover:shadow-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Start Conversation
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
