import React, { useState } from 'react';
import { ChevronRight, Copy, Check, Variable, User, Building2, Search } from 'lucide-react';

const variables = {
  client: [
    { key: 'firstName', label: 'First Name', example: 'John' },
    { key: 'lastName', label: 'Last Name', example: 'Doe' },
    { key: 'email', label: 'Email', example: 'john.doe@example.com' },
    { key: 'phone', label: 'Phone', example: '123-456-7890' }
  ],
  company: [
    { key: 'name', label: 'Name', example: 'Acme Corp' },
    { key: 'address', label: 'Address', example: '123 Example St' },
    { key: 'phone', label: 'Phone', example: '987-654-3210' },
    { key: 'email', label: 'Email', example: 'contact@acme.com' }
  ]
};

export default function VariablesList() {
  const [activeCategory, setActiveCategory] = useState<'client' | 'company'>('client');
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedVariable, setCopiedVariable] = useState<string | null>(null);

  const handleCopy = (variable: string) => {
    navigator.clipboard.writeText(variable);
    setCopiedVariable(variable);
    setTimeout(() => setCopiedVariable(null), 2000);
  };

  const filteredVariables = {
    client: variables.client.filter(v => 
      v.key.includes(searchTerm.toLowerCase()) || 
      v.label.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    company: variables.company.filter(v => 
      v.key.includes(searchTerm.toLowerCase()) || 
      v.label.toLowerCase().includes(searchTerm.toLowerCase())
    )
  };

  return (
    <div className="bg-white">
      {/* Mobile Header */}
      <div className="sm:hidden">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center justify-between w-full p-4 border-b"
        >
          <div className="flex items-center gap-3">
            <Variable className="w-5 h-5 text-gray-500" />
            <span className="font-medium">Available Variables</span>
          </div>
          <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${
            showDetails ? 'rotate-90' : ''
          }`} />
        </button>
      </div>

      <div className={`${!showDetails && 'sm:block hidden'}`}>
        <div className="p-4 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search for a variable"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 border-b">
            {[
              { id: 'client', label: 'Client', icon: User },
              { id: 'company', label: 'Company', icon: Building2 }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as 'client' | 'company')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeCategory === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Variables List */}
          <div className="space-y-2">
            {filteredVariables[activeCategory].map(({ key, label, example }) => (
              <div
                key={key}
                className="group flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <code className="text-sm text-indigo-600 font-mono">
                      {`{${activeCategory}.${key}}`}
                    </code>
                    <span className="text-xs text-gray-500">{label}</span>
                  </div>
                  {example && (
                    <div className="mt-1 text-xs text-gray-500">
                      Example: {example}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleCopy(`{${activeCategory}.${key}}`)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Copy variable"
                >
                  {copiedVariable === `{${activeCategory}.${key}}` ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Info */}
        <div className="sm:hidden p-4 bg-gray-50 border-t text-sm text-gray-500">
          Tap on a variable to copy it
        </div>
      </div>
    </div>
  );
}
