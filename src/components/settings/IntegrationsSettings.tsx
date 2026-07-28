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
    <div className="flex items-center justify-between p-3 border border-border dark:border-border bg-white dark:bg-surface-container-high rounded-lg transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-surface-container-low dark:bg-surface-container-highest rounded-lg flex items-center justify-center transition-colors">
          <Link2 className="w-4 h-4 text-muted-foreground dark:text-muted-foreground" />
        </div>
        <div>
          <div className="font-medium text-foreground dark:text-foreground">{integration.name}</div>
          <div className="text-sm text-muted-foreground dark:text-muted-foreground">Last sync: {integration.lastSync}</div>
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
    <div className="p-3 border border-border dark:border-border bg-white dark:bg-surface-container-high rounded-lg transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="font-medium text-foreground dark:text-foreground">API Key</div>
        <Key className="w-4 h-4 text-muted-foreground dark:text-muted-foreground" />
      </div>
      <div className="flex gap-2">
        <input
          type="password"
          value="sk_live_xxxxxxxxxxxxx"
          className="flex-1 text-sm bg-surface-container-low dark:bg-surface-container-highest border border-border dark:border-border text-foreground dark:text-foreground rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-ring dark:focus:ring-ring transition-colors"
          readOnly
        />
        <button className="text-sm text-primary-green dark:text-teal-400 hover:text-indigo-800 dark:hover:text-teal-300 transition-colors">
          Copy
        </button>
      </div>
    </div>
  );
};

const WebhookCard = () => {
  return (
    <div className="p-3 border border-border dark:border-border bg-white dark:bg-surface-container-high rounded-lg transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="font-medium text-foreground dark:text-foreground">Webhooks</div>
        <Activity className="w-4 h-4 text-muted-foreground dark:text-muted-foreground" />
      </div>
      <div className="text-sm text-muted-foreground dark:text-muted-foreground">
        3 configured endpoints
      </div>
    </div>
  );
};

const SynchronizationCard = () => {
  return (
    <div className="p-4 border border-border dark:border-border bg-white dark:bg-surface-container-high rounded-lg transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="font-medium text-foreground dark:text-foreground">Frequency</div>
          <div className="text-sm text-muted-foreground dark:text-muted-foreground">Every 5 minutes</div>
        </div>
        <button className="text-sm text-primary-green dark:text-teal-400 hover:text-indigo-800 dark:hover:text-teal-300 transition-colors">
          Modify
        </button>
      </div>
      <div className="h-1 bg-surface-container dark:bg-surface-container-highest rounded-full overflow-hidden">
        <div className="w-3/4 h-full bg-primary dark:bg-primary transition-colors"></div>
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
          <h3 className="font-semibold text-foreground dark:text-foreground sm:text-sm md:text-base mb-4">Connected Services</h3>
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
