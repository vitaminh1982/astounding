import React, { useState } from 'react';
import { Bell, Mail, Sliders } from 'lucide-react';
import { NotificationSettings } from '../../types/usage';

interface LimitNotificationsProps {
  initialSettings: NotificationSettings;
  onSave: (settings: NotificationSettings) => void;
}

export default function LimitNotifications({ 
  initialSettings, 
  onSave 
}: LimitNotificationsProps) {
  const [settings, setSettings] = useState<NotificationSettings>(initialSettings);
  const [isEditing, setIsEditing] = useState(false);
  
  const handleThresholdChange = (index: number, value: number) => {
    const newThresholds = [...settings.thresholds];
    newThresholds[index] = value;
    setSettings({ ...settings, thresholds: newThresholds });
  };
  
  const handleEmailToggle = () => {
    setSettings({ ...settings, emailNotifications: !settings.emailNotifications });
  };
  
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, emailAddress: e.target.value });
  };
  
  const handleSave = () => {
    onSave(settings);
    setIsEditing(false);
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Limit Notifications</h3>
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Bell className="w-5 h-5 text-indigo-600" />
        </div>
      </div>
      
      {isEditing ? (
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-4">Notification Thresholds</h4>
            <div className="space-y-4">
              {settings.thresholds.map((threshold, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={threshold}
                    onChange={(e) => handleThresholdChange(index, parseInt(e.target.value))}
                    className="flex-1 mr-4"
                  />
                  <div className="w-16 px-2 py-1 bg-gray-100 rounded text-center">
                    {threshold}%
                  </div>
                </div>
              ))}
              <button 
                className="text-sm text-indigo-600 hover:text-indigo-800"
                onClick={() => setSettings({ 
                  ...settings, 
                  thresholds: [...settings.thresholds, 50] 
                })}
              >
                + Add threshold
              </button>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-4">Email Notifications</h4>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="email-notifications"
                checked={settings.emailNotifications}
                onChange={handleEmailToggle}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="email-notifications" className="ml-2 block text-sm text-gray-700">
                Enable email notifications
              </label>
            </div>
            
            {settings.emailNotifications && (
              <div>
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="flex">
                  <div className="relative flex-grow">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      id="email-address"
                      value={settings.emailAddress}
                      onChange={handleEmailChange}
                      className="pl-10 pr-3 py-2 w-full border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Save Settings
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-4">Current Notification Thresholds</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {settings.thresholds.map((threshold, index) => (
                <div key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                  {threshold}%
                </div>
              ))}
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-500">
                    {settings.emailNotifications 
                      ? `Enabled (${settings.emailAddress})` 
                      : 'Disabled'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <Sliders className="w-4 h-4 mr-2" />
            Configure Notifications
          </button>
        </div>
      )}
    </div>
  );
}