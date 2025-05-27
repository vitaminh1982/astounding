import React, { useState } from 'react';
import { Template } from '../../../../types/template';
import { Globe2, Lock, Users, ChevronRight } from 'lucide-react';

interface SharingSettingsProps {
  template: Template;
}

export default function SharingSettings({ template }: SharingSettingsProps) {
  const [visibility, setVisibility] = useState('private');
  const [showDetails, setShowDetails] = useState(false);
  const [access, setAccess] = useState({
    customerService: true,
    support: true,
    marketing: false,
    sales: false
  });

  const handleAccessChange = (key: keyof typeof access) => {
    setAccess(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const visibilityOptions = [
    {
      value: 'public',
      label: 'Public',
      description: 'Accessible to customers',
      icon: Globe2,
    },
    {
      value: 'private',
      label: 'Private',
      description: 'Internal use only',
      icon: Lock,
    }
  ];

  const accessOptions = [
    { key: 'customerService', label: 'Customer Service', badge: 'CS' },
    { key: 'support', label: 'Support', badge: 'SUP' },
    { key: 'marketing', label: 'Marketing', badge: 'MKT' },
    { key: 'sales', label: 'Sales', badge: 'SAL' }
  ];

  return (
    <div className="bg-white">
      {/* Mobile Header */}
      <div className="sm:hidden">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center justify-between w-full p-4 border-b"
        >
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-gray-500" />
            <span className="font-medium">Sharing & Access</span>
          </div>
          <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${
            showDetails ? 'rotate-90' : ''
          }`} />
        </button>
      </div>

      {/* Main Content */}
      <div className={`${!showDetails && 'sm:block hidden'}`}>
        <div className="p-4 space-y-6">
          {/* Visibility */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Visibility</h4>
            <div className="space-y-3">
              {visibilityOptions.map(option => (
                <label
                  key={option.value}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    visibility === option.value
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="visibility"
                    value={option.value}
                    checked={visibility === option.value}
                    onChange={(e) => setVisibility(e.target.value)}
                    className="mt-1 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <option.icon className={`w-4 h-4 ${
                        visibility === option.value ? 'text-indigo-600' : 'text-gray-400'
                      }`} />
                      <span className="font-medium text-gray-900">{option.label}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Team Sharing */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Team Sharing
            </h4>
            <div className="space-y-2">
              {accessOptions.map(({ key, label, badge }) => (
                <label
                  key={key}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    access[key as keyof typeof access]
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={access[key as keyof typeof access]}
                    onChange={() => handleAccessChange(key as keyof typeof access)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="flex items-center justify-between flex-1">
                    <span className="font-medium text-gray-900">{label}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      access[key as keyof typeof access]
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {badge}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Shared Access</span>
              <span className="font-medium">
                {Object.values(access).filter(Boolean).length} teams
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Actions */}
        <div className="sm:hidden p-4 border-t bg-gray-50">
          <button
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg font-medium"
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
}
