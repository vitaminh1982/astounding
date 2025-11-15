import React, { useState } from 'react';
import { Template } from '../../../../types/template';
import { 
  CheckCircle, 
  ChevronRight, 
  Clock, 
  User, 
  AlertCircle,
  ShieldCheck,
  XCircle,
  Calendar,
  FileCheck,
  History,
  Badge
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ValidationInfoProps {
  template: Template;
}

interface ValidationStatus {
  isActive: boolean;
  lastValidation: string;
  validator: string;
  validatorRole: string;
  comments: string;
  expiryDate?: string;
  version?: string;
}

interface HistoryItem {
  date: string;
  action: string;
  user: string;
  status: 'success' | 'warning' | 'info';
}

export default function ValidationInfo({ template }: ValidationInfoProps) {
  const [showDetails, setShowDetails] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  const status: ValidationStatus = {
    isActive: true,
    lastValidation: '03/18/2024',
    validator: 'Marie Dubois',
    validatorRole: 'Marketing Manager',
    comments: 'Template validated according to 2024 guidelines',
    expiryDate: '06/18/2024',
    version: '2.1.0'
  };

  const history: HistoryItem[] = [
    { date: '03/18/2024', action: 'Template Validated', user: 'Marie D.', status: 'success' },
    { date: '03/17/2024', action: 'Content Modified', user: 'Thomas R.', status: 'info' },
    { date: '03/16/2024', action: 'Review Requested', user: 'Sophie M.', status: 'warning' },
    { date: '03/15/2024', action: 'Template Created', user: 'Sophie M.', status: 'success' }
  ];

  const getStatusConfig = (isActive: boolean) => {
    if (isActive) {
      return {
        color: 'text-green-700 dark:text-green-300',
        bgColor: 'bg-green-100 dark:bg-green-900/30',
        borderColor: 'border-green-200 dark:border-green-800',
        icon: CheckCircle,
        label: 'Active & Validated'
      };
    }
    return {
      color: 'text-gray-700 dark:text-gray-300',
      bgColor: 'bg-gray-100 dark:bg-gray-700',
      borderColor: 'border-gray-200 dark:border-gray-600',
      icon: XCircle,
      label: 'Inactive'
    };
  };

  const getHistoryIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      default:
        return <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    }
  };

  const statusConfig = getStatusConfig(status.isActive);
  const StatusIcon = statusConfig.icon;

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 border rounded-lg transition-colors ${statusConfig.bgColor} ${statusConfig.borderColor}`}>
            <ShieldCheck className={`w-5 h-5 transition-colors ${statusConfig.color}`} />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 transition-colors">
              Validation Status
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">
              Template compliance and approval information
            </p>
          </div>
        </div>
        
        {/* Mobile Toggle */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="sm:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          aria-label={showDetails ? "Hide validation details" : "Show validation details"}
        >
          <ChevronRight className={`w-5 h-5 transition-transform ${showDetails ? 'rotate-90' : ''}`} />
        </button>
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
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${statusConfig.bgColor} ${statusConfig.color} ${statusConfig.borderColor}`}>
                  <StatusIcon className="w-5 h-5 mr-2" />
                  {statusConfig.label}
                </div>
                {status.version && (
                  <div className="px-3 py-1 bg-indigo-100 dark:bg-teal-900/30 text-indigo-700 dark:text-teal-300 text-xs font-medium rounded-full border border-indigo-200 dark:border-teal-800 transition-colors">
                    v{status.version}
                  </div>
                )}
              </div>

              {/* Validation Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Last Validation */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg transition-colors">
                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1 transition-colors">
                      Last Validation
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors">
                      {formatDate(status.lastValidation)}
                    </div>
                  </div>
                </div>

                {/* Expiry Date */}
                {status.expiryDate && (
                  <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg transition-colors">
                      <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400 transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1 transition-colors">
                        Expiry Date
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors">
                        {formatDate(status.expiryDate)}
                      </div>
                    </div>
                  </div>
                )}

                {/* Validator */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg transition-colors">
                    <User className="w-5 h-5 text-purple-600 dark:text-purple-400 transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1 transition-colors">
                      {status.validator}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors">
                      {status.validatorRole}
                    </div>
                  </div>
                </div>

                {/* Compliance Status */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg transition-colors">
                    <FileCheck className="w-5 h-5 text-green-600 dark:text-green-400 transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1 transition-colors">
                      Compliance
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors">
                      2024 Guidelines
                    </div>
                  </div>
                </div>
              </div>

              {/* Validation Comments */}
              {status.comments && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg transition-colors">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0 transition-colors" />
                    <div>
                      <div className="font-semibold text-blue-900 dark:text-blue-200 mb-1 transition-colors">
                        Validation Note
                      </div>
                      <div className="text-sm text-blue-700 dark:text-blue-300 transition-colors">
                        {status.comments}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Validation History */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm dark:shadow-gray-900 transition-colors">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-t-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:ring-inset"
              >
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-gray-600 dark:text-gray-400 transition-colors" />
                  <span className="font-semibold text-gray-900 dark:text-gray-100 transition-colors">
                    Validation History
                  </span>
                  <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full transition-colors">
                    {history.length}
                  </span>
                </div>
                <ChevronRight className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform ${
                  showHistory ? 'rotate-90' : ''
                }`} />
              </button>

              <AnimatePresence>
                {showHistory && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-gray-200 dark:border-gray-700 transition-colors"
                  >
                    <div className="p-4">
                      <div className="space-y-4">
                        {history.map((item, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-start gap-4 relative"
                          >
                            {/* Timeline Line */}
                            {index < history.length - 1 && (
                              <div className="absolute left-[15px] top-10 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 transition-colors" />
                            )}

                            {/* Icon */}
                            <div className="relative z-10 p-2 bg-white dark:bg-gray-800 rounded-full border-2 border-gray-200 dark:border-gray-700 transition-colors">
                              {getHistoryIcon(item.status)}
                            </div>

                            {/* Content */}
                            <div className="flex-1 pt-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-gray-900 dark:text-gray-100 transition-colors">
                                  {item.action}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
                                  {item.date}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 transition-colors">
                                <User className="w-3 h-3" />
                                <span>{item.user}</span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-center shadow-sm dark:shadow-gray-900 transition-colors">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg inline-flex mb-2 transition-colors">
                  <ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-400 transition-colors" />
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors">
                  {status.isActive ? 'Valid' : 'Invalid'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
                  Status
                </p>
              </div>

              <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-center shadow-sm dark:shadow-gray-900 transition-colors">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg inline-flex mb-2 transition-colors">
                  <History className="w-4 h-4 text-blue-600 dark:text-blue-400 transition-colors" />
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors">
                  {history.length}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
                  History Items
                </p>
              </div>

              <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-center shadow-sm dark:shadow-gray-900 transition-colors">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg inline-flex mb-2 transition-colors">
                  <Badge className="w-4 h-4 text-purple-600 dark:text-purple-400 transition-colors" />
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors">
                  {status.version || '1.0'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
                  Version
                </p>
              </div>

              <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-center shadow-sm dark:shadow-gray-900 transition-colors">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg inline-flex mb-2 transition-colors">
                  <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400 transition-colors" />
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors">
                  90
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
                  Days Valid
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Action Button */}
      <div className="sm:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 shadow-lg dark:shadow-gray-900 transition-colors">
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className="w-full py-3 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm dark:shadow-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          {showHistory ? 'Hide History' : 'View Full History'}
        </button>
      </div>
    </div>
  );
}
