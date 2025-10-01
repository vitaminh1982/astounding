/**
 * Custom hook for managing chat history
 */
import { useState, useMemo } from 'react';
import { ChatSession, HistoryFilter, Message } from '../types';

// Mock chat session data
const INITIAL_SESSIONS: ChatSession[] = [
  {
    id: 'session-001',
    agentName: 'Seiya',
    timestamp: new Date('2025-01-21T14:30:00'),
    summary: 'Discussed project timeline adjustments and milestone priorities',
    messageCount: 12,
    duration: '8 minutes',
    isAutonomous: false,
    status: 'completed',
    messages: [
      {
        id: 'msg-001',
        content: 'Can you review the current project timeline?',
        sender: 'user',
        timestamp: new Date('2025-01-21T14:30:00'),
        visibility: 'project'
      },
      {
        id: 'msg-002',
        content: 'I\'ve analyzed the timeline. We\'re currently 2 days ahead of schedule on the requirements phase.',
        sender: 'agent',
        agentId: 'pm-001',
        timestamp: new Date('2025-01-21T14:31:00'),
        visibility: 'project'
      }
    ]
  },
  {
    id: 'session-002',
    agentName: 'Shiryu',
    timestamp: new Date('2025-01-20T16:15:00'),
    summary: 'Data analysis results and visualization recommendations',
    messageCount: 8,
    duration: '12 minutes',
    isAutonomous: true,
    status: 'completed',
    messages: [
      {
        id: 'msg-003',
        content: 'I\'ve completed the market data analysis. Here are the key findings...',
        sender: 'agent',
        agentId: 'da-001',
        timestamp: new Date('2025-01-20T16:15:00'),
        visibility: 'project'
      }
    ]
  },
  {
    id: 'session-003',
    agentName: 'Ikki',
    timestamp: new Date('2025-01-19T11:20:00'),
    summary: 'Requirements gathering session for user authentication module',
    messageCount: 15,
    duration: '18 minutes',
    isAutonomous: false,
    status: 'completed',
    messages: []
  },
  {
    id: 'session-004',
    agentName: 'Hyôga',
    timestamp: new Date('2025-01-18T09:45:00'),
    summary: 'Strategic planning discussion for market expansion',
    messageCount: 6,
    duration: '15 minutes',
    isAutonomous: false,
    status: 'interrupted',
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
    handleResumeSession
  };
};