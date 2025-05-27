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
    high: 'text-red-600 bg-red-50',
    medium: 'text-yellow-600 bg-yellow-50',
    low: 'text-green-600 bg-green-50'
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Usage Forecasting</h3>
        <div className="p-2 bg-indigo-100 rounded-lg">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className={`rounded-lg p-4 ${warningColors[warningLevel]}`}>
          <div className="flex items-center mb-2">
            <Calendar className="w-5 h-5 mr-2" />
            <h4 className="font-medium">Estimated Depletion Date</h4>
          </div>
          <p className="text-2xl font-bold">{new Date(projectedUsage.estimatedDepletion).toLocaleDateString()}</p>
          <p className="text-sm mt-1">
            {daysUntilDepletion} days remaining at current usage rate
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <TrendingUp className="w-5 h-5 text-gray-500 mr-2" />
            <h4 className="font-medium">Projected Usage</h4>
          </div>
          <p className="text-2xl font-bold">{projectedUsage.projectedUsage.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">
            {projectedPercentage.toFixed(1)}% of your total credits
          </p>
          
          <div className="mt-2 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${
                projectedPercentage >= 90 ? 'bg-red-500' :
                projectedPercentage >= 75 ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${Math.min(projectedPercentage, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {warningLevel === 'high' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-800">Credit Limit Alert</h4>
              <p className="text-sm text-red-600 mt-1">
                You're projected to reach your credit limit in less than 7 days. Consider upgrading your plan or optimizing your usage.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-4">Usage Trend</h4>
        <div className="h-48 bg-gray-50 rounded-lg p-4 flex items-center justify-center">
          <div className="w-full h-full relative">
            {/* Simplified trend line visualization */}
            <svg viewBox="0 0 100 50" className="w-full h-full">
              {/* Current usage line */}
              <path
                d="M0,50 L10,45 L20,42 L30,40 L40,35 L50,30 L60,25 L70,20 L80,15 L90,10 L100,5"
                fill="none"
                stroke="#4F46E5"
                strokeWidth="2"
              />
              
              {/* Projected usage (dashed) */}
              <path
                d="M60,25 L70,20 L80,15 L90,10 L100,5"
                fill="none"
                stroke="#4F46E5"
                strokeWidth="2"
                strokeDasharray="4"
              />
              
              {/* Limit line */}
              <line
                x1="0"
                y1="5"
                x2="100"
                y2="5"
                stroke="#DC2626"
                strokeWidth="1"
                strokeDasharray="4"
              />
              
              {/* Axis labels */}
              <text x="0" y="60" className="text-xs fill-gray-500">Now</text>
              <text x="90" y="60" className="text-xs fill-gray-500">30 days</text>
              <text x="100" y="5" className="text-xs fill-red-500 text-right">Limit</text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}