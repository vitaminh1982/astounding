/**
 * Individual document card component
 */
import React from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  Edit3, 
  Trash2, 
  MoreVertical,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  Calendar,
  FileCode,
  FileSpreadsheet,
  FileImage,
  File,
  Sparkles
} from 'lucide-react';
import { Document } from '../types';

interface DocumentCardProps {
  document: Document;
  onView: (doc: Document) => void;
  onDownload: (doc: Document) => void;
  onEdit?: (doc: Document) => void;
  onDelete?: (doc: Document) => void;
  viewMode?: 'grid' | 'list';
}

/**
 * DocumentCard displays individual document information
 */
const DocumentCard: React.FC<DocumentCardProps> = ({ 
  document, 
  onView, 
  onDownload,
  onEdit,
  onDelete,
  viewMode = 'grid'
}) => {
  const getFileIcon = (type: string) => {
    const iconClass = "w-8 h-8";
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className={`${iconClass} text-red-500`} />;
      case 'doc':
      case 'docx':
        return <FileText className={`${iconClass} text-blue-500`} />;
      case 'xls':
      case 'xlsx':
        return <FileSpreadsheet className={`${iconClass} text-green-500`} />;
      case 'jpg':
      case 'png':
      case 'svg':
        return <FileImage className={`${iconClass} text-purple-500`} />;
      case 'html':
      case 'css':
      case 'js':
        return <FileCode className={`${iconClass} text-orange-500`} />;
      default:
        return <File className={`${iconClass} text-gray-500`} />;
    }
  };

  const getStatusConfig = (status: Document['status']) => {
    switch (status) {
      case 'final':
        return {
          icon: <CheckCircle className="w-3.5 h-3.5" />,
          color: 'text-green-700',
          bg: 'bg-green-100',
          border: 'border-green-200',
          label: 'Final'
        };
      case 'draft':
        return {
          icon: <Edit3 className="w-3.5 h-3.5" />,
          color: 'text-blue-700',
          bg: 'bg-blue-100',
          border: 'border-blue-200',
          label: 'Draft'
        };
      case 'review':
        return {
          icon: <AlertCircle className="w-3.5 h-3.5" />,
          color: 'text-orange-700',
          bg: 'bg-orange-100',
          border: 'border-orange-200',
          label: 'In Review'
        };
      default:
        return {
          icon: <Clock className="w-3.5 h-3.5" />,
          color: 'text-gray-700',
          bg: 'bg-gray-100',
          border: 'border-gray-200',
          label: 'Unknown'
        };
    }
  };

  const statusConfig = getStatusConfig(document.status);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getAgentColor = (agentName: string) => {
    const colors: Record<string, string> = {
      'Seiya': 'bg-purple-100 text-purple-700 border-purple-200',
      'Shiryu': 'bg-green-100 text-green-700 border-green-200',
      'Ikki': 'bg-orange-100 text-orange-700 border-orange-200',
      'Hyôga': 'bg-blue-100 text-blue-700 border-blue-200',
      'Shun': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    };
    return colors[agentName] || 'bg-indigo-100 text-indigo-700 border-indigo-200';
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-indigo-200 transition-all duration-200 group">
        <div className="flex items-center gap-4">
          {/* File Icon */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200 group-hover:border-indigo-200 transition-colors">
              {getFileIcon(document.type)}
            </div>
          </div>

          {/* Document Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className="font-semibold text-gray-900 text-sm truncate flex-1">
                {document.name}
              </h4>
              <div className="flex items-center gap-2 flex-shrink-0">
                {document.isAIGenerated && (
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    AI
                  </span>
                )}
                <span className={`px-2 py-0.5 ${statusConfig.bg} ${statusConfig.color} text-xs font-medium rounded-full flex items-center gap-1 border ${statusConfig.border}`}>
                  {statusConfig.icon}
                  {statusConfig.label}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-600 mb-2 line-clamp-1">{document.description}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span className={`px-1.5 py-0.5 rounded border ${getAgentColor(document.generatedBy)}`}>
                  {document.generatedBy}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{document.createdAt.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                <span>{formatFileSize(document.size)}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="uppercase font-medium">{document.type}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onView(document)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="View document"
            >
              <Eye className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => onDownload(document)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Download"
            >
              <Download className="w-4 h-4 text-gray-600" />
            </button>
            {onEdit && (
              <button
                onClick={() => onEdit(document)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Edit"
              >
                <Edit3 className="w-4 h-4 text-gray-600" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(document)}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all duration-300 overflow-hidden group">
      {/* Document Preview/Icon */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex items-center justify-center border-b border-gray-200 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-600 rounded-full -ml-12 -mb-12"></div>
        </div>
        
        <div className="relative transform group-hover:scale-110 transition-transform duration-300">
          {getFileIcon(document.type)}
        </div>

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
          <button
            onClick={() => onView(document)}
            className="p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors transform hover:scale-110"
            title="View document"
          >
            <Eye className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={() => onDownload(document)}
            className="p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors transform hover:scale-110"
            title="Download"
          >
            <Download className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Corner Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {document.isAIGenerated && (
            <span className="px-2 py-1 bg-purple-600 text-white text-xs font-medium rounded-lg flex items-center gap-1 shadow-lg">
              <Sparkles className="w-3 h-3" />
              AI
            </span>
          )}
        </div>
      </div>

      {/* Document Details */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-semibold text-gray-900 text-sm line-clamp-1 flex-1 pr-2">
            {document.name}
          </h4>
          <button className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0">
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <p className="text-xs text-gray-600 mb-3 line-clamp-2 min-h-[2rem]">
          {document.description}
        </p>

        {/* Status Badge */}
        <div className="flex items-center justify-between mb-3">
          <span className={`px-2 py-1 ${statusConfig.bg} ${statusConfig.color} text-xs font-medium rounded-lg flex items-center gap-1 border ${statusConfig.border}`}>
            {statusConfig.icon}
            {statusConfig.label}
          </span>
          <span className="text-xs font-medium text-gray-900 uppercase">{document.type}</span>
        </div>

        {/* Metadata */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Generated by</span>
            <span className={`px-2 py-0.5 rounded border font-medium ${getAgentColor(document.generatedBy)}`}>
              {document.generatedBy}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Created</span>
            <span className="text-gray-900 font-medium">
              {document.createdAt.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Size</span>
            <span className="text-gray-900 font-medium">{formatFileSize(document.size)}</span>
          </div>
          {document.version && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Version</span>
              <span className="text-gray-900 font-medium">v{document.version}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onView(document)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs font-medium"
          >
            <Eye className="w-3.5 h-3.5" />
            View
          </button>
          <button
            onClick={() => onDownload(document)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-xs font-medium"
          >
            <Download className="w-3.5 h-3.5" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
