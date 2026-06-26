import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

export default function AgentTypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2 }}
      className="flex items-end gap-2"
    >
      <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
        <Bot size={14} className="text-indigo-400" />
      </div>
      <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 bg-slate-400 rounded-full block"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>
    </motion.div>
  );
}
