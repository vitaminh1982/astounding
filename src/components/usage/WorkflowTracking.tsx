import React from 'react';
import { GitBranch, CheckCircle, XCircle } from 'lucide-react';
import { UsageMetrics } from '../../types/usage';

interface WorkflowTrackingProps {
  usageData: UsageMetrics;
}

export default function WorkflowTracking({ usageData }: WorkflowTrackingProps) {
  const { workflows } = usageData;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 border border-gray-200 dark:border-gray-700 p-6 transition-colors">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Workflow Tracking</h3>
        <div className="p-2 bg-indigo-100 dark:bg-teal-900 rounded-lg transition-colors">
          <GitBranch className="w-5 h-5 text-indigo-600 dark:text-teal-300" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-lg p-4 transition-colors">
          <p className="text-sm text-gray-500 dark:text-gray-400">Workflows Executed</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{workflows.executed}</p>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-lg p-4 transition-colors">
          <p className="text-sm text-gray-500 dark:text-gray-400">Success Rate</p>
          <div className="flex items-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{workflows.successRate}%</p>
            <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400 ml-2" />
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-lg p-4 transition-colors">
          <p className="text-sm text-gray-500 dark:text-gray-400">Failure Rate</p>
          <div className="flex items-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{100 - workflows.successRate}%</p>
            <XCircle className="w-5 h-5 text-red-500 dark:text-red-400 ml-2" />
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-4">Most Frequently Used Workflows</h4>
        <div className="space-y-4">
          {workflows.mostUsed.map((workflow) => (
            <div key={workflow.id} className="bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-lg p-4 transition-colors">
              <div className="flex justify-between items-center mb-2">
                <h5 className="font-medium text-gray-900 dark:text-gray-100">{workflow.name}</h5>
                <span className="text-sm text-gray-500 dark:text-gray-400">{workflow.count} executions</span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 dark:bg-teal-500 transition-colors"
                  style={{ width: `${workflow.percentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                {workflow.percentage}% of total
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
