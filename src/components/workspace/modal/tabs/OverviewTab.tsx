import React from 'react';
import { Users, Briefcase, Mail, Bell } from 'lucide-react';
import { WorkspaceData } from '../types';

interface OverviewTabProps {
  workspaceData: WorkspaceData;
}

/**
 * Overview tab component for the workspace modal
 * Displays general workspace information and statistics
 */
const OverviewTab: React.FC<OverviewTabProps> = ({ workspaceData }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Workspace Overview</h3>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-start space-x-4">
            <div 
              className="h-16 w-16 rounded-lg flex items-center justify-center text-white text-2xl font-bold"
              style={{ backgroundColor: workspaceData.color }}
            >
              {workspaceData.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{workspaceData.name}</h4>
              <p className="text-gray-500 dark:text-gray-400 mt-1">{workspaceData.description}</p>
              <div className="mt-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Users className="w-4 h-4 mr-1" />
                <span>{workspaceData.members.length} members</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-3">Recent Activity</h4>
          <div className="space-y-3">
            {[
              { user: 'Minh Nguyen', action: 'added a new member', time: '2 hours ago' },
              { user: 'Sophie Martin', action: 'updated workspace settings', time: '1 day ago' },
              { user: 'Thomas Dubois', action: 'created a new template', time: '2 days ago' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-teal-900 flex items-center justify-center text-indigo-600 dark:text-teal-100 mr-3">
                  {activity.user.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-3">Workspace Stats</h4>
          <div className="grid grid-cols-2 gap-4">
            {[
              { 
                label: 'Total Members', 
                value: workspaceData.members.length, 
                icon: <Users className="w-5 h-5 text-indigo-600 dark:text-teal-400" /> 
              },
              { 
                label: 'Active Agents', 
                value: 5, 
                icon: <Briefcase className="w-5 h-5 text-green-600 dark:text-green-400" /> 
              },
              { 
                label: 'Templates', 
                value: 24, 
                icon: <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" /> 
              },
              { 
                label: 'Conversations', 
                value: 156, 
                icon: <Bell className="w-5 h-5 text-amber-600 dark:text-amber-400" /> 
              }
            ].map((stat, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
                <div className="flex items-center mb-2">
                  {stat.icon}
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 ml-2">{stat.label}</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
