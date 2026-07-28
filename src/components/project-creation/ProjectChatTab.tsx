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
      <div className="bg-white dark:bg-surface-container-high rounded-xl border border-border dark:border-border mb-4">
        <button
          onClick={() => setShowContext(!showContext)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-tertiary" />
            <span className="font-medium text-on-surface dark:text-muted-foreground">Assistant Context</span>
            <span className="text-xs text-muted-foreground dark:text-muted-foreground">
              Phase: {currentPhase.name} | {project.agents.filter(a => a.status === 'working').length} agents working
            </span>
          </div>
          {showContext ? <ChevronUp className="w-4 h-4 text-outline" /> : <ChevronDown className="w-4 h-4 text-outline" />}
        </button>

        <AnimatePresence>
          {showContext && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-border dark:border-border"
            >
              <div className="px-4 py-3 grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-muted-foreground dark:text-muted-foreground">Project</span>
                  <p className="font-medium text-foreground dark:text-foreground mt-0.5">{project.name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground dark:text-muted-foreground">Current Phase</span>
                  <p className="font-medium text-foreground dark:text-foreground mt-0.5">{currentPhase.name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground dark:text-muted-foreground">Delivery Track</span>
                  <p className="font-medium text-foreground dark:text-foreground mt-0.5">{project.deliveryTrackLabel}</p>
                </div>
                <div>
                  <span className="text-muted-foreground dark:text-muted-foreground">Tasks (In Progress)</span>
                  <p className="font-medium text-foreground dark:text-foreground mt-0.5">
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
                  ? 'bg-tertiary text-white'
                  : 'bg-white dark:bg-surface-container-high border border-border dark:border-border text-on-surface dark:text-on-surface-variant'
              }`}
            >
              {msg.sender === 'assistant' && (
                <div className="flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3 h-3 text-tertiary" />
                  <span className="text-[10px] font-medium text-tertiary">Project Assistant</span>
                </div>
              )}
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              <p className={`text-[10px] mt-1 ${msg.sender === 'user' ? 'text-blue-200' : 'text-outline dark:text-muted-foreground'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-white dark:bg-surface-container-high border border-border dark:border-border rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0 }} className="w-2 h-2 bg-outline-variant rounded-full" />
                <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }} className="w-2 h-2 bg-outline-variant rounded-full" />
                <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }} className="w-2 h-2 bg-outline-variant rounded-full" />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border dark:border-border pt-3 mt-3">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Ask about your project..."
            disabled={isTyping}
            className="flex-1 px-4 py-3 rounded-xl border border-border dark:border-border bg-white dark:bg-surface-container-high text-foreground dark:text-foreground placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-ring disabled:opacity-50 text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            className="p-3 rounded-xl bg-tertiary dark:bg-green-600 text-white hover:bg-blue-700 dark:hover:bg-green-700 disabled:opacity-40 transition-colors"
            aria-label="Send"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
