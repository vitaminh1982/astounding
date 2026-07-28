import React, { useState, useEffect } from 'react';
import { Template } from '../../../../types/template';
import { Zap, Clock, Calendar, Settings as SettingsIcon, Check, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AutomationSettingsProps {
  template: Template;
  onChange?: (updates: any) => void;
}

interface Triggers {
  newClient: boolean;
  firstOrder: boolean;
  accountReactivation: boolean;
}

interface CustomDelay {
  hours: number;
  timeWindow: 'anytime' | 'business' | 'custom';
  customStart?: string;
  customEnd?: string;
}

export default function AutomationSettings({ template, onChange }: AutomationSettingsProps) {
  const [triggers, setTriggers] = useState<Triggers>({
    newClient: true,
    firstOrder: false,
    accountReactivation: false
  });

  const [sendDelay, setSendDelay] = useState<'immediate' | 'delayed' | 'custom'>('delayed');
  const [customDelay, setCustomDelay] = useState<CustomDelay>({
    hours: 24,
    timeWindow: 'anytime'
  });
  const [hasChanges, setHasChanges] = useState(false);

  // Track changes
  useEffect(() => {
    setHasChanges(true);
  }, [triggers, sendDelay, customDelay]);

  const notifyChange = (updates: any) => {
    setHasChanges(true);
    onChange?.(updates);
  };

  const handleTriggerChange = (trigger: keyof Triggers) => {
    const updatedTriggers = {
      ...triggers,
      [trigger]: !triggers[trigger]
    };
    setTriggers(updatedTriggers);
    notifyChange({ triggers: updatedTriggers });
  };

  const handleDelayChange = (delay: typeof sendDelay) => {
    setSendDelay(delay);
    notifyChange({ sendDelay: delay });
  };

  const handleCustomDelayChange = (updates: Partial<CustomDelay>) => {
    const updatedCustomDelay = { ...customDelay, ...updates };
    setCustomDelay(updatedCustomDelay);
    notifyChange({ customDelay: updatedCustomDelay });
  };

  const triggerOptions = [
    { 
      key: 'newClient' as keyof Triggers, 
      label: 'New Customer',
      description: 'Trigger when a new customer is created',
      icon: '👤',
      color: 'text-tertiary dark:text-tertiary'
    },
    { 
      key: 'firstOrder' as keyof Triggers, 
      label: 'First Order',
      description: 'Trigger after customer\'s first purchase',
      icon: '🛍️',
      color: 'text-green-600 dark:text-green-400'
    },
    { 
      key: 'accountReactivation' as keyof Triggers, 
      label: 'Account Reactivation',
      description: 'Trigger when inactive account becomes active',
      icon: '🔄',
      color: 'text-tertiary dark:text-tertiary'
    }
  ];

  const delayOptions = [
    { 
      value: 'immediate' as const, 
      label: 'Immediate',
      description: 'Send right away',
      icon: Zap
    },
    { 
      value: 'delayed' as const, 
      label: 'Delayed (24h)',
      description: 'Send after 24 hours',
      icon: Clock
    },
    { 
      value: 'custom' as const, 
      label: 'Customized',
      description: 'Set custom delay and time',
      icon: Calendar
    }
  ];

  const activeTriggerCount = Object.values(triggers).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-lg transition-colors">
            <Zap className="w-5 h-5 text-tertiary dark:text-tertiary transition-colors" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground dark:text-foreground transition-colors">
              Automation Settings
            </h3>
            <p className="text-sm text-muted-foreground dark:text-muted-foreground transition-colors">
              Configure automatic triggers and timing
            </p>
          </div>
        </div>
        
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-xs rounded-full border border-amber-200 dark:border-amber-800 transition-colors"
          >
            Unsaved changes
          </motion.div>
        )}
      </div>

      <div className="bg-white dark:bg-surface-container-high border border-border dark:border-border rounded-lg p-6 space-y-6 shadow-sm dark:shadow-gray-900 transition-colors">
        {/* Triggers Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-base text-foreground dark:text-foreground flex items-center gap-2 transition-colors">
              <SettingsIcon className="w-4 h-4" />
              Automation Triggers
            </h4>
            <span className="text-sm text-primary-green dark:text-teal-400 font-medium transition-colors">
              {activeTriggerCount} active
            </span>
          </div>

          <div className="space-y-3">
            {triggerOptions.map(({ key, label, description, icon, color }) => {
              const isActive = triggers[key];
              
              return (
                <motion.label
                  key={key}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    isActive
                      ? 'border-indigo-300 dark:border-teal-600 bg-indigo-50 dark:bg-teal-900/20'
                      : 'border-border dark:border-border bg-white dark:bg-surface-container-high hover:border-indigo-200 dark:hover:border-teal-700 hover:bg-surface-container-low dark:hover:bg-surface-container-highest'
                  }`}
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={() => handleTriggerChange(key)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 border-2 rounded transition-all ${
                        isActive
                          ? 'bg-primary dark:bg-teal-600 border-indigo-600 dark:border-teal-600'
                          : 'bg-white dark:bg-surface-container-highest border-border dark:border-border'
                      }`}>
                        {isActive && (
                          <Check className="w-full h-full text-white p-0.5" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{icon}</span>
                      <span className={`font-medium transition-colors ${
                        isActive 
                          ? 'text-foreground dark:text-foreground' 
                          : 'text-on-surface dark:text-muted-foreground'
                      }`}>
                        {label}
                      </span>
                    </div>
                    <p className={`text-sm transition-colors ${
                      isActive 
                        ? 'text-muted-foreground dark:text-muted-foreground' 
                        : 'text-muted-foreground dark:text-muted-foreground'
                    }`}>
                      {description}
                    </p>
                  </div>
                </motion.label>
              );
            })}
          </div>

          {activeTriggerCount === 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-sm text-amber-700 dark:text-amber-300 transition-colors"
            >
              ⚠️ No triggers are active. Enable at least one trigger to automate this template.
            </motion.div>
          )}
        </div>

        {/* Send Delay Section */}
        <div>
          <h4 className="font-medium text-base text-foreground dark:text-foreground flex items-center gap-2 mb-4 transition-colors">
            <Clock className="w-4 h-4" />
            Send Timing
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {delayOptions.map((option) => {
              const isSelected = sendDelay === option.value;
              const IconComponent = option.icon;

              return (
                <motion.label
                  key={option.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'border-indigo-300 dark:border-teal-600 bg-indigo-50 dark:bg-teal-900/20'
                      : 'border-border dark:border-border bg-white dark:bg-surface-container-high hover:border-indigo-200 dark:hover:border-teal-700 hover:bg-surface-container-low dark:hover:bg-surface-container-highest'
                  }`}
                >
                  <input
                    type="radio"
                    name="sendDelay"
                    value={option.value}
                    checked={isSelected}
                    onChange={(e) => handleDelayChange(e.target.value as typeof sendDelay)}
                    className="sr-only"
                  />

                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg transition-colors ${
                      isSelected
                        ? 'bg-indigo-100 dark:bg-teal-900/50'
                        : 'bg-surface-container-low dark:bg-surface-container-highest'
                    }`}>
                      <IconComponent className={`w-5 h-5 transition-colors ${
                        isSelected
                          ? 'text-primary-green dark:text-teal-400'
                          : 'text-muted-foreground dark:text-muted-foreground'
                      }`} />
                    </div>
                    <span className={`font-medium transition-colors ${
                      isSelected
                        ? 'text-foreground dark:text-foreground'
                        : 'text-on-surface dark:text-muted-foreground'
                    }`}>
                      {option.label}
                    </span>
                  </div>

                  <p className={`text-sm transition-colors ${
                    isSelected
                      ? 'text-muted-foreground dark:text-muted-foreground'
                      : 'text-muted-foreground dark:text-muted-foreground'
                  }`}>
                    {option.description}
                  </p>
                </motion.label>
              );
            })}
          </div>
        </div>

        {/* Custom Delay Configuration */}
        <AnimatePresence>
          {sendDelay === 'custom' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-6 border-t border-border dark:border-border transition-colors"
            >
              <h4 className="font-medium text-base text-foreground dark:text-foreground mb-4 transition-colors">
                Custom Timing Configuration
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Delay Hours */}
                <div>
                  <label className="block text-sm font-medium text-on-surface dark:text-muted-foreground mb-2 transition-colors">
                    Delay (hours)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="720"
                    value={customDelay.hours}
                    onChange={(e) => handleCustomDelayChange({ hours: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-border dark:border-border rounded-lg bg-white dark:bg-surface-container-highest text-foreground dark:text-foreground placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-ring dark:focus:ring-ring focus:border-primary-green dark:focus:border-teal-500 shadow-sm dark:shadow-gray-900 transition-colors focus:outline-none"
                    placeholder="24"
                  />
                  <p className="mt-1 text-xs text-muted-foreground dark:text-muted-foreground transition-colors">
                    Maximum: 720 hours (30 days)
                  </p>
                </div>

                {/* Time Window */}
                <div>
                  <label className="block text-sm font-medium text-on-surface dark:text-muted-foreground mb-2 transition-colors">
                    Sending Time Window
                  </label>
                  <div className="relative">
                    <select
                      value={customDelay.timeWindow}
                      onChange={(e) => handleCustomDelayChange({ timeWindow: e.target.value as CustomDelay['timeWindow'] })}
                      className="w-full px-3 py-2 border border-border dark:border-border rounded-lg bg-white dark:bg-surface-container-highest text-foreground dark:text-foreground focus:ring-2 focus:ring-ring dark:focus:ring-ring focus:border-primary-green dark:focus:border-teal-500 shadow-sm dark:shadow-gray-900 transition-colors appearance-none focus:outline-none pr-10"
                    >
                      <option value="anytime">Anytime</option>
                      <option value="business">Business Hours (9AM - 6PM)</option>
                      <option value="custom">Custom Time Range</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-outline dark:text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {/* Custom Time Range */}
                {customDelay.timeWindow === 'custom' && (
                  <div className="md:col-span-2 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-on-surface dark:text-muted-foreground mb-2 transition-colors">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={customDelay.customStart || '09:00'}
                        onChange={(e) => handleCustomDelayChange({ customStart: e.target.value })}
                        className="w-full px-3 py-2 border border-border dark:border-border rounded-lg bg-white dark:bg-surface-container-highest text-foreground dark:text-foreground focus:ring-2 focus:ring-ring dark:focus:ring-ring focus:border-primary-green dark:focus:border-teal-500 shadow-sm dark:shadow-gray-900 transition-colors focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-on-surface dark:text-muted-foreground mb-2 transition-colors">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={customDelay.customEnd || '18:00'}
                        onChange={(e) => handleCustomDelayChange({ customEnd: e.target.value })}
                        className="w-full px-3 py-2 border border-border dark:border-border rounded-lg bg-white dark:bg-surface-container-highest text-foreground dark:text-foreground focus:ring-2 focus:ring-ring dark:focus:ring-ring focus:border-primary-green dark:focus:border-teal-500 shadow-sm dark:shadow-gray-900 transition-colors focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Summary */}
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg transition-colors">
                <p className="text-sm text-blue-800 dark:text-blue-300 transition-colors">
                  <strong>Summary:</strong> Messages will be sent{' '}
                  <strong>{customDelay.hours} hours</strong> after trigger{' '}
                  {customDelay.timeWindow === 'business' && 'during business hours (9AM - 6PM)'}
                  {customDelay.timeWindow === 'custom' && `between ${customDelay.customStart || '09:00'} and ${customDelay.customEnd || '18:00'}`}
                  {customDelay.timeWindow === 'anytime' && 'at any time'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info Box */}
      <div className="p-4 bg-surface-container-low dark:bg-surface-container-high/50 border border-border dark:border-border rounded-lg transition-colors">
        <div className="flex items-start gap-3">
          <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded transition-colors">
            <Zap className="w-4 h-4 text-tertiary dark:text-tertiary transition-colors" />
          </div>
          <div className="text-sm text-muted-foreground dark:text-muted-foreground transition-colors">
            <p className="font-medium text-foreground dark:text-foreground mb-1 transition-colors">
              Automation Tips
            </p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Test your automation with a small group before full deployment</li>
              <li>Consider time zones when setting custom delays</li>
              <li>Monitor trigger performance and adjust as needed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
