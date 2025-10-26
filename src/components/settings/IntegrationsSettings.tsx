import React from 'react';
import { Link2, Key, Activity } from 'lucide-react';
import SettingsCard from './SettingsCard';

const integrations = [
  { name: 'Sendplify', status: 'connected', lastSync: '14:30' },
  { name: 'Enterprise CRM', status: 'connected', lastSync: '14:25' },
  { name: 'Slack', status: 'connected', lastSync: '14:20' },
  { name: 'Data Wallet', status: 'connected', lastSync: '14:15' }
];

const IntegrationCard = ({ integration }) => {
  return (
    <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center transition-colors">
          <Link2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </div>
        <div>
          <div className="font-medium text-gray-900 dark:text-gray-100">{integration.name}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Last sync: {integration.lastSync}</div>
        </div>
      </div>
      <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded text-sm transition-colors">
        Connected
      </span>
    </div>
  );
};

const ApiCard = () => {
  return (
    <div className="p-3 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="font-medium text-gray-900 dark:text-gray-100">API Key</div>
        <Key className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      </div>
      <div className="flex gap-2">
        <input
          type="password"
          value="sk_live_xxxxxxxxxxxxx"
          className="flex-1 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 transition-colors"
          readOnly
        />
        <button className="text-sm text-indigo-600 dark:text-teal-400 hover:text-indigo-800 dark:hover:text-teal-300 transition-colors">
          Copy
        </button>
      </div>
    </div>
  );
};

const WebhookCard = () => {
  return (
    <div className="p-3 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="font-medium text-gray-900 dark:text-gray-100">Webhooks</div>
        <Activity className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400">
        3 configured endpoints
      </div>
    </div>
  );
};

const SynchronizationCard = () => {
  return (
    <div className="p-4 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="font-medium text-gray-900 dark:text-gray-100">Frequency</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Every 5 minutes</div>
        </div>
        <button className="text-sm text-indigo-600 dark:text-teal-400 hover:text-indigo-800 dark:hover:text-teal-300 transition-colors">
          Modify
        </button>
      </div>
      <div className="h-1 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
        <div className="w-3/4 h-full bg-indigo-600 dark:bg-teal-500 transition-colors"></div>
      </div>
    </div>
  );
};

export default function IntegrationsSettings() {
  return (
    <SettingsCard
      title="Integrations"
      icon={Link2}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 sm:text-sm md:text-base mb-4">Connected Services</h3>
          <div className="space-y-3">
            {integrations.map((integration) => (
              <IntegrationCard key={integration.name} integration={integration} />
            ))}
          </div>
        </div>
        
        <div className="space-y-6">
          <ApiCard />
          <WebhookCard />
          <SynchronizationCard />
        </div>
      </div>
    </SettingsCard>
  );
}
