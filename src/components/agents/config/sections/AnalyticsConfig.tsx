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
      <h3 className="text-lg font-semibold text-foreground dark:text-foreground">Analytics and Reporting</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="border border-border dark:border-border bg-white dark:bg-surface-container-highest rounded-lg p-4 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-on-surface dark:text-on-surface-variant">Resolution rate</span>
            <BarChart2 className="w-4 h-4 text-outline dark:text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold text-primary-green dark:text-green-400">{metrics.resolutionRate}%</div>
        </div>

        <div className="border border-border dark:border-border bg-white dark:bg-surface-container-highest rounded-lg p-4 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-on-surface dark:text-on-surface-variant">Response Time</span>
            <Clock className="w-4 h-4 text-outline dark:text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold text-primary-green dark:text-green-400">{metrics.responseTime}</div>
        </div>

        <div className="border border-border dark:border-border bg-white dark:bg-surface-container-highest rounded-lg p-4 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-on-surface dark:text-on-surface-variant">CSAT Score</span>
            <Star className="w-4 h-4 text-outline dark:text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold text-primary-green dark:text-green-400">{metrics.csatScore}/5</div>
        </div>
      </div>
    </div>
  );
}
