import { useState, useCallback } from 'react';
import { FileUploadState } from '../types';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'
];

export const useFileUpload = () => {
  const [uploadState, setUploadState] = useState<FileUploadState>({
    selectedFile: null,
    isUploading: false,
    uploadProgress: 0,
    uploadError: null
  });

  const validateFile = useCallback((file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 10MB';
    }
    
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Only PDF, DOC, DOCX, and TXT files are allowed';
    }
    
    return null;
  }, []);

  const selectFile = useCallback((file: File) => {
    const error = validateFile(file);
    
    if (error) {
      setUploadState(prev => ({
        ...prev,
        uploadError: error,
        selectedFile: null
      }));
      return false;
    }

    setUploadState(prev => ({
      ...prev,
      selectedFile: file,
      uploadError: null,
      uploadProgress: 0
    }));
    
    return true;
  }, [validateFile]);

  const uploadFile = useCallback(async (): Promise<string> => {
    if (!uploadState.selectedFile) {
      throw new Error('No file selected');
    }

    setUploadState(prev => ({
      ...prev,
      isUploading: true,
      uploadProgress: 0,
      uploadError: null
    }));

    try {
      // Simulate file upload with progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadState(prev => ({
          ...prev,
          uploadProgress: progress
        }));
      }

      // In a real implementation, you would upload to your server here
      const fileName = uploadState.selectedFile.name;
      
      setUploadState(prev => ({
        ...prev,
        isUploading: false,
        uploadProgress: 100
      }));

      return `File "${fileName}" uploaded successfully`;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setUploadState(prev => ({
        ...prev,
        isUploading: false,
        uploadError: errorMessage
      }));
      throw error;
    }
  }, [uploadState.selectedFile]);

  const clearFile = useCallback(() => {
    setUploadState({
      selectedFile: null,
      isUploading: false,
      uploadProgress: 0,
      uploadError: null
    });
  }, []);

  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  return {
    uploadState,
    selectFile,
    uploadFile,
    clearFile,
    formatFileSize
  };
};