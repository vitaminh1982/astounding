import React, { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { Prompt } from '../../types/prompt';

interface PromptModalProps {
  type: 'edit' | 'delete' | 'use';
  prompt: Prompt;
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
  const [editedPrompt, setEditedPrompt] = useState<Prompt>({ ...prompt });
  const [isCopied, setIsCopied] = useState(false);
  
  // Handler for input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedPrompt(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handler for tags changes
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsArray = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
    setEditedPrompt(prev => ({
      ...prev,
      tags: tagsArray
    }));
  };
  
  // Handler for save button
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave(editedPrompt);
    }
  };
  
  // Handler for copy button
  const handleCopy = () => {
    if (onCopy) {
      onCopy(prompt.content);
    }
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  // Render different modal content based on type
  const renderModalContent = () => {
    switch (type) {
      case 'edit':
        return (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={editedPrompt.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={editedPrompt.description}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Prompt Content
              </label>
              <textarea
                id="content"
                name="content"
                value={editedPrompt.content}
                onChange={handleInputChange}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono"
                required
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={editedPrompt.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                Tags (comma separated)
              </label>
              <input
                id="tags"
                name="tags"
                type="text"
                value={editedPrompt.tags.join(', ')}
                onChange={handleTagsChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Save Changes
              </button>
            </div>
          </form>
        );
        
      case 'delete':
        return (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Prompt</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete the prompt "{prompt.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        );
        
      case 'use':
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{prompt.title}</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800">
                  {prompt.category.replace('_', ' ')}
                </span>
                {prompt.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-500 mb-4">{prompt.description}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium text-gray-700">Prompt Content</h4>
                <button
                  onClick={handleCopy}
                  className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded hover:bg-indigo-50"
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
              <pre className="text-sm text-gray-700 whitespace-pre-wrap bg-white p-3 rounded border border-gray-200 font-mono">
                {prompt.content}
              </pre>
            </div>
            
            <div className="pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Usage Instructions</h4>
              <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                <li>Copy the prompt using the button above</li>
                <li>Paste it into your AI tool of choice</li>
                <li>Customize any placeholders in {'{curly braces}'} with your specific details</li>
                <li>Submit to the AI and review the response</li>
              </ol>
            </div>
            
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Close
              </button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          aria-hidden="true"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                type="button"
                className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={onClose}
              >
                <span className="sr-only">Close</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            
            {renderModalContent()}
          </div>
        </div>
      </div>
    </div>
  );
}