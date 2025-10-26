import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

const agentTypes = [
  { id: 'customer-support', name: 'Customer Support', icon: '👩‍💼' },
  { id: 'technical-support', name: 'Technical Support', icon: '👨‍💻' },
  { id: 'sales-assistant', name: 'Sales Assistant', icon: '🤝' },
  { id: 'ecommerce-assistant', name: 'E-Commerce Assistant', icon: '🛒' },
  { id: 'billing-assistant', name: 'Billing Assistant', icon: '💳' }
];

export default function NewMessageModal({ isOpen, onClose, onCreateConversation }) {
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [conversationName, setConversationName] = useState('');
  const [isGroup, setIsGroup] = useState(false);

  const handleAgentToggle = (agentId) => {
    if (selectedAgents.includes(agentId)) {
      setSelectedAgents(selectedAgents.filter(id => id !== agentId));
    } else {
      setSelectedAgents([...selectedAgents, agentId]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (selectedAgents.length === 0) return;
    
    onCreateConversation({
      name: conversationName || 'New Conversation',
      agents: selectedAgents,
      isGroup: isGroup || selectedAgents.length > 1
    });
    
    // Reset form
    setSelectedAgents([]);
    setConversationName('');
    setIsGroup(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 z-50 flex items-center justify-center p-4">
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full shadow-xl dark:shadow-2xl transition-colors"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', duration: 0.5 }}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-600 transition-colors">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 transition-colors">Start New Conversation</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
              Conversation Name (Optional)
            </label>
            <input
              type="text"
              value={conversationName}
              onChange={(e) => setConversationName(e.target.value)}
              placeholder="Name your conversation"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-teal-500 dark:focus:border-teal-400 transition-colors"
            />
          </div>

          <div className="mb-6">
            <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 transition-colors">
              Select Agent(s)
            </p>
            <div className="grid grid-cols-1 gap-2">
              {agentTypes.map(agent => (
                <div 
                  key={agent.id}
                  onClick={() => handleAgentToggle(agent.id)}
                  className={`
                    p-4 border rounded-lg cursor-pointer flex items-center transition-all
                    ${selectedAgents.includes(agent.id) 
                      ? 'border-teal-500 dark:border-teal-400 bg-teal-50 dark:bg-teal-900/30' 
                      : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <div className="text-2xl mr-3">{agent.icon}</div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 transition-colors">{agent.name}</h3>
                  </div>
                  <div className="ml-auto">
                    {selectedAgents.includes(agent.id) && (
                      <div className="h-5 w-5 bg-teal-500 dark:bg-teal-400 rounded-full flex items-center justify-center">
                        <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {selectedAgents.length > 1 && (
            <div className="mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isGroup"
                  checked={isGroup}
                  onChange={() => setIsGroup(!isGroup)}
                  className="h-4 w-4 text-teal-600 dark:text-teal-400 focus:ring-teal-500 dark:focus:ring-teal-400 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded transition-colors"
                />
                <label htmlFor="isGroup" className="ml-2 block text-sm text-gray-700 dark:text-gray-300 transition-colors">
                  Create as group conversation
                </label>
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={selectedAgents.length === 0}
              className="px-4 py-2 bg-teal-600 dark:bg-teal-500 text-white rounded-lg hover:bg-teal-700 dark:hover:bg-teal-600 disabled:bg-teal-300 dark:disabled:bg-teal-700 transition-colors"
            >
              Start Conversation
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
