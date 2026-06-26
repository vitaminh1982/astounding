import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ─── Minimal project shape (enough for the switcher) ─────────────────────────

export interface WorkspaceProject {
  id: string;
  name: string;
  deliveryTrackLabel: string;
  emoji: string;
  color: string; // tailwind bg color token e.g. 'violet', 'amber', 'sky'
  image: string;
}

// ─── Workspace / Account types ────────────────────────────────────────────────

export interface Workspace {
  id: string;
  name: string;
  icon: 'briefcase' | 'user' | 'acme' | 'default';
  plan: string;
  members: string;
  projects: WorkspaceProject[];
}

export interface Account {
  id: string;
  email: string;
  orgName: string;
  avatar: string;
  workspaces: Workspace[];
}

interface WorkspaceContextType {
  accounts: Account[];
  activeAccountId: string;
  activeWorkspaceId: string;
  activeWorkspace: Workspace;
  activeAccount: Account;
  activeProjectId: string | null;
  activeProject: WorkspaceProject | null;
  switchWorkspace: (accountId: string, workspaceId: string) => void;
  switchProject: (projectId: string | null) => void;
  addProjectToWorkspace: (project: WorkspaceProject) => void;
  createWorkspace: (accountId: string, name: string) => void;
  addAccount: (email: string) => void;
  logoutAll: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};

// ─── Mock data ────────────────────────────────────────────────────────────────

import defaultAccountsRaw from '../data/default_accounts.json';
const DEFAULT_ACCOUNTS = defaultAccountsRaw as Account[];


// ─── Provider ─────────────────────────────────────────────────────────────────

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const [accounts, setAccounts] = useState<Account[]>(() => {
    const saved = localStorage.getItem('app-accounts');
    if (saved) {
      try {
        const parsed: Account[] = JSON.parse(saved);
        // Always re-sync defaults so new project data is picked up
        return parsed.map(acc => {
          const defaultAcc = DEFAULT_ACCOUNTS.find(d => d.id === acc.id);
          if (defaultAcc) return defaultAcc;
          return acc;
        });
      } catch (e) {
        console.error('Failed to parse saved accounts:', e);
      }
    }
    return DEFAULT_ACCOUNTS;
  });

  const [activeAccountId, setActiveAccountId] = useState<string>(() =>
    localStorage.getItem('app-active-account-id') || 'miranki'
  );

  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>(() =>
    localStorage.getItem('app-active-workspace-id') || 'miranki-ws'
  );

  const [activeProjectId, setActiveProjectId] = useState<string | null>(() =>
    localStorage.getItem('app-active-project-id') || null
  );

  // Persist to localStorage
  useEffect(() => { localStorage.setItem('app-accounts', JSON.stringify(accounts)); }, [accounts]);
  useEffect(() => { localStorage.setItem('app-active-account-id', activeAccountId); }, [activeAccountId]);
  useEffect(() => { localStorage.setItem('app-active-workspace-id', activeWorkspaceId); }, [activeWorkspaceId]);
  useEffect(() => {
    if (activeProjectId) localStorage.setItem('app-active-project-id', activeProjectId);
    else localStorage.removeItem('app-active-project-id');
  }, [activeProjectId]);

  const activeAccount = accounts.find(a => a.id === activeAccountId) || accounts[0];
  const activeWorkspace = activeAccount.workspaces.find(w => w.id === activeWorkspaceId) || activeAccount.workspaces[0];

  // When workspace changes, auto-select first project or clear
  useEffect(() => {
    const projects = activeWorkspace.projects || [];
    if (projects.length > 0) {
      const stillExists = projects.some(p => p.id === activeProjectId);
      if (!stillExists) setActiveProjectId(projects[0].id);
    } else {
      setActiveProjectId(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeWorkspaceId]);

  const activeProject = (activeWorkspace.projects || []).find(p => p.id === activeProjectId) || null;

  const switchWorkspace = (accountId: string, workspaceId: string) => {
    setActiveAccountId(accountId);
    setActiveWorkspaceId(workspaceId);
  };

  const switchProject = (projectId: string | null) => {
    setActiveProjectId(projectId);
  };

  const addProjectToWorkspace = (project: WorkspaceProject) => {
    setAccounts(prev =>
      prev.map(account => ({
        ...account,
        workspaces: account.workspaces.map(ws => {
          if (ws.id === activeWorkspaceId) {
            return { ...ws, projects: [...ws.projects, project] };
          }
          return ws;
        }),
      }))
    );
    setActiveProjectId(project.id);
  };

  const createWorkspace = (accountId: string, name: string) => {
    setAccounts(prev =>
      prev.map(account => {
        if (account.id === accountId) {
          const newWs: Workspace = {
            id: `${accountId}-${Date.now()}`,
            name,
            icon: 'default',
            plan: 'Free Plan',
            members: '1 member',
            projects: [],
          };
          return { ...account, workspaces: [...account.workspaces, newWs] };
        }
        return account;
      })
    );
  };

  const addAccount = (email: string) => {
    const id = email.split('@')[0] + '-' + Date.now();
    const domain = email.split('@')[1] || '';
    const rawOrg = domain.split('.')[0];
    const orgName = rawOrg
      ? rawOrg.charAt(0).toUpperCase() + rawOrg.slice(1)
      : email.split('@')[0];
    const newAccount: Account = {
      id,
      email,
      orgName,
      avatar: '👤',
      workspaces: [
        {
          id: `${id}-default`,
          name: `${orgName}'s Workspace`,
          icon: 'user',
          plan: 'Free Plan',
          members: '1 member',
          projects: [],
        },
      ],
    };
    setAccounts(prev => [...prev, newAccount]);
    setActiveAccountId(id);
    setActiveWorkspaceId(`${id}-default`);
  };

  const logoutAll = () => {
    setAccounts(DEFAULT_ACCOUNTS);
    setActiveAccountId('miranki');
    setActiveWorkspaceId('miranki-ws');
    setActiveProjectId(null);
  };

  return (
    <WorkspaceContext.Provider
      value={{
        accounts,
        activeAccountId,
        activeWorkspaceId,
        activeWorkspace,
        activeAccount,
        activeProjectId,
        activeProject,
        switchWorkspace,
        switchProject,
        addProjectToWorkspace,
        createWorkspace,
        addAccount,
        logoutAll,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};
