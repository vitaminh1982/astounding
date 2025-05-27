import React, { useState } from 'react';
import { AlertTriangle, Clock, FileText, Search } from 'lucide-react';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  details?: string;
}

interface LogsOverviewProps {
  workflowId: string;
  logs?: LogEntry[];
  isLoading?: boolean;
  error?: string;
}

const LogsOverview: React.FC<LogsOverviewProps> = ({
  workflowId,
  logs = [],
  isLoading = false,
  error,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = logs.filter(log => 
    log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.details?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getLogLevelColor = (level: LogEntry['level']) => {
    const colors = {
      info: 'text-blue-600 bg-blue-100',
      warning: 'text-yellow-600 bg-yellow-100',
      error: 'text-red-600 bg-red-100',
    };
    return colors[level];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-600 text-center">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
          <p className="text-lg font-medium">Error loading logs</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold">Logs Overview</h2>
            <p className="text-sm text-gray-500">
              View detailed logs of your workflow agent
            </p>
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12">
            <div className="rounded-full bg-gray-100 p-3 mx-auto w-fit">
              <FileText className="w-6 h-6 text-gray-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No logs available</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery ? 'No logs match your search criteria.' : 'There are no logs to display.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-md ${getLogLevelColor(log.level)} mr-3`}>
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">{log.message}</h3>
                        <p className="text-sm text-gray-500">{log.details}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <span className="text-xs text-gray-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LogsOverview;