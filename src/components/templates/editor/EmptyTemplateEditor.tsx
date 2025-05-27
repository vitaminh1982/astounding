import React, { useState } from 'react';
import { Template, TemplateCategory, TemplateStatus } from '../../../types/template';
import { X } from 'lucide-react';

interface EmptyTemplateEditorProps {
  onClose: () => void;
  onSave: (template: Template) => void;
}

const initialEmptyTemplate: Template = {
  id: 0, // Will be assigned by backend
  name: '',
  description: '',
  category: 'custom',
  status: 'draft',
  tags: [],
  lastModified: new Date().toISOString(),
  usage: 0,
  favorite: false,
};

export default function EmptyTemplateEditor({ onClose, onSave }: EmptyTemplateEditorProps) {
  const [template, setTemplate] = useState<Template>(initialEmptyTemplate);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories: TemplateCategory[] = ['email', 'whatsapp', 'chat', 'notification', 'custom', 'client'];

  const handleInputChange = (field: keyof Template, value: any) => {
    setTemplate(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleTagsChange = (tagsString: string) => {
    const newTags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    handleInputChange('tags', newTags);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!template.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!template.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!template.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave({
        ...template,
        lastModified: new Date().toISOString()
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center overflow-y-auto p-2 sm:p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-[1200px] my-2 sm:my-4 relative">
        <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 shadow-xl">
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-3 sm:pb-4">
            <h2 className="text-lg sm:text-2xl font-bold">Create New Template</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1.5 sm:p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Template Name*
                    </label>
                    <input
                      type="text"
                      value={template.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter template name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description*
                    </label>
                    <textarea
                      value={template.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        errors.description ? 'border-red-500' : 'border-gray-300'
                      }`}
                      rows={3}
                      placeholder="Enter template description"
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category*
                    </label>
                    <select
                      value={template.category}
                      onChange={(e) => handleInputChange('category', e.target.value as TemplateCategory)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        errors.category ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-500">{errors.category}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tags
                    </label>
                    <input
                      type="text"
                      value={template.tags.join(', ')}
                      onChange={(e) => handleTagsChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter tags separated by commas"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Separate tags with commas (e.g., "sales, follow-up, important")
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4 sm:space-y-6">
              {/* Preview Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Preview</h3>
                <div className="space-y-2">
                  <p className="text-sm"><strong>Name:</strong> {template.name || 'Not set'}</p>
                  <p className="text-sm"><strong>Category:</strong> {template.category}</p>
                  <p className="text-sm"><strong>Status:</strong> {template.status}</p>
                  <p className="text-sm"><strong>Tags:</strong> {template.tags.join(', ') || 'No tags'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="sticky bottom-0 bg-white pt-3 sm:pt-4 mt-4 sm:mt-6 border-t">
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Create Template
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
