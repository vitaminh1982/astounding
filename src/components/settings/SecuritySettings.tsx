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
          <h3 className="font-semibold text-foreground dark:text-foreground mb-4">Authentification</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-border dark:border-border bg-white dark:bg-surface-container-high rounded-lg transition-colors">
              <div>
                <div className="font-medium text-foreground dark:text-foreground">2FA</div>
                <div className="text-sm text-muted-foreground dark:text-muted-foreground">Double authentification required</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={securitySettings.twoFactor}
                  onChange={() => handleToggle('twoFactor')}
                />
                <div className="w-11 h-6 bg-surface-container dark:bg-surface-container-highest peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-ring/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white dark:peer-checked:after:border-border after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-surface-container after:border-border dark:after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary dark:peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-border dark:border-border bg-white dark:bg-surface-container-high rounded-lg transition-colors">
              <div>
                <div className="font-medium text-foreground dark:text-foreground">SSO</div>
                <div className="text-sm text-muted-foreground dark:text-muted-foreground">Single Authentification</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={securitySettings.sso}
                  onChange={() => handleToggle('sso')}
                />
                <div className="w-11 h-6 bg-surface-container dark:bg-surface-container-highest peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-ring/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white dark:peer-checked:after:border-border after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-surface-container after:border-border dark:after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary dark:peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div className="p-4 border border-border dark:border-border bg-white dark:bg-surface-container-high rounded-lg transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="font-medium text-foreground dark:text-foreground">Session timeout</div>
                <Lock className="w-4 h-4 text-muted-foreground dark:text-muted-foreground" />
              </div>
              <select
                name="sessionTimeout"
                value={securitySettings.sessionTimeout}
                onChange={handleChange}
                className="p-2 w-full border-border dark:border-border bg-white dark:bg-surface-container-highest text-foreground dark:text-foreground rounded-md shadow-sm focus:border-primary-green dark:focus:border-teal-500 focus:ring-ring dark:focus:ring-ring transition-colors"
              >
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="md:order-last order-first">
          <h3 className="font-semibold text-foreground dark:text-foreground mb-4">Compliance</h3>
          <div className="space-y-4">
            <div className="p-4 border border-border dark:border-border bg-white dark:bg-surface-container-high rounded-lg transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-muted-foreground dark:text-muted-foreground" />
                <div className="font-medium text-foreground dark:text-foreground">GDPR</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-on-surface dark:text-on-surface-variant">Consents</span>
                  <span className="text-green-600 dark:text-green-400">Up-to-date</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-on-surface dark:text-on-surface-variant">Documentation</span>
                  <span className="text-green-600 dark:text-green-400">Complete</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-on-surface dark:text-on-surface-variant">Process</span>
                  <span className="text-green-600 dark:text-green-400">Validated</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 border border-border dark:border-border bg-white dark:bg-surface-container-high rounded-lg transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <History className="w-4 h-4 text-muted-foreground dark:text-muted-foreground" />
                <div className="font-medium text-foreground dark:text-foreground">Data retention</div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-on-surface dark:text-on-surface-variant">Messages</label>
                  <select className="mt-1 p-2 block w-full rounded-md border-border dark:border-border bg-white dark:bg-surface-container-highest text-foreground dark:text-foreground shadow-sm focus:border-primary-green dark:focus:border-teal-500 focus:ring-ring dark:focus:ring-ring transition-colors">
                    <option>6 months</option>
                    <option>1 year</option>
                    <option>2 years</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface dark:text-on-surface-variant">Logs</label>
                  <select className="mt-1 p-2 block w-full rounded-md border-border dark:border-border bg-white dark:bg-surface-container-highest text-foreground dark:text-foreground shadow-sm focus:border-primary-green dark:focus:border-teal-500 focus:ring-ring dark:focus:ring-ring transition-colors">
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
