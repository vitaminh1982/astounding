import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkspace } from '../../context/WorkspaceContext';
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
  Sparkles,
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
  const { activeWorkspace } = useWorkspace();
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
          id="PlexCreateModal"
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-2xl bg-white dark:bg-background rounded-2xl shadow-2xl dark:shadow-black/60 border border-border dark:border-border overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border dark:border-gray-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary dark:bg-green-600 flex items-center justify-center text-white">
                <Sparkles size={16} />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground dark:text-foreground">Create new project</h2>
                <p className="text-xs text-outline dark:text-muted-foreground">
                  {activeWorkspace?.name || 'Workspace'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-outline hover:bg-surface-container-low dark:hover:bg-surface-container-high hover:text-muted-foreground dark:hover:text-muted-foreground transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Prompt Area */}
          <div className="px-6 py-5">
            {/* Input box — same style as Plex */}
            <div className="bg-surface-container-low dark:bg-surface-container-high rounded-xl border border-border dark:border-border shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 dark:focus-within:ring-green-500/50 focus-within:border-indigo-400 dark:focus-within:border-green-500 transition-all">
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
                className="w-full resize-none bg-transparent px-4 pt-3.5 pb-2 text-sm text-foreground dark:text-foreground placeholder-gray-400 focus:outline-none leading-relaxed"
              />
              <div className="flex items-center justify-between px-3 pb-3 pt-1">
                <span className="text-[10px] text-outline dark:text-muted-foreground">
                  Plex · Default
                </span>
                <button
                  onClick={handleSubmit}
                  disabled={!input.trim()}
                  className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all ${
                    input.trim()
                      ? 'bg-primary dark:bg-green-600 text-white hover:bg-indigo-700 dark:hover:bg-green-700 shadow-sm'
                      : 'bg-surface-container dark:bg-surface-container-highest text-outline cursor-not-allowed'
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
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border dark:border-border bg-white dark:bg-surface-container-high text-muted-foreground dark:text-muted-foreground text-xs font-medium hover:border-indigo-400 dark:hover:border-green-500 hover:text-primary-green dark:hover:text-green-400 hover:bg-indigo-50/50 dark:hover:bg-green-950/20 transition-all shadow-sm"
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
