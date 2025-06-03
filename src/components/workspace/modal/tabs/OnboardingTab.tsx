import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { WorkspaceData } from '../types';

interface OnboardingTabProps {
  workspaceData: WorkspaceData;
  setWorkspaceData: React.Dispatch<React.SetStateAction<WorkspaceData>>;
}

/**
 * Onboarding tab component for the workspace modal
 * Manages onboarding settings for new workspace members
 */
const OnboardingTab: React.FC<OnboardingTabProps> = ({ workspaceData, setWorkspaceData }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Onboarding Settings</h3>
      
      <div className="bg-white rounded-lg border p-6">
        <form className="space-y-6">
          <div>
            <label htmlFor="welcomeMessage" className="block text-sm font-medium text-gray-700 mb-1">
              Welcome Message
            </label>
            <textarea
              id="welcomeMessage"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={workspaceData.onboarding.welcomeMessage}
              onChange={(e) => setWorkspaceData({
                ...workspaceData,
                onboarding: {
                  ...workspaceData.onboarding,
                  welcomeMessage: e.target.value
                }
              })}
            />
            <p className="mt-1 text-sm text-gray-500">
              This message will be sent to new members when they join the workspace.
            </p>
          </div>
          
          <div>
            <label htmlFor="defaultRole" className="block text-sm font-medium text-gray-700 mb-1">
              Default Role for New Members
            </label>
            <select
              id="defaultRole"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={workspaceData.onboarding.defaultRole}
              onChange={(e) => setWorkspaceData({
                ...workspaceData,
                onboarding: {
                  ...workspaceData.onboarding,
                  defaultRole: e.target.value
                }
              })}
            >
              {workspaceData.roles.map(role => (
                <option key={role.id} value={role.name}>{role.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center">
            <input
              id="autoOnboarding"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              checked={workspaceData.onboarding.autoOnboarding}
              onChange={(e) => setWorkspaceData({
                ...workspaceData,
                onboarding: {
                  ...workspaceData.onboarding,
                  autoOnboarding: e.target.checked
                }
              })}
            />
            <label htmlFor="autoOnboarding" className="ml-2 block text-sm text-gray-700">
              Enable automated onboarding workflow
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Required Onboarding Tasks
            </label>
            <div className="space-y-2">
              {workspaceData.onboarding.requiredTasks.map((task, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm">{task}</span>
                  <button 
                    type="button"
                    className="text-gray-400 hover:text-red-600"
                    onClick={() => {
                      const newTasks = [...workspaceData.onboarding.requiredTasks];
                      newTasks.splice(index, 1);
                      setWorkspaceData({
                        ...workspaceData,
                        onboarding: {
                          ...workspaceData.onboarding,
                          requiredTasks: newTasks
                        }
                      });
                    }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div className="flex mt-2">
                <input
                  type="text"
                  placeholder="Add a new task..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value) {
                      e.preventDefault();
                      setWorkspaceData({
                        ...workspaceData,
                        onboarding: {
                          ...workspaceData.onboarding,
                          requiredTasks: [...workspaceData.onboarding.requiredTasks, e.currentTarget.value]
                        }
                      });
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <button
                  type="button"
                  className="px-3 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700"
                  onClick={(e) => {
                    const input = e.currentTarget.previousSibling as HTMLInputElement;
                    if (input.value) {
                      setWorkspaceData({
                        ...workspaceData,
                        onboarding: {
                          ...workspaceData.onboarding,
                          requiredTasks: [...workspaceData.onboarding.requiredTasks, input.value]
                        }
                      });
                      input.value = '';
                    }
                  }}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OnboardingTab;