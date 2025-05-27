// src/pages/PromptsPage.tsx

import React, { useState, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

// --- Placeholders for the new Prompt-specific components ---
// These components will need to be created separately, similar to their Template counterparts.
// Assuming they will live in a 'components/prompts/' directory.

// Placeholder for the header component (similar to TemplatesHeader)
import PromptsHeader from '../components/prompts/PromptsHeader';
// Placeholder for the categories/roles component (similar to TemplatesCategories)
import PromptsCategories from '../components/prompts/PromptsCategories';
// Placeholder for the search/filter component (similar to TemplatesSearch)
import PromptsSearch from '../components/prompts/PromptsSearch';
// Placeholder for the list component (similar to TemplatesList)
import PromptsList from '../components/prompts/PromptsList';
// --- End Placeholders ---

// Define the main PromptsPage component
export default function PromptsPage() {
  // State to manage the visibility of the categories/roles on mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Access the translation function from context
  const { t } = useContext(LanguageContext);

  return (
    // Main container for the page
    <div className="min-h-screen bg-gray-50">
      {/* Content container with responsive padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">

        {/* Render the Header for the Prompts page */}
        {/* This will contain the title, subtitle, and the 'Generate New Prompt' / 'New Role' buttons */}
        <PromptsHeader />

        {/* Mobile Menu Toggle Button for Categories/Roles */}
        {/* Shown only on smaller screens (lg:hidden) */}
        <div className="mb-4 lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full px-4 py-2 text-left bg-white rounded-lg border shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
          >
            {/* Use translation for the category title ('Roles') */}
            {t('prompts.categories.title')} {isMobileMenuOpen ? '▼' : '▶'}
          </button>
        </div>

        {/* Main content grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Categories/Roles Sidebar */}
          {/* Hidden on small screens unless the mobile menu is open */}
          <div className={`lg:col-span-3 ${isMobileMenuOpen ? 'block animate-fade-in-down' : 'hidden lg:block'}`}>
            {/* Render the Categories/Roles component */}
            {/* This will list roles like Marketer, Support, Developer, etc. */}
            <PromptsCategories />
          </div>

          {/* Main Content Area (Search and List) */}
          <div className="lg:col-span-9">
            {/* Render the Search and Filter component */}
            {/* This will contain the search input and filter options */}
            <PromptsSearch />

            {/* Render the List of Prompts */}
            {/* This will display the prompt cards */}
            <div className="mt-4">
              <PromptsList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
