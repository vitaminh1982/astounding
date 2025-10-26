import React, { useState } from 'react';
import { 
  Database, 
  Globe, 
  Lock, 
  Search, 
  Download, 
  Trash2, 
  Edit2, 
  Eye, 
  EyeOff, 
  Filter, 
  ArrowDown, 
  ArrowUp, 
  Info,
  User,
  Building,
  Users,
  Settings,
  Shield,
  CheckCircle,
  BarChart3,
  Calendar,
  UserCheck,
  ShieldCheck,
  ArrowRight,
  Edit
} from 'lucide-react';
import { WorkspaceData } from '../types';

interface DataWalletTabProps {
  workspaceData: WorkspaceData;
}

interface DataItem {
  id: string;
  name: string;
  description: string;
  size: string;
  lastModified: string;
  location: string;
  type: string;
  owner: 'user' | 'company' | 'shared' | 'system';
  privacyLevel: 'public' | 'internal' | 'confidential' | 'restricted';
  metadata?: Record<string, any>;
}

// Categories configuration
const categories = {
  'personal': {
    label: 'Personal Data',
    icon: User,
    color: 'purple',
    description: 'Your personal settings, preferences, and private information. Only you have access to this data.'
  },
  'business': {
    label: 'Business Data',
    icon: Building,
    color: 'blue',
    description: 'Shared business information, documents, and corporate resources accessible across your organization.'
  },
  'activity': {
    label: 'Activity & Usage',
    icon: BarChart3,
    color: 'green',
    description: 'Platform usage data, transaction history, and activity logs for analytics and audit purposes.'
  }
};

// Data Ownership Badge Component
const DataOwnershipBadge = ({ owner }: { owner: string }) => {
  const getOwnershipConfig = () => {
    switch (owner) {
      case 'user':
        return { label: 'Your Data', color: 'purple', icon: User };
      case 'company':
        return { label: 'Company Data', color: 'blue', icon: Building };
      case 'shared':
        return { label: 'Shared', color: 'green', icon: Users };
      default:
        return { label: 'System', color: 'gray', icon: Settings };
    }
  };

  const config = getOwnershipConfig();
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${config.color}-100 dark:bg-${config.color}-900 text-${config.color}-800 dark:text-${config.color}-100`}>
      <config.icon className="w-3 h-3 mr-1" />
      {config.label}
    </span>
  );
};

// Privacy Level Indicator Component
const PrivacyLevelIndicator = ({ level }: { level: string }) => {
  const levels = {
    'public': { label: 'Public', color: 'green', icon: Globe },
    'internal': { label: 'Company Only', color: 'blue', icon: Building },
    'confidential': { label: 'Confidential', color: 'orange', icon: EyeOff },
    'restricted': { label: 'Restricted', color: 'red', icon: Lock }
  };

  const config = levels[level as keyof typeof levels];
  
  return (
    <div className={`flex items-center text-${config.color}-600 dark:text-${config.color}-400`}>
      <config.icon className="w-4 h-4 mr-1" />
      <span className="text-xs font-medium">{config.label}</span>
    </div>
  );
};

// Data Governance Overview Component
const DataGovernanceOverview = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Data Compliance</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">98%</p>
        </div>
        <ShieldCheck className="w-8 h-8 text-green-500 dark:text-green-400" />
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">GDPR & SOC2 compliant</p>
    </div>
    
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Access Requests</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-teal-400">3</p>
        </div>
        <UserCheck className="w-8 h-8 text-blue-500 dark:text-teal-400" />
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Pending your approval</p>
    </div>
    
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Retention Policy</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">Active</p>
        </div>
        <Calendar className="w-8 h-8 text-purple-500 dark:text-purple-400" />
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Auto-cleanup enabled</p>
    </div>
  </div>
);

// User Data Controls Component
const UserDataControls = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Your Data Rights</h4>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <button className="flex flex-col items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
        <Download className="w-6 h-6 text-blue-600 dark:text-teal-400 mb-2" />
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Export Data</span>
        <span className="text-xs text-gray-500 dark:text-gray-400 text-center">Download your data</span>
      </button>
      
      <button className="flex flex-col items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
        <Edit className="w-6 h-6 text-green-600 dark:text-green-400 mb-2" />
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Update Info</span>
        <span className="text-xs text-gray-500 dark:text-gray-400 text-center">Modify your data</span>
      </button>
      
      <button className="flex flex-col items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
        <EyeOff className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-2" />
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Privacy Settings</span>
        <span className="text-xs text-gray-500 dark:text-gray-400 text-center">Control visibility</span>
      </button>
      
      <button className="flex flex-col items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
        <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400 mb-2" />
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Delete Data</span>
        <span className="text-xs text-gray-500 dark:text-gray-400 text-center">Remove permanently</span>
      </button>
    </div>
  </div>
);

// Data Flow Diagram Component
const DataFlowDiagram = () => (
  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">How Your Data is Organized</h4>
    <div className="flex items-center justify-between">
      <div className="text-center">
        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-2">
          <User className="w-6 h-6 text-purple-600 dark:text-purple-300" />
        </div>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Personal Data</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">Only you control</p>
      </div>
      
      <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
      
      <div className="text-center">
        <div className="w-12 h-12 bg-blue-100 dark:bg-teal-900 rounded-lg flex items-center justify-center mx-auto mb-2">
          <Building className="w-6 h-6 text-blue-600 dark:text-teal-300" />
        </div>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Business Data</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">Team accessible</p>
      </div>
      
      <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
      
      <div className="text-center">
        <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-2">
          <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-300" />
        </div>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Usage Analytics</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">System generated</p>
      </div>
    </div>
  </div>
);

// Enhanced Header Component
const DataWalletHeader = () => (
  <div className="mb-6">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Secure Data Vault</h3>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Your secure data hub with full transparency and control
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center text-green-600 dark:text-green-400 text-sm">
          <Shield className="w-4 h-4 mr-1" />
          <span>Secured</span>
        </div>
        <div className="flex items-center text-blue-600 dark:text-teal-400 text-sm">
          <CheckCircle className="w-4 h-4 mr-1" />
          <span>GDPR Compliant</span>
        </div>
      </div>
    </div>
  </div>
);

/**
 * Data Wallet tab component for the workspace modal
 * Displays and manages platform data across three categories:
 * - Personal Data (user-owned)
 * - Business Data (company-owned)
 * - Activity & Usage Data (system-generated)
 */
const DataWalletTab: React.FC<DataWalletTabProps> = ({ workspaceData }) => {
  // State for active category
  const [activeCategory, setActiveCategory] = useState<'personal' | 'business' | 'activity'>('personal');
  
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
  const personalData: DataItem[] = [
    {
      id: 'per-001',
      name: 'Profile Settings',
      description: 'Your personal profile information and preferences',
      size: '124 KB',
      lastModified: '2025-03-15',
      location: 'EU-West',
      type: 'JSON',
      owner: 'user',
      privacyLevel: 'restricted',
      metadata: {
        fields: ['name', 'email', 'preferences'],
        lastUpdate: '2025-03-15'
      }
    },
    {
      id: 'per-002',
      name: 'Personal Documents',
      description: 'Documents you have uploaded to the platform',
      size: '15.2 MB',
      lastModified: '2025-03-12',
      location: 'EU-West',
      type: 'PDF',
      owner: 'user',
      privacyLevel: 'restricted',
      metadata: {
        documents: 8,
        totalSize: '15.2 MB'
      }
    },
    {
      id: 'per-003',
      name: 'Communication Preferences',
      description: 'Your notification and communication settings',
      size: '2.1 KB',
      lastModified: '2025-03-10',
      location: 'EU-West',
      type: 'JSON',
      owner: 'user',
      privacyLevel: 'restricted',
      metadata: {
        notifications: 12,
        channels: ['email', 'sms', 'push']
      }
    }
  ];

  const businessData: DataItem[] = [
    {
      id: 'bus-001',
      name: 'Company Profile',
      description: 'Business information and company details',
      size: '128 KB',
      lastModified: '2025-02-20',
      location: 'Global CDN',
      type: 'JSON',
      owner: 'company',
      privacyLevel: 'internal',
      metadata: {
        visibility: 'Internal',
        departments: 5,
        employees: 150
      }
    },
    {
      id: 'bus-002',
      name: 'Team Directories',
      description: 'Organizational structure and team information',
      size: '4.5 MB',
      lastModified: '2025-03-05',
      location: 'EU-West',
      type: 'JSON',
      owner: 'company',
      privacyLevel: 'internal',
      metadata: {
        teams: 12,
        members: 89,
        lastUpdate: '2025-03-01'
      }
    },
    {
      id: 'bus-003',
      name: 'Knowledge Base',
      description: 'Internal documentation and procedures',
      size: '8.2 MB',
      lastModified: '2025-03-12',
      location: 'EU-West',
      type: 'Markdown',
      owner: 'company',
      privacyLevel: 'internal',
      metadata: {
        articles: 56,
        categories: 8,
        contributors: 5
      }
    }
  ];

  const activityData: DataItem[] = [
    {
      id: 'act-001',
      name: 'Session Analytics',
      description: 'Your platform usage and activity patterns',
      size: '24 KB',
      lastModified: '2025-03-15',
      location: 'EU-West',
      type: 'JSON',
      owner: 'system',
      privacyLevel: 'confidential',
      metadata: {
        sessions: 45,
        avgDuration: '32 minutes',
        lastLogin: '2025-03-15'
      }
    },
    {
      id: 'act-002',
      name: 'Feature Usage Statistics',
      description: 'Analytics on platform features and tools usage',
      size: '156 KB',
      lastModified: '2025-03-14',
      location: 'EU-West',
      type: 'JSON',
      owner: 'system',
      privacyLevel: 'confidential',
      metadata: {
        features: 23,
        interactions: 567,
        favoriteFeatures: ['Dashboard', 'Reports']
      }
    },
    {
      id: 'act-003',
      name: 'API Usage Logs',
      description: 'System-generated API call logs and metrics',
      size: '1.2 MB',
      lastModified: '2025-03-10',
      location: 'EU-West',
      type: 'CSV',
      owner: 'system',
      privacyLevel: 'confidential',
      metadata: {
        period: 'March 2025',
        totalCalls: 12567,
        avgResponseTime: '230ms'
      }
    }
  ];

  // Get data for active category
  const getActiveData = () => {
    switch (activeCategory) {
      case 'personal':
        return personalData;
      case 'business':
        return businessData;
      case 'activity':
        return activityData;
      default:
        return [];
    }
  };

  // Filter and sort data
  const filteredData = getActiveData()
    .filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      switch (sortField) {
        case 'name':
          return a.name.localeCompare(b.name) * direction;
        case 'size':
          return (parseFloat(a.size) - parseFloat(b.size)) * direction;
        case 'lastModified':
          return (new Date(a.lastModified).getTime() - new Date(b.lastModified).getTime()) * direction;
        default:
          return 0;
      }
    });

  const handleSort = (field: 'name' | 'size' | 'lastModified') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getCategoryColor = (category: string) => {
    return categories[category as keyof typeof categories]?.color || 'gray';
  };

  const getCategoryIcon = (category: string) => {
    const IconComponent = categories[category as keyof typeof categories]?.icon || Database;
    return <IconComponent className="w-5 h-5" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <DataWalletHeader />

      {/* Data Flow Diagram */}
      <DataFlowDiagram />

      {/* Data Governance Overview */}
      <DataGovernanceOverview />

      {/* User Data Controls */}
      <UserDataControls />

      {/* Storage Usage */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-medium text-gray-900 dark:text-gray-100">Storage Usage</h4>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {storageUsage.used} GB of {storageUsage.total} GB used
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
          <div 
            className="bg-blue-600 dark:bg-teal-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${storageUsage.percentage}%` }}
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {Object.entries(categories).map(([key, category]) => {
            const IconComponent = category.icon;
            return (
              <button
                key={key}
                onClick={() => setActiveCategory(key as any)}
                className={`
                  flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors
                  ${activeCategory === key 
                    ? `border-${category.color}-500 text-${category.color}-600 dark:text-${category.color === 'blue' ? 'teal' : category.color}-400 dark:border-${category.color === 'blue' ? 'teal' : category.color}-400` 
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                  }
                `}
              >
                <IconComponent className="w-5 h-5" />
                <span>{category.label}</span>
                <span className="bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs">
                  {getActiveData().length}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Category Description */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {categories[activeCategory].description}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search data..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-teal-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
            <Filter className="w-4 h-4" />
            <span className="text-sm">Filter</span>
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Name</span>
                    {sortField === 'name' && (
                      sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => handleSort('size')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Size</span>
                    {sortField === 'size' && (
                      sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => handleSort('lastModified')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Last Modified</span>
                    {sortField === 'lastModified' && (
                      sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${getCategoryColor(activeCategory)}-100 dark:bg-${getCategoryColor(activeCategory) === 'blue' ? 'teal' : getCategoryColor(activeCategory)}-900`}>
                          {getCategoryIcon(activeCategory)}
                        </div>
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.name}</h4>
                          <DataOwnershipBadge owner={item.owner} />
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <PrivacyLevelIndicator level={item.privacyLevel} />
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            Modified {new Date(item.lastModified).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-teal-900 text-blue-800 dark:text-teal-100">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {item.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(item.lastModified).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {item.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button className="text-indigo-600 dark:text-teal-400 hover:text-indigo-900 dark:hover:text-teal-300 p-1 rounded hover:bg-indigo-50 dark:hover:bg-teal-900 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-blue-600 dark:text-teal-400 hover:text-blue-900 dark:hover:text-teal-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-teal-900 transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                      {item.owner === 'user' && (
                        <>
                          <button className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 p-1 rounded hover:bg-green-50 dark:hover:bg-green-900 transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Empty state */}
        {filteredData.length === 0 && (
          <div className="py-12 text-center">
            <div className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500">
              <Database className="h-full w-full" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No data found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchQuery 
                ? 'Try adjusting your search query or filters' 
                : 'No data available in this category'}
            </p>
          </div>
        )}
      </div>
      
      {/* Category-specific information panels */}
      {activeCategory === 'personal' && (
        <div className="bg-purple-50 dark:bg-purple-900 border border-purple-100 dark:border-purple-800 rounded-lg p-4 flex items-start">
          <Info className="w-5 h-5 text-purple-600 dark:text-purple-300 mt-0.5 flex-shrink-0" />
          <div className="ml-3">
            <h4 className="text-sm font-medium text-purple-800 dark:text-purple-200">Personal Data Protection</h4>
            <p className="mt-1 text-sm text-purple-600 dark:text-purple-300">
              Your personal data is encrypted at rest and in transit. Only you have access to this information, and you can modify or delete it at any time.
            </p>
          </div>
        </div>
      )}
      
      {activeCategory === 'business' && (
        <div className="bg-blue-50 dark:bg-teal-900 border border-blue-100 dark:border-teal-800 rounded-lg p-4 flex items-start">
          <Info className="w-5 h-5 text-blue-600 dark:text-teal-300 mt-0.5 flex-shrink-0" />
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-800 dark:text-teal-200">Business Data Sharing</h4>
            <p className="mt-1 text-sm text-blue-600 dark:text-teal-300">
              Business data is shared within your organization according to your company's data governance policies. Access is controlled and audited.
            </p>
          </div>
        </div>
      )}
      
      {activeCategory === 'activity' && (
        <div className="bg-green-50 dark:bg-green-900 border border-green-100 dark:border-green-800 rounded-lg p-4 flex items-start">
          <Info className="w-5 h-5 text-green-600 dark:text-green-300 mt-0.5 flex-shrink-0" />
          <div className="ml-3">
            <h4 className="text-sm font-medium text-green-800 dark:text-green-200">Usage Analytics</h4>
            <p className="mt-1 text-sm text-green-600 dark:text-green-300">
              Activity data is used to improve platform performance and user experience. This data is anonymized and retained according to our data retention policy.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataWalletTab;
