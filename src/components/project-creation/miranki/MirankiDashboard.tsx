import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, GitBranch, BarChart3, ListChecks } from 'lucide-react';
import MirankiOverview from './MirankiOverview';
import MirankiWorkflow from './MirankiWorkflow';
import MirankiAnalytics from './MirankiAnalytics';
import MirankiDeliverables from './MirankiDeliverables';

type MirankiTab = 'overview' | 'workflow' | 'analytics' | 'deliverables';

const TABS: { id: MirankiTab; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
  { id: 'workflow', label: 'Workflow', icon: <GitBranch className="w-3.5 h-3.5" /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-3.5 h-3.5" /> },
  { id: 'deliverables', label: 'Deliverables', icon: <ListChecks className="w-3.5 h-3.5" /> },
];

export default function MirankiDashboard() {
  const [activeTab, setActiveTab] = useState<MirankiTab>('overview');

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-slate-800/50 rounded-lg p-1 border border-slate-700/50">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium transition-all flex-1 justify-center ${
              activeTab === tab.id
                ? 'bg-slate-700 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab.icon}
            <span className="hidden xl:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pr-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === 'overview' && <MirankiOverview />}
            {activeTab === 'workflow' && <MirankiWorkflow />}
            {activeTab === 'analytics' && <MirankiAnalytics />}
            {activeTab === 'deliverables' && <MirankiDeliverables />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
