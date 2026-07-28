import React, { useState, useContext } from 'react';
import { Building2, Check } from 'lucide-react';
import SettingsCard from './SettingsCard';
import { LanguageContext } from '../../context/LanguageContext';

const fieldTypes = {
  text: 'text',
  email: 'email',
  tel: 'tel',
  number: 'number'
};

const fields = [
  { name: 'companyName', label: 'Name', type: fieldTypes.text },
  { name: 'email', label: 'Email', type: fieldTypes.email },
  { name: 'phone', label: 'Phone', type: fieldTypes.tel },
  { name: 'maxAgents', label: 'Number of max agents', type: fieldTypes.number },
  { name: 'conversationLimit', label: 'Limit of discussion/agent', type: fieldTypes.number },
  { name: 'timeout', label: 'Timeout delay (minutes)', type: fieldTypes.number }
];

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'nl', label: 'Nederlands', soon: true },
];

export default function GeneralSettings() {
  const { language, setLanguage } = useContext(LanguageContext);

  const [formData, setFormData] = useState({
    companyName: 'Miranki Sàrl',
    email: 'info@miranki.com',
    phone: '+352 671 080 000',
    maxAgents: '50',
    conversationLimit: '100',
    timeout: '30'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <SettingsCard title="General Settings" icon={Building2}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
        {fields.map((field) => (
          <div key={field.name} className="space-y-4">
            <label className="block text-sm font-medium text-on-surface dark:text-on-surface-variant">
              {field.label}
            </label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name as keyof typeof formData]}
              onChange={handleChange}
              className="mt-1 p-2 block w-full rounded-md border border-border dark:border-border bg-white dark:bg-surface-container-highest text-foreground dark:text-foreground shadow-sm focus:border-primary-green dark:focus:border-teal-500 focus:ring-ring dark:focus:ring-ring transition-colors"
            />
          </div>
        ))}

        {/* Language selector */}
        <div className="space-y-2 sm:col-span-2">
          <label className="block text-sm font-medium text-on-surface dark:text-on-surface-variant">
            Language
          </label>
          <div className="flex flex-wrap gap-2 mt-1">
            {LANGUAGES.map(({ code, label, soon }) => (
              <button
                key={code}
                onClick={() => !soon && setLanguage(code as 'en' | 'fr')}
                disabled={!!soon}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  language === code
                    ? 'border-primary-green dark:border-teal-500 bg-indigo-50 dark:bg-teal-900/20 text-indigo-700 dark:text-teal-300'
                    : soon
                    ? 'border-border dark:border-border text-outline dark:text-muted-foreground cursor-not-allowed opacity-60'
                    : 'border-border dark:border-border text-on-surface dark:text-muted-foreground hover:border-indigo-400 dark:hover:border-teal-500 hover:bg-surface-container-low dark:hover:bg-surface-container-highest'
                }`}
              >
                {label}
                {soon && (
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded">
                    soon
                  </span>
                )}
                {language === code && !soon && (
                  <Check size={13} className="text-indigo-500 dark:text-teal-400" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </SettingsCard>
  );
}
