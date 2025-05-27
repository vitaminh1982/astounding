import React, { useState } from 'react';
import { Building2, Globe, Clock } from 'lucide-react';
import SettingsCard from './SettingsCard';

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

export default function GeneralSettings() {
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
    <SettingsCard
      title="General Settings"
      icon={Building2}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
        {fields.map((field) => (
          <div key={field.name} className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        ))}
      </div>
    </SettingsCard>
  );
}
