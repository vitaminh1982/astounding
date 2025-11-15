import React, { useState, useEffect } from 'react';
import { X, FileText, Save, AlertTriangle, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Template } from '../../../types/template';
import BasicInfo from './sections/BasicInfo';
import MessageConfig from './sections/MessageConfig';
import VariablesList from './sections/VariablesList';
import CustomizationOptions from './sections/CustomizationOptions';
import SharingSettings from './sections/SharingSettings';
import AutomationSettings from './sections/AutomationSettings';
import PreviewSection from './sections/PreviewSection';
import ValidationInfo from './sections/ValidationInfo';
import ActionButtons from './sections/ActionButtons';

interface TemplateEditorProps {
  template: Template;
  onClose: () => void;
  onSave: (template: Template) => void;
}

export default function TemplateEditor({ template, onClose, onSave }: TemplateEditorProps) {
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showMobileVariables, setShowMobileVariables] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  // Handle unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleClose = () => {
    if (isDirty) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to close?');
      if (!confirmed) return;
    }
    onClose();
  };

  const handleSave = async (updatedTemplate: Template) => {
    try {
      setIsSaving(true);
      await onSave(updatedTemplate);
      setIsDirty(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = () => {
    setIsDirty(true);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 dark:bg-black/80 flex items-start justify-center overflow-y-auto p-0 sm:p-4 z-50 transition-colors"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleClose();
          }
        }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white dark:bg-gray-800 rounded-none sm:rounded-xl w-full max-w-[1400px] my-0 sm:my-4 relative shadow-2xl dark:shadow-gray-900 border-0 sm:border border-gray-200 dark:border-gray-700 transition-colors min-h-screen sm:min-h-0"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 bg-indigo-100 dark:bg-teal-900/30 border border-indigo-200 dark:border-teal-800 rounded-lg transition-colors">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-teal-400 transition-colors" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors">
                      Template Editor
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">
                      Editing: {template.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Unsaved Changes Indicator */}
                  {isDirty && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-sm rounded-full border border-amber-200 dark:border-amber-800 transition-colors"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      Unsaved changes
                    </motion.div>
                  )}

                  {/* Mobile Tab Switcher */}
                  <div className="lg:hidden flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 transition-colors">
                    <button
                      onClick={() => setActiveTab('edit')}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                        activeTab === 'edit'
                          ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setActiveTab('preview')}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1 ${
                        activeTab === 'preview'
                          ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={handleClose}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    aria-label="Close editor"
                  >
                    <X className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                </div>
              </div>

              {/* Mobile Unsaved Changes */}
              {isDirty && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="sm:hidden mt-3 p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-center gap-2 text-sm text-amber-800 dark:text-amber-300 transition-colors"
                >
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>Unsaved changes</span>
                </motion.div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Left Column (spans 2 columns on desktop) - Edit Tab on Mobile */}
              <div
                className={`lg:col-span-2 space-y-4 sm:space-y-6 ${
                  activeTab === 'preview' ? 'hidden lg:block' : ''
                }`}
              >
                <BasicInfo template={template} onChange={handleChange} />
                <MessageConfig template={template} onChange={handleChange} />
                <CustomizationOptions template={template} onChange={handleChange} />
                <AutomationSettings template={template} onChange={handleChange} />

                {/* Mobile Variables Toggle */}
                <div className="lg:hidden">
                  <button
                    onClick={() => setShowMobileVariables(!showMobileVariables)}
                    className="w-full p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        View Available Variables
                      </span>
                      <svg
                        className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${
                          showMobileVariables ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </button>

                  <AnimatePresence>
                    {showMobileVariables && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4"
                      >
                        <VariablesList />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Right Column - Preview/Settings - Preview Tab on Mobile */}
              <div
                className={`space-y-4 sm:space-y-6 ${
                  activeTab === 'edit' ? 'hidden lg:block' : ''
                }`}
              >
                {/* Desktop Variables List */}
                <div className="hidden lg:block">
                  <VariablesList />
                </div>

                <SharingSettings template={template} onChange={handleChange} />
                <PreviewSection template={template} />
                <ValidationInfo template={template} />
              </div>
            </div>
          </div>

          {/* Action Buttons - Sticky Footer */}
          <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-colors shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)]">
            <div className="flex items-center justify-between">
              {/* Status Info */}
              <div className="hidden sm:flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isDirty ? 'bg-amber-500' : 'bg-green-500'
                    }`}
                  />
                  <span>{isDirty ? 'Unsaved changes' : 'All changes saved'}</span>
                </div>
                <div>
                  Last edited: {new Date().toLocaleTimeString()}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full sm:w-auto">
                <ActionButtons
                  template={template}
                  onSave={handleSave}
                  onClose={handleClose}
                  isSaving={isSaving}
                  isDirty={isDirty}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
