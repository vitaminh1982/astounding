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
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Learning and improvement</h3>
      
      <div className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg p-4 transition-colors">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-indigo-600 dark:text-teal-300" />
          <h4 className="font-medium text-gray-900 dark:text-gray-100">Learning Sources</h4>
        </div>
        <div className="space-y-2">
          {learningConfig.sources.map((source) => (
            <label key={source} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={learningConfig.sources.includes(source)}
                onChange={(e) => handleSourceChange(source, e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-indigo-600 dark:text-teal-500 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-700 transition-colors"
              />
              <span className="text-gray-700 dark:text-gray-200">{source}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Update frequency</h4>
        <div className="flex gap-4">
          {['daily', 'weekly', 'monthly'].map((frequency) => (
            <label key={frequency} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="updateFrequency"
                checked={learningConfig.updateFrequency === frequency}
                onChange={() => handleFrequencyChange(frequency as 'daily' | 'weekly' | 'monthly')}
                className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-indigo-600 dark:text-teal-500 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-700 transition-colors"
              />
              <span className="capitalize text-gray-700 dark:text-gray-200">{frequency}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
