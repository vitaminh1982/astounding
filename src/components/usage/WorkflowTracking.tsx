import React from 'react';
import { GitBranch, CheckCircle, XCircle } from 'lucide-react';
import { UsageMetrics } from '../../types/usage';

interface WorkflowTrackingProps {
  usageData: UsageMetrics;
}

export default function WorkflowTracking({ usageData }: WorkflowTrackingProps) {
  const { workflows } = usageData;
  
  return (
    <div className="bg-white dark:bg-surface-container-high rounded-lg shadow-sm dark:shadow-gray-900 border border-border dark:border-border p-6 transition-colors">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-foreground dark:text-foreground">Workflow Tracking</h3>
        <div className="p-2 bg-indigo-100 dark:bg-green-900 rounded-lg transition-colors">
          <GitBranch className="w-5 h-5 text-primary-green dark:text-green-300" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-surface-container-low dark:bg-surface-container-highest border border-border dark:border-border rounded-lg p-4 transition-colors">
          <p className="text-sm text-muted-foreground dark:text-muted-foreground">Workflows Executed</p>
          <p className="text-2xl font-bold text-foreground dark:text-foreground">{workflows.executed}</p>
        </div>
        
        <div className="bg-surface-container-low dark:bg-surface-container-highest border border-border dark:border-border rounded-lg p-4 transition-colors">
          <p className="text-sm text-muted-foreground dark:text-muted-foreground">Success Rate</p>
          <div className="flex items-center">
            <p className="text-2xl font-bold text-foreground dark:text-foreground">{workflows.successRate}%</p>
            <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400 ml-2" />
          </div>
        </div>
        
        <div className="bg-surface-container-low dark:bg-surface-container-highest border border-border dark:border-border rounded-lg p-4 transition-colors">
          <p className="text-sm text-muted-foreground dark:text-muted-foreground">Failure Rate</p>
          <div className="flex items-center">
            <p className="text-2xl font-bold text-foreground dark:text-foreground">{100 - workflows.successRate}%</p>
            <XCircle className="w-5 h-5 text-destructive dark:text-destructive ml-2" />
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-on-surface dark:text-on-surface-variant mb-4">Most Frequently Used Workflows</h4>
        <div className="space-y-4">
          {workflows.mostUsed.map((workflow) => (
            <div key={workflow.id} className="bg-surface-container-low dark:bg-surface-container-highest border border-border dark:border-border rounded-lg p-4 transition-colors">
              <div className="flex justify-between items-center mb-2">
                <h5 className="font-medium text-foreground dark:text-foreground">{workflow.name}</h5>
                <span className="text-sm text-muted-foreground dark:text-muted-foreground">{workflow.count} executions</span>
              </div>
              <div className="w-full h-2 bg-surface-container dark:bg-surface-container-highest rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary dark:bg-primary transition-colors"
                  style={{ width: `${workflow.percentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-muted-foreground dark:text-muted-foreground mt-1 text-right">
                {workflow.percentage}% of total
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
