import React from 'react';
import { GitBranch, CheckCircle, XCircle } from 'lucide-react';
import { UsageMetrics } from '../../types/usage';

interface WorkflowTrackingProps {
  usageData: UsageMetrics;
}

export default function WorkflowTracking({ usageData }: WorkflowTrackingProps) {
  const { workflows } = usageData;
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Workflow Tracking</h3>
        <div className="p-2 bg-indigo-100 rounded-lg">
          <GitBranch className="w-5 h-5 text-indigo-600" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">Workflows Executed</p>
          <p className="text-2xl font-bold">{workflows.executed}</p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">Success Rate</p>
          <div className="flex items-center">
            <p className="text-2xl font-bold">{workflows.successRate}%</p>
            <CheckCircle className="w-5 h-5 text-green-500 ml-2" />
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">Failure Rate</p>
          <div className="flex items-center">
            <p className="text-2xl font-bold">{100 - workflows.successRate}%</p>
            <XCircle className="w-5 h-5 text-red-500 ml-2" />
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-4">Most Frequently Used Workflows</h4>
        <div className="space-y-4">
          {workflows.mostUsed.map((workflow) => (
            <div key={workflow.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h5 className="font-medium">{workflow.name}</h5>
                <span className="text-sm text-gray-500">{workflow.count} executions</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500"
                  style={{ width: `${workflow.percentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1 text-right">
                {workflow.percentage}% of total
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}