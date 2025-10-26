/**
 * Simple document card component
 */
import React from 'react';
import { 
  FileText, 
  Download, 
  Eye,
  User,
  Calendar,
  CheckCircle,
  Edit3,
  Sparkles,
  FileCode,
  FileSpreadsheet,
  File
} from 'lucide-react';
import { Document } from '../types';

interface DocumentCardProps {
  document: Document;
  onView: (doc: Document) => void;
  onDownload: (doc: Document) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ 
  document, 
  onView, 
  onDownload
}) => {
  const getFileIcon = (type: string) => {
    const iconClass = "w-10 h-10";
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className={`${iconClass} text-red-500 dark:text-red-400`} />;
      case 'doc':
      case 'docx':
        return <FileText className={`${iconClass} text-blue-500 dark:text-blue-400`} />;
      case 'xls':
      case 'xlsx':
        return <FileSpreadsheet className={`${iconClass} text-green-500 dark:text-green-400`} />;
      case 'html':
      case 'css':
      case 'js':
        return <FileCode className={`${iconClass} text-orange-500 dark:text-orange-400`} />;
      default:
        return <File className={`${iconClass} text-gray-500 dark:text-gray-400`} />;
    }
  };

  const getStatusBadge = (status: Document['status']) => {
    switch (status) {
      case 'final':
        return (
          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-md text-xs font-medium flex items-center gap-1 transition-colors">
            <CheckCircle className="w-3 h-3" />
            Final
          </span>
        );
      case 'draft':
        return (
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-md text-xs font-medium flex items-center gap-1 transition-colors">
            <Edit3 className="w-3 h-3" />
            Draft
          </span>
        );
      case 'review':
        return (
          <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded-md text-xs font-medium transition-colors">
            In Review
          </span>
        );
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-md dark:hover:shadow-gray-900 hover:border-indigo-300 dark:hover:border-teal-400 transition-all duration-200 overflow-hidden">
      <div className="p-4">
        <div className="flex gap-4">
          {/* File Icon */}
          <div className="flex-shrink-0">
            <div className="w-14 h-14 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-600 transition-colors">
              {getFileIcon(document.type)}
            </div>
          </div>

          {/* Document Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base truncate flex-1">
                {document.name}
              </h3>
              <div className="flex items-center gap-2 flex-shrink-0">
                {document.isAIGenerated && (
                  <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-md text-xs font-medium flex items-center gap-1 transition-colors">
                    <Sparkles className="w-3 h-3" />
                    AI
                  </span>
                )}
                {getStatusBadge(document.status)}
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
              {document.description}
            </p>

            {/* Metadata */}
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
              <div className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                <span>{document.generatedBy}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{document.createdAt.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>{formatFileSize(document.size)}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="uppercase font-medium">{document.type}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => onView(document)}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
              >
                <Eye className="w-4 h-4" />
                View
              </button>
              <button
                onClick={() => onDownload(document)}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-600 dark:bg-teal-600 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-teal-700 transition-colors text-sm font-medium shadow-sm dark:shadow-gray-900"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
