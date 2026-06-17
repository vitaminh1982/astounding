import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Kanban, FileText, MessageSquare, Users, CheckSquare, AlertTriangle, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useProjectCreation } from '../../context/ProjectCreationContext';
import { WorkspaceTab, Collaborator } from '../../types/project-creation';
import DashboardTab from './DashboardTab';
import KanbanTab from './KanbanTab';
import DocumentsTab from './DocumentsTab';
import ProjectChatTab from './ProjectChatTab';
import TeamTab from './TeamTab';

const TABS: { id: WorkspaceTab; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'kanban', label: 'Kanban', icon: <Kanban className="w-4 h-4" /> },
  { id: 'documents', label: 'Documents', icon: <FileText className="w-4 h-4" /> },
  { id: 'chat', label: 'Chat', icon: <MessageSquare className="w-4 h-4" /> },
  { id: 'team', label: 'Team', icon: <Users className="w-4 h-4" /> },
];

export default function ProjectWorkspace() {
  const { state, dispatch } = useProjectCreation();
  const { project, activeTab } = state;
  const [showValidation, setShowValidation] = useState(false);
  const [showOverride, setShowOverride] = useState(false);
  const [overrideConfirmation, setOverrideConfirmation] = useState('');

  if (!project) return null;

  const currentPhase = project.phases[project.currentPhaseIndex];
  const allComplete = currentPhase.deliverables.every((d) => d.completed);
  const canAdvance = project.currentPhaseIndex < project.phases.length - 1;

  function handleCompleteDeliverable(deliverableId: string) {
    dispatch({
      type: 'COMPLETE_DELIVERABLE',
      payload: { phaseId: currentPhase.id, deliverableId },
    });
    toast.success('Deliverable marked complete');
  }

  function handleAdvancePhase() {
    if (allComplete) {
      dispatch({ type: 'ADVANCE_PHASE' });
      toast.success(`Phase "${currentPhase.name}" completed! Moving to next phase.`);
      setShowValidation(false);
    } else {
      setShowOverride(true);
    }
  }

  function handleForceAdvance() {
    if (overrideConfirmation === 'I understand the risks') {
      dispatch({ type: 'ADVANCE_PHASE' });
      toast('Phase force-advanced. Some deliverables incomplete.', { icon: '⚠️' });
      setShowOverride(false);
      setShowValidation(false);
      setOverrideConfirmation('');
    }
  }

  function handleAddCollaborator(collab: Collaborator) {
    if (!project) return;
    dispatch({
      type: 'SET_PROJECT',
      payload: { ...project, collaborators: [...project.collaborators, collab] },
    });
    toast.success(`${collab.name} has been invited`);
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{project.name}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {project.deliveryTrackLabel} | Phase: {currentPhase.name}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {canAdvance && (
            <button
              onClick={() => setShowValidation(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckSquare className="w-4 h-4" />
              Phase Checklist
            </button>
          )}
          <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'list' })}
            className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            All Projects
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab.id })}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors relative ${
                activeTab === tab.id
                  ? 'text-blue-600 dark:text-teal-400 bg-white dark:bg-gray-800 border border-b-0 border-gray-200 dark:border-gray-700'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
              aria-label={tab.label}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'dashboard' && <DashboardTab project={project} />}
          {activeTab === 'kanban' && <KanbanTab tasks={project.tasks} agents={project.agents} />}
          {activeTab === 'documents' && <DocumentsTab documents={project.documents} phases={project.phases} />}
          {activeTab === 'chat' && <ProjectChatTab project={project} />}
          {activeTab === 'team' && <TeamTab collaborators={project.collaborators} onAddCollaborator={handleAddCollaborator} />}
        </motion.div>
      </AnimatePresence>

      {/* Phase Validation Panel */}
      <AnimatePresence>
        {showValidation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => setShowValidation(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 w-full max-w-lg shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Phase Validation: {currentPhase.name}
                </h4>
                <button onClick={() => setShowValidation(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 mb-6">
                {currentPhase.deliverables.map((d) => (
                  <div key={d.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                    <button
                      onClick={() => !d.completed && handleCompleteDeliverable(d.id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        d.completed
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
                      }`}
                    >
                      {d.completed && <CheckSquare className="w-3 h-3" />}
                    </button>
                    <span className={`text-sm ${d.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                      {d.name}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleAdvancePhase}
                  className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                    allComplete
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-amber-600 text-white hover:bg-amber-700'
                  }`}
                >
                  {allComplete ? 'Advance to Next Phase' : 'Force Advance (Override)'}
                </button>
                <button
                  onClick={() => setShowValidation(false)}
                  className="px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Override Confirmation Modal */}
      <AnimatePresence>
        {showOverride && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50"
            onClick={() => setShowOverride(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center gap-2 mb-4 text-amber-600">
                <AlertTriangle className="w-5 h-5" />
                <h4 className="text-lg font-semibold">Override Phase Advance</h4>
              </div>

              <div className="mb-4 space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  The following deliverables are <strong>incomplete</strong>:
                </p>
                <ul className="text-sm text-red-600 dark:text-red-400 space-y-1 list-disc list-inside">
                  {currentPhase.deliverables.filter((d) => !d.completed).map((d) => (
                    <li key={d.id}>{d.name}</li>
                  ))}
                </ul>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                  Advancing with incomplete deliverables increases project risk. Type
                  <strong> "I understand the risks"</strong> to confirm.
                </p>
              </div>

              <input
                type="text"
                value={overrideConfirmation}
                onChange={(e) => setOverrideConfirmation(e.target.value)}
                placeholder="Type confirmation..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />

              <div className="flex gap-3">
                <button
                  onClick={handleForceAdvance}
                  disabled={overrideConfirmation !== 'I understand the risks'}
                  className="flex-1 py-2.5 bg-red-600 text-white rounded-lg font-medium text-sm hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Force Advance
                </button>
                <button
                  onClick={() => { setShowOverride(false); setOverrideConfirmation(''); }}
                  className="px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
