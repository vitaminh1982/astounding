/**
 * Individual chat session card component - Enhanced with dual view modes
 */
import React from 'react';
import { 
  Bot,
  User,
  MessageSquare, 
  Clock, 
  Play, 
  Eye, 
  CheckCircle, 
  AlertCircle,
  Zap,
  Calendar,
  MoreVertical,
  ArrowRight,
  Activity
} from 'lucide-react';
import { ChatSession } from '../types';

interface SessionCardProps {
  session: ChatSession;
  onViewSession: (session: ChatSession) => void;
  onResumeSession: (session: ChatSession) => void;
  viewMode?: 'timeline' | 'grid' | 'compact';
}

/**
 * SessionCard displays chat session information in multiple layout formats
 */
const SessionCard: React.FC<SessionCardProps> = ({ 
  session, 
  onViewSession, 
  onResumeSession,
  viewMode = 'timeline'
}) => {
  const getStatusConfig = (status: ChatSession['status']) => {
    switch (status) {
      case 'completed':
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          color: 'text-green-600',
          bg: 'bg-green-50',
          border: 'border-green-200',
          badge: 'bg-green-100 text-green-800',
          label: 'Completed'
        };
      case 'interrupted':
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          color: 'text-orange-600',
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          badge: 'bg-orange-100 text-orange-800',
          label: 'Interrupted'
        };
      case 'active':
        return {
          icon: <Activity className="w-4 h-4" />,
          color: 'text-blue-600',
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          badge: 'bg-blue-100 text-blue-800',
          label: 'Active'
        };
      default:
        return {
          icon: <Clock className="w-4 h-4" />,
          color: 'text-gray-600',
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          badge: 'bg-gray-100 text-gray-800',
          label: 'Unknown'
        };
    }
  };

  const statusConfig = getStatusConfig(session.status);

  const getAgentGradient = (agentName: string) => {
    const gradients: Record<string, string> = {
      'Seiya': 'from-purple-400 to-pink-500',
      'Shiryu': 'from-green-400 to-teal-500',
      'Ikki': 'from-orange-400 to-red-500',
      'Hyôga': 'from-blue-400 to-cyan-500',
      'Shun': 'from-emerald-400 to-green-500',
    };
    return gradients[agentName] || 'from-indigo-400 to-purple-500';
  };

  // Compact View (Original style enhanced)
  if (viewMode === 'compact') {
    return (
      <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-indigo-300 transition-all duration-200 bg-white">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <div className="flex items-center gap-2">
                {session.isAutonomous ? (
                  <div className="relative">
                    <Bot className="w-5 h-5 text-purple-600" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  </div>
                ) : (
                  <User className="w-5 h-5 text-indigo-600" />
                )}
                <span className="font-semibold text-gray-900">{session.agentName}</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.badge}`}>
                {statusConfig.label}
              </span>
              {session.isAutonomous && (
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Autonomous
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{session.summary}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{session.timestamp.toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{session.messageCount} messages</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{session.duration}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => onViewSession(session)}
              className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              title="View session details"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">View</span>
            </button>
            <button
              onClick={() => onResumeSession(session)}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
              title="Resume conversation"
            >
              <Play className="w-4 h-4" />
              <span className="hidden sm:inline">Resume</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  if (viewMode === 'grid') {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all duration-300 overflow-hidden group">
        {/* Card Header with Agent Info */}
        <div className={`bg-gradient-to-br ${getAgentGradient(session.agentName)} p-4 relative overflow-hidden`}>
          {/* Decorative background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-12 -mb-12"></div>
          </div>
          
          <div className="relative flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white border-2 border-white/30 shadow-lg group-hover:scale-110 transition-transform">
                {session.isAutonomous ? (
                  <Bot className="w-6 h-6" />
                ) : (
                  <User className="w-6 h-6" />
                )}
              </div>
              <div>
                <h4 className="font-semibold text-white text-lg">{session.agentName}</h4>
                <div className="flex items-center gap-2 text-white/90 text-xs mt-1">
                  <Calendar className="w-3 h-3" />
                  <span>{session.timestamp.toLocaleString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 items-end">
              {session.isAutonomous && (
                <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full flex items-center gap-1 border border-white/30">
                  <Zap className="w-3 h-3" />
                  Auto
                </span>
              )}
              <span className={`px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium ${statusConfig.color}`}>
                {statusConfig.label}
              </span>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4">
          <p className="text-sm text-gray-700 mb-4 line-clamp-2 min-h-[2.5rem]">
            {session.summary}
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-2.5 text-center border border-gray-200">
              <div className="text-xs text-gray-500 mb-0.5 flex items-center justify-center gap-1">
                <MessageSquare className="w-3 h-3" />
              </div>
              <div className="text-sm font-semibold text-gray-900">{session.messageCount}</div>
              <div className="text-xs text-gray-500">msgs</div>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-2.5 text-center border border-gray-200">
              <div className="text-xs text-gray-500 mb-0.5 flex items-center justify-center gap-1">
                <Clock className="w-3 h-3" />
              </div>
              <div className="text-sm font-semibold text-gray-900">{session.duration}</div>
              <div className="text-xs text-gray-500">time</div>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-2.5 text-center border border-gray-200">
              <div className="text-xs text-gray-500 mb-0.5">
                {statusConfig.icon}
              </div>
              <div className="text-xs font-semibold text-gray-900 capitalize">{session.status}</div>
              <div className="text-xs text-gray-500">status</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => onViewSession(session)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              <Eye className="w-4 h-4" />
              View
            </button>
            <button
              onClick={() => onResumeSession(session)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium group/btn"
            >
              <Play className="w-4 h-4" />
              Resume
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Timeline View (Default)
  return (
    <div className="relative pl-8 pb-8 group">
      {/* Timeline Line */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gray-300 via-gray-200 to-transparent group-last:bg-gradient-to-b group-last:from-gray-300 group-last:to-transparent"></div>
      
      {/* Timeline Dot with Status Color */}
      <div className={`absolute left-0 top-2 w-4 h-4 -ml-[7px] rounded-full border-4 ${statusConfig.bg} ${statusConfig.border} transition-all duration-300 group-hover:scale-125 z-10`}>
        <div className={`absolute inset-0 rounded-full ${statusConfig.bg} animate-ping opacity-75 group-hover:opacity-100`}></div>
      </div>

      {/* Card Content */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group-hover:border-indigo-200 group-hover:-translate-y-1">
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className={`w-12 h-12 bg-gradient-to-br ${getAgentGradient(session.agentName)} rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform flex-shrink-0`}>
                {session.isAutonomous ? (
                  <Bot className="w-6 h-6" />
                ) : (
                  <User className="w-6 h-6" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h4 className="font-semibold text-gray-900 text-base">{session.agentName}</h4>
                  {session.isAutonomous && (
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full flex items-center gap-1 whitespace-nowrap">
                      <Zap className="w-3 h-3" />
                      Autonomous
                    </span>
                  )}
                  <span className={`px-2 py-0.5 ${statusConfig.badge} text-xs font-medium rounded-full flex items-center gap-1 whitespace-nowrap`}>
                    {statusConfig.icon}
                    {statusConfig.label}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{session.timestamp.toLocaleString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    <span>{session.messageCount} messages</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{session.duration}</span>
                  </div>
                </div>
              </div>
            </div>
            <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0">
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* Summary */}
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            {session.summary}
          </p>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => onViewSession(session)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>
            <button
              onClick={() => onResumeSession(session)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium group/btn"
            >
              <Play className="w-4 h-4" />
              Resume Chat
              <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionCard;
