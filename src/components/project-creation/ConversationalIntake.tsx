import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, ArrowLeft } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useProjectCreation } from '../../context/ProjectCreationContext';
import { getNextIntakeQuestion, generateProjectFromIntake } from '../../services/aiService';
import { IntakeData } from '../../types/project-creation';

const TOTAL_QUESTIONS = 7;

export default function ConversationalIntake() {
  const { state, dispatch } = useProjectCreation();
  const [inputValue, setInputValue] = useState('');
  const [canStart, setCanStart] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.intakeMessages, state.isAssistantTyping]);

  useEffect(() => {
    if (state.intakeMessages.length === 0) {
      askNextQuestion();
    }
  }, []);

  useEffect(() => {
    setCanStart(state.intakeStep >= 5);
  }, [state.intakeStep]);

  async function askNextQuestion() {
    dispatch({ type: 'SET_ASSISTANT_TYPING', payload: true });

    const result = await getNextIntakeQuestion(state.intakeStep);

    dispatch({ type: 'SET_ASSISTANT_TYPING', payload: false });

    if (result) {
      dispatch({
        type: 'ADD_INTAKE_MESSAGE',
        payload: { id: uuidv4(), content: result.question, sender: 'assistant', timestamp: new Date() },
      });
    }
  }

  async function handleSend() {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    dispatch({
      type: 'ADD_INTAKE_MESSAGE',
      payload: { id: uuidv4(), content: trimmed, sender: 'user', timestamp: new Date() },
    });

    const keys = ['projectName', 'goal', 'targetAudience', 'deliverables', 'timeline', 'teamSize', 'budget'];
    const currentKey = keys[state.intakeStep] || 'constraints';
    dispatch({ type: 'SET_INTAKE_DATA', payload: { key: currentKey, value: trimmed } });
    dispatch({ type: 'INCREMENT_INTAKE_STEP' });

    setInputValue('');

    if (state.intakeStep + 1 < TOTAL_QUESTIONS) {
      setTimeout(() => askNextQuestion(), 300);
    } else {
      dispatch({ type: 'SET_ASSISTANT_TYPING', payload: true });
      await new Promise((r) => setTimeout(r, 1000));
      dispatch({ type: 'SET_ASSISTANT_TYPING', payload: false });
      dispatch({
        type: 'ADD_INTAKE_MESSAGE',
        payload: {
          id: uuidv4(),
          content: "Excellent! I have all the information I need. I'll now configure your project with the optimal delivery track, assign specialized AI agents, and set up your phase pipeline. Click **Start Project** when you're ready!",
          sender: 'assistant',
          timestamp: new Date(),
        },
      });
      setCanStart(true);
    }
  }

  async function handleStartProject() {
    dispatch({ type: 'SET_VIEW', payload: 'initializing' });

    const intake: IntakeData = {
      projectName: (state.intakeData.projectName as string) || 'Untitled Project',
      goal: (state.intakeData.goal as string) || '',
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

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'list' })}
          className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </button>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {Math.min(state.intakeStep, TOTAL_QUESTIONS)} of ~{TOTAL_QUESTIONS} questions
          </div>
          <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-teal-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(Math.min(state.intakeStep, TOTAL_QUESTIONS) / TOTAL_QUESTIONS) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4">
        <AnimatePresence>
          {state.intakeMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200'
                }`}
              >
                {msg.sender === 'assistant' && (
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-xs font-medium text-blue-500">Project Architect</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {state.isAssistantTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <div className="flex gap-1">
                  <motion.span
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
                    className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                  />
                  <motion.span
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                  />
                  <motion.span
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                    className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
        <div className="flex items-center gap-3">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={state.intakeStep >= TOTAL_QUESTIONS ? "Intake complete!" : "Type your answer..."}
            disabled={state.isAssistantTyping || state.intakeStep >= TOTAL_QUESTIONS}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-teal-500 disabled:opacity-50 transition-all"
          />
          {state.intakeStep < TOTAL_QUESTIONS ? (
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || state.isAssistantTyping}
              className="p-3 rounded-xl bg-blue-600 dark:bg-teal-600 text-white hover:bg-blue-700 dark:hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          ) : (
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={handleStartProject}
              disabled={!canStart}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold hover:from-blue-700 hover:to-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20"
            >
              Start Project
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
