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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Orchestration Hub
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Central command center for multi-agent AI ecosystem management
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
            <Calendar className="ml-3 w-4 h-4 text-gray-600" />
            <select
              className="w-full py-2 pl-2 pr-8 bg-transparent border-none focus:ring-0 text-sm text-gray-800 font-medium"
              value={selectedTimeRange}
              onChange={(e) => onTimeRangeChange(e.target.value)}
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
          <button 
            onClick={onRefresh}
            className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default React.memo(OrchestrationHeader);

gee