import React, { useRef, useEffect } from 'react';
import { 
  Bot, User, Send, Search, Mic, MicOff, Loader, Maximize2, Minimize2, X,
  Paperclip, FileText, Image, Globe, Brain, MessageSquare, Volume2, VolumeX,
  Type, Eye, Zap, Upload, Check, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatInterfaceProps } from '../types';

// Enhanced interfaces for new features
interface ModelSelection {
  textOnly: boolean;
  imageOnly: boolean;
  webResearchOnly: boolean;
  reasoningOnly: boolean;
}

interface AttachmentFile {
  id: string;
  file: File;
  preview?: string;
  type: 'image' | 'document' | 'other';
}

interface VoiceConversationState {
  isActive: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  autoListen: boolean;
}

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
  
  // File input ref for attachments
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Voice recording state
  const [voiceState, setVoiceState] = React.useState<VoiceRecordingState>({
    isRecording: false,
    isTranscribing: false,
    recordingTime: 0,
    mediaRecorder: null,
    audioChunks: []
  });

  // New feature states
  const [modelSelection, setModelSelection] = React.useState<ModelSelection>({
    textOnly: false,
    imageOnly: false,
    webResearchOnly: false,
    reasoningOnly: false
  });
  
  const [attachments, setAttachments] = React.useState<AttachmentFile[]>([]);
  const [voiceConversation, setVoiceConversation] = React.useState<VoiceConversationState>({
    isActive: false,
    isListening: false,
    isSpeaking: false,
    autoListen: false
  });
  
  const [showModelOptions, setShowModelOptions] = React.useState(false);
  const [isDictationMode, setIsDictationMode] = React.useState(false);
  
  // Enhanced prompt input state to handle voice transcription
  const [localPromptInput, setLocalPromptInput] = React.useState(promptInput);
  
  // Sync local state with parent prop
  React.useEffect(() => {
    setLocalPromptInput(promptInput);
  }, [promptInput]);

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

  // Enhanced voice recording handler with dictation support
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
          setLocalPromptInput(transcription);
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

  // File attachment handlers
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    files.forEach(file => {
      const attachment: AttachmentFile = {
        id: `attachment-${Date.now()}-${Math.random()}`,
        file,
        type: file.type.startsWith('image/') ? 'image' : 
              file.type.includes('pdf') || file.type.includes('document') ? 'document' : 'other'
      };
      
      // Create preview for images
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
    
    // Clear the input
    if (event.target) {
      event.target.value = '';
    }
  };

  const removeAttachment = (attachmentId: string) => {
    setAttachments(prev => prev.filter(att => att.id !== attachmentId));
  };

  // Model selection handlers
  const toggleModelSelection = (model: keyof ModelSelection) => {
    setModelSelection(prev => ({
      ...prev,
      [model]: !prev[model]
    }));
  };

  const clearAllModelSelections = () => {
    setModelSelection({
      textOnly: false,
      imageOnly: false,
      webResearchOnly: false,
      reasoningOnly: false
    });
  };

  // Voice conversation handlers
  const toggleVoiceConversation = () => {
    setVoiceConversation(prev => ({
      ...prev,
      isActive: !prev.isActive,
      isListening: false,
      isSpeaking: false
    }));
  };

  // Dictation mode handler
  const toggleDictationMode = () => {
    setIsDictationMode(!isDictationMode);
    if (!isDictationMode) {
      // Start continuous dictation
      handleVoiceRecording();
    }
  };

  // Enhanced send handler with attachments and model selection
  const handleEnhancedSend = () => {
    if (!localPromptInput.trim() && attachments.length === 0) return;
    
    // Include model selection and attachments in the send logic
    const messageData = {
      text: localPromptInput,
      attachments: attachments.map(att => ({
        name: att.file.name,
        type: att.type,
        size: att.file.size
      })),
      modelPreferences: Object.entries(modelSelection)
        .filter(([_, enabled]) => enabled)
        .map(([model, _]) => model)
    };
    
    console.log('Sending enhanced message:', messageData);
    
    // Call original send handler
    handleSendPrompt();
    
    // Clear local state
    setLocalPromptInput('');
    setAttachments([]);
  };

  // Enhanced key handler
  const handleEnhancedKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEnhancedSend();
    } else {
      handleKeyDown(e);
    }
  };

  // Format file size helper
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get active model count
  const getActiveModelCount = () => {
    return Object.values(modelSelection).filter(Boolean).length;
  };

  // Model selection options
  const modelOptions = [
    { key: 'textOnly', label: 'Text Only', icon: Type, color: 'blue' },
    { key: 'imageOnly', label: 'Image Processing', icon: Eye, color: 'purple' },
    { key: 'webResearchOnly', label: 'Web Research', icon: Globe, color: 'green' },
    { key: 'reasoningOnly', label: 'Advanced Reasoning', icon: Brain, color: 'orange' }
  ] as const;

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

  // Show send button when there's text input or attachments
  const shouldShowSendButton = localPromptInput.trim() || attachments.length > 0;

  // Update parent prompt input when local changes
  const handleInputChange = (value: string) => {
    setLocalPromptInput(value);
    setPromptInput(value);
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
        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {attachments.map(attachment => (
              <div key={attachment.id} className="relative bg-gray-50 border rounded-lg p-2 flex items-center gap-2 max-w-xs">
                {attachment.type === 'image' && attachment.preview ? (
                  <img src={attachment.preview} alt="Preview" className="w-8 h-8 rounded object-cover" />
                ) : (
                  <FileText className="w-5 h-5 text-gray-500" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{attachment.file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(attachment.file.size)}</p>
                </div>
                <button
                  onClick={() => removeAttachment(attachment.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* Model Selection Panel */}
        {showModelOptions && (
          <div className="mb-4 p-4 bg-gray-50 border rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-medium text-gray-700">AI Model Selection</h4>
              <button
                onClick={clearAllModelSelections}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Clear All
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {modelOptions.map(({ key, label, icon: Icon, color }) => (
                <button
                  key={key}
                  onClick={() => toggleModelSelection(key)}
                  className={`flex items-center gap-2 p-2 rounded-lg border transition-colors ${
                    modelSelection[key]
                      ? `bg-${color}-50 border-${color}-200 text-${color}-700`
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-medium">{label}</span>
                  {modelSelection[key] && <Check className="w-3 h-3 ml-auto" />}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200">
          <Search className="w-5 h-5 text-gray-500 flex-shrink-0" />
          
          {/* Enhanced Input Area */}
          <textarea
            className="flex-1 resize-none bg-transparent py-2 focus:outline-none text-gray-900 placeholder-gray-600 text-sm font-medium"
            rows={1}
            placeholder={
              isDictationMode 
                ? "Dictation mode active - speak your message..."
                : voiceConversation.isActive
                ? "Voice conversation mode - speak or type..."
                : "Ask about agents, workflows, system status, or request assistance..."
            }
            value={localPromptInput}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleEnhancedKeyDown}
            disabled={isLoading}
            style={{ minHeight: '40px', maxHeight: '120px' }}
          />
          
          {/* Enhanced Control Buttons */}
          <div className="flex items-center gap-2">
            {/* File Attachment Button */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx,.txt"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              title="Attach files"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            
            {/* Model Selection Toggle */}
            <button
              onClick={() => setShowModelOptions(!showModelOptions)}
              className={`p-2 rounded-lg transition-colors ${
                showModelOptions || getActiveModelCount() > 0
                  ? 'bg-indigo-100 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              title="Select AI models"
            >
              <Brain className="w-4 h-4" />
            </button>
            
            {/* Dictation Mode Toggle */}
            <button
              onClick={toggleDictationMode}
              disabled={isLoading}
              className={`p-2 rounded-lg transition-colors ${
                isDictationMode
                  ? 'bg-purple-100 text-purple-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              title={isDictationMode ? 'Disable dictation mode' : 'Enable dictation mode'}
            >
              <MessageSquare className="w-4 h-4" />
            </button>
            
            {/* Voice Recording Button */}
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
            
            {/* Voice Conversation Toggle */}
            <button
              onClick={toggleVoiceConversation}
              className={`p-2 rounded-lg transition-colors ${
                voiceConversation.isActive 
                  ? 'bg-green-100 text-green-600' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              title={voiceConversation.isActive ? 'Disable voice conversation' : 'Enable voice conversation'}
            >
              {voiceConversation.isActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            
            {/* Model Selection Indicator */}
            {getActiveModelCount() > 0 && (
              <span className="px-2 py-1 bg-indigo-100 text-indigo-600 text-xs rounded-full font-medium">
                {getActiveModelCount()} model{getActiveModelCount() > 1 ? 's' : ''} selected
              </span>
            )}
            
            {/* Enhanced Send Button - Only show when there's content */}
            {shouldShowSendButton && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                onClick={handleEnhancedSend}
                disabled={isLoading}
                className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm transition-colors"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </div>
        
        {/* Enhanced Status Indicators */}
        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
          <div className="flex items-center gap-4">
            {voiceConversation.isActive && (
              <span className="flex items-center gap-1 text-green-600">
                <Volume2 className="w-3 h-3" />
                Voice mode active
              </span>
            )}
            {isDictationMode && (
              <span className="flex items-center gap-1 text-purple-600">
                <Mic className="w-3 h-3" />
                Dictation mode
              </span>
            )}
            {attachments.length > 0 && (
              <span className="flex items-center gap-1 text-blue-600">
                <Paperclip className="w-3 h-3" />
                {attachments.length} file{attachments.length > 1 ? 's' : ''} attached
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {getActiveModelCount() > 0 && (
              <span className="text-indigo-600">
                {getActiveModelCount()} model{getActiveModelCount() > 1 ? 's' : ''} selected
              </span>
            )}
            <span
              className={`p-2 rounded-lg transition-colors ${
                localPromptInput.length > 0 ? 'text-gray-700' : 'text-gray-400'
              }`}
            >
              {localPromptInput.length}/1000
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(ChatInterface);