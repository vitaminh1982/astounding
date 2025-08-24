import React from 'react';
import { Send } from 'lucide-react';
import VoiceRecordingButton from './VoiceRecordingButton';
import FileUploadButton from './FileUploadButton';
import { VoiceRecordingState, FileUploadState } from '../types';

interface ChatInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  isLoading: boolean;
  isTyping: boolean;
  isAgentActive: boolean;
  voiceState: VoiceRecordingState;
  uploadState: FileUploadState;
  onStartRecording: () => Promise<void>;
  onStopRecording: () => Promise<string>;
  onFileSelect: (file: File) => boolean;
  onFileUpload: () => Promise<string>;
  onClearFile: () => void;
  formatRecordingTime: (seconds: number) => string;
  formatFileSize: (bytes: number) => string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  newMessage,
  setNewMessage,
  onSendMessage,
  isLoading,
  isTyping,
  isAgentActive,
  voiceState,
  uploadState,
  onStartRecording,
  onStopRecording,
  onFileSelect,
  onFileUpload,
  onClearFile,
  formatRecordingTime,
  formatFileSize
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <form onSubmit={onSendMessage} className="mt-4">
      {/* File upload preview */}
      {uploadState.selectedFile && (
        <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-blue-600">📄</span>
              <div>
                <p className="text-sm font-medium text-blue-800">
                  {uploadState.selectedFile.name}
                </p>
                <p className="text-xs text-blue-600">
                  {formatFileSize(uploadState.selectedFile.size)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {uploadState.isUploading && (
                <div className="text-xs text-blue-600">
                  {uploadState.uploadProgress}%
                </div>
              )}
              <button
                type="button"
                onClick={onClearFile}
                className="text-blue-600 hover:text-blue-800"
                disabled={uploadState.isUploading}
              >
                ✕
              </button>
            </div>
          </div>
          {uploadState.isUploading && (
            <div className="mt-2 w-full bg-blue-200 rounded-full h-1">
              <div 
                className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                style={{ width: `${uploadState.uploadProgress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* Error display */}
      {uploadState.uploadError && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{uploadState.uploadError}</p>
        </div>
      )}

      <div className="flex gap-2">
        <div className="flex gap-1">
          <VoiceRecordingButton
            voiceState={voiceState}
            onStartRecording={onStartRecording}
            onStopRecording={onStopRecording}
            formatRecordingTime={formatRecordingTime}
            disabled={isLoading || !isAgentActive}
          />
          
          <FileUploadButton
            uploadState={uploadState}
            onFileChange={handleFileChange}
            onUpload={onFileUpload}
            disabled={isLoading || !isAgentActive}
          />
        </div>
        
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={isAgentActive ? "Type your message..." : "Agent is deactivated"}
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={isLoading || isTyping || !isAgentActive}
        />
        
        <button
          type="submit"
          className={`bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors ${
            isLoading || isTyping || !newMessage.trim() || !isAgentActive
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-indigo-700'
          }`}
          disabled={isLoading || isTyping || !newMessage.trim() || !isAgentActive}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};

export default React.memo(ChatInput);