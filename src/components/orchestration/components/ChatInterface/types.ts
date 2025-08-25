// Shared types for ChatInterface components

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

export interface ModelSelection {
  textOnly: boolean;
  imageOnly: boolean;
  webResearchOnly: boolean;
  reasoningOnly: boolean;
}

export interface AttachmentFile {
  id: string;
  file: File;
  preview?: string;
  type: 'image' | 'document' | 'other';
}

export interface VoiceConversationState {
  isActive: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  autoListen: boolean;
}

export interface VoiceRecordingState {
  isRecording: boolean;
  isTranscribing: boolean;
  recordingTime: number;
  mediaRecorder: MediaRecorder | null;
  audioChunks: Blob[];
}

export interface TextToSpeechState {
  isSpeaking: boolean;
  isEnabled: boolean;
  voice: SpeechSynthesisVoice | null;
  rate: number;
  pitch: number;
  volume: number;
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