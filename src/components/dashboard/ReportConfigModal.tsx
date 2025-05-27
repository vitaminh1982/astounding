import React, { useState, useContext } from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { LanguageContext } from '../../context/LanguageContext';

interface ReportConfigModalProps {
  onClose: () => void;
  onSave: (config: ReportConfig) => void;
}

interface ReportConfig {
  name: string;
  type: string;
}

export default function ReportConfigModal({ onClose, onSave }: ReportConfigModalProps) {
  const { t } = useContext(LanguageContext);
  const [formData, setFormData] = useState<ReportConfig>({
    name: '',
    type: 'Active Agents'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSave(formData);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-lg p-6 mx-4 bg-white rounded-lg shadow-xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
        >
          <X className="h-6 w-6" />
        </button>

        <h3 className="text-lg font-medium text-gray-900 mb-6">
          {t('dashboard.reportConfig.title')}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              {t('dashboard.reportConfig.name')}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t('dashboard.reportConfig.placeholder.name')}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              {t('dashboard.reportConfig.type')}
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="Active Agents">Active Agents</option>
              <option value="Templates">Templates</option>
              <option value="Messages">Messages</option>
            </select>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              {t('dashboard.reportConfig.cancelButton')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              {t('dashboard.reportConfig.createButton')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
