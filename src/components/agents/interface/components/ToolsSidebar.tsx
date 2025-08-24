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
    <aside className="w-80 bg-white border-l shadow-sm p-5 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Agent Tools</h2>
        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
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
                ? 'bg-gradient-to-r from-green-50 to-green-100 shadow-sm' 
                : 'bg-gray-50 hover:bg-gray-100'
              }
            `}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center mr-3
                  ${tool.isActive ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}
                `}>
                  {getToolIcon(tool.name)}
                </div>
                <h3 className={`font-medium ${tool.isActive ? 'text-green-700' : 'text-gray-700'}`}>
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
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
            
            <p className={`text-sm ${tool.isActive ? 'text-green-600' : 'text-gray-600'} ml-13`}>
              {tool.description}
            </p>
            
            {tool.isActive && (
              <div className="mt-3 pt-3 border-t border-green-100">
                <button 
                  type="button"
                  className="flex items-center text-xs text-green-600 hover:text-green-800 transition-colors"
                >
                  <Settings className="w-3 h-3 mr-1" />
                  Configure settings
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <button 
          type="button"
          className="flex items-center justify-center w-full gap-2 py-2.5 px-4 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Tool</span>
        </button>
      </div>
    </aside>
  );
};

export default React.memo(ToolsSidebar);