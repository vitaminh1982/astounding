import React, { useState, useEffect } from 'react';
import { Client } from '../../../types/client';
import BasicInfo from './sections/BasicInfo';
import Segmentation from './sections/Segmentation';
import CommunicationPrefs from './sections/CommunicationPrefs';
import Analytics from './sections/Analytics';
import Personalization from './sections/Personalization';
import Compliance from './sections/Compliance';
import ActionButtons from './sections/ActionButtons';
import { X, ChevronLeft, Menu } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface ClientEditorProps {
  client: Client;
  onClose: () => void;
  onSave: (client: Client) => void;
}

const sections = [
  { id: 'basic', label: 'Basic Information', component: BasicInfo },
  { id: 'segmentation', label: 'Segmentation', component: Segmentation },
  { id: 'communication', label: 'Preferences', component: CommunicationPrefs },
  { id: 'personalization', label: 'Personalization', component: Personalization },
  { id: 'analytics', label: 'Analytics', component: Analytics },
  { id: 'compliance', label: 'Compliance', component: Compliance },
];

export default function ClientEditor({ client, onClose, onSave }: ClientEditorProps) {
  const [activeSection, setActiveSection] = useState('basic');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

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

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 overflow-y-auto"
      >
        <div className="min-h-full flex items-center justify-center p-0 sm:p-4 md:p-6 lg:p-8">
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full h-full flex flex-col bg-white sm:h-[90vh] sm:max-w-[1200px] md:max-w-[1400px] lg:max-w-[1600px] xl:max-w-[1800px] sm:rounded-xl shadow-xl"
          >
            {/* Header */}
            <div className="border-b p-3 sm:p-6 md:p-8 lg:p-10 sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5">
                  <button
                    onClick={onClose}
                    className="sm:hidden p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Back"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-lg sm:text-2xl md:text-3xl font-semibold text-gray-900">
                    Client Configuration
                  </h2>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5">
                  <button
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    className="sm:hidden p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Menu"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                  <button
                    onClick={onClose}
                    className="hidden sm:block p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
              {showMobileMenu && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="sm:hidden border-b overflow-hidden bg-white"
                >
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => {
                        setActiveSection(section.id);
                        setShowMobileMenu(false);
                      }}
                      className={`w-full px-4 py-3 text-left text-sm font-medium flex items-center justify-between ${
                        activeSection === section.id
                          ? 'bg-indigo-50 text-indigo-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {section.label}
                      {activeSection === section.id && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600" />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Content */}
            <div className="flex-1 overflow-auto">
              <div className="h-full flex flex-col sm:flex-row p-4 sm:p-6 md:p-8 lg:p-10 sm:gap-6">
                {/* Navigation Desktop */}
                <div className="hidden sm:block w-64 space-y-1 flex-shrink-0">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full px-4 py-2.5 rounded-lg text-left transition-colors text-sm font-medium ${
                        activeSection === section.id
                          ? 'bg-indigo-50 text-indigo-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {section.label}
                    </button>
                  ))}
                </div>

                {/* Main Content */}
                <div className="flex-1 min-h-0 -mx-4 sm:mx-0">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeSection}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="h-full px-4 sm:px-0"
                    >
                      {sections.map((section) =>
                        activeSection === section.id && (
                          <section.component
                            key={section.id}
                            client={client}
                            onChange={() => setIsDirty(true)}
                          />
                        )
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t p-4 sm:p-6 md:p-8 lg:p-10 bg-gray-50 sticky bottom-0">
              <ActionButtons
                client={client}
                onSave={onSave}
                isDirty={isDirty}
                onClose={onClose}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
