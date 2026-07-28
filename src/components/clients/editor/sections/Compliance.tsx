import React, { useState } from 'react';
import { Client } from '../../../../types/client';
import { Shield, Clock, Check, X, AlertTriangle, FileText, Eye, Download, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ComplianceProps {
  client: Client;
  onChange?: (gdprData: any) => void;
}

interface ConsentItem {
  key: keyof typeof client.gdpr.consents;
  label: string;
  description: string;
  required: boolean;
  category: 'essential' | 'functional' | 'analytics' | 'marketing';
}

export default function Compliance({ client, onChange }: ComplianceProps) {
  const [consents, setConsents] = useState(client.gdpr.consents);
  const [showDetails, setShowDetails] = useState(false);

  const consentItems: ConsentItem[] = [
    {
      key: 'marketing',
      label: 'Marketing Communications',
      description: 'Allow us to send you promotional emails, newsletters, and marketing updates.',
      required: false,
      category: 'marketing'
    },
    {
      key: 'analytics',
      label: 'Data Analytics',
      description: 'Help us improve our services by allowing anonymous usage analytics and performance tracking.',
      required: false,
      category: 'analytics'
    },
    {
      key: 'thirdParty',
      label: 'Third-Party Services',
      description: 'Enable integration with third-party services for enhanced functionality and features.',
      required: false,
      category: 'functional'
    }
  ];

  const handleConsentChange = (key: keyof typeof consents) => {
    const updatedConsents = {
      ...consents,
      [key]: !consents[key]
    };
    
    setConsents(updatedConsents);
    
    const updatedGdpr = {
      ...client.gdpr,
      consents: updatedConsents,
      lastUpdate: new Date().toLocaleDateString()
    };
    
    onChange?.(updatedGdpr);
  };

  const getCategoryColor = (category: ConsentItem['category']) => {
    const colors = {
      essential: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800',
      functional: 'text-tertiary dark:text-tertiary bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800',
      analytics: 'text-tertiary dark:text-tertiary bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800',
      marketing: 'text-amber-600 dark:text-destructive bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800'
    };
    return colors[category];
  };

  const getComplianceStatus = () => {
    const totalConsents = Object.keys(consents).length;
    const activeConsents = Object.values(consents).filter(Boolean).length;
    const percentage = Math.round((activeConsents / totalConsents) * 100);
    
    return {
      percentage,
      status: percentage >= 66 ? 'good' : percentage >= 33 ? 'partial' : 'minimal',
      activeConsents,
      totalConsents
    };
  };

  const complianceStatus = getComplianceStatus();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg transition-colors">
            <Shield className="w-5 h-5 text-green-600 dark:text-green-400 transition-colors" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground dark:text-foreground transition-colors">
              GDPR Compliance
            </h3>
            <p className="text-sm text-muted-foreground dark:text-muted-foreground transition-colors">
              Data protection and privacy preferences
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="px-3 py-1.5 text-sm bg-surface-container-low dark:bg-surface-container-highest text-on-surface dark:text-muted-foreground border border-border dark:border-border rounded-lg hover:bg-surface-container dark:hover:bg-surface-container-highest transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-ring focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          aria-label={showDetails ? "Hide compliance details" : "Show compliance details"}
        >
          <Eye className="w-4 h-4" />
          {showDetails ? 'Hide Details' : 'View Details'}
        </button>
      </div>

      {/* Compliance Status Overview */}
      <div className="p-4 bg-white dark:bg-surface-container-high border border-border dark:border-border rounded-lg shadow-sm dark:shadow-gray-900 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-full transition-colors ${
              complianceStatus.status === 'good' 
                ? 'bg-green-100 dark:bg-green-900/30' 
                : complianceStatus.status === 'partial' 
                ? 'bg-amber-100 dark:bg-amber-900/30' 
                : 'bg-red-100 dark:bg-red-900/30'
            }`}>
              {complianceStatus.status === 'good' ? (
                <Check className="w-4 h-4 text-green-600 dark:text-green-400 transition-colors" />
              ) : complianceStatus.status === 'partial' ? (
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-destructive transition-colors" />
              ) : (
                <X className="w-4 h-4 text-red-600 dark:text-destructive transition-colors" />
              )}
            </div>
            <div>
              <p className="font-medium text-foreground dark:text-foreground transition-colors">
                Consent Status
              </p>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground transition-colors">
                {complianceStatus.activeConsents} of {complianceStatus.totalConsents} consents active
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <p className={`text-2xl font-bold transition-colors ${
              complianceStatus.status === 'good' 
                ? 'text-green-600 dark:text-green-400' 
                : complianceStatus.status === 'partial' 
                ? 'text-amber-600 dark:text-destructive' 
                : 'text-red-600 dark:text-destructive'
            }`}>
              {complianceStatus.percentage}%
            </p>
            <p className="text-xs text-muted-foreground dark:text-muted-foreground transition-colors">
              Compliance Level
            </p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="relative">
          <div className="h-2 bg-surface-container dark:bg-surface-container-highest rounded-full overflow-hidden transition-colors">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${complianceStatus.percentage}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={`h-full rounded-full transition-colors ${
                complianceStatus.status === 'good' 
                  ? 'bg-green-500 dark:bg-green-400' 
                  : complianceStatus.status === 'partial' 
                  ? 'bg-destructive dark:bg-destructive' 
                  : 'bg-destructive dark:bg-destructive'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Consent Controls */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-on-surface dark:text-muted-foreground flex items-center gap-2 transition-colors">
          <FileText className="w-4 h-4" />
          Consent Preferences
        </h4>
        
        <div className="space-y-3">
          {consentItems.map((item, index) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-white dark:bg-surface-container-high border border-border dark:border-border rounded-lg shadow-sm dark:shadow-gray-900 transition-colors"
            >
              <div className="flex items-start gap-3">
                {/* Custom Checkbox */}
                <label className="relative flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consents[item.key]}
                    onChange={() => handleConsentChange(item.key)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 border-2 rounded transition-all duration-200 flex items-center justify-center ${
                    consents[item.key]
                      ? 'bg-primary dark:bg-teal-600 border-indigo-600 dark:border-teal-600'
                      : 'bg-white dark:bg-surface-container-highest border-border dark:border-border hover:border-indigo-400 dark:hover:border-teal-400'
                  }`}>
                    {consents[item.key] && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                </label>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-foreground dark:text-foreground transition-colors">
                      {item.label}
                    </p>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full border transition-colors ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                  </div>
                  
                  <AnimatePresence>
                    {showDetails && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-sm text-muted-foreground dark:text-muted-foreground transition-colors"
                      >
                        {item.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Compliance Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Last Update Info */}
        <div className="p-4 bg-surface-container-low dark:bg-surface-container-high/50 border border-border dark:border-border rounded-lg transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-muted-foreground dark:text-muted-foreground transition-colors" />
            <h5 className="font-medium text-foreground dark:text-foreground transition-colors">
              Last Updated
            </h5>
          </div>
          <p className="text-sm text-muted-foreground dark:text-muted-foreground transition-colors">
            {client.gdpr.lastUpdate}
          </p>
          <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-1 transition-colors">
            Preferences can be modified at any time
          </p>
        </div>

        {/* Data Rights */}
        <div className="p-4 bg-surface-container-low dark:bg-surface-container-high/50 border border-border dark:border-border rounded-lg transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-4 h-4 text-muted-foreground dark:text-muted-foreground transition-colors" />
            <h5 className="font-medium text-foreground dark:text-foreground transition-colors">
              Your Rights
            </h5>
          </div>
          <div className="space-y-1">
            <button className="text-xs text-primary-green dark:text-teal-400 hover:underline transition-colors">
              Request data export
            </button>
            <br />
            <button className="text-xs text-primary-green dark:text-teal-400 hover:underline transition-colors">
              Request data deletion
            </button>
            <br />
            <button className="text-xs text-primary-green dark:text-teal-400 hover:underline transition-colors">
              View privacy policy
            </button>
          </div>
        </div>
      </div>

      {/* Compliance Actions */}
      <div className="flex flex-wrap gap-3 pt-4 border-t border-border dark:border-border transition-colors">
        <button className="px-4 py-2 bg-primary dark:bg-teal-600 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-teal-700 transition-colors flex items-center gap-2 text-sm font-medium shadow-sm dark:shadow-gray-900 hover:shadow-md dark:hover:shadow-gray-800 focus:outline-none focus:ring-2 focus:ring-ring dark:focus:ring-ring focus:ring-offset-2 dark:focus:ring-offset-gray-800">
          <Download className="w-4 h-4" />
          Export Data
        </button>
        
        <button className="px-4 py-2 bg-surface-container-low dark:bg-surface-container-highest text-on-surface dark:text-muted-foreground border border-border dark:border-border rounded-lg hover:bg-surface-container dark:hover:bg-surface-container-highest transition-colors flex items-center gap-2 text-sm font-medium shadow-sm dark:shadow-gray-900 hover:shadow-md dark:hover:shadow-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-ring focus:ring-offset-2 dark:focus:ring-offset-gray-800">
          <FileText className="w-4 h-4" />
          Privacy Policy
        </button>
      </div>
    </div>
  );
}
