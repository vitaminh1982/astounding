import React from 'react';
import { Client } from '../../../../types/client';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface AnalyticsProps {
  client: Client;
}

export default function Analytics({ client }: AnalyticsProps) {
  return (
    <div className="border rounded-lg p-4 sm:p-2 md:p-4">
      <h3 className="font-semibold text-lg sm:text-sm md:text-lg mb-4">Analytics</h3>
      
      <div className="space-y-4 sm:space-y-2 md:space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">Total Value (LTV)</span>
            <div className="flex items-center gap-1">
              {client.ltvTrend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm font-medium">{client.ltv}€</span>
            </div>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500"
              style={{ width: `${(client.ltv / 5000) * 100}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">Satisfaction</span>
            <span className="text-sm font-medium">{client.satisfaction}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500"
              style={{ width: `${client.satisfaction}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">Engagement</span>
            <span className="text-sm font-medium">{client.engagementScore}/100</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500"
              style={{ width: `${client.engagementScore}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
