import { LucideIcon } from 'lucide-react';

export type TemplateCategory = 'email' | 'whatsapp' | 'chat' | 'notification' | 'custom' | 'client' ;
export type TemplateStatus = 'draft' | 'published' | 'archived';

export interface Template {
  id: number;
  name: string;
  description: string;
  category: TemplateCategory;
  status: TemplateStatus;
  tags: string[];
  lastModified: string;
  usage: number;
  favorite: boolean;
}

export interface TemplateStats {
  openRate: number;
  responseRate: number;
  avgReadTime: string;
  satisfaction: number;
}

// types/template.ts
// Add this function to your existing template.ts file

export const createEmptyTemplate = (): Template => ({
  id: 0, // This would typically be assigned by the backend
  name: '',
  description: '',
  category: 'custom', // Default category
  status: 'draft', // New templates start as drafts
  tags: [],
  lastModified: new Date().toISOString(),
  usage: 0,
  favorite: false
});
