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
      <div className="bg-white dark:bg-surface-container-high rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl dark:shadow-gray-900 border border-border dark:border-border transition-colors">
        <div className="p-6 border-b border-border dark:border-border">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-foreground dark:text-foreground">Chat Session Details</h3>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                {session.agentName} • {session.timestamp.toLocaleString()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-outline dark:text-muted-foreground hover:text-muted-foreground dark:hover:text-outline p-2 rounded-lg hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            <div className="bg-surface-container-low dark:bg-surface-container-highest rounded-lg p-4 transition-colors">
              <h4 className="font-medium text-foreground dark:text-foreground mb-2">Session Summary</h4>
              <p className="text-on-surface dark:text-muted-foreground">{session.summary}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground dark:text-muted-foreground">
                <span>Duration: {session.duration}</span>
                <span>Messages: {session.messageCount}</span>
                <span>Status: {session.status}</span>
              </div>
            </div>
            
            {session.messages.length > 0 ? (
              <div>
                <h4 className="font-medium text-foreground dark:text-foreground mb-3">Conversation Transcript</h4>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {session.messages.map((message) => (
                    <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] p-3 rounded-lg transition-colors ${
                        message.sender === 'user' 
                          ? 'bg-primary dark:bg-teal-600 text-white' 
                          : 'bg-surface-container-low dark:bg-surface-container-highest text-on-surface dark:text-on-surface-variant'
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
              <div className="text-center py-8 text-muted-foreground dark:text-muted-foreground">
                <MessageSquare className="w-8 h-8 mx-auto mb-2" />
                <p>No detailed transcript available for this session</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6 border-t border-border dark:border-border bg-surface-container-low dark:bg-surface-container-highest/50 transition-colors">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-border dark:border-border text-on-surface dark:text-muted-foreground rounded-lg hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleResumeAndClose}
              className="px-4 py-2 bg-primary dark:bg-teal-600 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-teal-700 transition-colors shadow-sm dark:shadow-gray-900"
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
