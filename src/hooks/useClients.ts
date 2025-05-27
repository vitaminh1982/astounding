import { useState, useEffect } from 'react';
import { Client } from '../types/client';

const mockClients: Client[] = [
  {
    id: 1,
    name: 'Sophie Martin',
    email: 'sophie.m@email.com',
    initials: 'SM',
    segment: 'Premium',
    ltv: 2450,
    ltvTrend: 'up',
    satisfaction: 95,
    status: 'active',
    vip: true,
    riskLevel: 'low',
    registrationDate: '15/03/2024',
    phone: '+33 6 12 34 56 78',
    notes: 'VIP Customer - Early adopter',
    engagementScore: 85,
    tags: ['VIP', 'Early Adopter'],
    preferences: {
      channels: ['email', 'sms'],
      language: 'en',
      contactFrequency: 'weekly',
      newsletter: true,
      specialOffers: true
    },
    gdpr: {
      consents: {
        marketing: true,
        analytics: true,
        thirdParty: false
      },
      lastUpdate: '15/03/2024'
    }
  },
  {
    id: 2,
    name: 'John Smith',
    email: 'john.s@email.com',
    initials: 'JS',
    segment: 'Standard',
    ltv: 850,
    ltvTrend: 'down',
    satisfaction: 75,
    status: 'inactive',
    vip: false,
    riskLevel: 'high',
    registrationDate: '10/01/2024',
    phone: '+33 6 98 76 54 32',
    notes: 'Inactive for 30 days',
    engagementScore: 45,
    tags: ['Inactive'],
    preferences: {
      channels: ['email'],
      language: 'en',
      contactFrequency: 'monthly',
      newsletter: false,
      specialOffers: false
    },
    gdpr: {
      consents: {
        marketing: false,
        analytics: true,
        thirdParty: false
      },
      lastUpdate: '10/01/2024'
    }
  },
  {
    id: 3,
    name: 'Mary Bernard',
    email: 'mary.b@email.com',
    initials: 'MB',
    segment: 'Premium',
    ltv: 1750,
    ltvTrend: 'up',
    satisfaction: 90,
    status: 'active',
    vip: true,
    riskLevel: 'low',
    registrationDate: '01/02/2024',
    phone: '+33 6 11 22 33 44',
    notes: 'Brand Ambassador',
    engagementScore: 92,
    tags: ['VIP', 'Ambassador'],
    preferences: {
      channels: ['email', 'phone', 'sms'],
      language: 'en',
      contactFrequency: 'weekly',
      newsletter: true,
      specialOffers: true
    },
    gdpr: {
      consents: {
        marketing: true,
        analytics: true,
        thirdParty: true
      },
      lastUpdate: '01/02/2024'
    }
  }
];

export function useClients() {
  const [clients, setClients] = useState<Client[]>(mockClients);

  useEffect(() => {
    // Here, you could load real clients from an API
  }, []);

  return clients;
}
