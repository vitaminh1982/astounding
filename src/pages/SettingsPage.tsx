// src/pages/SettingsPage.tsx
import React, { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import GeneralSettings from '../components/settings/GeneralSettings';
import UserManagement from '../components/settings/UserManagement';
import IntegrationsSettings from '../components/settings/IntegrationsSettings';
import SecuritySettings from '../components/settings/SecuritySettings';
import CustomizationSettings from '../components/settings/CustomizationSettings';
import AISettings from '../components/settings/AISettings';

export default function SettingsPage() {
  const { t } = useContext(LanguageContext);

  const settingsComponents = [
    { title: t('settings.sections.general'), component: <GeneralSettings /> },
    { title: t('settings.sections.userManagement'), component: <UserManagement /> },
    { title: t('settings.sections.integrations'), component: <IntegrationsSettings /> },
    { title: t('settings.sections.security'), component: <SecuritySettings /> },
    { title: t('settings.sections.customization'), component: <CustomizationSettings /> },
    { title: t('settings.sections.ai'), component: <AISettings /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {t('settings.title')}
        </h1>
        <h2 className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          {t('settings.subtitle')}
        </h2>
        <div className="mb-6" />
        <div className="space-y-6 sm:space-y-4 md:space-y-6">
          {settingsComponents.map((setting) => (
            <div key={setting.title}>{setting.component}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
