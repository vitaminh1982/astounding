import React from 'react';
import { WorkspaceData } from '../types';

interface SettingsTabProps {
  workspaceData: WorkspaceData;
  setWorkspaceData: React.Dispatch<React.SetStateAction<WorkspaceData>>;
}

/**
 * Settings tab component for the workspace modal
 * Manages general workspace settings
 */
const SettingsTab: React.FC<SettingsTabProps> = ({ workspaceData, setWorkspaceData }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Workspace Settings</h3>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <form className="space-y-6">
          <div>
            <label htmlFor="workspaceName" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Workspace Name
            </label>
            <input
              id="workspaceName"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-indigo-500 dark:focus:ring-teal-500 focus:border-indigo-500 dark:focus:border-teal-500 sm:text-sm transition-colors"
              value={workspaceData.name}
              onChange={(e) => setWorkspaceData({
                ...workspaceData,
                name: e.target.value
              })}
            />
          </div>
          
          <div>
            <label htmlFor="workspaceDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Description
            </label>
            <textarea
              id="workspaceDescription"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-indigo-500 dark:focus:ring-teal-500 focus:border-indigo-500 dark:focus:border-teal-500 sm:text-sm transition-colors"
              value={workspaceData.description}
              onChange={(e) => setWorkspaceData({
                ...workspaceData,
                description: e.target.value
              })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Workspace Color
            </label>
            <div className="flex flex-wrap gap-3">
              {['#10B981', '#6366F1', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'].map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full transition-all ${
                    workspaceData.color === color 
                      ? 'ring-2 ring-offset-2 ring-gray-500 dark:ring-gray-400 dark:ring-offset-gray-800' 
                      : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setWorkspaceData({
                    ...workspaceData,
                    color
                  })}
                />
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Workspace Logo
            </label>
            <div className="flex items-center">
              <div className="h-16 w-16 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-4">
                {workspaceData.logo ? (
                  <img src={workspaceData.logo} alt="Workspace logo" className="h-full w-full object-cover rounded-lg" />
                ) : (
                  <div 
                    className="h-full w-full rounded-lg flex items-center justify-center text-white text-2xl font-bold"
                    style={{ backgroundColor: workspaceData.color }}
                  >
                    {workspaceData.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <button
                  type="button"
                  className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-teal-500 dark:focus:ring-offset-gray-800 transition-colors"
                >
                  Upload Logo
                </button>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Recommended: 128x128px, PNG or JPG
                </p>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">Danger Zone</h4>
            <button
              type="button"
              className="px-4 py-2 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md hover:bg-red-100 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-red-400 dark:focus:ring-offset-gray-800 transition-colors"
            >
              Delete Workspace
            </button>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              This action cannot be undone. All workspace data will be permanently deleted.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsTab;
