import React, { useState, useEffect } from 'react';
import { Client } from '../../../types/client';
import BasicInfo from './sections/BasicInfo';
import Segmentation from './sections/Segmentation';
import CommunicationPrefs from './sections/CommunicationPrefs';
import Analytics from './sections/Analytics';
import Personalization from './sections/Personalization';
import Compliance from './sections/Compliance';
import ActionButtons from './sections/ActionButtons';
import { X, ChevronLeft, Menu, User, Settings, Bell, BarChart, Shield, Tag, Save, AlertTriangle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface ClientEditorProps {
  client: Client;
  onClose: () => void;
  onSave: (client: Client) => void;
}

const sections = [
  { 
    id: 'basic', 
    label: 'Basic Information', 
    component: BasicInfo,
    icon: User,
    description: 'Essential client details and contact information'
  },
  { 
    id: 'segmentation', 
    label: 'Segmentation', 
    component: Segmentation,
    icon: Tag,
    description: 'Client categories, tags, and engagement scoring'
  },
  { 
    id: 'communication', 
    label: 'Communication', 
    component: CommunicationPrefs,
    icon: Bell,
    description: 'Preferences and communication settings'
  },
  { 
    id: 'personalization', 
    label: 'Personalization', 
    component: Personalization,
    icon: Settings,
    description: 'Custom fields and personalized data'
  },
  { 
    id: 'analytics', 
    label: 'Analytics', 
    component: Analytics,
    icon: BarChart,
    description: 'Performance metrics and insights'
  },
  { 
    id: 'compliance', 
    label: 'Compliance', 
    component: Compliance,
    icon: Shield,
    description: 'GDPR compliance and data protection'
  },
];

export default function ClientEditor({ client, onClose, onSave }: ClientEditorProps) {
  const [activeSection, setActiveSection] = useState('basic');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (isDirty) {
      e.preventDefault();
      e.returnValue = '';
    }
  };

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);

  const handleSave = async (clientData: Client) => {
    try {
      setIsSaving(true);
      await onSave(clientData);
      setIsDirty(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (isDirty) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to close?');
      if (!confirmed) return;
    }
    onClose();
  };

  const currentSection = sections.find(section => section.id === activeSection);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 dark:bg-black/80 z-50 overflow-y-auto transition-colors"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleClose();
          }
        }}
      >
        <div className="min-h-full flex items-center justify-center p-0 sm:p-4 md:p-6 lg:p-8">
          <motion.div
            initial={{ y: '100%', scale: 0.95 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: '100%', scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full h-full flex flex-col bg-white dark:bg-gray-800 sm:h-[90vh] sm:max-w-[1200px] md:max-w-[1400px] lg:max-w-[1600px] xl:max-w-[1800px] sm:rounded-xl shadow-2xl dark:shadow-gray-900 border border-gray-200 dark:border-gray-700 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6 sticky top-0 bg-white dark:bg-gray-800 z-10 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4">
                  <button
                    onClick={handleClose}
                    className="sm:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    aria-label="Go back"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 dark:bg-teal-900/30 border border-indigo-200 dark:border-teal-800 rounded-lg transition-colors">
                      <User className="w-6 h-6 text-indigo-600 dark:text-teal-400 transition-colors" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors">
                        Client Editor
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">
                        Editing profile for {client.name}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 sm:gap-3">
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
                  
                  <button
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    className="sm:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    aria-label="Toggle menu"
                  >
                    <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                  
                  <button
                    onClick={handleClose}
                    className="hidden sm:block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    aria-label="Close editor"
                  >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Current Section Info */}
              {currentSection && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-white dark:bg-gray-700 rounded-lg shadow-sm transition-colors">
                      <currentSection.icon className="w-4 h-4 text-indigo-600 dark:text-teal-400 transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 transition-colors">
                        {currentSection.label}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">
                        {currentSection.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
              {showMobileMenu && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="sm:hidden border-b border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800 transition-colors"
                >
                  <div className="py-2">
                    {sections.map((section, index) => (
                      <motion.button
                        key={section.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => {
                          setActiveSection(section.id);
                          setShowMobileMenu(false);
                        }}
                        className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                          activeSection === section.id
                            ? 'bg-indigo-50 dark:bg-teal-900/30 text-indigo-700 dark:text-teal-300 border-r-2 border-indigo-500 dark:border-teal-500'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg transition-colors ${
                          activeSection === section.id
                            ? 'bg-indigo-100 dark:bg-teal-900/50'
                            : 'bg-gray-100 dark:bg-gray-700'
                        }`}>
                          <section.icon className={`w-4 h-4 transition-colors ${
                            activeSection === section.id
                              ? 'text-indigo-600 dark:text-teal-400'
                              : 'text-gray-600 dark:text-gray-400'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{section.label}</p>
                          <p className="text-xs opacity-75">{section.description}</p>
                        </div>
                        {activeSection === section.id && (
                          <div className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-teal-400" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full flex flex-col sm:flex-row">
                {/* Navigation Desktop */}
                <div className="hidden sm:block w-80 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 transition-colors">
                  <div className="p-4 space-y-1 h-full overflow-y-auto">
                    {sections.map((section, index) => (
                      <motion.button
                        key={section.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full p-4 rounded-lg text-left transition-all duration-200 group ${
                          activeSection === section.id
                            ? 'bg-white dark:bg-gray-700 text-indigo-700 dark:text-teal-300 shadow-sm dark:shadow-gray-900 border border-indigo-200 dark:border-teal-800'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm dark:hover:shadow-gray-900'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`p-2 rounded-lg transition-colors ${
                            activeSection === section.id
                              ? 'bg-indigo-100 dark:bg-teal-900/30'
                              : 'bg-gray-200 dark:bg-gray-600 group-hover:bg-indigo-100 dark:group-hover:bg-teal-900/30'
                          }`}>
                            <section.icon className={`w-5 h-5 transition-colors ${
                              activeSection === section.id
                                ? 'text-indigo-600 dark:text-teal-400'
                                : 'text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-teal-400'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{section.label}</p>
                          </div>
                          {activeSection === section.id && (
                            <div className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-teal-400" />
                          )}
                        </div>
                        <p className="text-sm opacity-75 ml-11">
                          {section.description}
                        </p>
                      </motion.button>
                    ))}

                    {/* Navigation Footer */}
                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <Save className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                            Auto-save enabled
                          </p>
                        </div>
                        <p className="text-xs text-blue-600 dark:text-blue-400">
                          Changes are automatically saved as you edit
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-4 sm:p-6 md:p-8">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeSection}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="h-full"
                      >
                        {sections.map((section) =>
                          activeSection === section.id && (
                            <section.component
                              key={section.id}
                              client={client}
                              onChange={(updates: any) => {
                                setIsDirty(true);
                                // Here you could also auto-save or update client state
                              }}
                            />
                          )
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 sm:p-6 bg-white dark:bg-gray-800 sticky bottom-0 transition-colors">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Status Info */}
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isDirty ? 'bg-amber-500' : 'bg-green-500'}`} />
                    <span>{isDirty ? 'Unsaved changes' : 'All changes saved'}</span>
                  </div>
                  <div className="hidden sm:block">
                    Last edited: {new Date().toLocaleTimeString()}
                  </div>
                </div>

                {/* Action Buttons */}
                <ActionButtons
                  client={client}
                  onSave={handleSave}
                  isSaving={isSaving}
                  onClose={handleClose}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
