import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Save, 
  Upload, 
  Download, 
  Trash2, 
  Eye, 
  EyeOff, 
  Plus, 
  Minus,
  Building,
  Users,
  Shield,
  Database,
  FileText,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  Calendar,
  User,
  Mail,
  Phone,
  Globe,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

// Types and Interfaces
export interface ProjectClient {
  id: string;
  name: string;
  industry: string;
  logo?: string;
  contactPerson: {
    name: string;
    email: string;
    phone: string;
    role: string;
  };
  address: {
    street: string;
    city: string;
    country: string;
    postalCode: string;
  };
  website?: string;
  description: string;
}

export interface ProjectDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  uploadedBy: string;
  isConfidential: boolean;
  accessLevel: 'public' | 'internal' | 'confidential' | 'restricted';
  tags: string[];
}

export interface ProjectUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  accessLevel: 'viewer' | 'contributor' | 'admin';
  lastAccess: string;
  isActive: boolean;
  permissions: {
    canViewDocuments: boolean;
    canUploadDocuments: boolean;
    canManageUsers: boolean;
    canConfigureProject: boolean;
  };
}

export interface ProjectConfiguration {
  id: string;
  name: string;
  description: string;
  client: ProjectClient;
  status: 'active' | 'planning' | 'on-hold' | 'completed';
  startDate: string;
  endDate: string;
  budget: string;
  priority: 'high' | 'medium' | 'low';
  securitySettings: {
    dataEncryption: boolean;
    accessLogging: boolean;
    sessionTimeout: number;
    ipRestrictions: string[];
    twoFactorRequired: boolean;
  };
  knowledgeBase: ProjectDocument[];
  authorizedUsers: ProjectUser[];
  createdBy: string;
  createdAt: string;
  lastModified: string;
}

interface ProjectManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProject: ProjectConfiguration;
  onProjectUpdate: (project: ProjectConfiguration) => void;
}

// Mock data for demonstration
const MOCK_CLIENT: ProjectClient = {
  id: 'client-001',
  name: 'TechCorp Solutions',
  industry: 'Technology',
  contactPerson: {
    name: 'John Smith',
    email: 'john.smith@techcorp.com',
    phone: '+1 (555) 123-4567',
    role: 'CTO'
  },
  address: {
    street: '123 Innovation Drive',
    city: 'San Francisco',
    country: 'USA',
    postalCode: '94105'
  },
  website: 'https://techcorp.com',
  description: 'Leading technology solutions provider specializing in enterprise software and digital transformation.'
};

const MOCK_DOCUMENTS: ProjectDocument[] = [
  {
    id: 'doc-001',
    name: 'Project Charter.pdf',
    type: 'PDF',
    size: 2048576,
    uploadDate: '2025-01-15',
    uploadedBy: 'John Smith',
    isConfidential: true,
    accessLevel: 'confidential',
    tags: ['charter', 'requirements']
  },
  {
    id: 'doc-002',
    name: 'Technical Requirements.docx',
    type: 'DOCX',
    size: 1536000,
    uploadDate: '2025-01-18',
    uploadedBy: 'Sarah Johnson',
    isConfidential: false,
    accessLevel: 'internal',
    tags: ['requirements', 'technical']
  },
  {
    id: 'doc-003',
    name: 'Market Analysis.xlsx',
    type: 'XLSX',
    size: 3072000,
    uploadDate: '2025-01-20',
    uploadedBy: 'Diana Foster',
    isConfidential: true,
    accessLevel: 'restricted',
    tags: ['analysis', 'market', 'strategy']
  }
];

const MOCK_USERS: ProjectUser[] = [
  {
    id: 'user-001',
    name: 'John Smith',
    email: 'john.smith@techcorp.com',
    role: 'CTO',
    department: 'Technology',
    accessLevel: 'admin',
    lastAccess: '2025-01-21 14:30',
    isActive: true,
    permissions: {
      canViewDocuments: true,
      canUploadDocuments: true,
      canManageUsers: true,
      canConfigureProject: true
    }
  },
  {
    id: 'user-002',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@techcorp.com',
    role: 'Business Analyst',
    department: 'Business',
    accessLevel: 'contributor',
    lastAccess: '2025-01-21 13:15',
    isActive: true,
    permissions: {
      canViewDocuments: true,
      canUploadDocuments: true,
      canManageUsers: false,
      canConfigureProject: false
    }
  },
  {
    id: 'user-003',
    name: 'Michael Brown',
    email: 'michael.brown@techcorp.com',
    role: 'Developer',
    department: 'Technology',
    accessLevel: 'viewer',
    lastAccess: '2025-01-20 16:45',
    isActive: true,
    permissions: {
      canViewDocuments: true,
      canUploadDocuments: false,
      canManageUsers: false,
      canConfigureProject: false
    }
  }
];

const ProjectManagementModal: React.FC<ProjectManagementModalProps> = ({
  isOpen,
  onClose,
  currentProject,
  onProjectUpdate
}) => {
  // State management
  const [activeTab, setActiveTab] = useState<'info' | 'knowledge' | 'access' | 'security'>('info');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Project configuration state
  const [projectConfig, setProjectConfig] = useState<ProjectConfiguration>({
    ...currentProject,
    client: MOCK_CLIENT,
    knowledgeBase: MOCK_DOCUMENTS,
    authorizedUsers: MOCK_USERS,
    securitySettings: {
      dataEncryption: true,
      accessLogging: true,
      sessionTimeout: 30,
      ipRestrictions: [],
      twoFactorRequired: true
    }
  });

  // Form validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // File upload state
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Modal refs for accessibility
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  // Focus management
  useEffect(() => {
    if (isOpen && firstFocusableRef.current) {
      firstFocusableRef.current.focus();
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Validation functions
  const validateProjectInfo = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!projectConfig.name.trim()) {
      newErrors.name = 'Project name is required';
    }
    
    if (!projectConfig.description.trim()) {
      newErrors.description = 'Project description is required';
    }
    
    if (!projectConfig.budget.trim()) {
      newErrors.budget = 'Budget is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form updates
  const updateProjectField = (field: string, value: any) => {
    setProjectConfig(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handle security settings updates
  const updateSecuritySetting = (setting: string, value: any) => {
    setProjectConfig(prev => ({
      ...prev,
      securitySettings: {
        ...prev.securitySettings,
        [setting]: value
      }
    }));
  };

  // File upload handler
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      for (const file of files) {
        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setUploadProgress(progress);
        }

        const newDocument: ProjectDocument = {
          id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          name: file.name,
          type: file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
          size: file.size,
          uploadDate: new Date().toISOString().split('T')[0],
          uploadedBy: 'Current User',
          isConfidential: true,
          accessLevel: 'confidential',
          tags: []
        };

        setProjectConfig(prev => ({
          ...prev,
          knowledgeBase: [...prev.knowledgeBase, newDocument]
        }));
      }

      toast.success(`${files.length} file(s) uploaded successfully`);
    } catch (error) {
      toast.error('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  // Remove document handler
  const removeDocument = (documentId: string) => {
    setProjectConfig(prev => ({
      ...prev,
      knowledgeBase: prev.knowledgeBase.filter(doc => doc.id !== documentId)
    }));
    toast.success('Document removed');
  };

  // User management handlers
  const updateUserAccess = (userId: string, accessLevel: ProjectUser['accessLevel']) => {
    setProjectConfig(prev => ({
      ...prev,
      authorizedUsers: prev.authorizedUsers.map(user =>
        user.id === userId ? { ...user, accessLevel } : user
      )
    }));
  };

  const toggleUserPermission = (userId: string, permission: keyof ProjectUser['permissions']) => {
    setProjectConfig(prev => ({
      ...prev,
      authorizedUsers: prev.authorizedUsers.map(user =>
        user.id === userId 
          ? { 
              ...user, 
              permissions: { 
                ...user.permissions, 
                [permission]: !user.permissions[permission] 
              } 
            } 
          : user
      )
    }));
  };

  const removeUser = (userId: string) => {
    setProjectConfig(prev => ({
      ...prev,
      authorizedUsers: prev.authorizedUsers.filter(user => user.id !== userId)
    }));
    toast.success('User access revoked');
  };

  // Save handler
  const handleSave = async () => {
    if (!validateProjectInfo()) {
      setActiveTab('info');
      return;
    }

    setIsSaving(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onProjectUpdate(projectConfig);
      toast.success('Project configuration saved successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to save project configuration');
    } finally {
      setIsSaving(false);
    }
  };

  // Utility functions
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'admin': return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300';
      case 'contributor': return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300';
      case 'viewer': return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
    }
  };

  const getDocumentAccessColor = (level: string) => {
    switch (level) {
      case 'public': return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300';
      case 'internal': return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300';
      case 'confidential': return 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300';
      case 'restricted': return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
    }
  };

  // Filter documents and users based on search
  const filteredDocuments = projectConfig.knowledgeBase.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredUsers = projectConfig.authorizedUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-60 z-50 flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          ref={modalRef}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl dark:shadow-gray-900 w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-200 dark:border-gray-600 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Project Management</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Configure {projectConfig.name} for {projectConfig.client.name}
              </p>
            </div>
            <button
              ref={firstFocusableRef}
              onClick={onClose}
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 dark:border-gray-600">
            <nav className="flex">
              {[
                { key: 'info', label: 'Project Info', icon: Building },
                { key: 'knowledge', label: 'Knowledge Base', icon: Database },
                { key: 'access', label: 'Access Control', icon: Users },
                { key: 'security', label: 'Security', icon: Shield }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === key
                      ? 'border-indigo-500 dark:border-teal-500 text-indigo-600 dark:text-teal-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'info' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Project Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Project Details</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Project Name *
                      </label>
                      <input
                        type="text"
                        value={projectConfig.name}
                        onChange={(e) => updateProjectField('name', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:border-indigo-500 dark:focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors ${
                          errors.name ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder="Enter project name"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description *
                      </label>
                      <textarea
                        value={projectConfig.description}
                        onChange={(e) => updateProjectField('description', e.target.value)}
                        rows={4}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:border-indigo-500 dark:focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors ${
                          errors.description ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder="Enter project description"
                      />
                      {errors.description && (
                        <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.description}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={projectConfig.startDate}
                          onChange={(e) => updateProjectField('startDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:border-indigo-500 dark:focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          End Date
                        </label>
                        <input
                          type="date"
                          value={projectConfig.endDate}
                          onChange={(e) => updateProjectField('endDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:border-indigo-500 dark:focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Budget *
                        </label>
                        <input
                          type="text"
                          value={projectConfig.budget}
                          onChange={(e) => updateProjectField('budget', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:border-indigo-500 dark:focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors ${
                            errors.budget ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                          }`}
                          placeholder="€450,000"
                        />
                        {errors.budget && (
                          <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.budget}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Priority
                        </label>
                        <select
                          value={projectConfig.priority}
                          onChange={(e) => updateProjectField('priority', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:border-indigo-500 dark:focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
                        >
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Client Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Client Information</h3>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 dark:from-teal-500 dark:to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                          {projectConfig.client.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">{projectConfig.client.name}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{projectConfig.client.industry}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{projectConfig.client.contactPerson.name} - {projectConfig.client.contactPerson.role}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{projectConfig.client.contactPerson.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{projectConfig.client.contactPerson.phone}</span>
                        </div>
                        {projectConfig.client.website && (
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            <a 
                              href={projectConfig.client.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-indigo-600 dark:text-teal-400 hover:text-indigo-800 dark:hover:text-teal-300"
                            >
                              {projectConfig.client.website}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'knowledge' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Knowledge Base Management</h3>
                  <div className="flex gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.txt,.xlsx,.csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 dark:bg-teal-600 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-teal-700 transition-colors disabled:opacity-50 shadow-sm dark:shadow-gray-900"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Documents
                    </button>
                  </div>
                </div>

                {/* Upload Progress */}
                {isUploading && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 dark:border-blue-400"></div>
                      <span className="text-sm text-blue-800 dark:text-blue-300">Uploading... {uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                      <div 
                        className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Search Documents */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:border-indigo-500 dark:focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
                  />
                </div>

                {/* Documents List */}
                <div className="space-y-3">
                  {filteredDocuments.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                      <FileText className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No documents found</h4>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        {searchQuery ? 'Try adjusting your search criteria' : 'Upload documents to get started'}
                      </p>
                      {!searchQuery && (
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 bg-indigo-600 dark:bg-teal-600 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-teal-700 transition-colors"
                        >
                          Upload First Document
                        </button>
                      )}
                    </div>
                  ) : (
                    filteredDocuments.map((document) => (
                      <div key={document.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md dark:hover:shadow-gray-800 transition-shadow bg-white dark:bg-gray-700/50">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="p-2 bg-gray-100 dark:bg-gray-600 rounded-lg">
                              <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 dark:text-gray-100">{document.name}</h4>
                              <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                <span>{document.type}</span>
                                <span>{formatFileSize(document.size)}</span>
                                <span>Uploaded {document.uploadDate}</span>
                                <span>by {document.uploadedBy}</span>
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDocumentAccessColor(document.accessLevel)}`}>
                                  {document.accessLevel.charAt(0).toUpperCase() + document.accessLevel.slice(1)}
                                </span>
                                {document.isConfidential && (
                                  <span className="flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-full text-xs">
                                    <Lock className="w-3 h-3" />
                                    Confidential
                                  </span>
                                )}
                                {document.tags.map(tag => (
                                  <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full text-xs">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors" title="Download">
                              <Download className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" title="View">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => removeDocument(document.id)}
                              className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" 
                              title="Remove"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'access' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Access Control</h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 dark:bg-teal-600 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-teal-700 transition-colors shadow-sm dark:shadow-gray-900">
                    <Plus className="w-4 h-4" />
                    Invite User
                  </button>
                </div>

                {/* Search Users */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:border-indigo-500 dark:focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
                  />
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Access Level</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Permissions</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Access</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-indigo-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-teal-400 font-medium mr-3">
                                {user.name.charAt(0)}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                                <div className="text-xs text-gray-400 dark:text-gray-500">{user.role} • {user.department}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={user.accessLevel}
                              onChange={(e) => updateUserAccess(user.id, e.target.value as ProjectUser['accessLevel'])}
                              className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
                            >
                              <option value="viewer">Viewer</option>
                              <option value="contributor">Contributor</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              {Object.entries(user.permissions).map(([permission, enabled]) => (
                                <label key={permission} className="flex items-center text-xs">
                                  <input
                                    type="checkbox"
                                    checked={enabled}
                                    onChange={() => toggleUserPermission(user.id, permission as keyof ProjectUser['permissions'])}
                                    className="mr-2 rounded border-gray-300 dark:border-gray-600 text-indigo-600 dark:text-teal-500 focus:ring-indigo-500 dark:focus:ring-teal-500"
                                  />
                                  <span className="text-gray-700 dark:text-gray-300">
                                    {permission.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {user.lastAccess}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => removeUser(user.id)}
                              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm transition-colors"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Security Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Security Controls */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Security Controls</h4>
                    
                    <div className="space-y-3">
                      {[
                        { key: 'dataEncryption', label: 'Data Encryption', description: 'Encrypt all project data at rest and in transit' },
                        { key: 'accessLogging', label: 'Access Logging', description: 'Log all user access and actions for audit trail' },
                        { key: 'twoFactorRequired', label: 'Two-Factor Authentication', description: 'Require 2FA for all project access' }
                      ].map(({ key, label, description }) => (
                        <div key={key} className="flex items-start justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700/50">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900 dark:text-gray-100">{label}</h5>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer ml-4">
                            <input
                              type="checkbox"
                              checked={projectConfig.securitySettings[key as keyof typeof projectConfig.securitySettings] as boolean}
                              onChange={(e) => updateSecuritySetting(key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-teal-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 dark:peer-checked:bg-teal-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Session & Access Settings */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Session & Access</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Session Timeout (minutes)
                      </label>
                      <input
                        type="number"
                        min="5"
                        max="480"
                        value={projectConfig.securitySettings.sessionTimeout}
                        onChange={(e) => updateSecuritySetting('sessionTimeout', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:border-indigo-500 dark:focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        IP Restrictions
                      </label>
                      <textarea
                        value={projectConfig.securitySettings.ipRestrictions.join('\n')}
                        onChange={(e) => updateSecuritySetting('ipRestrictions', e.target.value.split('\n').filter(ip => ip.trim()))}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:border-indigo-500 dark:focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
                        placeholder="Enter IP addresses (one per line)&#10;192.168.1.0/24&#10;10.0.0.0/8"
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Leave empty to allow access from any IP address
                      </p>
                    </div>
                  </div>
                </div>

                {/* Security Status */}
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <h4 className="font-medium text-green-800 dark:text-green-300">Security Status: Compliant</h4>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                    All security requirements are met. Project data is properly isolated and protected.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Last modified: {new Date(projectConfig.lastModified).toLocaleString()}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  disabled={isSaving}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 dark:bg-teal-600 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-teal-700 transition-colors disabled:opacity-50 shadow-sm dark:shadow-gray-900"
                >
                  {isSaving && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProjectManagementModal;
