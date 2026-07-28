import React, { useState } from 'react';
import { Brain } from 'lucide-react';

interface LearningConfigProps {
  config: {
    sources: string[];
    updateFrequency: 'daily' | 'weekly' | 'monthly';
  };
}

export default function LearningConfig({ config }: LearningConfigProps) {
  const [learningConfig, setLearningConfig] = useState(config);

  const handleSourceChange = (source: string, checked: boolean) => {
    setLearningConfig({
      ...learningConfig,
      sources: checked
        ? [...learningConfig.sources, source]
        : learningConfig.sources.filter(s => s !== source)
    });
  };

  const handleFrequencyChange = (frequency: 'daily' | 'weekly' | 'monthly') => {
    setLearningConfig({
      ...learningConfig,
      updateFrequency: frequency
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground dark:text-foreground">Learning and improvement</h3>
      
      <div className="border border-border dark:border-border bg-white dark:bg-surface-container-highest rounded-lg p-4 transition-colors">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-primary-green dark:text-teal-300" />
          <h4 className="font-medium text-foreground dark:text-foreground">Learning Sources</h4>
        </div>
        <div className="space-y-2">
          {learningConfig.sources.map((source) => (
            <label key={source} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={learningConfig.sources.includes(source)}
                onChange={(e) => handleSourceChange(source, e.target.checked)}
                className="rounded border-border dark:border-border bg-white dark:bg-surface-container-highest text-primary-green dark:text-primary-green focus:ring-ring dark:focus:ring-ring focus:ring-offset-2 dark:focus:ring-offset-gray-700 transition-colors"
              />
              <span className="text-on-surface dark:text-on-surface-variant">{source}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="font-medium text-foreground dark:text-foreground mb-3">Update frequency</h4>
        <div className="flex gap-4">
          {['daily', 'weekly', 'monthly'].map((frequency) => (
            <label key={frequency} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="updateFrequency"
                checked={learningConfig.updateFrequency === frequency}
                onChange={() => handleFrequencyChange(frequency as 'daily' | 'weekly' | 'monthly')}
                className="border-border dark:border-border bg-white dark:bg-surface-container-highest text-primary-green dark:text-primary-green focus:ring-ring dark:focus:ring-ring focus:ring-offset-2 dark:focus:ring-offset-gray-700 transition-colors"
              />
              <span className="capitalize text-on-surface dark:text-on-surface-variant">{frequency}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
