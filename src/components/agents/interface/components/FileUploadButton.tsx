import React, { useRef } from 'react';
import { Upload, FileText, Loader } from 'lucide-react';
import { FileUploadState } from '../types';

interface FileUploadButtonProps {
  uploadState: FileUploadState;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => Promise<string>;
  disabled?: boolean;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  uploadState,
  onFileChange,
  onUpload,
  disabled = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (uploadState.selectedFile && !uploadState.isUploading) {
      onUpload();
    } else if (!uploadState.selectedFile) {
      fileInputRef.current?.click();
    }
  };

  const getButtonContent = () => {
    if (uploadState.isUploading) {
      return (
        <>
          <Loader className="w-4 h-4 animate-spin" />
          <span className="text-xs">{uploadState.uploadProgress}%</span>
        </>
      );
    }
    
    if (uploadState.selectedFile) {
      return (
        <>
          <FileText className="w-4 h-4" />
          <span className="text-xs">Upload</span>
        </>
      );
    }
    
    return <Upload className="w-4 h-4" />;
  };

  const getButtonStyles = () => {
    if (disabled) {
      return 'bg-gray-200 text-gray-400 cursor-not-allowed';
    }
    
    if (uploadState.isUploading) {
      return 'bg-blue-500 text-white';
    }
    
    if (uploadState.selectedFile) {
      return 'bg-green-500 text-white hover:bg-green-600';
    }
    
    return 'bg-gray-100 text-gray-600 hover:bg-gray-200';
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        onChange={onFileChange}
        accept=".pdf,.doc,.docx,.txt"
        className="hidden"
        disabled={disabled}
      />
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || uploadState.isUploading}
        className={`
          flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200
          min-w-[60px] h-12
          ${getButtonStyles()}
        `}
        aria-label={
          uploadState.selectedFile 
            ? 'Upload selected file' 
            : 'Select file to upload'
        }
      >
        {getButtonContent()}
      </button>
    </>
  );
};

export default React.memo(FileUploadButton);