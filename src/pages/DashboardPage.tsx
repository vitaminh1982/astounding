// pages/DashboardPage.tsx
import React, { useState, useCallback, useMemo, useContext } from 'react';
import { Plus, Download } from 'lucide-react';
import { LanguageContext } from '../context/LanguageContext';
import MetricsCards from '../components/dashboard/MetricsCards';
import AgentsList from '../components/dashboard/AgentsList';
import AgentConfigModal from '../components/agents/config/AgentConfigModal';
import ReportConfigModal from '../components/dashboard/ReportConfigModal';
import EmptyState from '../components/common/EmptyState';
import { AgentConfig } from '../types/agent-config';
import { Page } from '../App';

interface DashboardPageProps {
  onNavigate: (page: Page) => void;
}

interface ReportConfig {
  id: string;
  name: string;
  type: string;
  schedule?: string;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { t } = useContext(LanguageContext);
  
  // State management
  const [selectedAgent, setSelectedAgent] = useState<AgentConfig | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reports, setReports] = useState<ReportConfig[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  // Memoized handlers
  const handleAgentSelect = useCallback((agent: AgentConfig) => {
    setSelectedAgent(agent);
  }, []);

  const handleCloseAgentModal = useCallback(() => {
    setSelectedAgent(null);
  }, []);

  const handleSaveAgent = useCallback((config: AgentConfig) => {
    console.log('Agent saved:', config);
    // TODO: Implement API call to save agent
    setSelectedAgent(null);
  }, []);

  const handleOpenReportModal = useCallback(() => {
    setShowReportModal(true);
  }, []);

  const handleCloseReportModal = useCallback(() => {
    setShowReportModal(false);
  }, []);

  const handleSaveReport = useCallback((config: ReportConfig) => {
    console.log('Report configuration saved:', config);
    // TODO: Implement API call to save report
    setReports((prev) => [...prev, { ...config, id: Date.now().toString() }]);
    setShowReportModal(false);
  }, []);

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    try {
      // TODO: Implement export functionality
      console.log('Exporting dashboard data...');
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  }, []);

  // Memoized sections
  const headerSection = useMemo(
    () => (
      <DashboardHeader
        title={t('dashboard.title')}
        subtitle={t('dashboard.overview')}
        onExport={handleExport}
        onNewReport={handleOpenReportModal}
        isExporting={isExporting}
        exportLabel={t('dashboard.export')}
        newReportLabel={t('dashboard.newReport')}
      />
    ),
    [t, handleExport, handleOpenReportModal, isExporting]
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        {headerSection}

        {/* Main Content Grid */}
        <div className="space-y-6">
          {/* Metrics Section */}
          <DashboardSection title={t('dashboard.keyMetrics')}>
            <MetricsCards onNavigate={onNavigate} />
          </DashboardSection>

          {/* Agents Section */}
          <DashboardSection title={t('dashboard.latestAgents')}>
            <div className="overflow-hidden">
              <AgentsList onAgentSelect={handleAgentSelect} />
            </div>
          </DashboardSection>

          {/* Reports Section */}
          <DashboardSection
            title={t('dashboard.reports')}
            action={
              <button
                onClick={handleOpenReportModal}
                className="flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
              >
                <Plus className="w-4 h-4" />
                {t('dashboard.addReport')}
              </button>
            }
          >
            {reports.length === 0 ? (
              <EmptyState
                icon={Download}
                title={t('dashboard.noReports')}
                description={t('dashboard.noReportsDescription')}
                action={{
                  label: t('dashboard.createFirstReport'),
                  onClick: handleOpenReportModal,
                }}
              />
            ) : (
              <ReportsList reports={reports} />
            )}
          </DashboardSection>
        </div>
      </div>

      {/* Modals */}
      {showReportModal && (
        <ReportConfigModal
          onClose={handleCloseReportModal}
          onSave={handleSaveReport}
        />
      )}

      {selectedAgent && (
        <AgentConfigModal
          agent={selectedAgent}
          onClose={handleCloseAgentModal}
          onSave={handleSaveAgent}
        />
      )}
    </div>
  );
};

export default DashboardPage;

// Sub-components for better organization

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  onExport: () => void;
  onNewReport: () => void;
  isExporting: boolean;
  exportLabel: string;
  newReportLabel: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle,
  onExport,
  onNewReport,
  isExporting,
  exportLabel,
  newReportLabel,
}) => (
  <div className="mb-6">
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
          {title}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
          {subtitle}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <button
          onClick={onExport}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={exportLabel}
        >
          <Download className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
          <span className="hidden sm:inline">{exportLabel}</span>
        </button>
        <button
          onClick={onNewReport}
          className="flex items-center gap-2 bg-teal-600 dark:bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors duration-200 shadow-sm hover:shadow-md"
          aria-label={newReportLabel}
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">{newReportLabel}</span>
        </button>
      </div>
    </div>
  </div>
);

interface DashboardSectionProps {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

const DashboardSection: React.FC<DashboardSectionProps> = ({
  title,
  action,
  children,
}) => (
  <section className="rounded-lg bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900 transition-shadow hover:shadow-md">
    <div className="p-4 sm:p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </div>
  </section>
);

interface ReportsListProps {
  reports: ReportConfig[];
}

const ReportsList: React.FC<ReportsListProps> = ({ reports }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {reports.map((report) => (
      <div
        key={report.id}
        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-teal-500 dark:hover:border-teal-400 transition-colors cursor-pointer"
      >
        <h3 className="font-medium text-gray-900 dark:text-gray-100">
          {report.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {report.type}
        </p>
        {report.schedule && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            {report.schedule}
          </p>
        )}
      </div>
    ))}
  </div>
);
