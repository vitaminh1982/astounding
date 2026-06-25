import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Workspace {
  id: string;
  name: string;
  icon: 'briefcase' | 'user' | 'acme' | 'default';
  plan: string;
  members: string;
}

export interface Account {
  id: string;
  email: string;
  orgName: string; // Display name of the organisation / account
  avatar: string; // URL or letters or emojis
  workspaces: Workspace[];
}

interface WorkspaceContextType {
  accounts: Account[];
  activeAccountId: string;
  activeWorkspaceId: string;
  activeWorkspace: Workspace;
  activeAccount: Account;
  switchWorkspace: (accountId: string, workspaceId: string) => void;
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

const DEFAULT_ACCOUNTS: Account[] = [
  {
    id: 'personal',
    email: 'oppieadirono@gmail.com',
    orgName: 'Personal',
    avatar: '👤',
    workspaces: [
      {
        id: 'oppie-ws',
        name: "Oppie's Workspace",
        icon: 'user',
        plan: 'Free',
        members: '1 member',
      },
      {
        id: 'family-ws',
        name: 'Family',
        icon: 'briefcase',
        plan: 'Pro',
        members: '4 members',
      }
    ]
  },
  {
    id: 'miranki',
    email: 'oppie.adirono@miranki.com',
    orgName: 'Miranki',
    avatar: '💼',
    workspaces: [
      {
        id: 'miranki-ws',
        name: 'Miranki workspace',
        icon: 'briefcase',
        plan: 'Starter plan',
        members: '3 members',
      },
      {
        id: 'second-ws',
        name: 'Second workspace',
        icon: 'default',
        plan: 'Free',
        members: '1 member',
      }
    ]
  },
  {
    id: 'acme',
    email: 'oppie@acme.com',
    orgName: 'Acme Corp',
    avatar: '🏢',
    workspaces: [
      {
        id: 'acme-ws',
        name: 'Acme workspace',
        icon: 'acme',
        plan: 'Enterprise plan',
        members: '12 members',
      }
    ]
  }
];

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const [accounts, setAccounts] = useState<Account[]>(() => {
    const saved = localStorage.getItem('app-accounts');
    if (saved) {
      try {
        const parsed: Account[] = JSON.parse(saved);
        
        // Sync cached default accounts with new defaults, keep custom ones
        return parsed.map(acc => {
          const defaultAcc = DEFAULT_ACCOUNTS.find(d => d.id === acc.id);
          if (defaultAcc) {
            return defaultAcc;
          }
          return acc;
        });
      } catch (e) {
        console.error('Failed to parse saved accounts:', e);
      }
    }
    return DEFAULT_ACCOUNTS;
  });

  const [activeAccountId, setActiveAccountId] = useState<string>(() => {
    return localStorage.getItem('app-active-account-id') || 'miranki';
  });

  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>(() => {
    return localStorage.getItem('app-active-workspace-id') || 'miranki-ws';
  });

  useEffect(() => {
    localStorage.setItem('app-accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('app-active-account-id', activeAccountId);
  }, [activeAccountId]);

  useEffect(() => {
    localStorage.setItem('app-active-workspace-id', activeWorkspaceId);
  }, [activeWorkspaceId]);

  const activeAccount = accounts.find(a => a.id === activeAccountId) || accounts[0];
  const activeWorkspace = activeAccount.workspaces.find(w => w.id === activeWorkspaceId) || activeAccount.workspaces[0];

  const switchWorkspace = (accountId: string, workspaceId: string) => {
    setActiveAccountId(accountId);
    setActiveWorkspaceId(workspaceId);
  };

  const createWorkspace = (accountId: string, name: string) => {
    setAccounts(prev => prev.map(account => {
      if (account.id === accountId) {
        const newWs: Workspace = {
          id: `${accountId}-${Date.now()}`,
          name,
          icon: 'default',
          plan: 'Free Plan',
          members: '1 member'
        };
        return {
          ...account,
          workspaces: [...account.workspaces, newWs]
        };
      }
      return account;
    }));
  };

  const addAccount = (email: string) => {
    const id = email.split('@')[0] + '-' + Date.now();
    const domain = email.split('@')[1] || '';
    // Derive a friendly org name from the domain (strip TLD) or fall back to username
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
          members: '1 member'
        }
      ]
    };
    setAccounts(prev => [...prev, newAccount]);
    setActiveAccountId(id);
    setActiveWorkspaceId(`${id}-default`);
  };

  const logoutAll = () => {
    setAccounts(DEFAULT_ACCOUNTS);
    setActiveAccountId('miranki');
    setActiveWorkspaceId('miranki-ws');
  };

  return (
    <WorkspaceContext.Provider value={{
      accounts,
      activeAccountId,
      activeWorkspaceId,
      activeWorkspace,
      activeAccount,
      switchWorkspace,
      createWorkspace,
      addAccount,
      logoutAll
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
};
