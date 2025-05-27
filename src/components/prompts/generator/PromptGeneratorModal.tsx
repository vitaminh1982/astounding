// src/components/prompts/generator/PromptGeneratorModal.tsx

import React, { useContext, useState } from 'react';
import { X } from 'lucide-react';
import { LanguageContext } from '../../../context/LanguageContext';

// Define the type for the prompt data structure
export interface GeneratedPrompt {
  title: string;
  content: string;
  category: string;
  tags?: string[];
}

// Props interface for the PromptGeneratorModal component
interface PromptGeneratorModalProps {
  onClose: () => void;
  onSave: (generatedPrompt: GeneratedPrompt) => void;
}

export default function PromptGeneratorModal({ onClose, onSave }: PromptGeneratorModalProps) {
  const { t } = useContext(LanguageContext);
  
  // State for user input
  const [userInput, setUserInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState<GeneratedPrompt | null>(null);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
  };

  // Function to generate prompt using the ROCKSTAR framework
  const generatePrompt = async () => {
    if (!userInput.trim()) return;
    
    setIsGenerating(true);
    
    try {
      // Simulate API call to AI service
      // In a real implementation, you would call your AI service here
      console.log('Generating prompt based on input:', userInput);
      
      // Simulating a response delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock generated prompt using the ROCKSTAR framework
      // In a real implementation, this would come from your AI service
      const mockPrompt: GeneratedPrompt = {
        title: `Generated Prompt for "${userInput.substring(0, 20)}${userInput.length > 20 ? '...' : ''}"`,
        content: `# ROCKSTAR Prompt for ${userInput.substring(0, 30)}
        
R - Role: Act as an expert consultant in this field
O - Objective: Provide comprehensive guidance on ${userInput}
C - Context: User needs professional insights about ${userInput}
K - Knowledge: Apply best practices and latest research
S - Style: Professional, clear, and concise communication
T - Tone: Helpful and authoritative
A - Audience: Users seeking expert advice
R - Response format: Structured with headings, bullet points, and actionable steps`,
        category: 'Generated',
        tags: ['rockstar', 'ai-generated']
      };
      
      setGeneratedPrompt(mockPrompt);
    } catch (error) {
      console.error('Error generating prompt:', error);
      // Handle error state
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to save the generated prompt
  const handleSave = () => {
    if (generatedPrompt) {
      onSave(generatedPrompt);
    }
  };

  // Function to handle modal overlay clicks
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-auto shadow-xl">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">
            {t('prompts.generator.title', 'Generate New Prompt')}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Modal Body */}
        <div className="p-6">
          {/* User input section */}
          <div className="mb-6">
            <label htmlFor="prompt-description" className="block text-sm font-medium text-gray-700 mb-2">
              {t('prompts.generator.describePrompt', 'Describe what kind of prompt you want to generate:')}
            </label>
            <textarea
              id="prompt-description"
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={t('prompts.generator.placeholder', 'e.g., I need a prompt to generate marketing content for a new tech product...')}
              value={userInput}
              onChange={handleInputChange}
              disabled={isGenerating}
            />
            
            <button
              onClick={generatePrompt}
              disabled={isGenerating || !userInput.trim()}
              className={`mt-3 px-4 py-2 rounded-lg text-white ${
                isGenerating || !userInput.trim() ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700'
              } transition-colors w-full sm:w-auto`}
            >
              {isGenerating 
                ? t('prompts.generator.generating', 'Generating...') 
                : t('prompts.generator.generate', 'Generate ROCKSTAR Prompt')}
            </button>
          </div>
          
          {/* Generated prompt display */}
          {generatedPrompt && (
            <div className="mt-6 border rounded-lg p-4 bg-gray-50">
              <h3 className="text-lg font-semibold mb-2">{generatedPrompt.title}</h3>
              <div className="bg-white border rounded-lg p-4 mb-4 whitespace-pre-line">
                {generatedPrompt.content}
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                  {generatedPrompt.category}
                </span>
                {generatedPrompt.tags?.map(tag => (
                  <span key={tag} className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                {t('prompts.generator.savePrompt', 'Save Prompt')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
