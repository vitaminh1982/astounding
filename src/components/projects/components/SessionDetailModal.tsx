/**
 * Session detail modal for viewing chat transcripts
 */
import React from 'react';
import { MessageSquare, X } from 'lucide-react';
import { ChatSession } from '../types';

interface SessionDetailModalProps {
  session: ChatSession | null;
  onClose: () => void;
  onResumeSession: (session: ChatSession) => void;
}

/**
 * SessionDetailModal displays full chat transcript and session details
 */
const SessionDetailModal: React.FC<SessionDetailModalProps> = ({ 
  session, 
  onClose, 
  onResumeSession 
}) => {
  if (!session) return null;

  const handleResumeAndClose = () => {
    onResumeSession(session);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl dark:shadow-gray-900 border border-gray-200 dark:border-gray-600 transition-colors">
        <div className="p-6 border-b border-gray-200 dark:border-gray-600">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Chat Session Details</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {session.agentName} • {session.timestamp.toLocaleString()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 transition-colors">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Session Summary</h4>
              <p className="text-gray-700 dark:text-gray-300">{session.summary}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                <span>Duration: {session.duration}</span>
                <span>Messages: {session.messageCount}</span>
                <span>Status: {session.status}</span>
              </div>
            </div>
            
            {session.messages.length > 0 ? (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Conversation Transcript</h4>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {session.messages.map((message) => (
                    <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] p-3 rounded-lg transition-colors ${
                        message.sender === 'user' 
                          ? 'bg-indigo-600 dark:bg-teal-600 text-white' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                      }`}>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <div className="text-xs mt-1 opacity-70">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <MessageSquare className="w-8 h-8 mx-auto mb-2" />
                <p>No detailed transcript available for this session</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 transition-colors">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleResumeAndClose}
              className="px-4 py-2 bg-indigo-600 dark:bg-teal-600 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-teal-700 transition-colors shadow-sm dark:shadow-gray-900"
            >
              Resume Conversation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionDetailModal;
