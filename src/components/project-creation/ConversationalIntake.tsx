import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, ArrowLeft, Check } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useProjectCreation } from '../../context/ProjectCreationContext';
import { generateProjectFromIntake } from '../../services/aiService';
import { IntakeData } from '../../types/project-creation';

// ─── Step definitions ────────────────────────────────────────────────────────

interface StepChip {
  label: string;
  value: string;
}

interface IntakeStep {
  key: string;
  question: string;
  subtext?: string;
  inputType: 'text' | 'chips' | 'multiChips';
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
    question: "What is the **goal** of this project? What problem does it solve?",
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

function renderMarkdown(text: string) {
  // Bold **text**
  return text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ConversationalIntake() {
  const { state, dispatch } = useProjectCreation();

  // Local chip-selection state per step (cleared when step advances)
  const [selectedChip, setSelectedChip] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const didInitRef = useRef(false);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.intakeMessages, state.isAssistantTyping]);

  // Ask first question on mount if no messages yet — guarded against Strict Mode double-fire
  useEffect(() => {
    if (state.intakeMessages.length === 0 && !didInitRef.current) {
      didInitRef.current = true;
      askQuestion(0);
    }
  }, []);

  // ── Ask a specific step's question ────────────────────────────────────────
  function askQuestion(stepIndex: number) {
    if (stepIndex >= TOTAL_STEPS) return;

    dispatch({ type: 'SET_ASSISTANT_TYPING', payload: true });

    // Simulate a short typing delay
    setTimeout(() => {
      dispatch({ type: 'SET_ASSISTANT_TYPING', payload: false });
      dispatch({
        type: 'ADD_INTAKE_MESSAGE',
        payload: {
          id: uuidv4(),
          content: INTAKE_STEPS[stepIndex].question,
          sender: 'assistant',
          timestamp: new Date(),
          // attach chips metadata via step index so the bubble can render them
          stepIndex,
        },
      });
    }, 600 + Math.random() * 400);
  }

  // ── Submit an answer (text or chip) ───────────────────────────────────────
  function submitAnswer(value: string) {
    const step = INTAKE_STEPS[state.intakeStep];
    if (!value.trim()) return;

    // Add user bubble
    dispatch({
      type: 'ADD_INTAKE_MESSAGE',
      payload: { id: uuidv4(), content: value, sender: 'user', timestamp: new Date() },
    });

    // Persist value
    dispatch({ type: 'SET_INTAKE_DATA', payload: { key: step.key, value } });
    dispatch({ type: 'INCREMENT_INTAKE_STEP' });

    // Reset local state
    setInputValue('');
    setSelectedChip(null);

    const nextStep = state.intakeStep + 1;

    if (nextStep < TOTAL_STEPS) {
      askQuestion(nextStep);
    } else {
      // All questions answered
      dispatch({ type: 'SET_ASSISTANT_TYPING', payload: true });
      setTimeout(() => {
        dispatch({ type: 'SET_ASSISTANT_TYPING', payload: false });
        dispatch({
          type: 'ADD_INTAKE_MESSAGE',
          payload: {
            id: uuidv4(),
            content:
              "**Perfect!** I have everything I need. I'm now configuring your project — setting up the delivery track, assigning AI agents, and building your phase pipeline. Click **Start Project** when you're ready!",
            sender: 'assistant',
            timestamp: new Date(),
          },
        });
      }, 900);
    }
  }

  // Text input handlers
  function handleSend() {
    submitAnswer(inputValue);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  // Chip handler
  function handleChipClick(chip: StepChip) {
    setSelectedChip(chip.value);
    // Auto-submit chips immediately (single select)
    setTimeout(() => submitAnswer(chip.value), 120);
  }

  // Start project
  async function handleStartProject() {
    dispatch({ type: 'SET_VIEW', payload: 'initializing' });

    const intake: IntakeData = {
      projectName: (state.intakeData.projectName as string) || 'Untitled Project',
      goal: (state.intakeData.goal as string) || '',
      projectType: (state.intakeData.projectType as string) || '',
      targetAudience: (state.intakeData.targetAudience as string) || '',
      deliverables: (state.intakeData.deliverables as string) || '',
      timeline: (state.intakeData.timeline as string) || '',
      teamSize: (state.intakeData.teamSize as string) || '',
      budget: (state.intakeData.budget as string) || '',
      constraints: (state.intakeData.constraints as string) || '',
    };

    const project = await generateProjectFromIntake(intake);
    dispatch({ type: 'SET_PROJECT', payload: project });
    dispatch({ type: 'ADD_PROJECT', payload: project });
    dispatch({ type: 'SET_VIEW', payload: 'workspace' });
  }

  const currentStep = INTAKE_STEPS[state.intakeStep];
  const isComplete = state.intakeStep >= TOTAL_STEPS;
  const isChipStep = currentStep?.inputType === 'chips';
  const progress = Math.min(state.intakeStep, TOTAL_STEPS) / TOTAL_STEPS;

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'list' })}
          className="flex items-center gap-2 text-muted-foreground dark:text-muted-foreground hover:text-on-surface dark:hover:text-on-surface-variant transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground dark:text-muted-foreground">
            {Math.min(state.intakeStep, TOTAL_STEPS)} / {TOTAL_STEPS}
          </span>
          <div className="w-32 h-1.5 bg-surface-container dark:bg-surface-container-highest rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-green-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Messages thread */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-4">
        <AnimatePresence initial={false}>
          {state.intakeMessages.map((msg) => {
            const isAssistant = msg.sender === 'assistant';
            // Which step config belongs to this message (if assistant)
            const msgStepIndex = msg.stepIndex;
            const msgStep = msgStepIndex !== undefined ? INTAKE_STEPS[msgStepIndex] : undefined;
            // Chips should only show on the LAST assistant message + current step hasn't been answered yet
            const isLastAssistantMsg =
              isAssistant &&
              state.intakeMessages[state.intakeMessages.length - 1]?.id === msg.id;
            const showChips =
              isLastAssistantMsg &&
              msgStep?.inputType === 'chips' &&
              !isComplete &&
              state.intakeStep === msgStepIndex;

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28 }}
                className={`flex ${isAssistant ? 'justify-start' : 'justify-end'}`}
              >
                <div className="max-w-[82%] space-y-2">
                  {/* Bubble */}
                  <div
                    className={`rounded-2xl px-5 py-3 ${
                      isAssistant
                        ? 'bg-white dark:bg-surface-container-high border border-border dark:border-border text-on-surface dark:text-on-surface-variant'
                        : 'bg-primary dark:bg-green-600 text-white'
                    }`}
                  >
                    {isAssistant && (
                      <div className="flex items-center gap-1.5 mb-1">
                        <Sparkles className="w-3 h-3 text-indigo-500 dark:text-green-400" />
                        <span className="text-[10px] font-semibold text-indigo-500 dark:text-green-400 uppercase tracking-wide">
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

                  {/* Chip options below last assistant message */}
                  {showChips && msgStep?.chips && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="flex flex-wrap gap-2 pt-1 pl-1"
                    >
                      {msgStep.chips.map((chip) => (
                        <button
                          key={chip.value}
                          onClick={() => handleChipClick(chip)}
                          disabled={!!selectedChip}
                          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                            selectedChip === chip.value
                              ? 'bg-primary dark:bg-green-600 border-indigo-600 dark:border-green-600 text-white shadow-md'
                              : 'bg-white dark:bg-surface-container-high border-border dark:border-border text-on-surface dark:text-muted-foreground hover:border-indigo-400 dark:hover:border-green-500 hover:text-primary-green dark:hover:text-green-400'
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

        {/* Typing indicator */}
        {state.isAssistantTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-white dark:bg-surface-container-high border border-border dark:border-border rounded-2xl px-5 py-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-indigo-500 dark:text-green-400" />
                <div className="flex gap-1">
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <motion.span
                      key={i}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay }}
                      className="w-2 h-2 bg-outline-variant dark:bg-outline rounded-full"
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-border dark:border-border pt-4 mt-2">
        {isComplete ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <button
              onClick={handleStartProject}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-green-500 text-white font-semibold hover:opacity-90 transition-all shadow-lg shadow-indigo-500/20 text-sm"
            >
              🚀 Start Project
            </button>
          </motion.div>
        ) : isChipStep ? (
          // Chip-only step: hide text input, hint user to pick above
          <p className="text-center text-xs text-outline dark:text-muted-foreground">
            Select an option above to continue
          </p>
        ) : (
          <div className="flex items-center gap-3">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={currentStep?.placeholder || 'Type your answer…'}
              disabled={state.isAssistantTyping || isComplete}
              className="flex-1 px-4 py-3 rounded-xl border border-border dark:border-border bg-white dark:bg-surface-container-high text-foreground dark:text-foreground placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-ring dark:focus:ring-ring disabled:opacity-50 transition-all text-sm"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || state.isAssistantTyping}
              className="p-3 rounded-xl bg-primary dark:bg-green-600 text-white hover:bg-indigo-700 dark:hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Send"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
