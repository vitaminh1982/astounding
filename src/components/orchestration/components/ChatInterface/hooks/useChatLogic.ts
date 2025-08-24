import { useState, useRef, useCallback } from 'react';
import { 
  Message, 
  ModelSelection, 
  AttachmentFile, 
  VoiceConversationState, 
  VoiceRecordingState 
} from '../types';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

/**
 * Custom hook for managing chat logic including voice recording and file handling
 */
export const useChatLogic = (
  conversationHistory: Message[],
  setConversationHistory: React.Dispatch<React.SetStateAction<Message[]>>,
  generateAIResponse: (prompt: string) => any
) => {
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Voice recording state
  const [voiceState, setVoiceState] = useState<VoiceRecordingState>({
    isRecording: false,
    isTranscribing: false,
    recordingTime: 0,
    mediaRecorder: null,
    audioChunks: []
  });

  // Feature states
  const [modelSelection, setModelSelection] = useState<ModelSelection>({
    textOnly: false,
    imageOnly: false,
    webResearchOnly: false,
    reasoningOnly: false
  });
  
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const [voiceConversation, setVoiceConversation] = useState<VoiceConversationState>({
    isActive: false,
    isListening: false,
    isSpeaking: false,
    autoListen: false
  });
  
  const [showModelOptions, setShowModelOptions] = useState(false);
  const [isDictationMode, setIsDictationMode] = useState(false);

  // Voice recording functions
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.start();

      setVoiceState(prev => ({
        ...prev,
        isRecording: true,
        mediaRecorder,
        audioChunks,
        recordingTime: 0
      }));

      recordingIntervalRef.current = setInterval(() => {
        setVoiceState(prev => ({
          ...prev,
          recordingTime: prev.recordingTime + 1
        }));
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
    }
  }, []);

  const stopRecording = useCallback((): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!voiceState.mediaRecorder) {
        reject(new Error('No active recording'));
        return;
      }

      voiceState.mediaRecorder.onstop = async () => {
        try {
          if (recordingIntervalRef.current) {
            clearInterval(recordingIntervalRef.current);
            recordingIntervalRef.current = null;
          }

          const stream = voiceState.mediaRecorder?.stream;
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }

          setVoiceState(prev => ({
            ...prev,
            isRecording: false,
            isTranscribing: true
          }));

          const audioBlob = new Blob(voiceState.audioChunks, { type: 'audio/wav' });
          const transcription = await transcribeAudio(audioBlob);
          
          setVoiceState(prev => ({
            ...prev,
            isTranscribing: false,
            mediaRecorder: null,
            audioChunks: [],
            recordingTime: 0
          }));

          resolve(transcription);
        } catch (error) {
          setVoiceState(prev => ({
            ...prev,
            isRecording: false,
            isTranscribing: false,
            mediaRecorder: null,
            audioChunks: [],
            recordingTime: 0
          }));
          reject(error);
        }
      };

      voiceState.mediaRecorder.stop();
    });
  }, [voiceState.mediaRecorder, voiceState.audioChunks]);

  const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.wav');
    formData.append('model', 'whisper-1');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to transcribe audio');
    }

    const result = await response.json();
    return result.text || '';
  };

  // File handling functions
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    files.forEach(file => {
      const attachment: AttachmentFile = {
        id: `attachment-${Date.now()}-${Math.random()}`,
        file,
        type: file.type.startsWith('image/') ? 'image' : 
              file.type.includes('pdf') || file.type.includes('document') ? 'document' : 'other'
      };
      
      if (attachment.type === 'image') {
        const reader = new FileReader();
        reader.onload = (e) => {
          setAttachments(prev => prev.map(att => 
            att.id === attachment.id ? { ...att, preview: e.target?.result as string } : att
          ));
        };
        reader.readAsDataURL(file);
      }
      
      setAttachments(prev => [...prev, attachment]);
    });
    
    if (event.target) {
      event.target.value = '';
    }
  }, []);

  const removeAttachment = useCallback((attachmentId: string) => {
    setAttachments(prev => prev.filter(att => att.id !== attachmentId));
  }, []);

  // Model selection functions
  const toggleModelSelection = useCallback((model: keyof ModelSelection) => {
    setModelSelection(prev => ({
      ...prev,
      [model]: !prev[model]
    }));
  }, []);

  const clearAllModelSelections = useCallback(() => {
    setModelSelection({
      textOnly: false,
      imageOnly: false,
      webResearchOnly: false,
      reasoningOnly: false
    });
  }, []);

  // Voice functions
  const toggleVoiceConversation = useCallback(() => {
    setVoiceConversation(prev => ({
      ...prev,
      isActive: !prev.isActive,
      isListening: false,
      isSpeaking: false
    }));
  }, []);

  const toggleDictationMode = useCallback(() => {
    setIsDictationMode(!isDictationMode);
  }, [isDictationMode]);

  const handleVoiceRecording = useCallback(async () => {
    try {
      if (voiceState.isRecording) {
        const transcription = await stopRecording();
        if (transcription.trim()) {
          return transcription;
        }
      } else {
        await startRecording();
      }
    } catch (error) {
      console.error('Voice recording error:', error);
    }
    return '';
  }, [voiceState.isRecording, stopRecording, startRecording]);

  // Utility functions
  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  const formatRecordingTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    voiceState,
    modelSelection,
    attachments,
    voiceConversation,
    showModelOptions,
    isDictationMode,
    handleFileSelect,
    removeAttachment,
    toggleModelSelection,
    clearAllModelSelections,
    toggleVoiceConversation,
    toggleDictationMode,
    handleVoiceRecording,
    formatFileSize,
    formatRecordingTime,
    setShowModelOptions
  };
};