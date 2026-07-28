import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import LayoutFreeform from '../components/icons/LayoutFreeform';
import { useWorkspace } from '../context/WorkspaceContext';

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

export default function ProjectDetailPage({
  isSidebarExpanded = true,
}: {
  isSidebarExpanded?: boolean;
}) {
  const { activeProject } = useWorkspace();
  const [view, setView] = useState<ProjectView>('pm');
  const [isViewMenuOpen, setIsViewMenuOpen] = useState(false);
  const viewMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (viewMenuRef.current && !viewMenuRef.current.contains(e.target as Node)) {
        setIsViewMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen">
      <div
        id="project-header"
        className={`max-w-7xl mx-auto py-6 pt-0 ${isSidebarExpanded ? 'px-4 sm:px-6 lg:px-8' : 'pl-0 -ml-4 pr-4 sm:pr-6 lg:pr-8'}`}
      >
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl">
          <div className="flex items-start justify-between gap-4 p-6">
            {/* Left: identity */}
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-lg flex-shrink-0">
                  {activeProject?.emoji}
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                  {activeProject?.industry}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {activeProject?.name ?? ''}
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  À risque
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {activeProject?.description}
              </p>
            </div>

            {/* Right: view switcher */}
            <div className="flex-shrink-0">
              <div id="view-switcher" ref={viewMenuRef} className="relative">
                <button
                  onClick={() => setIsViewMenuOpen((prev) => !prev)}
                  className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg text-xs font-medium bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[#666666] dark:text-[#999999] hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-200"
                >
                  <LayoutFreeform size={14} strokeWidth={2} />
                  <ChevronDown size={12} strokeWidth={2} />
                </button>

                {isViewMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-52 bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 shadow-2xl rounded-2xl p-4 text-sm z-50">
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 px-2 py-1 uppercase tracking-wider mb-1">View as</p>
                      {VIEWS.map((v) => (
                        <button
                          key={v.id}
                          id={`project-view-${v.id}-btn`}
                          onClick={() => {
                            setView(v.id);
                            setIsViewMenuOpen(false);
                          }}
                          className="w-full px-2.5 py-1.5 flex items-center justify-between rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 transition-colors text-left text-xs font-normal"
                        >
                          <span>{v.label}</span>
                          {view === v.id && <Check size={12} className="text-gray-800 dark:text-gray-200 flex-shrink-0" />}
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
            <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-4 flex items-center gap-2">
              <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex-shrink-0">Team</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                <strong className="font-bold text-gray-900 dark:text-gray-100">{activeProject?.teamSize ?? 0}</strong> people have access to this project
              </span>
            </div>
            <div className="rounded-2xl bg-gray-950 p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{ACTIVE_AGENTS_COUNT}</span>
                <span className="text-sm font-medium">Active agents</span>
              </div>
              <button className="text-xs text-gray-300 hover:text-green-400 transition-colors duration-200">Manage →</button>
            </div>
          </div>

          {/* Banner */}
          <div
            id="project-banner"
            className="relative rounded-2xl bg-gray-100 dark:bg-gray-800 bg-cover bg-center p-4 overflow-hidden"
            style={{ backgroundImage: activeProject?.image ? `url("${activeProject.image}")` : undefined }}
          >
            <div className="absolute inset-0 bg-black/65" />
            <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-3">
              {/* Left: Vision */}
              <div className="lg:col-span-2 rounded-2xl p-4 text-white flex flex-col justify-between">
                <div className="max-w-md">
                  <p className="text-[10px] font-semibold text-gray-200 uppercase tracking-wider mb-2">Vision</p>
                  <p className="text-lg italic leading-relaxed">
                    “{activeProject?.vision}”
                  </p>
                </div>

                <div id="project-progress" className="flex items-center gap-4 mt-4 max-w-md">
                  <div className="flex-1 h-2 rounded-full bg-white/30 overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${activeProject?.phaseProgress ?? 0}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-200 whitespace-nowrap">
                    Progression : {activeProject?.phaseProgress ?? 0} %
                  </span>
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
                      <span className="text-xs text-gray-300 group-hover:text-green-400 transition-colors duration-200 flex-shrink-0">{card.action} →</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
