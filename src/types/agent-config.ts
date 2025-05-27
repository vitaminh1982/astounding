// Interfaces for nested configurations
export interface CommunicationConfig {
  style: ('professional' | 'empathetic' | 'solution-oriented')[]; // Communication style of the agent
  language: ('formal' | 'courteous' | 'casual')[]; // Tone of communication
  customTone: string; // Custom tone for the agent (optional)
}

export interface KnowledgeLanguageConfig {
  code: string; // Language code (e.g., 'en', 'fr')
  name: string; // Language name (e.g., 'English', 'French')
  flag: string; // Language flag (e.g., '🇬🇧', '🇫🇷')
  level: string; // Proficiency level (e.g., 'Native', 'Intermediate')
}

export interface KnowledgeConfig {
  bases: string[]; // Knowledge bases (e.g., FAQ, procedures)
  languages: KnowledgeLanguageConfig[]; // Supported languages
}

export interface RulesThresholdsConfig {
  maxResponseTime: number; // Maximum response time in seconds
  maxSessionDuration: number; // Maximum session duration in minutes
  maxAttempts: number; // Maximum number of attempts
  confidenceScore: number; // Confidence score for responses (0-100)
}

export interface RulesConfig {
  availability: string; // Availability of the agent (e.g., '24/7')
  thresholds: RulesThresholdsConfig; // Thresholds for agent performance
  escalationConditions: string[]; // Conditions for escalating issues
}

export interface LearningConfig {
  sources: string[]; // Learning sources (e.g., past conversations, feedback)
  updateFrequency: 'daily' | 'weekly' | 'monthly'; // Frequency of updates
}

export interface MetricsConfig {
  resolutionRate: number; // Percentage of resolved issues (0-100)
  responseTime: string; // Average response time (e.g., '12s avg.')
  csatScore: number; // Customer satisfaction score (e.g., 4.2)
}

// Main AgentConfig interface
export interface AgentConfig {
  id: string; // Unique identifier for the agent
  name: string; // Name of the agent
  status: 'active' | 'inactive'; // Status of the agent
  lastUpdate: string; // Last update timestamp (e.g., '15/03/2024 14:30')
  communication: CommunicationConfig; // Communication settings
  knowledge: KnowledgeConfig; // Knowledge bases and languages
  rules: RulesConfig; // Rules and thresholds
  learning: LearningConfig; // Learning configuration
  integrations: string[]; // Integrated systems or tools
  metrics: MetricsConfig; // Performance metrics
}
