import React, { useState, useEffect } from 'react';
import { Template } from '../../../../types/template';
import { Info, MessageSquare, Settings2, Copy, Check, AlertCircle, Hash, Type, Clock, Smile, Code } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MessageConfigProps {
  template: Template;
  onChange?: (updates: any) => void;
}

interface Settings {
  includeEmoji: boolean;
  htmlFormatting: boolean;
  textVersion: boolean;
  delay: string;
  customDelay?: number;
}

export default function MessageConfig({ template, onChange }: MessageConfigProps) {
  const [activeTab, setActiveTab] = useState('message');
  const [title, setTitle] = useState("Client Welcome");
  const [message, setMessage] = useState(`Hello {client.firstName},

Welcome to {company.name}! 🎉

We are thrilled to have you as one of our new clients. To celebrate your arrival, we are offering you an exclusive discount of {offer.discount}% on your first order!

To use it, simply apply the code:
【 WELCOME{client.id} 】
valid until {offer.expiry_date}.

Feel free to explore our full catalog on {company.website}
or reach out to us with any questions.

See you soon,
The {company.name} Team`);

  const [variables] = useState({
    client: ['firstName', 'lastName', 'email', 'id'],
    company: ['name', 'website', 'email', 'phone'],
    offer: ['discount', 'expiry_date', 'code']
  });

  const [settings, setSettings] = useState<Settings>({
    includeEmoji: true,
    htmlFormatting: true,
    textVersion: true,
    delay: 'immediate'
  });

  const [copiedVar, setCopiedVar] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ title?: string; message?: string }>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Track changes
  useEffect(() => {
    setHasChanges(true);
  }, [title, message, settings]);

  const notifyChange = () => {
    setHasChanges(true);
    onChange?.({ title, message, settings });
  };

  const validateTitle = (value: string): string | undefined => {
    if (!value.trim()) return 'Title is required';
    if (value.length < 3) return 'Title must be at least 3 characters';
    if (value.length > 100) return 'Title must be less than 100 characters';
    return undefined;
  };

  const validateMessage = (value: string): string | undefined => {
    if (!value.trim()) return 'Message is required';
    if (value.length < 10) return 'Message must be at least 10 characters';
    if (value.length > 5000) return 'Message must be less than 5000 characters';
    return undefined;
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    const error = validateTitle(value);
    setErrors(prev => ({ ...prev, title: error }));
    notifyChange();
  };

  const handleMessageChange = (value: string) => {
    setMessage(value);
    const error = validateMessage(value);
    setErrors(prev => ({ ...prev, message: error }));
    notifyChange();
  };

  const handleCopyVariable = async (category: string, variable: string) => {
    const varText = `{${category}.${variable}}`;
    try {
      await navigator.clipboard.writeText(varText);
      setCopiedVar(varText);
      setTimeout(() => setCopiedVar(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getCharacterCountColor = (count: number, max: number): string => {
    const percentage = (count / max) * 100;
    if (percentage >= 90) return 'text-red-600 dark:text-red-400';
    if (percentage >= 75) return 'text-amber-600 dark:text-amber-400';
    return 'text-gray-500 dark:text-gray-400';
  };

  const tabs = [
    { id: 'message', label: 'Message', icon: MessageSquare },
    { id: 'variables', label: 'Variables', icon: Hash },
    { id: 'settings', label: 'Settings', icon: Settings2 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg transition-colors">
            <MessageSquare className="w-5 h-5 text-green-600 dark:text-green-400 transition-colors" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 transition-colors">
              Message Configuration
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">
              Compose and configure your template message
            </p>
          </div>
        </div>
        
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

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm dark:shadow-gray-900 transition-colors">
        <div className="flex border-b border-gray-200 dark:border-gray-700 transition-colors">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 p-4 text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 relative ${
                  isActive
                    ? 'text-indigo-600 dark:text-teal-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-teal-400"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* Message Tab */}
            {activeTab === 'message' && (
              <motion.div
                key="message"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Title Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2 transition-colors">
                    <Type className="w-4 h-4" />
                    Message Title
                    <span className="text-red-500 dark:text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 shadow-sm dark:shadow-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                      errors.title
                        ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500 dark:focus:ring-red-400'
                        : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-teal-500 focus:ring-indigo-500 dark:focus:ring-teal-500'
                    }`}
                    placeholder="Ex: Welcome to our company!"
                    maxLength={100}
                  />
                  <div className="mt-2 flex items-center justify-between">
                    {errors.title ? (
                      <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 transition-colors">
                        <AlertCircle className="w-4 h-4" />
                        {errors.title}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
                        A clear, concise title for your message
                      </p>
                    )}
                    <span className={`text-xs font-medium transition-colors ${getCharacterCountColor(title.length, 100)}`}>
                      {title.length}/100
                    </span>
                  </div>
                </div>

                {/* Message Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2 transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    Message Content
                    <span className="text-red-500 dark:text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      value={message}
                      onChange={(e) => handleMessageChange(e.target.value)}
                      rows={14}
                      className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 font-mono text-sm shadow-sm dark:shadow-gray-900 transition-colors resize-none focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                        errors.message
                          ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500 dark:focus:ring-red-400'
                          : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-teal-500 focus:ring-indigo-500 dark:focus:ring-teal-500'
                      }`}
                      placeholder="Write your message here... Use {variables} for dynamic content."
                      maxLength={5000}
                    />
                    <div className={`absolute bottom-3 right-3 px-2 py-1 rounded text-xs font-medium transition-colors ${getCharacterCountColor(message.length, 5000)} bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600`}>
                      {message.length}/5000
                    </div>
                  </div>
                  {errors.message && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1 transition-colors">
                      <AlertCircle className="w-4 h-4" />
                      {errors.message}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 transition-colors">
                    💡 Use variables from the Variables tab to personalize your message
                  </p>
                </div>
              </motion.div>
            )}

            {/* Variables Tab */}
            {activeTab === 'variables' && (
              <motion.div
                key="variables"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg transition-colors">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5 transition-colors" />
                    <div className="text-sm text-blue-700 dark:text-blue-300 transition-colors">
                      <p className="font-medium mb-1">How to use variables</p>
                      <p>Click any variable to copy it, then paste it into your message. Variables will be replaced with actual data when the message is sent.</p>
                    </div>
                  </div>
                </div>

                {Object.entries(variables).map(([category, vars]) => (
                  <div key={category} className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
                    <h4 className="text-sm font-semibold capitalize mb-3 text-gray-900 dark:text-gray-100 flex items-center gap-2 transition-colors">
                      <Hash className="w-4 h-4" />
                      {category}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {vars.map((v) => {
                        const varText = `{${category}.${v}}`;
                        const isCopied = copiedVar === varText;
                        
                        return (
                          <motion.button
                            key={v}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleCopyVariable(category, v)}
                            className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-sm flex justify-between items-center group hover:border-indigo-300 dark:hover:border-teal-600 hover:bg-indigo-50 dark:hover:bg-teal-900/20 transition-all shadow-sm dark:shadow-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                          >
                            <code className="font-mono text-gray-700 dark:text-gray-300 transition-colors">
                              {varText}
                            </code>
                            <div className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                              isCopied
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                : 'bg-indigo-100 dark:bg-teal-900/30 text-indigo-700 dark:text-teal-300 opacity-0 group-hover:opacity-100'
                            }`}>
                              {isCopied ? (
                                <span className="flex items-center gap-1">
                                  <Check className="w-3 h-3" />
                                  Copied!
                                </span>
                              ) : (
                                <span className="flex items-center gap-1">
                                  <Copy className="w-3 h-3" />
                                  Copy
                                </span>
                              )}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* General Options */}
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
                  <h4 className="text-sm font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2 transition-colors">
                    <Settings2 className="w-4 h-4" />
                    General Options
                  </h4>
                  <div className="space-y-3">
                    {[
                      { key: 'includeEmoji', label: 'Include Emoji', icon: Smile, description: 'Allow emoji characters in messages' },
                      { key: 'htmlFormatting', label: 'HTML Formatting', icon: Code, description: 'Enable HTML formatting and styling' },
                      { key: 'textVersion', label: 'Plain Text Version', icon: Type, description: 'Generate plain text version for compatibility' }
                    ].map((option) => {
                      const Icon = option.icon;
                      const isChecked = settings[option.key as keyof Settings];
                      
                      return (
                        <label
                          key={option.key}
                          className="flex items-start gap-3 p-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                        >
                          <div className="flex-shrink-0 mt-1">
                            <input
                              type="checkbox"
                              checked={isChecked as boolean}
                              onChange={(e) => {
                                const updatedSettings = {
                                  ...settings,
                                  [option.key]: e.target.checked
                                };
                                setSettings(updatedSettings);
                                notifyChange();
                              }}
                              className="sr-only"
                            />
                            <div className={`w-5 h-5 border-2 rounded transition-all ${
                              isChecked
                                ? 'bg-indigo-600 dark:bg-teal-600 border-indigo-600 dark:border-teal-600'
                                : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                            }`}>
                              {isChecked && (
                                <Check className="w-full h-full text-white p-0.5" />
                              )}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400 transition-colors" />
                              <span className="text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors">
                                {option.label}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
                              {option.description}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Send Delay */}
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
                  <h4 className="text-sm font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2 transition-colors">
                    <Clock className="w-4 h-4" />
                    Send Delay
                  </h4>
                  <select
                    value={settings.delay}
                    onChange={(e) => {
                      const updatedSettings = {
                        ...settings,
                        delay: e.target.value
                      };
                      setSettings(updatedSettings);
                      notifyChange();
                    }}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm dark:shadow-gray-900 focus:border-indigo-500 dark:focus:border-teal-500 focus:ring-indigo-500 dark:focus:ring-teal-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  >
                    <option value="immediate">Send Immediately</option>
                    <option value="1hour">Send After 1 Hour</option>
                    <option value="1day">Send After 1 Day</option>
                    <option value="custom">Custom Delay</option>
                  </select>

                  {settings.delay === 'custom' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4"
                    >
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                        Custom Delay (hours)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="720"
                        value={settings.customDelay || 24}
                        onChange={(e) => {
                          const updatedSettings = {
                            ...settings,
                            customDelay: parseInt(e.target.value) || 1
                          };
                          setSettings(updatedSettings);
                          notifyChange();
                        }}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 shadow-sm dark:shadow-gray-900 focus:border-indigo-500 dark:focus:border-teal-500 focus:ring-indigo-500 dark:focus:ring-teal-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                        placeholder="24"
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 transition-colors">
                        Maximum: 720 hours (30 days)
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
