import React, { useState } from 'react';
import { ChevronDown, Plus, Settings, LogOut } from 'lucide-react';
import WorkspaceModal from './WorkspaceModal';

interface WorkspaceSelectorProps {
  currentWorkspace: {
    id: string;
    name: string;
    color: string;
  };
  workspaces: {
    id: string;
    name: string;
    color: string;
  }[];
  onWorkspaceChange: (workspaceId: string) => void;
}

export default function WorkspaceSelector({
  currentWorkspace,
  workspaces,
  onWorkspaceChange
}: WorkspaceSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  const handleWorkspaceChange = (workspaceId: string) => {
    onWorkspaceChange(workspaceId);
    setIsOpen(false);
  };
  
  const openWorkspaceModal = () => {
    setIsModalOpen(true);
    setIsOpen(false);
  };
  
  return (
    <>
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <div 
            className="h-8 w-8 rounded-md flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: currentWorkspace.color }}
          >
            {currentWorkspace.name.charAt(0)}
          </div>
          <span className="font-medium text-gray-700">{currentWorkspace.name}</span>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </button>
        
        {isOpen && (
          <div className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Your workspaces</p>
            </div>
            
            <div className="max-h-60 overflow-y-auto py-1">
              {workspaces.map(workspace => (
                <button
                  key={workspace.id}
                  onClick={() => handleWorkspaceChange(workspace.id)}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <div 
                    className="h-6 w-6 rounded-md flex items-center justify-center text-white font-bold mr-3"
                    style={{ backgroundColor: workspace.color }}
                  >
                    {workspace.name.charAt(0)}
                  </div>
                  <span>{workspace.name}</span>
                  {workspace.id === currentWorkspace.id && (
                    <span className="ml-auto">
                      <svg className="h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </button>
              ))}
            </div>
            
            <div className="border-t border-gray-100 py-1">
              <button
                onClick={openWorkspaceModal}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Settings className="h-4 w-4 mr-3 text-gray-500" />
                <span>Workspace Settings</span>
              </button>
              
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Plus className="h-4 w-4 mr-3 text-gray-500" />
                <span>Create New Workspace</span>
              </button>
            </div>
            
            <div className="border-t border-gray-100 py-1">
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                <LogOut className="h-4 w-4 mr-3" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
      
      <WorkspaceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}