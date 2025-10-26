// src/pages/PromptsPage.tsx

import React, { useState, useContext, useEffect, useCallback } from 'react';
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
type ModalType = 'edit' | 'delete' | 'use' | 'create' | null;

// Define the main PromptsPage component
export default function PromptsPage() {
  // Access the translation function from context
  const { t } = useContext(LanguageContext);
  
  // State to manage the visibility of the categories/roles on mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // State for prompts management
  const [prompts, setPrompts] = useState<Prompt[]>(mockPrompts);
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>(mockPrompts);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);
  
  // State for view type (card or list)
  const [viewType, setViewType] = useState<ViewType>(() => {
    const savedView = localStorage.getItem('promptsViewType');
    return (savedView === 'list' || savedView === 'card') ? savedView as ViewType : 'card';
  });
  
  // State for modals
  const [modalType, setModalType] = useState<ModalType>(null);
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

  // Memoized handlers
  const handleSelectPrompt = useCallback((promptId: string) => {
    setSelectedPromptId(prev => promptId === prev ? null : promptId);
  }, []);
  
  const handleUsePrompt = useCallback((promptId: string) => {
    const prompt = prompts.find(p => p.id === promptId);
    if (prompt) {
      setModalPrompt(prompt);
      setModalType('use');
    }
  }, [prompts]);
  
  const handleEditPromptClick = useCallback((promptId: string) => {
    const prompt = prompts.find(p => p.id === promptId);
    if (prompt) {
      setModalPrompt(prompt);
      setModalType('edit');
    }
  }, [prompts]);
  
  const handleCreatePrompt = useCallback(() => {
    setModalPrompt(null);
    setModalType('create');
  }, []);
  
  const handleCreateRole = useCallback(() => {
    toast('Create role functionality coming soon', {
      icon: '👷‍♂️'
    });
  }, []);
  
  const handleSavePrompt = useCallback((updatedPrompt: Prompt) => {
    if (modalType === 'create') {
      setPrompts(prev => [...prev, updatedPrompt]);
      toast.success(`Prompt "${updatedPrompt.title}" created successfully`);
    } else {
      setPrompts(prev => prev.map(p => 
        p.id === updatedPrompt.id ? updatedPrompt : p
      ));
      toast.success(`Prompt "${updatedPrompt.title}" updated successfully`);
    }
    setModalType(null);
    setModalPrompt(null);
  }, [modalType]);
  
  const handleDeletePromptClick = useCallback((promptId: string) => {
    const prompt = prompts.find(p => p.id === promptId);
    if (prompt) {
      setModalPrompt(prompt);
      setModalType('delete');
    }
  }, [prompts]);
  
  const handleConfirmDelete = useCallback(() => {
    if (modalPrompt) {
      setPrompts(prev => prev.filter(p => p.id !== modalPrompt.id));
      setSelectedPromptId(null);
      toast.success('Prompt deleted successfully');
      setModalType(null);
      setModalPrompt(null);
    }
  }, [modalPrompt]);
  
  const handleToggleFavorite = useCallback((promptId: string, isFavorite: boolean) => {
    setPrompts(prev => prev.map(p => 
      p.id === promptId ? { ...p, isFavorite } : p
    ));
    toast.success(isFavorite ? 'Added to favorites' : 'Removed from favorites');
  }, []);
  
  const handleFiltersClick = useCallback(() => {
    toast('Advanced filters coming soon', {
      icon: '🔍'
    });
  }, []);
  
  const handleCloseModal = useCallback(() => {
    setModalType(null);
    setModalPrompt(null);
  }, []);
  
  const handleCopyPrompt = useCallback((content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Prompt copied to clipboard');
    
    if (modalType === 'use' && modalPrompt) {
      setPrompts(prev => prev.map(p => 
        p.id === modalPrompt.id ? { ...p, usageCount: p.usageCount + 1 } : p
      ));
    }
  }, [modalType, modalPrompt]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">

        {/* Header */}
        <PromptsHeader 
          onCreatePrompt={handleCreatePrompt}
          onCreateRole={handleCreateRole}
        />
        
        {/* View Toggle */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {t('prompts.view.label') || 'View:'}
            </span>
            <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => setViewType('card')}
                className={`flex items-center px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  viewType === 'card'
                    ? 'bg-indigo-600 dark:bg-teal-600 text-white shadow-inner'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                aria-label="Card View"
                aria-pressed={viewType === 'card'}
              >
                <LayoutGrid className="w-4 h-4 mr-1.5" />
                <span className="hidden sm:inline">Cards</span>
              </button>
              <button
                onClick={() => setViewType('list')}
                className={`flex items-center px-3 py-2 text-sm font-medium transition-all duration-200 border-l border-gray-300 dark:border-gray-600 ${
                  viewType === 'list' 
                    ? 'bg-indigo-600 dark:bg-teal-600 text-white shadow-inner' 
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                aria-label="List View"
                aria-pressed={viewType === 'list'}
              >
                <List className="w-4 h-4 mr-1.5" />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Toggle Button for Categories */}
        <div className="mb-4 lg:hidden">
          <button
            onClick={toggleMobileMenu}
            className="w-full px-4 py-3 text-left bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-categories-menu"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {t('prompts.categories.title')}
              </span>
              <span className={`transform transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-90' : ''}`}>
                ▶
              </span>
            </div>
          </button>
        </div>

        {/* Main content grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Categories Sidebar */}
          <div 
            id="mobile-categories-menu"
            className={`lg:col-span-3 transition-all duration-300 ease-in-out ${
              isMobileMenuOpen 
                ? 'block animate-fade-in-down' 
                : 'hidden lg:block'
            }`}
          >
            <PromptsCategories
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            {/* Search and Filter */}
            <PromptsSearch
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onFiltersClick={handleFiltersClick}
            />

            {/* Prompts View */}
            <div className="mt-4">
              {filteredPrompts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                    <SlidersHorizontal className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    No prompts found
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Try adjusting your search or filters
                  </p>
                </div>
              ) : viewType === 'card' ? (
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
