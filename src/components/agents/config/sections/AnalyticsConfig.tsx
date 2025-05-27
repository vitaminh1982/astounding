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
      <h3 className="text-lg font-semibold">Analytics and Reporting</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Resolution rate</span>
            <BarChart2 className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-indigo-600">{metrics.resolutionRate}%</div>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Response Time</span>
            <Clock className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-indigo-600">{metrics.responseTime}</div>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">CSAT Score</span>
            <Star className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-indigo-600">{metrics.csatScore}/5</div>
        </div>
      </div>
    </div>
  );
}