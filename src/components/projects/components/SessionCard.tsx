/**
 * Individual chat session card component
 */
import React from 'react';
import { Bot, User, Calendar, MessageSquare, Clock, Eye, Play } from 'lucide-react';
import { ChatSession } from '../types';

interface SessionCardProps {
  session: ChatSession;
  onViewSession: (session: ChatSession) => void;
  onResumeSession: (session: ChatSession) => void;
}

/**
 * SessionCard displays an individual chat session with actions
 */
const SessionCard: React.FC<SessionCardProps> = ({ 
  session, 
  onViewSession, 
  onResumeSession 
}) => {
  const getStatusColor = (status: ChatSession['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'interrupted': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-2">
              {session.isAutonomous ? (
                <Bot className="w-5 h-5 text-purple-600" />
              ) : (
                <User className="w-5 h-5 text-blue-600" />
              )}
              <span className="font-medium text-gray-900">{session.agentName}</span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
              {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
            </span>
            {session.isAutonomous && (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                Autonomous
              </span>
            )}
          </div>
          <p className="text-gray-600 mb-3">{session.summary}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{session.timestamp.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              <span>{session.messageCount} messages</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{session.duration}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onViewSession(session)}
            className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            <Eye className="w-4 h-4" />
            View
          </button>
          <button
            onClick={() => onResumeSession(session)}
            className="flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-sm"
          >
            <Play className="w-4 h-4" />
            Resume
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionCard;