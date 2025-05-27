import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';
import { IntegrationType } from './IntegrationCard';

interface IntegrationModalProps {
  integration: IntegrationType | null;
  isOpen: boolean;
  onClose: () => void;
  onConnect: (integration: IntegrationType) => void;
  onDisconnect: (integration: IntegrationType) => void;
}

export default function IntegrationModal({ 
  integration, 
  isOpen, 
  onClose, 
  onConnect, 
  onDisconnect 
}: IntegrationModalProps) {
  const { t } = useContext(LanguageContext);
  const [apiKey, setApiKey] = useState('');
  const [syncFrequency, setSyncFrequency] = useState('daily');
  const [accessLevel, setAccessLevel] = useState('readWrite');
  const [notifications, setNotifications] = useState(true);

  if (!isOpen || !integration) return null;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (integration.isConnected) {
      // Handle updating configuration
      console.log('Updating configuration:', { syncFrequency, accessLevel, notifications });
    } else {
      // Handle new connection
      onConnect(integration);
    }
    onClose();
  };

  const handleDisconnect = () => {
    if (integration) {
      onDisconnect(integration);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          aria-hidden="true"
          onClick={onClose}
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label={t('integrations.aria.closeModal')}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start mb-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {integration.isConnected 
                  ? `${t('integrations.configure')} ${integration.name}` 
                  : `${t('integrations.connect')} ${integration.name}`}
              </h3>
            </div>
            
            <form onSubmit={handleFormSubmit}>
              {!integration.isConnected && (
                <div className="mb-4">
                  <label htmlFor="api-key" className="block text-sm font-medium text-gray-700">
                    API Key {integration.name}
                  </label>
                  <p className="text-sm text-gray-500 mb-2">
                    {t('integrations.authDescription', { name: integration.name })}
                  </p>
                  <input
                    type="text"
                    id="api-key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required={!integration.isConnected}
                  />
                </div>
              )}

              <div className="mb-4">
                <label htmlFor="sync-frequency" className="block text-sm font-medium text-gray-700">
                  {t('integrations.syncFrequency')}
                </label>
                <select
                  id="sync-frequency"
                  value={syncFrequency}
                  onChange={(e) => setSyncFrequency(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="realtime">{t('integrations.realtime')}</option>
                  <option value="hourly">{t('integrations.hourly')}</option>
                  <option value="daily">{t('integrations.daily')}</option>
                  <option value="manual">{t('integrations.manual')}</option>
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="access-level" className="block text-sm font-medium text-gray-700">
                  {t('integrations.accessLevel')}
                </label>
                <select
                  id="access-level"
                  value={accessLevel}
                  onChange={(e) => setAccessLevel(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="readOnly">{t('integrations.readOnly')}</option>
                  <option value="readWrite">{t('integrations.readWrite')}</option>
                  <option value="fullAccess">{t('integrations.fullAccess')}</option>
                </select>
              </div>

              <div className="relative flex items-start mb-4">
                <div className="flex items-center h-5">
                  <input
                    id="notifications"
                    name="notifications"
                    type="checkbox"
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="notifications" className="font-medium text-gray-700">
                    {t('integrations.enableNotifications')}
                  </label>
                </div>
              </div>

              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm
                  ${integration.isConnected 
                    ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-blue-500'
                    : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-blue-500'}`}
                >
                  {integration.isConnected 
                    ? t('integrations.saveSuccess')
                    : t('integrations.connect')}
                </button>
                
                {integration.isConnected && (
                  <button
                    type="button"
                    onClick={handleDisconnect}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-red-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:w-auto sm:text-sm"
                  >
                    {t('integrations.disconnect')}
                  </button>
                )}
                
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {integration.isConnected ? t('integrations.cancel') : t('integrations.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
