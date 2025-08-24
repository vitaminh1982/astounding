// Shared types for Orchestration components

export interface Message {
  type: 'user' | 'ai';
  text?: string;
  content?: AiContent;
  timestamp: Date;
}

export interface AiContent {
  reasoningSteps?: string[];
  agentCalls?: { agentName: string; purpose: string; }[];
  finalResponse: string | JSX.Element;
}

export interface SystemMetric {
  id: string;
  title: string;
  value: string;
  change: string;
  changeLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  trend: 'up' | 'down';
}

export interface QuickAccessCard {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  page: string;
}

export interface ChatInterfaceProps {
  conversationHistory: Message[];
  isLoading: boolean;
  promptInput: string;
  setPromptInput: (value: string) => void;
  handleSendPrompt: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  isModal: boolean;
  setIsChatMaximized: (value: boolean) => void;
}

export interface OrchestrationPageProps {
  onNavigate: (page: string) => void;
}