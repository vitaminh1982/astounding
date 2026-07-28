import React, { useState, useEffect } from 'react';
import { Template } from '../../../../types/template';
import { Info, Settings, Check, ChevronDown, Image, FileSignature, Link2, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CustomizationOptionsProps {
  template: Template;
  onChange?: (updates: any) => void;
}

interface OptionConfig {
  key: string;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

interface CustomizationState {
  includeLogo: boolean;
  digitalSignature: boolean;
  clickableLinks: boolean;
}

interface AdvancedSettings {
  signatureFormat: 'simple' | 'detailed' | 'custom';
  logoPosition: 'header' | 'footer';
}

export default function CustomizationOptions({ template, onChange }: CustomizationOptionsProps) {
  const [options, setOptions] = useState<CustomizationState>({
    includeLogo: true,
    digitalSignature: false,
    clickableLinks: true
  });

  const [advancedSettings, setAdvancedSettings] = useState<AdvancedSettings>({
    signatureFormat: 'simple',
    logoPosition: 'header'
  });

  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Track changes
  useEffect(() => {
    setHasChanges(true);
  }, [options, advancedSettings]);

  const notifyChange = (updates: any) => {
    setHasChanges(true);
    onChange?.(updates);
  };

  const optionsConfig: OptionConfig[] = [
    {
      key: 'includeLogo',
      label: 'Include Company Logo',
      description: 'Automatically adds your company logo in the message header or footer',
      icon: Image,
      color: 'text-tertiary dark:text-tertiary'
    },
    {
      key: 'digitalSignature',
      label: 'Add Digital Signature',
      description: 'Includes a secure digital signature for authentication and verification',
      icon: FileSignature,
      color: 'text-tertiary dark:text-tertiary'
    },
    {
      key: 'clickableLinks',
      label: 'Enable Clickable Links',
      description: 'Makes all URLs in the message clickable and trackable',
      icon: Link2,
      color: 'text-green-600 dark:text-green-400'
    }
  ];

  const handleOptionChange = (option: keyof CustomizationState) => {
    const updatedOptions = {
      ...options,
      [option]: !options[option]
    };
    setOptions(updatedOptions);
    notifyChange({ options: updatedOptions });
  };

  const handleAdvancedChange = (setting: keyof AdvancedSettings, value: string) => {
    const updatedSettings = {
      ...advancedSettings,
      [setting]: value
    };
    setAdvancedSettings(updatedSettings);
    notifyChange({ advancedSettings: updatedSettings });
  };

  const activeOptionsCount = Object.values(options).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-purple-900/30 border border-indigo-200 dark:border-purple-800 rounded-lg transition-colors">
            <Palette className="w-5 h-5 text-primary-green dark:text-tertiary transition-colors" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground dark:text-foreground transition-colors">
              Customization Options
            </h3>
            <p className="text-sm text-muted-foreground dark:text-muted-foreground transition-colors">
              Configure message appearance and features
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

      <div className="bg-white dark:bg-surface-container-high border border-border dark:border-border rounded-lg p-6 space-y-6 shadow-sm dark:shadow-gray-900 transition-colors">
        {/* Message Options */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-base text-foreground dark:text-foreground flex items-center gap-2 transition-colors">
              <Settings className="w-4 h-4" />
              Message Options
            </h4>
            <span className="text-sm text-primary-green dark:text-green-400 font-medium transition-colors">
              {activeOptionsCount} active
            </span>
          </div>

          <div className="space-y-3">
            {optionsConfig.map(({ key, label, description, icon: Icon, color }) => {
              const isActive = options[key as keyof CustomizationState];
              const isTooltipActive = activeTooltip === key;

              return (
                <motion.div
                  key={key}
                  whileHover={{ scale: 1.01 }}
                  className={`relative rounded-lg border-2 transition-all duration-200 ${
                    isActive
                      ? 'border-indigo-300 dark:border-green-600 bg-indigo-50 dark:bg-green-900/20'
                      : 'border-border dark:border-border bg-white dark:bg-surface-container-high hover:border-indigo-200 dark:hover:border-green-700 hover:bg-surface-container-low dark:hover:bg-surface-container-highest'
                  }`}
                >
                  <label className="flex items-start gap-3 p-4 cursor-pointer">
                    {/* Custom Checkbox */}
                    <div className="flex-shrink-0 mt-1">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={isActive}
                          onChange={() => handleOptionChange(key as keyof CustomizationState)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 border-2 rounded transition-all ${
                          isActive
                            ? 'bg-primary dark:bg-green-600 border-indigo-600 dark:border-green-600'
                            : 'bg-white dark:bg-surface-container-highest border-border dark:border-border'
                        }`}>
                          {isActive && (
                            <Check className="w-full h-full text-white p-0.5" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Icon */}
                    <div className={`p-2 rounded-lg flex-shrink-0 transition-colors ${
                      isActive
                        ? 'bg-indigo-100 dark:bg-green-900/50'
                        : 'bg-surface-container-low dark:bg-surface-container-highest'
                    }`}>
                      <Icon className={`w-5 h-5 transition-colors ${
                        isActive
                          ? 'text-primary-green dark:text-green-400'
                          : color
                      }`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-medium transition-colors ${
                          isActive
                            ? 'text-foreground dark:text-foreground'
                            : 'text-on-surface dark:text-muted-foreground'
                        }`}>
                          {label}
                        </span>
                      </div>
                      <p className={`text-sm hidden sm:block transition-colors ${
                        isActive
                          ? 'text-muted-foreground dark:text-muted-foreground'
                          : 'text-muted-foreground dark:text-muted-foreground'
                      }`}>
                        {description}
                      </p>
                    </div>

                    {/* Mobile Info Button */}
                    <button
                      type="button"
                      className="sm:hidden p-2 text-outline dark:text-muted-foreground hover:text-primary-green dark:hover:text-green-400 rounded-lg hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors focus:outline-none focus:ring-2 focus:ring-ring dark:focus:ring-ring"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTooltip(isTooltipActive ? null : key);
                      }}
                      aria-label={`Show info for ${label}`}
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </label>

                  {/* Mobile Tooltip */}
                  <AnimatePresence>
                    {isTooltipActive && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="sm:hidden absolute z-20 left-4 right-4 mt-2 p-3 bg-surface-container-high dark:bg-background text-white text-sm rounded-lg shadow-lg border border-border dark:border-border"
                      >
                        <div className="flex items-start gap-2">
                          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <p>{description}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="pt-6 border-t border-border dark:border-border transition-colors">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between p-4 bg-surface-container-low dark:bg-surface-container-high/50 hover:bg-surface-container-low dark:hover:bg-surface-container-highest rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-ring dark:focus:ring-ring focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-muted-foreground dark:text-muted-foreground" />
              <span className="font-medium text-foreground dark:text-foreground">
                Advanced Settings
              </span>
            </div>
            <ChevronDown className={`w-5 h-5 text-muted-foreground dark:text-muted-foreground transition-transform duration-200 ${
              showAdvanced ? 'rotate-180' : ''
            }`} />
          </button>

          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 p-4 bg-surface-container-low dark:bg-surface-container-high/50 rounded-lg border border-border dark:border-border space-y-4 transition-colors">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Signature Format */}
                    <div>
                      <label className="block text-sm font-medium text-on-surface dark:text-muted-foreground mb-2 flex items-center gap-2 transition-colors">
                        <FileSignature className="w-4 h-4" />
                        Signature Format
                      </label>
                      <div className="relative">
                        <select
                          value={advancedSettings.signatureFormat}
                          onChange={(e) => handleAdvancedChange('signatureFormat', e.target.value)}
                          disabled={!options.digitalSignature}
                          className="w-full px-3 py-2 border border-border dark:border-border rounded-lg bg-white dark:bg-surface-container-highest text-foreground dark:text-foreground focus:ring-2 focus:ring-ring dark:focus:ring-ring focus:border-primary-green dark:focus:border-green-500 shadow-sm dark:shadow-gray-900 transition-colors appearance-none disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none pr-10"
                        >
                          <option value="simple">Simple</option>
                          <option value="detailed">Detailed</option>
                          <option value="custom">Custom</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-outline dark:text-muted-foreground pointer-events-none" />
                      </div>
                      {!options.digitalSignature && (
                        <p className="mt-1 text-xs text-amber-600 dark:text-destructive transition-colors">
                          Enable digital signature to configure format
                        </p>
                      )}
                    </div>

                    {/* Logo Position */}
                    <div>
                      <label className="block text-sm font-medium text-on-surface dark:text-muted-foreground mb-2 flex items-center gap-2 transition-colors">
                        <Image className="w-4 h-4" />
                        Logo Position
                      </label>
                      <div className="relative">
                        <select
                          value={advancedSettings.logoPosition}
                          onChange={(e) => handleAdvancedChange('logoPosition', e.target.value as 'header' | 'footer')}
                          disabled={!options.includeLogo}
                          className="w-full px-3 py-2 border border-border dark:border-border rounded-lg bg-white dark:bg-surface-container-highest text-foreground dark:text-foreground focus:ring-2 focus:ring-ring dark:focus:ring-ring focus:border-primary-green dark:focus:border-green-500 shadow-sm dark:shadow-gray-900 transition-colors appearance-none disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none pr-10"
                        >
                          <option value="header">Header</option>
                          <option value="footer">Footer</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-outline dark:text-muted-foreground pointer-events-none" />
                      </div>
                      {!options.includeLogo && (
                        <p className="mt-1 text-xs text-amber-600 dark:text-destructive transition-colors">
                          Enable logo to configure position
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Advanced Settings Info */}
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg transition-colors">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-tertiary dark:text-tertiary mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-700 dark:text-blue-300 transition-colors">
                        <p className="font-medium mb-1">Advanced Configuration</p>
                        <p className="text-xs">
                          These settings are only available when their respective options are enabled.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Summary */}
      <div className="p-4 bg-surface-container-low dark:bg-surface-container-high/50 border border-border dark:border-border rounded-lg transition-colors">
        <div className="flex items-start gap-3">
          <div className="p-1 bg-indigo-100 dark:bg-purple-900/30 rounded transition-colors">
            <Palette className="w-4 h-4 text-primary-green dark:text-tertiary transition-colors" />
          </div>
          <div className="text-sm text-muted-foreground dark:text-muted-foreground transition-colors">
            <p className="font-medium text-foreground dark:text-foreground mb-2 transition-colors">
              Current Configuration
            </p>
            <ul className="space-y-1">
              <li className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${options.includeLogo ? 'bg-green-500' : 'bg-surface-container dark:bg-surface-container-highest'}`} />
                Logo: {options.includeLogo ? `Enabled (${advancedSettings.logoPosition})` : 'Disabled'}
              </li>
              <li className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${options.digitalSignature ? 'bg-green-500' : 'bg-surface-container dark:bg-surface-container-highest'}`} />
                Signature: {options.digitalSignature ? `Enabled (${advancedSettings.signatureFormat})` : 'Disabled'}
              </li>
              <li className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${options.clickableLinks ? 'bg-green-500' : 'bg-surface-container dark:bg-surface-container-highest'}`} />
                Clickable Links: {options.clickableLinks ? 'Enabled' : 'Disabled'}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
