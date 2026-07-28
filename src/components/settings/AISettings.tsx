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
          <h3 className="font-semibold text-foreground dark:text-foreground mb-4">Default Behavior</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-on-surface dark:text-on-surface-variant">Max Response Time</label>
              <select
                name="responseTime"
                value={aiSettings.responseTime}
                onChange={handleChange}
                className="mt-1 p-2 block w-full rounded-md border-border dark:border-border bg-white dark:bg-surface-container-highest text-foreground dark:text-foreground shadow-sm focus:border-primary-green dark:focus:border-teal-500 focus:ring-ring dark:focus:ring-ring transition-colors"
              >
                <option value="10">10 seconds</option>
                <option value="20">20 seconds</option>
                <option value="30">30 seconds</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-on-surface dark:text-on-surface-variant">Escalation Thresholds</label>
              <div className="mt-1 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    name="escalationThreshold"
                    value={aiSettings.escalationThreshold}
                    onChange={handleChange}
                    className="p-2 block w-20 rounded-md border-border dark:border-border bg-white dark:bg-surface-container-highest text-foreground dark:text-foreground shadow-sm focus:border-primary-green dark:focus:border-teal-500 focus:ring-ring dark:focus:ring-ring transition-colors"
                  />
                  <span className="text-sm text-muted-foreground dark:text-muted-foreground">attempts before escalation</span>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-on-surface dark:text-on-surface-variant">Autonomy Level</label>
              <div className="mt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground dark:text-muted-foreground">Restrictive</span>
                  <span className="text-sm text-muted-foreground dark:text-muted-foreground">Autonomous</span>
                </div>
                <input
                  type="range"
                  name="autonomyLevel"
                  min="0"
                  max="100"
                  value={aiSettings.autonomyLevel}
                  onChange={handleChange}
                  className="w-full h-2 bg-surface-container dark:bg-surface-container-highest rounded-lg appearance-none cursor-pointer 
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 
                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary dark:[&::-webkit-slider-thumb]:bg-primary
                    [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md
                    [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full 
                    [&::-moz-range-thumb]:bg-primary dark:[&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:cursor-pointer
                    [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-md
                    focus:outline-none focus:ring-2 focus:ring-ring dark:focus:ring-ring transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold text-foreground dark:text-foreground mb-4">Learning</h3>
          <div className="space-y-4">
            <div className="p-4 border border-border dark:border-border bg-surface-container-low dark:bg-surface-container-high rounded-lg transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="font-medium text-foreground dark:text-foreground">Data Sources</div>
                <Brain className="w-4 h-4 text-muted-foreground dark:text-muted-foreground" />
              </div>
              <div className="space-y-2">
                {Object.entries(aiSettings.dataSources).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between text-sm">
                    <span className="text-on-surface dark:text-on-surface-variant">
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
                      <div className="w-9 h-5 bg-surface-container dark:bg-surface-container-highest peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-ring/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border dark:after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary dark:peer-checked:bg-primary"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 border border-border dark:border-border bg-surface-container-low dark:bg-surface-container-high rounded-lg transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="font-medium text-foreground dark:text-foreground">Performance</div>
                <Activity className="w-4 h-4 text-muted-foreground dark:text-muted-foreground" />
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-on-surface dark:text-on-surface-variant">Accuracy</span>
                    <span className="text-green-600 dark:text-green-400">95%</span>
                  </div>
                  <div className="h-2 bg-surface-container dark:bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="w-[95%] h-full bg-green-500 dark:bg-green-400"></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-on-surface dark:text-on-surface-variant">Response Time</span>
                    <span className="text-amber-600 dark:text-destructive">2.5s</span>
                  </div>
                  <div className="h-2 bg-surface-container dark:bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="w-[75%] h-full bg-destructive dark:bg-destructive"></div>
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
