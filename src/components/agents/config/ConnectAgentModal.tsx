import React, { useState } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

// Define provider types
type ProviderType = 'ai' | 'enterprise';

// Define provider interface
interface Provider {
  id: string;
  name: string;
  type: ProviderType;
  description: string;
  logo: string;
  fields: ProviderField[];
}

// Define field interface for provider configuration
interface ProviderField {
  id: string;
  label: string;
  type: 'text' | 'password' | 'select' | 'checkbox';
  placeholder?: string;
  required: boolean;
  options?: string[];
  description?: string;
}

// Define props for the modal component
interface ConnectAgentModalProps {
  onClose: () => void;
  onConnect: (provider: string, config: Record<string, any>) => void;
}

// AI Provider logos (using placeholder URLs - in a real app, these would be actual logo URLs)
const PROVIDER_LOGOS = {
  openai: 'https://images.pexels.com/photos/2085831/pexels-photo-2085831.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=2',
  anthropic: 'https://images.pexels.com/photos/2085831/pexels-photo-2085831.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=2',
  mistral: 'https://images.pexels.com/photos/2085831/pexels-photo-2085831.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=2',
  cohere: 'https://images.pexels.com/photos/2085831/pexels-photo-2085831.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=2',
  salesforce: 'https://images.pexels.com/photos/2085831/pexels-photo-2085831.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=2',
  sap: 'https://images.pexels.com/photos/2085831/pexels-photo-2085831.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=2',
  odoo: 'https://images.pexels.com/photos/2085831/pexels-photo-2085831.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=2',
  hubspot: 'https://images.pexels.com/photos/2085831/pexels-photo-2085831.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=2',
  zendesk: 'https://images.pexels.com/photos/2085831/pexels-photo-2085831.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=2',
  microsoft: 'https://images.pexels.com/photos/2085831/pexels-photo-2085831.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=2',
};

// Available providers data
const AVAILABLE_PROVIDERS: Provider[] = [
  // AI Providers
  {
    id: 'openai',
    name: 'OpenAI',
    type: 'ai',
    description: 'Connect to OpenAI models including GPT-4 and GPT-3.5 Turbo',
    logo: PROVIDER_LOGOS.openai,
    fields: [
      { id: 'api_key', label: 'API Key', type: 'password', placeholder: 'sk-...', required: true },
      { id: 'model', label: 'Default Model', type: 'select', options: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'], required: true },
      { id: 'organization', label: 'Organization ID', type: 'text', placeholder: 'org-...', required: false },
      { id: 'temperature', label: 'Default Temperature', type: 'text', placeholder: '0.7', required: false }
    ]
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    type: 'ai',
    description: 'Connect to Anthropic Claude models for advanced reasoning',
    logo: PROVIDER_LOGOS.anthropic,
    fields: [
      { id: 'api_key', label: 'API Key', type: 'password', placeholder: 'sk-ant-...', required: true },
      { id: 'model', label: 'Default Model', type: 'select', options: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'], required: true },
      { id: 'temperature', label: 'Default Temperature', type: 'text', placeholder: '0.7', required: false }
    ]
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    type: 'ai',
    description: 'Connect to Mistral AI models for efficient language processing',
    logo: PROVIDER_LOGOS.mistral,
    fields: [
      { id: 'api_key', label: 'API Key', type: 'password', placeholder: 'your-api-key', required: true },
      { id: 'model', label: 'Default Model', type: 'select', options: ['mistral-large', 'mistral-medium', 'mistral-small'], required: true },
      { id: 'temperature', label: 'Default Temperature', type: 'text', placeholder: '0.7', required: false }
    ]
  },
  {
    id: 'cohere',
    name: 'Cohere',
    type: 'ai',
    description: 'Connect to Cohere models for natural language understanding',
    logo: PROVIDER_LOGOS.cohere,
    fields: [
      { id: 'api_key', label: 'API Key', type: 'password', placeholder: 'your-api-key', required: true },
      { id: 'model', label: 'Default Model', type: 'select', options: ['command', 'command-light', 'command-nightly'], required: true }
    ]
  },
  
  // Enterprise Systems
  {
    id: 'salesforce',
    name: 'Salesforce',
    type: 'enterprise',
    description: 'Connect to Salesforce CRM for customer data integration',
    logo: PROVIDER_LOGOS.salesforce,
    fields: [
      { id: 'client_id', label: 'Client ID', type: 'text', required: true },
      { id: 'client_secret', label: 'Client Secret', type: 'password', required: true },
      { id: 'username', label: 'Username', type: 'text', required: true },
      { id: 'password', label: 'Password', type: 'password', required: true },
      { id: 'instance_url', label: 'Instance URL', type: 'text', placeholder: 'https://yourinstance.salesforce.com', required: true }
    ]
  },
  {
    id: 'sap',
    name: 'SAP',
    type: 'enterprise',
    description: 'Connect to SAP ERP systems for business process integration',
    logo: PROVIDER_LOGOS.sap,
    fields: [
      { id: 'client_id', label: 'Client ID', type: 'text', required: true },
      { id: 'client_secret', label: 'Client Secret', type: 'password', required: true },
      { id: 'base_url', label: 'Base URL', type: 'text', required: true },
      { id: 'oauth_url', label: 'OAuth URL', type: 'text', required: true }
    ]
  },
  {
    id: 'odoo',
    name: 'Odoo',
    type: 'enterprise',
    description: 'Connect to Odoo ERP for business management integration',
    logo: PROVIDER_LOGOS.odoo,
    fields: [
      { id: 'url', label: 'Odoo URL', type: 'text', placeholder: 'https://yourdomain.odoo.com', required: true },
      { id: 'db', label: 'Database Name', type: 'text', required: true },
      { id: 'username', label: 'Username', type: 'text', required: true },
      { id: 'api_key', label: 'API Key', type: 'password', required: true }
    ]
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    type: 'enterprise',
    description: 'Connect to HubSpot for marketing and sales automation',
    logo: PROVIDER_LOGOS.hubspot,
    fields: [
      { id: 'api_key', label: 'API Key', type: 'password', required: true },
      { id: 'portal_id', label: 'Portal ID', type: 'text', required: true }
    ]
  },
  {
    id: 'zendesk',
    name: 'Zendesk',
    type: 'enterprise',
    description: 'Connect to Zendesk for customer support integration',
    logo: PROVIDER_LOGOS.zendesk,
    fields: [
      { id: 'subdomain', label: 'Subdomain', type: 'text', placeholder: 'yourcompany', required: true },
      { id: 'email', label: 'Email', type: 'text', required: true },
      { id: 'api_token', label: 'API Token', type: 'password', required: true }
    ]
  },
  {
    id: 'microsoft',
    name: 'Microsoft Dynamics',
    type: 'enterprise',
    description: 'Connect to Microsoft Dynamics 365 for business applications',
    logo: PROVIDER_LOGOS.microsoft,
    fields: [
      { id: 'tenant_id', label: 'Tenant ID', type: 'text', required: true },
      { id: 'client_id', label: 'Client ID', type: 'text', required: true },
      { id: 'client_secret', label: 'Client Secret', type: 'password', required: true },
      { id: 'resource_url', label: 'Resource URL', type: 'text', required: true }
    ]
  }
];

const ConnectAgentModal: React.FC<ConnectAgentModalProps> = ({ onClose, onConnect }) => {
  // State for selected provider type
  const [selectedType, setSelectedType] = useState<ProviderType>('ai');
  
  // State for selected provider
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  
  // State for form values
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  
  // State for form errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // State for connection test
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  
  // Filter providers by type
  const filteredProviders = AVAILABLE_PROVIDERS.filter(provider => provider.type === selectedType);
  
  // Handle provider selection
  const handleSelectProvider = (provider: Provider) => {
    setSelectedProvider(provider);
    setFormValues({});
    setFormErrors({});
    setTestResult(null);
  };
  
  // Handle form input change
  const handleInputChange = (fieldId: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
    
    // Clear error for this field if it exists
    if (formErrors[fieldId]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };
  
  // Validate form
  const validateForm = () => {
    if (!selectedProvider) return false;
    
    const errors: Record<string, string> = {};
    
    selectedProvider.fields.forEach(field => {
      if (field.required && !formValues[field.id]) {
        errors[field.id] = `${field.label} is required`;
      }
    });
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle test connection
  const handleTestConnection = async () => {
    if (!validateForm()) return;
    
    setIsTestingConnection(true);
    setTestResult(null);
    
    try {
      // Simulate API call to test connection
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Randomly succeed or fail for demo purposes
      const success = Math.random() > 0.3;
      
      if (success) {
        setTestResult('success');
        toast.success('Connection test successful!');
      } else {
        setTestResult('error');
        toast.error('Connection test failed. Please check your credentials.');
      }
    } catch (error) {
      setTestResult('error');
      toast.error('Connection test failed. Please try again.');
    } finally {
      setIsTestingConnection(false);
    }
  };
  
  // Handle save connection
  const handleSaveConnection = () => {
    if (!validateForm() || !selectedProvider) return;
    
    // Call the onConnect callback with the provider ID and form values
    onConnect(selectedProvider.id, formValues);
    toast.success(`Successfully connected to ${selectedProvider.name}`);
  };
  
  // Back to provider selection
  const handleBackToProviders = () => {
    setSelectedProvider(null);
    setFormValues({});
    setFormErrors({});
    setTestResult(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-60 flex items-center justify-center z-50 p-4 md:p-0">
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl dark:shadow-gray-900 border border-gray-200 dark:border-gray-600 transition-colors"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-600">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {selectedProvider ? `Connect to ${selectedProvider.name}` : 'Connect External Agent'}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {!selectedProvider ? (
            // Provider selection view
            <div className="p-6">
              {/* Provider type tabs */}
              <div className="flex border-b border-gray-200 dark:border-gray-600 mb-6">
                <button
                  className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                    selectedType === 'ai' 
                      ? 'border-indigo-500 dark:border-teal-500 text-indigo-600 dark:text-teal-400' 
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  onClick={() => setSelectedType('ai')}
                >
                  AI Providers
                </button>
                <button
                  className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                    selectedType === 'enterprise' 
                      ? 'border-indigo-500 dark:border-teal-500 text-indigo-600 dark:text-teal-400' 
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  onClick={() => setSelectedType('enterprise')}
                >
                  Enterprise Systems
                </button>
              </div>
              
              {/* Provider grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProviders.map(provider => (
                  <div
                    key={provider.id}
                    className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-indigo-500 dark:hover:border-teal-400 hover:shadow-md dark:hover:shadow-gray-900 transition-all cursor-pointer bg-white dark:bg-gray-700"
                    onClick={() => handleSelectProvider(provider)}
                  >
                    <div className="flex items-start gap-3">
                      <img 
                        src={provider.logo} 
                        alt={provider.name} 
                        className="w-10 h-10 rounded-md object-cover"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">{provider.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{provider.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Provider configuration view
            <div className="p-6">
              <button
                className="flex items-center text-sm text-indigo-600 dark:text-teal-400 hover:text-indigo-800 dark:hover:text-teal-300 mb-6 transition-colors"
                onClick={handleBackToProviders}
              >
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to providers
              </button>
              
              <div className="flex items-start gap-4 mb-6">
                <img 
                  src={selectedProvider.logo} 
                  alt={selectedProvider.name} 
                  className="w-12 h-12 rounded-md object-cover"
                />
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{selectedProvider.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{selectedProvider.description}</p>
                </div>
              </div>
              
              <div className="space-y-6">
                {selectedProvider.fields.map(field => (
                  <div key={field.id}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {field.label}
                      {field.required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
                    </label>
                    
                    {field.type === 'select' ? (
                      <select
                        className={`w-full px-3 py-2 border rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:border-indigo-500 dark:focus:border-teal-500 transition-colors ${
                          formErrors[field.id] ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                        }`}
                        value={formValues[field.id] || ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                      >
                        <option value="">Select {field.label}</option>
                        {field.options?.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : field.type === 'checkbox' ? (
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={field.id}
                          checked={formValues[field.id] || false}
                          onChange={(e) => handleInputChange(field.id, e.target.checked)}
                          className="h-4 w-4 text-indigo-600 dark:text-teal-500 focus:ring-indigo-500 dark:focus:ring-teal-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                        />
                        <label htmlFor={field.id} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          {field.label}
                        </label>
                      </div>
                    ) : (
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:border-indigo-500 dark:focus:border-teal-500 transition-colors ${
                          formErrors[field.id] ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                        }`}
                        value={formValues[field.id] || ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                      />
                    )}
                    
                    {field.description && (
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{field.description}</p>
                    )}
                    
                    {formErrors[field.id] && (
                      <p className="mt-1 text-xs text-red-500 dark:text-red-400">{formErrors[field.id]}</p>
                    )}
                  </div>
                ))}
                
                {/* Test connection result */}
                {testResult && (
                  <div className={`p-4 rounded-md transition-colors ${
                    testResult === 'success' 
                      ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700' 
                      : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700'
                  }`}>
                    <div className="flex items-start">
                      {testResult === 'success' ? (
                        <Check className="w-5 h-5 text-green-500 dark:text-green-400 mt-0.5 mr-3" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 mr-3" />
                      )}
                      <div>
                        <h4 className={`text-sm font-medium ${
                          testResult === 'success' ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'
                        }`}>
                          {testResult === 'success' ? 'Connection Successful' : 'Connection Failed'}
                        </h4>
                        <p className={`text-sm ${
                          testResult === 'success' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
                        } mt-1`}>
                          {testResult === 'success' 
                            ? `Successfully connected to ${selectedProvider.name}. You can now save this connection.` 
                            : 'Failed to connect. Please check your credentials and try again.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 flex justify-end gap-3 transition-colors">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          
          {selectedProvider && (
            <>
              <button
                onClick={handleTestConnection}
                disabled={isTestingConnection}
                className="px-4 py-2 border border-indigo-300 dark:border-teal-600 rounded-md shadow-sm text-sm font-medium text-indigo-700 dark:text-teal-300 bg-indigo-50 dark:bg-teal-900/20 hover:bg-indigo-100 dark:hover:bg-teal-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isTestingConnection ? 'Testing...' : 'Test Connection'}
              </button>
              
              <button
                onClick={handleSaveConnection}
                disabled={testResult !== 'success'}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 dark:bg-teal-600 hover:bg-indigo-700 dark:hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:shadow-gray-900"
              >
                Connect
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ConnectAgentModal;
