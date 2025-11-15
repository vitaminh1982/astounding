import React, { useState, useRef, useEffect } from 'react';
import { Template } from '../../../../types/template';
import { 
  Save, 
  Send, 
  Copy, 
  Power, 
  Trash2, 
  MoreVertical, 
  Loader2, 
  AlertTriangle,
  X,
  CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ActionButtonsProps {
  template: Template;
  onSave: (template: Template) => void;
  onClose?: () => void;
  onPublish?: (template: Template) => void;
  onDuplicate?: (template: Template) => void;
  onDeactivate?: (template: Template) => void;
  onDelete?: (template: Template) => void;
  isSaving?: boolean;
  isPublishing?: boolean;
  isDirty?: boolean;
  hasErrors?: boolean;
}

type ActionState = {
  [key: string]: boolean;
};

type NotificationType = 'success' | 'error' | 'warning';

interface Notification {
  type: NotificationType;
  message: string;
}

export default function ActionButtons({ 
  template, 
  onSave,
  onClose,
  onPublish,
  onDuplicate,
  onDeactivate,
  onDelete,
  isSaving = false,
  isPublishing = false,
  isDirty = false,
  hasErrors = false
}: ActionButtonsProps) {
  const [showMore, setShowMore] = useState(false);
  const [actionStates, setActionStates] = useState<ActionState>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);
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

  // Auto-hide notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (type: NotificationType, message: string) => {
    setNotification({ type, message });
  };

  const handleAction = async (
    action: string,
    handler?: (template: Template) => void | Promise<void>,
    successMessage?: string
  ) => {
    if (!handler) return;

    setActionStates(prev => ({ ...prev, [action]: true }));
    try {
      await handler(template);
      if (successMessage) {
        showNotification('success', successMessage);
      }
    } catch (error) {
      showNotification('error', `Failed to ${action} template. Please try again.`);
      console.error(`Error in ${action}:`, error);
    } finally {
      setActionStates(prev => ({ ...prev, [action]: false }));
      setShowMore(false);
    }
  };

  const handleSave = async () => {
    if (hasErrors) {
      showNotification('error', 'Please fix all errors before saving.');
      return;
    }
    await handleAction('save', onSave, 'Template saved successfully!');
  };

  const handleDelete = () => {
    if (!onDelete) return;
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!onDelete) return;
    await handleAction('delete', onDelete, 'Template deleted successfully!');
    setShowDeleteConfirm(false);
    // Close editor after delete
    if (onClose) {
      setTimeout(() => onClose(), 1000);
    }
  };

  const handleDeactivate = () => {
    if (!onDeactivate) return;
    setShowDeactivateConfirm(true);
  };

  const confirmDeactivate = async () => {
    if (!onDeactivate) return;
    await handleAction('deactivate', onDeactivate, 'Template deactivated successfully!');
    setShowDeactivateConfirm(false);
  };

  const handlePublish = async () => {
    if (hasErrors) {
      showNotification('error', 'Please fix all errors before publishing.');
      return;
    }
    if (isDirty) {
      showNotification('warning', 'Please save your changes before publishing.');
      return;
    }
    await handleAction('publish', onPublish, 'Template published successfully!');
  };

  return (
    <>
      <div className="relative">
        {/* Notification Toast */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`absolute -top-16 left-0 right-0 mx-auto w-fit px-4 py-3 rounded-lg shadow-lg border flex items-center gap-3 z-50 ${
                notification.type === 'success' 
                  ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
                  : notification.type === 'error'
                  ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
                  : 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200'
              }`}
            >
              {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
              {notification.type === 'error' && <AlertTriangle className="w-5 h-5" />}
              {notification.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
              <span className="text-sm font-medium">{notification.message}</span>
              <button
                onClick={() => setNotification(null)}
                className="hover:opacity-70 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Version */}
        <div className="hidden sm:flex justify-between items-center gap-2 sm:gap-3">
          {/* Left side - Cancel button */}
          <div>
            {onClose && (
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm dark:shadow-gray-900 hover:shadow-md dark:hover:shadow-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                aria-label="Cancel and close"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            )}
          </div>

          {/* Right side - Action buttons */}
          <div className="flex gap-2 sm:gap-3">
            {/* Duplicate Button */}
            {onDuplicate && (
              <button
                onClick={() => handleAction('duplicate', onDuplicate, 'Template duplicated successfully!')}
                disabled={actionStates.duplicate}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm dark:shadow-gray-900 hover:shadow-md dark:hover:shadow-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
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
                className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-sm font-medium rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm dark:shadow-gray-900 hover:shadow-md dark:hover:shadow-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
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
                className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 text-sm font-medium rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm dark:shadow-gray-900 hover:shadow-md dark:hover:shadow-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                aria-label="Delete template"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            )}

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={isSaving || !isDirty || hasErrors}
              title={
                hasErrors ? 'Fix errors before saving' :
                !isDirty ? 'No changes to save' :
                ''
              }
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
                  {isDirty ? 'Save Changes' : 'Saved'}
                </>
              )}
            </button>

            {/* Publish Button */}
            {onPublish && (
              <button
                onClick={handlePublish}
                disabled={isPublishing || actionStates.publish || isDirty || hasErrors}
                title={
                  hasErrors ? 'Fix errors before publishing' :
                  isDirty ? 'Save changes before publishing' :
                  ''
                }
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
          </div>
        </div>

        {/* Mobile Version */}
        <div className="sm:hidden flex justify-between gap-2">
          <div className="flex gap-2">
            {/* Cancel Button - Mobile */}
            {onClose && (
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm dark:shadow-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                aria-label="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Save Button - Mobile */}
            <button
              onClick={handleSave}
              disabled={isSaving || !isDirty || hasErrors}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 dark:bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 dark:hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm dark:shadow-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              aria-label="Save template"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span className="hidden xs:inline">{isDirty ? 'Save' : 'Saved'}</span>
            </button>

            {/* Publish Button - Mobile */}
            {onPublish && (
              <button
                onClick={handlePublish}
                disabled={isPublishing || actionStates.publish || isDirty || hasErrors}
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
          {(onDuplicate || onDeactivate || onDelete) && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMore(!showMore)}
                className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm dark:shadow-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
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
                    className="absolute bottom-full right-0 mb-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl dark:shadow-gray-900 border border-gray-200 dark:border-gray-700 py-1 z-10 transition-colors overflow-hidden"
                    role="menu"
                    aria-orientation="vertical"
                  >
                    {onDuplicate && (
                      <button
                        onClick={() => handleAction('duplicate', onDuplicate, 'Template duplicated successfully!')}
                        disabled={actionStates.duplicate}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        role="menuitem"
                      >
                        {actionStates.duplicate ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                        <span>Duplicate Template</span>
                      </button>
                    )}

                    {onDeactivate && (
                      <>
                        <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                        <button
                          onClick={handleDeactivate}
                          disabled={actionStates.deactivate}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          role="menuitem"
                        >
                          <Power className="w-4 h-4" />
                          <span>Deactivate Template</span>
                        </button>
                      </>
                    )}

                    {onDelete && (
                      <>
                        <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                        <button
                          onClick={handleDelete}
                          disabled={actionStates.delete}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          role="menuitem"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete Template</span>
                        </button>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-colors"
            onClick={() => setShowDeleteConfirm(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 shadow-2xl dark:shadow-gray-900 border border-gray-200 dark:border-gray-700 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <h3 
                    id="delete-dialog-title"
                    className="text-lg font-bold text-gray-900 dark:text-gray-100 transition-colors mb-2"
                  >
                    Delete Template?
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">
                    Are you sure you want to delete "<span className="font-semibold">{template.title}</span>"? This action cannot be undone and all associated data will be permanently removed.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={actionStates.delete}
                  className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm dark:shadow-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
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
                      Delete Template
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
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-colors"
            onClick={() => setShowDeactivateConfirm(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="deactivate-dialog-title"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 shadow-2xl dark:shadow-gray-900 border border-gray-200 dark:border-gray-700 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                  <Power className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <h3 
                    id="deactivate-dialog-title"
                    className="text-lg font-bold text-gray-900 dark:text-gray-100 transition-colors mb-2"
                  >
                    Deactivate Template?
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">
                    Are you sure you want to deactivate "<span className="font-semibold">{template.title}</span>"? Users will no longer be able to use this template until it's reactivated.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <button
                  onClick={() => setShowDeactivateConfirm(false)}
                  disabled={actionStates.deactivate}
                  className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm dark:shadow-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
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
                      Deactivate Template
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
