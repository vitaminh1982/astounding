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
          <h3 className="font-semibold text-gray-900 mb-4">Interface</h3>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="font-medium mb-3">Theme</div>
              <div className="flex gap-3">
                <button className="flex-1 py-2 border rounded-md bg-white text-center text-sm font-medium">
                  Light
                </button>
                <button className="flex-1 py-2 border rounded-md bg-gray-900 text-white text-center text-sm font-medium">
                  Dark
                </button>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="font-medium mb-3">Branding Colors</div>
              <div className="grid grid-cols-6 gap-2 md:grid-cols-6 sm:grid-cols-4 xs:grid-cols-3">
                {['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'].map((color) => (
                  <button
                    key={color}
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="font-medium mb-3">Logo</div>
              <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-2">
                    <button className="text-sm text-indigo-600">Download a logo</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Notifications</h3>
          <div className="space-y-3">
            {[
              { type: 'Email', description: 'Notifications par email' },
              { type: 'Push', description: 'Notifications navigateur' },
              { type: 'Slack', description: 'Notifications Slack' },
              { type: 'SMS', description: 'Notifications SMS' }
            ].map((notification) => (
              <div key={notification.type} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">{notification.type}</div>
                  <div className="text-sm text-gray-500">{notification.description}</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SettingsCard>
  );
}
