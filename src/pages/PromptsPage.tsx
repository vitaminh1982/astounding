// src/pages/PromptsPage.tsx

import React, { useState, useContext, useEffect } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { Prompt } from '../types/prompt';
import { toast } from 'react-hot-toast';

// Import the components
import PromptsHeader from '../components/prompts/PromptsHeader';
import PromptsCategories from '../components/prompts/PromptsCategories';
import PromptsSearch from '../components/prompts/PromptsSearch';
import PromptsList, { mockPrompts } from '../components/prompts/PromptsList';

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
      // Copy to clipboard
      navigator.clipboard.writeText(prompt.content);
      toast.success(`Prompt "${prompt.title}" copied to clipboard`);
      
      // Update usage count
      const updatedPrompts = prompts.map(p => 
        p.id === promptId ? { ...p, usageCount: p.usageCount + 1 } : p
      );
      setPrompts(updatedPrompts);
    }
  };
  
  // Handler for editing a prompt
  const handleEditPrompt = (updatedPrompt: Prompt) => {
    const updatedPrompts = prompts.map(p => 
      p.id === updatedPrompt.id ? updatedPrompt : p
    );
    setPrompts(updatedPrompts);
    toast.success(`Prompt "${updatedPrompt.title}" updated successfully`);
  };
  
  // Handler for deleting a prompt
  const handleDeletePrompt = (promptId: string) => {
    const updatedPrompts = prompts.filter(p => p.id !== promptId);
    setPrompts(updatedPrompts);
    setSelectedPromptId(null);
    toast.success('Prompt deleted successfully');
  };
  
  // Handler for toggling favorite status
  const handleToggleFavorite = (promptId: string, isFavorite: boolean) => {
    const updatedPrompts = prompts.map(p => 
      p.id === promptId ? { ...p, isFavorite } : p
    );
    setPrompts(updatedPrompts);
    toast.success(isFavorite ? 'Added to favorites' : 'Removed from favorites');
  };
  
  // Handler for filter button click (placeholder for now)
  const handleFiltersClick = () => {
    toast.info('Advanced filters coming soon');
  };

  return (
    // Main container for the page
    <div className="min-h-screen bg-gray-50">
      {/* Content container with responsive padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">

        {/* Render the Header for the Prompts page */}
        <PromptsHeader />

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

            {/* Render the List of Prompts */}
            <div className="mt-4">
              <PromptsList
                prompts={filteredPrompts}
                onUsePrompt={handleUsePrompt}
                onEditPrompt={handleEditPrompt}
                onDeletePrompt={handleDeletePrompt}
                onToggleFavorite={handleToggleFavorite}
                onSelect={handleSelectPrompt}
                selectedPromptId={selectedPromptId}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}