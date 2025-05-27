import React, { useState } from 'react';
import { Client } from '../../../../types/client';
import { Shield, Clock } from 'lucide-react';

interface ComplianceProps {
  client: Client;
}

export default function Compliance({ client }: ComplianceProps) {
  const [consents, setConsents] = useState(client.gdpr.consents);

  const handleConsentChange = (key: keyof typeof consents) => {
    setConsents(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="border rounded-lg p-4 sm:p-2 md:p-4">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-indigo-600" />
        <h3 className="font-semibold text-lg sm:text-sm md:text-lg">GDPR Compliance</h3>
      </div>
      
      <div className="space-y-4 sm:space-y-2 md:space-y-4">
        <div className="space-y-2">
          {[
            { key: 'marketing', label: 'Marketing communications' },
            { key: 'analytics', label: 'Data analytics' },
            { key: 'thirdParty', label: 'Third-party' }
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={consents[key as keyof typeof consents]}
                onChange={() => handleConsentChange(key as keyof typeof consents)}
                className="rounded border-gray-300 text-indigo-600"
              />
              <span className="text-sm">{label}</span>
            </label>
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500 sm:text-xs md:text-sm">
          <Clock className="w-4 h-4 sm:w-3 sm:h-3 md:w-4 md:h-4" />
          <span>Last update: {client.gdpr.lastUpdate}</span>
        </div>
      </div>
    </div>
  );
}
