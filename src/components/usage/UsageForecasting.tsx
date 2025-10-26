import React from 'react';
import { TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import { UsageMetrics } from '../../types/usage';

interface UsageForecastingProps {
  usageData: UsageMetrics;
}

export default function UsageForecasting({ usageData }: UsageForecastingProps) {
  const { credits, projectedUsage } = usageData;
  
  // Calculate days until depletion
  const today = new Date();
  const depletionDate = new Date(projectedUsage.estimatedDepletion);
  const daysUntilDepletion = Math.ceil((depletionDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  // Calculate projected usage percentage
  const projectedPercentage = (projectedUsage.projectedUsage / credits.total) * 100;
  
  // Determine warning level
  const getWarningLevel = () => {
    if (daysUntilDepletion <= 7) return 'high';
    if (daysUntilDepletion <= 14) return 'medium';
    return 'low';
  };
  
  const warningLevel = getWarningLevel();
  
  const warningColors = {
    high: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900 border-red-100 dark:border-red-800',
    medium: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900 border-yellow-100 dark:border-yellow-800',
    low: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900 border-green-100 dark:border-green-800'
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 border border-gray-200 dark:border-gray-700 p-6 transition-colors">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Usage Forecasting</h3>
        <div className="p-2 bg-indigo-100 dark:bg-teal-900 rounded-lg transition-colors">
          <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-teal-300" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className={`rounded-lg p-4 border transition-colors ${warningColors[warningLevel]}`}>
          <div className="flex items-center mb-2">
            <Calendar className="w-5 h-5 mr-2" />
            <h4 className="font-medium">Estimated Depletion Date</h4>
          </div>
          <p className="text-2xl font-bold">{new Date(projectedUsage.estimatedDepletion).toLocaleDateString()}</p>
          <p className="text-sm mt-1">
            {daysUntilDepletion} days remaining at current usage rate
          </p>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-lg p-4 transition-colors">
          <div className="flex items-center mb-2">
            <TrendingUp className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Projected Usage</h4>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{projectedUsage.projectedUsage.toLocaleString()}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {projectedPercentage.toFixed(1)}% of your total credits
          </p>
          
          <div className="mt-2 w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-colors ${
                projectedPercentage >= 90 ? 'bg-red-500 dark:bg-red-400' :
                projectedPercentage >= 75 ? 'bg-yellow-500 dark:bg-yellow-400' :
                'bg-green-500 dark:bg-green-400'
              }`}
              style={{ width: `${Math.min(projectedPercentage, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {warningLevel === 'high' && (
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 transition-colors">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-3 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-800 dark:text-red-200">Credit Limit Alert</h4>
              <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                You're projected to reach your credit limit in less than 7 days. Consider upgrading your plan or optimizing your usage.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-4">Usage Trend</h4>
        <div className="h-48 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-lg p-4 flex items-center justify-center transition-colors">
          <div className="w-full h-full relative">
            {/* Simplified trend line visualization */}
            <svg viewBox="0 0 100 50" className="w-full h-full">
              {/* Current usage line */}
              <path
                d="M0,50 L10,45 L20,42 L30,40 L40,35 L50,30 L60,25 L70,20 L80,15 L90,10 L100,5"
                fill="none"
                stroke="var(--usage-line-color)"
                strokeWidth="2"
                className="[--usage-line-color:#4F46E5] dark:[--usage-line-color:#14B8A6]"
              />
              
              {/* Projected usage (dashed) */}
              <path
                d="M60,25 L70,20 L80,15 L90,10 L100,5"
                fill="none"
                stroke="var(--usage-line-color)"
                strokeWidth="2"
                strokeDasharray="4"
                className="[--usage-line-color:#4F46E5] dark:[--usage-line-color:#14B8A6]"
              />
              
              {/* Limit line */}
              <line
                x1="0"
                y1="5"
                x2="100"
                y2="5"
                stroke="var(--limit-line-color)"
                strokeWidth="1"
                strokeDasharray="4"
                className="[--limit-line-color:#DC2626] dark:[--limit-line-color:#F87171]"
              />
              
              {/* Axis labels */}
              <text x="0" y="60" className="text-xs fill-gray-500 dark:fill-gray-400">Now</text>
              <text x="90" y="60" className="text-xs fill-gray-500 dark:fill-gray-400">30 days</text>
              <text x="100" y="5" className="text-xs fill-red-500 dark:fill-red-400 text-right">Limit</text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
