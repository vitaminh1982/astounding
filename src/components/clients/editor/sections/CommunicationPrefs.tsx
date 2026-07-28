import React, { useState, useEffect } from 'react';
import { Client } from '../../../../types/client';
import { Bell, Mail, MessageSquare, Phone, Globe, Clock, Gift, Newspaper, Check, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CommunicationPrefsProps {
  client: Client;
  onChange: (updates: Partial<Client>) => void;
}

const CHANNEL_CONFIG = {
  email: {
    icon: Mail,
    label: 'Email',
    description: 'Receive communications via email',
    color: 'text-tertiary dark:text-tertiary bg-blue-100 dark:bg-blue-900/30'
  },
  sms: {
    icon: MessageSquare,
    label: 'SMS',
    description: 'Receive text messages on mobile phone',
    color: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
  },
  phone: {
    icon: Phone,
    label: 'Phone',
    description: 'Receive calls for important communications',
    color: 'text-tertiary dark:text-tertiary bg-purple-100 dark:bg-purple-900/30'
  }
};

const LANGUAGE_CONFIG = {
  en: { label: 'English', flag: '🇺🇸' },
  fr: { label: 'Français', flag: '🇫🇷' },
  es: { label: 'Español', flag: '🇪🇸' },
  de: { label: 'Deutsch', flag: '🇩🇪' },
  it: { label: 'Italiano', flag: '🇮🇹' }
};

const FREQUENCY_CONFIG = {
  daily: { 
    label: 'Daily', 
    description: 'Receive communications every day',
    color: 'text-red-600 dark:text-destructive'
  },
  weekly: { 
    label: 'Weekly', 
    description: 'Receive communications once a week',
    color: 'text-amber-600 dark:text-destructive'
  },
  monthly: { 
    label: 'Monthly', 
    description: 'Receive communications once a month',
    color: 'text-green-600 dark:text-green-400'
  },
  never: {
    label: 'Never',
    description: 'No regular communications',
    color: 'text-muted-foreground dark:text-muted-foreground'
  }
};

export default function CommunicationPrefs({ client, onChange }: CommunicationPrefsProps) {
  const [preferences, setPreferences] = useState(client.preferences);
  const [hasChanges, setHasChanges] = useState(false);

  // Track changes
  useEffect(() => {
    const hasChanged = JSON.stringify(preferences) !== JSON.stringify(client.preferences);
    setHasChanges(hasChanged);
  }, [preferences, client.preferences]);

  const updatePreferences = (updates: Partial<typeof preferences>) => {
    const updatedPreferences = { ...preferences, ...updates };
    setPreferences(updatedPreferences);
    onChange({ preferences: updatedPreferences });
  };

  const toggleChannel = (channel: 'email' | 'sms' | 'phone') => {
    const newChannels = preferences.channels.includes(channel)
      ? preferences.channels.filter(c => c !== channel)
      : [...preferences.channels, channel];
    
    updatePreferences({ channels: newChannels });
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updatePreferences({ language: e.target.value });
  };

  const handleFrequencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updatePreferences({ contactFrequency: e.target.value as any });
  };

  const handleNewsletterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePreferences({ newsletter: e.target.checked });
  };

  const handleSpecialOffersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePreferences({ specialOffers: e.target.checked });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-teal-900/30 border border-blue-200 dark:border-teal-800 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-tertiary dark:text-teal-400 transition-colors" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground dark:text-foreground transition-colors">
              Communication Preferences
            </h3>
            <p className="text-sm text-muted-foreground dark:text-muted-foreground transition-colors">
              Configure how and when to contact this client
            </p>
          </div>
        </div>
        
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-xs rounded-full border border-amber-200 dark:border-amber-800 transition-colors"
          >
            Unsaved changes
          </motion.div>
        )}
      </div>
      
      {/* Communication Channels */}
      <div>
        <h4 className="text-sm font-medium text-on-surface dark:text-muted-foreground mb-4 flex items-center gap-2 transition-colors">
          <Settings className="w-4 h-4" />
          Preferred Channels ({preferences.channels.length} selected)
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(CHANNEL_CONFIG).map(([channelId, config]) => {
            const isSelected = preferences.channels.includes(channelId as any);
            const IconComponent = config.icon;
            
            return (
              <motion.div
                key={channelId}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-indigo-300 dark:border-teal-600 bg-indigo-50 dark:bg-teal-900/20'
                    : 'border-border dark:border-border bg-white dark:bg-surface-container-high hover:border-border dark:hover:border-border'
                } shadow-sm dark:shadow-gray-900 hover:shadow-md dark:hover:shadow-gray-800`}
                onClick={() => toggleChannel(channelId as any)}
              >
                <label className="cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleChannel(channelId as any)}
                    className="sr-only"
                  />
                  
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg transition-colors ${config.color}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground dark:text-foreground transition-colors">
                        {config.label}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="p-1 bg-primary dark:bg-teal-600 rounded-full">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground transition-colors">
                    {config.description}
                  </p>
                </label>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Language and Frequency Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Language Selection */}
        <div>
          <label className="block text-sm font-medium text-on-surface dark:text-muted-foreground mb-3 transition-colors">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Preferred Language
            </div>
          </label>
          
          <div className="relative">
            <select
              value={preferences.language}
              onChange={handleLanguageChange}
              className="w-full pl-4 pr-10 py-2.5 border border-border dark:border-border rounded-lg bg-white dark:bg-surface-container-highest text-foreground dark:text-foreground shadow-sm dark:shadow-gray-900 focus:border-primary-green dark:focus:border-teal-500 focus:ring-ring dark:focus:ring-ring transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 appearance-none"
            >
              {Object.entries(LANGUAGE_CONFIG).map(([code, config]) => (
                <option key={code} value={code}>
                  {config.flag} {config.label}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-outline dark:text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg transition-colors">
            <p className="text-sm text-blue-700 dark:text-blue-300 transition-colors">
              Selected: {LANGUAGE_CONFIG[preferences.language as keyof typeof LANGUAGE_CONFIG]?.flag} {LANGUAGE_CONFIG[preferences.language as keyof typeof LANGUAGE_CONFIG]?.label}
            </p>
          </div>
        </div>

        {/* Contact Frequency */}
        <div>
          <label className="block text-sm font-medium text-on-surface dark:text-muted-foreground mb-3 transition-colors">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Contact Frequency
            </div>
          </label>
          
          <div className="relative">
            <select
              value={preferences.contactFrequency}
              onChange={handleFrequencyChange}
              className="w-full pl-4 pr-10 py-2.5 border border-border dark:border-border rounded-lg bg-white dark:bg-surface-container-highest text-foreground dark:text-foreground shadow-sm dark:shadow-gray-900 focus:border-primary-green dark:focus:border-teal-500 focus:ring-ring dark:focus:ring-ring transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 appearance-none"
            >
              {Object.entries(FREQUENCY_CONFIG).map(([freq, config]) => (
                <option key={freq} value={freq}>
                  {config.label}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-outline dark:text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          <div className="mt-2 p-3 bg-surface-container-low dark:bg-surface-container-high/50 border border-border dark:border-border rounded-lg transition-colors">
            <p className={`text-sm font-medium transition-colors ${FREQUENCY_CONFIG[preferences.contactFrequency as keyof typeof FREQUENCY_CONFIG]?.color}`}>
              {FREQUENCY_CONFIG[preferences.contactFrequency as keyof typeof FREQUENCY_CONFIG]?.description}
            </p>
          </div>
        </div>
      </div>

      {/* Marketing Preferences */}
      <div>
        <h4 className="text-sm font-medium text-on-surface dark:text-muted-foreground mb-4 flex items-center gap-2 transition-colors">
          <Gift className="w-4 h-4" />
          Marketing Preferences
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Newsletter */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
              preferences.newsletter
                ? 'border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20'
                : 'border-border dark:border-border bg-white dark:bg-surface-container-high hover:border-border dark:hover:border-border'
            } shadow-sm dark:shadow-gray-900 hover:shadow-md dark:hover:shadow-gray-800`}
            onClick={() => handleNewsletterChange({ target: { checked: !preferences.newsletter } } as any)}
          >
            <label className="cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.newsletter}
                onChange={handleNewsletterChange}
                className="sr-only"
              />
              
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg transition-colors">
                  <Newspaper className="w-5 h-5 text-tertiary dark:text-tertiary transition-colors" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground dark:text-foreground transition-colors">
                    Newsletter Subscription
                  </p>
                </div>
                {preferences.newsletter && (
                  <div className="p-1 bg-green-600 dark:bg-green-500 rounded-full">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground dark:text-muted-foreground transition-colors">
                Receive our regular newsletter with updates and insights
              </p>
            </label>
          </motion.div>

          {/* Special Offers */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
              preferences.specialOffers
                ? 'border-purple-300 dark:border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                : 'border-border dark:border-border bg-white dark:bg-surface-container-high hover:border-border dark:hover:border-border'
            } shadow-sm dark:shadow-gray-900 hover:shadow-md dark:hover:shadow-gray-800`}
            onClick={() => handleSpecialOffersChange({ target: { checked: !preferences.specialOffers } } as any)}
          >
            <label className="cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.specialOffers}
                onChange={handleSpecialOffersChange}
                className="sr-only"
              />
              
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg transition-colors">
                  <Gift className="w-5 h-5 text-tertiary dark:text-tertiary transition-colors" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground dark:text-foreground transition-colors">
                    Special Offers
                  </p>
                </div>
                {preferences.specialOffers && (
                  <div className="p-1 bg-tertiary dark:bg-tertiary rounded-full">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground dark:text-muted-foreground transition-colors">
                Get notified about exclusive offers and promotions
              </p>
            </label>
          </motion.div>
        </div>
      </div>

      {/* Summary */}
      <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 border border-border dark:border-border rounded-lg transition-colors">
        <h4 className="font-medium text-foreground dark:text-foreground mb-3 transition-colors">
          Preferences Summary
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground dark:text-muted-foreground transition-colors">Active Channels:</span>
              <span className="font-medium text-foreground dark:text-foreground transition-colors">
                {preferences.channels.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground dark:text-muted-foreground transition-colors">Language:</span>
              <span className="font-medium text-foreground dark:text-foreground transition-colors">
                {LANGUAGE_CONFIG[preferences.language as keyof typeof LANGUAGE_CONFIG]?.label}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground dark:text-muted-foreground transition-colors">Contact Frequency:</span>
              <span className="font-medium text-foreground dark:text-foreground transition-colors">
                {FREQUENCY_CONFIG[preferences.contactFrequency as keyof typeof FREQUENCY_CONFIG]?.label}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground dark:text-muted-foreground transition-colors">Marketing Opt-ins:</span>
              <span className="font-medium text-foreground dark:text-foreground transition-colors">
                {(preferences.newsletter ? 1 : 0) + (preferences.specialOffers ? 1 : 0)}/2
              </span>
            </div>
          </div>
        </div>

        {/* Channel Pills */}
        <div className="mt-4 pt-4 border-t border-border dark:border-border">
          <p className="text-xs text-muted-foreground dark:text-muted-foreground mb-2 transition-colors">
            Active communication channels:
          </p>
          <div className="flex flex-wrap gap-2">
            {preferences.channels.map((channel) => {
              const config = CHANNEL_CONFIG[channel as keyof typeof CHANNEL_CONFIG];
              const IconComponent = config.icon;
              return (
                <span
                  key={channel}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border transition-colors ${config.color}`}
                >
                  <IconComponent className="w-3 h-3" />
                  {config.label}
                </span>
              );
            })}
            {preferences.channels.length === 0 && (
              <span className="text-xs text-muted-foreground dark:text-muted-foreground italic transition-colors">
                No channels selected
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
