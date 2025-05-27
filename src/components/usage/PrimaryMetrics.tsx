import React from 'react';
import { AlertCircle } from 'lucide-react';
import { UsageMetrics } from '../../types/usage';

interface PrimaryMetricsProps {
  usageData: UsageMetrics;
}

export default function PrimaryMetrics({ usageData }: PrimaryMetricsProps) {
  const { credits, messages } = usageData;
  
  const getColorClass = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600 bg-red-100';
    if (percentage >= 75) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getProgressColorClass = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Credits Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Remaining Credits</h3>
            <p className="text-sm text-gray-500">Current billing period</p>
          </div>
          {credits.percentage >= 75 && (
            <div className={`p-1.5 rounded-full ${getColorClass(credits.percentage)}`}>
              <AlertCircle className="w-5 h-5" />
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-end mb-2">
            <div className="text-3xl font-bold">{credits.used.toLocaleString()}</div>
            <div className="text-gray-500">of {credits.total.toLocaleString()} credits</div>
          </div>
          
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${getProgressColorClass(credits.percentage)} transition-all duration-500 ease-in-out`}
              style={{ width: `${credits.percentage}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between mt-2 text-sm">
            <div className={`font-medium ${getColorClass(credits.percentage)}`}>
              {credits.percentage}% used
            </div>
            <div className="text-gray-500">
              {(credits.total - credits.used).toLocaleString()} credits remaining
            </div>
          </div>
        </div>
        
        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <p>Based on your current usage, you'll reach your limit around <span className="font-medium">{usageData.projectedUsage.estimatedDepletion}</span></p>
        </div>
      </div>

      {/* Messages Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Message Count</h3>
            <p className="text-sm text-gray-500">Current billing period</p>
          </div>
          {messages.percentage >= 75 && (
            <div className={`p-1.5 rounded-full ${getColorClass(messages.percentage)}`}>
              <AlertCircle className="w-5 h-5" />
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-end mb-2">
            <div className="text-3xl font-bold">{messages.used.toLocaleString()}</div>
            <div className="text-gray-500">of {messages.total.toLocaleString()} messages</div>
          </div>
          
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${getProgressColorClass(messages.percentage)} transition-all duration-500 ease-in-out`}
              style={{ width: `${messages.percentage}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between mt-2 text-sm">
            <div className={`font-medium ${getColorClass(messages.percentage)}`}>
              {messages.percentage}% used
            </div>
            <div className="text-gray-500">
              {(messages.total - messages.used).toLocaleString()} messages remaining
            </div>
          </div>
        </div>
        
        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <p>Average of <span className="font-medium">{usageData.conversations.averageMessagesPerConversation}</span> messages per conversation</p>
        </div>
      </div>
    </div>
  );
}