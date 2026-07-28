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
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-60 flex items-start justify-center overflow-y-auto p-2 sm:p-4 z-50">
      <div className="bg-white dark:bg-surface-container-high rounded-lg w-full max-w-[1200px] my-2 sm:my-4 relative shadow-2xl dark:shadow-gray-900 border border-border dark:border-border transition-colors">
        <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-border dark:border-border pb-3 sm:pb-4">
            <h2 className="text-lg sm:text-2xl font-bold text-foreground dark:text-foreground transition-colors">Create New Template</h2>
            <button
              onClick={onClose}
              className="text-muted-foreground dark:text-muted-foreground hover:text-on-surface dark:hover:text-muted-foreground hover:bg-surface-container-low dark:hover:bg-surface-container-highest p-1.5 sm:p-2 rounded-full transition-colors"
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
                <h3 className="text-lg font-semibold text-foreground dark:text-foreground transition-colors">Basic Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-on-surface dark:text-muted-foreground mb-1 transition-colors">
                      Template Name*
                    </label>
                    <input
                      type="text"
                      value={template.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ring dark:focus:ring-ring focus:border-primary-green dark:focus:border-teal-500 bg-white dark:bg-surface-container-highest text-foreground dark:text-foreground placeholder-gray-500 dark:placeholder-gray-400 transition-all ${
                        errors.name ? 'border-destructive dark:border-red-400' : 'border-border dark:border-border'
                      }`}
                      placeholder="Enter template name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-destructive dark:text-destructive">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-on-surface dark:text-muted-foreground mb-1 transition-colors">
                      Description*
                    </label>
                    <textarea
                      value={template.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ring dark:focus:ring-ring focus:border-primary-green dark:focus:border-teal-500 bg-white dark:bg-surface-container-highest text-foreground dark:text-foreground placeholder-gray-500 dark:placeholder-gray-400 transition-all ${
                        errors.description ? 'border-destructive dark:border-red-400' : 'border-border dark:border-border'
                      }`}
                      rows={3}
                      placeholder="Enter template description"
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-destructive dark:text-destructive">{errors.description}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-on-surface dark:text-muted-foreground mb-1 transition-colors">
                      Category*
                    </label>
                    <select
                      value={template.category}
                      onChange={(e) => handleInputChange('category', e.target.value as TemplateCategory)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ring dark:focus:ring-ring focus:border-primary-green dark:focus:border-teal-500 bg-white dark:bg-surface-container-highest text-foreground dark:text-foreground transition-all ${
                        errors.category ? 'border-destructive dark:border-red-400' : 'border-border dark:border-border'
                      }`}
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-destructive dark:text-destructive">{errors.category}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-on-surface dark:text-muted-foreground mb-1 transition-colors">
                      Tags
                    </label>
                    <input
                      type="text"
                      value={template.tags.join(', ')}
                      onChange={(e) => handleTagsChange(e.target.value)}
                      className="w-full px-3 py-2 border border-border dark:border-border rounded-lg focus:ring-2 focus:ring-ring dark:focus:ring-ring focus:border-primary-green dark:focus:border-teal-500 bg-white dark:bg-surface-container-highest text-foreground dark:text-foreground placeholder-gray-500 dark:placeholder-gray-400 transition-all"
                      placeholder="Enter tags separated by commas"
                    />
                    <p className="mt-1 text-xs text-muted-foreground dark:text-muted-foreground transition-colors">
                      Separate tags with commas (e.g., "sales, follow-up, important")
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4 sm:space-y-6">
              {/* Preview Section */}
              <div className="bg-surface-container-low dark:bg-surface-container-highest/50 p-4 rounded-lg border border-border dark:border-border transition-colors">
                <h3 className="text-lg font-semibold mb-3 text-foreground dark:text-foreground transition-colors">Preview</h3>
                <div className="space-y-2">
                  <p className="text-sm text-on-surface dark:text-muted-foreground transition-colors"><strong>Name:</strong> {template.name || 'Not set'}</p>
                  <p className="text-sm text-on-surface dark:text-muted-foreground transition-colors"><strong>Category:</strong> {template.category}</p>
                  <p className="text-sm text-on-surface dark:text-muted-foreground transition-colors"><strong>Status:</strong> {template.status}</p>
                  <p className="text-sm text-on-surface dark:text-muted-foreground transition-colors"><strong>Tags:</strong> {template.tags.join(', ') || 'No tags'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="sticky bottom-0 bg-white dark:bg-surface-container-high pt-3 sm:pt-4 mt-4 sm:mt-6 border-t border-border dark:border-border transition-colors">
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-on-surface dark:text-muted-foreground border border-border dark:border-border rounded-lg hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-primary dark:bg-teal-600 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-teal-700 transition-colors shadow-sm dark:shadow-gray-900"
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
