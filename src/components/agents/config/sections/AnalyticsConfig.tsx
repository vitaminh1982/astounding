import React from 'react';
import { BarChart2, Clock, Star } from 'lucide-react';

interface AnalyticsConfigProps {
  metrics: {
    resolutionRate: number;
    responseTime: string;
    csatScore: number;
  };
}

export default function AnalyticsConfig({ metrics }: AnalyticsConfigProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Analytics and Reporting</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg p-4 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Resolution rate</span>
            <BarChart2 className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="text-2xl font-bold text-indigo-600 dark:text-teal-400">{metrics.resolutionRate}%</div>
        </div>

        <div className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg p-4 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Response Time</span>
            <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="text-2xl font-bold text-indigo-600 dark:text-teal-400">{metrics.responseTime}</div>
        </div>

        <div className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg p-4 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">CSAT Score</span>
            <Star className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="text-2xl font-bold text-indigo-600 dark:text-teal-400">{metrics.csatScore}/5</div>
        </div>
      </div>
    </div>
  );
}
