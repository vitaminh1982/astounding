import React from 'react';
import { motion } from 'framer-motion';
import { 
  Layout, Table, FileText, Lightbulb, MessageSquare, Image, Play, Globe, 
  Phone, Download, Bot, GitBranch 
} from 'lucide-react';

const AIToolsGrid: React.FC = () => {
  const tools = [
    { name: 'AI Slides', icon: Layout, color: 'text-orange-600', bgColor: 'bg-orange-50 dark:bg-orange-900/30', isNew: false },
    { name: 'AI Sheets', icon: Table, color: 'text-green-600', bgColor: 'bg-green-50 dark:bg-green-900/30', isNew: false },
    { name: 'AI Docs', icon: FileText, color: 'text-tertiary', bgColor: 'bg-blue-50 dark:bg-blue-900/30', isNew: true },
    { name: 'AI Pods', icon: Lightbulb, color: 'text-tertiary', bgColor: 'bg-purple-50 dark:bg-purple-900/30', isNew: true },
    { name: 'AI Chat', icon: MessageSquare, color: 'text-green-600', bgColor: 'bg-green-50 dark:bg-green-900/30', isNew: false },
    { name: 'AI Image', icon: Image, color: 'text-yellow-600', bgColor: 'bg-yellow-50 dark:bg-yellow-900/30', isNew: false },
    { name: 'AI Video', icon: Play, color: 'text-red-600', bgColor: 'bg-red-50 dark:bg-red-900/30', isNew: false },
    { name: 'Deep Research', icon: Globe, color: 'text-lime-600', bgColor: 'bg-lime-50 dark:bg-lime-900/30', isNew: false },
    { name: 'Call For Me', icon: Phone, color: 'text-pink-600', bgColor: 'bg-pink-50 dark:bg-pink-900/30', isNew: false },
    { name: 'Download For Me', icon: Download, color: 'text-green-600', bgColor: 'bg-green-50 dark:bg-green-900/30', isNew: false },
    { name: 'All Agents', icon: Bot, color: 'text-muted-foreground dark:text-muted-foreground', bgColor: 'bg-surface-container-low dark:bg-surface-container-highest', isNew: false },
    { name: 'Workflows', icon: GitBranch, color: 'text-primary-green', bgColor: 'bg-indigo-50 dark:bg-indigo-900/30', isNew: false }
  ];

  return (
    <section className="bg-white dark:bg-surface-container-high rounded-xl shadow-sm dark:shadow-gray-900 border border-border dark:border-border p-6 transition-colors">
      <h2 className="text-xl font-bold text-foreground dark:text-foreground mb-6 transition-colors">AI-Powered Tools</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {tools.map((tool, index) => (
          <motion.button
            key={tool.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group flex flex-col items-center p-4 rounded-xl hover:bg-surface-container-low dark:hover:bg-surface-container-highest cursor-pointer transition-all duration-200 border border-transparent hover:border-border dark:hover:border-outline"
          >
            <div className="relative">
              <div className={`w-12 h-12 ${tool.bgColor} rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-border dark:border-border`}>
                <tool.icon className={`w-6 h-6 ${tool.color} transition-colors`} />
              </div>
              {tool.isNew && (
                <span className="absolute -top-1 -right-1 bg-destructive text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                  New
                </span>
              )}
            </div>
            <span className="text-xs text-on-surface dark:text-on-surface-variant text-center font-semibold group-hover:text-foreground dark:group-hover:text-foreground transition-colors">
              {tool.name}
            </span>
          </motion.button>
        ))}
      </div>
    </section>
  );
};

export default React.memo(AIToolsGrid);
