// src/hooks/useUsage.ts
import { useState, useEffect } from 'react';
import { UsageMetrics, UsageOptimizationTip } from '../types/usage';

// Mock data for development and testing
const mockUsageData: UsageMetrics = {
  credits: {
    used: 1250,
    total: 4000,
    percentage: 31.25
  },
  messages: {
    used: 185,
    total: 500,
    percentage: 37
  },
  conversations: {
    total: 70,
    averageMessagesPerConversation: 12.1,
    dailyUsage: [
      { date: '2025-01-01', count: 12 },
      { date: '2025-01-02', count: 8 },
      { date: '2025-01-03', count: 15 },
      { date: '2025-01-04', count: 10 },
      { date: '2025-01-05', count: 5 },
      { date: '2025-01-06', count: 18 },
      { date: '2025-01-07', count: 22 }
    ]
  },
  workflows: {
    executed: 78,
    mostUsed: [
      { id: '1', name: 'Customer Onboarding', count: 32, percentage: 41 },
      { id: '2', name: 'Support Ticket Processing', count: 24, percentage: 31 },
      { id: '3', name: 'Lead Qualification', count: 14, percentage: 18 },
      { id: '4', name: 'Email Campaign', count: 8, percentage: 10 }
    ],
    successRate: 92
  },
  agents: [
    { id: '1', name: 'Customer Support 24/7', messageCount: 85, responseTime: 1.2, resolutionRate: 94, isActive: true },
    { id: '2', name: 'Sales Assistant', messageCount: 45, responseTime: 1.5, resolutionRate: 88, isActive: true },
    { id: '3', name: 'Technical Support', messageCount: 35, responseTime: 2.1, resolutionRate: 91, isActive: true },
    { id: '4', name: 'Billing Service', messageCount: 20, responseTime: 1.8, resolutionRate: 95, isActive: true }
  ],
  history: [
    { month: 'January', credits: 980, messages: 145, conversations: 35 },
    { month: 'February', credits: 1120, messages: 165, conversations: 38 },
    { month: 'March', credits: 1250, messages: 185, conversations: 42 }
  ],
  creditAllocation: [
    { category: 'Conversations', amount: 750, percentage: 60 },
    { category: 'Workflows', amount: 375, percentage: 30 },
    { category: 'Document Processing', amount: 125, percentage: 10 }
  ],
  projectedUsage: {
    estimatedDepletion: '2025-04-15',
    projectedUsage: 3800
  }
};

const mockOptimizationTips: UsageOptimizationTip[] = [
  {
    id: '1',
    title: 'Optimize workflow triggers',
    description: 'Your workflows are triggering too frequently. Consider adjusting the conditions to reduce unnecessary executions.',
    potentialSavings: '~15% credits',
    implemented: false
  },
  {
    id: '2',
    title: 'Use batch processing for documents',
    description: 'Process multiple documents in a single batch instead of individually to save on API calls.',
    potentialSavings: '~8% credits',
    implemented: false
  },
  {
    id: '3',
    title: 'Implement caching for common queries',
    description: 'Many of your agents are making repetitive queries. Implementing a caching layer could reduce redundant API calls.',
    potentialSavings: '~12% credits',
    implemented: false
  }
];

export function useUsage() {
  const [usageData, setUsageData] = useState<UsageMetrics>(mockUsageData);
  const [optimizationTips, setOptimizationTips] = useState<UsageOptimizationTip[]>(mockOptimizationTips);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call to fetch usage data
    const fetchUsageData = async () => {
      try {
        setIsLoading(true);
        // In a real implementation, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Use mock data for now
        setUsageData(mockUsageData);
        setOptimizationTips(mockOptimizationTips);
        setError(null);
      } catch (err) {
        console.error('Error fetching usage data:', err);
        setError('Failed to load usage data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsageData();
  }, []);

  const implementTip = (tipId: string) => {
    setOptimizationTips(prev => 
      prev.map(tip => 
        tip.id === tipId ? { ...tip, implemented: true } : tip
      )
    );
  };

  return {
    usageData,
    optimizationTips,
    isLoading,
    error,
    implementTip
  };
}