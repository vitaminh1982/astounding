import React from 'react';
import { useState, useRef, useCallback } from 'react';
import { 
  Message, 
  ModelSelection, 
  AttachmentFile, 
  VoiceConversationState, 
  VoiceRecordingState,
  TextToSpeechState
} from '../types';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export const useChatLogic = (
  conversationHistory: Message[],
  setConversationHistory: React.Dispatch<React.SetStateAction<Message[]>>,
  generateAIResponse: (prompt: string) => any
) => {
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [lastInputWasVoice, setLastInputWasVoice] = useState(false);
  
  // Simplified voice recording state - single source of truth
  const [voiceState, setVoiceState] = useState<VoiceRecordingState>({
    isRecording: false,
    isTranscribing: false,
    recordingTime: 0,
    mediaRecorder: null,
    audioChunks: []
  });

  // Text-to-speech state
  const [ttsState, setTtsState] = useState<TextToSpeechState>({
    isSpeaking: false,
    isEnabled: true,
    voice: null,
    rate: 1.0,
    pitch: 1.0,
    volume: 0.8
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
    isActive: false
  });
  
  const [showModelOptions, setShowModelOptions] = useState(false);
  const [isDictationMode, setIsDictationMode] = useState(false);

  // Initialize text-to-speech with female voice
  const initializeTTS = useCallback(() => {
    if ('speechSynthesis' in window) {
      const voices = speechSynthesis.getVoices();
      
      const femaleVoice = voices.find(voice => 
        voice.lang.startsWith('en') && 
        (voice.name.toLowerCase().includes('female') || 
         voice.name.toLowerCase().includes('woman') ||
         voice.name.toLowerCase().includes('samantha') ||
         voice.name.toLowerCase().includes('karen') ||
         voice.name.toLowerCase().includes('victoria'))
      ) || voices.find(voice => 
        voice.lang.startsWith('en') && voice.name.toLowerCase().includes('zira')
      ) || voices.find(voice => voice.lang.startsWith('en'));
      
      if (femaleVoice) {
        setTtsState(prev => ({ ...prev, voice: femaleVoice }));
      }
    }
  }, []);

  React.useEffect(() => {
    if ('speechSynthesis' in window) {
      if (speechSynthesis.getVoices().length === 0) {
        speechSynthesis.addEventListener('voiceschanged', initializeTTS);
      } else {
        initializeTTS();
      }
    }
    
    return () => {
      if ('speechSynthesis' in window) {
        speechSynthesis.removeEventListener('voiceschanged', initializeTTS);
      }
    };
  }, [initializeTTS]);

  // Text-to-speech function
  const speakText = useCallback((text: string) => {
    if (!ttsState.isEnabled || !ttsState.voice || !lastInputWasVoice) {
      return;
    }

    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }

    const cleanText = text
      .replace(/[*_`]/g, '')
      .replace(/\n+/g, '. ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    try {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      speechSynthesisRef.current = utterance;
      
      utterance.voice = ttsState.voice;
      utterance.rate = ttsState.rate;
      utterance.pitch = ttsState.pitch;
      utterance.volume = ttsState.volume;
      
      utterance.onstart = () => {
        setTtsState(prev => ({ ...prev, isSpeaking: true }));
      };
      
      utterance.onend = () => {
        setTtsState(prev => ({ ...prev, isSpeaking: false }));
        speechSynthesisRef.current = null;
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        setTtsState(prev => ({ ...prev, isSpeaking: false }));
        speechSynthesisRef.current = null;
      };
      
      speechSynthesis.speak(utterance);
      
    } catch (error) {
      console.error('Error in text-to-speech:', error);
      setTtsState(prev => ({ ...prev, isSpeaking: false }));
    }
  }, [ttsState.isEnabled, ttsState.voice, ttsState.rate, ttsState.pitch, ttsState.volume, lastInputWasVoice]);

  const stopSpeaking = useCallback(() => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    setTtsState(prev => ({ ...prev, isSpeaking: false }));
  }, []);

  const toggleTTS = useCallback(() => {
    setTtsState(prev => {
      const newEnabled = !prev.isEnabled;
      if (!newEnabled && speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
      return { ...prev, isEnabled: newEnabled, isSpeaking: false };
    });
  }, []);

  // Fixed voice recording functions
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

      // Reset recording time and set initial state
      setVoiceState({
        isRecording: true,
        isTranscribing: false,
        mediaRecorder,
        audioChunks,
        recordingTime: 0
      });

      // Fixed timer - update state properly
      recordingIntervalRef.current = setInterval(() => {
        setVoiceState(prev => {
          // Only update if still recording
          if (prev.isRecording) {
            return {
              ...prev,
              recordingTime: prev.recordingTime + 1
            };
          }
          return prev;
        });
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      setVoiceState(prev => ({
        ...prev,
        isRecording: false,
        isTranscribing: false
      }));
    }
  }, []);

  const stopRecording = useCallback((): Promise<string> => {
    return new Promise((resolve, reject) => {
      const currentState = voiceState;
      
      if (!currentState.mediaRecorder) {
        reject(new Error('No active recording'));
        return;
      }

      // Clear interval immediately
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }

      currentState.mediaRecorder.onstop = async () => {
        try {
          const stream = currentState.mediaRecorder?.stream;
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }

          // Update state to show transcribing
          setVoiceState(prev => ({
            ...prev,
            isRecording: false,
            isTranscribing: true
          }));

          const audioBlob = new Blob(currentState.audioChunks, { type: 'audio/wav' });
          const transcription = await transcribeAudio(audioBlob);
          
          // Reset state completely
          setVoiceState({
            isRecording: false,
            isTranscribing: false,
            mediaRecorder: null,
            audioChunks: [],
            recordingTime: 0
          });

          setLastInputWasVoice(true);
          resolve(transcription);
          
        } catch (error) {
          // Reset state on error
          setVoiceState({
            isRecording: false,
            isTranscribing: false,
            mediaRecorder: null,
            audioChunks: [],
            recordingTime: 0
          });
          reject(error);
        }
      };

      currentState.mediaRecorder.stop();
    });
  }, [voiceState]);

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
    setLastInputWasVoice(false);
    
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

  const toggleDictationMode = useCallback(() => {
    setIsDictationMode(!isDictationMode);
  }, [isDictationMode]);

  // Simplified voice recording handler
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
      // Reset state on error
      setVoiceState({
        isRecording: false,
        isTranscribing: false,
        mediaRecorder: null,
        audioChunks: [],
        recordingTime: 0
      });
    }
    return '';
  }, [voiceState.isRecording, stopRecording, startRecording]);

  const handleTextInput = useCallback((value: string) => {
    setLastInputWasVoice(false);
    return value;
  }, []);

  const toggleVoiceConversation = useCallback(() => {
    setVoiceConversation(prev => ({
      isActive: !prev.isActive
    }));
  }, []);

  // Cleanup function
  React.useEffect(() => {
    return () => {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
      
      if (voiceState.mediaRecorder?.stream) {
        voiceState.mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [voiceState.mediaRecorder]);

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
    ttsState,
    modelSelection,
    attachments,
    voiceConversation,
    showModelOptions,
    isDictationMode,
    lastInputWasVoice,
    handleFileSelect,
    removeAttachment,
    toggleModelSelection,
    clearAllModelSelections,
    toggleDictationMode,
    handleVoiceRecording,
    toggleVoiceConversation,
    speakText,
    stopSpeaking,
    toggleTTS,
    handleTextInput,
    formatFileSize,
    formatRecordingTime,
    setShowModelOptions,
    // Expose individual recording states for UI
    isRecording: voiceState.isRecording,
    isTranscribing: voiceState.isTranscribing,
    recordingTime: voiceState.recordingTime,
    isSpeaking: ttsState.isSpeaking
  };
};
