import { LucideIcon } from 'lucide-react';

export interface Client {
  id: number;
  name: string;
  email: string;
  initials: string;
  segment: 'Premium' | 'Standard' | 'Occasionnal';
  ltv: number;
  ltvTrend: 'up' | 'down';
  satisfaction: number;
  status: 'active' | 'inactive';
  vip: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  registrationDate: string;
  phone?: string;
  notes?: string;
  engagementScore: number;
  tags: string[];
  preferences: {
    channels: ('email' | 'sms' | 'phone')[];
    language: string;
    contactFrequency: 'daily' | 'weekly' | 'monthly';
    newsletter: boolean;
    specialOffers: boolean;
  };
  gdpr: {
    consents: {
      marketing: boolean;
      analytics: boolean;
      thirdParty: boolean;
    };
    lastUpdate: string;
  };
}