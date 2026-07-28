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
          className="bg-white dark:bg-surface-container-high rounded-xl max-w-2xl w-full shadow-2xl dark:shadow-gray-900 border border-border dark:border-border max-h-[90vh] overflow-y-auto transition-colors"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border dark:border-border transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-green-900/30 border border-indigo-200 dark:border-green-800 rounded-lg transition-colors">
                <MessageSquare className="w-6 h-6 text-primary-green dark:text-green-400 transition-colors" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground dark:text-foreground transition-colors">
                  Start New Conversation
                </h2>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground transition-colors">
                  Select one or more agents to begin chatting
                </p>
              </div>
            </div>
            <button 
              onClick={handleClose} 
              className="text-muted-foreground dark:text-muted-foreground hover:text-on-surface dark:hover:text-on-surface-variant p-2 hover:bg-surface-container-low dark:hover:bg-surface-container-highest rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-ring focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            {/* Conversation Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-on-surface dark:text-muted-foreground mb-2 transition-colors">
                Conversation Name
                <span className="text-muted-foreground dark:text-muted-foreground font-normal ml-1">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={conversationName}
                  onChange={(e) => setConversationName(e.target.value)}
                  placeholder="Enter a name for your conversation"
                  className="w-full px-4 py-3 border border-border dark:border-border rounded-lg bg-white dark:bg-surface-container-highest text-foreground dark:text-foreground placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-ring dark:focus:ring-ring focus:border-primary-green dark:focus:border-green-500 shadow-sm dark:shadow-gray-900 transition-colors focus:outline-none"
                  maxLength={50}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground dark:text-muted-foreground transition-colors">
                {conversationName.length}/50 characters
              </p>
            </div>

            {/* Agent Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="block text-sm font-medium text-on-surface dark:text-muted-foreground transition-colors">
                  Select Agent(s) *
                </p>
                {selectedAgents.length > 0 && (
                  <span className="text-sm text-primary-green dark:text-green-400 font-medium transition-colors">
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
                          ? 'border-primary-green dark:border-green-500 bg-indigo-50 dark:bg-green-900/20' 
                          : 'border-border dark:border-border bg-white dark:bg-surface-container-high hover:border-indigo-300 dark:hover:border-green-600 hover:bg-surface-container-low dark:hover:bg-surface-container-highest'
                        }
                      `}
                    >
                      <div className="flex items-center">
                        <div className={`text-3xl mr-4 p-2 rounded-lg transition-colors ${
                          isSelected 
                            ? 'bg-indigo-100 dark:bg-green-900/50' 
                            : 'bg-surface-container-low dark:bg-surface-container-highest'
                        }`}>
                          {agent.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-semibold transition-colors ${
                            isSelected 
                              ? 'text-indigo-900 dark:text-green-100' 
                              : 'text-foreground dark:text-foreground'
                          }`}>
                            {agent.name}
                          </h3>
                          <p className={`text-sm mt-1 transition-colors ${
                            isSelected 
                              ? 'text-indigo-700 dark:text-green-300' 
                              : 'text-muted-foreground dark:text-muted-foreground'
                          }`}>
                            {agent.description}
                          </p>
                        </div>
                        <div className="ml-4">
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="h-6 w-6 bg-primary dark:bg-green-600 rounded-full flex items-center justify-center shadow-sm transition-colors"
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
                  <AlertCircle className="w-5 h-5 text-destructive dark:text-destructive flex-shrink-0 transition-colors" />
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
                    className="h-4 w-4 text-primary-green dark:text-green-600 focus:ring-ring dark:focus:ring-ring border-border dark:border-border rounded transition-colors"
                  />
                  <label htmlFor="isGroup" className="ml-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-tertiary dark:text-tertiary transition-colors" />
                    <span className="text-sm font-medium text-foreground dark:text-foreground transition-colors">
                      Group conversation
                    </span>
                    {selectedAgents.length > 1 && (
                      <span className="text-xs text-muted-foreground dark:text-muted-foreground transition-colors">
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
                className="mb-6 p-4 bg-surface-container-low dark:bg-surface-container-high/50 border border-border dark:border-border rounded-lg transition-colors"
              >
                <h4 className="text-sm font-medium text-foreground dark:text-foreground mb-2 transition-colors">
                  Conversation Summary
                </h4>
                <div className="space-y-2 text-sm text-muted-foreground dark:text-muted-foreground transition-colors">
                  <p>
                    <span className="font-medium text-foreground dark:text-foreground">Name:</span>{' '}
                    {conversationName || 'New Conversation'}
                  </p>
                  <p>
                    <span className="font-medium text-foreground dark:text-foreground">Type:</span>{' '}
                    {selectedAgents.length > 1 || isGroup ? 'Group' : 'Direct'}
                  </p>
                  <p>
                    <span className="font-medium text-foreground dark:text-foreground">Agents:</span>{' '}
                    {selectedAgents.map(id => agentTypes.find(a => a.id === id)?.name).join(', ')}
                  </p>
                </div>
              </motion.div>
            )}
            
            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-border dark:border-border transition-colors">
              <button 
                type="button" 
                onClick={handleClose}
                className="px-6 py-3 border border-border dark:border-border text-on-surface dark:text-muted-foreground bg-white dark:bg-surface-container-high rounded-lg hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors font-medium shadow-sm dark:shadow-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-ring focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={selectedAgents.length === 0}
                className="px-6 py-3 bg-primary dark:bg-green-600 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-green-700 disabled:bg-surface-container dark:disabled:bg-surface-container-highest disabled:cursor-not-allowed transition-colors font-medium shadow-sm dark:shadow-gray-900 hover:shadow-md dark:hover:shadow-gray-800 focus:outline-none focus:ring-2 focus:ring-ring dark:focus:ring-ring focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex items-center gap-2"
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
