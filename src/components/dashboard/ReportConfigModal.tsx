import React, { useState, useContext, useCallback, useEffect } from 'react';
import { X, FileText, TrendingUp, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageContext } from '../../context/LanguageContext';

interface ReportConfigModalProps {
  onClose: () => void;
  onSave: (config: ReportConfig) => void;
}

interface ReportConfig {
  name: string;
  type: string;
  description?: string;
}

const reportTypes = [
  {
    value: 'Active Agents',
    icon: TrendingUp,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/20',
    description: 'Overview of all active AI agents and their performance'
  },
  {
    value: 'Templates',
    icon: FileText,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    description: 'Analysis of template usage and effectiveness'
  },
  {
    value: 'Messages',
    icon: BarChart3,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    description: 'Detailed messaging statistics and trends'
  },
];

export default function ReportConfigModal({ onClose, onSave }: ReportConfigModalProps) {
  const { t } = useContext(LanguageContext);
  const [formData, setFormData] = useState<ReportConfig>({
    name: '',
    type: 'Active Agents',
    description: ''
  });
  const [errors, setErrors] = useState<{ name?: string }>({});
  const [selectedType, setSelectedType] = useState(reportTypes[0]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Update selected type when form type changes
  useEffect(() => {
    const type = reportTypes.find(t => t.value === formData.type);
    if (type) setSelectedType(type);
  }, [formData.type]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }, [errors]);

  const handleTypeSelect = useCallback((type: typeof reportTypes[0]) => {
    setFormData(prev => ({
      ...prev,
      type: type.value
    }));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors: { name?: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t('dashboard.reportConfig.errors.nameRequired') || 'Report name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = t('dashboard.reportConfig.errors.nameTooShort') || 'Name must be at least 3 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.name, t]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  }, [formData, validateForm, onSave, onClose]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: 'spring', duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: 20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="fixed inset-0 z-50 overflow-y-auto bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 transition-colors"
        onClick={handleBackdropClick}
      >
        <motion.div 
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 p-6">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {t('dashboard.reportConfig.title') || 'Create New Report'}
                </h3>
                <p className="text-sm text-white/80 mt-1">
                  {t('dashboard.reportConfig.subtitle') || 'Configure your custom report settings'}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Report Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                {t('dashboard.reportConfig.name') || 'Report Name'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t('dashboard.reportConfig.placeholder.name') || 'e.g., Monthly Performance Report'}
                className={`block w-full border rounded-lg shadow-sm py-2.5 px-4 
                  bg-white dark:bg-gray-900 
                  text-gray-900 dark:text-gray-100
                  placeholder-gray-400 dark:placeholder-gray-500
                  transition-colors duration-200
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent
                  ${errors.name 
                    ? 'border-red-300 dark:border-red-600' 
                    : 'border-gray-300 dark:border-gray-600'
                  }`}
                required
              />
              {errors.name && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                >
                  <span className="w-1 h-1 rounded-full bg-red-600 dark:bg-red-400" />
                  {errors.name}
                </motion.p>
              )}
            </div>

            {/* Report Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 transition-colors">
                {t('dashboard.reportConfig.type') || 'Report Type'} <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {reportTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = formData.type === type.value;
                  
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => handleTypeSelect(type)}
                      className={`relative p-4 rounded-lg border-2 transition-all duration-200 text-left
                        ${isSelected
                          ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 shadow-md'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm'
                        }`}
                    >
                      <div className={`${type.bgColor} w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors`}>
                        <Icon className={`h-5 w-5 ${type.color}`} />
                      </div>
                      <h4 className={`font-medium text-sm mb-1 transition-colors ${
                        isSelected 
                          ? 'text-indigo-900 dark:text-indigo-100' 
                          : 'text-gray-900 dark:text-gray-100'
                      }`}>
                        {type.value}
                      </h4>
                      <p className={`text-xs transition-colors ${
                        isSelected 
                          ? 'text-indigo-600 dark:text-indigo-300' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {type.description}
                      </p>
                      
                      {/* Selection indicator */}
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2 w-5 h-5 bg-indigo-500 dark:bg-indigo-400 rounded-full flex items-center justify-center"
                        >
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </motion.div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description (Optional) */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                {t('dashboard.reportConfig.description') || 'Description'} 
                <span className="text-gray-400 dark:text-gray-500 text-xs ml-1">
                  ({t('common.optional') || 'Optional'})
                </span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder={t('dashboard.reportConfig.placeholder.description') || 'Add a description for this report...'}
                className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm py-2.5 px-4 
                  bg-white dark:bg-gray-900 
                  text-gray-900 dark:text-gray-100
                  placeholder-gray-400 dark:placeholder-gray-500
                  transition-colors duration-200
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent
                  resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 transition-colors">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg 
                  text-gray-700 dark:text-gray-300 
                  bg-white dark:bg-gray-900 
                  hover:bg-gray-50 dark:hover:bg-gray-800 
                  transition-colors duration-200 font-medium"
              >
                {t('dashboard.reportConfig.cancelButton') || 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 
                  hover:from-indigo-700 hover:to-purple-700 
                  dark:from-indigo-500 dark:to-purple-500
                  dark:hover:from-indigo-600 dark:hover:to-purple-600
                  text-white rounded-lg 
                  transition-all duration-200 font-medium shadow-md hover:shadow-lg
                  disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!formData.name.trim()}
              >
                {t('dashboard.reportConfig.createButton') || 'Create Report'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
