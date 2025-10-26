import React from 'react';
import { RefreshCw, Calendar } from 'lucide-react';

interface OrchestrationHeaderProps {
  selectedTimeRange: string;
  onTimeRangeChange: (range: string) => void;
  onRefresh: () => void;
}

const OrchestrationHeader: React.FC<OrchestrationHeaderProps> = ({
  selectedTimeRange,
  onTimeRangeChange,
  onRefresh
}) => {
  return (
    <header className="mb-6">
      {/* Apply dark mode background and text colors */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-lg shadow-md bg-white dark:bg-gray-800 dark:shadow-xl">
        <div>
          {/* Apply dark mode heading and paragraph colors */}
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Orchestration Hub
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Central command center for multi-agent AI ecosystem management
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {/* Time range selector with dark mode styling */}
          <div className="flex items-center bg-white border border-gray-300 dark:bg-gray-700 dark:border-gray-600 rounded-lg overflow-hidden shadow-sm">
            <Calendar className="ml-3 w-4 h-4 text-gray-600 dark:text-gray-400" />
            <select
              className="w-full py-2 pl-2 pr-8 bg-transparent border-none focus:ring-0 text-sm font-medium text-gray-800 dark:text-gray-200"
              value={selectedTimeRange}
              onChange={(e) => onTimeRangeChange(e.target.value)}
            >
              <option value="1h" className="dark:bg-gray-800 dark:text-gray-200">Last Hour</option>
              <option value="24h" className="dark:bg-gray-800 dark:text-gray-200">Last 24 Hours</option>
              <option value="7d" className="dark:bg-gray-800 dark:text-gray-200">Last 7 Days</option>
              <option value="30d" className="dark:bg-gray-800 dark:text-gray-200">Last 30 Days</option>
            </select>
          </div>
          {/* Refresh button with dark mode styling */}
          <button
            onClick={onRefresh}
            className="flex items-center justify-center gap-2 bg-white border border-gray-300 dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm font-medium"
          >
            <RefreshCw className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span>Refresh</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default React.memo(OrchestrationHeader);
