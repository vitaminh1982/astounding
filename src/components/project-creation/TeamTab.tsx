import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, X, Users, Activity } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Collaborator } from '../../types/project-creation';

interface Props {
  collaborators: Collaborator[];
  onAddCollaborator: (collab: Collaborator) => void;
}

export default function TeamTab({ collaborators, onAddCollaborator }: Props) {
  const [showInvite, setShowInvite] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Collaborator['role']>('editor');

  function handleInvite() {
    if (!email.trim()) return;
    const name = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    onAddCollaborator({
      id: uuidv4(),
      name,
      email: email.trim(),
      role,
      isOnline: false,
      lastActivity: 'Just invited',
    });
    setEmail('');
    setShowInvite(false);
  }

  const activityLog = [
    { id: '1', action: 'Joined the project', user: 'You', time: 'Just now' },
    { id: '2', action: 'Created initial tasks', user: 'Oscar (AI)', time: '1 min ago' },
    { id: '3', action: 'Started risk assessment', user: 'Max (AI)', time: '2 min ago' },
    { id: '4', action: 'Drafting project charter', user: 'Aria (AI)', time: '3 min ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-muted-foreground dark:text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground dark:text-foreground">Team & Access</h3>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-tertiary dark:bg-green-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-green-700 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Invite Collaborator
        </button>
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInvite && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => setShowInvite(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-surface-container-high rounded-2xl border border-border dark:border-border p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-foreground dark:text-foreground">Invite Collaborator</h4>
                <button onClick={() => setShowInvite(false)} className="text-outline hover:text-muted-foreground dark:hover:text-on-surface-variant">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface dark:text-muted-foreground mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="colleague@company.com"
                    className="w-full px-3 py-2 border border-border dark:border-border rounded-lg bg-white dark:bg-surface-container-highest text-foreground dark:text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-on-surface dark:text-muted-foreground mb-1">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as Collaborator['role'])}
                    className="w-full px-3 py-2 border border-border dark:border-border rounded-lg bg-white dark:bg-surface-container-highest text-foreground dark:text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="viewer">Viewer (read-only)</option>
                    <option value="editor">Editor (can edit tasks)</option>
                    <option value="admin">Admin (full access)</option>
                  </select>
                </div>

                <button
                  onClick={handleInvite}
                  disabled={!email.trim()}
                  className="w-full py-2.5 bg-tertiary dark:bg-green-600 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-green-700 disabled:opacity-40 transition-colors text-sm"
                >
                  Send Invitation
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Collaborator Cards */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-on-surface dark:text-muted-foreground">Members ({collaborators.length})</h4>
          {collaborators.map((collab, i) => (
            <motion.div
              key={collab.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-surface-container-high rounded-xl border border-border dark:border-border p-4 flex items-center gap-4"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-sm font-semibold text-tertiary dark:text-tertiary">
                  {collab.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${collab.isOnline ? 'bg-green-500' : 'bg-outline-variant'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground dark:text-foreground truncate">{collab.name}</p>
                <p className="text-xs text-muted-foreground dark:text-muted-foreground">{collab.email}</p>
              </div>
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                collab.role === 'admin' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-destructive' :
                collab.role === 'editor' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-tertiary' :
                'bg-surface-container-low dark:bg-surface-container-highest text-muted-foreground dark:text-muted-foreground'
              }`}>
                {collab.role}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Activity Log */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-muted-foreground dark:text-muted-foreground" />
            <h4 className="text-sm font-semibold text-on-surface dark:text-muted-foreground">Recent Activity</h4>
          </div>
          <div className="bg-white dark:bg-surface-container-high rounded-xl border border-border dark:border-border divide-y divide-gray-100 dark:divide-gray-700">
            {activityLog.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="px-4 py-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm text-on-surface dark:text-muted-foreground">
                    <span className="font-medium">{entry.user}</span>{' '}
                    <span className="text-muted-foreground dark:text-muted-foreground">{entry.action}</span>
                  </p>
                </div>
                <span className="text-xs text-outline dark:text-muted-foreground flex-shrink-0">{entry.time}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
