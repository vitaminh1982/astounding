/**
 * Chat header component with tab navigation
 */
import React from 'react';
import { MessageSquare, FileText, CheckSquare, Clock } from 'lucide-react';
import { TabType } from '../types';

interface ChatHeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

/**
 * ChatHeader component handles tab navigation for the chat interface
 */
const ChatHeader: React.FC<ChatHeaderProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'chat' as const, label: 'AI Chat', icon: MessageSquare },
    { id: 'documents' as const, label: 'Deliverables', icon: FileText },
    { id: 'tasks' as const, label: 'Tasks', icon: CheckSquare },
    { id: 'history' as const, label: 'History', icon: Clock }
  ];

  return (
    <div className="border-b">
      <nav className="flex">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === id 
                ? 'border-indigo-500 text-indigo-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default ChatHeader;