// src/components/prompts/PromptsCategories.tsx

import React, { useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';
import {
    Users, // Icon for Customer/User focused prompts
    Briefcase, // Icon for Business/Professional prompts
    Code, // Icon for Development/Technical prompts
    PenTool, // Icon for Content Creation/Writing prompts
    MessageSquare, // Icon for Communication/Support prompts
    LayoutGrid, // Icon for General/Other prompts
    Star // Icon for Favorite prompts (optional)
} from 'lucide-react'; // Using lucide-react icons, adjust as needed

// Define the structure for a category item
interface Category {
    id: string; // Unique identifier for the category (e.g., 'marketing', 'support')
    labelKey: string; // Translation key for the category name
    icon: React.ComponentType<{ className?: string }>; // Icon component
    count: number; // Number of prompts in this category (replace with actual data later)
    defaultLabel: string; // Default English label for fallback
}

// Define the categories/roles for prompts
// TODO: Replace counts with actual data fetched from an API or state
const promptCategories: Category[] = [
    // Example: Adding a 'Favorites' filter
    // { id: 'favorites', labelKey: 'prompts.categories.favorites', icon: Star, count: 12, defaultLabel: 'Favorites' },
    { id: 'all', labelKey: 'prompts.categories.all', icon: LayoutGrid, count: 12, defaultLabel: 'All Prompts' }, // 'All' category is often useful
    { id: 'marketing', labelKey: 'prompts.categories.marketing', icon: Briefcase, count: 2, defaultLabel: 'Marketing' },
    { id: 'content_creation', labelKey: 'prompts.categories.content_creation', icon: PenTool, count: 2, defaultLabel: 'Content Creation' },
    { id: 'support', labelKey: 'prompts.categories.support', icon: MessageSquare, count: 2, defaultLabel: 'Support' },
    { id: 'development', labelKey: 'prompts.categories.development', icon: Code, count: 2, defaultLabel: 'Development' },
    { id: 'hr', labelKey: 'prompts.categories.hr', icon: Users, count: 2, defaultLabel: 'HR / Employee' },
    { id: 'custom', labelKey: 'prompts.categories.custom', icon: LayoutGrid, count: 2, defaultLabel: 'Custom' },
];

// Define the props for the component
interface PromptsCategoriesProps {
    selectedCategory: string; // The ID of the currently selected category
    onSelectCategory: (categoryId: string) => void; // Callback function when a category is clicked
    className?: string; // Optional additional CSS classes
}

export default function PromptsCategories({
    selectedCategory,
    onSelectCategory,
    className = ''
}: PromptsCategoriesProps) {
    const { t } = useContext(LanguageContext);

    return (
        // Sidebar container with styling similar to the template categories
        <div className={`bg-white p-4 rounded-lg shadow-sm ${className}`}>
            {/* Category section title */}
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
                {t('prompts.categories.title', 'Roles')} {/* Changed title to Roles */}
            </h2>

            {/* List of categories */}
            <ul className="space-y-1">
                {promptCategories.map((category) => {
                    // Determine if the current category is the selected one
                    const isSelected = category.id === selectedCategory;
                    // Dynamically set classes based on selection state
                    const itemClasses = `
                        flex items-center justify-between p-2 rounded-md cursor-pointer
                        transition-colors duration-150 ease-in-out
                        ${isSelected
                            ? 'bg-indigo-100 text-indigo-700 font-medium' // Selected state style
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800' // Default state style
                        }
                    `;
                    // Dynamically set icon classes based on selection state
                    const iconClasses = `w-5 h-5 mr-3 ${isSelected ? 'text-indigo-600' : 'text-gray-400'}`;

                    return (
                        <li key={category.id}>
                            {/* Make the entire item clickable */}
                            <button
                                onClick={() => onSelectCategory(category.id)}
                                className={`w-full text-left ${itemClasses}`} // Use button for accessibility
                                aria-current={isSelected ? 'page' : undefined} // ARIA attribute for selected item
                            >
                                {/* Icon and Category Name */}
                                <div className="flex items-center">
                                    <category.icon className={iconClasses} aria-hidden="true" />
                                    <span>{t(category.labelKey, category.defaultLabel)}</span>
                                </div>
                                {/* Prompt Count Badge */}
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isSelected ? 'bg-indigo-200 text-indigo-800' : 'bg-gray-200 text-gray-700'}`}>
                                    {category.count}
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
