// src/types/usage.ts

export interface UsageMetrics {
  credits: {
    used: number;
    total: number;
    percentage: number;
  };
  messages: {
    used: number;
    total: number;
    percentage: number;
  };
  conversations: {
    total: number;
    averageMessagesPerConversation: number;
    dailyUsage: DailyUsage[];
  };
  workflows: {
    executed: number;
    mostUsed: WorkflowUsage[];
    successRate: number;
  };
  agents: AgentUsage[];
  history: MonthlyUsage[];
  creditAllocation: CreditAllocation[];
  projectedUsage: {
    estimatedDepletion: string;
    projectedUsage: number;
  };
}

export interface DailyUsage {
  date: string;
  count: number;
}

export interface WorkflowUsage {
  id: string;
  name: string;
  count: number;
  percentage: number;
}

export interface AgentUsage {
  id: string;
  name: string;
  messageCount: number;
  responseTime: number;
  resolutionRate: number;
  isActive: boolean;
}

export interface MonthlyUsage {
  month: string;
  credits: number;
  messages: number;
  conversations: number;
}

export interface CreditAllocation {
  category: string;
  amount: number;
  percentage: number;
}

export interface NotificationSettings {
  thresholds: number[];
  emailNotifications: boolean;
  emailAddress: string;
}

export interface UsageOptimizationTip {
  id: string;
  title: string;
  description: string;
  potentialSavings: string;
  implemented: boolean;
}