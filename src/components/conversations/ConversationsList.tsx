// components/conversations/ConversationsList.tsx
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
        <div className="flex items-center justify-center py-2 mb-4 bg-indigo-50 rounded-lg">
          <Loader className="w-4 h-4 text-indigo-500 animate-spin mr-2" />
          <span className="text-sm text-indigo-600">Loading active conversations...</span>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm">
          <p className="font-medium mb-1">Error loading active conversations</p>
          <p>{error}</p>
        </div>
      )}

      {conversations.map((conversation) => (
        <motion.button
          key={conversation.id}
          onClick={() => onSelect(conversation)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className={`
            relative w-full p-4 rounded-lg border transition-all duration-200
            ${selectedId === conversation.id 
              ? 'bg-indigo-50 border-indigo-200' 
              : 'bg-white border-gray-200 hover:border-indigo-200'
            }
          `}
        >
          {conversation.needsAttention && (
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            </span>
          )}

          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-3">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-white font-medium
                ${conversation.client.avatar ? '' : 'bg-gradient-to-br from-indigo-500 to-purple-500'}
              `}>
                {conversation.client.avatar ? (
                  <img 
                    src={conversation.client.avatar} 
                    alt={conversation.client.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : conversation.client.initials}
              </div>
              <div className="text-left">
                <h3 className="font-medium text-gray-900">{conversation.client.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-1">{conversation.lastMessage}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {conversation.priority === 'high' && (
                <Star className="w-4 h-4 text-amber-400" />
              )}
              {conversation.needsAttention && (
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              )}
              {conversation.initiatedByAI && (
                <User className="w-4 h-4 text-blue-500" title="Initiated by AI" />
              )}
              {conversation.isAIConversation && (
                <Bot className="w-4 h-4 text-green-500" title="AI-to-AI Conversation" />
              )}
              
              {/* Badge for webhook conversations */}
              {typeof conversation.id === 'string' && conversation.id.startsWith('session-') && (
                <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-800 rounded-full">
                  Live
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${
                conversation.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
              }`}></span>
              {conversation.agent}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {conversation.lastActivity}
            </div>
          </div>
        </motion.button>
      ))}

      {conversations.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          No available discussions
        </div>
      )}
    </div>
  );
}
