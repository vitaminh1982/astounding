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
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
          <Link2 className="w-4 h-4 text-gray-600" />
        </div>
        <div>
          <div className="font-medium">{integration.name}</div>
          <div className="text-sm text-gray-500">Last sync: {integration.lastSync}</div>
        </div>
      </div>
      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
        Connected
      </span>
    </div>
  );
};

const ApiCard = () => {
  return (
    <div className="p-3 border rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="font-medium">API Key</div>
        <Key className="w-4 h-4 text-gray-600" />
      </div>
      <div className="flex gap-2">
        <input
          type="password"
          value="sk_live_xxxxxxxxxxxxx"
          className="flex-1 text-sm bg-gray-50 border rounded px-3 py-1"
          readOnly
        />
        <button className="text-sm text-indigo-600">
          Copy
        </button>
      </div>
    </div>
  );
};

const WebhookCard = () => {
  return (
    <div className="p-3 border rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="font-medium">Webhooks</div>
        <Activity className="w-4 h-4 text-gray-600" />
      </div>
      <div className="text-sm text-gray-600">
        3 configured endpoints
      </div>
    </div>
  );
};

const SynchronizationCard = () => {
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="font-medium">Frequency</div>
          <div className="text-sm text-gray-500">Every 5 minutes</div>
        </div>
        <button className="text-sm text-indigo-600">
          Modify
        </button>
      </div>
      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
        <div className="w-3/4 h-full bg-indigo-600"></div>
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
          <h3 className="font-semibold text-gray-900 sm:text-sm md:text-base mb-4">Connected Services</h3>
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
