import React, { useState, useRef, useEffect } from 'react';
import { Template } from '../../../../types/template';
import { Save, Send, Copy, Power, Trash2, MoreVertical, Loader2, Check, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ActionButtonsProps {
  template: Template;
  onSave: (template: Template) => void;
  onPublish?: (template: Template) => void;
  onDuplicate?: (template: Template) => void;
  onDeactivate?: (template: Template) => void;
  onDelete?: (template: Template) => void;
  isSaving?: boolean;
  isPublishing?: boolean;
  isDirty?: boolean;
}

type ActionState = {
  [key: string]: boolean;
};

export default function ActionButtons({ 
  template, 
  onSave,
  onPublish,
  onDuplicate,
  onDeactivate,
  onDelete,
  isSaving = false,
  isPublishing = false,
  isDirty = false
}: ActionButtonsProps) {
  const [showMore, setShowMore] = useState(false);
  const [actionStates, setActionStates] = useState<ActionState>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMore(false);
      }
    };

    if (showMore) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMore]);

  const handleAction = async (
    action: string,
    handler?: (template: Template) => void | Promise<void>
  ) => {
    if (!handler) return;

    setActionStates(prev => ({ ...prev, [action]: true }));
    try {
      await handler(template);
    } finally {
      setActionStates(prev => ({ ...prev, [action]: false }));
      setShowMore(false);
    }
  };

  const handleDelete = () => {
    if (!onDelete) return;
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!onDelete) return;
    await handleAction('delete', onDelete);
    setShowDeleteConfirm(false);
  };

  const handleDeactivate = () => {
    if (!onDeactivate) return;
    setShowDeactivateConfirm(true);
  };

  const confirmDeactivate = async () => {
    if (!onDeactivate) return;
    await handleAction('deactivate', onDeactivate);
    setShowDeactivateConfirm(false);
  };

  return (
    <>
      <div className="relative">
        {/* Desktop Version */}
        <div className="hidden sm:flex justify-end gap-2 sm:gap-3">
          {/* Save Button */}
          <button
            onClick={() => handleAction('save', onSave)}
            disabled={isSaving || !isDirty}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 dark:bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 dark:hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm dark:shadow-gray-900 hover:shadow-md dark:hover:shadow-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            aria-label="Save template"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save
              </>
            )}
          </button>

          {/* Publish Button */}
          {onPublish && (
            <button
              onClick={() => handleAction('publish', onPublish)}
              disabled={isPublishing || actionStates.publish}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 dark:bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-700 dark:hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm dark:shadow-gray-900 hover:shadow-md dark:hover:shadow-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              aria-label="Publish template"
            >
              {(isPublishing || actionStates.publish) ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Publish
                </>
              )}
            </button>
          )}

          {/* Duplicate Button */}
          {onDuplicate && (
            <button
              onClick={() => handleAction('duplicate', onDuplicate)}
              disabled={actionStates.duplicate}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm dark:shadow-gray-900 hover:shadow-md dark:hover:shadow-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              aria-label="Duplicate template"
            >
              {actionStates.duplicate ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Duplicating...
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Duplicate
                </>
              )}
            </button>
          )}

          {/* Deactivate Button */}
          {onDeactivate && (
            <button
              onClick={handleDeactivate}
              disabled={actionStates.deactivate}
              className="flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-sm font-medium rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm dark:shadow-gray-900 hover:shadow-md dark:hover:shadow-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              aria-label="Deactivate template"
            >
              <Power className="w-4 h-4" />
              Deactivate
            </button>
          )}

          {/* Delete Button */}
          {onDelete && (
            <button
              onClick={handleDelete}
              disabled={actionStates.delete}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 text-sm font-medium rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm dark:shadow-gray-900 hover:shadow-md dark:hover:shadow-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              aria-label="Delete template"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          )}
        </div>

        {/* Mobile Version */}
        <div className="sm:hidden flex justify-between gap-2">
          <div className="flex gap-2">
            {/* Save Button - Mobile */}
            <button
              onClick={() => handleAction('save', onSave)}
              disabled={isSaving || !isDirty}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 dark:bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 dark:hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm dark:shadow-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              aria-label="Save template"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
            </button>

            {/* Publish Button - Mobile */}
            {onPublish && (
              <button
                onClick={() => handleAction('publish', onPublish)}
                disabled={isPublishing || actionStates.publish}
                className="flex items-center gap-1.5 px-3 py-2 bg-green-600 dark:bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-700 dark:hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm dark:shadow-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                aria-label="Publish template"
              >
                {(isPublishing || actionStates.publish) ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            )}
          </div>

          {/* More Menu - Mobile */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMore(!showMore)}
              className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-sm dark:shadow-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              aria-label="More actions"
              aria-expanded={showMore}
              aria-haspopup="true"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            <AnimatePresence>
              {showMore && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-full right-0 mb-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl dark:shadow-gray-900 border border-gray-200 dark:border-gray-700 py-1 z-10 transition-colors"
                  role="menu"
                  aria-orientation="vertical"
                >
                  {onDuplicate && (
                    <button
                      onClick={() => handleAction('duplicate', onDuplicate)}
                      disabled={actionStates.duplicate}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      role="menuitem"
                    >
                      {actionStates.duplicate ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      <span>Duplicate</span>
                    </button>
                  )}

                  {onDeactivate && (
                    <button
                      onClick={handleDeactivate}
                      disabled={actionStates.deactivate}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      role="menuitem"
                    >
                      <Power className="w-4 h-4" />
                      <span>Deactivate</span>
                    </button>
                  )}

                  {onDelete && (
                    <button
                      onClick={handleDelete}
                      disabled={actionStates.delete}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      role="menuitem"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 dark:bg-black/80 flex items-center justify-center p-4 z-50 transition-colors"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 shadow-2xl dark:shadow-gray-900 border border-gray-200 dark:border-gray-700 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 transition-colors">
                  Delete Template
                </h3>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6 transition-colors">
                Are you sure you want to delete this template? This action cannot be undone.
              </p>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium shadow-sm dark:shadow-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={actionStates.delete}
                  className="px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm dark:shadow-gray-900 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  {actionStates.delete ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Deactivate Confirmation Modal */}
      <AnimatePresence>
        {showDeactivateConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 dark:bg-black/80 flex items-center justify-center p-4 z-50 transition-colors"
            onClick={() => setShowDeactivateConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 shadow-2xl dark:shadow-gray-900 border border-gray-200 dark:border-gray-700 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                  <Power className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 transition-colors">
                  Deactivate Template
                </h3>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6 transition-colors">
                Are you sure you want to deactivate this template? Users will no longer be able to use it.
              </p>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeactivateConfirm(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium shadow-sm dark:shadow-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeactivate}
                  disabled={actionStates.deactivate}
                  className="px-4 py-2 bg-amber-600 dark:bg-amber-500 text-white rounded-lg hover:bg-amber-700 dark:hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm dark:shadow-gray-900 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  {actionStates.deactivate ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deactivating...
                    </>
                  ) : (
                    <>
                      <Power className="w-4 h-4" />
                      Deactivate
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
