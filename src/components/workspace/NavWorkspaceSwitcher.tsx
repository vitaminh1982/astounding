import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Settings, UserPlus, Check, Plus } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

function getPlanPill(plan: string): string | null {
  const key = plan.toLowerCase();
  if (key.includes('free')) return null;
  if (key.includes('pro')) return 'Pro';
  if (key.includes('starter')) return 'Starter';
  if (key.includes('enterprise')) return 'Enterprise';
  return plan;
}

const wsEmoji = (icon: string) =>
  icon === 'briefcase' ? '💼' : icon === 'user' ? '👤' : '🏢';

export default function NavWorkspaceSwitcher() {
  const { activeAccount, activeWorkspace, switchWorkspace } = useWorkspace();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const pill = getPlanPill(activeWorkspace.plan);

  return (
    <div ref={containerRef} className="relative w-full z-50">

      {/* Trigger */}
      <button
        onClick={() => setIsOpen(v => !v)}
        className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-lg transition-colors focus:outline-none ${isOpen
          ? 'bg-black/5 dark:bg-white/5'
          : 'hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        aria-expanded={isOpen}
      >
        <span className="flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-base leading-none">
          {wsEmoji(activeWorkspace.icon)}
        </span>
        <span className="flex-1 min-w-0 text-left">
          <span className="block text-xs font-medium text-foreground dark:text-foreground truncate leading-tight">
            {activeWorkspace.name}
          </span>
          <span className="block text-[10px] font-normal text-muted-foreground dark:text-muted-foreground truncate leading-tight">
            {activeWorkspace.plan}
          </span>
        </span>
        {isOpen
          ? <ChevronUp size={14} className="flex-shrink-0 text-outline" />
          : <ChevronDown size={14} className="flex-shrink-0 text-outline" />}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-[280px] bg-white dark:bg-[var(--color-surface-container-low)] border border-black/10 dark:border-white/10 shadow-xl rounded-xl overflow-hidden z-50 text-sm">

          {/* Header */}
          <div className="px-3 pt-3 pb-2.5">
            <div className="flex items-center gap-2.5 mb-2.5">
              <span className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                {wsEmoji(activeWorkspace.icon)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground dark:text-foreground truncate">
                  {activeWorkspace.name}
                </p>
                <p className="text-[10px] font-normal text-muted-foreground dark:text-muted-foreground mt-0.5">
                  {activeWorkspace.plan} · {activeWorkspace.members}
                </p>
              </div>
            </div>

            {/* Settings & Invite */}
            <div className="flex gap-1.5">
              <button className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md border border-black/10 dark:border-white/10 text-[11px] font-medium text-muted-foreground dark:text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors whitespace-nowrap">
                <Settings size={12} className="flex-shrink-0" />
                Settings
              </button>
              <button className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md border border-black/10 dark:border-white/10 text-[11px] font-medium text-muted-foreground dark:text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors whitespace-nowrap">
                <UserPlus size={12} className="flex-shrink-0" />
                Invite members
              </button>
            </div>
          </div>

          <div className="border-t border-black/8 dark:border-white/8" />

          {/* Workspace list — active account only */}
          <div className="max-h-[320px] overflow-y-auto px-2 py-2 space-y-0.5">
            {activeAccount.workspaces.map((ws) => {
              const isActive = ws.id === activeWorkspace.id;
              const wsPill = getPlanPill(ws.plan);
              return (
                <button
                  key={ws.id}
                  onClick={() => {
                    switchWorkspace(activeAccount.id, ws.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-colors text-left ${isActive
                    ? 'bg-black/5 dark:bg-white/5'
                    : 'hover:bg-black/4 dark:hover:bg-white/4'
                    }`}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <span className="w-7 h-7 rounded-md flex items-center justify-center text-sm leading-none flex-shrink-0">
                      {wsEmoji(ws.icon)}
                    </span>
                    <span className={`text-xs truncate ${isActive ? 'font-semibold text-foreground dark:text-foreground' : 'font-medium text-on-surface dark:text-muted-foreground'}`}>
                      {ws.name}
                    </span>
                    {wsPill && (
                      <span className="text-[10px] bg-black/5 dark:bg-white/10 text-muted-foreground dark:text-muted-foreground border border-black/10 dark:border-white/10 px-1.5 py-0.5 rounded font-normal flex-shrink-0">
                        {wsPill}
                      </span>
                    )}
                  </span>
                  {isActive && <Check size={13} className="flex-shrink-0 text-muted-foreground dark:text-muted-foreground" />}
                </button>
              );
            })}
          </div>

          <div className="border-t border-black/8 dark:border-white/8 mx-2" />

          {/* New workspace — green CTA */}
          <div className="p-2">
            <button className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-primary-green hover:underline transition-colors focus:outline-none">
              <Plus size={13} strokeWidth={2.5} />
              New workspace
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
