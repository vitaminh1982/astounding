import React, { useRef, useEffect } from 'react';
import { Bot, User, Send, Search, Mic, Maximize2, Minimize2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatInterfaceProps } from '../types';

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  conversationHistory,
  isLoading,
  promptInput,
  setPromptInput,
  handleSendPrompt,
  handleKeyDown,
  isModal,
  setIsChatMaximized
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationHistory, isLoading]);

  return (
    <>
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">AI Assistant</h3>
            <p className="text-sm text-gray-600 font-medium">Multi-Agent Orchestration</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isModal ? (
            <button
              onClick={() => setIsChatMaximized(true)}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Maximize chat"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setIsChatMaximized(false)}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className={`overflow-y-auto p-6 bg-gray-50 ${isModal ? 'flex-1' : 'h-96'}`}>
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
                  className={`flex items-start max-w-[85%] p-4 rounded-xl shadow-sm ${
                    message.type === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  {message.type === 'ai' && (
                    <Bot className="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0 mt-0.5" />
                  )}
                  {message.type === 'user' && (
                    <User className="w-5 h-5 text-indigo-100 mr-3 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="text-sm">
                    {message.type === 'user' && (
                      <p className="text-white font-medium">{message.text}</p>
                    )}
                    {message.type === 'ai' && message.content && (
                      <>
                        {message.content.reasoningSteps && message.content.reasoningSteps.length > 0 && (
                          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="font-bold text-blue-900 mb-2 flex items-center gap-2 text-sm">
                              <Bot className="w-4 h-4" />
                              Reasoning Process:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                              {message.content.reasoningSteps.map((step, i) => (
                                <li key={i} className="font-medium">{step}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {message.content.agentCalls && message.content.agentCalls.length > 0 && (
                          <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                            <p className="font-bold text-green-900 mb-2 flex items-center gap-2 text-sm">
                              <Bot className="w-4 h-4" />
                              Agent Interactions:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-sm text-green-800">
                              {message.content.agentCalls.map((call, i) => (
                                <li key={i}>
                                  <span className="font-bold text-green-700">{call.agentName}:</span>{' '}
                                  <span className="font-medium">{call.purpose}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <div className="text-sm text-gray-800 leading-relaxed font-medium">
                          {message.content.finalResponse}
                        </div>
                      </>
                    )}
                    <div className={`text-xs mt-2 font-medium ${
                      message.type === 'user' ? 'text-indigo-200' : 'text-gray-500'
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
              <div className="flex items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <Bot className="w-5 h-5 text-indigo-600 mr-3" />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-800 font-medium">Processing</span>
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <div 
                        key={i}
                        className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"
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
      </div>

      {/* Chat Input */}
      <div className="p-6 bg-white border-t border-gray-200">
        <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200">
          <Search className="w-5 h-5 text-gray-500 flex-shrink-0" />
          <textarea
            className="flex-1 resize-none bg-transparent py-2 focus:outline-none text-gray-900 placeholder-gray-600 text-sm font-medium"
            rows={1}
            placeholder="Ask about agents, workflows, system status, or request assistance..."
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            style={{ minHeight: '40px', maxHeight: '120px' }}
          />
          <div className="flex items-center gap-2">
            <button 
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              disabled={isLoading}
              aria-label="Voice input"
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              onClick={handleSendPrompt}
              disabled={!promptInput.trim() || isLoading}
              className={`p-2 rounded-lg transition-colors ${
                promptInput.trim() && !isLoading
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(ChatInterface);