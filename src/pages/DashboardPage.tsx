import React, { useState } from 'react';
import MetricsCards from '../components/dashboard/MetricsCards';
import AgentsList from '../components/dashboard/AgentsList';
import AgentConfigModal from '../components/agents/config/AgentConfigModal';
import ReportConfigModal from '../components/dashboard/ReportConfigModal';
import { AgentConfig } from '../types/agent-config';
import { Page } from '../App';
import { Plus, Download, Upload } from 'lucide-react';
import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

interface DashboardPageProps {
  onNavigate: (page: Page) => void;
}

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const [selectedAgent, setSelectedAgent] = useState<AgentConfig | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const { t } = useContext(LanguageContext);

  const handleAgentSelect = (agent: AgentConfig) => {
    setSelectedAgent(agent);
  };

  const handleSaveAgent = (config: AgentConfig) => {
    console.log('Agent saved:', config);
    setSelectedAgent(null);
  };

  const handleSaveReport = (config: any) => {
    console.log('Report configuration saved:', config);
    setShowReportModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {t('dashboard.title')}
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                {t('dashboard.overview')}
              </p>
            </div>
            {/* Quick actions */}
            <div className="flex gap-3">
              <button 
                className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                <Download className="w-4 h-4" />
                {t('dashboard.export')}
              </button>
              <button 
                onClick={() => setShowReportModal(true)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                {t('dashboard.newReport')}
              </button>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="space-y-6">
          {/* Metrics Section */}
          <section className="rounded-lg bg-white shadow">
            <div className="p-4 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                {t('dashboard.keyMetrics')}
              </h2>
              <MetricsCards onNavigate={onNavigate} />
            </div>
          </section>

          {/* Agents Section */}
          <section className="rounded-lg bg-white shadow">
            <div className="p-4 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                {t('dashboard.latestAgents')}
              </h2>
              <div className="overflow-hidden">
                <AgentsList onAgentSelect={handleAgentSelect} />
              </div>
            </div>
          </section>

          {/* Reports Section */}
          <section className="rounded-lg bg-white shadow">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  {t('dashboard.reports')}
                </h2>
                <button 
                  onClick={() => setShowReportModal(true)}
                  className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700"
                >
                  <Plus className="w-4 h-4" />
                  {t('dashboard.addReport')}
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
                {t('dashboard.noReports')}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Modals */}
      {showReportModal && (
        <ReportConfigModal
          onClose={() => setShowReportModal(false)}
          onSave={handleSaveReport}
        />
      )}

      {selectedAgent && (
        <AgentConfigModal
          agent={selectedAgent}
          onClose={() => setSelectedAgent(null)}
          onSave={handleSaveAgent}
        />
      )}
    </div>
  );
}
