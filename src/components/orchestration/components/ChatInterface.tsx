import React, { useRef, useEffect } from 'react';
import { Bot, User, Send, Search, Mic, MicOff, Loader, Maximize2, Minimize2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatInterfaceProps } from '../types';

// Voice recording state interface
interface VoiceRecordingState {
  isRecording: boolean;
  isTranscribing: boolean;
  recordingTime: number;
  mediaRecorder: MediaRecorder | null;
  audioChunks: Blob[];
}

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  conversationHistory,
  isLoading,
  promptInput,
  setPromptInput,
  handleSendPrompt,
  handleKeyDown,
  isModal,
  setIsChatMaximized
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Voice recording state
  const [voiceState, setVoiceState] = React.useState<VoiceRecordingState>({
    isRecording: false,
    isTranscribing: false,
    recordingTime: 0,
    mediaRecorder: null,
    audioChunks: []
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationHistory, isLoading]);

  // Voice recording functions
  const startRecording = async () => {
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
      // You could add a toast notification here
    }
  };

  const stopRecording = (): Promise<string> => {
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
  };

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

  const handleVoiceRecording = async () => {
    try {
      if (voiceState.isRecording) {
        const transcription = await stopRecording();
        if (transcription.trim()) {
          setPromptInput(transcription);
        }
      } else {
        await startRecording();
      }
    } catch (error) {
      console.error('Voice recording error:', error);
      // You could add a toast notification here
    }
  };

  const getVoiceButtonContent = () => {
    if (voiceState.isTranscribing) {
      return (
        <>
          <Loader className="w-4 h-4 animate-spin" />
          <span className="text-xs">Transcribing...</span>
        </>
      );
    }
    
    if (voiceState.isRecording) {
      return (
        <>
          <div className="relative">
            <MicOff className="w-4 h-4" />
            <div className="absolute -inset-1 rounded-full bg-red-500 animate-ping opacity-75" />
          </div>
          <span className="text-xs font-mono">
            {formatRecordingTime(voiceState.recordingTime)}
          </span>
        </>
      );
    }
    
    return <Mic className="w-4 h-4" />;
  };

  const getVoiceButtonStyles = () => {
    if (isLoading) {
      return 'bg-gray-200 text-gray-400 cursor-not-allowed';
    }
    
    if (voiceState.isRecording) {
      return 'bg-red-500 text-white hover:bg-red-600';
    }
    
    if (voiceState.isTranscribing) {
      return 'bg-blue-500 text-white';
    }
    
    return 'text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100';
  };

  return (
    <>
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">AI Assistant</h3>
            <p className="text-sm text-gray-600 font-medium">Multi-Agent Orchestration</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isModal ? (
            <button
              onClick={() => setIsChatMaximized(true)}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Maximize chat"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setIsChatMaximized(false)}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className={`overflow-y-auto p-6 bg-gray-50 ${isModal ? 'flex-1' : 'h-96'}`}>
        <div className="space-y-4">
          <AnimatePresence>
            {conversationHistory.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex items-start max-w-[85%] p-4 rounded-xl shadow-sm ${
                    message.type === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  {message.type === 'ai' && (
                    <Bot className="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0 mt-0.5" />
                  )}
                  {message.type === 'user' && (
                    <User className="w-5 h-5 text-indigo-100 mr-3 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="text-sm">
                    {message.type === 'user' && (
                      <p className="text-white font-medium">{message.text}</p>
                    )}
                    {message.type === 'ai' && message.content && (
                      <>
                        {message.content.reasoningSteps && message.content.reasoningSteps.length > 0 && (
                          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="font-bold text-blue-900 mb-2 flex items-center gap-2 text-sm">
                              <Bot className="w-4 h-4" />
                              Reasoning Process:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                              {message.content.reasoningSteps.map((step, i) => (
                                <li key={i} className="font-medium">{step}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {message.content.agentCalls && message.content.agentCalls.length > 0 && (
                          <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                            <p className="font-bold text-green-900 mb-2 flex items-center gap-2 text-sm">
                              <Bot className="w-4 h-4" />
                              Agent Interactions:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-sm text-green-800">
                              {message.content.agentCalls.map((call, i) => (
                                <li key={i}>
                                  <span className="font-bold text-green-700">{call.agentName}:</span>{' '}
                                  <span className="font-medium">{call.purpose}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <div className="text-sm text-gray-800 leading-relaxed font-medium">
                          {message.content.finalResponse}
                        </div>
                      </>
                    )}
                    <div className={`text-xs mt-2 font-medium ${
                      message.type === 'user' ? 'text-indigo-200' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <Bot className="w-5 h-5 text-indigo-600 mr-3" />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-800 font-medium">Processing</span>
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <div 
                        key={i}
                        className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat Input */}
      <div className="p-6 bg-white border-t border-gray-200">
        <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200">
          <Search className="w-5 h-5 text-gray-500 flex-shrink-0" />
          <textarea
            className="flex-1 resize-none bg-transparent py-2 focus:outline-none text-gray-900 placeholder-gray-600 text-sm font-medium"
            rows={1}
            placeholder="Ask about agents, workflows, system status, or request assistance..."
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            style={{ minHeight: '40px', maxHeight: '120px' }}
          />
          <div className="flex items-center gap-2">
            <button
              onClick={handleVoiceRecording}
              disabled={isLoading}
              className={`
                flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200
                min-w-[60px] h-12
                ${getVoiceButtonStyles()}
              `}
              aria-label={
                voiceState.isRecording 
                  ? 'Stop recording' 
                  : voiceState.isTranscribing 
                  ? 'Transcribing audio' 
                  : 'Start voice recording'
              }
            >
              {getVoiceButtonContent()}
            </button>
            <button
              onClick={handleSendPrompt}
              disabled={!promptInput.trim() || isLoading}
              className={`p-2 rounded-lg transition-colors ${
                promptInput.trim() && !isLoading
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(ChatInterface);