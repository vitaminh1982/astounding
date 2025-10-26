import React, { useState } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface RulesConfigProps {
  config: {
    availability: string;
    thresholds: {
      maxResponseTime: number;
      maxSessionDuration: number;
      maxAttempts: number;
      confidenceScore: number;
    };
    escalationConditions: string[];
  };
}

export default function RulesConfig({ config }: RulesConfigProps) {
  const [rulesConfig, setRulesConfig] = useState(config);

  const handleThresholdChange = (field: keyof typeof rulesConfig.thresholds, value: number) => {
    setRulesConfig({
      ...rulesConfig,
      thresholds: {
        ...rulesConfig.thresholds,
        [field]: value
      }
    });
  };

  const handleConditionChange = (condition: string, checked: boolean) => {
    setRulesConfig({
      ...rulesConfig,
      escalationConditions: checked
        ? [...rulesConfig.escalationConditions, condition]
        : rulesConfig.escalationConditions.filter(c => c !== condition)
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Managing rules</h3>
      
      <div>
        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Availabilities schedule</h4>
        <div className="p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors">
          {rulesConfig.availability}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg p-4 transition-colors">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-indigo-600 dark:text-teal-300" />
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Escalation threshold</h4>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-200">Max response time</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={rulesConfig.thresholds.maxResponseTime}
                  onChange={(e) => handleThresholdChange('maxResponseTime', parseInt(e.target.value))}
                  className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 transition-colors"
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">seconds</span>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-200">Max session duration</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={rulesConfig.thresholds.maxSessionDuration}
                  onChange={(e) => handleThresholdChange('maxSessionDuration', parseInt(e.target.value))}
                  className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 transition-colors"
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">minutes</span>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-200">Max attempts</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={rulesConfig.thresholds.maxAttempts}
                  onChange={(e) => handleThresholdChange('maxAttempts', parseInt(e.target.value))}
                  className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 transition-colors"
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">trials</span>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-200">Trust Score</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={rulesConfig.thresholds.confidenceScore}
                  onChange={(e) => handleThresholdChange('confidenceScore', parseInt(e.target.value))}
                  className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 transition-colors"
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg p-4 transition-colors">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-500 dark:text-amber-400" />
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Escalation Conditions towards Human</h4>
          </div>
          <div className="space-y-2">
            {rulesConfig.escalationConditions.map((condition, index) => (
              <label key={index} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rulesConfig.escalationConditions.includes(condition)}
                  onChange={(e) => handleConditionChange(condition, e.target.checked)}
                  className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-indigo-600 dark:text-teal-500 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-700 transition-colors"
                />
                <span className="text-sm text-gray-700 dark:text-gray-200">{condition}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
