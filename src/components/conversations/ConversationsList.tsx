import React from 'react';
import { Star, Clock, AlertTriangle, Bot, User, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCombinedConversations } from '../../hooks/useCombinedConversations';

export default function ConversationsList({ onSelect, selectedId }) {
  const { conversations, loading, error } = useCombinedConversations();

  return (
    <div className="space-y-4 mt-4">
      {/* Loading indicator */}
      {loading && (
        <div className="flex items-center justify-center py-2 mb-4 bg-indigo-50 dark:bg-teal-900/30 border border-indigo-100 dark:border-teal-800 rounded-lg transition-colors">
          <Loader className="w-4 h-4 text-indigo-500 dark:text-teal-400 animate-spin mr-2 transition-colors" />
          <span className="text-sm text-indigo-600 dark:text-teal-300 transition-colors">Loading active conversations...</span>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-300 rounded-lg text-sm transition-colors">
          <p className="font-medium mb-1 transition-colors">Error loading active conversations</p>
          <p className="transition-colors">{error}</p>
        </div>
      )}

      {conversations.map((conversation) => (
        <motion.button
          key={conversation.id}
          onClick={() => onSelect(conversation)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className={`
            relative w-full p-4 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm hover:shadow-md
            ${selectedId === conversation.id 
              ? 'bg-indigo-50 dark:bg-teal-900/30 border-indigo-200 dark:border-teal-600 focus:ring-indigo-500 dark:focus:ring-teal-500 dark:focus:ring-offset-gray-800 shadow-md dark:shadow-gray-900' 
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-teal-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-gray-500 dark:focus:ring-teal-500 dark:focus:ring-offset-gray-900 dark:shadow-gray-900 dark:hover:shadow-gray-800'
            }
          `}
        >
          {conversation.needsAttention && (
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 dark:bg-red-400">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 dark:bg-red-300 opacity-75"></span>
            </span>
          )}

          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-3">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-white font-medium transition-colors
                ${conversation.client.avatar ? '' : 'bg-gradient-to-br from-indigo-500 to-purple-500 dark:from-teal-500 dark:to-teal-600'}
              `}>
                {conversation.client.avatar ? (
                  <img 
                    src={conversation.client.avatar} 
                    alt={conversation.client.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white transition-colors">{conversation.client.initials}</span>
                )}
              </div>
              <div className="text-left">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 transition-colors">{conversation.client.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 transition-colors">{conversation.lastMessage}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {conversation.priority === 'high' && (
                <Star className="w-4 h-4 text-amber-400 dark:text-amber-300 transition-colors" />
              )}
              {conversation.needsAttention && (
                <AlertTriangle className="w-4 h-4 text-amber-500 dark:text-amber-400 transition-colors" />
              )}
              {conversation.initiatedByAI && (
                <User className="w-4 h-4 text-blue-500 dark:text-blue-400 transition-colors" title="Initiated by AI" />
              )}
              {conversation.isAIConversation && (
                <Bot className="w-4 h-4 text-green-500 dark:text-green-400 transition-colors" title="AI-to-AI Conversation" />
              )}
              
              {/* Badge for webhook conversations */}
              {typeof conversation.id === 'string' && conversation.id.startsWith('session-') && (
                <span className="text-xs px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 rounded-full transition-colors">
                  Live
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 transition-colors">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full transition-colors ${
                conversation.status === 'active' ? 'bg-green-500 dark:bg-green-400' : 'bg-gray-400 dark:bg-gray-500'
              }`}></span>
              <span className="transition-colors">{conversation.agent}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400 transition-colors" />
              <span className="transition-colors">{conversation.lastActivity}</span>
            </div>
          </div>
        </motion.button>
      ))}

      {conversations.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400 transition-colors">
          No available discussions
        </div>
      )}
    </div>
  );
}
