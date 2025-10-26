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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 border border-gray-200 dark:border-gray-700 p-6 transition-colors">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Limit Notifications</h3>
        <div className="p-2 bg-indigo-100 dark:bg-teal-900 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-indigo-600 dark:text-teal-300" />
        </div>
      </div>
      
      {isEditing ? (
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-4">Notification Thresholds</h4>
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
                    className="flex-1 mr-4 h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer 
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 
                      [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-600 dark:[&::-webkit-slider-thumb]:bg-teal-500
                      [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md
                      [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full 
                      [&::-moz-range-thumb]:bg-indigo-600 dark:[&::-moz-range-thumb]:bg-teal-500 [&::-moz-range-thumb]:cursor-pointer
                      [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-md
                      focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 transition-colors"
                  />
                  <div className="w-16 px-2 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded text-center transition-colors">
                    {threshold}%
                  </div>
                </div>
              ))}
              <button 
                className="text-sm text-indigo-600 dark:text-teal-400 hover:text-indigo-800 dark:hover:text-teal-300 transition-colors"
                onClick={() => setSettings({ 
                  ...settings, 
                  thresholds: [...settings.thresholds, 50] 
                })}
              >
                + Add threshold
              </button>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-4">Email Notifications</h4>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="email-notifications"
                checked={settings.emailNotifications}
                onChange={handleEmailToggle}
                className="h-4 w-4 text-indigo-600 dark:text-teal-500 focus:ring-indigo-500 dark:focus:ring-teal-500 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded transition-colors"
              />
              <label htmlFor="email-notifications" className="ml-2 block text-sm text-gray-700 dark:text-gray-200">
                Enable email notifications
              </label>
            </div>
            
            {settings.emailNotifications && (
              <div>
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Email Address
                </label>
                <div className="flex">
                  <div className="relative flex-grow">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                    <input
                      type="email"
                      id="email-address"
                      value={settings.emailAddress}
                      onChange={handleEmailChange}
                      className="pl-10 pr-3 py-2 w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:border-indigo-500 dark:focus:border-teal-500 transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-indigo-600 dark:bg-teal-600 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Save Settings
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-4">Current Notification Thresholds</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {settings.thresholds.map((threshold, index) => (
                <div key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-full text-sm transition-colors">
                  {threshold}%
                </div>
              ))}
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-lg p-4 transition-colors">
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Email Notifications</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
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
            className="flex items-center text-indigo-600 dark:text-teal-400 hover:text-indigo-800 dark:hover:text-teal-300 transition-colors"
          >
            <Sliders className="w-4 h-4 mr-2" />
            Configure Notifications
          </button>
        </div>
      )}
    </div>
  );
}
