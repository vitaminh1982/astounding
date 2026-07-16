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

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Chat {
  id: string;
  title: string;
  preview: string;
  timestamp: Date;
  messages: Message[];
}

const CATEGORY_PILLS = [
  { id: 'create-project', icon: FolderPlus, label: 'Create project', prompt: 'Help me create a new project in my workspace. I need to define scope, goals, team members, and milestones.' },
  { id: 'create-proposal', icon: FileText, label: 'Create proposal', prompt: 'Help me write a professional business proposal for a client.' },
  { id: 'create-report', icon: BarChart, label: 'Create report', prompt: 'Help me generate a structured report. What topic or data should I analyze?' },
  { id: 'create-slides', icon: Presentation, label: 'Create slides', prompt: "Help me create a slide deck presentation. What's the topic, audience, and key message?" },
  { id: 'wide-research', icon: Search, label: 'Wide research', prompt: "Start a comprehensive research session. What topic would you like to explore in depth?" },
  { id: 'translation', icon: Languages, label: 'Translation', prompt: 'Translate content for me. Paste the text and specify the target language(s).' },
  { id: 'explore-docs', icon: BookOpen, label: 'Explore documents', prompt: 'Help me explore and analyze documents from my workspace knowledge base.' },
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 18) return 'Afternoon';
  return 'Evening';
}

export default function PlexPage({ isSidebarExpanded = true }: { isSidebarExpanded?: boolean }) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
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
    <div className={`flex fixed top-[10px] bottom-[10px] right-[10px] transition-all duration-300 ease-in-out overflow-hidden z-30 rounded-2xl ${
      activeChat 
        ? 'shadow dark:shadow-gray-900 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800' 
        : 'bg-transparent'
    } ${
      activeChat
        ? (isSidebarExpanded ? 'left-[10px] lg:left-[276px]' : 'left-[10px] lg:left-[84px]')
        : 'left-[10px] lg:left-[276px]'
    }`}>

      {/* Sidebar */}
      {showSidebar && (
        <aside className={`w-52 flex-shrink-0 flex flex-col transition-all ${
          activeChat 
            ? 'border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50' 
            : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg mr-4 shadow-sm'
        }`}>
          <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between flex-shrink-0">
            <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Plex</span>
            <button
              onClick={() => setShowSidebar(false)}
              className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-150 dark:hover:bg-gray-800 transition-colors"
            >
              <ChevronLeft size={13} />
            </button>
          </div>
          <div className="p-2 flex-shrink-0">
            <button
              onClick={startNewChat}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
            >
              <Plus size={13} />
              New chat
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
            {chats.map(chat => (
              <button
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  activeChatId === chat.id
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <p className="text-xs truncate">{chat.title}</p>
                <p className="text-[10px] text-gray-400 truncate mt-0.5">{chat.preview}</p>
              </button>
            ))}
          </div>
        </aside>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 bg-transparent">
        {activeChat ? (
          /* ── Active chat ── */
          <div className="flex-1 overflow-y-auto p-6 space-y-4 max-w-3xl mx-auto w-full">
            {activeChat.messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.type === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-indigo-600 dark:bg-teal-600 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5 text-white shadow-sm">
                    <Sparkles size={16} />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-lg px-4 py-2.5 text-sm leading-relaxed ${
                    msg.type === 'user'
                      ? 'bg-indigo-600 dark:bg-teal-600 text-white rounded-br-none shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none border border-gray-200 dark:border-gray-600'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-600 dark:bg-teal-600 flex items-center justify-center flex-shrink-0 text-white">
                  <Sparkles size={16} />
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg rounded-bl-none px-4 py-3 flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }} />
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
              <Sparkles size={38} className="text-indigo-600 dark:text-teal-500" />
              <h1 className="text-4xl font-semibold text-gray-950 dark:text-gray-50 tracking-tight">
                {getGreeting()}, Oppie
              </h1>
            </div>

            {/* Input */}
            <div className="w-full max-w-2xl mb-6">
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 dark:focus-within:ring-teal-500/50 transition-all">
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
                  className="w-full px-5 pt-4 pb-2 text-[15px] text-gray-900 dark:text-gray-100 bg-transparent placeholder-gray-400 dark:placeholder-gray-500 outline-none resize-none"
                  style={{ minHeight: '52px', maxHeight: '160px' }}
                />
                <div className="flex items-center justify-between px-4 pb-3 pt-1">
                  <button className="w-7 h-7 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-lg leading-none">
                    +
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-[12px] text-gray-400 dark:text-gray-500">
                      <span className="font-medium text-gray-600 dark:text-gray-400">Plex</span>
                      <span className="text-gray-300 dark:text-gray-600">·</span>
                      <span>Default</span>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                      <Mic size={16} strokeWidth={1.75} />
                    </button>
                    <button
                      onClick={handleSend}
                      disabled={!input.trim()}
                      className="w-8 h-8 rounded-md flex items-center justify-center bg-indigo-600 dark:bg-teal-600 hover:bg-indigo-700 dark:hover:bg-teal-700 text-white disabled:opacity-20 hover:opacity-90 transition-all disabled:cursor-not-allowed"
                    >
                      <Send size={12} strokeWidth={2} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl">
              {CATEGORY_PILLS.map(pill => (
                <button
                  key={pill.id}
                  onClick={() => handleQuickAction(pill.prompt)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all shadow-sm"
                >
                  <pill.icon size={13} strokeWidth={1.75} className="text-gray-500 dark:text-gray-400" />
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
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 dark:focus-within:ring-teal-500/50 transition-all">
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
                  className="w-full px-5 pt-4 pb-2 text-[15px] text-gray-900 dark:text-gray-100 bg-transparent placeholder-gray-400 dark:placeholder-gray-500 outline-none resize-none"
                  style={{ minHeight: '52px', maxHeight: '160px' }}
                />
                <div className="flex items-center justify-between px-4 pb-3 pt-1">
                  <button className="w-7 h-7 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-lg leading-none">
                    +
                  </button>
                  <div className="flex items-center gap-2">
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                      <Mic size={16} strokeWidth={1.75} />
                    </button>
                    <button
                      onClick={handleSend}
                      disabled={!input.trim()}
                      className="w-8 h-8 rounded-md flex items-center justify-center bg-indigo-600 dark:bg-teal-600 hover:bg-indigo-700 dark:hover:bg-teal-700 text-white disabled:opacity-20 hover:opacity-90 transition-all disabled:cursor-not-allowed"
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
