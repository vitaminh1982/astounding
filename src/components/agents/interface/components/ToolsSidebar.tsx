import React from 'react';
import { Plus, Settings, Search, Code, Image, BarChart2 } from 'lucide-react';
import { Tool } from '../types';

interface ToolsSidebarProps {
  tools: Tool[];
  onToggleTool: (toolId: string) => void;
}

const ToolsSidebar: React.FC<ToolsSidebarProps> = ({ tools, onToggleTool }) => {
  const getToolIcon = (toolName: string) => {
    if (toolName.includes('Web')) return <Search className="w-5 h-5" />;
    if (toolName.includes('Email')) return <Code className="w-5 h-5" />;
    if (toolName.includes('Image')) return <Image className="w-5 h-5" />;
    if (toolName.includes('Data')) return <BarChart2 className="w-5 h-5" />;
    return <Settings className="w-5 h-5" />;
  };

  return (
    <aside className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-gray-900 p-5 overflow-y-auto transition-colors">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Agent Tools</h2>
        <span className="px-2 py-1 bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-200 text-xs font-medium rounded-full transition-colors">
          {tools.filter(t => t.isActive).length} Active
        </span>
      </div>
      
      <div className="space-y-4">
        {tools.map(tool => (
          <div 
            key={tool.id} 
            className={`
              relative p-4 rounded-xl transition-all duration-200
              ${tool.isActive 
                ? 'bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 border border-green-200 dark:border-green-700 shadow-sm dark:shadow-gray-900' 
                : 'bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
              }
            `}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center mr-3 transition-colors
                  ${tool.isActive ? 'bg-green-600 dark:bg-green-700 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'}
                `}>
                  {getToolIcon(tool.name)}
                </div>
                <h3 className={`font-medium transition-colors ${tool.isActive ? 'text-green-700 dark:text-green-200' : 'text-gray-700 dark:text-gray-200'}`}>
                  {tool.name}
                </h3>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={tool.isActive}
                  onChange={() => onToggleTool(tool.id)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-gray-200 after:border-gray-300 dark:after:border-gray-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600 dark:peer-checked:bg-green-500 transition-colors"></div>
              </label>
            </div>
            
            <p className={`text-sm ml-13 transition-colors ${tool.isActive ? 'text-green-600 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'}`}>
              {tool.description}
            </p>
            
            {tool.isActive && (
              <div className="mt-3 pt-3 border-t border-green-100 dark:border-green-800">
                <button 
                  type="button"
                  className="flex items-center text-xs text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 dark:focus:ring-offset-green-900 rounded-sm"
                >
                  <Settings className="w-3 h-3 mr-1" />
                  Configure settings
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button 
          type="button"
          className="flex items-center gap-2 bg-indigo-600 dark:bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-teal-700 transition-colors shadow-sm dark:shadow-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Tool</span>
        </button>
      </div>
    </aside>
  );
};

export default React.memo(ToolsSidebar);
