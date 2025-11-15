import React, { useState, useEffect } from 'react';
import { Template } from '../../../../types/template';
import { Globe2, Lock, Users, ChevronRight, Shield, Check, Info, UserCheck, Building } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SharingSettingsProps {
  template: Template;
  onChange?: (updates: any) => void;
}

interface AccessSettings {
  customerService: boolean;
  support: boolean;
  marketing: boolean;
  sales: boolean;
}

export default function SharingSettings({ template, onChange }: SharingSettingsProps) {
  const [visibility, setVisibility] = useState<'public' | 'private'>('private');
  const [showDetails, setShowDetails] = useState(true);
  const [access, setAccess] = useState<AccessSettings>({
    customerService: true,
    support: true,
    marketing: false,
    sales: false
  });
  const [hasChanges, setHasChanges] = useState(false);

  // Track changes
  useEffect(() => {
    setHasChanges(true);
  }, [visibility, access]);

  const notifyChange = (updates: any) => {
    setHasChanges(true);
    onChange?.(updates);
  };

  const handleAccessChange = (key: keyof AccessSettings) => {
    const updatedAccess = {
      ...access,
      [key]: !access[key]
    };
    setAccess(updatedAccess);
    notifyChange({ access: updatedAccess });
  };

  const handleVisibilityChange = (value: 'public' | 'private') => {
    setVisibility(value);
    notifyChange({ visibility: value });
  };

  const visibilityOptions = [
    {
      value: 'public' as const,
      label: 'Public',
      description: 'Visible to all customers and can be used publicly',
      icon: Globe2,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    {
      value: 'private' as const,
      label: 'Private',
      description: 'Only accessible to your team members with permissions',
      icon: Lock,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      borderColor: 'border-purple-200 dark:border-purple-800'
    }
  ];

  const accessOptions = [
    { 
      key: 'customerService' as keyof AccessSettings, 
      label: 'Customer Service', 
      badge: 'CS',
      icon: UserCheck,
      description: 'Can view and use template for customer support'
    },
    { 
      key: 'support' as keyof AccessSettings, 
      label: 'Technical Support', 
      badge: 'SUP',
      icon: Shield,
      description: 'Can access for technical support cases'
    },
    { 
      key: 'marketing' as keyof AccessSettings, 
      label: 'Marketing Team', 
      badge: 'MKT',
      icon: Users,
      description: 'Can use for marketing campaigns'
    },
    { 
      key: 'sales' as keyof AccessSettings, 
      label: 'Sales Team', 
      badge: 'SAL',
      icon: Building,
      description: 'Can use for sales communications'
    }
  ];

  const activeTeamsCount = Object.values(access).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-lg transition-colors">
            <Users className="w-5 h-5 text-orange-600 dark:text-orange-400 transition-colors" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 transition-colors">
              Sharing & Access
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">
              Control who can access this template
            </p>
          </div>
        </div>
        
        {/* Mobile Toggle */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="sm:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          aria-label={showDetails ? "Hide sharing settings" : "Show sharing settings"}
        >
          <ChevronRight className={`w-5 h-5 transition-transform ${showDetails ? 'rotate-90' : ''}`} />
        </button>

        {/* Changes Indicator */}
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hidden sm:flex px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-xs rounded-full border border-amber-200 dark:border-amber-800 transition-colors"
          >
            Unsaved changes
          </motion.div>
        )}
      </div>

      {/* Main Content */}
      <AnimatePresence>
        {(showDetails || window.innerWidth >= 640) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm dark:shadow-gray-900 transition-colors space-y-6">
              {/* Visibility Settings */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 transition-colors">
                    <Globe2 className="w-4 h-4" />
                    Template Visibility
                  </h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full transition-colors ${
                    visibility === 'public'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                      : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                  }`}>
                    {visibility === 'public' ? 'Public' : 'Private'}
                  </span>
                </div>

                <div className="space-y-3">
                  {visibilityOptions.map((option) => {
                    const isSelected = visibility === option.value;
                    const Icon = option.icon;

                    return (
                      <motion.label
                        key={option.value}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? 'border-indigo-300 dark:border-teal-600 bg-indigo-50 dark:bg-teal-900/20'
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-200 dark:hover:border-teal-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        {/* Radio Button */}
                        <div className="flex-shrink-0 mt-1">
                          <input
                            type="radio"
                            name="visibility"
                            value={option.value}
                            checked={isSelected}
                            onChange={(e) => handleVisibilityChange(e.target.value as 'public' | 'private')}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 rounded-full border-2 transition-all ${
                            isSelected
                              ? 'border-indigo-600 dark:border-teal-600'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}>
                            {isSelected && (
                              <div className="w-full h-full rounded-full bg-indigo-600 dark:bg-teal-600 scale-50" />
                            )}
                          </div>
                        </div>

                        {/* Icon */}
                        <div className={`p-2 rounded-lg flex-shrink-0 transition-colors ${
                          isSelected
                            ? option.bgColor
                            : 'bg-gray-100 dark:bg-gray-700'
                        }`}>
                          <Icon className={`w-5 h-5 transition-colors ${
                            isSelected
                              ? option.color
                              : 'text-gray-600 dark:text-gray-400'
                          }`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`font-semibold transition-colors ${
                              isSelected
                                ? 'text-gray-900 dark:text-gray-100'
                                : 'text-gray-700 dark:text-gray-300'
                            }`}>
                              {option.label}
                            </span>
                          </div>
                          <p className={`text-sm transition-colors ${
                            isSelected
                              ? 'text-gray-600 dark:text-gray-400'
                              : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {option.description}
                          </p>
                        </div>
                      </motion.label>
                    );
                  })}
                </div>
              </div>

              {/* Team Access Settings */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 transition-colors">
                    <Users className="w-4 h-4" />
                    Team Access Permissions
                  </h4>
                  <span className="text-sm text-indigo-600 dark:text-teal-400 font-medium transition-colors">
                    {activeTeamsCount} teams
                  </span>
                </div>

                <div className="space-y-3">
                  {accessOptions.map((option) => {
                    const isActive = access[option.key];
                    const Icon = option.icon;

                    return (
                      <motion.label
                        key={option.key}
                        whileHover={{ scale: 1.01 }}
                        className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          isActive
                            ? 'border-indigo-300 dark:border-teal-600 bg-indigo-50 dark:bg-teal-900/20'
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-200 dark:hover:border-teal-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        {/* Checkbox */}
                        <div className="flex-shrink-0 mt-1">
                          <input
                            type="checkbox"
                            checked={isActive}
                            onChange={() => handleAccessChange(option.key)}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 border-2 rounded transition-all ${
                            isActive
                              ? 'bg-indigo-600 dark:bg-teal-600 border-indigo-600 dark:border-teal-600'
                              : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                          }`}>
                            {isActive && (
                              <Check className="w-full h-full text-white p-0.5" />
                            )}
                          </div>
                        </div>

                        {/* Icon */}
                        <div className={`p-2 rounded-lg flex-shrink-0 transition-colors ${
                          isActive
                            ? 'bg-indigo-100 dark:bg-teal-900/50'
                            : 'bg-gray-100 dark:bg-gray-700'
                        }`}>
                          <Icon className={`w-5 h-5 transition-colors ${
                            isActive
                              ? 'text-indigo-600 dark:text-teal-400'
                              : 'text-gray-600 dark:text-gray-400'
                          }`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className={`font-semibold transition-colors ${
                              isActive
                                ? 'text-gray-900 dark:text-gray-100'
                                : 'text-gray-700 dark:text-gray-300'
                            }`}>
                              {option.label}
                            </span>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded transition-colors ${
                              isActive
                                ? 'bg-indigo-100 dark:bg-teal-900/50 text-indigo-700 dark:text-teal-300'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                            }`}>
                              {option.badge}
                            </span>
                          </div>
                          <p className={`text-sm transition-colors ${
                            isActive
                              ? 'text-gray-600 dark:text-gray-400'
                              : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {option.description}
                          </p>
                        </div>
                      </motion.label>
                    );
                  })}
                </div>

                {activeTeamsCount === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-sm text-amber-700 dark:text-amber-300 transition-colors"
                  >
                    ⚠️ No teams have access. Enable at least one team to use this template.
                  </motion.div>
                )}
              </div>
            </div>

            {/* Summary Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-center shadow-sm dark:shadow-gray-900 transition-colors">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg inline-flex mb-2 transition-colors">
                  <Globe2 className="w-4 h-4 text-blue-600 dark:text-blue-400 transition-colors" />
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors">
                  {visibility === 'public' ? 'Public' : 'Private'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
                  Visibility
                </p>
              </div>

              <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-center shadow-sm dark:shadow-gray-900 transition-colors">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg inline-flex mb-2 transition-colors">
                  <Users className="w-4 h-4 text-green-600 dark:text-green-400 transition-colors" />
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors">
                  {activeTeamsCount}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
                  Active Teams
                </p>
              </div>

              <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-center shadow-sm dark:shadow-gray-900 transition-colors">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg inline-flex mb-2 transition-colors">
                  <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400 transition-colors" />
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors">
                  {visibility === 'private' ? 'Secure' : 'Open'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
                  Security
                </p>
              </div>

              <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-center shadow-sm dark:shadow-gray-900 transition-colors">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg inline-flex mb-2 transition-colors">
                  <UserCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 transition-colors" />
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors">
                  {Object.values(access).filter(Boolean).length > 0 ? 'Shared' : 'None'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
                  Access Level
                </p>
              </div>
            </div>

            {/* Info Box */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded transition-colors">
                  <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 transition-colors" />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors">
                  <p className="font-medium text-gray-900 dark:text-gray-100 mb-1 transition-colors">
                    Access Control Tips
                  </p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Public templates are visible to all customers</li>
                    <li>Private templates require team permissions</li>
                    <li>Review access permissions regularly</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Apply Button */}
      <div className="sm:hidden p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-gray-900 transition-colors">
        <button
          className="w-full py-3 px-4 bg-indigo-600 dark:bg-teal-600 text-white rounded-lg font-medium hover:bg-indigo-700 dark:hover:bg-teal-700 transition-colors shadow-sm dark:shadow-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          Apply Changes
        </button>
      </div>
    </div>
  );
}
