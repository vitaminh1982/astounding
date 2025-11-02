import React, { useState } from 'react';
import { Client } from '../../../../types/client';
import { Plus, Trash2, User, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PersonalizationProps {
  client: Client;
  onChange?: (customFields: Record<string, string>) => void;
}

export default function Personalization({ client, onChange }: PersonalizationProps) {
  const [customFields, setCustomFields] = useState<Record<string, string>>({
    birthday: '1990-01-01',
    company: 'Acme Inc',
    jobTitle: 'Manager'
  });

  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldValue, setNewFieldValue] = useState('');
  const [errors, setErrors] = useState<{ name?: string; value?: string }>({});

  const handleFieldChange = (field: string, value: string) => {
    const updatedFields = {
      ...customFields,
      [field]: value
    };
    setCustomFields(updatedFields);
    onChange?.(updatedFields);
  };

  const handleFieldRemove = (field: string) => {
    const newCustomFields = { ...customFields };
    delete newCustomFields[field];
    setCustomFields(newCustomFields);
    onChange?.(newCustomFields);
  };

  const validateNewField = () => {
    const newErrors: { name?: string; value?: string } = {};

    if (!newFieldName.trim()) {
      newErrors.name = 'Field name is required';
    } else if (newFieldName.trim().length < 2) {
      newErrors.name = 'Field name must be at least 2 characters';
    } else if (customFields.hasOwnProperty(newFieldName.trim())) {
      newErrors.name = 'Field name already exists';
    }

    if (!newFieldValue.trim()) {
      newErrors.value = 'Field value is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddField = () => {
    if (validateNewField()) {
      const fieldName = newFieldName.trim();
      const fieldValue = newFieldValue.trim();
      
      const updatedFields = {
        ...customFields,
        [fieldName]: fieldValue
      };
      
      setCustomFields(updatedFields);
      onChange?.(updatedFields);
      setNewFieldName('');
      setNewFieldValue('');
      setErrors({});
    }
  };

  const formatFieldLabel = (field: string) => {
    return field.replace(/([A-Z])/g, ' $1')
                .replace(/^./, str => str.toUpperCase())
                .trim();
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-lg transition-colors">
          <User className="w-5 h-5 text-purple-600 dark:text-purple-400 transition-colors" />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 transition-colors">
            Client Customization
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">
            Add custom fields to personalize client information
          </p>
        </div>
      </div>
      
      {/* Existing Custom Fields */}
      {Object.keys(customFields).length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2 transition-colors">
            <Tag className="w-4 h-4" />
            Custom Fields ({Object.keys(customFields).length})
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {Object.entries(customFields).map(([field, value]) => (
                <motion.div
                  key={field}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm dark:shadow-gray-900 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize transition-colors">
                      {formatFieldLabel(field)}
                    </label>
                    <button
                      onClick={() => handleFieldRemove(field)}
                      className="p-1 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                      aria-label={`Remove ${formatFieldLabel(field)} field`}
                      title="Remove field"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleFieldChange(field, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500 dark:focus:ring-purple-400 shadow-sm dark:shadow-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    placeholder={`Enter ${formatFieldLabel(field).toLowerCase()}`}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Add New Field */}
      <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" />
          Add Custom Field
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
              Field Name *
            </label>
            <input
              type="text"
              value={newFieldName}
              onChange={(e) => {
                setNewFieldName(e.target.value);
                if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
              }}
              onKeyPress={(e) => handleKeyPress(e, handleAddField)}
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 shadow-sm dark:shadow-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                errors.name
                  ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500 dark:focus:ring-red-400'
                  : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-teal-500 focus:ring-indigo-500 dark:focus:ring-teal-500'
              }`}
              placeholder="e.g., Department, Hobby, Notes"
              maxLength={50}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 transition-colors">
                {errors.name}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 transition-colors">
              {newFieldName.length}/50 characters
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
              Field Value *
            </label>
            <input
              type="text"
              value={newFieldValue}
              onChange={(e) => {
                setNewFieldValue(e.target.value);
                if (errors.value) setErrors(prev => ({ ...prev, value: undefined }));
              }}
              onKeyPress={(e) => handleKeyPress(e, handleAddField)}
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 shadow-sm dark:shadow-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                errors.value
                  ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500 dark:focus:ring-red-400'
                  : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-teal-500 focus:ring-indigo-500 dark:focus:ring-teal-500'
              }`}
              placeholder="Enter the field value"
              maxLength={200}
            />
            {errors.value && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 transition-colors">
                {errors.value}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 transition-colors">
              {newFieldValue.length}/200 characters
            </p>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={handleAddField}
            disabled={!newFieldName.trim() || !newFieldValue.trim()}
            className="px-4 py-2 bg-indigo-600 dark:bg-teal-600 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm dark:shadow-gray-900 hover:shadow-md dark:hover:shadow-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 font-medium"
            aria-label="Add new custom field"
          >
            <Plus className="w-4 h-4" />
            Add Field
          </button>
        </div>
      </div>

      {/* Help Text */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg transition-colors">
        <div className="flex items-start gap-2">
          <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded">
            <Tag className="w-3 h-3 text-blue-600 dark:text-blue-400 transition-colors" />
          </div>
          <div className="text-sm text-blue-700 dark:text-blue-300 transition-colors">
            <p className="font-medium mb-1">Custom Field Tips:</p>
            <ul className="space-y-1 text-xs">
              <li>• Use custom fields to store additional client information</li>
              <li>• Field names should be descriptive and unique</li>
              <li>• You can add up to 20 custom fields per client</li>
              <li>• Press Enter in either field to quickly add the custom field</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
