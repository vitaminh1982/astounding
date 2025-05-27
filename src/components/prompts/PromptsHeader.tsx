// src/components/prompts/PromptsHeader.tsx

import React, { useContext, useState } from 'react';
import { Plus } from 'lucide-react';
import { LanguageContext } from '../../context/LanguageContext';

// Placeholder for the Prompt Generation Modal/Component
// This will need to be created separately.
// It should handle the user input, call the AI, and display the ROCKSTAR output.
import PromptGeneratorModal from './generator/PromptGeneratorModal'; // Assuming this path

// Define the props if the generator modal needs any specific data to initialize
// interface PromptGeneratorModalProps {
//   onClose: () => void;
//   onSave: (generatedPrompt: /* Define type for generated prompt data */ any) => void;
// }

export default function PromptsHeader() {
  const { t } = useContext(LanguageContext);
  const [showGeneratorModal, setShowGeneratorModal] = useState(false);

  // Function to open the prompt generation modal
  const handleGenerateNewPrompt = () => {
    setShowGeneratorModal(true);
  };

  // Function to handle saving or using the generated prompt from the modal
  const handleSaveGeneratedPrompt = (generatedPromptData: any) => {
    // TODO: Implement logic to save the generated prompt
    // This might involve adding it to the main prompt list state or sending to an API
    console.log('Generated Prompt Data:', generatedPromptData);
    setShowGeneratorModal(false); // Close the modal after saving/using
  };

  // Placeholder function for handling the creation of a new category/role
  const handleNewCategory = () => {
    // TODO: Implement logic to add a new category/role
    // This might involve opening another simple modal or inline editing
    console.log('New Category/Role button clicked - Implement functionality');
    // Example: prompt("Enter new category name:");
  };

  return (
    <>
      {/* Header section with title, subtitle, and action buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
        {/* Title and Subtitle */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {/* Use translation key for the Prompts title */}
            {t('prompts.header.title', 'Prompts')} {/* Added default value */}
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {/* Use translation key for the Prompts subtitle */}
            {t('prompts.header.subtitle', 'Manage and discover AI prompts')} {/* Added default value */}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2 sm:gap-1.5">
          {/* New Category/Role Button */}
          <button
            onClick={handleNewCategory}
            className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
          >
            <Plus className="w-4 h-4" />
            <span className="whitespace-nowrap">
              {/* Use translation key for New Category */}
              {t('prompts.header.newRole', 'New Role')} {/* Added default value */}
            </span>
          </button>

          {/* Generate New Prompt Button */}
          <button
            onClick={handleGenerateNewPrompt}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base"
          >
            <Plus className="w-4 h-4" />
            <span className="whitespace-nowrap">
              {/* Use translation key for Generate New Prompt */}
              {t('prompts.header.generatePrompt', 'Generate New Prompt')} {/* Added default value */}
            </span>
          </button>
        </div>
      </div>

      {/* Conditionally render the Prompt Generator Modal */}
      {showGeneratorModal && (
        <PromptGeneratorModal
          onClose={() => setShowGeneratorModal(false)}
          onSave={handleSaveGeneratedPrompt}
          // Pass any other necessary props to the modal
        />
      )}
    </>
  );
}
