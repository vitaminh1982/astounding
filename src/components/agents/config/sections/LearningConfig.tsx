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
      <h3 className="text-lg font-semibold">Learning and improvement</h3>
      
      <div className="border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-indigo-600" />
          <h4 className="font-medium">Learning Sources</h4>
        </div>
        <div className="space-y-2">
          {learningConfig.sources.map((source) => (
            <label key={source} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={learningConfig.sources.includes(source)}
                onChange={(e) => handleSourceChange(source, e.target.checked)}
                className="rounded border-gray-300 text-indigo-600"
              />
              <span>{source}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="font-medium mb-3">Update frequency</h4>
        <div className="flex gap-4">
          {['daily', 'weekly', 'monthly'].map((frequency) => (
            <label key={frequency} className="flex items-center gap-2">
              <input
                type="radio"
                name="updateFrequency"
                checked={learningConfig.updateFrequency === frequency}
                onChange={() => handleFrequencyChange(frequency as 'daily' | 'weekly' | 'monthly')}
                className="text-indigo-600"
              />
              <span className="capitalize">{frequency}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}