import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Send, Paperclip, Brain, MessageSquare, Mic, MicOff, 
  Loader, Volume2, VolumeX, Type, Eye, Globe, Check, X, FileText, Speaker
} from 'lucide-react';
import { 
  ModelSelection, 
  AttachmentFile, 
  VoiceConversationState, 
  VoiceRecordingState,
  TextToSpeechState
} from '../types';

interface MessageInputProps {
  promptInput: string;
  setPromptInput: (value: string) => void;
  onSendMessage: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  isLoading: boolean;
  modelSelection: ModelSelection;
  onToggleModelSelection: (model: keyof ModelSelection) => void;
  attachments: AttachmentFile[];
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveAttachment: (attachmentId: string) => void;
  voiceConversation: VoiceConversationState;
  onToggleVoiceConversation: () => void;
  voiceState: VoiceRecordingState;
  ttsState: TextToSpeechState;
  onVoiceRecording: () => void;
  onToggleTTS: () => void;
  onStopSpeaking: () => void;
  isDictationMode: boolean;
  onToggleDictationMode: () => void;
  showModelOptions: boolean;
  onToggleModelOptions: () => void;
  onClearAllModelSelections: () => void;
  onTextInput: (value: string) => string;
  formatFileSize: (bytes: number) => string;
  formatRecordingTime: (seconds: number) => string;
}

/**
 * MessageInput Component
 * Handles all input functionality including text, voice, files, and model selection
 */
const MessageInput: React.FC<MessageInputProps> = ({
  promptInput,
  setPromptInput,
  onSendMessage,
  onKeyDown,
  isLoading,
  modelSelection,
  onToggleModelSelection,
  attachments,
  onFileSelect,
  onRemoveAttachment,
  voiceConversation,
  onToggleVoiceConversation,
  voiceState,
  ttsState,
  onVoiceRecording,
  onToggleTTS,
  onStopSpeaking,
  isDictationMode,
  onToggleDictationMode,
  showModelOptions,
  onToggleModelOptions,
  onClearAllModelSelections,
  onTextInput,
  formatFileSize,
  formatRecordingTime
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const shouldShowSendButton = promptInput.trim() || attachments.length > 0;
  const getActiveModelCount = () => Object.values(modelSelection).filter(Boolean).length;

  const modelOptions = [
    { key: 'textOnly', label: 'Text Only', icon: Type, color: 'blue' },
    { key: 'imageOnly', label: 'Image Processing', icon: Eye, color: 'purple' },
    { key: 'webResearchOnly', label: 'Web Research', icon: Globe, color: 'green' },
    { key: 'reasoningOnly', label: 'Advanced Reasoning', icon: Brain, color: 'orange' }
  ] as const;

  // Enhanced input change handler to track input method
  const handleInputChange = (value: string) => {
    onTextInput(value); // Mark as text input
    setPromptInput(value);
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
                onClick={() => onRemoveAttachment(attachment.id)}
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
              onClick={onClearAllModelSelections}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear All
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {modelOptions.map(({ key, label, icon: Icon, color }) => (
              <button
                key={key}
                onClick={() => onToggleModelSelection(key)}
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
      
      {/* Main Input Area */}
      <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200">
        <Search className="w-5 h-5 text-gray-500 flex-shrink-0" />
        
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
          value={promptInput}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={isLoading}
          style={{ minHeight: '40px', maxHeight: '120px' }}
        />
        
        {/* Control Buttons */}
        <div className="flex items-center gap-2">
          {/* File Attachment Button */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.txt"
            onChange={onFileSelect}
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
            onClick={onToggleModelOptions}
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
            onClick={onToggleDictationMode}
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
          
          {/* Text-to-Speech Toggle */}
          <button
            onClick={ttsState.isSpeaking ? onStopSpeaking : onToggleTTS}
            disabled={isLoading}
            className={`p-2 rounded-lg transition-colors ${
              ttsState.isSpeaking
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : ttsState.isEnabled
                ? 'bg-green-100 text-green-600'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
            title={
              ttsState.isSpeaking 
                ? 'Stop speaking' 
                : ttsState.isEnabled 
                ? 'Disable text-to-speech' 
                : 'Enable text-to-speech'
            }
          >
            <Speaker className="w-4 h-4" />
          </button>

          {/* Voice Recording Button */}
          <button
            onClick={onVoiceRecording}
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
            onClick={onToggleVoiceConversation}
            className={`p-2 rounded-lg transition-colors ${
              voiceConversation.isActive 
                ? 'bg-green-100 text-green-600' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
            title={voiceConversation.isActive ? 'Disable voice conversation' : 'Enable voice conversation'}
          >
            {voiceConversation.isActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          
          {/* Enhanced Send Button - Only show when there's content */}
          {shouldShowSendButton && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={onSendMessage}
              disabled={isLoading}
              className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm transition-colors"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>
      
      {/* Status Indicators */}
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
          {ttsState.isEnabled && (
            <span className="flex items-center gap-1 text-green-600">
              <Speaker className="w-3 h-3" />
              {ttsState.isSpeaking ? 'Speaking...' : 'TTS enabled'}
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
              promptInput.length > 0 ? 'text-gray-700' : 'text-gray-400'
            }`}
          >
            {promptInput.length}/1000
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(MessageInput);