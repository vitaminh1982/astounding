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
      return 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed';
    }
    
    if (uploadState.isUploading) {
      return 'bg-blue-500 dark:bg-teal-600 text-white';
    }
    
    if (uploadState.selectedFile) {
      return 'bg-green-500 dark:bg-green-600 text-white hover:bg-green-600 dark:hover:bg-green-700';
    }
    
    return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600';
  };

  const getFocusStyles = () => {
    if (uploadState.isUploading) {
      return 'focus:ring-blue-500 dark:focus:ring-teal-500';
    }
    
    if (uploadState.selectedFile) {
      return 'focus:ring-green-500 dark:focus:ring-green-400';
    }
    
    return 'focus:ring-gray-500 dark:focus:ring-gray-400';
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
          focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800
          ${getButtonStyles()}
          ${getFocusStyles()}
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
