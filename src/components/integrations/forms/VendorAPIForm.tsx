import React, { useState } from 'react';
import { Key, Link2, Shield, Webhook } from 'lucide-react';
import { AuthMethod, VendorAPIFormData, IntegrationTypeData } from '../../../types/integration';

interface VendorAPIFormProps {
  integrationType: IntegrationTypeData;
  onSubmit: (data: VendorAPIFormData) => void;
  onCancel: () => void;
  initialData?: Partial<VendorAPIFormData>;
}

export default function VendorAPIForm({
  integrationType,
  onSubmit,
  onCancel,
  initialData,
}: VendorAPIFormProps) {
  const [formData, setFormData] = useState<VendorAPIFormData>({
    name: initialData?.name || integrationType.name,
    auth_method: initialData?.auth_method || 'api_key',
    connection_config: initialData?.connection_config || {},
    api_key: initialData?.api_key || '',
    oauth_token: initialData?.oauth_token || '',
    client_id: initialData?.client_id || '',
    client_secret: initialData?.client_secret || '',
    webhook_url: initialData?.webhook_url || '',
    custom_fields: initialData?.custom_fields || {},
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const config: any = {
      ...integrationType.config_schema,
    };

    if (formData.api_key) {
      config.api_key = formData.api_key;
    }

    if (formData.webhook_url) {
      config.webhook_url = formData.webhook_url;
    }

    onSubmit({
      ...formData,
      connection_config: config,
    });
  };

  const getAuthDescription = () => {
    const configSchema = integrationType.config_schema as any;
    if (configSchema?.oauth_provider) {
      return `This integration uses OAuth for authentication. Click Connect to authorize access.`;
    }
    return `Enter your ${integrationType.name} API credentials to connect.`;
  };

  const requiresOAuth = (integrationType.config_schema as any)?.oauth_provider;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Authentication
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              {getAuthDescription()}
            </p>
          </div>
        </div>
      </div>

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Connection Name
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600
                   bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100
                   focus:border-blue-500 dark:focus:border-teal-500 focus:outline-none focus:ring-2
                   focus:ring-blue-500 dark:focus:ring-teal-500"
          placeholder={`My ${integrationType.name} Connection`}
        />
      </div>

      {!requiresOAuth && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Authentication Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['api_key', 'oauth', 'basic'] as AuthMethod[]).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, auth_method: method })
                  }
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2
                           transition-all ${
                             formData.auth_method === method
                               ? 'border-blue-500 dark:border-teal-500 bg-blue-50 dark:bg-teal-900/20'
                               : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                           }`}
                >
                  <Key className="h-4 w-4" />
                  <span className="text-sm font-medium capitalize">
                    {method === 'api_key' ? 'API Key' : method}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {formData.auth_method === 'api_key' && (
            <div>
              <label
                htmlFor="api_key"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                API Key
              </label>
              <input
                type="password"
                id="api_key"
                required
                value={formData.api_key}
                onChange={(e) =>
                  setFormData({ ...formData, api_key: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100
                         focus:border-blue-500 dark:focus:border-teal-500 focus:outline-none focus:ring-2
                         focus:ring-blue-500 dark:focus:ring-teal-500 font-mono"
                placeholder="sk_live_..."
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Your API key is stored securely and encrypted.
              </p>
            </div>
          )}

          {formData.auth_method === 'basic' && (
            <>
              <div>
                <label
                  htmlFor="client_id"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Username / Client ID
                </label>
                <input
                  type="text"
                  id="client_id"
                  required
                  value={formData.client_id}
                  onChange={(e) =>
                    setFormData({ ...formData, client_id: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600
                           bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100
                           focus:border-blue-500 dark:focus:border-teal-500 focus:outline-none focus:ring-2
                           focus:ring-blue-500 dark:focus:ring-teal-500"
                />
              </div>

              <div>
                <label
                  htmlFor="client_secret"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Password / Client Secret
                </label>
                <input
                  type="password"
                  id="client_secret"
                  required
                  value={formData.client_secret}
                  onChange={(e) =>
                    setFormData({ ...formData, client_secret: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600
                           bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100
                           focus:border-blue-500 dark:focus:border-teal-500 focus:outline-none focus:ring-2
                           focus:ring-blue-500 dark:focus:ring-teal-500 font-mono"
                />
              </div>
            </>
          )}
        </>
      )}

      {(integrationType.config_schema as any)?.webhook_url !== undefined && (
        <div>
          <label
            htmlFor="webhook_url"
            className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            <Webhook className="h-4 w-4" />
            Webhook URL (Optional)
          </label>
          <input
            type="url"
            id="webhook_url"
            value={formData.webhook_url}
            onChange={(e) =>
              setFormData({ ...formData, webhook_url: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600
                     bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100
                     focus:border-blue-500 dark:focus:border-teal-500 focus:outline-none focus:ring-2
                     focus:ring-blue-500 dark:focus:ring-teal-500"
            placeholder="https://your-domain.com/webhooks"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Configure webhooks to receive real-time updates from {integrationType.name}.
          </p>
        </div>
      )}

      <div>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm font-medium text-blue-600 dark:text-teal-400 hover:text-blue-700 dark:hover:text-teal-300"
        >
          {showAdvanced ? 'Hide' : 'Show'} Advanced Options
        </button>
      </div>

      {showAdvanced && (
        <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Advanced Configuration
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            These settings use the default values recommended by {integrationType.name}.
          </p>
          <div className="bg-white dark:bg-gray-700 rounded p-3 border border-gray-200 dark:border-gray-600">
            <pre className="text-xs text-gray-600 dark:text-gray-300 overflow-x-auto">
              {JSON.stringify(integrationType.config_schema, null, 2)}
            </pre>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300
                   bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600
                   rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white
                   bg-blue-600 dark:bg-teal-600 rounded-md hover:bg-blue-700 dark:hover:bg-teal-700
                   transition-colors"
        >
          <Link2 className="h-4 w-4" />
          {requiresOAuth ? 'Connect with OAuth' : 'Connect'}
        </button>
      </div>
    </form>
  );
}
