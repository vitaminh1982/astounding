import { useState, useRef, useCallback } from 'react';
import { VoiceRecordingState } from '../types';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export const useVoiceRecording = () => {
  const [voiceState, setVoiceState] = useState<VoiceRecordingState>({
    isRecording: false,
    isTranscribing: false,
    recordingTime: 0,
    mediaRecorder: null,
    audioChunks: []
  });

  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

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

      // Start recording timer
      recordingIntervalRef.current = setInterval(() => {
        setVoiceState(prev => ({
          ...prev,
          recordingTime: prev.recordingTime + 1
        }));
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      throw new Error('Failed to access microphone. Please check permissions.');
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
          // Clear recording timer
          if (recordingIntervalRef.current) {
            clearInterval(recordingIntervalRef.current);
            recordingIntervalRef.current = null;
          }

          // Stop all tracks
          const stream = voiceState.mediaRecorder?.stream;
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }

          setVoiceState(prev => ({
            ...prev,
            isRecording: false,
            isTranscribing: true
          }));

          // Create audio blob
          const audioBlob = new Blob(voiceState.audioChunks, { type: 'audio/wav' });
          
          // Transcribe audio using OpenAI Whisper
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

  const formatRecordingTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    voiceState,
    startRecording,
    stopRecording,
    formatRecordingTime
  };
};