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
    { name: 'AI Docs', icon: FileText, color: 'text-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-900/30', isNew: true },
    { name: 'AI Pods', icon: Lightbulb, color: 'text-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-900/30', isNew: true },
    { name: 'AI Chat', icon: MessageSquare, color: 'text-teal-600', bgColor: 'bg-teal-50 dark:bg-teal-900/30', isNew: false },
    { name: 'AI Image', icon: Image, color: 'text-yellow-600', bgColor: 'bg-yellow-50 dark:bg-yellow-900/30', isNew: false },
    { name: 'AI Video', icon: Play, color: 'text-red-600', bgColor: 'bg-red-50 dark:bg-red-900/30', isNew: false },
    { name: 'Deep Research', icon: Globe, color: 'text-lime-600', bgColor: 'bg-lime-50 dark:bg-lime-900/30', isNew: false },
    { name: 'Call For Me', icon: Phone, color: 'text-pink-600', bgColor: 'bg-pink-50 dark:bg-pink-900/30', isNew: false },
    { name: 'Download For Me', icon: Download, color: 'text-cyan-600', bgColor: 'bg-cyan-50 dark:bg-cyan-900/30', isNew: false },
    { name: 'All Agents', icon: Bot, color: 'text-gray-600 dark:text-gray-400', bgColor: 'bg-gray-50 dark:bg-gray-700', isNew: false },
    { name: 'Workflows', icon: GitBranch, color: 'text-indigo-600', bgColor: 'bg-indigo-50 dark:bg-indigo-900/30', isNew: false }
  ];

  return (
    <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900 border border-gray-200 dark:border-gray-600 p-6 transition-colors">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 transition-colors">AI-Powered Tools</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {tools.map((tool, index) => (
          <motion.button
            key={tool.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200 border border-transparent hover:border-gray-200 dark:hover:border-gray-500"
          >
            <div className="relative">
              <div className={`w-12 h-12 ${tool.bgColor} rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-gray-200 dark:border-gray-600`}>
                <tool.icon className={`w-6 h-6 ${tool.color} transition-colors`} />
              </div>
              {tool.isNew && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                  New
                </span>
              )}
            </div>
            <span className="text-xs text-gray-800 dark:text-gray-200 text-center font-semibold group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
              {tool.name}
            </span>
          </motion.button>
        ))}
      </div>
    </section>
  );
};

export default React.memo(AIToolsGrid);
