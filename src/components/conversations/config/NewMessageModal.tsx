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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div 
        className="bg-white rounded-xl max-w-md w-full shadow-xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', duration: 0.5 }}
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Start New Conversation</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Conversation Name (Optional)
            </label>
            <input
              type="text"
              value={conversationName}
              onChange={(e) => setConversationName(e.target.value)}
              placeholder="Name your conversation"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="mb-6">
            <p className="block text-sm font-medium text-gray-700 mb-3">
              Select Agent(s)
            </p>
            <div className="grid grid-cols-1 gap-2">
              {agentTypes.map(agent => (
                <div 
                  key={agent.id}
                  onClick={() => handleAgentToggle(agent.id)}
                  className={`
                    p-4 border rounded-lg cursor-pointer flex items-center
                    ${selectedAgents.includes(agent.id) 
                      ? 'border-indigo-500 bg-indigo-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="text-2xl mr-3">{agent.icon}</div>
                  <div>
                    <h3 className="font-medium">{agent.name}</h3>
                  </div>
                  <div className="ml-auto">
                    {selectedAgents.includes(agent.id) && (
                      <div className="h-5 w-5 bg-indigo-500 rounded-full flex items-center justify-center">
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
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="isGroup" className="ml-2 block text-sm text-gray-700">
                  Create as group conversation
                </label>
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={selectedAgents.length === 0}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300"
            >
              Start Conversation
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}