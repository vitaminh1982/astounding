// Shared types for AI Agent Interface components

export interface Tool {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface Message {
  sender: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

export interface AgentConfig {
  id?: string;
  name: string;
  avatar?: string;
  greeting?: string;
  model: string;
  temperature: number;
  maxTokens: number;
  toolAccess: boolean;
  tools?: Tool[];
  status?: string;
  lastUpdate?: string;
  communication?: {
    style?: string[];
    language?: string[];
    customTone?: string;
  };
  knowledge?: {
    bases?: string[];
    languages?: { code: string; name: string; flag: string; level: string }[];
  };
  rules?: {
    availability?: string;
    thresholds?: {
      maxResponseTime: number;
      maxSessionDuration: number;
      maxAttempts: number;
      confidenceScore: number;
    };
    escalationConditions?: string[];
  };
  learning?: {
    sources?: string[];
    updateFrequency?: string;
  };
  integrations?: string[];
  metrics?: {
    resolutionRate?: number;
    responseTime?: string;
    csatScore?: number;
  };
}

export interface VoiceRecordingState {
  isRecording: boolean;
  isTranscribing: boolean;
  recordingTime: number;
  mediaRecorder: MediaRecorder | null;
  audioChunks: Blob[];
}

export interface FileUploadState {
  selectedFile: File | null;
  isUploading: boolean;
  uploadProgress: number;
  uploadError: string | null;
}