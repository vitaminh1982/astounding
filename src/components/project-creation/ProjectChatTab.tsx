import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { CreatedProject, IntakeChatMessage } from '../../types/project-creation';
import { getChatAssistantResponse } from '../../services/aiService';

interface Props {
  project: CreatedProject;
}

export default function ProjectChatTab({ project }: Props) {
  const [messages, setMessages] = useState<IntakeChatMessage[]>([
    {
      id: uuidv4(),
      content: `I'm your project assistant for "${project.name}". I have full context on your project: current phase, agent statuses, deliverables, and tasks. How can I help you today?`,
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showContext, setShowContext] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  async function handleSend() {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const userMsg: IntakeChatMessage = {
      id: uuidv4(),
      content: trimmed,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    const response = await getChatAssistantResponse(trimmed, project);

    setIsTyping(false);
    setMessages((prev) => [
      ...prev,
      { id: uuidv4(), content: response, sender: 'assistant', timestamp: new Date() },
    ]);
  }

  const currentPhase = project.phases[project.currentPhaseIndex];

  return (
    <div className="flex flex-col h-[calc(100vh-16rem)]">
      {/* Context Panel */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 mb-4">
        <button
          onClick={() => setShowContext(!showContext)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span className="font-medium text-gray-700 dark:text-gray-300">Assistant Context</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Phase: {currentPhase.name} | {project.agents.filter(a => a.status === 'working').length} agents working
            </span>
          </div>
          {showContext ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>

        <AnimatePresence>
          {showContext && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-gray-200 dark:border-gray-700"
            >
              <div className="px-4 py-3 grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Project</span>
                  <p className="font-medium text-gray-900 dark:text-gray-100 mt-0.5">{project.name}</p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Current Phase</span>
                  <p className="font-medium text-gray-900 dark:text-gray-100 mt-0.5">{currentPhase.name}</p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Delivery Track</span>
                  <p className="font-medium text-gray-900 dark:text-gray-100 mt-0.5">{project.deliveryTrackLabel}</p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Tasks (In Progress)</span>
                  <p className="font-medium text-gray-900 dark:text-gray-100 mt-0.5">
                    {project.tasks.filter(t => t.status === 'in-progress').length}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            >
              {msg.sender === 'assistant' && (
                <div className="flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3 h-3 text-blue-500" />
                  <span className="text-[10px] font-medium text-blue-500">Project Assistant</span>
                </div>
              )}
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              <p className={`text-[10px] mt-1 ${msg.sender === 'user' ? 'text-blue-200' : 'text-gray-400 dark:text-gray-500'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0 }} className="w-2 h-2 bg-gray-400 rounded-full" />
                <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }} className="w-2 h-2 bg-gray-400 rounded-full" />
                <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }} className="w-2 h-2 bg-gray-400 rounded-full" />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Ask about your project..."
            disabled={isTyping}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-teal-500 disabled:opacity-50 text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            className="p-3 rounded-xl bg-blue-600 dark:bg-teal-600 text-white hover:bg-blue-700 dark:hover:bg-teal-700 disabled:opacity-40 transition-colors"
            aria-label="Send"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
