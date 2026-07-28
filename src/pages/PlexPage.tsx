import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  Paperclip,
  Plus,
  FolderPlus,
  FileText,
  BarChart,
  Search,
  Languages,
  BookOpen,
  ChevronLeft,
  Presentation,
  Sparkles,
} from 'lucide-react';
import { Chat } from '../types/plex';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const QUICK_ACTIONS = [
  { id: 'create-doc', icon: FileText, label: 'Create document', prompt: 'I want to create a new document in my workspace. Can you help me format it?' },
  { id: 'data-analysis', icon: BarChart, label: 'Analyze data', prompt: 'Here is some data. Please perform a statistical analysis and summarize key trends.' },
  { id: 'translation', icon: Languages, label: 'Translation', prompt: 'Translate content for me. Paste the text and specify the target language(s).' },
  { id: 'explore-docs', icon: BookOpen, label: 'Explore documents', prompt: 'Help me explore and analyze documents from my workspace knowledge base.' },
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 18) return 'Afternoon';
  return 'Evening';
}

export default function PlexPage({
  isSidebarExpanded = true,
  onToggleSidebar,
  chats,
  setChats,
  activeChatId,
  setActiveChatId,
}: {
  isSidebarExpanded?: boolean;
  onToggleSidebar?: () => void;
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
}) {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChat = chats.find(c => c.id === activeChatId) ?? null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages]);

  const handleQuickAction = (prompt: string) => {
    setInput(prompt);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.style.height = 'auto';
        inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 160) + 'px';
      }
    }, 0);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    let chatId = activeChatId;
    let updatedChats = [...chats];

    if (!chatId) {
      chatId = Date.now().toString();
      const newChat: Chat = {
        id: chatId,
        title: input.slice(0, 40) + (input.length > 40 ? '\u2026' : ''),
        preview: input.slice(0, 60),
        timestamp: new Date(),
        messages: [userMessage],
      };
      updatedChats = [newChat, ...chats];
      setActiveChatId(chatId);
      setShowSidebar(true);
    } else {
      updatedChats = updatedChats.map(c =>
        c.id === chatId ? { ...c, messages: [...c.messages, userMessage] } : c
      );
    }

    setChats(updatedChats);
    setInput('');
    if (inputRef.current) inputRef.current.style.height = 'auto';
    setIsTyping(true);

    const capturedChatId = chatId;
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I'm Plex, your Sendplex workspace assistant! I'm ready to help. This is a demo \u2014 in production I'll be powered by your workspace data and AI.",
        timestamp: new Date(),
      };
      setChats(prev =>
        prev.map(c =>
          c.id === capturedChatId ? { ...c, messages: [...c.messages, reply] } : c
        )
      );
      setIsTyping(false);
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startNewChat = () => {
    setActiveChatId(null);
    setInput('');
    if (inputRef.current) inputRef.current.style.height = 'auto';
  };

  return (
    <div className={`flex fixed top-[10px] bottom-[10px] right-[10px] transition-all duration-300 ease-in-out overflow-hidden z-30 rounded-2xl bg-transparent ${
      isSidebarExpanded ? 'left-[10px] lg:left-[276px]' : 'left-[10px] lg:left-[84px]'
    }`}>


      {/* Main */}
      <div className={`flex-grow flex flex-col min-w-0 transition-all duration-300 ${
        activeChat 
          ? 'shadow dark:shadow-gray-900 border border-border dark:border-border bg-white dark:bg-surface-container-high rounded-2xl' 
          : 'bg-transparent'
      }`}>
        {activeChat ? (
          /* ── Active chat ── */
          <div className="flex-1 overflow-y-auto p-6 space-y-4 max-w-3xl mx-auto w-full">
            {activeChat.messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.type === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-primary dark:bg-green-600 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5 text-white shadow-sm">
                    <Sparkles size={16} />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-lg px-4 py-2.5 text-sm leading-relaxed ${
                    msg.type === 'user'
                      ? 'bg-primary dark:bg-green-600 text-white rounded-br-none shadow-sm'
                      : 'bg-surface-container-low dark:bg-surface-container-highest text-foreground dark:text-foreground rounded-bl-none border border-border dark:border-border'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary dark:bg-green-600 flex items-center justify-center flex-shrink-0 text-white">
                  <Sparkles size={16} />
                </div>
                <div className="bg-surface-container-low dark:bg-surface-container-highest border border-border dark:border-border rounded-lg rounded-bl-none px-4 py-3 flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-outline-variant dark:bg-outline animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-outline-variant dark:bg-outline animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-outline-variant dark:bg-outline animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          /* ── Welcome ── */
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            {/* Greeting */}
            <div className="flex items-center gap-3 mb-8">
              <Sparkles size={38} className="text-primary-green dark:text-primary-green" />
              <h1 className="text-4xl font-semibold text-gray-950 dark:text-gray-50 tracking-tight">
                {getGreeting()}, Oppie
              </h1>
            </div>

            {/* Input */}
            <div className="w-full max-w-2xl mb-6">
              <div className="bg-white dark:bg-background rounded-xl border border-border dark:border-border shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 dark:focus-within:ring-green-500/50 transition-all">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => {
                    setInput(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="How can I help you today?"
                  rows={1}
                  className="w-full px-5 pt-4 pb-2 text-[15px] text-foreground dark:text-foreground bg-transparent placeholder-gray-400 dark:placeholder-gray-500 outline-none resize-none"
                  style={{ minHeight: '52px', maxHeight: '160px' }}
                />
                <div className="flex items-center justify-between px-4 pb-3 pt-1">
                  <button className="w-7 h-7 rounded-full flex items-center justify-center border border-border dark:border-border text-muted-foreground dark:text-muted-foreground hover:bg-surface-container-low dark:hover:bg-surface-container-high transition-colors text-lg leading-none">
                    +
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-[12px] text-outline dark:text-muted-foreground">
                      <span className="font-medium text-muted-foreground dark:text-muted-foreground">Plex</span>
                      <span className="text-muted-foreground dark:text-muted-foreground">·</span>
                      <span>Default</span>
                    </div>
                    <button className="text-outline hover:text-muted-foreground dark:hover:text-on-surface-variant transition-colors">
                      <Mic size={16} strokeWidth={1.75} />
                    </button>
                    <button
                      onClick={handleSend}
                      disabled={!input.trim()}
                      className="w-8 h-8 rounded-md flex items-center justify-center bg-primary dark:bg-green-600 hover:bg-indigo-700 dark:hover:bg-green-700 text-white disabled:opacity-20 hover:opacity-90 transition-all disabled:cursor-not-allowed"
                    >
                      <Send size={12} strokeWidth={2} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl">
              {QUICK_ACTIONS.map(pill => (
                <button
                  key={pill.id}
                  onClick={() => handleQuickAction(pill.prompt)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs text-on-surface dark:text-muted-foreground bg-white dark:bg-background border border-gray-250 dark:border-border hover:bg-surface-container-low dark:hover:bg-surface-container-high hover:border-gray-305 dark:hover:border-gray-650 transition-all shadow-sm"
                >
                  <pill.icon size={13} strokeWidth={1.75} className="text-muted-foreground dark:text-muted-foreground" />
                  {pill.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input bar (visible in active chat) */}
        {activeChat && (
          <div className="flex-shrink-0 px-6 pb-5">
            <div className="max-w-3xl mx-auto">
              <div className="bg-white dark:bg-background rounded-xl border border-border dark:border-border shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 dark:focus-within:ring-green-500/50 transition-all">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => {
                    setInput(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Reply to Plex\u2026"
                  rows={1}
                  className="w-full px-5 pt-4 pb-2 text-[15px] text-foreground dark:text-foreground bg-transparent placeholder-gray-400 dark:placeholder-gray-500 outline-none resize-none"
                  style={{ minHeight: '52px', maxHeight: '160px' }}
                />
                <div className="flex items-center justify-between px-4 pb-3 pt-1">
                  <button className="w-7 h-7 rounded-full flex items-center justify-center border border-border dark:border-border text-muted-foreground dark:text-muted-foreground hover:bg-surface-container-low dark:hover:bg-surface-container-high transition-colors text-lg leading-none">
                    +
                  </button>
                  <div className="flex items-center gap-2">
                    <button className="text-outline hover:text-muted-foreground dark:hover:text-on-surface-variant transition-colors">
                      <Mic size={16} strokeWidth={1.75} />
                    </button>
                    <button
                      onClick={handleSend}
                      disabled={!input.trim()}
                      className="w-8 h-8 rounded-md flex items-center justify-center bg-primary dark:bg-green-600 hover:bg-indigo-700 dark:hover:bg-green-700 text-white disabled:opacity-20 hover:opacity-90 transition-all disabled:cursor-not-allowed"
                    >
                      <Send size={12} strokeWidth={2} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
