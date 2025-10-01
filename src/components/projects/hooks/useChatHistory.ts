/**
 * Custom hook for managing chat history
 */
import { useState, useMemo } from 'react';
import { ChatSession, HistoryFilter } from '../types';

// Enhanced mock chat session data
const INITIAL_SESSIONS: ChatSession[] = [
  {
    id: 'session-001',
    agentName: 'Seiya',
    timestamp: new Date('2025-01-21T14:30:00'),
    summary: 'Discussed project timeline adjustments and milestone priorities for Q1 delivery',
    messageCount: 12,
    duration: '8 min',
    isAutonomous: false,
    status: 'completed',
    messages: []
  },
  {
    id: 'session-002',
    agentName: 'Shiryu',
    timestamp: new Date('2025-01-21T10:15:00'),
    summary: 'Comprehensive data analysis results and visualization recommendations for market trends',
    messageCount: 8,
    duration: '12 min',
    isAutonomous: true,
    status: 'completed',
    messages: []
  },
  {
    id: 'session-003',
    agentName: 'Ikki',
    timestamp: new Date('2025-01-20T16:20:00'),
    summary: 'Requirements gathering session for user authentication module and security protocols',
    messageCount: 15,
    duration: '18 min',
    isAutonomous: false,
    status: 'completed',
    messages: []
  },
  {
    id: 'session-004',
    agentName: 'Hyôga',
    timestamp: new Date('2025-01-20T09:45:00'),
    summary: 'Strategic planning discussion for market expansion into European territories',
    messageCount: 6,
    duration: '15 min',
    isAutonomous: false,
    status: 'interrupted',
    messages: []
  },
  {
    id: 'session-005',
    agentName: 'Shun',
    timestamp: new Date('2025-01-19T14:30:00'),
    summary: 'Compliance review and regulatory requirements assessment',
    messageCount: 10,
    duration: '10 min',
    isAutonomous: false,
    status: 'completed',
    messages: []
  },
  {
    id: 'session-006',
    agentName: 'Seiya',
    timestamp: new Date('2025-01-19T11:00:00'),
    summary: 'Risk assessment and mitigation strategies for project dependencies',
    messageCount: 14,
    duration: '20 min',
    isAutonomous: false,
    status: 'completed',
    messages: []
  },
  {
    id: 'session-007',
    agentName: 'Shiryu',
    timestamp: new Date('2025-01-18T15:15:00'),
    summary: 'Performance metrics analysis and optimization recommendations',
    messageCount: 7,
    duration: '9 min',
    isAutonomous: true,
    status: 'completed',
    messages: []
  },
  {
    id: 'session-008',
    agentName: 'Ikki',
    timestamp: new Date('2025-01-18T10:30:00'),
    summary: 'Technical architecture review and scalability planning',
    messageCount: 18,
    duration: '25 min',
    isAutonomous: false,
    status: 'completed',
    messages: []
  }
];

export const useChatHistory = () => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(INITIAL_SESSIONS);
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>({
    agent: 'all',
    search: '',
    groupBy: 'date'
  });
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);

  const filteredSessions = chatSessions.filter(session => {
    const matchesAgent = historyFilter.agent === 'all' || session.agentName === historyFilter.agent;
    const matchesSearch = historyFilter.search === '' ||
      session.summary.toLowerCase().includes(historyFilter.search.toLowerCase()) ||
      session.agentName.toLowerCase().includes(historyFilter.search.toLowerCase());
    
    return matchesAgent && matchesSearch;
  });

  const groupedSessions = useMemo(() => {
    if (historyFilter.groupBy === 'agent') {
      return filteredSessions.reduce((groups, session) => {
        const agent = session.agentName;
        if (!groups[agent]) groups[agent] = [];
        groups[agent].push(session);
        return groups;
      }, {} as Record<string, ChatSession[]>);
    } else {
      return filteredSessions.reduce((groups, session) => {
        const date = session.timestamp.toDateString();
        if (!groups[date]) groups[date] = [];
        groups[date].push(session);
        return groups;
      }, {} as Record<string, ChatSession[]>);
    }
  }, [filteredSessions, historyFilter.groupBy]);

  const getHistoryStats = () => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return {
      totalSessions: chatSessions.length,
      thisWeek: chatSessions.filter(s => s.timestamp >= oneWeekAgo).length,
      completed: chatSessions.filter(s => s.status === 'completed').length,
      interrupted: chatSessions.filter(s => s.status === 'interrupted').length,
      totalMessages: chatSessions.reduce((sum, s) => sum + s.messageCount, 0)
    };
  };

  const handleViewSession = (session: ChatSession) => {
    setSelectedSession(session);
  };

  const handleResumeSession = (session: ChatSession) => {
    console.log('Resuming session:', session.id);
    // Implementation would switch to chat tab and load session context
  };

  return {
    chatSessions,
    historyFilter,
    setHistoryFilter,
    selectedSession,
    setSelectedSession,
    filteredSessions,
    groupedSessions,
    handleViewSession,
    handleResumeSession,
    getHistoryStats
  };
};
