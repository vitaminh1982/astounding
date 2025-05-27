import React, { useState } from 'react';
import { 
  X, 
  Users, 
  Settings, 
  Mail, 
  Shield, 
  Building, 
  Palette, 
  FileText, 
  UserPlus, 
  Check, 
  ChevronRight, 
  ChevronDown,
  Edit2,
  Trash2
} from 'lucide-react';

// Types for workspace management
interface WorkspaceMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Steward' | 'Custodian' | string;
  avatar?: string;
  lastActive?: string;
}

interface WorkspaceSettings {
  name: string;
  description: string;
  logo?: string;
  color: string;
  defaultRole: string;
  autoOnboarding: boolean;
  welcomeMessage: string;
  requiredTasks: string[];
}

interface Permission {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  memberCount: number;
}

interface WorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WorkspaceModal({ isOpen, onClose }: WorkspaceModalProps) {
  // State for active tab
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'roles' | 'settings' | 'onboarding'>('overview');
  
  // State for workspace data
  const [workspace, setWorkspace] = useState<WorkspaceSettings>({
    name: 'Miranki',
    description: 'AI-powered customer engagement platform',
    color: '#10B981',
    defaultRole: 'Custodian',
    autoOnboarding: true,
    welcomeMessage: 'Welcome to Miranki! We\'re excited to have you join our workspace. Here you'll find all the tools and resources you need to get started.',
    requiredTasks: ['Complete profile', 'Review documentation', 'Join team channel']
  });
  
  // State for members
  const [members, setMembers] = useState<WorkspaceMember[]>([
    { id: '1', name: 'Minh Nguyen', email: 'minh@miranki.com', role: 'Owner', lastActive: 'Just now' },
    { id: '2', name: 'Sophie Martin', email: 'sophie@miranki.com', role: 'Admin', lastActive: '2 hours ago' },
    { id: '3', name: 'Thomas Dubois', email: 'thomas@miranki.com', role: 'Steward', lastActive: '1 day ago' },
    { id: '4', name: 'Marie Bernard', email: 'marie@miranki.com', role: 'Custodian', lastActive: '3 days ago' },
    { id: '5', name: 'Jean Dupont', email: 'jean@miranki.com', role: 'Custodian', lastActive: '1 week ago' }
  ]);
  
  // State for roles
  const [roles, setRoles] = useState<Role[]>([
    {
      id: 'owner',
      name: 'Owner',
      description: 'Full access to all features and settings',
      permissions: ['admin.full', 'workspace.manage', 'members.manage', 'billing.manage'],
      memberCount: 1
    },
    {
      id: 'admin',
      name: 'Admin',
      description: 'Can manage workspace settings and members',
      permissions: ['workspace.manage', 'members.manage', 'content.manage'],
      memberCount: 1
    },
    {
      id: 'steward',
      name: 'Steward',
      description: 'Can manage content and view reports',
      permissions: ['content.manage', 'reports.view', 'agents.manage'],
      memberCount: 1
    },
    {
      id: 'custodian',
      name: 'Custodian',
      description: 'Basic access to workspace content',
      permissions: ['content.view', 'conversations.manage'],
      memberCount: 2
    }
  ]);
  
  // State for permissions
  const [permissions, setPermissions] = useState<Permission[]>([
    { id: 'admin.full', name: 'Full Admin Access', description: 'Complete control over all workspace settings', isEnabled: true },
    { id: 'workspace.manage', name: 'Manage Workspace', description: 'Edit workspace settings and configuration', isEnabled: true },
    { id: 'members.manage', name: 'Manage Members', description: 'Add, remove, and edit member permissions', isEnabled: true },
    { id: 'content.manage', name: 'Manage Content', description: 'Create, edit, and delete workspace content', isEnabled: true },
    { id: 'content.view', name: 'View Content', description: 'View workspace content', isEnabled: true },
    { id: 'reports.view', name: 'View Reports', description: 'Access analytics and reporting', isEnabled: true },
    { id: 'agents.manage', name: 'Manage Agents', description: 'Configure and deploy AI agents', isEnabled: true },
    { id: 'conversations.manage', name: 'Manage Conversations', description: 'Participate in and manage conversations', isEnabled: true },
    { id: 'billing.manage', name: 'Manage Billing', description: 'Access and manage billing information', isEnabled: true }
  ]);
  
  // State for new member form
  const [newMember, setNewMember] = useState({
    email: '',
    role: 'Custodian'
  });
  
  // State for editing workspace
  const [isEditing, setIsEditing] = useState(false);
  const [editedWorkspace, setEditedWorkspace] = useState(workspace);
  
  // State for new role form
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [newRole, setNewRole] = useState<Partial<Role>>({
    name: '',
    description: '',
    permissions: []
  });
  
  // State for editing role
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  
  // State for expanded sections
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    onboardingTasks: true,
    welcomeMessage: true
  });
  
  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Handle adding a new member
  const handleAddMember = () => {
    if (!newMember.email.trim()) return;
    
    const newMemberId = `member-${Date.now()}`;
    const emailParts = newMember.email.split('@');
    const nameGuess = emailParts[0].split('.').map(part => 
      part.charAt(0).toUpperCase() + part.slice(1)
    ).join(' ');
    
    const memberToAdd: WorkspaceMember = {
      id: newMemberId,
      name: nameGuess,
      email: newMember.email,
      role: newMember.role as 'Owner' | 'Admin' | 'Steward' | 'Custodian',
      lastActive: 'Never'
    };
    
    setMembers([...members, memberToAdd]);
    setNewMember({ email: '', role: 'Custodian' });
  };
  
  // Handle removing a member
  const handleRemoveMember = (memberId: string) => {
    setMembers(members.filter(member => member.id !== memberId));
  };
  
  // Handle changing a member's role
  const handleChangeRole = (memberId: string, newRole: string) => {
    setMembers(members.map(member => 
      member.id === memberId ? { ...member, role: newRole as any } : member
    ));
  };
  
  // Handle saving workspace settings
  const handleSaveWorkspace = () => {
    setWorkspace(editedWorkspace);
    setIsEditing(false);
  };
  
  // Handle adding a new role
  const handleAddRole = () => {
    if (!newRole.name) return;
    
    const roleToAdd: Role = {
      id: `role-${Date.now()}`,
      name: newRole.name,
      description: newRole.description || '',
      permissions: newRole.permissions || [],
      memberCount: 0
    };
    
    setRoles([...roles, roleToAdd]);
    setNewRole({ name: '', description: '', permissions: [] });
    setIsAddingRole(false);
  };
  
  // Handle editing a role
  const handleEditRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (role) {
      setNewRole(role);
      setEditingRoleId(roleId);
      setIsAddingRole(true);
    }
  };
  
  // Handle saving an edited role
  const handleSaveRole = () => {
    if (editingRoleId) {
      setRoles(roles.map(role => 
        role.id === editingRoleId ? { ...role, ...newRole as Role } : role
      ));
    } else {
      handleAddRole();
    }
    
    setEditingRoleId(null);
    setIsAddingRole(false);
  };
  
  // Handle deleting a role
  const handleDeleteRole = (roleId: string) => {
    setRoles(roles.filter(role => role.id !== roleId));
  };
  
  // Handle toggling a permission for a role
  const handleTogglePermission = (roleId: string, permissionId: string) => {
    setRoles(roles.map(role => {
      if (role.id === roleId) {
        const hasPermission = role.permissions.includes(permissionId);
        const newPermissions = hasPermission
          ? role.permissions.filter(p => p !== permissionId)
          : [...role.permissions, permissionId];
        
        return { ...role, permissions: newPermissions };
      }
      return role;
    }));
  };
  
  // Add a new onboarding task
  const handleAddOnboardingTask = (task: string) => {
    if (!task.trim()) return;
    setEditedWorkspace({
      ...editedWorkspace,
      requiredTasks: [...editedWorkspace.requiredTasks, task]
    });
  };
  
  // Remove an onboarding task
  const handleRemoveOnboardingTask = (index: number) => {
    setEditedWorkspace({
      ...editedWorkspace,
      requiredTasks: editedWorkspace.requiredTasks.filter((_, i) => i !== index)
    });
  };
  
  // If modal is not open, don't render anything
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="workspace-modal" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        
        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-7xl sm:w-full">
          <div className="flex h-[80vh]">
            {/* Sidebar */}
            <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Workspace</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'overview' 
                      ? 'bg-indigo-50 text-indigo-600' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Building className="mr-3 h-5 w-5 text-gray-400" />
                  Overview
                </button>
                
                <button
                  onClick={() => setActiveTab('members')}
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'members' 
                      ? 'bg-indigo-50 text-indigo-600' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Users className="mr-3 h-5 w-5 text-gray-400" />
                  Members
                </button>
                
                <button
                  onClick={() => setActiveTab('roles')}
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'roles' 
                      ? 'bg-indigo-50 text-indigo-600' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Shield className="mr-3 h-5 w-5 text-gray-400" />
                  Roles & Permissions
                </button>
                
                <button
                  onClick={() => setActiveTab('onboarding')}
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'onboarding' 
                      ? 'bg-indigo-50 text-indigo-600' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FileText className="mr-3 h-5 w-5 text-gray-400" />
                  Onboarding
                </button>
                
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'settings' 
                      ? 'bg-indigo-50 text-indigo-600' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Settings className="mr-3 h-5 w-5 text-gray-400" />
                  Settings
                </button>
              </nav>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-md bg-teal-500 flex items-center justify-center text-white font-bold">
                      {workspace.name.charAt(0)}
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{workspace.name}</p>
                    <p className="text-xs text-gray-500">{members.length} members</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main content */}
            <div className="flex-1 overflow-y-auto">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Workspace Overview</h2>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                      >
                        Edit Workspace
                      </button>
                    ) : (
                      <div className="flex space-x-3">
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveWorkspace}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                          Save Changes
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {!isEditing ? (
                    <div className="space-y-6">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="h-16 w-16 rounded-md" style={{ backgroundColor: workspace.color }}>
                            <div className="h-full w-full flex items-center justify-center text-white text-2xl font-bold">
                              {workspace.name.charAt(0)}
                            </div>
                          </div>
                        </div>
                        <div className="ml-5">
                          <h3 className="text-lg font-medium text-gray-900">{workspace.name}</h3>
                          <p className="text-sm text-gray-500">{workspace.description}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white shadow rounded-lg p-4">
                          <h4 className="text-base font-medium text-gray-900 mb-2">Members</h4>
                          <div className="flex items-center">
                            <Users className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-2xl font-bold text-gray-900">{members.length}</span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">Active workspace members</p>
                        </div>
                        
                        <div className="bg-white shadow rounded-lg p-4">
                          <h4 className="text-base font-medium text-gray-900 mb-2">Default Role</h4>
                          <div className="flex items-center">
                            <Shield className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-lg font-medium text-gray-900">{workspace.defaultRole}</span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">Assigned to new members</p>
                        </div>
                        
                        <div className="bg-white shadow rounded-lg p-4">
                          <h4 className="text-base font-medium text-gray-900 mb-2">Auto-Onboarding</h4>
                          <div className="flex items-center">
                            <div className={`h-5 w-5 rounded-full ${workspace.autoOnboarding ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                            <span className="text-lg font-medium text-gray-900">
                              {workspace.autoOnboarding ? 'Enabled' : 'Disabled'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">Automatic onboarding for new members</p>
                        </div>
                      </div>
                      
                      <div className="bg-white shadow rounded-lg p-4">
                        <h4 className="text-base font-medium text-gray-900 mb-4">Recent Activity</h4>
                        <div className="space-y-4">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                <UserPlus className="h-4 w-4 text-indigo-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-900">New member added</p>
                              <p className="text-xs text-gray-500">Marie Bernard joined the workspace</p>
                              <p className="text-xs text-gray-400">3 days ago</p>
                            </div>
                          </div>
                          
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                <Settings className="h-4 w-4 text-green-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-900">Workspace settings updated</p>
                              <p className="text-xs text-gray-500">Auto-onboarding was enabled</p>
                              <p className="text-xs text-gray-400">1 week ago</p>
                            </div>
                          </div>
                          
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                                <Shield className="h-4 w-4 text-yellow-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-900">Role permissions updated</p>
                              <p className="text-xs text-gray-500">Steward role was modified</p>
                              <p className="text-xs text-gray-400">2 weeks ago</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="workspace-name" className="block text-sm font-medium text-gray-700">
                            Workspace Name
                          </label>
                          <input
                            type="text"
                            id="workspace-name"
                            value={editedWorkspace.name}
                            onChange={(e) => setEditedWorkspace({ ...editedWorkspace, name: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="workspace-color" className="block text-sm font-medium text-gray-700">
                            Brand Color
                          </label>
                          <div className="mt-1 flex items-center">
                            <div 
                              className="h-8 w-8 rounded-md mr-3" 
                              style={{ backgroundColor: editedWorkspace.color }}
                            ></div>
                            <input
                              type="text"
                              id="workspace-color"
                              value={editedWorkspace.color}
                              onChange={(e) => setEditedWorkspace({ ...editedWorkspace, color: e.target.value })}
                              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              placeholder="#10B981"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="workspace-description" className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <textarea
                          id="workspace-description"
                          value={editedWorkspace.description}
                          onChange={(e) => setEditedWorkspace({ ...editedWorkspace, description: e.target.value })}
                          rows={3}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="default-role" className="block text-sm font-medium text-gray-700">
                          Default Role for New Members
                        </label>
                        <select
                          id="default-role"
                          value={editedWorkspace.defaultRole}
                          onChange={(e) => setEditedWorkspace({ ...editedWorkspace, defaultRole: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          {roles.map(role => (
                            <option key={role.id} value={role.name}>{role.name}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          id="auto-onboarding"
                          type="checkbox"
                          checked={editedWorkspace.autoOnboarding}
                          onChange={(e) => setEditedWorkspace({ ...editedWorkspace, autoOnboarding: e.target.checked })}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="auto-onboarding" className="ml-2 block text-sm text-gray-900">
                          Enable automatic onboarding for new members
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Members Tab */}
              {activeTab === 'members' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Workspace Members</h2>
                    <div className="flex space-x-3">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search members..."
                          className="w-64 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="flex items-center p-4 border-b border-gray-200 bg-gray-50">
                      <h3 className="text-base font-medium text-gray-900">Add New Member</h3>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-grow">
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                          </label>
                          <input
                            type="email"
                            id="email"
                            value={newMember.email}
                            onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="email@example.com"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                            Role
                          </label>
                          <select
                            id="role"
                            value={newMember.role}
                            onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          >
                            {roles.map(role => (
                              <option key={role.id} value={role.name}>{role.name}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="flex items-end">
                          <button
                            onClick={handleAddMember}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            <UserPlus className="h-4 w-4 mr-2" />
                            Invite
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Current Members ({members.length})</h3>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">Bulk actions:</span>
                        <select className="text-sm border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                          <option value="">Select action</option>
                          <option value="export">Export members</option>
                          <option value="remove">Remove selected</option>
                          <option value="change-role">Change role</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                      <ul className="divide-y divide-gray-200">
                        {members.map((member) => (
                          <li key={member.id}>
                            <div className="px-4 py-4 flex items-center sm:px-6">
                              <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    {member.avatar ? (
                                      <img src={member.avatar} alt={member.name} className="h-10 w-10 rounded-full" />
                                    ) : (
                                      <span className="text-gray-500 font-medium">{member.name.charAt(0)}</span>
                                    )}
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{member.name}</div>
                                    <div className="text-sm text-gray-500">{member.email}</div>
                                  </div>
                                </div>
                                <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                                  <div className="flex items-center space-x-4">
                                    <div className="text-sm text-gray-500">
                                      Last active: {member.lastActive}
                                    </div>
                                    <select
                                      value={member.role}
                                      onChange={(e) => handleChangeRole(member.id, e.target.value)}
                                      className="text-sm border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                      {roles.map(role => (
                                        <option key={role.id} value={role.name}>{role.name}</option>
                                      ))}
                                    </select>
                                    <button
                                      onClick={() => handleRemoveMember(member.id)}
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      <Trash2 className="h-5 w-5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Roles & Permissions Tab */}
              {activeTab === 'roles' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Roles & Permissions</h2>
                    <button
                      onClick={() => {
                        setNewRole({ name: '', description: '', permissions: [] });
                        setEditingRoleId(null);
                        setIsAddingRole(true);
                      }}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Role
                    </button>
                  </div>
                  
                  {isAddingRole ? (
                    <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
                      <div className="flex items-center p-4 border-b border-gray-200 bg-gray-50">
                        <h3 className="text-base font-medium text-gray-900">
                          {editingRoleId ? 'Edit Role' : 'Create New Role'}
                        </h3>
                      </div>
                      
                      <div className="p-4 space-y-4">
                        <div>
                          <label htmlFor="role-name" className="block text-sm font-medium text-gray-700">
                            Role Name
                          </label>
                          <input
                            type="text"
                            id="role-name"
                            value={newRole.name}
                            onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="role-description" className="block text-sm font-medium text-gray-700">
                            Description
                          </label>
                          <textarea
                            id="role-description"
                            value={newRole.description}
                            onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                            rows={2}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Permissions
                          </label>
                          <div className="space-y-2 max-h-60 overflow-y-auto p-2 border border-gray-200 rounded-md">
                            {permissions.map(permission => (
                              <div key={permission.id} className="flex items-start">
                                <div className="flex items-center h-5">
                                  <input
                                    id={`permission-${permission.id}`}
                                    type="checkbox"
                                    checked={newRole.permissions?.includes(permission.id) || false}
                                    onChange={(e) => {
                                      const isChecked = e.target.checked;
                                      setNewRole(prev => ({
                                        ...prev,
                                        permissions: isChecked
                                          ? [...(prev.permissions || []), permission.id]
                                          : (prev.permissions || []).filter(p => p !== permission.id)
                                      }));
                                    }}
                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                  />
                                </div>
                                <div className="ml-3 text-sm">
                                  <label htmlFor={`permission-${permission.id}`} className="font-medium text-gray-700">
                                    {permission.name}
                                  </label>
                                  <p className="text-gray-500">{permission.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-end space-x-3">
                        <button
                          onClick={() => setIsAddingRole(false)}
                          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveRole}
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          {editingRoleId ? 'Save Changes' : 'Create Role'}
                        </button>
                      </div>
                    </div>
                  ) : null}
                  
                  <div className="space-y-4">
                    {roles.map(role => (
                      <div key={role.id} className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="p-4 border-b border-gray-200">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">{role.name}</h3>
                              <p className="text-sm text-gray-500">{role.description}</p>
                              <div className="mt-1 flex items-center">
                                <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-1">
                                  {role.memberCount} {role.memberCount === 1 ? 'member' : 'members'}
                                </span>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditRole(role.id)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                <Edit2 className="h-5 w-5" />
                              </button>
                              {role.name !== 'Owner' && (
                                <button
                                  onClick={() => handleDeleteRole(role.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="px-4 py-3">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Permissions</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {permissions.map(permission => (
                              <div key={permission.id} className="flex items-center">
                                <input
                                  id={`${role.id}-${permission.id}`}
                                  type="checkbox"
                                  checked={role.permissions.includes(permission.id)}
                                  onChange={() => handleTogglePermission(role.id, permission.id)}
                                  disabled={role.name === 'Owner'} // Owner role has all permissions
                                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor={`${role.id}-${permission.id}`} className="ml-2 text-sm text-gray-700">
                                  {permission.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Onboarding Tab */}
              {activeTab === 'onboarding' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Member Onboarding</h2>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                      >
                        Edit Onboarding
                      </button>
                    ) : (
                      <div className="flex space-x-3">
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setEditedWorkspace(workspace);
                          }}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveWorkspace}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                          Save Changes
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                      <div 
                        className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center cursor-pointer"
                        onClick={() => toggleSection('welcomeMessage')}
                      >
                        <h3 className="text-base font-medium text-gray-900">Welcome Message</h3>
                        {expandedSections.welcomeMessage ? (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                      
                      {expandedSections.welcomeMessage && (
                        <div className="p-4">
                          {!isEditing ? (
                            <div className="bg-gray-50 p-4 rounded-md">
                              <p className="text-sm text-gray-700 whitespace-pre-line">
                                {workspace.welcomeMessage}
                              </p>
                            </div>
                          ) : (
                            <div>
                              <textarea
                                value={editedWorkspace.welcomeMessage}
                                onChange={(e) => setEditedWorkspace({ ...editedWorkspace, welcomeMessage: e.target.value })}
                                rows={4}
                                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Enter welcome message for new members..."
                              />
                              <p className="mt-2 text-sm text-gray-500">
                                This message will be shown to new members when they first join the workspace.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                      <div 
                        className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center cursor-pointer"
                        onClick={() => toggleSection('onboardingTasks')}
                      >
                        <h3 className="text-base font-medium text-gray-900">Required Onboarding Tasks</h3>
                        {expandedSections.onboardingTasks ? (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                      
                      {expandedSections.onboardingTasks && (
                        <div className="p-4">
                          {!isEditing ? (
                            <ul className="space-y-2">
                              {workspace.requiredTasks.map((task, index) => (
                                <li key={index} className="flex items-center">
                                  <Check className="h-5 w-5 text-green-500 mr-2" />
                                  <span className="text-sm text-gray-700">{task}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div className="space-y-4">
                              <ul className="space-y-2">
                                {editedWorkspace.requiredTasks.map((task, index) => (
                                  <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                                    <span className="text-sm text-gray-700">{task}</span>
                                    <button
                                      onClick={() => handleRemoveOnboardingTask(index)}
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  </li>
                                ))}
                              </ul>
                              
                              <div className="flex">
                                <input
                                  type="text"
                                  placeholder="Add a new task..."
                                  className="flex-1 border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      handleAddOnboardingTask(e.currentTarget.value);
                                      e.currentTarget.value = '';
                                    }
                                  }}
                                />
                                <button
                                  onClick={(e) => {
                                    const input = e.currentTarget.previousSibling as HTMLInputElement;
                                    handleAddOnboardingTask(input.value);
                                    input.value = '';
                                  }}
                                  className="inline-flex items-center px-4 py-2 border border-transparent border-l-0 text-sm font-medium rounded-r-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                  Add
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                      <div className="p-4 border-b border-gray-200 bg-gray-50">
                        <h3 className="text-base font-medium text-gray-900">Default Resource Access</h3>
                      </div>
                      
                      <div className="p-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <input
                                id="access-templates"
                                type="checkbox"
                                checked={true}
                                disabled={!isEditing}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                              <label htmlFor="access-templates" className="ml-2 block text-sm text-gray-900">
                                Templates Library
                              </label>
                            </div>
                            <select
                              disabled={!isEditing}
                              className="text-sm border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                              <option>View Only</option>
                              <option>Edit</option>
                              <option>Full Access</option>
                            </select>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <input
                                id="access-agents"
                                type="checkbox"
                                checked={true}
                                disabled={!isEditing}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                              <label htmlFor="access-agents" className="ml-2 block text-sm text-gray-900">
                                AI Agents
                              </label>
                            </div>
                            <select
                              disabled={!isEditing}
                              className="text-sm border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                              <option>View Only</option>
                              <option selected>Use</option>
                              <option>Configure</option>
                            </select>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <input
                                id="access-analytics"
                                type="checkbox"
                                checked={false}
                                disabled={!isEditing}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                              <label htmlFor="access-analytics" className="ml-2 block text-sm text-gray-900">
                                Analytics & Reports
                              </label>
                            </div>
                            <select
                              disabled={!isEditing}
                              className="text-sm border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                              <option>View Only</option>
                              <option>Export</option>
                              <option>Full Access</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Workspace Settings</h2>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                      >
                        Edit Settings
                      </button>
                    ) : (
                      <div className="flex space-x-3">
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setEditedWorkspace(workspace);
                          }}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveWorkspace}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                          Save Changes
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                      <div className="p-4 border-b border-gray-200 bg-gray-50">
                        <h3 className="text-base font-medium text-gray-900">Branding</h3>
                      </div>
                      
                      <div className="p-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div 
                              className="h-16 w-16 rounded-md flex items-center justify-center text-white text-2xl font-bold"
                              style={{ backgroundColor: workspace.color }}
                            >
                              {workspace.name.charAt(0)}
                            </div>
                          </div>
                          <div className="ml-5">
                            {!isEditing ? (
                              <>
                                <h3 className="text-lg font-medium text-gray-900">{workspace.name}</h3>
                                <p className="text-sm text-gray-500">{workspace.description}</p>
                              </>
                            ) : (
                              <div className="space-y-3">
                                <div>
                                  <label htmlFor="settings-name" className="block text-sm font-medium text-gray-700">
                                    Workspace Name
                                  </label>
                                  <input
                                    type="text"
                                    id="settings-name"
                                    value={editedWorkspace.name}
                                    onChange={(e) => setEditedWorkspace({ ...editedWorkspace, name: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  />
                                </div>
                                
                                <div>
                                  <label htmlFor="settings-description" className="block text-sm font-medium text-gray-700">
                                    Description
                                  </label>
                                  <textarea
                                    id="settings-description"
                                    value={editedWorkspace.description}
                                    onChange={(e) => setEditedWorkspace({ ...editedWorkspace, description: e.target.value })}
                                    rows={2}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {isEditing && (
                          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="settings-color" className="block text-sm font-medium text-gray-700">
                                Brand Color
                              </label>
                              <div className="mt-1 flex items-center">
                                <div 
                                  className="h-8 w-8 rounded-md mr-3" 
                                  style={{ backgroundColor: editedWorkspace.color }}
                                ></div>
                                <input
                                  type="text"
                                  id="settings-color"
                                  value={editedWorkspace.color}
                                  onChange={(e) => setEditedWorkspace({ ...editedWorkspace, color: e.target.value })}
                                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  placeholder="#10B981"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Logo (Coming Soon)
                              </label>
                              <div className="mt-1 flex items-center">
                                <button
                                  type="button"
                                  disabled
                                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 opacity-50 cursor-not-allowed"
                                >
                                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                  </svg>
                                  Upload Logo
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                      <div className="p-4 border-b border-gray-200 bg-gray-50">
                        <h3 className="text-base font-medium text-gray-900">Security Settings</h3>
                      </div>
                      
                      <div className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                            <p className="text-xs text-gray-500">Require 2FA for all workspace members</p>
                          </div>
                          <div className="flex items-center">
                            <button
                              type="button"
                              disabled={!isEditing}
                              className={`${
                                isEditing ? 'bg-gray-200' : 'bg-gray-200 opacity-50 cursor-not-allowed'
                              } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                            >
                              <span className="translate-x-0 pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200">
                                <span className="absolute inset-0 h-full w-full flex items-center justify-center transition-opacity opacity-100 ease-in duration-200">
                                  <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                                    <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </span>
                              </span>
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Session Timeout</h4>
                            <p className="text-xs text-gray-500">Automatically log out inactive users</p>
                          </div>
                          <select
                            disabled={!isEditing}
                            className={`text-sm border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                              !isEditing ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            <option>30 minutes</option>
                            <option>1 hour</option>
                            <option>4 hours</option>
                            <option>8 hours</option>
                            <option>24 hours</option>
                          </select>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">IP Restrictions</h4>
                            <p className="text-xs text-gray-500">Limit access to specific IP addresses</p>
                          </div>
                          <button
                            disabled={!isEditing}
                            className={`text-sm text-indigo-600 hover:text-indigo-900 ${
                              !isEditing ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            Configure
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                      <div className="p-4 border-b border-gray-200 bg-gray-50">
                        <h3 className="text-base font-medium text-gray-900">Advanced Settings</h3>
                      </div>
                      
                      <div className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Export Workspace Data</h4>
                            <p className="text-xs text-gray-500">Download all workspace data as JSON</p>
                          </div>
                          <button
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Export
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-red-600">Delete Workspace</h4>
                            <p className="text-xs text-gray-500">Permanently delete this workspace and all its data</p>
                          </div>
                          <button
                            className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}