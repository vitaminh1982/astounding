import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, Loader } from 'lucide-react';
import { Message } from '../types';

interface MessageListProps {
  conversationHistory: Message[];
  isLoading: boolean;
}

/**
 * MessageList Component
 * Displays the conversation history with proper scrolling and animations
 */
const MessageList: React.FC<MessageListProps> = ({
  conversationHistory,
  isLoading
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const previousMessageCount = useRef(conversationHistory.length);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Skip scroll on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      previousMessageCount.current = conversationHistory.length;
      return;
    }

    // Only scroll if message count increased or isLoading changed
    const messageCountIncreased = conversationHistory.length > previousMessageCount.current;
    
    if ((messageCountIncreased || isLoading) && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    
    previousMessageCount.current = conversationHistory.length;
  }, [conversationHistory, isLoading]);

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {conversationHistory.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex items-start max-w-[85%] p-4 rounded-xl shadow-sm dark:shadow-gray-900 transition-colors ${
                message.type === 'user'
                  ? 'bg-teal-600 dark:bg-teal-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600'
              }`}
            >
              {message.type === 'ai' && (
                <Bot className="w-5 h-5 text-teal-600 dark:text-teal-400 mr-3 flex-shrink-0 mt-0.5" />
              )}
              {message.type === 'user' && (
                <User className="w-5 h-5 text-teal-100 dark:text-teal-200 mr-3 flex-shrink-0 mt-0.5" />
              )}
              <div className="text-sm">
                {message.type === 'user' && (
                  <p className="text-white font-medium">{message.text}</p>
                )}
                {message.type === 'ai' && message.content && (
                  <>
                    {message.content.reasoningSteps && message.content.reasoningSteps.length > 0 && (
                      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-600 transition-colors">
                        <p className="font-bold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2 text-sm transition-colors">
                          <Bot className="w-4 h-4" />
                          Reasoning Process:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-blue-800 dark:text-blue-300 transition-colors">
                          {message.content.reasoningSteps.map((step, i) => (
                            <li key={i} className="font-medium">{step}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {message.content.agentCalls && message.content.agentCalls.length > 0 && (
                      <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-600 transition-colors">
                        <p className="font-bold text-green-900 dark:text-green-300 mb-2 flex items-center gap-2 text-sm transition-colors">
                          <Bot className="w-4 h-4" />
                          Agent Interactions:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-green-800 dark:text-green-300 transition-colors">
                          {message.content.agentCalls.map((call, i) => (
                            <li key={i}>
                              <span className="font-bold text-green-700 dark:text-green-300 transition-colors">{call.agentName}:</span>{' '}
                              <span className="font-medium">{call.purpose}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="text-sm text-gray-800 dark:text-gray-100 leading-relaxed font-medium transition-colors">
                      {message.content.finalResponse}
                    </div>
                  </>
                )}
                <div className={`text-xs mt-2 font-medium transition-colors ${
                  message.type === 'user' 
                    ? 'text-teal-200 dark:text-teal-300' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-start"
        >
          <div className="flex items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm dark:shadow-gray-900 border border-gray-200 dark:border-gray-600 transition-colors">
            <Bot className="w-5 h-5 text-teal-600 dark:text-teal-400 mr-3" />
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-800 dark:text-gray-100 font-medium transition-colors">Processing</span>
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div 
                    key={i}
                    className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default React.memo(MessageList);
