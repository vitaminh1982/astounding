import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, ArrowRight, Globe, ListTodo, Package } from 'lucide-react';
import LayoutFreeform from '../components/icons/LayoutFreeform';
import { useWorkspace } from '../context/WorkspaceContext';
import ProjectKanbanBoard from '../components/project/ProjectKanbanBoard';

type ProjectView = 'pm' | 'consultant' | 'freelance';

const VIEWS: { id: ProjectView; label: string }[] = [
  { id: 'pm', label: 'PM' },
  { id: 'consultant', label: 'Consultant' },
  { id: 'freelance', label: 'Freelance' },
];

interface StatCard {
  value: string;
  label: string;
  action: string;
  dark: boolean;
}

const STAT_CARDS: Record<ProjectView, StatCard[]> = {
  pm: [
    { value: '3', label: 'Pending gates', action: 'Approve', dark: true },
    { value: '5', label: 'Overdue tasks', action: 'View delays', dark: true },
    { value: '12/20', label: 'Deliverables completed', action: 'Open', dark: false },
  ],
  consultant: [
    { value: '8', label: 'Deliverables to produce', action: 'Open', dark: true },
    { value: '3', label: 'Blueprint sections to complete', action: 'Complete', dark: true },
    { value: '4', label: 'Content in review', action: 'Review', dark: false },
  ],
  freelance: [
    { value: '4', label: 'Due today', action: 'Start', dark: true },
    { value: '5', label: 'Overdue tasks', action: 'Catch up', dark: true },
    { value: '12/20', label: 'Deliverables completed', action: 'Open', dark: false },
  ],
};

const ACTIVE_AGENTS_COUNT = 6;

const PROJECT_NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: Globe },
  { id: 'tasks', label: 'Tasks', icon: ListTodo },
  { id: 'deliverables', label: 'Deliverables', icon: Package },
] as const;

export default function ProjectDetailPage({
  isSidebarExpanded = true,
}: {
  isSidebarExpanded?: boolean;
}) {
  const { activeProject } = useWorkspace();
  const [view, setView] = useState<ProjectView>('pm');
  const [isViewMenuOpen, setIsViewMenuOpen] = useState(false);
  const viewMenuRef = useRef<HTMLDivElement>(null);
  const [activeNavTab, setActiveNavTab] = useState<typeof PROJECT_NAV_ITEMS[number]['id']>('overview');

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (viewMenuRef.current && !viewMenuRef.current.contains(e.target as Node)) {
        setIsViewMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeTabLabel = PROJECT_NAV_ITEMS.find((item) => item.id === activeNavTab)?.label ?? '';

  const identityAndSwitcherRow = (
    <div className="flex items-center justify-between gap-4 p-6">
      <h1 className="text-2xl font-bold text-foreground">
        {activeTabLabel}
      </h1>

      {/* view switcher */}
      <div className="flex-shrink-0">
        <div id="view-switcher" ref={viewMenuRef} className="relative">
          <button
            onClick={() => setIsViewMenuOpen((prev) => !prev)}
            className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg text-xs font-medium bg-black/5 dark:bg-surface-container-high border border-border text-muted-foreground hover:text-foreground hover:border-outline transition-colors duration-200"
          >
            <LayoutFreeform size={14} strokeWidth={2} />
            <ChevronDown size={12} strokeWidth={2} />
          </button>

          {isViewMenuOpen && (
            <div className="absolute right-0 top-full mt-1 w-52 bg-surface dark:bg-surface-container-low border border-border shadow-2xl rounded-2xl p-4 text-sm z-50">
              <div className="space-y-0.5">
                <p className="text-[10px] font-medium text-outline uppercase tracking-wider px-2 py-1 mb-1">View as</p>
                {VIEWS.map((v) => (
                  <button
                    key={v.id}
                    id={`project-view-${v.id}-btn`}
                    onClick={() => {
                      setView(v.id);
                      setIsViewMenuOpen(false);
                    }}
                    className="w-full px-2.5 py-1.5 flex items-center justify-between rounded-lg hover:bg-surface-container-high hover:text-primary-green text-on-surface transition-colors text-left text-xs font-normal"
                  >
                    <span>{v.label}</span>
                    {view === v.id && <Check size={12} className="text-primary-green flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-full">
      <div
        id="project-nav"
        className={`max-w-7xl mx-auto ${isSidebarExpanded ? 'px-4 sm:px-6 lg:px-8' : 'pl-0 -ml-4 pr-4 sm:pr-6 lg:pr-8'}`}
      >
        <nav className="glass-sidebar inline-flex items-center gap-1 p-1 rounded-full">
          {PROJECT_NAV_ITEMS.map((item) => {
            const isActive = item.id === activeNavTab;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNavTab(item.id)}
                className={[
                  'flex items-center gap-2 pl-1.5 pr-4 py-1.5 rounded-full text-sm transition-colors',
                  isActive
                    ? 'bg-surface dark:bg-surface-container-low shadow-sm border border-black/5 dark:border-white/5 font-semibold text-foreground'
                    : 'font-medium text-muted-foreground hover:text-foreground',
                ].join(' ')}
              >
                <span
                  className={[
                    'w-6 h-6 flex items-center justify-center flex-shrink-0',
                    isActive
                      ? 'bg-primary-green/15 text-primary-green'
                      : 'text-muted-foreground',
                  ].join(' ')}
                >
                  <Icon size={13} strokeWidth={2} />
                </span>
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
      <div
        id="project-header"
        className={`max-w-7xl mx-auto py-6 pt-4 ${isSidebarExpanded ? 'px-4 sm:px-6 lg:px-8' : 'pl-0 -ml-4 pr-4 sm:pr-6 lg:pr-8'}`}
      >
        {activeNavTab === 'tasks' && (
          <>
            <div className="bg-surface dark:bg-surface-container-low rounded-2xl mb-4">
              {identityAndSwitcherRow}
            </div>
            <ProjectKanbanBoard />
          </>
        )}
        {activeNavTab === 'deliverables' && (
          <>
            <div className="bg-surface dark:bg-surface-container-low rounded-2xl mb-4">
              {identityAndSwitcherRow}
            </div>
            <div className="rounded-2xl border border-dashed border-border bg-surface dark:bg-surface-container-low flex flex-col items-center justify-center gap-3 py-24 text-center">
              <span className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-muted-foreground">
                <Package size={20} strokeWidth={2} />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">No deliverables yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Deliverables for this project will show up here.
                </p>
              </div>
            </div>
          </>
        )}
        {activeNavTab === 'overview' && (
          <div className="bg-surface dark:bg-surface-container-low rounded-2xl">
            <div className="flex items-start justify-between gap-4 p-6">
              {/* Left: identity */}
              <div className="min-w-0">
                <h1 className="text-2xl font-bold text-foreground">
                  {activeTabLabel}
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-border text-on-surface">
                    <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                    À risque
                  </span>
                </div>
              </div>

              {/* Right: view switcher */}
              <div className="flex-shrink-0">
                <div id="view-switcher" ref={viewMenuRef} className="relative">
                  <button
                    onClick={() => setIsViewMenuOpen((prev) => !prev)}
                    className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg text-xs font-medium bg-black/5 dark:bg-surface-container-high border border-border text-muted-foreground hover:text-foreground hover:border-outline transition-colors duration-200"
                  >
                    <LayoutFreeform size={14} strokeWidth={2} />
                    <ChevronDown size={12} strokeWidth={2} />
                  </button>

                  {isViewMenuOpen && (
                    <div className="absolute right-0 top-full mt-1 w-52 bg-surface dark:bg-surface-container-low border border-border shadow-2xl rounded-2xl p-4 text-sm z-50">
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-medium text-outline uppercase tracking-wider px-2 py-1 mb-1">View as</p>
                        {VIEWS.map((v) => (
                          <button
                            key={v.id}
                            id={`project-view-${v.id}-btn`}
                            onClick={() => {
                              setView(v.id);
                              setIsViewMenuOpen(false);
                            }}
                            className="w-full px-2.5 py-1.5 flex items-center justify-between rounded-lg hover:bg-surface-container-high hover:text-primary-green text-on-surface transition-colors text-left text-xs font-normal"
                          >
                            <span>{v.label}</span>
                            {view === v.id && <Check size={12} className="text-primary-green flex-shrink-0" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Team + Active agents */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-6 pb-6">
              <div className="rounded-2xl border border-dashed border-border p-4 flex items-center gap-2">
                <span className="text-[10px] font-semibold text-outline uppercase tracking-wider flex-shrink-0">Team</span>
                <span className="text-sm text-on-surface">
                  <strong className="font-bold text-foreground">{activeProject?.teamSize ?? 0}</strong> people have access to this project
                </span>
              </div>
              <div
                onClick={() => window.dispatchEvent(new CustomEvent('open-agent-rail'))}
                className="group cursor-pointer rounded-2xl bg-black/90 hover:bg-black p-4 flex items-center justify-between text-white backdrop-blur-sm transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold">{ACTIVE_AGENTS_COUNT}</span>
                  <span className="text-sm font-medium">Active agents</span>
                </div>
                <span className="text-xs text-white/70 group-hover:text-primary-green transition-colors duration-200 flex-shrink-0 flex items-center gap-1">
                  Ask Agent <ArrowRight size={12} />
                </span>
              </div>
            </div>

            {/* Banner */}
            <div
              id="project-banner"
              className="relative rounded-2xl bg-surface-container-low dark:bg-surface-container bg-cover bg-center p-4 overflow-hidden"
              style={{ backgroundImage: activeProject?.image ? `url("${activeProject.image}")` : undefined }}
            >
              <div className="absolute inset-0 bg-black/65" />
              <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-3">
                {/* Left: Vision */}
                <div className="lg:col-span-2 rounded-2xl p-4 text-white flex flex-col justify-between">
                  <div className="max-w-md">
                    <p className="text-[10px] font-semibold text-white/70 uppercase tracking-wider mb-2 font-proza">Vision</p>
                    <p className="text-lg italic leading-relaxed font-proza">
                      “{activeProject?.vision}”
                    </p>
                  </div>

                  <div id="project-progress" className="flex items-center gap-4 mt-4 max-w-md">
                    <div className="flex-1 h-2 rounded-full bg-white/30 overflow-hidden">
                      <div
                        className="h-full bg-primary-green rounded-full"
                        style={{ width: `${activeProject?.phaseProgress ?? 0}%` }}
                      />
                    </div>
                    <div className="text-xs text-white/80 whitespace-nowrap">
                      Progression : {activeProject?.phaseProgress ?? 0} %
                    </div>
                  </div>
                </div>

                {/* Right: stacked stat cards */}
                <div className="flex flex-col gap-3">
                  <AnimatePresence mode="popLayout">
                    {STAT_CARDS[view].map((card, i) => (
                      <motion.div
                        key={`${view}-${i}`}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -24 }}
                        transition={{ duration: 0.3, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                        className={`group cursor-pointer rounded-2xl p-4 flex items-center justify-between backdrop-blur-sm text-white transition-colors duration-200 ${card.dark ? 'bg-black/40 hover:bg-black/50' : 'bg-white/10 hover:bg-white/20'}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold">{card.value}</span>
                          <span className="text-s font-medium">{card.label}</span>
                        </div>
                        <span className="text-xs text-white/70 group-hover:text-primary-green transition-colors duration-200 flex-shrink-0 flex items-center gap-1">{card.action} <ArrowRight size={12} /></span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
