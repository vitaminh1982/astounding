import React, { useState } from 'react';
import { Link2, Plus, Check, Search } from 'lucide-react';

interface IntegrationsConfigProps {
  integrations: string[];
  onChange: (integrations: string[]) => void;
}

// List of available integrations to choose from
const AVAILABLE_INTEGRATIONS = [
  { id: 'gmail', name: 'Gmail', category: 'Communication' },
  { id: 'slack', name: 'Slack', category: 'Communication' },
  { id: 'salesforce', name: 'Salesforce', category: 'CRM' },
  { id: 'hubspot', name: 'HubSpot', category: 'CRM' },
  { id: 'zendesk', name: 'Zendesk', category: 'Support' },
  { id: 'asana', name: 'Asana', category: 'Project Management' },
  { id: 'notion', name: 'Notion', category: 'Knowledge Base' },
  { id: 'airtable', name: 'Airtable', category: 'Database' },
  { id: 'zapier', name: 'Zapier', category: 'Automation' },
  { id: 'make', name: 'Make (Integromat)', category: 'Automation' },
  { id: 'outlook', name: 'Outlook', category: 'Communication' },
  { id: 'google_calendar', name: 'Google Calendar', category: 'Calendar' },
  { id: 'zoom', name: 'Zoom', category: 'Video Conferencing' },
  { id: 'dropbox', name: 'Dropbox', category: 'Storage' },
  { id: 'google_drive', name: 'Google Drive', category: 'Storage' },
];

export default function IntegrationsConfig({ integrations = [], onChange }: IntegrationsConfigProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Get unique categories for filtering
  const categories = Array.from(new Set(AVAILABLE_INTEGRATIONS.map(i => i.category)));
  
  // Filter available integrations based on search and category
  const filteredIntegrations = AVAILABLE_INTEGRATIONS.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || integration.category === selectedCategory;
    const notAlreadyConnected = !integrations.includes(integration.name);
    return matchesSearch && matchesCategory && notAlreadyConnected;
  });
  
  const handleAddIntegration = (integrationName: string) => {
    const updatedIntegrations = [...integrations, integrationName];
    onChange(updatedIntegrations);
    setIsAddModalOpen(false);
    setSearchTerm('');
    setSelectedCategory(null);
  };
  
  const handleRemoveIntegration = (integrationName: string) => {
    const updatedIntegrations = integrations.filter(name => name !== integrationName);
    onChange(updatedIntegrations);
  };

  return (
    <div className="space-y-4 relative">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Integrations</h3>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1 px-3 py-1 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>
      
      {integrations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrations.map((integration) => (
            <div key={integration} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Link2 className="w-4 h-4 text-gray-600" />
                </div>
                <span>{integration}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-green-600 flex items-center">
                  <Check className="w-3 h-3 mr-1" />
                  Connected
                </span>
                <button 
                  onClick={() => handleRemoveIntegration(integration)}
                  className="p-1 text-gray-400 hover:text-red-500 rounded-full transition-colors"
                  title="Remove integration"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border rounded-lg bg-gray-50">
          <Link2 className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No integrations connected yet</p>
          <p className="text-sm text-gray-400 mt-1 mb-4">Add tools that your agent can connect with.</p>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Integration
          </button>
        </div>
      )}
      
      {/* Add Integration Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">Add Integration</h3>
              <p className="text-sm text-gray-500 mt-1">Connect your agent with tools and services</p>
            </div>
            
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search integrations..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-3 py-1 text-xs rounded-full ${
                    selectedCategory === null 
                      ? 'bg-indigo-100 text-indigo-800' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
                    className={`px-3 py-1 text-xs rounded-full ${
                      category === selectedCategory 
                        ? 'bg-indigo-100 text-indigo-800' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="overflow-y-auto flex-grow">
              {filteredIntegrations.length > 0 ? (
                <div className="divide-y">
                  {filteredIntegrations.map((integration) => (
                    <div key={integration.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Link2 className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium">{integration.name}</p>
                          <p className="text-xs text-gray-500">{integration.category}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddIntegration(integration.name)}
                        className="px-3 py-1 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        Connect
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <p>No matching integrations found.</p>
                  {searchTerm && (
                    <p className="text-sm mt-1">Try a different search term or category.</p>
                  )}
                </div>
              )}
            </div>
            
            <div className="p-4 border-t flex gap-2 justify-end">
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setSearchTerm('');
                  setSelectedCategory(null);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
