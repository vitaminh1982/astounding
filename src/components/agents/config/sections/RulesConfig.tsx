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
      <h3 className="text-lg font-semibold">Managing rules</h3>
      
      <div>
        <h4 className="font-medium mb-2">Availabilities schedule</h4>
        <div className="p-2 border rounded-md bg-gray-50">
          {rulesConfig.availability}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-indigo-600" />
            <h4 className="font-medium">Escalation threshold</h4>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600">Max response time</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={rulesConfig.thresholds.maxResponseTime}
                  onChange={(e) => handleThresholdChange('maxResponseTime', parseInt(e.target.value))}
                  className="w-20 px-2 py-1 border rounded"
                />
                <span className="text-sm text-gray-500">seconds</span>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600">Max session duration</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={rulesConfig.thresholds.maxSessionDuration}
                  onChange={(e) => handleThresholdChange('maxSessionDuration', parseInt(e.target.value))}
                  className="w-20 px-2 py-1 border rounded"
                />
                <span className="text-sm text-gray-500">minutes</span>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600">Max attempts</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={rulesConfig.thresholds.maxAttempts}
                  onChange={(e) => handleThresholdChange('maxAttempts', parseInt(e.target.value))}
                  className="w-20 px-2 py-1 border rounded"
                />
                <span className="text-sm text-gray-500">trials</span>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600">Trust Score</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={rulesConfig.thresholds.confidenceScore}
                  onChange={(e) => handleThresholdChange('confidenceScore', parseInt(e.target.value))}
                  className="w-20 px-2 py-1 border rounded"
                />
                <span className="text-sm text-gray-500">%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h4 className="font-medium">Escalation Conditions towards Human</h4>
          </div>
          <div className="space-y-2">
            {rulesConfig.escalationConditions.map((condition, index) => (
              <label key={index} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={rulesConfig.escalationConditions.includes(condition)}
                  onChange={(e) => handleConditionChange(condition, e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600"
                />
                <span className="text-sm">{condition}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}