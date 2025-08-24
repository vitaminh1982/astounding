import React from 'react';
import { Mic, MicOff, Loader } from 'lucide-react';
import { VoiceRecordingState } from '../types';

interface VoiceRecordingButtonProps {
  voiceState: VoiceRecordingState;
  onStartRecording: () => Promise<void>;
  onStopRecording: () => Promise<string>;
  formatRecordingTime: (seconds: number) => string;
  disabled?: boolean;
}

const VoiceRecordingButton: React.FC<VoiceRecordingButtonProps> = ({
  voiceState,
  onStartRecording,
  onStopRecording,
  formatRecordingTime,
  disabled = false
}) => {
  const handleRecordingClick = async () => {
    try {
      if (voiceState.isRecording) {
        await onStopRecording();
      } else {
        await onStartRecording();
      }
    } catch (error) {
      console.error('Recording error:', error);
    }
  };

  const getButtonContent = () => {
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

  const getButtonStyles = () => {
    if (disabled) {
      return 'bg-gray-200 text-gray-400 cursor-not-allowed';
    }
    
    if (voiceState.isRecording) {
      return 'bg-red-500 text-white hover:bg-red-600';
    }
    
    if (voiceState.isTranscribing) {
      return 'bg-blue-500 text-white';
    }
    
    return 'bg-gray-100 text-gray-600 hover:bg-gray-200';
  };

  return (
    <button
      type="button"
      onClick={handleRecordingClick}
      disabled={disabled || voiceState.isTranscribing}
      className={`
        flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200
        min-w-[60px] h-12
        ${getButtonStyles()}
      `}
      aria-label={
        voiceState.isRecording 
          ? 'Stop recording' 
          : voiceState.isTranscribing 
          ? 'Transcribing audio' 
          : 'Start voice recording'
      }
    >
      {getButtonContent()}
    </button>
  );
};

export default React.memo(VoiceRecordingButton);