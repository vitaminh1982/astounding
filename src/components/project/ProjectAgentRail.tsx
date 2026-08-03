import React, { useState, useRef, useEffect } from 'react';
import { Send, ChevronLeft, Check, Loader, ChevronDown, Plus, Mic, CornerDownRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { WORKSPACE_AGENTS, WorkspaceAgent } from '../../data/workspace_agents';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const COLLAPSED_W = 56;   // px — strip width
const PEEK_W      = 72;   // px — hover peek width
const EXPANDED_W  = 400;  // px — full panel width

const AGENT_GREETINGS: Record<string, string> = {
  'agent-001': 'Bonjour ! En tant que Support Client, je suis disponible pour vous aider sur toutes les demandes liées à ce projet.',
  'agent-002': 'Bonjour ! Je peux vous aider à planifier vos jalons, suivre les délais et coordonner les ressources du projet.',
  'agent-003': 'Bonjour ! Besoin de clarifier des exigences ou modéliser des processus métier pour ce projet ? Je suis là.',
  'agent-004': 'Bonjour ! Je peux analyser les données de performance et produire des rapports d\'avancement pour ce projet.',
  'agent-005': 'Bonjour ! En tant qu\'expert Finance, je suis disponible pour tout conseil réglementaire ou financier lié à ce projet.',
  'agent-006': 'Bonjour ! Je peux vous aider sur la gouvernance PMO, le reporting et la gestion du portfolio de ce projet.',
};

// Contextual quick actions suggested right after the greeting, per agent role
const AGENT_QUICK_ACTIONS: Record<string, string[]> = {
  'agent-001': ['Voir les tickets ouverts', 'Relancer un client'],
  'agent-002': ['Voir les jalons en retard', 'Générer un rapport d\'avancement'],
  'agent-003': ['Clarifier une exigence', 'Modéliser un processus'],
  'agent-004': ['Analyser les KPIs du projet', 'Générer un rapport'],
  'agent-005': ['Vérifier la conformité', 'Estimer le budget'],
  'agent-006': ['Voir le portfolio', 'Préparer le comité de pilotage'],
};

// Confirmation-style quick actions suggested after a simulated reply
const FOLLOW_UP_ACTIONS = ['Oui, c\'est ça', 'Apporter des modifications'];

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: Date;
  actions?: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Agent Selector Dropdown (inside expanded panel)
// ─────────────────────────────────────────────────────────────────────────────

function AgentSelector({ selected, onSelect }: { selected: WorkspaceAgent; onSelect: (a: WorkspaceAgent) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} id="agent-selector" className="relative w-full">

      {/* Trigger — style NavWorkspaceSwitcher : no border, no bg, just content + chevron */}
      <button
        onClick={() => setOpen(v => !v)}
        className={[
          'w-full flex items-center gap-2.5 px-2 py-2 rounded-lg transition-colors focus:outline-none',
          open ? 'bg-black/5 dark:bg-white/5' : 'hover:bg-black/5 dark:hover:bg-white/5',
        ].join(' ')}
        aria-expanded={open}
      >
        {/* Avatar + status */}
        <div className="relative flex-shrink-0">
          <img src={selected.avatar} alt={selected.name} className="w-7 h-7 rounded-full object-cover" />
          <span className={['absolute -bottom-px -right-px w-2.5 h-2.5 rounded-full border-2 border-background', selected.status === 'active' ? 'bg-primary-green' : 'bg-outline'].join(' ')} />
        </div>
        {/* Name + role */}
        <span className="flex-1 min-w-0 text-left">
          <span className="block text-xs font-medium text-foreground truncate leading-tight">{selected.name.replace('AI ', '')}</span>
          <span className="block text-[10px] text-muted-foreground truncate leading-tight">{selected.role}</span>
        </span>
        {open
          ? <ChevronDown size={13} className="flex-shrink-0 text-outline rotate-180 transition-transform duration-200" />
          : <ChevronDown size={13} className="flex-shrink-0 text-outline transition-transform duration-200" />}
      </button>

      {/* Dropdown — style appearance panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-1 z-50 bg-white dark:bg-surface-container-low border border-black/10 dark:border-white/10 shadow-2xl rounded-2xl p-3"
          >
            <p className="text-[10px] font-medium text-outline dark:text-muted-foreground px-2 py-1 uppercase tracking-wider mb-1">
              Agent du projet
            </p>
            <div className="space-y-0.5">
              {WORKSPACE_AGENTS.map(agent => {
                const isActive = selected.id === agent.id;
                return (
                  <button
                    key={agent.id}
                    onClick={() => { onSelect(agent); setOpen(false); }}
                    className="w-full px-2.5 py-1.5 flex items-center gap-2.5 justify-between rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-on-surface dark:text-muted-foreground transition-colors text-left"
                  >
                    <span className="flex items-center gap-2.5 min-w-0">
                      <div className="relative flex-shrink-0">
                        <img src={agent.avatar} alt={agent.name} className="w-6 h-6 rounded-full object-cover" />
                        <span className={['absolute -bottom-px -right-px w-2 h-2 rounded-full border border-background', agent.status === 'active' ? 'bg-primary-green' : 'bg-outline'].join(' ')} />
                      </div>
                      <span className={['text-xs truncate', isActive ? 'font-semibold text-foreground' : 'font-normal'].join(' ')}>
                        {agent.name.replace('AI ', '')}
                      </span>
                    </span>
                    {isActive && <Check size={12} className="text-on-surface dark:text-on-surface-variant flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ProjectAgentRail
// ─────────────────────────────────────────────────────────────────────────────

export default function ProjectAgentRail() {
  const [expanded, setExpanded] = useState(false);
  const [view, setView] = useState<'list' | 'chat'>('list');
  const [railHovered, setRailHovered] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<WorkspaceAgent>(WORKSPACE_AGENTS[1]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLElement>(null);

  // Collapse on outside click
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (expanded && railRef.current && !railRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [expanded]);

  // Listen for open-agent-rail event
  useEffect(() => {
    function handleOpenRail() {
      setView('list');
      setExpanded(true);
    }
    window.addEventListener('open-agent-rail', handleOpenRail);
    return () => window.removeEventListener('open-agent-rail', handleOpenRail);
  }, []);

  // Reset chat when agent changes
  useEffect(() => {
    setMessages([{
      id: '0',
      type: 'agent',
      content: AGENT_GREETINGS[selectedAgent.id] ?? `Bonjour ! Je suis ${selectedAgent.name}. Comment puis-je vous aider ?`,
      timestamp: new Date(),
      actions: AGENT_QUICK_ACTIONS[selectedAgent.id],
    }]);
  }, [selectedAgent]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAvatarClick = (agent: WorkspaceAgent) => {
    setSelectedAgent(agent);
    setView('chat');
    setExpanded(true);
  };

  const handleRailClick = () => {
    if (!expanded) {
      setView('list');
      setExpanded(true);
    }
  };

  const handleSend = (overrideText?: string) => {
    const text = overrideText ?? input;
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), type: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: `Je prends note de votre demande concernant "${userMsg.content.slice(0, 60)}${userMsg.content.length > 60 ? '…' : ''}". Je vais analyser cela dans le contexte du projet.`,
        timestamp: new Date(),
        actions: FOLLOW_UP_ACTIONS,
      }]);
      setIsTyping(false);
    }, 1200);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  // Target width: expanded = full, rail hovered = peek, else = strip
  const targetWidth = expanded ? EXPANDED_W : railHovered ? PEEK_W : COLLAPSED_W;

  return (
    <motion.aside
      id="project-agent-rail"
      ref={railRef as React.RefObject<HTMLElement>}
      initial={{ width: COLLAPSED_W }}
      animate={{ width: targetWidth }}
      whileTap={!expanded ? { scale: 0.985 } : undefined}
      transition={
        expanded
          ? { type: 'spring', stiffness: 340, damping: 32, mass: 0.9 }
          : { type: 'spring', stiffness: 420, damping: 34, mass: 0.7 }
      }
      onMouseEnter={() => !expanded && setRailHovered(true)}
      onMouseLeave={() => { setRailHovered(false); setHoveredId(null); }}
      onClick={handleRailClick}
      className="hidden lg:flex flex-col flex-shrink-0 glass-sidebar rounded-tl-2xl rounded-bl-2xl mb-4 cursor-pointer relative"
      style={{ overflow: expanded ? 'hidden' : 'visible' }}
    >
      <AnimatePresence initial={false}>
        {!expanded ? (
          /* ── COLLAPSED : avatar strip ── */
          <motion.div
            key="collapsed-strip"
            initial={{ opacity: 0, transition: { duration: 0 } }}
            animate={{ opacity: 1, transition: { duration: 0.18, delay: 0.05 } }}
            exit={{ opacity: 0, transition: { duration: 0.08 } }}
            className="absolute inset-0 flex flex-col items-center py-3 gap-2"
          >
            {WORKSPACE_AGENTS.map((agent, index) => {
              const isHovered = hoveredId === agent.id;
              return (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 6, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.22, delay: 0.04 * index, ease: [0.16, 1, 0.3, 1] }}
                  className="relative flex-shrink-0"
                  onMouseEnter={() => setHoveredId(agent.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{ zIndex: isHovered ? 50 : 'auto' }}
                >
                  <motion.button
                    onClick={e => { e.stopPropagation(); handleAvatarClick(agent); }}
                    animate={{ scale: isHovered ? 1.12 : 1 }}
                    whileTap={{ scale: 0.94 }}
                    transition={{ duration: 0.15 }}
                    className="relative block focus:outline-none"
                  >
                    <motion.div layoutId={`agent-avatar-${agent.id}`} className="relative" transition={{ duration: expanded ? 0.25 : 0 }}>
                      <img
                        src={agent.avatar}
                        alt={agent.name}
                        className={[
                          'w-8 h-8 rounded-full object-cover border-2 transition-all duration-150',
                          isHovered ? 'border-primary-green shadow-md shadow-primary-green/30' : 'border-border/50',
                        ].join(' ')}
                      />
                      <span
                        className={[
                          'absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background',
                          agent.status === 'active' ? 'bg-primary-green' : 'bg-outline',
                        ].join(' ')}
                      />
                    </motion.div>
                  </motion.button>

                  {/* Mini tooltip on hover — appears to the LEFT of the strip */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8 }}
                        transition={{ duration: 0.12 }}
                        className="absolute right-[calc(100%+10px)] top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ zIndex: 9999 }}
                      >
                        <div className="bg-surface-container dark:bg-surface-container-highest border border-border rounded-xl px-3 py-2 shadow-2xl whitespace-nowrap">
                          <p className="text-xs font-semibold text-foreground leading-tight">{agent.name.replace('AI ', '')}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{agent.role}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          /* ── EXPANDED : full panel ── */
          <motion.div
            key="expanded-panel"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.22, delay: 0.08, ease: [0.16, 1, 0.3, 1] } }}
            exit={{ opacity: 0, x: 6, transition: { duration: 0.1, ease: [0.4, 0, 1, 1] } }}
            className="absolute inset-0 flex flex-col min-h-0 overflow-hidden"
          >
            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between px-4 pt-4 pb-2">
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Project Agents</p>
                <p className="text-[9px] text-outline">Contextualisés à ce projet</p>
              </div>
              <motion.button
                onClick={() => setExpanded(false)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.9 }}
                className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                title="Réduire"
              >
                <ChevronLeft size={13} />
              </motion.button>
            </div>

            {/* Divider */}
            <div className="flex-shrink-0 mx-4 mb-2 h-px bg-border" />

            {/* ── LIST VIEW ── */}
            {view === 'list' && (
              <div className="flex flex-col flex-1 min-h-0">
                <div className="flex-1 overflow-y-auto px-2 py-1">
                  <p className="text-[10px] font-medium text-outline uppercase tracking-wider px-2 py-1 mb-1">
                    Agents du projet
                  </p>
                  <div className="space-y-0.5">
                    {WORKSPACE_AGENTS.map((agent, index) => {
                      const isActive = agent.status === 'active';
                      return (
                        <motion.button
                          key={agent.id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.18, delay: 0.1 + 0.03 * index, ease: [0.16, 1, 0.3, 1] }}
                          whileHover={{ x: 2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => { setSelectedAgent(agent); setView('chat'); }}
                          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left group"
                        >
                          <motion.div layoutId={`agent-avatar-${agent.id}`} className="relative flex-shrink-0" transition={{ duration: expanded ? 0.25 : 0 }}>
                            <img src={agent.avatar} alt={agent.name} className="w-8 h-8 rounded-full object-cover border border-border" />
                            <span className={['absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background', isActive ? 'bg-primary-green' : 'bg-outline'].join(' ')} />
                          </motion.div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-foreground truncate leading-tight">{agent.name.replace('AI ', '')}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{agent.role}</p>
                          </div>
                          <ChevronLeft size={12} className="rotate-180 text-outline opacity-0 group-hover:opacity-100 group-hover:text-primary-green transition-all" />
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ── CHAT VIEW ── */}
            {view === 'chat' && (
              <div className="flex flex-col flex-1 min-h-0">
                {/* Agent Selector */}
                <div className="flex-shrink-0 px-3 mb-1">
                  <AgentSelector selected={selectedAgent} onSelect={setSelectedAgent} />
                </div>

                {/* Messages */}
                <div className="flex-1 min-h-0 overflow-y-auto px-3 py-1 space-y-2">
                  {messages.map(msg => (
                    <div key={msg.id} className="space-y-1.5">
                      <div className={['flex', msg.type === 'user' ? 'justify-end' : 'justify-start items-end gap-1.5'].join(' ')}>
                        {msg.type === 'agent' && (
                          <img src={selectedAgent.avatar} alt="" className="w-6 h-6 rounded-full object-cover flex-shrink-0 mb-0.5" />
                        )}
                        <div className={[
                          'max-w-[80%] px-3 py-2 rounded-2xl text-xs leading-relaxed',
                          msg.type === 'user'
                            ? 'bg-primary-green text-white rounded-tr-none'
                            : 'bg-black/5 dark:bg-white/5 text-foreground border border-border rounded-tl-none',
                        ].join(' ')}>
                          {msg.content}
                          <p className={['text-[9px] mt-1', msg.type === 'user' ? 'text-white/60' : 'text-outline'].join(' ')}>
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>

                      {/* Contextual quick-action chips */}
                      {msg.type === 'agent' && !!msg.actions?.length && (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.18, delay: 0.1 }}
                          className="flex flex-wrap gap-1.5 pl-7"
                        >
                          {msg.actions.map(action => (
                            <motion.button
                              key={action}
                              onClick={() => handleSend(action)}
                              disabled={isTyping}
                              whileHover={{ y: -1 }}
                              whileTap={{ scale: 0.96 }}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-border text-[10px] font-medium text-muted-foreground hover:text-primary-green hover:border-primary-green/40 hover:bg-primary-green/5 transition-colors disabled:opacity-40 disabled:pointer-events-none"
                            >
                              <CornerDownRight size={10} className="flex-shrink-0" />
                              {action}
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start items-end gap-1.5">
                      <img src={selectedAgent.avatar} alt="" className="w-6 h-6 rounded-full object-cover flex-shrink-0" />
                      <div className="px-3 py-2 rounded-2xl rounded-tl-none bg-black/5 dark:bg-white/5 border border-border flex items-center gap-1.5">
                        <Loader size={11} className="animate-spin text-primary-green" />
                        <div className="flex gap-0.5">
                          {[0, 150, 300].map(d => (
                            <span key={d} className="w-1 h-1 rounded-full bg-outline animate-bounce" style={{ animationDelay: `${d}ms` }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="flex-shrink-0 px-3 pt-2 pb-5">
                  <div className="flex flex-col gap-2 bg-white dark:bg-surface-container-high rounded-2xl px-3 py-2.5 border border-border shadow-sm focus-within:border-primary-green/40 transition-colors">
                    <textarea
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={handleKey}
                      disabled={isTyping}
                      rows={2}
                      placeholder={`Demander à ${selectedAgent.name.replace('AI ', '')}…`}
                      className="w-full resize-none bg-transparent text-xs text-foreground placeholder:text-outline focus:outline-none disabled:opacity-50 leading-relaxed"
                    />
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        title="Ajouter une pièce jointe"
                        className="w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                      >
                        <Plus size={13} />
                      </button>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-outline">{selectedAgent.name.replace('AI ', '')}</span>
                        <Mic size={13} className="text-muted-foreground" />
                        <motion.button
                          onClick={() => handleSend()}
                          disabled={!input.trim() || isTyping}
                          whileHover={input.trim() && !isTyping ? { scale: 1.06 } : undefined}
                          whileTap={input.trim() && !isTyping ? { scale: 0.92 } : undefined}
                          className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-green text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <Send size={11} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                  <p className="text-[9px] text-outline mt-1.5 text-center">Entrée pour envoyer · Shift+Entrée pour nouvelle ligne</p>
                </div>
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}
