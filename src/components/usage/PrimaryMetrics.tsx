import React from 'react';
import { AlertCircle } from 'lucide-react';
import { UsageMetrics } from '../../types/usage';

interface PrimaryMetricsProps {
  usageData: UsageMetrics;
}

export default function PrimaryMetrics({ usageData }: PrimaryMetricsProps) {
  const { credits, messages } = usageData;
  
  const getColorClass = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600 dark:text-destructive bg-red-100 dark:bg-red-900';
    if (percentage >= 75) return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900';
    return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900';
  };

  const getProgressColorClass = (percentage: number) => {
    if (percentage >= 90) return 'bg-destructive dark:bg-destructive';
    if (percentage >= 75) return 'bg-yellow-500 dark:bg-yellow-400';
    return 'bg-green-500 dark:bg-green-400';
  };

  const getTextColorClass = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600 dark:text-destructive';
    if (percentage >= 75) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Credits Card */}
      <div className="bg-white dark:bg-surface-container-high rounded-lg shadow-sm dark:shadow-gray-900 border border-border dark:border-border p-6 transition-colors">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground dark:text-foreground">Remaining Credits</h3>
            <p className="text-sm text-muted-foreground dark:text-muted-foreground">Current billing period</p>
          </div>
          {credits.percentage >= 75 && (
            <div className={`p-1.5 rounded-full ${getColorClass(credits.percentage)} transition-colors`}>
              <AlertCircle className="w-5 h-5" />
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-end mb-2">
            <div className="text-3xl font-bold text-foreground dark:text-foreground">{credits.used.toLocaleString()}</div>
            <div className="text-muted-foreground dark:text-muted-foreground">of {credits.total.toLocaleString()} credits</div>
          </div>
          
          <div className="w-full h-3 bg-surface-container dark:bg-surface-container-highest rounded-full overflow-hidden">
            <div 
              className={`h-full ${getProgressColorClass(credits.percentage)} transition-all duration-500 ease-in-out`}
              style={{ width: `${credits.percentage}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between mt-2 text-sm">
            <div className={`font-medium ${getTextColorClass(credits.percentage)}`}>
              {credits.percentage}% used
            </div>
            <div className="text-muted-foreground dark:text-muted-foreground">
              {(credits.total - credits.used).toLocaleString()} credits remaining
            </div>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground dark:text-muted-foreground bg-surface-container-low dark:bg-surface-container-highest border border-border dark:border-border p-3 rounded-lg transition-colors">
          <p>Based on your current usage, you'll reach your limit around <span className="font-medium text-foreground dark:text-foreground">{usageData.projectedUsage.estimatedDepletion}</span></p>
        </div>
      </div>

      {/* Messages Card */}
      <div className="bg-white dark:bg-surface-container-high rounded-lg shadow-sm dark:shadow-gray-900 border border-border dark:border-border p-6 transition-colors">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground dark:text-foreground">Message Count</h3>
            <p className="text-sm text-muted-foreground dark:text-muted-foreground">Current billing period</p>
          </div>
          {messages.percentage >= 75 && (
            <div className={`p-1.5 rounded-full ${getColorClass(messages.percentage)} transition-colors`}>
              <AlertCircle className="w-5 h-5" />
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-end mb-2">
            <div className="text-3xl font-bold text-foreground dark:text-foreground">{messages.used.toLocaleString()}</div>
            <div className="text-muted-foreground dark:text-muted-foreground">of {messages.total.toLocaleString()} messages</div>
          </div>
          
          <div className="w-full h-3 bg-surface-container dark:bg-surface-container-highest rounded-full overflow-hidden">
            <div 
              className={`h-full ${getProgressColorClass(messages.percentage)} transition-all duration-500 ease-in-out`}
              style={{ width: `${messages.percentage}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between mt-2 text-sm">
            <div className={`font-medium ${getTextColorClass(messages.percentage)}`}>
              {messages.percentage}% used
            </div>
            <div className="text-muted-foreground dark:text-muted-foreground">
              {(messages.total - messages.used).toLocaleString()} messages remaining
            </div>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground dark:text-muted-foreground bg-surface-container-low dark:bg-surface-container-highest border border-border dark:border-border p-3 rounded-lg transition-colors">
          <p>Average of <span className="font-medium text-foreground dark:text-foreground">{usageData.conversations.averageMessagesPerConversation}</span> messages per conversation</p>
        </div>
      </div>
    </div>
  );
}
