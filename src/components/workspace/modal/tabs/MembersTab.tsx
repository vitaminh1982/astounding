import React from 'react';
import { Plus, Mail } from 'lucide-react';
import { WorkspaceData, Member } from '../types';

interface MembersTabProps {
  workspaceData: WorkspaceData;
}

/**
 * Members tab component for the workspace modal
 * Displays and manages workspace members
 */
const MembersTab: React.FC<MembersTabProps> = ({ workspaceData }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-foreground dark:text-foreground">Workspace Members</h3>
        <button className="flex items-center gap-2 bg-primary dark:bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-teal-700 transition-colors shadow-sm dark:shadow-gray-900">
          <Plus className="w-4 h-4 mr-2" />
          Invite Member
        </button>
      </div>
      
      <div className="bg-white dark:bg-surface-container-high rounded-lg border border-border dark:border-border overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-surface-container-low dark:bg-surface-container-highest">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground dark:text-muted-foreground uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground dark:text-muted-foreground uppercase tracking-wider">
                Role
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground dark:text-muted-foreground uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground dark:text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-surface-container-high divide-y divide-gray-200 dark:divide-gray-700">
            {workspaceData.members.map((member) => (
              <tr key={member.id} className="hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-teal-900 flex items-center justify-center text-primary-green dark:text-teal-100 font-medium">
                      {member.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-foreground dark:text-foreground">{member.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">
                    {member.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground dark:text-muted-foreground">
                  {member.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500 dark:bg-green-400 mr-2"></div>
                    <span className="text-sm text-muted-foreground dark:text-muted-foreground">Active</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-primary-green dark:text-teal-400 hover:text-indigo-900 dark:hover:text-teal-300 transition-colors">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="bg-surface-container-low dark:bg-surface-container-high rounded-lg p-4 border border-border dark:border-border">
        <h4 className="text-sm font-medium text-on-surface dark:text-on-surface-variant mb-2">Pending Invitations</h4>
        <div className="space-y-3">
          {[
            { email: 'jean@example.com', role: 'Custodian', sent: '1 day ago' }
          ].map((invitation, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-surface-container-highest rounded-lg border border-border dark:border-border">
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-outline dark:text-muted-foreground mr-3" />
                <div>
                  <p className="text-sm font-medium text-foreground dark:text-foreground">{invitation.email}</p>
                  <p className="text-xs text-muted-foreground dark:text-muted-foreground">
                    Invited as {invitation.role} • {invitation.sent}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="text-sm text-primary-green dark:text-teal-400 hover:text-indigo-800 dark:hover:text-teal-300 transition-colors">
                  Resend
                </button>
                <button className="text-sm text-red-600 dark:text-destructive hover:text-red-800 dark:hover:text-red-300 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MembersTab;
