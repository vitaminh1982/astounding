import React, { useState } from 'react';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import { useChatLogic } from './hooks/useChatLogic';
import { ChatInterfaceProps } from './types';

/**
 * Main ChatInterface Component
 * Orchestrates the chat functionality with header, messages, and input
 */
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
  // Local state for enhanced prompt input
  const [localPromptInput, setLocalPromptInput] = useState(promptInput);
  
  // Custom hook for chat logic
  const {
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
    toggleVoiceConversation,
    toggleDictationMode,
    handleVoiceRecording,
    speakText,
    stopSpeaking,
    toggleTTS,
    handleTextInput,
    formatFileSize,
    formatRecordingTime,
    setShowModelOptions
  } = useChatLogic([], () => {}, () => {});

  // Sync local state with parent prop
  React.useEffect(() => {
    setLocalPromptInput(promptInput);
  }, [promptInput]);

  // Auto-speak AI responses when they arrive (only for voice inputs)
  React.useEffect(() => {
    if (conversationHistory.length > 0) {
      const lastMessage = conversationHistory[conversationHistory.length - 1];
      
      // Only speak AI responses that follow voice input
      if (lastMessage.type === 'ai' && lastInputWasVoice && ttsState.isEnabled) {
        let textToSpeak = '';
        
        if (lastMessage.content?.finalResponse) {
          if (typeof lastMessage.content.finalResponse === 'string') {
            textToSpeak = lastMessage.content.finalResponse;
          } else {
            // Extract text from JSX elements for TTS
            const extractTextFromJSX = (element: any): string => {
              if (typeof element === 'string') return element;
              if (typeof element === 'number') return element.toString();
              if (React.isValidElement(element)) {
                if (element.props.children) {
                  if (Array.isArray(element.props.children)) {
                    return element.props.children.map(extractTextFromJSX).join(' ');
                  }
                  return extractTextFromJSX(element.props.children);
                }
              }
              return '';
            };
            
            textToSpeak = extractTextFromJSX(lastMessage.content.finalResponse);
          }
        }
        
        if (textToSpeak.trim()) {
          // Small delay to ensure message is rendered before speaking
          setTimeout(() => {
            speakText(textToSpeak);
          }, 500);
        }
      }
    }
  }, [conversationHistory, lastInputWasVoice, ttsState.isEnabled, speakText]);

  // Enhanced input change handler
  const handleInputChange = (value: string) => {
    const processedValue = handleTextInput(value);
    setLocalPromptInput(processedValue);
    setPromptInput(value);
  };

  // Enhanced send handler with attachments and model selection
  const handleEnhancedSend = () => {
    if (!localPromptInput.trim() && attachments.length === 0) return;
    
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
    
    handleSendPrompt();
    setLocalPromptInput('');
    removeAttachment(''); // Clear attachments after sending
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

  // Enhanced voice recording with input population
  const handleEnhancedVoiceRecording = async () => {
    try {
      const transcription = await handleVoiceRecording();
      if (transcription.trim()) {
        handleInputChange(transcription);
      }
    } catch (error) {
      console.error('Voice recording error:', error);
    }
  };

  return (
    <>
      <ChatHeader 
        isModal={isModal}
        setIsChatMaximized={setIsChatMaximized}
      />

      <div className={`overflow-y-auto p-6 bg-gray-50 ${isModal ? 'flex-1' : 'h-96'}`}>
        <MessageList 
          conversationHistory={conversationHistory}
          isLoading={isLoading}
        />
      </div>

      <MessageInput
        promptInput={localPromptInput}
        setPromptInput={handleInputChange}
        onSendMessage={handleEnhancedSend}
        onKeyDown={handleEnhancedKeyDown}
        isLoading={isLoading}
        modelSelection={modelSelection}
        onToggleModelSelection={toggleModelSelection}
        attachments={attachments}
        onFileSelect={handleFileSelect}
        onRemoveAttachment={removeAttachment}
        voiceConversation={voiceConversation}
        onToggleVoiceConversation={toggleVoiceConversation}
        voiceState={voiceState}
        ttsState={ttsState}
        onVoiceRecording={handleEnhancedVoiceRecording}
        onToggleTTS={toggleTTS}
        onStopSpeaking={stopSpeaking}
        isDictationMode={isDictationMode}
        onToggleDictationMode={toggleDictationMode}
        showModelOptions={showModelOptions}
        onToggleModelOptions={() => setShowModelOptions(!showModelOptions)}
        onClearAllModelSelections={clearAllModelSelections}
        onTextInput={handleTextInput}
        formatFileSize={formatFileSize}
        formatRecordingTime={formatRecordingTime}
      />
    </>
  );
};

export default React.memo(ChatInterface);