import React, { useState } from 'react';
import { Client } from '../../../../types/client';

interface CommunicationPrefsProps {
  client: Client;
  onChange: () => void;
}

export default function CommunicationPrefs({ client, onChange }: CommunicationPrefsProps) {
  const [preferences, setPreferences] = useState(client.preferences);

  const toggleChannel = (channel: 'email' | 'sms' | 'phone') => {
    setPreferences(prev => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel]
    }));
    onChange();
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPreferences(prev => ({ 
      ...prev, 
      language: e.target.value 
    }));
    onChange();
  };

  const handleFrequencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPreferences(prev => ({ 
      ...prev, 
      contactFrequency: e.target.value as any 
    }));
    onChange();
  };

  const handleNewsletterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreferences(prev => ({ 
      ...prev, 
      newsletter: e.target.checked 
    }));
    onChange();
  };

  const handleSpecialOffersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreferences(prev => ({ 
      ...prev, 
      specialOffers: e.target.checked 
    }));
    onChange();
  };

  return (
    <div className="space-y-4 sm:space-y-2 md:space-y-4">
      <h3 className="font-semibold text-lg sm:text-sm md:text-lg">Communication Preferences</h3>
      
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Prefered channels</h4>
          <div className="space-y-2">
            {[
              { id: 'email', label: 'Email' },
              { id: 'sms', label: 'SMS' },
              { id: 'phone', label: 'Phone' }
            ].map(channel => (
              <label key={channel.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={preferences.channels.includes(channel.id as any)}
                  onChange={() => toggleChannel(channel.id as any)}
                  className="rounded border-gray-300 text-indigo-600"
                />
                <span>{channel.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Prefered Language</h4>
          <select
            value={preferences.language}
            onChange={handleLanguageChange}
            className="mt-1 p-2 block w-full rounded-md border-gray-300"
          >
            <option value="fr">French</option>
            <option value="en">English</option>
            <option value="es">Spanish</option>
          </select>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Contact frequency</h4>
          <select
            value={preferences.contactFrequency}
            onChange={handleFrequencyChange}
            className="mt-1 p-2 block w-full rounded-md border-gray-300"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={preferences.newsletter}
              onChange={handleNewsletterChange}
              className="rounded border-gray-300 text-indigo-600"
            />
            <span>Newsletter</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={preferences.specialOffers}
              onChange={handleSpecialOffersChange}
              className="rounded border-gray-300 text-indigo-600"
            />
            <span>Special offers</span>
          </label>
        </div>
      </div>
    </div>
  );
}
