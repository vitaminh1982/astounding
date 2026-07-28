import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Save, Trash2, Eye, EyeOff, Tag } from 'lucide-react';
import { Prompt } from '../../types/prompt';

interface PromptModalProps {
  type: 'edit' | 'delete' | 'use' | 'create';
  prompt?: Prompt | null;
  onClose: () => void;
  onSave?: (updatedPrompt: Prompt) => void;
  onDelete?: () => void;
  onCopy?: (content: string) => void;
}

export default function PromptModal({
  type,
  prompt,
  onClose,
  onSave,
  onDelete,
  onCopy
}: PromptModalProps) {
  // Initialize with empty prompt if creating new, or the provided prompt if editing
  const [editedPrompt, setEditedPrompt] = useState<Prompt>(
    prompt || {
      id: `prompt-${Date.now()}`,
      title: '',
      description: '',
      category: 'custom',
      status: 'draft',
      content: '',
      tags: [],
      lastModified: new Date().toISOString(),
      usageCount: 0,
      isFavorite: false,
      author: 'You'
    }
  );
  
  // State for UI controls
  const [isCopied, setIsCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private'>(
    prompt?.status === 'published' ? 'public' : 'private'
  );
  
  // Character limits
  const TITLE_MAX_LENGTH = 100;
  const DESCRIPTION_MAX_LENGTH = 500;
  
  // Update isDirty when form changes
  useEffect(() => {
    if (type === 'edit' || type === 'create') {
      setIsDirty(true);
    }
  }, [editedPrompt, visibility]);
  
  // Handler for input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    setEditedPrompt(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handler for tags changes
  const handleAddTag = () => {
    if (newTag.trim() && !editedPrompt.tags.includes(newTag.trim())) {
      setEditedPrompt(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setEditedPrompt(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };
  
  // Handler for save button
  const handleSave = (e: React.FormEvent, saveAsDraft = false) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!editedPrompt.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (editedPrompt.title.length > TITLE_MAX_LENGTH) {
      newErrors.title = `Title must be ${TITLE_MAX_LENGTH} characters or less`;
    }
    
    if (editedPrompt.description.length > DESCRIPTION_MAX_LENGTH) {
      newErrors.description = `Description must be ${DESCRIPTION_MAX_LENGTH} characters or less`;
    }
    
    if (!editedPrompt.content.trim()) {
      newErrors.content = 'Prompt content is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Update status based on save type
    const finalPrompt = {
      ...editedPrompt,
      status: saveAsDraft ? 'draft' : 'published',
      lastModified: new Date().toISOString()
    };
    
    if (onSave) {
      onSave(finalPrompt);
    }
  };
  
  // Handler for copy button
  const handleCopy = () => {
    if (onCopy && prompt) {
      onCopy(prompt.content);
    }
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  // Handler for key press in tag input
  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  // Render different modal content based on type
  const renderModalContent = () => {
    switch (type) {
      case 'create':
      case 'edit':
        return (
          <div className="flex flex-col md:flex-row h-full">
            {/* Left Panel - Form */}
            <div className={`flex-1 overflow-y-auto p-4 ${showPreview ? 'md:w-1/2' : 'w-full'}`}>
              <form onSubmit={(e) => handleSave(e, false)} className="space-y-4">
                <div>
                  <div className="flex justify-between items-center">
                    <label htmlFor="title" className="block text-sm font-medium text-on-surface dark:text-on-surface-variant">
                      Title <span className="text-destructive">*</span>
                    </label>
                    <span className={`text-xs ${
                      editedPrompt.title.length > TITLE_MAX_LENGTH 
                        ? 'text-destructive dark:text-destructive' 
                        : 'text-muted-foreground dark:text-muted-foreground'
                    }`}>
                      {editedPrompt.title.length}/{TITLE_MAX_LENGTH}
                    </span>
                  </div>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={editedPrompt.title}
                    onChange={handleInputChange}
                    className={`mt-1 w-full px-3 py-2 border ${
                      errors.title 
                        ? 'border-destructive dark:border-red-400' 
                        : 'border-border dark:border-border'
                    } rounded-md shadow-sm bg-white dark:bg-surface-container-highest text-foreground dark:text-foreground placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-ring focus:border-primary-green dark:focus:ring-ring dark:focus:border-green-500 sm:text-sm`}
                    required
                    maxLength={TITLE_MAX_LENGTH}
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-destructive dark:text-destructive">{errors.title}</p>
                  )}
                </div>
                
                <div>
                  <div className="flex justify-between items-center">
                    <label htmlFor="description" className="block text-sm font-medium text-on-surface dark:text-on-surface-variant">
                      Description
                    </label>
                    <span className={`text-xs ${
                      editedPrompt.description.length > DESCRIPTION_MAX_LENGTH 
                        ? 'text-destructive dark:text-destructive' 
                        : 'text-muted-foreground dark:text-muted-foreground'
                    }`}>
                      {editedPrompt.description.length}/{DESCRIPTION_MAX_LENGTH}
                    </span>
                  </div>
                  <textarea
                    id="description"
                    name="description"
                    value={editedPrompt.description}
                    onChange={handleInputChange}
                    rows={2}
                    className={`mt-1 w-full px-3 py-2 border ${
                      errors.description 
                        ? 'border-destructive dark:border-red-400' 
                        : 'border-border dark:border-border'
                    } rounded-md shadow-sm bg-white dark:bg-surface-container-highest text-foreground dark:text-foreground placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-ring focus:border-primary-green dark:focus:ring-ring dark:focus:border-green-500 sm:text-sm`}
                    maxLength={DESCRIPTION_MAX_LENGTH}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-destructive dark:text-destructive">{errors.description}</p>
                  )}
                </div>
                
                <div>
                  <div className="flex justify-between items-center">
                    <label htmlFor="content" className="block text-sm font-medium text-on-surface dark:text-on-surface-variant">
                      Prompt Content <span className="text-destructive">*</span>
                    </label>
                  </div>
                  <textarea
                    id="content"
                    name="content"
                    value={editedPrompt.content}
                    onChange={handleInputChange}
                    rows={8}
                    className={`mt-1 w-full px-3 py-2 border ${
                      errors.content 
                        ? 'border-destructive dark:border-red-400' 
                        : 'border-border dark:border-border'
                    } rounded-md shadow-sm bg-white dark:bg-surface-container-highest text-foreground dark:text-foreground placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-ring focus:border-primary-green dark:focus:ring-ring dark:focus:border-green-500 sm:text-sm font-mono`}
                    required
                  />
                  {errors.content && (
                    <p className="mt-1 text-sm text-destructive dark:text-destructive">{errors.content}</p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground dark:text-muted-foreground">
                    Use {'{placeholders}'} for variables that users will replace.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-on-surface dark:text-on-surface-variant mb-1">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={editedPrompt.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border dark:border-border rounded-md shadow-sm bg-white dark:bg-surface-container-highest text-foreground dark:text-foreground focus:outline-none focus:ring-ring focus:border-primary-green dark:focus:ring-ring dark:focus:border-green-500 sm:text-sm"
                    >
                      <option value="marketing">Marketing</option>
                      <option value="content_creation">Content Creation</option>
                      <option value="development">Development</option>
                      <option value="support">Support</option>
                      <option value="hr">HR</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-on-surface dark:text-on-surface-variant mb-1">
                      Visibility
                    </label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio h-4 w-4 text-primary-green dark:text-primary-green bg-white dark:bg-surface-container-highest border-border dark:border-border focus:ring-ring dark:focus:ring-ring"
                          checked={visibility === 'private'}
                          onChange={() => setVisibility('private')}
                        />
                        <span className="ml-2 text-sm text-on-surface dark:text-on-surface-variant">Private</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio h-4 w-4 text-primary-green dark:text-primary-green bg-white dark:bg-surface-container-highest border-border dark:border-border focus:ring-ring dark:focus:ring-ring"
                          checked={visibility === 'public'}
                          onChange={() => setVisibility('public')}
                        />
                        <span className="ml-2 text-sm text-on-surface dark:text-on-surface-variant">Public</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-on-surface dark:text-on-surface-variant mb-1">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {editedPrompt.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-green-900 text-indigo-800 dark:text-green-100"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-primary-green dark:text-green-300 hover:text-primary-green dark:hover:text-green-100 focus:outline-none"
                        >
                          <span className="sr-only">Remove tag</span>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={handleTagKeyPress}
                      placeholder="Add a tag"
                      className="flex-1 px-3 py-2 border border-border dark:border-border rounded-l-md shadow-sm bg-white dark:bg-surface-container-highest text-foreground dark:text-foreground placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-ring focus:border-primary-green dark:focus:ring-ring dark:focus:border-green-500 sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="inline-flex items-center px-3 py-2 border border-l-0 border-border dark:border-border rounded-r-md bg-surface-container-low dark:bg-surface-container-highest text-on-surface dark:text-on-surface-variant sm:text-sm hover:bg-surface-container-low dark:hover:bg-outline transition-colors"
                    >
                      <Tag className="h-4 w-4 mr-1" />
                      Add
                    </button>
                  </div>
                </div>
              </form>
            </div>
            
            {/* Right Panel - Preview */}
            {showPreview && (
              <div className="flex-1 md:w-1/2 border-t md:border-t-0 md:border-l border-border dark:border-border p-4 bg-surface-container-low dark:bg-surface-container-high overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-foreground dark:text-foreground">Preview</h3>
                </div>
                
                <div className="bg-white dark:bg-surface-container-highest rounded-lg shadow p-4 mb-4">
                  <div className="bg-indigo-50 dark:bg-green-900 px-4 py-1.5 border-b border-indigo-100 dark:border-green-800 flex justify-between items-center rounded-t-lg">
                    <span className="text-xs font-semibold text-indigo-700 dark:text-green-100 uppercase tracking-wider">
                      {editedPrompt.category.replace('_', ' ')}
                    </span>
                    <span className={`p-1 rounded-full ${
                      editedPrompt.isFavorite ? 'text-yellow-500' : 'text-outline dark:text-muted-foreground'
                    }`}>
                      <svg className="h-4 w-4" fill={editedPrompt.isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </span>
                  </div>
                  
                  <div className="p-4">
                    <div className="inline-block px-2 py-1 rounded-full bg-surface-container-low dark:bg-surface-container-highest text-xs text-muted-foreground dark:text-muted-foreground mb-2">
                      {`Used ${editedPrompt.usageCount} times`}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-foreground dark:text-foreground mb-2 line-clamp-2">
                      {editedPrompt.title || 'Untitled Prompt'}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground dark:text-muted-foreground mb-3 line-clamp-2">
                      {editedPrompt.description || 'No description provided.'}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {editedPrompt.tags.slice(0, 3).map((tag, index) => (
                        <span 
                          key={index} 
                          className="px-2 py-1 rounded-md bg-surface-container-low dark:bg-surface-container-highest text-xs text-on-surface dark:text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                      {editedPrompt.tags.length > 3 && (
                        <span className="px-2 py-1 rounded-md bg-surface-container-low dark:bg-surface-container-highest text-xs text-on-surface dark:text-muted-foreground">
                          +{editedPrompt.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-surface-container-highest rounded-lg shadow p-4">
                  <h4 className="text-sm font-medium text-on-surface dark:text-on-surface-variant mb-2">Prompt Content Preview</h4>
                  <div className="bg-surface-container-low dark:bg-surface-container-high p-3 rounded border border-border dark:border-border">
                    <pre className="text-sm text-on-surface dark:text-muted-foreground whitespace-pre-wrap font-mono">
                      {editedPrompt.content || 'No content yet.'}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
        
      case 'delete':
        return (
          <div className="text-center p-6">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 mb-4">
              <Trash2 className="h-6 w-6 text-red-600 dark:text-destructive" />
            </div>
            <h3 className="text-lg font-medium text-foreground dark:text-foreground mb-2">Delete Prompt</h3>
            <p className="text-sm text-muted-foreground dark:text-muted-foreground mb-6">
              Are you sure you want to delete the prompt "{prompt?.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-border dark:border-border rounded-md text-sm font-medium text-on-surface dark:text-on-surface-variant bg-white dark:bg-surface-container-highest hover:bg-surface-container-low dark:hover:bg-surface-container-highest focus:outline-none focus:ring-2 focus:ring-ring dark:focus:ring-ring transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-md text-sm font-medium hover:bg-red-700 dark:hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        );
        
      case 'use':
        return (
          <div className="p-6 space-y-4">
            <div>
              <h3 className="text-lg font-medium text-foreground dark:text-foreground mb-2">{prompt?.title}</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 rounded-full text-xs bg-indigo-100 dark:bg-green-900 text-indigo-800 dark:text-green-100">
                  {prompt?.category.replace('_', ' ')}
                </span>
                {prompt?.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 rounded-full text-xs bg-surface-container-low dark:bg-surface-container-highest text-on-surface dark:text-on-surface-variant">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground mb-4">{prompt?.description}</p>
            </div>
            
            <div className="bg-surface-container-low dark:bg-surface-container-high p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium text-on-surface dark:text-on-surface-variant">Prompt Content</h4>
                <button
                  onClick={handleCopy}
                  className="flex items-center text-sm text-primary-green dark:text-green-400 hover:text-indigo-800 dark:hover:text-green-300 px-2 py-1 rounded hover:bg-indigo-50 dark:hover:bg-green-900 transition-colors"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <pre className="text-sm text-on-surface dark:text-muted-foreground whitespace-pre-wrap bg-white dark:bg-surface-container-highest p-3 rounded border border-border dark:border-border font-mono">
                {prompt?.content}
              </pre>
            </div>
            
            <div className="pt-4">
              <h4 className="text-sm font-medium text-on-surface dark:text-on-surface-variant mb-2">Usage Instructions</h4>
              <ol className="list-decimal list-inside text-sm text-muted-foreground dark:text-muted-foreground space-y-1">
                <li>Copy the prompt using the button above</li>
                <li>Paste it into your AI tool of choice</li>
                <li>Customize any placeholders in {'{curly braces}'} with your specific details</li>
                <li>Submit to the AI and review the response</li>
              </ol>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // Render modal footer based on type
  const renderModalFooter = () => {
    switch (type) {
      case 'create':
      case 'edit':
        return (
          <div className="flex justify-between items-center px-6 py-4 bg-surface-container-low dark:bg-surface-container-high border-t border-border dark:border-border">
            <div className="flex items-center">
              {type === 'edit' && onDelete && (
                <button
                  type="button"
                  onClick={() => {
                    if (onDelete) onDelete();
                  }}
                  className="flex items-center px-3 py-2 text-sm font-medium text-red-700 dark:text-destructive hover:text-red-800 dark:hover:text-red-300 focus:outline-none transition-colors"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </button>
              )}
              
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center ml-4 px-3 py-2 text-sm font-medium text-on-surface dark:text-on-surface-variant hover:text-on-surface dark:hover:text-foreground focus:outline-none transition-colors"
              >
                {showPreview ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-1" />
                    Hide Preview
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-1" />
                    Show Preview
                  </>
                )}
              </button>
            </div>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-border dark:border-border rounded-md text-sm font-medium text-on-surface dark:text-on-surface-variant bg-white dark:bg-surface-container-highest hover:bg-surface-container-low dark:hover:bg-surface-container-highest focus:outline-none focus:ring-2 focus:ring-ring dark:focus:ring-ring transition-colors"
              >
                Cancel
              </button>
              
              <button
                type="button"
                onClick={(e) => handleSave(e, true)}
                className="px-4 py-2 border border-border dark:border-border bg-white dark:bg-surface-container-highest rounded-md text-sm font-medium text-on-surface dark:text-on-surface-variant hover:bg-surface-container-low dark:hover:bg-surface-container-highest focus:outline-none focus:ring-2 focus:ring-ring dark:focus:ring-ring transition-colors"
              >
                Save as Draft
              </button>
              
              <button
                type="button"
                onClick={(e) => handleSave(e, false)}
                className="px-4 py-2 bg-primary dark:bg-green-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 dark:hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-ring dark:focus:ring-ring transition-colors"
              >
                {visibility === 'public' ? 'Publish' : 'Save'}
              </button>
            </div>
          </div>
        );
        
      case 'use':
        return (
          <div className="flex justify-end px-6 py-4 bg-surface-container-low dark:bg-surface-container-high border-t border-border dark:border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-primary dark:bg-green-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 dark:hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-ring dark:focus:ring-ring transition-colors"
            >
              Close
            </button>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // Warn user about unsaved changes
  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if clicking directly on the backdrop
    if (e.target === e.currentTarget) {
      if (isDirty && (type === 'edit' || type === 'create')) {
        if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
          onClose();
        }
      } else {
        onClose();
      }
    }
  };
  
  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto" 
      aria-labelledby="modal-title" 
      role="dialog" 
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-outline bg-opacity-75 dark:bg-background dark:bg-opacity-80 transition-opacity" 
          aria-hidden="true"
        ></div>

        {/* Modal panel */}
        <div className={`inline-block align-bottom bg-white dark:bg-surface-container-high rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle ${
          type === 'delete' ? 'sm:max-w-lg' : 'sm:max-w-5xl'
        } sm:w-full`}>
          {/* Modal header */}
          <div className="bg-white dark:bg-surface-container-high px-6 py-4 border-b border-border dark:border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-foreground dark:text-foreground">
                {type === 'create' ? 'Create New Prompt' : 
                 type === 'edit' ? 'Edit Prompt' :
                 type === 'delete' ? 'Delete Prompt' : 
                 'Use Prompt'}
              </h3>
              <button
                type="button"
                className="bg-white dark:bg-surface-container-high rounded-md text-outline dark:text-muted-foreground hover:text-muted-foreground dark:hover:text-outline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring dark:focus:ring-ring dark:focus:ring-offset-gray-800 transition-colors"
                onClick={onClose}
              >
                <span className="sr-only">Close</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
          
          {/* Modal body */}
          <div className={`${type === 'delete' ? '' : 'max-h-[60vh] overflow-y-auto'}`}>
            {renderModalContent()}
          </div>
          
          {/* Modal footer */}
          {renderModalFooter()}
        </div>
      </div>
    </div>
  );
}
