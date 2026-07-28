import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { Template } from '../../../types/template';
import BasicInfo from './sections/BasicInfo';
import MessageConfig from './sections/MessageConfig';
import VariablesList from './sections/VariablesList';
import CustomizationOptions from './sections/CustomizationOptions';
import SharingSettings from './sections/SharingSettings';
import AutomationSettings from './sections/AutomationSettings';
import PreviewSection from './sections/PreviewSection';
import ValidationInfo from './sections/ValidationInfo';
import ActionButtons from './sections/ActionButtons';

interface TemplateEditorProps {
  template: Template;
  onClose: () => void;
  onSave: (template: Template) => void;
  onDelete?: () => void;
}

export default function TemplateEditor({ 
  template, 
  onClose, 
  onSave,
  onDelete 
}: TemplateEditorProps) {
  const [editedTemplate, setEditedTemplate] = useState<Template>(template);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showValidation, setShowValidation] = useState(false);

  // Track changes to determine if form is dirty
  useEffect(() => {
    const hasChanges = JSON.stringify(editedTemplate) !== JSON.stringify(template);
    setIsDirty(hasChanges);
  }, [editedTemplate, template]);

  // Handle section updates
  const handleSectionUpdate = (updates: Partial<Template>) => {
    setEditedTemplate(prev => ({
      ...prev,
      ...updates,
      lastModified: new Date().toISOString()
    }));
  };

  // Validate template before saving
  const validateTemplate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!editedTemplate.title?.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!editedTemplate.content?.trim()) {
      newErrors.content = 'Content is required';
    }

    if (!editedTemplate.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    setShowValidation(Object.keys(newErrors).length > 0);
    
    return Object.keys(newErrors).length === 0;
  };

  // Handle save action
  const handleSave = async () => {
    if (!validateTemplate()) {
      return;
    }

    setIsSaving(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onSave(editedTemplate);
      setIsDirty(false);
    } catch (error) {
      console.error('Error saving template:', error);
      setErrors(prev => ({
        ...prev,
        save: 'Failed to save template. Please try again.'
      }));
    } finally {
      setIsSaving(false);
    }
  };

  // Handle close with unsaved changes warning
  const handleClose = () => {
    if (isDirty) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + S to save
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      // Escape to close
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editedTemplate, isDirty]);

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="template-editor-title"
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-outline bg-opacity-75 dark:bg-background dark:bg-opacity-80 transition-opacity backdrop-blur-sm" 
          aria-hidden="true"
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white dark:bg-surface-container-high rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-[1200px]">
          
          {/* Header */}
          <div className="bg-white dark:bg-surface-container-high px-4 sm:px-6 py-3 sm:py-4 border-b border-border dark:border-border sticky top-0 z-10">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <h2 
                  id="template-editor-title"
                  className="text-lg sm:text-2xl font-bold text-foreground dark:text-foreground"
                >
                  Template Modification
                </h2>
                {isDirty && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100">
                    Unsaved changes
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {/* Save shortcut hint */}
                <span className="hidden md:inline-flex text-xs text-muted-foreground dark:text-muted-foreground mr-2">
                  <kbd className="px-2 py-1 bg-surface-container-low dark:bg-surface-container-highest border border-border dark:border-border rounded">
                    {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}+S
                  </kbd>
                  <span className="ml-1">to save</span>
                </span>

                <button 
                  onClick={handleClose}
                  className="text-outline dark:text-muted-foreground hover:text-muted-foreground dark:hover:text-outline hover:bg-surface-container-low dark:hover:bg-surface-container-highest p-1.5 sm:p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring dark:focus:ring-ring dark:focus:ring-offset-gray-800"
                  aria-label="Close editor"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>
            </div>

            {/* Error banner */}
            {showValidation && Object.keys(errors).length > 0 && (
              <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-destructive flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                      Please fix the following errors:
                    </h3>
                    <ul className="mt-1 text-sm text-red-700 dark:text-red-300 list-disc list-inside">
                      {Object.entries(errors).map(([field, error]) => (
                        <li key={field}>{error}</li>
                      ))}
                    </ul>
                  </div>
                  <button
                    onClick={() => setShowValidation(false)}
                    className="text-destructive hover:text-red-600 dark:text-destructive dark:hover:text-red-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
            <div className="p-3 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                
                {/* Left Column (spans 2 columns on desktop) */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                  <div className="bg-white dark:bg-surface-container-high rounded-lg border border-border dark:border-border p-4 sm:p-6">
                    <BasicInfo 
                      template={editedTemplate} 
                      onUpdate={handleSectionUpdate}
                      isEditable={!isSaving}
                    />
                  </div>

                  <div className="bg-white dark:bg-surface-container-high rounded-lg border border-border dark:border-border p-4 sm:p-6">
                    <MessageConfig 
                      template={editedTemplate}
                      onUpdate={handleSectionUpdate}
                      isEditable={!isSaving}
                    />
                  </div>

                  <div className="bg-white dark:bg-surface-container-high rounded-lg border border-border dark:border-border p-4 sm:p-6">
                    <CustomizationOptions 
                      template={editedTemplate}
                      onUpdate={handleSectionUpdate}
                      isEditable={!isSaving}
                    />
                  </div>

                  <div className="bg-white dark:bg-surface-container-high rounded-lg border border-border dark:border-border p-4 sm:p-6">
                    <AutomationSettings 
                      template={editedTemplate}
                      onUpdate={handleSectionUpdate}
                      isEditable={!isSaving}
                    />
                  </div>
                </div>
                
                {/* Right Column */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-white dark:bg-surface-container-high rounded-lg border border-border dark:border-border p-4 sm:p-6">
                    <VariablesList />
                  </div>

                  <div className="bg-white dark:bg-surface-container-high rounded-lg border border-border dark:border-border p-4 sm:p-6">
                    <SharingSettings 
                      template={editedTemplate}
                      onUpdate={handleSectionUpdate}
                      isEditable={!isSaving}
                    />
                  </div>

                  <div className="bg-white dark:bg-surface-container-high rounded-lg border border-border dark:border-border p-4 sm:p-6">
                    <PreviewSection template={editedTemplate} />
                  </div>

                  <div className="bg-white dark:bg-surface-container-high rounded-lg border border-border dark:border-border p-4 sm:p-6">
                    <ValidationInfo template={editedTemplate} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Fixed at bottom */}
          <div className="sticky bottom-0 bg-white dark:bg-surface-container-high px-4 sm:px-6 py-3 sm:py-4 border-t border-border dark:border-border shadow-lg">
            <ActionButtons 
              template={editedTemplate}
              onSave={handleSave}
              onClose={handleClose}
              onDelete={onDelete}
              isSaving={isSaving}
              isDirty={isDirty}
              hasErrors={Object.keys(errors).length > 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
