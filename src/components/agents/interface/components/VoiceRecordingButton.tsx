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
            <div className="absolute -inset-1 rounded-full bg-red-500 dark:bg-red-400 animate-ping opacity-75" />
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
      return 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed';
    }
    
    if (voiceState.isRecording) {
      return 'bg-red-500 dark:bg-red-600 text-white hover:bg-red-600 dark:hover:bg-red-700';
    }
    
    if (voiceState.isTranscribing) {
      return 'bg-blue-500 dark:bg-teal-600 text-white';
    }
    
    return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600';
  };

  const getFocusStyles = () => {
    if (voiceState.isRecording) {
      return 'focus:ring-red-500 dark:focus:ring-red-400';
    }
    
    if (voiceState.isTranscribing) {
      return 'focus:ring-blue-500 dark:focus:ring-teal-500';
    }
    
    return 'focus:ring-gray-500 dark:focus:ring-gray-400';
  };

  return (
    <button
      type="button"
      onClick={handleRecordingClick}
      disabled={disabled || voiceState.isTranscribing}
      className={`
        flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200
        min-w-[60px] h-12
        focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800
        ${getButtonStyles()}
        ${getFocusStyles()}
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
