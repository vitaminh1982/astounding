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
  },
  {
    id: 4,
    name: 'David Wilson',
    email: 'david.w@email.com',
    initials: 'DW',
    segment: 'Enterprise',
    ltv: 5200,
    ltvTrend: 'up',
    satisfaction: 98,
    status: 'active',
    vip: true,
    riskLevel: 'low',
    registrationDate: '08/12/2023',
    phone: '+33 6 55 44 33 22',
    notes: 'Enterprise client - Strategic partnership',
    engagementScore: 96,
    tags: ['VIP', 'Enterprise', 'Strategic'],
    preferences: {
      channels: ['email', 'phone'],
      language: 'en',
      contactFrequency: 'daily',
      newsletter: true,
      specialOffers: true
    },
    gdpr: {
      consents: {
        marketing: true,
        analytics: true,
        thirdParty: true
      },
      lastUpdate: '08/12/2023'
    }
  },
  {
    id: 5,
    name: 'Emma Johnson',
    email: 'emma.j@email.com',
    initials: 'EJ',
    segment: 'Standard',
    ltv: 1200,
    ltvTrend: 'stable',
    satisfaction: 82,
    status: 'active',
    vip: false,
    riskLevel: 'medium',
    registrationDate: '20/02/2024',
    phone: '+33 6 77 88 99 00',
    notes: 'Regular customer - Consistent engagement',
    engagementScore: 78,
    tags: ['Regular', 'Consistent'],
    preferences: {
      channels: ['email', 'sms'],
      language: 'en',
      contactFrequency: 'weekly',
      newsletter: true,
      specialOffers: false
    },
    gdpr: {
      consents: {
        marketing: true,
        analytics: true,
        thirdParty: false
      },
      lastUpdate: '20/02/2024'
    }
  },
  {
    id: 6,
    name: 'Carlos Rodriguez',
    email: 'carlos.r@email.com',
    initials: 'CR',
    segment: 'Premium',
    ltv: 3100,
    ltvTrend: 'up',
    satisfaction: 88,
    status: 'active',
    vip: true,
    riskLevel: 'low',
    registrationDate: '05/11/2023',
    phone: '+33 6 33 44 55 66',
    notes: 'International client - High volume',
    engagementScore: 89,
    tags: ['VIP', 'International', 'High Volume'],
    preferences: {
      channels: ['email', 'phone', 'sms'],
      language: 'es',
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
      lastUpdate: '05/11/2023'
    }
  },
  {
    id: 7,
    name: 'Lisa Chen',
    email: 'lisa.c@email.com',
    initials: 'LC',
    segment: 'Standard',
    ltv: 650,
    ltvTrend: 'down',
    satisfaction: 62,
    status: 'at_risk',
    vip: false,
    riskLevel: 'high',
    registrationDate: '18/03/2024',
    phone: '+33 6 19 28 37 46',
    notes: 'Recent complaints - Requires attention',
    engagementScore: 38,
    tags: ['At Risk', 'Complaints'],
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
      lastUpdate: '18/03/2024'
    }
  },
  {
    id: 8,
    name: 'Michael Brown',
    email: 'michael.b@email.com',
    initials: 'MB',
    segment: 'Premium',
    ltv: 2890,
    ltvTrend: 'stable',
    satisfaction: 91,
    status: 'active',
    vip: true,
    riskLevel: 'low',
    registrationDate: '12/01/2024',
    phone: '+33 6 66 77 88 99',
    notes: 'Loyal customer - Consistent purchases',
    engagementScore: 87,
    tags: ['VIP', 'Loyal', 'Consistent'],
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
      lastUpdate: '12/01/2024'
    }
  },
  {
    id: 9,
    name: 'Anna Schneider',
    email: 'anna.s@email.com',
    initials: 'AS',
    segment: 'Enterprise',
    ltv: 4750,
    ltvTrend: 'up',
    satisfaction: 94,
    status: 'active',
    vip: true,
    riskLevel: 'low',
    registrationDate: '03/10/2023',
    phone: '+33 6 44 55 66 77',
    notes: 'Enterprise key account - Germany market',
    engagementScore: 93,
    tags: ['VIP', 'Enterprise', 'Key Account', 'Germany'],
    preferences: {
      channels: ['email', 'phone'],
      language: 'de',
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
      lastUpdate: '03/10/2023'
    }
  },
  {
    id: 10,
    name: 'Robert Taylor',
    email: 'robert.t@email.com',
    initials: 'RT',
    segment: 'Standard',
    ltv: 420,
    ltvTrend: 'stable',
    satisfaction: 70,
    status: 'inactive',
    vip: false,
    riskLevel: 'medium',
    registrationDate: '25/01/2024',
    phone: '+33 6 88 99 00 11',
    notes: 'New customer - Low engagement',
    engagementScore: 42,
    tags: ['New', 'Low Engagement'],
    preferences: {
      channels: ['email'],
      language: 'en',
      contactFrequency: 'monthly',
      newsletter: true,
      specialOffers: false
    },
    gdpr: {
      consents: {
        marketing: true,
        analytics: true,
        thirdParty: false
      },
      lastUpdate: '25/01/2024'
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
