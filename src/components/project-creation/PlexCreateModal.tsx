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
  Check,
} from 'lucide-react';

interface PlexCreateModalProps {
  onClose: () => void;
  /** Fired once, when the user sends the first prompt and the chat begins. */
  onIntakeStart?: () => void;
  /** Fired on every answer, with how many questions have been answered so far. */
  onIntakeStep?: (step: number, totalSteps: number) => void;
  /** Fired when the user clicks "Start Project" after all questions are answered. */
  onComplete: (data: Record<string, string>) => void;
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

interface StepChip {
  label: string;
  value: string;
}

interface IntakeStep {
  key: string;
  question: string;
  subtext?: string;
  inputType: 'text' | 'chips';
  chips?: StepChip[];
  placeholder?: string;
}

const INTAKE_STEPS: IntakeStep[] = [
  {
    key: 'projectName',
    question: "Let's kick things off — what's the **name** of your project?",
    subtext: 'A clear, memorable name helps everyone stay aligned.',
    inputType: 'text',
    placeholder: 'e.g. Q4 Product Launch, Brand Redesign…',
  },
  {
    key: 'goal',
    question: 'What is the **goal** of this project? What problem does it solve?',
    subtext: 'Describe the outcome you want to achieve and why it matters.',
    inputType: 'text',
    placeholder: 'e.g. Increase user retention by 30% through a redesigned onboarding flow…',
  },
  {
    key: 'projectType',
    question: 'What **type of project** is this?',
    subtext: 'Pick the category that best describes the work.',
    inputType: 'chips',
    chips: [
      { label: 'Software / App', value: 'Software / App' },
      { label: 'Marketing Campaign', value: 'Marketing Campaign' },
      { label: 'Design / Creative', value: 'Design / Creative' },
      { label: 'Research / Analysis', value: 'Research / Analysis' },
      { label: 'Operations / Process', value: 'Operations / Process' },
      { label: 'Other', value: 'Other' },
    ],
  },
  {
    key: 'deliverables',
    question: 'What are the **key deliverables** for this project?',
    subtext: 'List the main outputs — what does "done" look like?',
    inputType: 'text',
    placeholder: 'e.g. MVP app, pitch deck, 3 research reports…',
  },
  {
    key: 'timeline',
    question: "What's the **target timeline or deadline**?",
    subtext: 'Include any hard dates or milestones if you have them.',
    inputType: 'text',
    placeholder: 'e.g. End of Q3, within 6 weeks, by September 15…',
  },
  {
    key: 'teamSize',
    question: 'How large is the **team** working on this?',
    inputType: 'chips',
    chips: [
      { label: 'Just me (1)', value: 'Just me (1)' },
      { label: '2–3 people', value: '2–3 people' },
      { label: '4–7 people', value: '4–7 people' },
      { label: '8–15 people', value: '8–15 people' },
      { label: '15+ people', value: '15+ people' },
    ],
  },
  {
    key: 'targetAudience',
    question: 'Who is the **target audience or end user** for this project?',
    subtext: 'Who will benefit most from it?',
    inputType: 'text',
    placeholder: 'e.g. B2B SaaS companies, internal ops teams, Gen Z consumers…',
  },
];

const TOTAL_STEPS = INTAKE_STEPS.length;

function renderMarkdown(text: string) {
  return text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

interface ChatMessage {
  id: string;
  content: string;
  sender: 'assistant' | 'user';
  stepIndex?: number;
}

export default function PlexCreateModal({ onClose, onIntakeStart, onIntakeStep, onComplete }: PlexCreateModalProps) {
  const { activeWorkspace } = useWorkspace();
  const [mode, setMode] = useState<'prompt' | 'chat'>('prompt');
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [step, setStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [answerValue, setAnswerValue] = useState('');
  const [selectedChip, setSelectedChip] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const answerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Always bring focus back to the answer field — after a question appears,
  // after a chip is picked, or whenever the user clicks anywhere else in the modal.
  useEffect(() => {
    if (mode === 'chat' && !isTyping) {
      answerInputRef.current?.focus();
    }
  }, [mode, isTyping, step]);

  const handlePillClick = (prompt: string) => {
    setInput(prompt);
    textareaRef.current?.focus();
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

  const askQuestion = (stepIndex: number) => {
    if (stepIndex >= TOTAL_STEPS) return;
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: `q-${stepIndex}`, content: INTAKE_STEPS[stepIndex].question, sender: 'assistant', stepIndex },
      ]);
    }, 500 + Math.random() * 350);
  };

  const handleSubmit = () => {
    if (!input.trim()) return;
    setMode('chat');
    onIntakeStart?.();
    onIntakeStep?.(0, TOTAL_STEPS);
    askQuestion(0);
  };

  const submitAnswer = (value: string) => {
    if (!value.trim()) return;
    const current = INTAKE_STEPS[step];

    setMessages((prev) => [...prev, { id: `a-${step}`, content: value, sender: 'user' }]);
    setAnswers((prev) => ({ ...prev, [current.key]: value }));
    setAnswerValue('');
    setSelectedChip(null);

    const nextStep = step + 1;
    setStep(nextStep);
    onIntakeStep?.(nextStep, TOTAL_STEPS);

    if (nextStep < TOTAL_STEPS) {
      askQuestion(nextStep);
    } else {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: 'complete',
            content:
              "**Perfect!** I have everything I need. I'm now configuring your project — setting up the delivery track, assigning AI agents, and building your phase pipeline. Click **Start Project** when you're ready!",
            sender: 'assistant',
          },
        ]);
      }, 700);
    }
  };

  const handleChipClick = (chip: StepChip) => {
    setSelectedChip(chip.value);
    setTimeout(() => submitAnswer(chip.value), 120);
  };

  const currentStep = INTAKE_STEPS[step];
  const isComplete = step >= TOTAL_STEPS;
  const isChipStep = currentStep?.inputType === 'chips';

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
          className="w-full max-w-2xl bg-white dark:bg-background rounded-2xl shadow-2xl dark:shadow-black/60 border border-border dark:border-border overflow-hidden flex flex-col"
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

          {mode === 'prompt' ? (
            <div className="px-6 py-5 bg-gray-50 dark:bg-surface-container-low">
              <div className="bg-white dark:bg-surface-container-high rounded-xl shadow-md dark:focus-within:ring-green-500/50 transition-all">
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
                    className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all ${input.trim()
                        ? 'bg-primary dark:bg-green-600 text-white hover:bg-green-700 dark:hover:bg-green-700 shadow-sm'
                        : 'bg-surface-container dark:bg-surface-container-highest text-outline cursor-not-allowed'
                      }`}
                    aria-label="Send"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {PROJECT_PILLS.map((pill) => {
                  const Icon = pill.icon;
                  return (
                    <button
                      key={pill.id}
                      onClick={() => handlePillClick(pill.prompt)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border dark:border-border bg-white dark:bg-surface-container-high text-muted-foreground dark:text-muted-foreground text-xs font-medium hover:border-green-400 dark:hover:border-green-500 hover:text-primary-green dark:hover:text-green-400 hover:bg-green-50/50 dark:hover:bg-green-950/20 transition-all shadow-sm"
                    >
                      <Icon size={13} className="flex-shrink-0" />
                      {pill.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex flex-col max-h-[70vh] bg-gray-50 dark:bg-surface-container-low">
              {/* Progress */}
              <div className="px-6 pt-4 flex items-center gap-3">
                <span className="text-[10px] text-outline dark:text-muted-foreground whitespace-nowrap">
                  {Math.min(step, TOTAL_STEPS)} / {TOTAL_STEPS}
                </span>
                <div className="flex-1 h-1 bg-surface-container dark:bg-surface-container-highest rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-green-500 rounded-full"
                    animate={{ width: `${(Math.min(step, TOTAL_STEPS) / TOTAL_STEPS) * 100}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>

              {/* Messages */}
              <div
                className="flex-1 overflow-y-auto px-6 py-4 space-y-3 min-h-[220px]"
                onClick={() => answerInputRef.current?.focus()}
              >
                <AnimatePresence initial={false}>
                  {messages.map((msg, index) => {
                    const isAssistant = msg.sender === 'assistant';
                    const msgStep = msg.stepIndex !== undefined ? INTAKE_STEPS[msg.stepIndex] : undefined;
                    const isLastAssistantMsg =
                      isAssistant && messages[messages.length - 1]?.id === msg.id;
                    const isFirstAssistantMsg =
                      isAssistant && messages.findIndex((m) => m.sender === 'assistant') === index;
                    const showChips =
                      isLastAssistantMsg && msgStep?.inputType === 'chips' && !isComplete && step === msg.stepIndex;

                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        className={`flex ${isAssistant ? 'justify-start' : 'justify-end'}`}
                      >
                        <div className="max-w-[85%] space-y-2">
                          <div
                            className={
                              isAssistant
                                ? 'text-on-surface dark:text-on-surface-variant'
                                : 'rounded-2xl px-4 py-2.5 bg-white dark:bg-surface-container-high text-foreground dark:text-foreground shadow-md'
                            }
                          >
                            {isFirstAssistantMsg && (
                              <div className="flex items-center gap-1.5 mb-1">
                                <Sparkles className="w-3 h-3 text-green-500 dark:text-green-400" />
                                <span className="text-sm text-outline dark:text-muted-foreground">
                                  Plex
                                </span>
                              </div>
                            )}
                            <p
                              className="text-sm leading-relaxed"
                              dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                            />
                            {isAssistant && msgStep?.subtext && isLastAssistantMsg && (
                              <p className="text-xs text-outline dark:text-muted-foreground mt-1">{msgStep.subtext}</p>
                            )}
                          </div>

                          {showChips && msgStep?.chips && (
                            <motion.div
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 }}
                              className="flex flex-wrap gap-2 pt-0.5"
                            >
                              {msgStep.chips.map((chip) => (
                                <button
                                  key={chip.value}
                                  onClick={() => handleChipClick(chip)}
                                  disabled={!!selectedChip}
                                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${selectedChip === chip.value
                                      ? 'bg-primary dark:bg-green-600 border-green-600 dark:border-green-600 text-white shadow-md'
                                      : 'bg-white dark:bg-surface-container-high border-border dark:border-border text-on-surface dark:text-muted-foreground hover:border-green-400 dark:hover:border-green-500 hover:text-primary-green dark:hover:text-green-400'
                                    } disabled:pointer-events-none`}
                                >
                                  {selectedChip === chip.value && <Check size={11} />}
                                  {chip.label}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {isTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="flex items-center gap-1 px-0.5 py-2.5">
                      {[0, 0.2, 0.4].map((delay, i) => (
                        <motion.span
                          key={i}
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.2, repeat: Infinity, delay }}
                          className="w-1.5 h-1.5 bg-outline-variant dark:bg-outline rounded-full"
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input row */}
              <div className="px-6 py-4">
                {isComplete ? (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center">
                    <button
                      onClick={() => onComplete(answers)}
                      className="cta-btn px-8 py-2.5 text-sm"
                    >
                      🚀 Start Project
                    </button>
                  </motion.div>
                ) : isChipStep ? (
                  <p className="text-center text-xs text-outline dark:text-muted-foreground">
                    Select an option above to continue
                  </p>
                ) : (
                  <div className="flex items-center gap-2 rounded-xl bg-white dark:bg-surface-container-high shadow-md px-3 py-1.5">
                    <input
                      ref={answerInputRef}
                      type="text"
                      value={answerValue}
                      onChange={(e) => setAnswerValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          submitAnswer(answerValue);
                        }
                      }}
                      placeholder={currentStep?.placeholder || 'Type your answer…'}
                      disabled={isTyping || isComplete}
                      autoFocus
                      className="flex-1 bg-transparent py-1.5 text-foreground dark:text-foreground placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none disabled:opacity-50 transition-all text-sm"
                    />
                    <button
                      onClick={() => submitAnswer(answerValue)}
                      disabled={!answerValue.trim() || isTyping}
                      className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary dark:bg-green-600 text-white hover:bg-green-700 dark:hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                      aria-label="Send"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
