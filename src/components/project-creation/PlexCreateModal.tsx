import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Send,
  FolderPlus,
  FileText,
  BarChart,
  Presentation,
  Search,
  Layers,
  Lightbulb,
  BotMessageSquare,
} from 'lucide-react';

interface PlexCreateModalProps {
  onClose: () => void;
  onConfirm: (prompt: string) => void;
}

const PROJECT_PILLS = [
  {
    id: 'digital-transformation',
    icon: Layers,
    label: 'Digital transformation',
    prompt: 'Help me create a digital transformation project. I need to define scope, technology stack, change management plan, and key milestones.',
  },
  {
    id: 'product-launch',
    icon: FolderPlus,
    label: 'Product launch',
    prompt: 'Help me plan a product launch project. Define go-to-market strategy, launch timeline, team structure, and success metrics.',
  },
  {
    id: 'business-proposal',
    icon: FileText,
    label: 'Business proposal',
    prompt: 'Help me create a business proposal project. Define the client brief, deliverables, budget, and presentation structure.',
  },
  {
    id: 'market-research',
    icon: Search,
    label: 'Market research',
    prompt: 'Help me set up a market research project. Define research objectives, methodology, target segments, and reporting format.',
  },
  {
    id: 'reporting-dashboard',
    icon: BarChart,
    label: 'Reporting & analytics',
    prompt: 'Help me create a reporting and analytics project. Define KPIs, data sources, dashboard structure, and delivery cadence.',
  },
  {
    id: 'strategic-presentation',
    icon: Presentation,
    label: 'Strategic presentation',
    prompt: 'Help me build a strategic presentation project. Define the narrative, key messages, slide structure, and target audience.',
  },
  {
    id: 'innovation-sprint',
    icon: Lightbulb,
    label: 'Innovation sprint',
    prompt: 'Help me design an innovation sprint project. Define problem statement, sprint format, team roles, and expected outcomes.',
  },
];

export default function PlexCreateModal({ onClose, onConfirm }: PlexCreateModalProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Autofocus on mount
    textareaRef.current?.focus();
  }, []);

  const handlePillClick = (prompt: string) => {
    setInput(prompt);
    textareaRef.current?.focus();
    // auto-resize
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height =
          Math.min(textareaRef.current.scrollHeight, 160) + 'px';
      }
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!input.trim()) return;
    onConfirm(input.trim());
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl dark:shadow-black/60 border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-indigo-600 dark:bg-teal-600 flex items-center justify-center text-white">
                <BotMessageSquare size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Plex</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500">Create a new project with AI</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Prompt Area */}
          <div className="px-6 py-5">
            {/* Input box — same style as Plex */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 dark:focus-within:ring-teal-500/50 focus-within:border-indigo-400 dark:focus-within:border-teal-500 transition-all">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
                }}
                onKeyDown={handleKeyDown}
                placeholder="Describe the project you want to create..."
                rows={2}
                className="w-full resize-none bg-transparent px-4 pt-3.5 pb-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none leading-relaxed"
              />
              <div className="flex items-center justify-between px-3 pb-3 pt-1">
                <span className="text-[10px] text-gray-400 dark:text-gray-500">
                  Plex · Default
                </span>
                <button
                  onClick={handleSubmit}
                  disabled={!input.trim()}
                  className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all ${
                    input.trim()
                      ? 'bg-indigo-600 dark:bg-teal-600 text-white hover:bg-indigo-700 dark:hover:bg-teal-700 shadow-sm'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                  aria-label="Send"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>

            {/* Project-type suggestion pills */}
            <div className="mt-4 flex flex-wrap gap-2">
              {PROJECT_PILLS.map((pill) => {
                const Icon = pill.icon;
                return (
                  <button
                    key={pill.id}
                    onClick={() => handlePillClick(pill.prompt)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-medium hover:border-indigo-400 dark:hover:border-teal-500 hover:text-indigo-600 dark:hover:text-teal-400 hover:bg-indigo-50/50 dark:hover:bg-teal-950/20 transition-all shadow-sm"
                  >
                    <Icon size={13} className="flex-shrink-0" />
                    {pill.label}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
