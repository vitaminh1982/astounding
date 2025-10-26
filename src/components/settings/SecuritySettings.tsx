import React, { useState } from 'react';
import { Shield, Lock, FileText, History } from 'lucide-react';
import SettingsCard from './SettingsCard';

export default function SecuritySettings() {
  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: true,
    sso: true,
    sessionTimeout: '30'
  });

  const handleToggle = (setting: keyof typeof securitySettings) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSecuritySettings(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <SettingsCard
      title="Security"
      icon={Shield}
      className="md:p-10 p-5"
    >
      <div className="md:grid md:grid-cols-2 md:gap-6 grid grid-cols-1">
        <div className="md:order-first order-last">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Authentification</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg transition-colors">
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">2FA</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Double authentification required</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={securitySettings.twoFactor}
                  onChange={() => handleToggle('twoFactor')}
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-teal-500/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white dark:peer-checked:after:border-gray-300 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-gray-200 after:border-gray-300 dark:after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 dark:peer-checked:bg-teal-500"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg transition-colors">
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">SSO</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Single Authentification</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={securitySettings.sso}
                  onChange={() => handleToggle('sso')}
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-teal-500/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white dark:peer-checked:after:border-gray-300 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-gray-200 after:border-gray-300 dark:after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 dark:peer-checked:bg-teal-500"></div>
              </label>
            </div>
            
            <div className="p-4 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="font-medium text-gray-900 dark:text-gray-100">Session timeout</div>
                <Lock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </div>
              <select
                name="sessionTimeout"
                value={securitySettings.sessionTimeout}
                onChange={handleChange}
                className="p-2 w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:border-indigo-500 dark:focus:border-teal-500 focus:ring-indigo-500 dark:focus:ring-teal-500 transition-colors"
              >
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="md:order-last order-first">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Compliance</h3>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <div className="font-medium text-gray-900 dark:text-gray-100">GDPR</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-200">Consents</span>
                  <span className="text-green-600 dark:text-green-400">Up-to-date</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-200">Documentation</span>
                  <span className="text-green-600 dark:text-green-400">Complete</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-200">Process</span>
                  <span className="text-green-600 dark:text-green-400">Validated</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <History className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <div className="font-medium text-gray-900 dark:text-gray-100">Data retention</div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Messages</label>
                  <select className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 dark:focus:border-teal-500 focus:ring-indigo-500 dark:focus:ring-teal-500 transition-colors">
                    <option>6 months</option>
                    <option>1 year</option>
                    <option>2 years</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Logs</label>
                  <select className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 dark:focus:border-teal-500 focus:ring-indigo-500 dark:focus:ring-teal-500 transition-colors">
                    <option>3 months</option>
                    <option>6 months</option>
                    <option>1 year</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SettingsCard>
  );
}
