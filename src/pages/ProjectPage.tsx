import React, { useState, useRef, useEffect, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, Transition } from '@headlessui/react';
import {
  LayoutDashboard,
  MessageSquare,
  Bot,
  CheckSquare,
  BookOpen,
  TrendingUp,
  Calendar,
  Users,
  Target,
  Send,
  X,
  Plus,
  FileText,
  Upload,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  Circle,
  Lightbulb,
  BarChart2,
  Cpu,
  ClipboardList,
  Database,
  Trash2,
  ArrowLeft,
  Folder,
  Zap,
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import toast, { Toaster } from 'react-hot-toast';
import {
  MIRANKI_PROJECT,
  MIRANKI_TEAM,
  MIRANKI_MILESTONES,
  MIRANKI_AGENTS,
  MIRANKI_PHASES,
  MIRANKI_KB_DOCUMENTS,
  MIRANKI_CHAT_RESPONSES,
  type Agent,
  type KBDocument,
} from '../mirankiMockData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// ─── Project card type ────────────────────────────────────────────────────────

interface ProjectCard {
  id: string;
  name: string;
  subtitle: string;
  status: 'Active' | 'Draft' | 'Archived';
  progress: number;
  agentCount: number;
  teamSize: number;
  industry: string;
  phase: string;
  lastActivity: string;
}

const INITIAL_PROJECTS: ProjectCard[] = [
  {
    id: 'miranki',
    name: 'Miranki',
    subtitle: 'AI Startup Development · Collective SuperIntelligence Platform',
    status: 'Active',
    progress: 35,
    agentCount: 6,
    teamSize: 3,
    industry: 'Consulting',
    phase: 'Year 1',
    lastActivity: '2 minutes ago',
  },
];

// ─── Tab definitions ──────────────────────────────────────────────────────────

type TabId = 'Overview' | 'Project Assistant' | 'AI Agents' | 'Deliverables' | 'Knowledge Base' | 'Analytics';

const TABS: { id: TabId; icon: React.ReactNode }[] = [
  { id: 'Overview', icon: <LayoutDashboard size={14} /> },
  { id: 'Project Assistant', icon: <MessageSquare size={14} /> },
  { id: 'AI Agents', icon: <Bot size={14} /> },
  { id: 'Deliverables', icon: <CheckSquare size={14} /> },
  { id: 'Knowledge Base', icon: <BookOpen size={14} /> },
  { id: 'Analytics', icon: <TrendingUp size={14} /> },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const agentIconMap: Record<string, React.ReactNode> = {
  Lightbulb: <Lightbulb size={18} />,
  BarChart2: <BarChart2 size={18} />,
  Cpu: <Cpu size={18} />,
  ClipboardList: <ClipboardList size={18} />,
  Database: <Database size={18} />,
  Users: <Users size={18} />,
};

const agentColorMap: Record<string, { bg: string; text: string }> = {
  indigo: { bg: 'bg-indigo-500/20', text: 'text-indigo-400' },
  blue: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  cyan: { bg: 'bg-cyan-500/20', text: 'text-cyan-400' },
  purple: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
  amber: { bg: 'bg-amber-500/20', text: 'text-amber-400' },
  rose: { bg: 'bg-rose-500/20', text: 'text-rose-400' },
};

const statusBadgeMap: Record<string, string> = {
  Active: 'bg-green-500/20 text-green-400 border border-green-500/30',
  Processing: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  Standby: 'bg-slate-600/40 text-slate-400 border border-slate-600',
};

const docTypeColorMap: Record<string, string> = {
  PDF: 'bg-red-500/20 text-red-400',
  DOC: 'bg-blue-500/20 text-blue-400',
  CSV: 'bg-green-500/20 text-green-400',
  TXT: 'bg-slate-500/20 text-slate-400',
};

// ─── Progress Ring ────────────────────────────────────────────────────────────

function ProgressRing({ pct, size = 56 }: { pct: number; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="#334155" strokeWidth="4" fill="none" />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        stroke="#f59e0b" strokeWidth="4" fill="none"
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
      />
      <text
        x={size / 2} y={size / 2 + 5}
        textAnchor="middle" fill="#f59e0b" fontSize="11" fontWeight="700"
        transform={`rotate(90, ${size / 2}, ${size / 2})`}
      >
        {pct}%
      </text>
    </svg>
  );
}

// ─── Tab bar ──────────────────────────────────────────────────────────────────

function TabBar({ active, onChange }: { active: TabId; onChange: (t: TabId) => void }) {
  return (
    <div className="flex bg-slate-800 rounded-xl p-1 gap-0.5 flex-wrap">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            active === tab.id ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {tab.icon}
          {tab.id}
        </button>
      ))}
    </div>
  );
}

// ─── Chat helpers ─────────────────────────────────────────────────────────────

interface ChatMessage { id: string; role: 'user' | 'ai'; text: string; }

function getChatResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const key of Object.keys(MIRANKI_CHAT_RESPONSES)) {
    if (key !== 'default' && lower.includes(key)) return MIRANKI_CHAT_RESPONSES[key];
  }
  return MIRANKI_CHAT_RESPONSES.default;
}

// ─── Toggle ───────────────────────────────────────────────────────────────────

function Toggle({ on }: { on: boolean }) {
  return (
    <div className={`w-10 h-5 rounded-full flex items-center px-0.5 ${on ? 'bg-indigo-600' : 'bg-slate-600'}`}>
      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${on ? 'translate-x-5' : 'translate-x-0'}`} />
    </div>
  );
}

// ─── Agent Detail Modal ───────────────────────────────────────────────────────

function AgentDetailModal({ agent, onClose }: { agent: Agent; onClose: () => void }) {
  const colors = agentColorMap[agent.color];
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.15 }}
        className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors.bg} ${colors.text}`}>
              {agentIconMap[agent.iconName]}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{agent.name}</h3>
              <span className={`text-xs rounded-full px-2 py-0.5 ${statusBadgeMap[agent.status]}`}>{agent.status}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors"><X size={20} /></button>
        </div>
        <p className="text-sm text-slate-300 mb-5 leading-relaxed">{agent.description}</p>
        <div className="mb-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Capabilities</p>
          <div className="flex flex-wrap gap-2">
            {agent.capabilities.map((cap) => (
              <span key={cap} className="bg-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200">{cap}</span>
            ))}
          </div>
        </div>
        <div className="mb-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Usage Statistics</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Tasks Completed', value: String(agent.usageStats.tasksCompleted) },
              { label: 'Avg Response', value: agent.usageStats.avgResponseTime },
              { label: 'Accuracy', value: agent.usageStats.accuracy },
            ].map((s) => (
              <div key={s.label} className="bg-slate-800 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-white">{s.value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Configuration</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Auto-respond enabled</span>
              <Toggle on={true} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Learning mode</span>
              <Toggle on={true} />
            </div>
          </div>
        </div>
        <p className="text-xs text-slate-500">Last active: {agent.lastActive}</p>
      </motion.div>
    </div>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab() {
  const stats = [
    { icon: <Calendar size={16} />, label: 'Duration', value: MIRANKI_PROJECT.duration },
    { icon: <Users size={16} />, label: 'Team Size', value: `${MIRANKI_PROJECT.teamSize} Members` },
    { icon: <Bot size={16} />, label: 'AI Agents', value: `${MIRANKI_PROJECT.agentCount} Active` },
    { icon: <Target size={16} />, label: 'Industry', value: MIRANKI_PROJECT.industry },
  ];
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="text-slate-400 mb-2">{s.icon}</div>
            <p className="text-xs text-slate-400">{s.label}</p>
            <p className="text-sm font-semibold text-white mt-0.5">{s.value}</p>
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {MIRANKI_TEAM.map((member, i) => (
          <motion.div key={member.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 + 0.2 }}
            className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {member.initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{member.name}</p>
                <span className={`text-xs rounded-full px-2 py-0.5 ${member.badgeColor}`}>{member.role}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-300 mb-3">Year 1 Roadmap</p>
        <div className="space-y-0">
          {MIRANKI_MILESTONES.map((m, i) => {
            const isLast = i === MIRANKI_MILESTONES.length - 1;
            const dotColor = m.status === 'completed' ? 'bg-green-500' : m.status === 'in-progress' ? 'bg-amber-500 animate-pulse' : 'bg-slate-600';
            const statusText = m.status === 'completed' ? 'Completed' : m.status === 'in-progress' ? 'In Progress' : 'Upcoming';
            const statusColor = m.status === 'completed' ? 'text-green-400' : m.status === 'in-progress' ? 'text-amber-400' : 'text-slate-400';
            return (
              <div key={m.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${dotColor}`} />
                  {!isLast && <div className="w-0.5 bg-slate-700 flex-1 my-1" />}
                </div>
                <div className="pb-4">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white">{m.name}</p>
                    <span className={`text-xs ${statusColor}`}>{statusText}</span>
                  </div>
                  <p className="text-xs text-slate-500">{m.date}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-xl p-4">
        <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">Vision</p>
        <p className="text-sm text-slate-300 leading-relaxed italic">"{MIRANKI_PROJECT.vision}"</p>
      </div>
    </div>
  );
}

// ─── Assistant Tab ────────────────────────────────────────────────────────────

const STARTERS = [
  "What is Miranki's current progress?",
  'Who are the AI agents deployed?',
  "What's the next milestone?",
];

function AssistantTab() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  function sendMessage(text: string) {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'user', text: text.trim() }]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'ai', text: getChatResponse(text) }]);
      setIsTyping(false);
    }, 1200);
  }

  return (
    <div className="flex flex-col h-[520px]">
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {messages.length === 0 && !isTyping && (
          <div className="space-y-2 pt-2">
            <p className="text-xs text-slate-500 text-center mb-3">Ask me anything about Miranki</p>
            {STARTERS.map((s) => (
              <button key={s} onClick={() => sendMessage(s)}
                className="w-full text-left bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-300 transition-colors">
                {s}
              </button>
            ))}
          </div>
        )}
        {messages.map((msg) =>
          msg.role === 'user' ? (
            <div key={msg.id} className="flex justify-end">
              <div className="bg-indigo-600 text-white rounded-2xl rounded-br-sm px-4 py-2 max-w-[80%] text-sm">{msg.text}</div>
            </div>
          ) : (
            <div key={msg.id} className="flex items-start gap-2">
              <div className="bg-indigo-500/20 rounded-full p-1 flex-shrink-0 mt-0.5"><Bot size={14} className="text-indigo-400" /></div>
              <div className="bg-slate-700 text-slate-100 rounded-2xl rounded-bl-sm px-4 py-2 max-w-[80%] text-sm leading-relaxed">{msg.text}</div>
            </div>
          )
        )}
        {isTyping && (
          <div className="flex items-start gap-2">
            <div className="bg-indigo-500/20 rounded-full p-1 flex-shrink-0 mt-0.5"><Bot size={14} className="text-indigo-400" /></div>
            <div className="bg-slate-700 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
              {[0, 1, 2].map((i) => (
                <span key={i} className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="mt-3 flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
          placeholder="Ask about Miranki..."
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500" />
        <button onClick={() => sendMessage(input)} className="bg-indigo-600 hover:bg-indigo-500 rounded-lg p-2.5 transition-colors flex-shrink-0">
          <Send size={16} className="text-white" />
        </button>
      </div>
    </div>
  );
}

// ─── Agents Tab ───────────────────────────────────────────────────────────────

function AgentsTab() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {MIRANKI_AGENTS.map((agent, i) => {
          const colors = agentColorMap[agent.color];
          return (
            <motion.div key={agent.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.02, transition: { type: 'spring', stiffness: 300 } }}
              className="bg-slate-800 border border-slate-700 rounded-xl p-4 cursor-pointer"
              onClick={() => setSelectedAgent(agent)}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors.bg} ${colors.text}`}>{agentIconMap[agent.iconName]}</div>
                  <p className="text-sm font-semibold text-white">{agent.name}</p>
                </div>
                <span className={`text-xs rounded-full px-2 py-0.5 ${statusBadgeMap[agent.status]}`}>{agent.status}</span>
              </div>
              <p className="text-xs text-slate-400 mb-3">{agent.role}</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {[`${agent.usageStats.tasksCompleted} tasks`, agent.usageStats.avgResponseTime, agent.usageStats.accuracy].map((stat) => (
                  <span key={stat} className="bg-slate-700 rounded-full px-2 py-0.5 text-xs text-slate-300">{stat}</span>
                ))}
              </div>
              <button className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                onClick={(e) => { e.stopPropagation(); setSelectedAgent(agent); }}>
                View Details →
              </button>
            </motion.div>
          );
        })}
      </div>
      <AnimatePresence>
        {selectedAgent && <AgentDetailModal agent={selectedAgent} onClose={() => setSelectedAgent(null)} />}
      </AnimatePresence>
    </>
  );
}

// ─── Deliverables Tab ─────────────────────────────────────────────────────────

function DeliverablesTab() {
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>(
    Object.fromEntries(MIRANKI_PHASES.map((p) => [p.id, true]))
  );
  const phaseBarColors = ['bg-green-500', 'bg-amber-500', 'bg-slate-600'];

  return (
    <div className="space-y-4">
      {MIRANKI_PHASES.map((phase, pi) => (
        <div key={phase.id} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <button className="w-full flex items-center justify-between p-4" onClick={() => setExpandedPhases((p) => ({ ...p, [phase.id]: !p[phase.id] }))}>
            <div className="flex-1 mr-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-white">{phase.name}</p>
                <p className="text-xs font-semibold text-slate-400">{phase.progress}%</p>
              </div>
              <div className="bg-slate-700 rounded-full h-2 w-full">
                <div className={`h-2 rounded-full ${phaseBarColors[pi]}`} style={{ width: `${phase.progress}%` }} />
              </div>
            </div>
            {expandedPhases[phase.id] ? <ChevronUp size={16} className="text-slate-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />}
          </button>
          <AnimatePresence>
            {expandedPhases[phase.id] && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                <div className="px-4 pb-4 space-y-2">
                  {phase.deliverables.map((d) => {
                    const isCompleted = d.status === 'completed';
                    const isInProgress = d.status === 'in-progress';
                    return (
                      <div key={d.id} className="flex items-center gap-3">
                        {isCompleted ? <CheckCircle2 size={16} className="text-green-400 flex-shrink-0" /> : isInProgress ? <Clock size={16} className="text-amber-400 flex-shrink-0" /> : <Circle size={16} className="text-slate-600 flex-shrink-0" />}
                        <p className={`text-sm flex-1 ${isCompleted ? 'text-slate-400 line-through' : isInProgress ? 'text-white' : 'text-slate-500'}`}>{d.name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${isCompleted ? 'bg-green-500/20 text-green-400' : isInProgress ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700 text-slate-500'}`}>
                          {isCompleted ? 'Completed' : isInProgress ? 'In Progress' : 'Pending'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

// ─── Knowledge Base Tab ───────────────────────────────────────────────────────

function KnowledgeBaseTab() {
  const [docs, setDocs] = useState<KBDocument[]>(MIRANKI_KB_DOCUMENTS);
  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-400">{docs.length} documents indexed · {docs.length > 0 ? '10.0 MB total' : '0 MB total'} · Used by 6 agents</p>
      <div className="space-y-2">
        {docs.map((doc) => (
          <div key={doc.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center gap-4">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${docTypeColorMap[doc.type]}`}><FileText size={16} /></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{doc.name}</p>
              <p className="text-xs text-slate-400">{doc.size} · {doc.uploadedAt}</p>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {doc.usedByAgents.map((a) => (
                  <span key={a} className="bg-indigo-500/20 text-indigo-300 text-xs rounded px-1.5 py-0.5">{a}</span>
                ))}
              </div>
            </div>
            <span className="bg-green-500/20 text-green-400 text-xs rounded-full px-2 py-0.5 flex-shrink-0">Indexed</span>
            <button onClick={() => setDocs((prev) => prev.filter((d) => d.id !== doc.id))} className="text-slate-600 hover:text-red-400 transition-colors flex-shrink-0"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
      <button onClick={() => toast('Upload functionality coming soon')}
        className="w-full border-2 border-dashed border-slate-600 hover:border-indigo-500 rounded-xl p-8 text-center transition-colors group">
        <Upload size={24} className="text-slate-500 group-hover:text-indigo-400 mx-auto mb-2 transition-colors" />
        <p className="text-sm text-slate-400 group-hover:text-slate-300 font-medium transition-colors">Drop files here or click to upload</p>
        <p className="text-xs text-slate-600 mt-1">Supports PDF, DOC, TXT, CSV</p>
      </button>
    </div>
  );
}

// ─── Analytics Tab ────────────────────────────────────────────────────────────

function AnalyticsTab() {
  const baseOpts = {
    responsive: true, maintainAspectRatio: true,
    plugins: { legend: { labels: { color: '#cbd5e1', font: { size: 11 } } } },
    scales: {
      x: { grid: { color: 'rgba(148,163,184,0.1)' }, ticks: { color: '#94a3b8' } },
      y: { grid: { color: 'rgba(148,163,184,0.1)' }, ticks: { color: '#94a3b8' } },
    },
  };
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
        <p className="text-sm font-semibold text-slate-300 mb-3">Project Progress Over Time</p>
        <Line data={{ labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul'], datasets: [{ label: 'Overall Completion %', data: [5,10,18,22,28,33,35], borderColor: 'rgb(99,102,241)', backgroundColor: 'rgba(99,102,241,0.1)', fill: true, tension: 0.4 }] }} options={baseOpts} />
      </div>
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
        <p className="text-sm font-semibold text-slate-300 mb-3">Agent Task Distribution</p>
        <Bar data={{ labels: ['Strategy','Market','Tech','PM Coach','Data Sci','UX'], datasets: [{ label: 'Tasks Completed', data: [142,89,67,203,34,28], backgroundColor: ['rgba(99,102,241,0.7)','rgba(59,130,246,0.7)','rgba(6,182,212,0.7)','rgba(168,85,247,0.7)','rgba(245,158,11,0.7)','rgba(244,63,94,0.7)'] }] }} options={baseOpts} />
      </div>
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
        <p className="text-sm font-semibold text-slate-300 mb-3">Phase Completion</p>
        <Doughnut data={{ labels: ['Completed','In Progress','Remaining'], datasets: [{ data: [40,25,35], backgroundColor: ['#22c55e','#f59e0b','#334155'], borderWidth: 0 }] }} options={{ responsive: true, maintainAspectRatio: true, plugins: { legend: { labels: { color: '#cbd5e1', font: { size: 11 } } } } }} />
      </div>
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
        <p className="text-sm font-semibold text-slate-300 mb-3">Weekly Activity</p>
        <Bar data={{ labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], datasets: [{ label: 'Agent Interactions', data: [12,19,8,15,22,6,3], backgroundColor: 'rgba(139,92,246,0.7)' }] }} options={{ ...baseOpts, indexAxis: 'y' as const }} />
      </div>
    </div>
  );
}

// ─── Project Detail View ──────────────────────────────────────────────────────

function ProjectDetailView({ project, onBack }: { project: ProjectCard; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<TabId>('Overview');

  function renderTab() {
    switch (activeTab) {
      case 'Overview': return <OverviewTab />;
      case 'Project Assistant': return <AssistantTab />;
      case 'AI Agents': return <AgentsTab />;
      case 'Deliverables': return <DeliverablesTab />;
      case 'Knowledge Base': return <KnowledgeBaseTab />;
      case 'Analytics': return <AnalyticsTab />;
    }
  }

  return (
    <div className="min-h-full bg-slate-900">
      {/* Back bar */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} />
          All Projects
        </button>
        <div className="w-px h-4 bg-slate-700" />
        <span className="text-slate-500 text-sm">{project.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-white">{project.name}</h1>
            <span className="bg-green-500/20 text-green-400 border border-green-500/30 rounded-full px-3 py-1 text-xs">Active</span>
          </div>
          <p className="text-sm text-slate-400">{project.subtitle}</p>
        </div>
        <ProgressRing pct={project.progress} size={56} />
      </div>

      {/* Tabs */}
      <div className="mb-5">
        <TabBar active={activeTab} onChange={setActiveTab} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
          {renderTab()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── New Project Modal ────────────────────────────────────────────────────────

interface ProjectForm { name: string; type: string; vision: string; industry: string; duration: string; teamSize: string; }

function NewProjectModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [form, setForm] = useState<ProjectForm>({ name: '', type: 'AI Startup', vision: '', industry: '', duration: '1 year', teamSize: '1' });

  function handleSubmit() {
    toast.success('Project created successfully! 🚀');
    setForm({ name: '', type: 'AI Startup', vision: '', industry: '', duration: '1 year', teamSize: '1' });
    onClose();
  }

  const inputClass = 'bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm w-full focus:outline-none focus:border-indigo-500 placeholder-slate-500';
  const labelClass = 'text-xs font-medium text-slate-400 mb-1 block';

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
              leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">
                <div className="flex items-center justify-between mb-5">
                  <Dialog.Title className="text-lg font-bold text-white">Create New Project</Dialog.Title>
                  <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors"><X size={20} /></button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Project Name</label>
                    <input className={inputClass} placeholder="e.g. My AI Startup" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelClass}>Project Type</label>
                    <select className={inputClass} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                      {['AI Startup', 'SaaS Product', 'Research Project', 'Consulting Engagement', 'Other'].map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Vision Statement</label>
                    <textarea className={inputClass} rows={3} placeholder="Describe your project's vision..." value={form.vision} onChange={(e) => setForm({ ...form, vision: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelClass}>Industry Focus</label>
                    <input className={inputClass} placeholder="e.g. Healthcare, Finance, Education" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Duration</label>
                      <select className={inputClass} value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })}>
                        {['3 months', '6 months', '1 year', '2 years', '5 years'].map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Team Size</label>
                      <input type="number" min={1} max={100} className={inputClass} value={form.teamSize} onChange={(e) => setForm({ ...form, teamSize: e.target.value })} />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={onClose} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white rounded-xl px-4 py-2.5 text-sm font-medium transition-colors">Cancel</button>
                  <button onClick={handleSubmit} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-4 py-2.5 text-sm font-medium transition-colors">Create Project</button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

// ─── Project Status Badge ─────────────────────────────────────────────────────

const projectStatusMap: Record<string, string> = {
  Active: 'bg-green-500/20 text-green-400 border-green-500/30',
  Draft: 'bg-slate-600/40 text-slate-400 border-slate-600',
  Archived: 'bg-slate-700/40 text-slate-500 border-slate-700',
};

// ─── Project Grid View ────────────────────────────────────────────────────────

function ProjectGridView({ projects, onSelectProject, onNewProject }: {
  projects: ProjectCard[];
  onSelectProject: (p: ProjectCard) => void;
  onNewProject: () => void;
}) {
  return (
    <div className="min-h-full bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-sm text-slate-400 mt-1">{projects.length} project{projects.length !== 1 ? 's' : ''} · Manage your AI-powered initiatives</p>
        </div>
        <button
          onClick={onNewProject}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-4 py-2.5 text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
        >
          <Plus size={16} />
          New Project
        </button>
      </div>

      {/* Grid */}
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center">
            <Folder size={28} className="text-slate-600" />
          </div>
          <p className="text-slate-400 font-medium">No projects yet</p>
          <p className="text-slate-600 text-sm">Create your first project to get started</p>
          <button onClick={onNewProject} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-4 py-2.5 text-sm font-medium transition-colors mt-2">
            <Plus size={14} />
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -2, transition: { type: 'spring', stiffness: 300 } }}
              onClick={() => onSelectProject(project)}
              className="bg-slate-800 border border-slate-700 hover:border-slate-500 rounded-2xl p-5 cursor-pointer transition-colors group"
            >
              {/* Card header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                    <Zap size={18} className="text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">{project.name}</h3>
                    <span className={`text-xs rounded-full px-2 py-0.5 border ${projectStatusMap[project.status]}`}>{project.status}</span>
                  </div>
                </div>
                <ProgressRing pct={project.progress} size={44} />
              </div>

              {/* Subtitle */}
              <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">{project.subtitle}</p>

              {/* Stats row */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Bot size={12} className="text-slate-500" />
                  {project.agentCount} agents
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Users size={12} className="text-slate-500" />
                  {project.teamSize} members
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Target size={12} className="text-slate-500" />
                  {project.industry}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                <div>
                  <p className="text-xs text-slate-500">Phase</p>
                  <p className="text-xs font-medium text-slate-300">{project.phase}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Last activity</p>
                  <p className="text-xs font-medium text-slate-300">{project.lastActivity}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProjectPage() {
  const [projects] = useState<ProjectCard[]>(INITIAL_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<ProjectCard | null>(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  return (
    <div className="min-h-full bg-slate-900 text-white">
      <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155' } }} />

      <AnimatePresence mode="wait">
        {selectedProject ? (
          <motion.div key="detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            <ProjectDetailView project={selectedProject} onBack={() => setSelectedProject(null)} />
          </motion.div>
        ) : (
          <motion.div key="grid" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}>
            <ProjectGridView
              projects={projects}
              onSelectProject={setSelectedProject}
              onNewProject={() => setShowNewProjectModal(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <NewProjectModal isOpen={showNewProjectModal} onClose={() => setShowNewProjectModal(false)} />
    </div>
  );
}
