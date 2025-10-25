// src/pages/PromptsPage.tsx

import React, { useState, useContext, useEffect } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { Prompt } from '../types/prompt';
import { toast } from 'react-hot-toast';
import { LayoutGrid, List, SlidersHorizontal } from 'lucide-react';

// Import the components
import PromptsHeader from '../components/prompts/PromptsHeader';
import PromptsCategories from '../components/prompts/PromptsCategories';
import PromptsSearch from '../components/prompts/PromptsSearch';
import PromptsList, { mockPrompts } from '../components/prompts/PromptsList';
import PromptsTableView from '../components/prompts/PromptsTableView';
import PromptModal from '../components/prompts/PromptModal';

// View type enum
type ViewType = 'card' | 'list';

// Define the main PromptsPage component
export default function PromptsPage() {
  // State to manage the visibility of the categories/roles on mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Access the translation function from context
  const { t } = useContext(LanguageContext);
  
  // State for prompts management
  const [prompts, setPrompts] = useState<Prompt[]>(mockPrompts);
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>(mockPrompts);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);
  
  // State for view type (card or list)
  const [viewType, setViewType] = useState<ViewType>(() => {
    // Try to get the saved view preference from localStorage
    const savedView = localStorage.getItem('promptsViewType');
    return (savedView === 'list' || savedView === 'card') ? savedView as ViewType : 'card';
  });
  
  // State for modals
  const [modalType, setModalType] = useState<'edit' | 'delete' | 'use' | 'create' | null>(null);
  const [modalPrompt, setModalPrompt] = useState<Prompt | null>(null);
  
  // Save view preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('promptsViewType', viewType);
  }, [viewType]);
  
  // Filter prompts when category or search query changes
  useEffect(() => {
    let result = [...prompts];
    
    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(prompt => prompt.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(prompt => 
        prompt.title.toLowerCase().includes(query) ||
        prompt.description.toLowerCase().includes(query) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    setFilteredPrompts(result);
  }, [prompts, selectedCategory, searchQuery]);

  // Handler for selecting a prompt
  const handleSelectPrompt = (promptId: string) => {
    setSelectedPromptId(promptId === selectedPromptId ? null : promptId);
  };
  
  // Handler for using a prompt
  const handleUsePrompt = (promptId: string) => {
    const prompt = prompts.find(p => p.id === promptId);
    if (prompt) {
      setModalPrompt(prompt);
      setModalType('use');
    }
  };
  
  // Handler for editing a prompt
  const handleEditPromptClick = (promptId: string) => {
    const prompt = prompts.find(p => p.id === promptId);
    if (prompt) {
      setModalPrompt(prompt);
      setModalType('edit');
    }
  };
  
  // Handler for creating a new prompt
  const handleCreatePrompt = () => {
    setModalPrompt(null);
    setModalType('create');
  };
  
  // Handler for saving edited or created prompt
  const handleSavePrompt = (updatedPrompt: Prompt) => {
    if (modalType === 'create') {
      // Add new prompt
      setPrompts([...prompts, updatedPrompt]);
      toast.success(`Prompt "${updatedPrompt.title}" created successfully`);
    } else {
      // Update existing prompt
      const updatedPrompts = prompts.map(p => 
        p.id === updatedPrompt.id ? updatedPrompt : p
      );
      setPrompts(updatedPrompts);
      toast.success(`Prompt "${updatedPrompt.title}" updated successfully`);
    }
    setModalType(null);
    setModalPrompt(null);
  };
  
  // Handler for deleting a prompt
  const handleDeletePromptClick = (promptId: string) => {
    const prompt = prompts.find(p => p.id === promptId);
    if (prompt) {
      setModalPrompt(prompt);
      setModalType('delete');
    }
  };
  
  // Handler for confirming prompt deletion
  const handleConfirmDelete = () => {
    if (modalPrompt) {
      const updatedPrompts = prompts.filter(p => p.id !== modalPrompt.id);
      setPrompts(updatedPrompts);
      setSelectedPromptId(null);
      toast.success('Prompt deleted successfully');
      setModalType(null);
      setModalPrompt(null);
    }
  };
  
  // Handler for toggling favorite status
  const handleToggleFavorite = (promptId: string, isFavorite: boolean) => {
    const updatedPrompts = prompts.map(p => 
      p.id === promptId ? { ...p, isFavorite } : p
    );
    setPrompts(updatedPrompts);
    toast.success(isFavorite ? 'Added to favorites' : 'Removed from favorites');
  };
  
  // Handler for filter button click
  const handleFiltersClick = () => {
    toast('Advanced filters coming soon', {
      icon: '🔍'
    });
  };
  
  // Handler for closing modals
  const handleCloseModal = () => {
    setModalType(null);
    setModalPrompt(null);
  };
  
  // Handler for copying prompt content
  const handleCopyPrompt = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Prompt copied to clipboard');
    
    // Update usage count if in use modal
    if (modalType === 'use' && modalPrompt) {
      const updatedPrompts = prompts.map(p => 
        p.id === modalPrompt.id ? { ...p, usageCount: p.usageCount + 1 } : p
      );
      setPrompts(updatedPrompts);
    }
  };

  return (
    // Main container for the page
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Content container with responsive padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">

        {/* Render the Header for the Prompts page */}
        <PromptsHeader 
          onCreatePrompt={handleCreatePrompt}
          onCreateRole={() => {
            toast('Create role functionality coming soon', {
              icon: '👷‍♂️'
            });
          }}
        />
        
        {/* View Toggle */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">View:</span>
            <div className="flex border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
              <button
                onClick={() => setViewType('card')}
                className={`flex items-center px-3 py-1.5 text-sm ${
                  viewType === 'card'
                    ? 'bg-teal-600 dark:bg-teal-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                aria-label="Card View"
              >
                <LayoutGrid className="w-4 h-4 mr-1.5" />
                <span className="hidden sm:inline">Cards</span>
              </button>
              <button
                onClick={() => setViewType('list')}
                className={`flex items-center px-3 py-1.5 text-sm ${
                  viewType === 'list' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                aria-label="List View"
              >
                <List className="w-4 h-4 mr-1.5" />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Toggle Button for Categories/Roles */}
        <div className="mb-4 lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full px-4 py-2 text-left bg-white rounded-lg border shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
          >
            {t('prompts.categories.title')} {isMobileMenuOpen ? '▼' : '▶'}
          </button>
        </div>

        {/* Main content grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Categories/Roles Sidebar */}
          <div className={`lg:col-span-3 ${isMobileMenuOpen ? 'block animate-fade-in-down' : 'hidden lg:block'}`}>
            <PromptsCategories
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>

          {/* Main Content Area (Search and List) */}
          <div className="lg:col-span-9">
            {/* Render the Search and Filter component */}
            <PromptsSearch
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onFiltersClick={handleFiltersClick}
            />

            {/* Render the appropriate view based on viewType */}
            <div className="mt-4">
              {viewType === 'card' ? (
                <PromptsList
                  prompts={filteredPrompts}
                  onUsePrompt={handleUsePrompt}
                  onEditPrompt={handleEditPromptClick}
                  onDeletePrompt={handleDeletePromptClick}
                  onToggleFavorite={handleToggleFavorite}
                  onSelect={handleSelectPrompt}
                  selectedPromptId={selectedPromptId}
                />
              ) : (
                <PromptsTableView
                  prompts={filteredPrompts}
                  onUsePrompt={handleUsePrompt}
                  onEditPrompt={handleEditPromptClick}
                  onDeletePrompt={handleDeletePromptClick}
                  onToggleFavorite={handleToggleFavorite}
                  selectedPromptId={selectedPromptId}
                  onSelect={handleSelectPrompt}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Modals */}
      {modalType && (
        <PromptModal
          type={modalType}
          prompt={modalPrompt}
          onClose={handleCloseModal}
          onSave={handleSavePrompt}
          onDelete={handleConfirmDelete}
          onCopy={handleCopyPrompt}
        />
      )}
    </div>
  );
}