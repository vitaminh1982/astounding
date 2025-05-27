// src/types/prompt.ts

export interface Prompt {
  id: string;           // Changed to string based on your PromptCard props
  title: string;
  description: string;
  category: 'marketing' | 'content_creation' | 'development' | 'support' | 'hr' | 'custom';
  status: 'draft' | 'published' | 'archived';
  content: string;      // The actual prompt text
  tags: string[];
  role?: string;        // Added role field from PromptCard
  lastModified: string;
  usageCount: number;
  isFavorite: boolean;
  author: string;
}
