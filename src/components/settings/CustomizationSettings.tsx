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
          <h3 className="font-semibold text-foreground dark:text-foreground mb-4">Interface</h3>
          <div className="space-y-4">
            <div className="p-4 border border-border dark:border-border bg-surface-container-low dark:bg-surface-container-high rounded-lg transition-colors">
              <div className="font-medium mb-3 text-foreground dark:text-foreground">Theme</div>
              <div className="flex gap-3">
                <button className="flex-1 py-2 border border-border dark:border-border rounded-md bg-white dark:bg-surface-container-highest text-foreground dark:text-foreground text-center text-sm font-medium hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors">
                  Light
                </button>
                <button className="flex-1 py-2 border border-gray-800 dark:border-outline rounded-md bg-background dark:bg-surface-container-highest text-white dark:text-foreground text-center text-sm font-medium hover:bg-surface-container-high dark:hover:bg-outline transition-colors">
                  Dark
                </button>
              </div>
            </div>
            
            <div className="p-4 border border-border dark:border-border bg-surface-container-low dark:bg-surface-container-high rounded-lg transition-colors">
              <div className="font-medium mb-3 text-foreground dark:text-foreground">Branding Colors</div>
              <div className="grid grid-cols-6 gap-2 md:grid-cols-6 sm:grid-cols-4 xs:grid-cols-3">
                {['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'].map((color) => (
                  <button
                    key={color}
                    className="w-8 h-8 rounded-full border-2 border-border dark:border-border hover:border-outline-variant dark:hover:border-outline-variant transition-colors shadow-sm hover:shadow-md"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            
            <div className="p-4 border border-border dark:border-border bg-surface-container-low dark:bg-surface-container-high rounded-lg transition-colors">
              <div className="font-medium mb-3 text-foreground dark:text-foreground">Logo</div>
              <div className="flex items-center justify-center border-2 border-dashed border-border dark:border-border bg-white dark:bg-surface-container-highest rounded-lg p-6 transition-colors">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-outline dark:text-muted-foreground" />
                  <div className="mt-2">
                    <button className="text-sm text-primary-green dark:text-green-400 hover:text-indigo-800 dark:hover:text-green-300 transition-colors">
                      Download a logo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold text-foreground dark:text-foreground mb-4">Notifications</h3>
          <div className="space-y-3">
            {[
              { type: 'Email', description: 'Notifications par email' },
              { type: 'Push', description: 'Notifications navigateur' },
              { type: 'Slack', description: 'Notifications Slack' },
              { type: 'SMS', description: 'Notifications SMS' }
            ].map((notification) => (
              <div key={notification.type} className="flex items-center justify-between p-4 border border-border dark:border-border bg-surface-container-low dark:bg-surface-container-high rounded-lg transition-colors">
                <div>
                  <div className="font-medium text-foreground dark:text-foreground">{notification.type}</div>
                  <div className="text-sm text-muted-foreground dark:text-muted-foreground">{notification.description}</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-surface-container dark:bg-surface-container-highest peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-ring/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white dark:peer-checked:after:border-border after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-surface-container after:border-border dark:after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary dark:peer-checked:bg-primary"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SettingsCard>
  );
}
