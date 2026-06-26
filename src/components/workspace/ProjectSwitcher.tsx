import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Plus, Check } from 'lucide-react';
import { useWorkspace, WorkspaceProject } from '../../context/WorkspaceContext';
import type { Page } from '../../App';

interface ProjectSwitcherProps {
  onNavigate: (page: Page) => void;
}

// Map color token → bg + text classes (light/dark)
const COLOR_MAP: Record<string, { bg: string; text: string }> = {
  violet:  { bg: 'bg-violet-200',  text: 'text-violet-800'  },
  amber:   { bg: 'bg-amber-200',   text: 'text-amber-800'   },
  emerald: { bg: 'bg-emerald-200', text: 'text-emerald-800' },
  sky:     { bg: 'bg-sky-200',     text: 'text-sky-800'     },
  indigo:  { bg: 'bg-indigo-200',  text: 'text-indigo-800'  },
  rose:    { bg: 'bg-rose-200',    text: 'text-rose-800'    },
  teal:    { bg: 'bg-teal-200',    text: 'text-teal-800'    },
  blue:    { bg: 'bg-blue-200',    text: 'text-blue-800'    },
};

function ProjectAvatar({ project, size = 'sm' }: { project: WorkspaceProject; size?: 'sm' | 'md' }) {
  const colors = COLOR_MAP[project.color] ?? COLOR_MAP['indigo'];
  const dim = size === 'md' ? 'w-8 h-8 text-base' : 'w-7 h-7 text-sm';
  return (
    <span
      className={`flex-shrink-0 ${dim} rounded-lg ${colors.bg} flex items-center justify-center leading-none`}
    >
      {project.emoji}
    </span>
  );
}

export default function ProjectSwitcher({ onNavigate }: ProjectSwitcherProps) {
  const { activeWorkspace, activeProject, switchProject } = useWorkspace();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const projects = activeWorkspace.projects ?? [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ── CTA when workspace has no projects ──────────────────────────────────────
  if (projects.length === 0) {
    return (
      <button
        onClick={() => onNavigate('projects')}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-400 hover:to-emerald-300 text-[#0d2b1a] text-xs font-semibold transition-all shadow-md shadow-green-500/25 focus:outline-none"
      >
        <Plus size={13} strokeWidth={2.5} />
        Start new project
      </button>
    );
  }

  // ── Dropdown when workspace has projects ─────────────────────────────────────
  const displayed = activeProject ?? projects[0];

  return (
    <div ref={containerRef} className="relative w-full z-50">

      {/* ── Trigger ──────────────────────────────────────────────────────────── */}
      <button
        onClick={() => setIsOpen(v => !v)}
        className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none border ${
          isOpen
            ? 'border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5'
            : 'border-black/10 dark:border-white/10'
        }`}
        aria-expanded={isOpen}
      >
        <ProjectAvatar project={displayed} size="sm" />
        <span className="flex-1 min-w-0 text-left">
          <span className="block text-xs font-medium text-gray-900 dark:text-gray-100 truncate leading-tight">
            {displayed.name}
          </span>
          <span className="block text-[10px] font-normal text-gray-500 dark:text-gray-400 truncate leading-tight">
            {displayed.deliveryTrackLabel}
          </span>
        </span>
        {isOpen
          ? <ChevronUp size={14} className="flex-shrink-0 text-gray-400" />
          : <ChevronDown size={14} className="flex-shrink-0 text-gray-400" />}
      </button>

      {/* ── Dropdown panel ───────────────────────────────────────────────────── */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-[#141414] border border-black/10 dark:border-white/10 shadow-xl rounded-xl overflow-hidden z-50">

          {/* Header label */}
          <div className="px-3 pt-3 pb-1">
            <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Projects in this workspace
            </p>
          </div>

          {/* Project list */}
          <div className="max-h-[320px] overflow-y-auto px-2 pb-2 space-y-1">
            {projects.map(proj => {
              const isActive = displayed.id === proj.id;
              return (
                <button
                  key={proj.id}
                  onClick={() => {
                    switchProject(proj.id);
                    setIsOpen(false);
                    onNavigate('projects');
                  }}
                  className={`w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl transition-colors text-left ${
                    isActive
                      ? 'bg-black/5 dark:bg-white/5'
                      : 'hover:bg-black/4 dark:hover:bg-white/4'
                  }`}
                >
                  <ProjectAvatar project={proj} size="md" />
                  <span className="flex-1 min-w-0">
                    <span className={`block text-xs truncate leading-tight ${
                      isActive
                        ? 'font-semibold text-gray-900 dark:text-gray-100'
                        : 'font-medium text-gray-700 dark:text-gray-300'
                    }`}>
                      {proj.name}
                    </span>
                    <span className="block text-[10px] font-normal text-gray-400 dark:text-gray-500 truncate leading-tight mt-0.5">
                      {proj.deliveryTrackLabel}
                    </span>
                  </span>
                  {isActive && <Check size={14} className="flex-shrink-0 text-gray-600 dark:text-gray-300" />}
                </button>
              );
            })}
          </div>

          <div className="border-t border-black/8 dark:border-white/8 mx-2" />

          {/* Create new project */}
          <div className="p-2">
            <button
              onClick={() => {
                switchProject(null);
                setIsOpen(false);
                onNavigate('projects');
              }}
              className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-primary-green hover:underline transition-colors focus:outline-none"
            >
              <Plus size={13} strokeWidth={2.5} />
              Create new project
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
