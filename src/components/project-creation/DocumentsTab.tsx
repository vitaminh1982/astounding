import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Lock, Unlock, FolderOpen, ChevronRight, ChevronDown } from 'lucide-react';
import { ProjectDocument, ProjectPhase } from '../../types/project-creation';

interface Props {
  documents: ProjectDocument[];
  phases: ProjectPhase[];
}

export default function DocumentsTab({ documents, phases }: Props) {
  const [selectedDoc, setSelectedDoc] = useState<ProjectDocument | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    Governance: true,
    Technical: true,
    Planning: true,
    Quality: true,
    Risk: true,
    Reporting: true,
  });

  const categories = Array.from(new Set(documents.map((d) => d.category)));

  function toggleCategory(cat: string) {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  }

  function getPhaseName(phaseId: string) {
    return phases.find((p) => p.id === phaseId)?.name || '';
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-16rem)]">
      {/* Document Tree */}
      <div className="w-72 flex-shrink-0 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-y-auto">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Project Documents</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {documents.filter((d) => d.status !== 'locked').length}/{documents.length} unlocked
          </p>
        </div>

        <div className="p-2 space-y-1">
          {categories.map((category) => {
            const catDocs = documents.filter((d) => d.category === category);
            const isExpanded = expandedCategories[category];

            return (
              <div key={category}>
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  )}
                  <FolderOpen className="w-4 h-4 text-amber-500" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{category}</span>
                  <span className="ml-auto text-[10px] text-gray-400">{catDocs.length}</span>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      {catDocs.map((doc) => (
                        <button
                          key={doc.id}
                          onClick={() => doc.status !== 'locked' && setSelectedDoc(doc)}
                          disabled={doc.status === 'locked'}
                          className={`w-full flex items-center gap-2 pl-10 pr-3 py-1.5 text-xs rounded-lg transition-colors ${
                            doc.status === 'locked'
                              ? 'opacity-50 cursor-not-allowed'
                              : selectedDoc?.id === doc.id
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          {doc.status === 'locked' ? (
                            <Lock className="w-3 h-3 text-gray-400" />
                          ) : (
                            <FileText className="w-3 h-3" />
                          )}
                          <span className="truncate">{doc.name}</span>
                          {doc.status === 'unlocked' && (
                            <Unlock className="w-3 h-3 text-green-500 ml-auto flex-shrink-0" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Document Viewer */}
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-y-auto">
        {selectedDoc ? (
          <motion.div
            key={selectedDoc.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6"
          >
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{selectedDoc.name}</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Phase: {getPhaseName(selectedDoc.phaseId)} | Category: {selectedDoc.category}
                </p>
              </div>
              <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                Unlocked
              </span>
            </div>

            <div className="prose dark:prose-invert prose-sm max-w-none">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{selectedDoc.description}</p>
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <pre className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap font-mono">
                  {selectedDoc.content}
                </pre>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400">Select a document</h3>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2 max-w-sm">
              Choose an unlocked document from the tree to view its content. Documents unlock as phases progress.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
