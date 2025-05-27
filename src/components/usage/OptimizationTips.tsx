import React from 'react';
import { Lightbulb, Check, ChevronRight } from 'lucide-react';
import { UsageOptimizationTip } from '../../types/usage';

interface OptimizationTipsProps {
  tips: UsageOptimizationTip[];
  onImplementTip: (tipId: string) => void;
}

export default function OptimizationTips({ tips, onImplementTip }: OptimizationTipsProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Usage Optimization Tips</h3>
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Lightbulb className="w-5 h-5 text-indigo-600" />
        </div>
      </div>
      
      <div className="space-y-4">
        {tips.map((tip) => (
          <div 
            key={tip.id} 
            className={`border rounded-lg p-4 ${
              tip.implemented ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${
                    tip.implemented ? 'bg-green-100' : 'bg-indigo-100'
                  } mr-3`}>
                    {tip.implemented ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Lightbulb className="w-5 h-5 text-indigo-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium">{tip.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">{tip.description}</p>
                  </div>
                </div>
              </div>
              <div className="ml-4 flex flex-col items-end">
                <div className="text-sm font-medium text-green-600">
                  {tip.potentialSavings}
                </div>
                {!tip.implemented && (
                  <button
                    onClick={() => onImplementTip(tip.id)}
                    className="mt-2 flex items-center text-sm text-indigo-600 hover:text-indigo-800"
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
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Implementing these tips could save you up to 35% on your credit usage.
        </p>
      </div>
    </div>
  );
}