import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SettingsCardProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

export default function SettingsCard({ title, icon: Icon, children }: SettingsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow md:p-6 p-4">
      <div className="md:p-6 p-4 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Icon className="w-5 h-5 text-indigo-600" />
          </div>
          <h2 className="md:text-2xl text-xl font-semibold text-gray-900">{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
}
