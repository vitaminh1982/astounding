import React, { useState } from 'react';
import { Database, Globe, Lock, Search, Download, Trash2, Edit2, Eye, EyeOff, Filter, ArrowDown, ArrowUp, Info } from 'lucide-react';
import { WorkspaceData } from '../types';

interface DataWalletTabProps {
  workspaceData: WorkspaceData;
}

// Data types for the different categories
interface DataItem {
  id: string;
  name: string;
  description: string;
  size: string;
  lastModified: string;
  location: string;
  type: string;
  metadata?: Record<string, any>;
}

/**
 * Data Wallet tab component for the workspace modal
 * Displays and manages platform data across three categories:
 * - Transaction Data
 * - Corporate / Public Data
 * - Private Data
 */
const DataWalletTab: React.FC<DataWalletTabProps> = ({ workspaceData }) => {
  // State for active category
  const [activeCategory, setActiveCategory] = useState<'transaction' | 'public' | 'private'>('transaction');
  
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'name' | 'size' | 'lastModified'>('lastModified');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // State for storage usage
  const [storageUsage, setStorageUsage] = useState({
    used: 2.7, // GB
    total: 10, // GB
    percentage: 27 // %
  });

  // Mock data for each category
  const transactionData: DataItem[] = [
    {
      id: 'tr-001',
      name: 'Payment Confirmation #12345',
      description: 'Transaction record for subscription renewal',
      size: '24 KB',
      lastModified: '2025-03-15',
      location: 'EU-West',
      type: 'JSON',
      metadata: {
        transactionId: 'tx-9876543',
        amount: '€149.00',
        status: 'completed'
      }
    },
    {
      id: 'tr-002',
      name: 'User Session Log',
      description: 'Activity log for user session',
      size: '156 KB',
      lastModified: '2025-03-14',
      location: 'EU-West',
      type: 'JSON',
      metadata: {
        sessionId: 'sess-123456',
        duration: '45 minutes',
        actions: 32
      }
    },
    {
      id: 'tr-003',
      name: 'API Usage Report',
      description: 'Monthly API call statistics',
      size: '1.2 MB',
      lastModified: '2025-03-10',
      location: 'EU-West',
      type: 'CSV',
      metadata: {
        period: 'March 2025',
        totalCalls: 12567,
        avgResponseTime: '230ms'
      }
    },
    {
      id: 'tr-004',
      name: 'Conversation History',
      description: 'Chat logs with AI agents',
      size: '3.4 MB',
      lastModified: '2025-03-08',
      location: 'EU-West',
      type: 'JSON',
      metadata: {
        conversations: 45,
        messages: 312,
        agents: ['Customer Support', 'Sales Assistant']
      }
    }
  ];

  const publicData: DataItem[] = [
    {
      id: 'pub-001',
      name: 'Company Profile',
      description: 'Public company information',
      size: '128 KB',
      lastModified: '2025-02-20',
      location: 'Global CDN',
      type: 'JSON',
      metadata: {
        visibility: 'Public',
        views: 1245,
        shares: 87
      }
    },
    {
      id: 'pub-002',
      name: 'Product Catalog',
      description: 'Public product listings',
      size: '4.5 MB',
      lastModified: '2025-03-05',
      location: 'Global CDN',
      type: 'JSON',
      metadata: {
        products: 128,
        categories: 12,
        lastFullUpdate: '2025-03-01'
      }
    },
    {
      id: 'pub-003',
      name: 'Knowledge Base Articles',
      description: 'Public help documentation',
      size: '8.2 MB',
      lastModified: '2025-03-12',
      location: 'Global CDN',
      type: 'Markdown',
      metadata: {
        articles: 56,
        categories: 8,
        contributors: 5
      }
    }
  ];

  const privateData: DataItem[] = [
    {
      id: 'priv-001',
      name: 'Customer Database',
      description: 'Encrypted customer records',
      size: '24.5 MB',
      lastModified: '2025-03-15',
      location: 'EU-West (Encrypted)',
      type: 'Database',
      metadata: {
        records: 1567,
        encryptionLevel: 'AES-256',
        lastBackup: '2025-03-15'
      }
    },
    {
      id: 'priv-002',
      name: 'Payment Methods',
      description: 'Stored payment information',
      size: '1.8 MB',
      lastModified: '2025-03-10',
      location: 'EU-West (Encrypted)',
      type: 'JSON',
      metadata: {
        methods: 3,
        pciCompliance: 'Level 1',
        tokenized: true
      }
    },
    {
      id: 'priv-003',
      name: 'User Preferences',
      description: 'Personal settings and preferences',
      size: '512 KB',
      lastModified: '2025-03-14',
      location: 'EU-West',
      type: 'JSON',
      metadata: {
        settings: 24,
        defaultLanguage: 'English',
        theme: 'Light'
      }
    },
    {
      id: 'priv-004',
      name: 'API Keys',
      description: 'Secure API credentials',
      size: '32 KB',
      lastModified: '2025-02-28',
      location: 'EU-West (Encrypted)',
      type: 'JSON',
      metadata: {
        keys: 5,
        permissions: 'Read/Write',
        rotationPolicy: '90 days'
      }
    }
  ];

  // Get active data based on selected category
  const getActiveData = (): DataItem[] => {
    let data: DataItem[] = [];
    
    switch (activeCategory) {
      case 'transaction':
        data = transactionData;
        break;
      case 'public':
        data = publicData;
        break;
      case 'private':
        data = privateData;
        break;
    }
    
    // Apply search filter
    if (searchQuery) {
      data = data.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply sorting
    data = [...data].sort((a, b) => {
      if (sortField === 'name') {
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortField === 'size') {
        // Simple size comparison (not perfect but works for demo)
        const aSize = parseFloat(a.size.split(' ')[0]);
        const bSize = parseFloat(b.size.split(' ')[0]);
        return sortDirection === 'asc' ? aSize - bSize : bSize - aSize;
      } else {
        // lastModified
        const aDate = new Date(a.lastModified);
        const bDate = new Date(b.lastModified);
        return sortDirection === 'asc' 
          ? aDate.getTime() - bDate.getTime()
          : bDate.getTime() - aDate.getTime();
      }
    });
    
    return data;
  };

  // Get category description
  const getCategoryDescription = (): string => {
    switch (activeCategory) {
      case 'transaction':
        return 'Transaction data includes all interactions and platform transactions. This data is used for analytics, auditing, and service improvement.';
      case 'public':
        return 'Corporate data is openly accessible across the platform. This includes shared documents, public profiles, and community content.';
      case 'private':
        return 'Private data contains sensitive and personal information. This data is encrypted and access is strictly controlled.';
    }
  };

  // Get category icon
  const getCategoryIcon = () => {
    switch (activeCategory) {
      case 'transaction':
        return <Database className="w-5 h-5 text-indigo-600" />;
      case 'public':
        return <Globe className="w-5 h-5 text-green-600" />;
      case 'private':
        return <Lock className="w-5 h-5 text-red-600" />;
    }
  };

  // Toggle sort direction or change sort field
  const handleSort = (field: 'name' | 'size' | 'lastModified') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Render sort indicator
  const renderSortIndicator = (field: 'name' | 'size' | 'lastModified') => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' 
      ? <ArrowUp className="w-4 h-4 ml-1" /> 
      : <ArrowDown className="w-4 h-4 ml-1" />;
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Data Wallet</h3>
      
      {/* Storage usage indicator */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-medium text-gray-700">Storage Usage</h4>
          <span className="text-sm text-gray-500">{storageUsage.used} GB of {storageUsage.total} GB used</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600"
            style={{ width: `${storageUsage.percentage}%` }}
          ></div>
        </div>
      </div>
      
      {/* Category tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveCategory('transaction')}
          className={`flex items-center px-4 py-2 border-b-2 font-medium text-sm ${
            activeCategory === 'transaction'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <Database className="w-4 h-4 mr-2" />
          Transaction Data
        </button>
        <button
          onClick={() => setActiveCategory('public')}
          className={`flex items-center px-4 py-2 border-b-2 font-medium text-sm ${
            activeCategory === 'public'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <Globe className="w-4 h-4 mr-2" />
          Corporate Data
        </button>
        <button
          onClick={() => setActiveCategory('private')}
          className={`flex items-center px-4 py-2 border-b-2 font-medium text-sm ${
            activeCategory === 'private'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <Lock className="w-4 h-4 mr-2" />
          Private Data
        </button>
      </div>
      
      {/* Category description */}
      <div className="bg-gray-50 p-4 rounded-lg flex items-start">
        {getCategoryIcon()}
        <p className="ml-3 text-sm text-gray-600">{getCategoryDescription()}</p>
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search data..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white hover:bg-gray-50">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>
      
      {/* Data table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Name {renderSortIndicator('name')}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('size')}
                >
                  <div className="flex items-center">
                    Size {renderSortIndicator('size')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('lastModified')}
                >
                  <div className="flex items-center">
                    Last Modified {renderSortIndicator('lastModified')}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getActiveData().map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {activeCategory === 'transaction' && <Database className="h-5 w-5 text-indigo-500" />}
                        {activeCategory === 'public' && <Globe className="h-5 w-5 text-green-500" />}
                        {activeCategory === 'private' && <Lock className="h-5 w-5 text-red-500" />}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.lastModified).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-900">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Empty state */}
        {getActiveData().length === 0 && (
          <div className="py-12 text-center">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <Database className="h-full w-full" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No data found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery 
                ? 'Try adjusting your search query or filters' 
                : 'No data available in this category'}
            </p>
          </div>
        )}
      </div>
      
      {/* Data privacy information */}
      {activeCategory === 'private' && (
        <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-start">
          <Info className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="ml-3">
            <h4 className="text-sm font-medium text-red-800">Privacy Notice</h4>
            <p className="mt-1 text-sm text-red-600">
              Private data is encrypted at rest and in transit. Access is restricted and all operations are logged for security auditing.
            </p>
          </div>
        </div>
      )}
      
      {activeCategory === 'public' && (
        <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-start">
          <Info className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="ml-3">
            <h4 className="text-sm font-medium text-green-800">Visibility Notice</h4>
            <p className="mt-1 text-sm text-green-600">
              Public data is visible to all platform users. Be mindful of what information you choose to make public.
            </p>
          </div>
        </div>
      )}
      
      {activeCategory === 'transaction' && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 flex items-start">
          <Info className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
          <div className="ml-3">
            <h4 className="text-sm font-medium text-indigo-800">Transaction Data Notice</h4>
            <p className="mt-1 text-sm text-indigo-600">
              Transaction data is retained according to our data retention policy and used for service improvement and analytics.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataWalletTab;