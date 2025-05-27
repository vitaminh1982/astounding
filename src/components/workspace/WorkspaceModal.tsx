import React, { useState } from 'react';
import { X, Users, Shield, Settings, Bell, Calendar, Briefcase, Check, Plus, Trash2, Mail } from 'lucide-react';

interface WorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WorkspaceModal({ isOpen, onClose }: WorkspaceModalProps) {
  // Skip rendering if modal is not open
  if (!isOpen) return null;
  
  // State for active tab
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'roles' | 'onboarding' | 'settings'>('overview');
  
  // Sample workspace data
  const [workspaceData, setWorkspaceData] = useState({
    id: '1',
    name: 'Miranki',
    description: 'Main workspace for Miranki team',
    logo: null,
    color: '#10B981',
    members: [
      { id: '1', name: 'Minh Nguyen', email: 'minh@miranki.com', role: 'Owner', avatar: null },
      { id: '2', name: 'Sophie Martin', email: 'sophie@miranki.com', role: 'Admin', avatar: null },
      { id: '3', name: 'Thomas Dubois', email: 'thomas@miranki.com', role: 'Steward', avatar: null },
      { id: '4', name: 'Marie Lambert', email: 'marie@miranki.com', role: 'Custodian', avatar: null },
    ],
    roles: [
      { id: 'owner', name: 'Owner', description: 'Full access to all features', permissions: ['manage_workspace', 'manage_members', 'manage_roles', 'manage_billing'] },
      { id: 'admin', name: 'Admin', description: 'Can manage most settings', permissions: ['manage_workspace', 'manage_members', 'manage_roles'] },
      { id: 'steward', name: 'Steward', description: 'Can manage content and users', permissions: ['manage_content', 'view_members'] },
      { id: 'custodian', name: 'Custodian', description: 'Basic access to content', permissions: ['view_content'] },
    ],
    onboarding: {
      welcomeMessage: 'Welcome to Miranki! We\'re excited to have you join our workspace. Here you\'ll find all the tools and resources you need to get started.',
      defaultRole: 'Custodian',
      autoOnboarding: true,
      requiredTasks: ['Complete profile', 'Review documentation', 'Join team channel']
    }
  });
  
  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save workspace data
    console.log('Saving workspace data:', workspaceData);
    onClose();
  };
  
  // Tabs configuration
  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Briefcase className="w-5 h-5" /> },
    { id: 'members', label: 'Members', icon: <Users className="w-5 h-5" /> },
    { id: 'roles', label: 'Roles & Permissions', icon: <Shield className="w-5 h-5" /> },
    { id: 'onboarding', label: 'Onboarding', icon: <Calendar className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];
  
  return (
    <div className="fixed inset-0 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 10000 }}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col relative" style={{ zIndex: 10001 }}>
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Workspace Management</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200 bg-gray-50">
            <nav className="p-4">
              <ul className="space-y-1">
                {tabs.map((tab) => (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {tab.icon}
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          
          {/* Main content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Workspace Overview</h3>
                  <div className="bg-gray-50 rounded-lg p-6 border">
                    <div className="flex items-start space-x-4">
                      <div 
                        className="h-16 w-16 rounded-lg flex items-center justify-center text-white text-2xl font-bold"
                        style={{ backgroundColor: workspaceData.color }}
                      >
                        {workspaceData.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold">{workspaceData.name}</h4>
                        <p className="text-gray-500 mt-1">{workspaceData.description}</p>
                        <div className="mt-3 flex items-center text-sm text-gray-500">
                          <Users className="w-4 h-4 mr-1" />
                          <span>{workspaceData.members.length} members</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Recent Activity</h4>
                    <div className="space-y-3">
                      {[
                        { user: 'Minh Nguyen', action: 'added a new member', time: '2 hours ago' },
                        { user: 'Sophie Martin', action: 'updated workspace settings', time: '1 day ago' },
                        { user: 'Thomas Dubois', action: 'created a new template', time: '2 days ago' }
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center p-3 bg-white rounded-lg border">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                            {activity.user.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm">
                              <span className="font-medium">{activity.user}</span> {activity.action}
                            </p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Workspace Stats</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'Total Members', value: workspaceData.members.length, icon: <Users className="w-5 h-5 text-indigo-600" /> },
                        { label: 'Active Agents', value: 5, icon: <Briefcase className="w-5 h-5 text-green-600" /> },
                        { label: 'Templates', value: 24, icon: <Mail className="w-5 h-5 text-blue-600" /> },
                        { label: 'Conversations', value: 156, icon: <Bell className="w-5 h-5 text-amber-600" /> }
                      ].map((stat, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border">
                          <div className="flex items-center mb-2">
                            {stat.icon}
                            <span className="text-sm font-medium text-gray-500 ml-2">{stat.label}</span>
                          </div>
                          <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Members Tab */}
            {activeTab === 'members' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Workspace Members</h3>
                  <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
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
            )}
            
            {/* Roles & Permissions Tab */}
            {activeTab === 'roles' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Roles & Permissions</h3>
                  <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
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
            )}
            
            {/* Onboarding Tab */}
            {activeTab === 'onboarding' && (
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
            )}
            
            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Workspace Settings</h3>
                
                <div className="bg-white rounded-lg border p-6">
                  <form className="space-y-6">
                    <div>
                      <label htmlFor="workspaceName" className="block text-sm font-medium text-gray-700 mb-1">
                        Workspace Name
                      </label>
                      <input
                        id="workspaceName"
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={workspaceData.name}
                        onChange={(e) => setWorkspaceData({
                          ...workspaceData,
                          name: e.target.value
                        })}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="workspaceDescription" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        id="workspaceDescription"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={workspaceData.description}
                        onChange={(e) => setWorkspaceData({
                          ...workspaceData,
                          description: e.target.value
                        })}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Workspace Color
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {['#10B981', '#6366F1', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'].map((color) => (
                          <button
                            key={color}
                            type="button"
                            className={`w-8 h-8 rounded-full ${workspaceData.color === color ? 'ring-2 ring-offset-2 ring-gray-500' : ''}`}
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Workspace Logo
                      </label>
                      <div className="flex items-center">
                        <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center mr-4">
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
                            className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Upload Logo
                          </button>
                          <p className="mt-1 text-xs text-gray-500">
                            Recommended: 128x128px, PNG or JPG
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Danger Zone</h4>
                      <button
                        type="button"
                        className="px-4 py-2 bg-red-50 text-red-700 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Delete Workspace
                      </button>
                      <p className="mt-1 text-xs text-gray-500">
                        This action cannot be undone. All workspace data will be permanently deleted.
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}