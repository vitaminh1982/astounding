import React, { useState } from 'react';
import { Bot, Brain, Activity } from 'lucide-react';
import SettingsCard from './SettingsCard';

export default function AISettings() {
  const [aiSettings, setAiSettings] = useState({
    responseTime: '10',
    escalationThreshold: '3',
    autonomyLevel: '75',
    dataSources: {
      conversations: true,
      knowledgeBase: true,
      faq: true,
      documents: true
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setAiSettings(prev => ({
        ...prev,
        dataSources: {
          ...prev.dataSources,
          [name]: checkbox.checked
        }
      }));
    } else {
      setAiSettings(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <SettingsCard
      title="AI Agents Configuration"
      icon={Bot}
    >
      <div className="md:grid md:grid-cols-2 md:gap-6 grid grid-cols-1">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Default Behavior</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Max Response Time</label>
              <select
                name="responseTime"
                value={aiSettings.responseTime}
                onChange={handleChange}
                className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 dark:focus:border-teal-500 focus:ring-indigo-500 dark:focus:ring-teal-500 transition-colors"
              >
                <option value="10">10 seconds</option>
                <option value="20">20 seconds</option>
                <option value="30">30 seconds</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Escalation Thresholds</label>
              <div className="mt-1 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    name="escalationThreshold"
                    value={aiSettings.escalationThreshold}
                    onChange={handleChange}
                    className="p-2 block w-20 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 dark:focus:border-teal-500 focus:ring-indigo-500 dark:focus:ring-teal-500 transition-colors"
                  />
                  <span className="text-sm text-gray-500 dark:text-gray-400">attempts before escalation</span>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Autonomy Level</label>
              <div className="mt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Restrictive</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Autonomous</span>
                </div>
                <input
                  type="range"
                  name="autonomyLevel"
                  min="0"
                  max="100"
                  value={aiSettings.autonomyLevel}
                  onChange={handleChange}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer 
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 
                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-600 dark:[&::-webkit-slider-thumb]:bg-teal-500
                    [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md
                    [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full 
                    [&::-moz-range-thumb]:bg-indigo-600 dark:[&::-moz-range-thumb]:bg-teal-500 [&::-moz-range-thumb]:cursor-pointer
                    [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-md
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Learning</h3>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 rounded-lg transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="font-medium text-gray-900 dark:text-gray-100">Data Sources</div>
                <Brain className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="space-y-2">
                {Object.entries(aiSettings.dataSources).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-200">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name={key}
                        checked={value}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-teal-500/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-600 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 dark:peer-checked:bg-teal-500"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 rounded-lg transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="font-medium text-gray-900 dark:text-gray-100">Performance</div>
                <Activity className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-200">Accuracy</span>
                    <span className="text-green-600 dark:text-green-400">95%</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div className="w-[95%] h-full bg-green-500 dark:bg-green-400"></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-200">Response Time</span>
                    <span className="text-amber-600 dark:text-amber-400">2.5s</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div className="w-[75%] h-full bg-amber-500 dark:bg-amber-400"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SettingsCard>
  );
}
