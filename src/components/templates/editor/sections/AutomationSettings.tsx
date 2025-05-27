import React, { useState } from 'react';
import { Template } from '../../../../types/template';

interface AutomationSettingsProps {
  template: Template;
}

export default function AutomationSettings({ template }: AutomationSettingsProps) {
  const [triggers, setTriggers] = useState({
    newClient: true,
    firstOrder: false,
    accountReactivation: false
  });

  const [sendDelay, setSendDelay] = useState('delayed');

  const handleTriggerChange = (trigger: keyof typeof triggers) => {
    setTriggers(prev => ({
      ...prev,
      [trigger]: !prev[trigger]
    }));
  };

  const triggerOptions = [
    { key: 'newClient', label: 'New customer' },
    { key: 'firstOrder', label: 'First order' },
    { key: 'accountReactivation', label: 'Account reactivation' }
  ];

  const delayOptions = [
    { value: 'immediate', label: 'Immediate' },
    { value: 'delayed', label: 'Delayed (24h)' },
    { value: 'custom', label: 'Customized' }
  ];

  return (
    <div className="space-y-3 sm:space-y-4">
      <h3 className="font-semibold text-base sm:text-lg">Automation</h3>
      
      <div className="border rounded-lg p-3 sm:p-4 space-y-4 sm:space-y-6">
        {/* Section Déclencheurs */}
        <div>
          <h4 className="font-medium text-sm sm:text-base mb-2 sm:mb-3">
            Triggers
          </h4>
          <div className="space-y-2">
            {triggerOptions.map(({ key, label }) => (
              <label 
                key={key} 
                className="flex items-center gap-2 text-sm sm:text-base hover:bg-gray-50 p-1 rounded-md transition-colors cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={triggers[key as keyof typeof triggers]}
                  onChange={() => handleTriggerChange(key as keyof typeof triggers)}
                  className="rounded border-gray-300 text-indigo-600 w-4 h-4 sm:w-5 sm:h-5"
                />
                <span className="select-none">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Section Délai d'envoi */}
        <div>
          <h4 className="font-medium text-sm sm:text-base mb-2 sm:mb-3">
            Send delay
          </h4>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            {delayOptions.map(option => (
              <label 
                key={option.value} 
                className="flex items-center gap-2 text-sm sm:text-base hover:bg-gray-50 p-1 rounded-md transition-colors cursor-pointer"
              >
                <input
                  type="radio"
                  name="sendDelay"
                  value={option.value}
                  checked={sendDelay === option.value}
                  onChange={(e) => setSendDelay(e.target.value)}
                  className="text-indigo-600 w-4 h-4 sm:w-5 sm:h-5"
                />
                <span className="select-none">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Section Personnalisation du délai - visible si 'custom' est sélectionné */}
        {sendDelay === 'custom' && (
          <div className="pt-2 sm:pt-3 border-t">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delay (hours)
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full p-1.5 sm:p-2 border rounded-md text-sm"
                  placeholder="24"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sent hour
                </label>
                <select className="w-full p-1.5 sm:p-2 border rounded-md text-sm">
                  <option>Anytime</option>
                  <option>Office hours (9h-18h)</option>
                  <option>Customized</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
