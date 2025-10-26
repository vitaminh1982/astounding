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
