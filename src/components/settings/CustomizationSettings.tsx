import React from 'react';
import { Palette, Bell, Upload } from 'lucide-react';
import SettingsCard from './SettingsCard';

export default function CustomizationSettings() {
  return (
    <SettingsCard
      title="Customization"
      icon={Palette}
      className="md:p-10 p-5"
    >
      <div className="md:grid md:grid-cols-2 md:gap-6 grid grid-cols-1">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Interface</h3>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 rounded-lg transition-colors">
              <div className="font-medium mb-3 text-gray-900 dark:text-gray-100">Theme</div>
              <div className="flex gap-3">
                <button className="flex-1 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-center text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                  Light
                </button>
                <button className="flex-1 py-2 border border-gray-800 dark:border-gray-500 rounded-md bg-gray-900 dark:bg-gray-600 text-white dark:text-gray-100 text-center text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-500 transition-colors">
                  Dark
                </button>
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 rounded-lg transition-colors">
              <div className="font-medium mb-3 text-gray-900 dark:text-gray-100">Branding Colors</div>
              <div className="grid grid-cols-6 gap-2 md:grid-cols-6 sm:grid-cols-4 xs:grid-cols-3">
                {['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'].map((color) => (
                  <button
                    key={color}
                    className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-400 transition-colors shadow-sm hover:shadow-md"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 rounded-lg transition-colors">
              <div className="font-medium mb-3 text-gray-900 dark:text-gray-100">Logo</div>
              <div className="flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg p-6 transition-colors">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                  <div className="mt-2">
                    <button className="text-sm text-indigo-600 dark:text-teal-400 hover:text-indigo-800 dark:hover:text-teal-300 transition-colors">
                      Download a logo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Notifications</h3>
          <div className="space-y-3">
            {[
              { type: 'Email', description: 'Notifications par email' },
              { type: 'Push', description: 'Notifications navigateur' },
              { type: 'Slack', description: 'Notifications Slack' },
              { type: 'SMS', description: 'Notifications SMS' }
            ].map((notification) => (
              <div key={notification.type} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 rounded-lg transition-colors">
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">{notification.type}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{notification.description}</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-teal-500/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white dark:peer-checked:after:border-gray-300 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-gray-200 after:border-gray-300 dark:after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 dark:peer-checked:bg-teal-500"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SettingsCard>
  );
}
