import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';

export interface AgentChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  isQuickReplies?: boolean;
  quickReplies?: string[];
}

interface ChatMessageProps {
  message: AgentChatMessage;
  onQuickReply?: (reply: string) => void;
}

export default function ChatMessage({ message, onQuickReply }: ChatMessageProps) {
  const isUser = message.sender === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser
            ? 'bg-indigo-600'
            : 'bg-indigo-500/20 border border-indigo-500/30'
        }`}
      >
        {isUser ? (
          <User size={14} className="text-white" />
        ) : (
          <Bot size={14} className="text-indigo-400" />
        )}
      </div>

      {/* Bubble + quick replies */}
      <div className={`flex flex-col gap-2 max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? 'bg-indigo-600 text-white rounded-br-sm'
              : 'bg-slate-800 border border-slate-700 text-slate-100 rounded-bl-sm'
          }`}
        >
          {message.content}
        </div>

        {message.isQuickReplies && message.quickReplies && message.quickReplies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {message.quickReplies.map((reply) => (
              <button
                key={reply}
                onClick={() => onQuickReply?.(reply)}
                className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-indigo-500 text-slate-300 hover:text-white rounded-full transition-all"
              >
                {reply}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
