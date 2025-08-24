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
  } = useChatLogic([], () => {}, () => {});

  // Sync local state with parent prop
  React.useEffect(() => {
    setLocalPromptInput(promptInput);
  }, [promptInput]);

  // Enhanced input change handler
  const handleInputChange = (value: string) => {
    setLocalPromptInput(value);
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
        onVoiceRecording={handleEnhancedVoiceRecording}
        isDictationMode={isDictationMode}
        onToggleDictationMode={toggleDictationMode}
        showModelOptions={showModelOptions}
        onToggleModelOptions={() => setShowModelOptions(!showModelOptions)}
        onClearAllModelSelections={clearAllModelSelections}
        formatFileSize={formatFileSize}
        formatRecordingTime={formatRecordingTime}
      />
    </>
  );
};

export default React.memo(ChatInterface);