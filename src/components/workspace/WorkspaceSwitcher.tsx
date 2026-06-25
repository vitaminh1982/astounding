import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Settings,
  UserPlus,
  LogOut,
  Check,
  MoreHorizontal,
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

interface WorkspaceSwitcherProps {
  collapsed?: boolean;
}

export default function WorkspaceSwitcher({ collapsed = false }: WorkspaceSwitcherProps) {
  const {
    accounts,
    activeWorkspace,
    switchWorkspace,
    createWorkspace,
    addAccount,
    logoutAll,
  } = useWorkspace();

  const [isOpen, setIsOpen] = useState(false);
  const [addingWorkspaceToAccount, setAddingWorkspaceToAccount] = useState<string | null>(null);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [newAccountEmail, setNewAccountEmail] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setAddingWorkspaceToAccount(null);
        setIsAddingAccount(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCreateWorkspace = (accountId: string) => {
    if (newWorkspaceName.trim()) {
      createWorkspace(accountId, newWorkspaceName.trim());
      setNewWorkspaceName('');
      setAddingWorkspaceToAccount(null);
    }
  };

  const handleAddAccount = () => {
    if (newAccountEmail.trim() && newAccountEmail.includes('@')) {
      addAccount(newAccountEmail.trim());
      setNewAccountEmail('');
      setIsAddingAccount(false);
      setIsOpen(false);
    }
  };

  const wsEmoji = (icon: string) =>
    icon === 'briefcase' ? '💼' : icon === 'user' ? '👤' : '🏢';

  return (
    <div ref={containerRef} className="relative w-full z-50">
      {/* ── Trigger ─────────────────────────────────────── */}
      <button
        onClick={() => setIsOpen(v => !v)}
        className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none group"
        aria-expanded={isOpen}
      >
        {/* Workspace icon */}
        <span className="flex-shrink-0 w-7 h-7 rounded-md bg-black/10 dark:bg-white/10 flex items-center justify-center text-base leading-none">
          {wsEmoji(activeWorkspace.icon)}
        </span>

        {/* Name + plan */}
        <span className="flex-1 min-w-0 text-left">
          <span className="block text-xs font-medium text-gray-900 dark:text-gray-100 truncate leading-tight">
            {activeWorkspace.name}
          </span>
          <span className="block text-[10px] font-normal text-gray-500 dark:text-gray-400 truncate leading-tight">
            {activeWorkspace.plan}
          </span>
        </span>

        {/* Chevron */}
        {isOpen
          ? <ChevronUp size={14} className="flex-shrink-0 text-gray-400" />
          : <ChevronDown size={14} className="flex-shrink-0 text-gray-400" />
        }
      </button>

      {/* ── Popover Panel ───────────────────────────────── */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-[#141414] border border-black/10 dark:border-white/10 shadow-xl rounded-xl overflow-hidden z-50 text-sm">

          {/* Header: workspace info + quick actions */}
          <div className="px-3 pt-3 pb-2">
            <div className="flex items-center gap-2.5 mb-2.5">
              <span className="w-9 h-9 rounded-lg bg-black/10 dark:bg-white/10 flex items-center justify-center text-lg flex-shrink-0">
                {wsEmoji(activeWorkspace.icon)}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                  {activeWorkspace.name}
                </p>
                <p className="text-[10px] font-normal text-gray-500 dark:text-gray-400">
                  {activeWorkspace.plan} · {activeWorkspace.members}
                </p>
              </div>
            </div>

            {/* Settings & Invite row */}
            <div className="flex gap-1.5">
              <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md border border-black/10 dark:border-white/10 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <Settings size={12} />
                Settings
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md border border-black/10 dark:border-white/10 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <UserPlus size={12} />
                Invite members
              </button>
            </div>
          </div>

          <div className="border-t border-black/8 dark:border-white/8" />

          {/* Accounts + workspaces list */}
          <div className="max-h-[480px] overflow-y-auto px-1.5 py-2 space-y-3">
            {accounts.map((account) => (
              <div key={account.id}>
                {/* Account row */}
                <div className="flex items-center justify-between px-1.5 mb-0.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500">
                      {account.avatar.length > 2 ? '👤' : account.avatar}
                    </span>
                    <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 truncate">
                      {account.email}
                    </span>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0">
                    <MoreHorizontal size={13} />
                  </button>
                </div>

                {/* Workspaces under account */}
                <div className="pl-3 space-y-0.5">
                  {account.workspaces.map((ws) => {
                    const isActive = ws.id === activeWorkspace.id;
                    
                    const getPlanPillText = (plan: string) => {
                      const p = plan.toLowerCase();
                      if (p.includes('free')) return null;
                      if (p.includes('pro')) return 'Pro';
                      if (p.includes('starter')) return 'Starter';
                      if (p.includes('enterprise')) return 'Enterprise';
                      return plan;
                    };
                    const pillText = getPlanPillText(ws.plan);

                    return (
                      <button
                        key={ws.id}
                        onClick={() => {
                          switchWorkspace(account.id, ws.id);
                          setIsOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg transition-colors text-left ${
                          isActive
                            ? 'bg-black/5 dark:bg-white/5 text-gray-900 dark:text-gray-100 font-medium'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 font-normal'
                        }`}
                      >
                        <span className="flex items-center gap-2 truncate">
                          <span className="text-xs leading-none">{wsEmoji(ws.icon)}</span>
                          <span className="text-xs truncate">{ws.name}</span>
                          {pillText && (
                            <span className="text-[10px] bg-black/5 dark:bg-white/10 text-gray-600 dark:text-gray-300 border border-black/10 dark:border-white/10 px-1.5 py-0.5 rounded font-normal uppercase flex-shrink-0">
                              {pillText}
                            </span>
                          )}
                        </span>
                        {isActive && <Check size={13} className="flex-shrink-0 text-gray-700 dark:text-gray-200" />}
                      </button>
                    );
                  })}

                  {/* New workspace inline form */}
                  {addingWorkspaceToAccount === account.id ? (
                    <div className="flex items-center gap-1 py-0.5">
                      <input
                        type="text"
                        placeholder="Workspace name…"
                        value={newWorkspaceName}
                        onChange={(e) => setNewWorkspaceName(e.target.value)}
                        className="flex-1 min-w-0 bg-transparent border border-black/20 dark:border-white/20 rounded px-2 py-1 text-xs font-normal focus:outline-none focus:border-black/50 dark:focus:border-white/50"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleCreateWorkspace(account.id);
                          if (e.key === 'Escape') setAddingWorkspaceToAccount(null);
                        }}
                      />
                      <button
                        onClick={() => handleCreateWorkspace(account.id)}
                        className="px-2 py-1 rounded bg-black dark:bg-white text-white dark:text-black text-xs font-medium"
                      >
                        Add
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAddingWorkspaceToAccount(account.id)}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-normal text-gray-500 dark:text-gray-400 hover:text-gray-850 dark:hover:text-gray-200 text-left transition-colors"
                    >
                      <Plus size={11} />
                      New workspace
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-black/8 dark:border-white/8" />

          {/* Footer */}
          <div className="px-1.5 py-1.5 space-y-0.5">
            {isAddingAccount ? (
              <div className="flex items-center gap-1 p-1">
                <input
                  type="email"
                  placeholder="name@email.com"
                  value={newAccountEmail}
                  onChange={(e) => setNewAccountEmail(e.target.value)}
                  className="flex-1 min-w-0 bg-transparent border border-black/20 dark:border-white/20 rounded px-2 py-1 text-xs font-normal focus:outline-none focus:border-black/50 dark:focus:border-white/50"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddAccount();
                    if (e.key === 'Escape') setIsAddingAccount(false);
                  }}
                />
                <button
                  onClick={handleAddAccount}
                  className="px-2 py-1 rounded bg-black dark:bg-white text-white dark:text-black text-xs font-medium"
                >
                  Link
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingAccount(true)}
                className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 text-left transition-colors"
              >
                <UserPlus size={13} className="text-gray-400" />
                <span className="text-xs font-medium">Add new account</span>
              </button>
            )}

            <button
              onClick={logoutAll}
              className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 text-left transition-colors"
            >
              <LogOut size={13} />
              <span className="text-xs font-medium">Log out all accounts</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
