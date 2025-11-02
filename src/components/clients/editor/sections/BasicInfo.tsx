import React, { useState, useEffect } from 'react';
import { Client } from '../../../../types/client';
import { User, Mail, Phone, Activity, FileText, Calendar, AlertCircle, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface BasicInfoProps {
  client: Client;
  onChange: (updatedData: Partial<Client>) => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  status: string;
  notes: string;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
}

export default function BasicInfo({ client, onChange }: BasicInfoProps) {
  const [formData, setFormData] = useState<FormData>({
    name: client.name,
    email: client.email,
    phone: client.phone || '',
    status: client.status,
    notes: client.notes || ''
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Track changes
  useEffect(() => {
    const hasChanged = 
      formData.name !== client.name ||
      formData.email !== client.email ||
      formData.phone !== (client.phone || '') ||
      formData.status !== client.status ||
      formData.notes !== (client.notes || '');
    
    setHasChanges(hasChanged);
  }, [formData, client]);

  const validateField = (name: keyof FormData, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        if (value.trim().length > 50) return 'Name must be less than 50 characters';
        break;
      
      case 'email':
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        break;
      
      case 'phone':
        if (value && value.length > 0) {
          const phoneRegex = /^[\+]?[1-9][\d\s\-\(\)]{7,}$/;
          if (!phoneRegex.test(value)) return 'Please enter a valid phone number';
        }
        break;
    }
    return undefined;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof FormData;
    
    // Update form data
    const updatedFormData = { ...formData, [fieldName]: value };
    setFormData(updatedFormData);
    
    // Clear field-specific error
    if (errors[fieldName as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [fieldName]: undefined }));
    }
    
    // Validate field
    const error = validateField(fieldName, value);
    if (error) {
      setErrors(prev => ({ ...prev, [fieldName]: error }));
    }
    
    // Call onChange with updated data
    onChange({
      [fieldName]: value
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800';
      case 'inactive':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600';
    }
  };

  const formatRegistrationDate = (dateString: string) => {
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
          <div className="p-2 bg-blue-100 dark:bg-teal-900/30 border border-blue-200 dark:border-teal-800 rounded-lg transition-colors">
            <User className="w-5 h-5 text-blue-600 dark:text-teal-400 transition-colors" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 transition-colors">
              Basic Information
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">
              Essential client details and contact information
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
      
      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
            Full Name *
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 shadow-sm dark:shadow-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                errors.name
                  ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500 dark:focus:ring-red-400'
                  : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-teal-500 focus:ring-blue-500 dark:focus:ring-teal-500'
              }`}
              placeholder="Enter client's full name"
              maxLength={50}
            />
            {!errors.name && formData.name && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 dark:text-green-400">
                <Check className="w-4 h-4" />
              </div>
            )}
          </div>
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1 transition-colors">
              <AlertCircle className="w-3 h-3" />
              {errors.name}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 transition-colors">
            {formData.name.length}/50 characters
          </p>
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
            Email Address *
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 shadow-sm dark:shadow-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                errors.email
                  ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500 dark:focus:ring-red-400'
                  : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-teal-500 focus:ring-blue-500 dark:focus:ring-teal-500'
              }`}
              placeholder="client@example.com"
            />
            {!errors.email && formData.email && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 dark:text-green-400">
                <Check className="w-4 h-4" />
              </div>
            )}
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1 transition-colors">
              <AlertCircle className="w-3 h-3" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
            Phone Number
            <span className="text-gray-500 dark:text-gray-400 font-normal ml-1">(Optional)</span>
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
              <Phone className="w-4 h-4" />
            </div>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 shadow-sm dark:shadow-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                errors.phone
                  ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500 dark:focus:ring-red-400'
                  : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-teal-500 focus:ring-blue-500 dark:focus:ring-teal-500'
              }`}
              placeholder="+1 (555) 123-4567"
            />
            {!errors.phone && formData.phone && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 dark:text-green-400">
                <Check className="w-4 h-4" />
              </div>
            )}
          </div>
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1 transition-colors">
              <AlertCircle className="w-3 h-3" />
              {errors.phone}
            </p>
          )}
        </div>

        {/* Status Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
            Client Status
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
              <Activity className="w-4 h-4" />
            </div>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm dark:shadow-gray-900 focus:border-blue-500 dark:focus:border-teal-500 focus:ring-blue-500 dark:focus:ring-teal-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 appearance-none"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
            {/* Custom dropdown arrow */}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors ${getStatusColor(formData.status)}`}>
              <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                formData.status === 'active' 
                  ? 'bg-green-600 dark:bg-green-400' 
                  : 'bg-red-600 dark:bg-red-400'
              }`} />
              {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Notes Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
          Internal Notes
        </label>
        <div className="relative">
          <div className="absolute left-3 top-3 text-gray-400 dark:text-gray-500">
            <FileText className="w-4 h-4" />
          </div>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 shadow-sm dark:shadow-gray-900 focus:border-blue-500 dark:focus:border-teal-500 focus:ring-blue-500 dark:focus:ring-teal-500 transition-colors resize-none focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            placeholder="Add any internal notes about this client..."
            maxLength={500}
          />
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 transition-colors">
          {formData.notes.length}/500 characters
        </p>
      </div>

      {/* Registration Information */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400 transition-colors" />
          <h4 className="font-medium text-gray-900 dark:text-gray-100 transition-colors">
            Registration Information
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400 transition-colors">Registration Date:</span>
            <p className="font-medium text-gray-900 dark:text-gray-100 transition-colors">
              {formatRegistrationDate(client.registrationDate)}
            </p>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400 transition-colors">Client ID:</span>
            <p className="font-mono text-xs font-medium text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded transition-colors">
              {client.id}
            </p>
          </div>
        </div>
      </div>

      {/* Validation Summary */}
      {Object.keys(errors).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg transition-colors"
        >
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0 transition-colors" />
            <div>
              <h4 className="text-sm font-medium text-red-800 dark:text-red-200 transition-colors">
                Please fix the following errors:
              </h4>
              <ul className="mt-1 text-sm text-red-600 dark:text-red-400 space-y-1 transition-colors">
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
