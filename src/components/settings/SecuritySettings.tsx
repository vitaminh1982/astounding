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
          <h3 className="font-semibold text-gray-900 mb-4">Authentification</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">2FA</div>
                <div className="text-sm text-gray-500">Double authentification required</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={securitySettings.twoFactor}
                  onChange={() => handleToggle('twoFactor')}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">SSO</div>
                <div className="text-sm text-gray-500">Single Authentification</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={securitySettings.sso}
                  onChange={() => handleToggle('sso')}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="font-medium">Session timeout</div>
                <Lock className="w-4 h-4 text-gray-600" />
              </div>
              <select
                name="sessionTimeout"
                value={securitySettings.sessionTimeout}
                onChange={handleChange}
                className="p-2 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="md:order-last order-first">
          <h3 className="font-semibold text-gray-900 mb-4">Compliance</h3>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-gray-600" />
                <div className="font-medium">GDPR</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Consents</span>
                  <span className="text-green-600">Up-to-date</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Documentation</span>
                  <span className="text-green-600">Complete</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Process</span>
                  <span className="text-green-600">Validated</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <History className="w-4 h-4 text-gray-600" />
                <div className="font-medium">Data retention</div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Messages</label>
                  <select className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                    <option>6 months</option>
                    <option>1 year</option>
                    <option>2 years</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Logs</label>
                  <select className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
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
