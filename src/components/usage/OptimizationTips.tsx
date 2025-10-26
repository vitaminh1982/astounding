import React from 'react';
import { Lightbulb, Check, ChevronRight } from 'lucide-react';
import { UsageOptimizationTip } from '../../types/usage';

interface OptimizationTipsProps {
  tips: UsageOptimizationTip[];
  onImplementTip: (tipId: string) => void;
}

export default function OptimizationTips({ tips, onImplementTip }: OptimizationTipsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 border border-gray-200 dark:border-gray-700 p-6 transition-colors">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Usage Optimization Tips</h3>
        <div className="p-2 bg-indigo-100 dark:bg-teal-900 rounded-lg transition-colors">
          <Lightbulb className="w-5 h-5 text-indigo-600 dark:text-teal-300" />
        </div>
      </div>
      
      <div className="space-y-4">
        {tips.map((tip) => (
          <div 
            key={tip.id} 
            className={`border rounded-lg p-4 transition-colors ${
              tip.implemented 
                ? 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-800' 
                : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg mr-3 transition-colors ${
                    tip.implemented 
                      ? 'bg-green-100 dark:bg-green-800' 
                      : 'bg-indigo-100 dark:bg-teal-900'
                  }`}>
                    {tip.implemented ? (
                      <Check className="w-5 h-5 text-green-600 dark:text-green-300" />
                    ) : (
                      <Lightbulb className="w-5 h-5 text-indigo-600 dark:text-teal-300" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">{tip.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{tip.description}</p>
                  </div>
                </div>
              </div>
              <div className="ml-4 flex flex-col items-end">
                <div className="text-sm font-medium text-green-600 dark:text-green-400">
                  {tip.potentialSavings}
                </div>
                {!tip.implemented && (
                  <button
                    onClick={() => onImplementTip(tip.id)}
                    className="mt-2 flex items-center text-sm text-indigo-600 dark:text-teal-400 hover:text-indigo-800 dark:hover:text-teal-300 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-700 rounded-sm"
                  >
                    Implement
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Implementing these tips could save you up to 35% on your credit usage.
        </p>
      </div>
    </div>
  );
}
