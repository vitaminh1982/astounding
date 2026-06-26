import { useRef, useEffect, useState, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, Transition } from '@headlessui/react';
import { Send, X, Bot, RotateCcw, Sparkles } from 'lucide-react';
import ChatMessage from './ChatMessage';
import AgentTypingIndicator from './AgentTypingIndicator';
import ProjectSummaryCard from './ProjectSummaryCard';
import { useProjectAgent } from './useProjectAgent';
import type { CollectedProjectData } from './useProjectAgent';

interface ProjectChatAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (data: CollectedProjectData) => void;
}

export default function ProjectChatAssistant({
  isOpen,
  onClose,
  onProjectCreated,
}: ProjectChatAssistantProps) {
  const [inputValue, setInputValue] = useState('');
  const [creationTriggered, setCreationTriggered] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    messages,
    isTyping,
    currentStep,
    collectedData,
    isSummaryReady,
    isConfirmed,
    sendMessage,
    reset,
  } = useProjectAgent();

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isSummaryReady]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Handle confirmed state
  useEffect(() => {
    if (isConfirmed && !creationTriggered) {
      setCreationTriggered(true);
      setTimeout(() => {
        onProjectCreated(collectedData);
        onClose();
      }, 900);
    }
  }, [isConfirmed, creationTriggered, collectedData, onProjectCreated, onClose]);

  function handleSend() {
    const text = inputValue.trim();
    if (!text || isTyping) return;
    setInputValue('');
    sendMessage(text);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleQuickReply(reply: string) {
    if (isTyping) return;
    sendMessage(reply);
  }

  function handleReset() {
    setCreationTriggered(false);
    setInputValue('');
    reset();
  }

  function handleRevise() {
    sendMessage('I want to revise some details');
  }

  function handleConfirm() {
    sendMessage('confirm');
  }

  const showSummaryCard = isSummaryReady && !isConfirmed;
  const inputPlaceholder =
    currentStep === 'summary'
      ? 'Confirm or tell me what to change...'
      : isTyping
      ? 'Agent is thinking...'
      : 'Type your answer...';

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-250"
              enterFrom="opacity-0 scale-95 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4"
            >
              <Dialog.Panel className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden" style={{ maxHeight: '85vh' }}>
                {/* Header */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-700 flex-shrink-0">
                  <div className="w-9 h-9 bg-indigo-500/20 border border-indigo-500/30 rounded-xl flex items-center justify-center">
                    <Sparkles size={16} className="text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <Dialog.Title className="text-sm font-semibold text-white">Project Setup Assistant</Dialog.Title>
                    <p className="text-xs text-slate-500">Conversational AI · No forms required</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handleReset}
                      title="Start over"
                      className="p-2 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <RotateCcw size={15} />
                    </button>
                    <button
                      onClick={onClose}
                      className="p-2 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <ProgressBar step={currentStep} />

                {/* Message list */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-0">
                  <AnimatePresence initial={false}>
                    {messages.map((msg) => {
                      const isLastAssistant =
                        msg.sender === 'assistant' &&
                        msg.id === [...messages].reverse().find((m) => m.sender === 'assistant')?.id;

                      return (
                        <ChatMessage
                          key={msg.id}
                          message={
                            isLastAssistant && msg.isQuickReplies
                              ? msg
                              : { ...msg, quickReplies: undefined, isQuickReplies: false }
                          }
                          onQuickReply={handleQuickReply}
                        />
                      );
                    })}
                  </AnimatePresence>

                  {/* Typing indicator */}
                  <AnimatePresence>
                    {isTyping && <AgentTypingIndicator key="typing" />}
                  </AnimatePresence>

                  {/* Summary card */}
                  <AnimatePresence>
                    {showSummaryCard && (
                      <motion.div
                        key="summary"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3, delay: 0.15 }}
                      >
                        <ProjectSummaryCard
                          data={collectedData}
                          onConfirm={handleConfirm}
                          onRevise={handleRevise}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Confirmed state */}
                  <AnimatePresence>
                    {isConfirmed && (
                      <motion.div
                        key="confirmed"
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center gap-3 py-6"
                      >
                        <div className="w-12 h-12 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center">
                          <Bot size={20} className="text-green-400" />
                        </div>
                        <p className="text-sm font-semibold text-white">Creating your project...</p>
                        <p className="text-xs text-slate-500">Setting up your workspace</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div ref={bottomRef} />
                </div>

                {/* Input bar */}
                <div className="px-5 py-4 border-t border-slate-700 flex-shrink-0">
                  <div className="flex gap-3 items-center">
                    <input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={inputPlaceholder}
                      disabled={isTyping || isConfirmed}
                      className="flex-1 bg-slate-800 border border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors disabled:opacity-50"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!inputValue.trim() || isTyping || isConfirmed}
                      className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl p-2.5 transition-all flex-shrink-0"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 text-center">
                    Press Enter to send · Type naturally · Say "change the timeline" to revise
                  </p>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

const STEP_WEIGHTS: Record<string, number> = {
  project_name: 1,
  goal: 2,
  project_type: 3,
  target_audience: 4,
  deliverables: 5,
  timeline: 6,
  team_size: 7,
  budget: 8,
  priority: 9,
  constraints: 9,
  summary: 10,
  confirmed: 10,
};

function ProgressBar({ step }: { step: string }) {
  const pct = Math.round(((STEP_WEIGHTS[step] ?? 1) / 10) * 100);
  return (
    <div className="h-0.5 bg-slate-800 flex-shrink-0">
      <motion.div
        className="h-full bg-indigo-500"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </div>
  );
}
