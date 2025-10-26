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
        <h3 className="text-lg font-medium text-gray-900">Workspace Members</h3>
        <button className="flex items-center gap-2 bg-indigo-600 dark:bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-teal-700 transition-colors shadow-sm dark:shadow-gray-900"
        >
          <Plus className="w-4 h-4 mr-2" />
          Invite Member
        </button>
      </div>
      
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {workspaceData.members.map((member) => (
              <tr key={member.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                      {member.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{member.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {member.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {member.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm text-gray-500">Active</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4 border">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Pending Invitations</h4>
        <div className="space-y-3">
          {[
            { email: 'jean@example.com', role: 'Custodian', sent: '1 day ago' }
          ].map((invitation, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium">{invitation.email}</p>
                  <p className="text-xs text-gray-500">
                    Invited as {invitation.role} • {invitation.sent}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="text-sm text-indigo-600 hover:text-indigo-800">Resend</button>
                <button className="text-sm text-red-600 hover:text-red-800">Cancel</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MembersTab;