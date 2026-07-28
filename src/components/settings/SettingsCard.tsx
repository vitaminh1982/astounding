import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SettingsCardProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export default function SettingsCard({ title, icon: Icon, children, className = '' }: SettingsCardProps) {
  return (
    <div className={`bg-white dark:bg-surface-container-high rounded-lg shadow-sm dark:shadow-gray-900 border border-border dark:border-border md:p-6 p-4 transition-colors ${className}`}>
      <div className="md:p-6 p-4 border-b border-border dark:border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-100 dark:bg-green-900 rounded-lg transition-colors">
            <Icon className="w-5 h-5 text-primary-green dark:text-green-300" />
          </div>
          <h2 className="md:text-2xl text-xl font-semibold text-foreground dark:text-foreground">{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
}
