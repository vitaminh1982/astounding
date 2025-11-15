import React, { useState } from 'react';
import { ChevronRight, Copy, Check, Variable, User, Building2, Search, Hash, Code, Info, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VariableItem {
  key: string;
  label: string;
  example: string;
  description?: string;
}

interface VariablesData {
  client: VariableItem[];
  company: VariableItem[];
}

const variables: VariablesData = {
  client: [
    { 
      key: 'firstName', 
      label: 'First Name', 
      example: 'John',
      description: 'Client\'s first name'
    },
    { 
      key: 'lastName', 
      label: 'Last Name', 
      example: 'Doe',
      description: 'Client\'s last name'
    },
    { 
      key: 'email', 
      label: 'Email', 
      example: 'john.doe@example.com',
      description: 'Client\'s email address'
    },
    { 
      key: 'phone', 
      label: 'Phone', 
      example: '123-456-7890',
      description: 'Client\'s phone number'
    },
    { 
      key: 'id', 
      label: 'Client ID', 
      example: 'CL-12345',
      description: 'Unique client identifier'
    }
  ],
  company: [
    { 
      key: 'name', 
      label: 'Company Name', 
      example: 'Acme Corp',
      description: 'Your company name'
    },
    { 
      key: 'address', 
      label: 'Address', 
      example: '123 Example St',
      description: 'Company address'
    },
    { 
      key: 'phone', 
      label: 'Phone', 
      example: '987-654-3210',
      description: 'Company phone number'
    },
    { 
      key: 'email', 
      label: 'Email', 
      example: 'contact@acme.com',
      description: 'Company email address'
    },
    { 
      key: 'website', 
      label: 'Website', 
      example: 'www.acme.com',
      description: 'Company website URL'
    }
  ]
};

type CategoryType = 'client' | 'company';

export default function VariablesList() {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('client');
  const [showDetails, setShowDetails] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedVariable, setCopiedVariable] = useState<string | null>(null);

  const handleCopy = async (variable: string) => {
    try {
      await navigator.clipboard.writeText(variable);
      setCopiedVariable(variable);
      setTimeout(() => setCopiedVariable(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const filteredVariables: VariablesData = {
    client: variables.client.filter(v => 
      v.key.toLowerCase().includes(searchTerm.toLowerCase()) || 
      v.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.example.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    company: variables.company.filter(v => 
      v.key.toLowerCase().includes(searchTerm.toLowerCase()) || 
      v.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.example.toLowerCase().includes(searchTerm.toLowerCase())
    )
  };

  const totalVariables = variables.client.length + variables.company.length;
  const filteredCount = filteredVariables.client.length + filteredVariables.company.length;

  const tabs = [
    { 
      id: 'client' as CategoryType, 
      label: 'Client', 
      icon: User,
      count: filteredVariables.client.length,
      color: 'text-blue-600 dark:text-blue-400'
    },
    { 
      id: 'company' as CategoryType, 
      label: 'Company', 
      icon: Building2,
      count: filteredVariables.company.length,
      color: 'text-purple-600 dark:text-purple-400'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-cyan-900/30 border border-indigo-200 dark:border-cyan-800 rounded-lg transition-colors">
            <Variable className="w-5 h-5 text-indigo-600 dark:text-cyan-400 transition-colors" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 transition-colors">
              Available Variables
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">
              {totalVariables} variables ready to use
            </p>
          </div>
        </div>
        
        {/* Mobile Toggle */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="sm:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          aria-label={showDetails ? "Hide variables list" : "Show variables list"}
        >
          <ChevronRight className={`w-5 h-5 transition-transform ${showDetails ? 'rotate-90' : ''}`} />
        </button>
      </div>

      {/* Main Content */}
      <AnimatePresence>
        {(showDetails || window.innerWidth >= 640) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm dark:shadow-gray-900 transition-colors">
              {/* Search Bar */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 transition-colors">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search variables by name or example..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:border-indigo-500 dark:focus:border-teal-500 shadow-sm dark:shadow-gray-900 transition-colors focus:outline-none"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      <span className="sr-only">Clear search</span>
                      ×
                    </button>
                  )}
                </div>
                {searchTerm && (
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 transition-colors">
                    Found {filteredCount} of {totalVariables} variables
                  </p>
                )}
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200 dark:border-gray-700 transition-colors">
                {tabs.map((tab) => {
                  const isActive = activeCategory === tab.id;
                  const Icon = tab.icon;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveCategory(tab.id)}
                      className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'text-indigo-600 dark:text-teal-400'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                      <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-indigo-100 dark:bg-teal-900/30 text-indigo-700 dark:text-teal-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}>
                        {tab.count}
                      </span>
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-teal-400"
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Variables List */}
              <div className="p-4">
                {filteredVariables[activeCategory].length > 0 ? (
                  <div className="space-y-2">
                    <AnimatePresence mode="popLayout">
                      {filteredVariables[activeCategory].map((variable, index) => {
                        const variableString = `{${activeCategory}.${variable.key}}`;
                        const isCopied = copiedVariable === variableString;
                        
                        return (
                          <motion.div
                            key={variable.key}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: index * 0.03 }}
                            className="group p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-teal-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm dark:shadow-gray-900 hover:shadow-md dark:hover:shadow-gray-800"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                {/* Variable Code */}
                                <div className="flex items-center gap-2 mb-1">
                                  <Hash className="w-3 h-3 text-gray-400 dark:text-gray-500 flex-shrink-0 transition-colors" />
                                  <code className="text-sm font-mono text-indigo-600 dark:text-teal-400 font-semibold transition-colors">
                                    {variableString}
                                  </code>
                                </div>
                                
                                {/* Label */}
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1 transition-colors">
                                  {variable.label}
                                </div>
                                
                                {/* Description */}
                                {variable.description && (
                                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 transition-colors">
                                    {variable.description}
                                  </div>
                                )}
                                
                                {/* Example */}
                                <div className="flex items-center gap-2 text-xs">
                                  <span className="text-gray-500 dark:text-gray-400 transition-colors">
                                    Example:
                                  </span>
                                  <code className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded font-mono transition-colors">
                                    {variable.example}
                                  </code>
                                </div>
                              </div>
                              
                              {/* Copy Button */}
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleCopy(variableString)}
                                className={`p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                                  isCopied
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 focus:ring-green-500 dark:focus:ring-green-400'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-indigo-100 dark:hover:bg-teal-900/30 hover:text-indigo-600 dark:hover:text-teal-400 focus:ring-indigo-500 dark:focus:ring-teal-500'
                                }`}
                                title={isCopied ? 'Copied!' : 'Copy variable'}
                              >
                                {isCopied ? (
                                  <Check className="w-4 h-4" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </motion.button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4 transition-colors">
                      <Search className="w-8 h-8 text-gray-400 dark:text-gray-500 transition-colors" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium mb-1 transition-colors">
                      No variables found
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">
                      Try adjusting your search terms
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Info Box */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded transition-colors">
                  <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 transition-colors" />
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300 transition-colors">
                  <p className="font-medium mb-1">How to use variables</p>
                  <ul className="space-y-1 list-disc list-inside text-xs">
                    <li>Click the copy button to copy a variable to your clipboard</li>
                    <li>Paste the variable into your message template</li>
                    <li>Variables will be replaced with actual data when sent</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-center shadow-sm dark:shadow-gray-900 transition-colors">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg inline-flex mb-2 transition-colors">
                  <User className="w-4 h-4 text-blue-600 dark:text-blue-400 transition-colors" />
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors">
                  {variables.client.length}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
                  Client Variables
                </p>
              </div>

              <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-center shadow-sm dark:shadow-gray-900 transition-colors">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg inline-flex mb-2 transition-colors">
                  <Building2 className="w-4 h-4 text-purple-600 dark:text-purple-400 transition-colors" />
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors">
                  {variables.company.length}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
                  Company Variables
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Hint */}
      <div className="sm:hidden p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 rounded-b-lg text-center transition-colors">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400 transition-colors">
          <Sparkles className="w-4 h-4" />
          <span>Tap the copy button to use a variable</span>
        </div>
      </div>
    </div>
  );
}
