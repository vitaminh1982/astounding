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
      <h3 className="text-lg font-semibold text-foreground dark:text-foreground">Managing rules</h3>
      
      <div>
        <h4 className="font-medium text-foreground dark:text-foreground mb-2">Availabilities schedule</h4>
        <div className="p-2 border border-border dark:border-border rounded-md bg-surface-container-low dark:bg-surface-container-highest text-foreground dark:text-foreground transition-colors">
          {rulesConfig.availability}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="border border-border dark:border-border bg-white dark:bg-surface-container-highest rounded-lg p-4 transition-colors">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-primary-green dark:text-teal-300" />
            <h4 className="font-medium text-foreground dark:text-foreground">Escalation threshold</h4>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-muted-foreground dark:text-on-surface-variant">Max response time</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={rulesConfig.thresholds.maxResponseTime}
                  onChange={(e) => handleThresholdChange('maxResponseTime', parseInt(e.target.value))}
                  className="w-20 px-2 py-1 border border-border dark:border-border bg-white dark:bg-surface-container-highest text-foreground dark:text-foreground rounded focus:outline-none focus:ring-2 focus:ring-ring dark:focus:ring-ring transition-colors"
                />
                <span className="text-sm text-muted-foreground dark:text-muted-foreground">seconds</span>
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground dark:text-on-surface-variant">Max session duration</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={rulesConfig.thresholds.maxSessionDuration}
                  onChange={(e) => handleThresholdChange('maxSessionDuration', parseInt(e.target.value))}
                  className="w-20 px-2 py-1 border border-border dark:border-border bg-white dark:bg-surface-container-highest text-foreground dark:text-foreground rounded focus:outline-none focus:ring-2 focus:ring-ring dark:focus:ring-ring transition-colors"
                />
                <span className="text-sm text-muted-foreground dark:text-muted-foreground">minutes</span>
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground dark:text-on-surface-variant">Max attempts</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={rulesConfig.thresholds.maxAttempts}
                  onChange={(e) => handleThresholdChange('maxAttempts', parseInt(e.target.value))}
                  className="w-20 px-2 py-1 border border-border dark:border-border bg-white dark:bg-surface-container-highest text-foreground dark:text-foreground rounded focus:outline-none focus:ring-2 focus:ring-ring dark:focus:ring-ring transition-colors"
                />
                <span className="text-sm text-muted-foreground dark:text-muted-foreground">trials</span>
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground dark:text-on-surface-variant">Trust Score</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={rulesConfig.thresholds.confidenceScore}
                  onChange={(e) => handleThresholdChange('confidenceScore', parseInt(e.target.value))}
                  className="w-20 px-2 py-1 border border-border dark:border-border bg-white dark:bg-surface-container-highest text-foreground dark:text-foreground rounded focus:outline-none focus:ring-2 focus:ring-ring dark:focus:ring-ring transition-colors"
                />
                <span className="text-sm text-muted-foreground dark:text-muted-foreground">%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-border dark:border-border bg-white dark:bg-surface-container-highest rounded-lg p-4 transition-colors">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-destructive dark:text-destructive" />
            <h4 className="font-medium text-foreground dark:text-foreground">Escalation Conditions towards Human</h4>
          </div>
          <div className="space-y-2">
            {rulesConfig.escalationConditions.map((condition, index) => (
              <label key={index} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rulesConfig.escalationConditions.includes(condition)}
                  onChange={(e) => handleConditionChange(condition, e.target.checked)}
                  className="rounded border-border dark:border-border bg-white dark:bg-surface-container-highest text-primary-green dark:text-primary-green focus:ring-ring dark:focus:ring-ring focus:ring-offset-2 dark:focus:ring-offset-gray-700 transition-colors"
                />
                <span className="text-sm text-on-surface dark:text-on-surface-variant">{condition}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
