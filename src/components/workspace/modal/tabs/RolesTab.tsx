import React from 'react';
import { Plus, Settings, Trash2, Check, Users } from 'lucide-react';
import { WorkspaceData, Role } from '../types';

interface RolesTabProps {
  workspaceData: WorkspaceData;
}

/**
 * Roles tab component for the workspace modal
 * Displays and manages workspace roles and permissions
 */
const RolesTab: React.FC<RolesTabProps> = ({ workspaceData }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Roles & Permissions</h3>
        <button className="flex items-center gap-2 bg-indigo-600 dark:bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-teal-700 transition-colors shadow-sm dark:shadow-gray-900"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Role
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workspaceData.roles.map((role) => (
          <div key={role.id} className="bg-white rounded-lg border p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-medium text-gray-900">{role.name}</h4>
                <p className="text-sm text-gray-500">{role.description}</p>
              </div>
              <div className="flex space-x-2">
                <button className="text-gray-400 hover:text-gray-600">
                  <Settings className="w-5 h-5" />
                </button>
                {role.id !== 'owner' && (
                  <button className="text-gray-400 hover:text-red-600">
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="mt-4">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Permissions</h5>
              <div className="space-y-2">
                {role.permissions.map((permission, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-sm text-gray-600">{permission}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center text-sm text-gray-500">
                <Users className="w-4 h-4 mr-2" />
                <span>
                  {workspaceData.members.filter(m => m.role === role.name).length} members with this role
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RolesTab;