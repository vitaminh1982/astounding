import React from 'react';
import { Users, Shield, UserPlus } from 'lucide-react';
import SettingsCard from './SettingsCard';

const roleTypes = [
  {
    name: 'Owner',
    description: 'Full access to all features',
    permissions: ['User management', 'System configuration', 'Reports', 'Billing & subscriptions']
  },
  {
    name: 'Admin', 
    description: 'Administrative access with user management',
    permissions: ['User management', 'Agent management', 'View reports', 'System settings']
  },
  {
    name: 'Steward',
    description: 'Agent management and reporting',
    permissions: ['Agent management', 'View reports', 'Limited configuration']
  },
  {
    name: 'Custodian',
    description: 'Conversation management',
    permissions: ['Conversation management', 'Basic view']
  }
];


const teamTypes = [
  { name: 'Customer Support', members: 12 },
  { name: 'Sales', members: 8 },
  { name: 'After Sales Service', members: 5 },
  { name: 'HR', members: 3 }
];

const RoleCard = ({ role }) => {
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium">{role.name}</h4>
        <Shield className="w-4 h-4 text-indigo-600" />
      </div>
      <p className="text-sm text-gray-600 mb-2">{role.description}</p>
      <div className="flex flex-wrap gap-2">
        {role.permissions.map((permission) => (
          <span key={permission} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
            {permission}
          </span>
        ))}
      </div>
    </div>
  );
};

const TeamCard = ({ team }) => {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <span className="font-medium">{team.name}</span>
      <span className="text-sm text-gray-500">{team.members} members</span>
    </div>
  );
};

export default function UserManagement() {
  return (
    <SettingsCard
      title="User Management"
      icon={Users}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 sm:text-sm md:text-base">Roles and Permissions</h3>
            <button className="text-sm text-indigo-600 hover:text-indigo-700">
              Manage roles
            </button>
          </div>
          
          <div className="space-y-4">
            {roleTypes.map((role) => (
              <RoleCard key={role.name} role={role} />
            ))}
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 sm:text-sm md:text-base">Teams</h3>
            <button className="flex items-center gap-2 bg-indigo-600 dark:bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-teal-700 transition-colors shadow-sm dark:shadow-gray-900"
        >
              <UserPlus className="w-4 h-4" />
              New team
            </button>
          </div>
          
          <div className="space-y-3">
            {teamTypes.map((team) => (
              <TeamCard key={team.name} team={team} />
            ))}
          </div>
        </div>
      </div>
    </SettingsCard>
  );
}
