import { createContext, useState, ReactNode } from 'react'

type Language = 'en' | 'fr'

interface LanguageContextType {
  language: Language
  toggleLanguage: () => void
  t: (key: string) => string
}

const translations = {
  en: {
    // start here
    navbar: {
      administrator: 'Admin',
      profile: 'Profile',
      disconnect: 'Disconnect',
      settings: 'Settings',
      credits: 'credits'
    },
    auth: {
      login: 'Login',
      logout: 'Logout'
    },
    common: {
      close: 'Close'
    },
    pages: {
      dashboard: 'Dashboard',
      profile: 'Profile'
    },
    dashboard: {
    "title": "Dashboard",
    "overview": "Overview of your AI agents and activities",
    "keyMetrics": "Key Metrics",
    "latestAgents": "Latest Agents",
    "reports": "Reports",
    "export": "Export",
    "newReport": "New Report",
    "addReport": "Add Report",
    "noReports": "No reports yet",
    "noReportsDescription": "Create your first report to track important metrics",
    "createFirstReport": "Create First Report",
      // Modal translations
      reportConfig: {
        title: 'Report Configuration',
        name: 'Report Name',
        type: 'Metrics Type',
        createButton: 'Create Report',
        cancelButton: 'Cancel',
        placeholder: {
          name: 'Enter report name',
          type: 'Select metrics type'
        }
      }
    },
    sidebar: {
      menu: 'Menu',
      dashboard: 'Dashboard',
      aiAgents: 'AI Agents',
      governance: 'AI Governance',
      governanceMonitoring: 'Monitoring Dashboard',
      policyManagement: 'Policy Management',
      auditCompliance: 'Audit & Compliance',
      riskManagement: 'Risk Management',
      performanceAnalytics: 'Performance Analytics',
      agentConfiguration: 'Agent Configuration',
      templates: 'Templates',
      onboarding: 'Onboarding',
      prompts: 'Prompts', // New translation for Prompts
      knowledgeBase: 'Knowledge Base',
      integrations: 'Tools',
      discussions: 'Discussions',
      customers: 'Customers',
      workflows: 'Lineage',
      settings: 'Settings',
      contact: 'Contact',
      askDemo: 'Ask for a demo',
      developedBy: 'Developed by Miranki Sàrl',
      projects: 'Projects',
      agentManagement: 'Agent Management',
      workflowManagement: 'Workflow & Tasks',
      monitoringAnalytics: 'Monitoring & Analytics',
      resourceManagement: 'Resource Management',
      collaboration: 'Collaboration'
    },
    agentsList: {
      title: 'AI Agents',
      searchPlaceholder: 'Search for an agent',
      metrics: {
        discussions: 'Discussions',
        satisfaction: 'Satisfaction'
      },
      status: {
        active: 'Active',
        inactive: 'Inactive'
      },
      emptyState: 'No agents found',
      agents: {
        customerSupport: {
          name: 'Customer Support 24/7',
          type: 'Helps customers by answering their questions and solving their problems'
        },
        salesAssistant: {
          name: 'Sales Assistant',
          type: 'Supports the sales team by managing customer relationships and identifying opportunities'
        },
        complaintsService: {
          name: 'Complaints Service',
          type: 'Handles customer complaints to efficiently resolve issues'
        },
        hrAssistant: {
          name: 'HR Assistant',
          type: 'Assists human resources in managing administrative tasks and employees'
        }
      }
    },
    metrics: {
      cards: {
        activeAgents: {
          title: 'Active AI Agents',
          changeLabel: 'since last month'
        },
        templates: {
          title: 'Templates Used',
          changeLabel: 'since last week'
        },
        messages: {
          title: 'Messages Sent',
          changeLabel: 'since yesterday'
        }
      }
    },
    clients: {
      page: {
        seeAnalytics: 'See Analytics',
        header: {
          title: 'Customers',
          subtitle: 'Manage and analyze your customer base',
          addCustomer: 'Add Customer',
          export: 'Export',
          import: 'Import'
        },
        filters: {
          search: 'Search customers',
          status: 'Status',
          segment: 'Segment',
          source: 'Source',
          dateRange: 'Date Range'
        },
        list: {
          emptyState: 'No customers found',
          loading: 'Loading customers...'
        },
        segmentation: {
          title: 'Customer Segmentation',
          total: 'Total Customers',
          active: 'Active',
          inactive: 'Inactive',
          new: 'New'
        },
        analytics: {
          title: 'Customer Analytics',
          growth: 'Customer Growth',
          retention: 'Retention Rate',
          satisfaction: 'Satisfaction Score'
        }
      },
      search: {
        placeholder: "Search for a customer",
        noResults: "No customers found",
        clear: "Clear search"
      },
      filters: {
        button: "Filters",
        all: "All customers",
        vip: "VIP",
        new: "New",
        inactive: "Inactives",
        title: "Filter Customers",
        apply: "Apply filters",
        reset: "Reset filters"
      },
      tags: {
        button: "Tags",
        title: "Manage Tags",
        add: "Add tag",
        remove: "Remove tag",
        noTags: "No tags yet"
      },
      sort: {
        title: "Sort by",
        newest: "Newest first",
        oldest: "Oldest first",
        nameAZ: "Name A-Z",
        nameZA: "Name Z-A"
      }
      },
      agents: {
      page: {
        header: {
          title: 'AI Agents',
          subtitle: 'Manage and configure your virtual assistants',
          newAgent: 'Create Agent',
          importAgent: 'Import Agent',
          connectAgent: 'Connect Agent'
        },
        search: {
          placeholder: 'Search for an agent',
          filters: 'Filters'
        }
      },
      list: {
        customerSupport: {
          name: 'Customer Support 24/7',
          metrics: '156 conversations today'
        },
        salesAssistant: {
          name: 'Sales Assistant',
          metrics: '145 qualified leads'
        },
        hrAssistant: {
          name: 'HR Assistant',
          metrics: '56 requests processed'
        },
        ecommerceAssistant: {
          name: 'E-commerce Assistant',
          metrics: '134 assisted orders'
        },
        billingService: {
          name: 'Billing Service',
          metrics: '167 invoices processed'
        },
        technicalSupport: {
          name: 'Technical Assistant',
          metrics: '190 tickets resolved'
        },
        afterSales: {
          name: 'After-Sales Service',
          metrics: '245 returns handled'
        },
        international: {
          name: 'International Assistant',
          metrics: '178 international clients'
        },
        training: {
          name: 'Customer Training',
          metrics: '134 sessions completed'
        },
        appointment: {
          name: 'Appointment Manager',
          metrics: '89 appointments scheduled'
        },
        emailMarketing: {
          name: 'Email Marketing',
          metrics: '678 personalized emails'
        },
        proactiveChatbot: {
          name: 'Proactive Chatbot',
          metrics: '456 conversations initiated'
        },
        gdpr: {
          name: 'GDPR & Compliance Agent',
          metrics: '244 requests processed',
          description: 'Automatically processes GDPR requests and ensures data process compliance.'
        },
        cybersecurity: {
          name: 'Cybersecurity Expert',
          metrics: '2,789 threats detected',
          description: 'Monitors and protects against cybersecurity threats in real-time.'
        },
        legal: {
          name: 'Legal Assistant',
          metrics: '567 consultations completed',
          description: 'Provides basic legal information and helps with understanding legal documents.'
        }
      },
      skills: {
        support: 'Support',
        escalation: 'Escalation',
        faq: 'FAQ',
        problemSolving: 'Problem Solving',
        sales: 'Sales',
        quotes: 'Quotes',
        qualification: 'Qualification',
        crm: 'CRM',
        hr: 'HR',
        leave: 'Leave',
        procedures: 'Procedures',
        training: 'Training',
        timeTracking: 'Time Tracking',
        ecommerce: 'E-commerce',
        recommendations: 'Recommendations',
        stock: 'Stock',
        promotions: 'Promotions',
        billing: 'Billing',
        payments: 'Payments',
        refunds: 'Refunds',
        disputes: 'Disputes',
        troubleshooting: 'Troubleshooting',
        documentation: 'Documentation',
        maintenance: 'Maintenance',
        warranty: 'Warranty',
        repair: 'Repair',
        satisfaction: 'Satisfaction',
        multilingual: 'Multilingual',
        currencies: 'Currencies',
        customs: 'Customs',
        onboarding: 'Onboarding',
        tutorials: 'Tutorials',
        webinars: 'Webinars',
        planning: 'Planning',
        reminders: 'Reminders',
        availability: 'Availability',
        campaigns: 'Campaigns',
        segmentation: 'Segmentation',
        analytics: 'Analytics',
        engagement: 'Engagement',
        leadGen: 'Lead Generation',
        conversion: 'Conversion',
        gdprRights: 'GDPR Rights',
        dataErasure: 'Data Erasure',
        compliance: 'Compliance',
        audit: 'Audit',
        protection: 'Protection',
        monitoring: 'Monitoring',
        contracts: 'Contracts',
        legalAdvice: 'Legal Advice'
      },
      status: {
        active: 'Active',
        inactive: 'Inactive'
      }
    },
    usage: {
    header: {
      title: 'Usage & Analytics',
      subtitle: 'Monitor your usage and optimize your resources',
      refresh: 'Refresh',
      export: 'Export Report'
    },
    periods: {
      day: 'Day',
      week: 'Week',
      month: 'Month',
      year: 'Year'
    },
    advancedOptions: {
    show: 'Show Advanced Analytics',
    hide: 'Hide Advanced Analytics'
  },
  error: {
    title: 'Error Loading Usage Data',
    retry: 'Try Again'
  }
  }
    ,
    templates: {
      page: {
        title: 'Templates',
        subtitle: 'Start with a template and customize it for your needs',
        newTemplate: 'New Template',
        search: {
          placeholder: 'Search templates',
          filters: 'Filters'
        },
        categories: {
          label: 'Categories',
          all: 'All Templates',
          marketing: 'Marketing',
          sales: 'Sales',
          customerService: 'Customer Service',
          operations: 'Operations',
          humanResources: 'Human Resources',
          technical: 'Technical',
          legal: 'Legal',
          finance: 'Finance'
        },
        filters: {
          sort: {
            label: 'Sort by',
            newest: 'Newest',
            popular: 'Most Popular',
            alphabetical: 'Alphabetical'
          },
          type: {
            label: 'Type',
            all: 'All',
            free: 'Free',
            premium: 'Premium'
          },
          complexity: {
            label: 'Complexity',
            beginner: 'Beginner',
            intermediate: 'Intermediate',
            advanced: 'Advanced'
          }
        },
        noResults: 'No templates found',
        loading: 'Loading templates...'
      },
      header: {
        title: 'Templates',
        subtitle: 'Manage your communication templates',
        newCategory: 'New Category',
        newTemplate: 'New Template'
      },
        categories: {
        title: 'Categories',
        email: 'Email',
        whatsapp: 'WhatsApp',
        chat: 'Chat',
        notification: 'Notification',
        employee: 'Employee',
        customer: 'Customer',
        custom: 'Custom'
      },
      search: {
        placeholder: 'Search for a template',
        filters: 'Filters',
        filterOptions: {
          sortBy: 'Sort by',
          dateCreated: 'Date Created',
          lastModified: 'Last Modified',
          alphabetical: 'Alphabetical',
          category: 'Category',
          status: 'Status',
          type: 'Type'
        }
      }
    },
// Updated translations for Prompts
prompts: {
  header: {
    title: 'Prompts',
    subtitle: 'Manage and discover AI prompts',
    newRole: 'New Role', // Updated from newRole to newCategory based on the UI
    generatePrompt: 'Generate New Prompt'
  },
  view: {
    label: 'Label'
      },
  categories: {
    title: 'Roles',
    all: 'All',  // Added based on UI showing "prompts.categories.all"
    marketing: 'Marketing', // Updated from marketer to marketing based on UI
    content_creation: 'Content Creation', // Added based on UI showing "prompts.categories.content_creation"
    development: 'Development', // Changed from developer to development based on UI
    support: 'Support',
    sales: 'Sales',
    hr: 'HR',
    custom: 'Custom'
  },
  search: {
    placeholder: 'Search for a prompt',
    filtersButton: 'Filters', // Added based on UI showing "prompts.search.filtersButton"
    filters: 'Filters',
    filterOptions: {
      sortBy: 'Sort by',
      dateCreated: 'Date Created',
      lastModified: 'Last Modified',
      alphabetical: 'Alphabetical',
      role: 'Role',
      popularity: 'Popularity',
      author: 'Author'
    }
  },
  list: {
    noResultsTitle: 'No prompts found', // Added based on UI showing "prompts.list.noResultsTitle"
    noResultsDescription: "Try changing your search or filters to find what you're looking for." // Added based on UI
  },
  generator: {
    title: 'Generate AI Prompt', // Shown as "promptGenerator.title" in UI
    subtitle: 'Create a structured prompt using the ROCKSTAR method',
    describePrompt: 'Describe what you want the AI to do:', // Added based on UI showing "promptGenerator.describePrompt"
    placeholder: 'E.g., Create a marketing email for a new product launch', // Shown as "promptGenerator.placeholder" in UI
    generate: 'Generate', // Added based on UI showing "promptGenerator.generate"
    generating: 'Generating',
    inputLabel: 'What do you want the AI to do?',
    inputPlaceholder: 'E.g., Create a marketing email for a new product launch',
    generateButton: 'Generate Prompt',
    regenerateButton: 'Regenerate',
    saveButton: 'Save to Library',
    editButton: 'Edit Prompt',
    useButton: 'Use Prompt',
    savePrompt: 'Save Prompt', // Added for the save button in the modal
    rockstar: {
      role: 'Role',
      objective: 'Objective',
      context: 'Context',
      keywords: 'Keywords',
      specificity: 'Specificity',
      tone: 'Tone',
      action: 'Action',
      results: 'Results'
    }
  }
}
   ,
    conversations: {
      title: 'Discussions',
      subtitle: 'Manage your discussions easily',
      newMessage: 'New Conversation',
      backToDiscussions: 'Back to Discussions',
      noDiscussionSelected: 'No discussion selected',
      selectDiscussionPrompt: 'Select a discussion in the list to see details',
      search: {
        placeholder: "Search for a discussion",
        clear: "Clear search",
        noResults: "No results found"
      },
      filters: {
        button: "Filters",
        tooltipAdvanced: "Open advanced filters",
        all: "All",
        ongoing: "Ongoing",
        attention: "Required Attention",
        urgent: "Urgent",
        advancedTitle: "Advanced Filters",
        advancedContent: "Advanced filters to implement",
        apply: "Apply Filters",
        reset: "Reset",
        count: {
          all: "All discussions",
          filtered: "Filtered discussions"
        }
      },
      status: {
        inProgress: "In Progress",
        attention: "Needs Attention",
        urgent: "Urgent",
        resolved: "Resolved"
      }
    },
     documents: {
      title: 'Knowledge Base',
      subtitle: 'Manage your documents and assign them to agents',
      actions: {
        export: 'Export',
        newDocument: 'New Document',
        upload: 'Upload',
        cancel: 'Cancel'
      },
      search: {
        placeholder: "Search for documents",
        ariaLabel: "Search documents",
        filters: "Filters",
        noResults: "No results found",
        clearSearch: "Clear search"
      },
      filters: {
        all: 'All',
        pdf: 'PDF',
        docx: 'DOCX',
        assignedTo: 'Assigned to'
      },
      grid: {
        emptyState: 'No documents found',
        lastModified: 'Last modified',
        size: 'Size',
        type: 'Type',
        assignedAgents: 'Assigned Agents'
      },
      upload: {
        title: 'Upload Document',
        dragDrop: 'Drag and drop your file here, or',
        browse: 'browse',
        maxSize: 'Maximum file size: 10MB',
        supportedFormats: 'Supported formats: PDF, DOCX'
      },
      messages: {
        deleteConfirm: 'Are you sure you want to delete this document?',
        uploadSuccess: 'Document uploaded successfully',
        uploadError: 'Error uploading document',
        deleteSuccess: 'Document deleted successfully',
        deleteError: 'Error deleting document'
      },
      aria: {
        exportButton: 'Export documents',
        newDocumentButton: 'Add new document',
        deleteDocument: 'Delete document',
        assignAgent: 'Assign agent to document',
        closeModal: 'Close upload modal'
      }
    },
    integrations: {
title: 'Tools',
subtitle: 'Connect and manage external services and data sources',
learnMore: 'Learn More',
searchPlaceholder: 'Search for tools',
status: 'Status',
connected: 'Connected',
disconnected: 'Disconnected',
add: 'Add',
addTool: 'Add Tool',
disconnect: 'Disconnect',
configure: 'Configure',
connect: 'Connect',
connectedSince: 'Connected since',
syncFrequency: 'Sync Frequency',
realtime: 'Real-time',
hourly: 'Hourly',
daily: 'Daily',
manual: 'Manual',
accessLevel: 'Access Level',
readOnly: 'Read Only',
readWrite: 'Read & Write',
fullAccess: 'Full Access',
enableNotifications: 'Enable notifications for this integration',
connectedTools: 'Connected Tools',
noConnectedTools: 'No Connected Tools',
connectedToolsDescription: 'These tools are currently connected to your workspace',
noToolsConnected: 'No tools connected',
noToolsConnectedDescription: 'Get started by adding your first integration',
availableTools: 'Available Tools',
availableToolsDescription: 'Browse and connect to available integrations',
noToolsFound: 'No tools found',
noToolsFoundDescription: 'Try adjusting your search or filters',
category: 'Category',
allCategories: 'All Categories',
messaging: 'Messaging',
calendar: 'Calendar',
storage: 'Storage',
analytics: 'Analytics',
productivity: 'Productivity',
crm: 'CRM',
other: 'Other',
integrationDetails: 'Integration Details',
cancel: 'Cancel',
confirmDisconnect: 'Yes, disconnect',
      saveSuccess: 'Save',
saveError: 'Failed to save configuration',
"authDescription": "Provide your credentials to connect",
  filters: {
    category: 'Category',
    categories: {
    category: 'Category',
    all: 'All Categories',
    messaging: 'Messaging',
    calendar: 'Calendar',
    storage: 'Storage',
    analytics: 'Analytics',
    productivity: 'Productivity',
    crm: 'CRM',
    other: 'Other',
    status: 'Status',
    connected: 'Connected',
    disconnected: 'Disconnected',
      email: "Email",
        automation: "Automation",
        ecommerce: "E-commerce",
        payment: "Payment",
        project: "Project Management"
      }
  },
  configuration: {
    authDescription: 'Provide your credentials to connect to {name}',
    realtime: 'Real-time',
    hourly: 'Hourly',
    daily: 'Daily',
    manual: 'Manual',
    accessLevel: 'Access Level',
    readOnly: 'Read Only',
    readWrite: 'Read & Write',
    fullAccess: 'Full Access',
    enableNotifications: 'Enable notifications for this integration',
    integrationDetails: 'Integration Details'
  },
  actions: {
    learnMore: 'Learn More',
    add: 'Add',
    addTool: 'Add Tool',
    disconnect: 'Disconnect',
    configure: 'Configure',
    connect: 'Connect',
    cancel: 'Cancel',
    confirmDisconnect: 'Yes, disconnect'
  },
  search: {
    placeholder: 'Search for tools',
    ariaLabel: 'Search tools',
    filters: 'Filters',
    noResults: 'No tools found',
    clearSearch: 'Clear search'
  },
  grid: {
    emptyState: 'No tools found',
    connectedTools: 'Connected Tools',
    noConnectedTools: 'No Connected Tools',
    availableTools: 'Available Tools',
    connectedSince: 'Connected since',
    syncFrequency: 'Sync Frequency'
  },
  descriptions: {
    connectedToolsDescription: 'These tools are currently connected to your workspace',
    noToolsConnectedDescription: 'Get started by adding your first integration',
    availableToolsDescription: 'Browse and connect to available integrations',
    noToolsFoundDescription: 'Try adjusting your search or filters',
    disconnectConfirm: 'Are you sure you want to disconnect {name}?',
    disconnectDescription: 'This will remove all access and data sync will stop. This won\'t delete any data that has already been synced.'
  },
  messages: {
    connectSuccess: 'Successfully connected to {name}',
    connectError: 'Failed to connect to {name}',
    disconnectSuccess: 'Successfully disconnected from {name}',
    disconnectError: 'Failed to disconnect from {name}',
    saveSuccess: 'Save',
    saveError: 'Failed to save configuration'
  },
  aria: {
    searchTools: 'Search tools',
    filterByCategory: 'Filter by category',
    filterByType: 'Filter by type',
    filterByStatus: 'Filter by status',
    configureButton: 'Configure integration',
    connectButton: 'Connect integration',
    disconnectButton: 'Disconnect integration',
    closeModal: 'Close modal'
  }
}
,
    settings: {
      title: "Settings",
      subtitle: "Manage your settings here",
      sections: {
        general: "General",
        userManagement: "User Management",
        integrations: "Integrations",
        security: "Security",
        customization: "Customization",
        ai: "Artificial Intelligence"
      },
      actions: {
        save: "Save changes",
        cancel: "Cancel",
        reset: "Reset to defaults"
      },
      notifications: {
        saveSuccess: "Settings saved successfully",
        saveError: "Error saving settings",
        resetSuccess: "Settings reset to defaults",
        resetError: "Error resetting settings"
      },
      confirmation: {
        reset: "Are you sure you want to reset all settings?",
        discard: "Are you sure you want to discard changes?"
      }
    },
    workflows: {
      // Page header
      title: "Lineage",
      subtitle: "Design and manage your automation workflows",
      newWorkflow: "New Workflow",
      backToList: "Back to List",
      list: {
        title: "Workflows",
        newButton: "New",
        searchPlaceholder: "Search workflows...",
        noWorkflowsFound: "No workflows found",
        filters: {
          all: "All",
          active: "Active",
          draft: "Draft",
          paused: "Paused",
          archived: "Archived"
        },
        status: {
          all: "All",
          active: "Active",
          draft: "Draft",
          paused: "Paused",
          archived: "Archived"
        },
        card: {
          updatedAt: "Updated",
          agents: "agent"
        },
        modal: {
          title: "Create New Workflow",
          nameLabel: "Name",
          descriptionLabel: "Description",
          cancelButton: "Cancel",
          createButton: "Create"
        }
      },
      mockData: {
        customerSupport: {
          name: "Customer Support 24/7",
          description: "Automated customer support response system"
        },
        SalesSupport: {
          name: "Sales Assistant",
          description: "Supports the sales team by managing customer relationships"
        },
        TechnicalSupport: {
          name: "Technical Assistant",
          description: "Handles technical inquiries to efficiently resolve issues"
        },
        HRAssistant: {
          name: "HR Assistant",
          description: "Assists human resources in managing administrative tasks"
        }
      },  
    
      // Tabs
      tabs: {
        design: "Designer",
        designer: "Designer",
        triggers: "Triggers",
        errors: "Errors",
        integrations: "Integrations",
        rules: "Rules",
        errorHandling: "Error Handling"
      },
    
      // Status (used in getStatusColor)
      status: {
        active: "Active",
        draft: "Draft",
        paused: "Paused",
        error: "Error"
      },
    
      // Empty state messages
      noWorkflowSelected: "No Workflow Selected",
      selectWorkflowPrompt: "Select a workflow from the list or create a new one to get started"
    }

    
    // end here
  },
  fr: {
    // démarre ici
    
    navbar: {
      administrator: 'Admin',
      profile: 'Profil',
      disconnect: 'Déconnexion',
      settings: 'Paramètres',
      credits: 'crédits'
    },
    auth: {
      login: 'Connexion',
      logout: 'Déconnexion'
    },
    common: {
      close: 'Fermer'
    },
    pages: {
      dashboard: 'Tableau de bord',
      profile: 'Profil'
    },
    sidebar: {
      menu: 'Menu',
      dashboard: 'Tableau de bord',
      aiAgents: 'Agents IA',
      governance: 'Gouvernance IA',
      governanceMonitoring: 'Tableau de Surveillance',
      policyManagement: 'Gestion des Politiques',
      auditCompliance: 'Audit & Conformité',
      riskManagement: 'Gestion des Risques',
      performanceAnalytics: 'Analyse de Performance',
      agentConfiguration: 'Configuration des Agents',
      templates: 'Modèles',
      onboarding: 'Intégration',
      prompts: 'Prompts', // New translation for Prompts
      knowledgeBase: 'Connaissances',
      integrations: 'Outils',
      discussions: 'Discussions',
      customers: 'Clients',
      workflows: 'Lignées',
      settings: 'Paramètres',
      contact: 'Contact',
      askDemo: 'Demander une démo',
      developedBy: 'Développé par Miranki Sàrl',
      projects: 'Projets',
      agentManagement: 'Gestion des Agents',
      workflowManagement: 'Workflow & Tâches',
      monitoringAnalytics: 'Monitoring & Analytique',
      resourceManagement: 'Gestion des Ressources',
      collaboration: 'Collaboration'
    },
    dashboard: {
      title: 'Tableau de bord',
      overview: 'Aperçu des activités',
      export: 'Exporter',
      newReport: 'Nouveau rapport',
      keyMetrics: 'Métriques clés',
      latestAgents: 'Liste des derniers agents IA mis à jour',
      // Nouvelles traductions
      reports: 'Rapports',
      addReport: 'Ajouter un rapport',
      noReports: 'Aucun rapport disponible. Créez votre premier rapport en cliquant sur le bouton "Ajouter un rapport".',
          "noReportsDescription": "Créez votre premier rapport pour suivre les métriques importantes",
    "createFirstReport": "Créer votre premier rapport",
      // Traductions du modal
      reportConfig: {
        title: 'Configuration du rapport',
        name: 'Nom du rapport',
        type: 'Type de métriques',
        createButton: 'Créer le rapport',
        cancelButton: 'Annuler',
        placeholder: {
          name: 'Entrez le nom du rapport',
          type: 'Sélectionnez le type de métriques'
        }
      }
    },
    agentsList: {
      title: 'Agents IA',
      searchPlaceholder: 'Rechercher un agent',
      metrics: {
        discussions: 'Discussions',
        satisfaction: 'Satisfaction'
      },
      status: {
        active: 'Actif',
        inactive: 'Inactif'
      },
      emptyState: 'Aucun agent trouvé',
      agents: {
        customerSupport: {
          name: 'Support Client 24/7',
          type: 'Aide les clients en répondant à leurs questions et en résolvant leurs problèmes'
        },
        salesAssistant: {
          name: 'Assistant Commercial',
          type: 'Soutient l\'équipe commerciale en gérant les relations clients et en identifiant les opportunités'
        },
        complaintsService: {
          name: 'Service Réclamations',
          type: 'Gère les réclamations clients pour résoudre efficacement les problèmes'
        },
        hrAssistant: {
          name: 'Assistant RH',
          type: 'Assiste les ressources humaines dans la gestion des tâches administratives et des employés'
        }
      }
    },
    metrics: {
      cards: {
        activeAgents: {
          title: 'Agents IA Actifs',
          changeLabel: 'depuis le mois dernier'
        },
        templates: {
          title: 'Modèles Utilisés',
          changeLabel: 'depuis la semaine dernière'
        },
        messages: {
          title: 'Messages Envoyés',
          changeLabel: 'depuis hier'
        }
      }
    },
    clients: {
      page: {
        seeAnalytics: 'Voir les Analyses',
        header: {
          title: 'Clients',
          subtitle: 'Gérer et analyser votre base clients',
          addCustomer: 'Ajouter un Client',
          export: 'Exporter',
          import: 'Importer'
        },
        filters: {
          search: 'Rechercher des clients',
          status: 'Statut',
          segment: 'Segment',
          source: 'Source',
          dateRange: 'Période'
        },
        list: {
          emptyState: 'Aucun client trouvé',
          loading: 'Chargement des clients...'
        },
        segmentation: {
          title: 'Segmentation Clients',
          total: 'Total Clients',
          active: 'Actifs',
          inactive: 'Inactifs',
          new: 'Nouveaux'
        },
        analytics: {
          title: 'Analyses Clients',
          growth: 'Croissance Clients',
          retention: 'Taux de Rétention',
          satisfaction: 'Score de Satisfaction'
        }
      },
      search: {
        placeholder: "Rechercher un client",
        noResults: "Aucun client trouvé",
        clear: "Effacer la recherche"
      },
      filters: {
        button: "Filtres",
        all: "Tous les clients",
        vip: "VIP",
        new: "Nouveaux",
        inactive: "Inactifs",
        title: "Filtrer les clients",
        apply: "Appliquer les filtres",
        reset: "Réinitialiser les filtres"
      },
      tags: {
        button: "Tags",
        title: "Gérer les tags",
        add: "Ajouter un tag",
        remove: "Supprimer le tag",
        noTags: "Aucun tag pour le moment"
      },
      sort: {
        title: "Trier par",
        newest: "Plus récents",
        oldest: "Plus anciens",
        nameAZ: "Nom A-Z",
        nameZA: "Nom Z-A"
      }
    },
    agents: {
      page: {
        header: {
          title: 'Agents IA',
          subtitle: 'Gérer et configurer vos assistants virtuels',
          newAgent: 'Créer un Agent',
          importAgent: 'Importer un Agent',
          connectAgent: 'Connecter un Agent'
        },
        search: {
          placeholder: 'Rechercher un agent',
          filters: 'Filtres'
        }
      },
      list: {
        customerSupport: {
          name: 'Support Client 24/7',
          metrics: '456 conversations aujourd\'hui'
        },
        salesAssistant: {
          name: 'Assistant Commercial',
          metrics: '145 prospects qualifiés'
        },
        hrAssistant: {
          name: 'Assistant RH',
          metrics: '16 requêtes traitées'
        },
        ecommerceAssistant: {
          name: 'Assistant E-commerce',
          metrics: '214 commandes assistées'
        },
        billingService: {
          name: 'Service Facturation',
          metrics: '167 factures traitées'
        },
        technicalSupport: {
          name: 'Assistant Technique',
          metrics: '290 tickets résolus'
        },
        afterSales: {
          name: 'Service Après-Vente',
          metrics: '145 retours traités'
        },
        international: {
          name: 'Assistant International',
          metrics: '178 clients internationaux'
        },
        training: {
          name: 'Formation Client',
          metrics: '34 sessions terminées'
        },
        appointment: {
          name: 'Gestionnaire de Rendez-vous',
          metrics: '89 rendez-vous planifiés'
        },
        emailMarketing: {
          name: 'Marketing Email',
          metrics: '678 emails personnalisés'
        },
        proactiveChatbot: {
          name: 'Chatbot Proactif',
          metrics: '56 conversations initiées'
        },
        gdpr: {
          name: 'Agent RGPD & Conformité',
          metrics: '44 demandes traitées',
          description: 'Traite automatiquement les demandes RGPD et assure la conformité des processus de données.'
        },
        cybersecurity: {
          name: 'Expert Cybersécurité',
          metrics: '189 menaces détectées',
          description: 'Surveille et protège contre les menaces de cybersécurité en temps réel.'
        },
        legal: {
          name: 'Assistant Juridique',
          metrics: '67 consultations effectuées',
          description: 'Fournit des informations juridiques de base et aide à la compréhension des documents légaux.'
        }
      },
      skills: {
        support: 'Support',
        escalation: 'Escalade',
        faq: 'FAQ',
        problemSolving: 'Résolution de problèmes',
        sales: 'Ventes',
        quotes: 'Devis',
        qualification: 'Qualification',
        crm: 'GRC',
        hr: 'RH',
        leave: 'Congés',
        procedures: 'Procédures',
        training: 'Formation',
        timeTracking: 'Suivi du temps',
        ecommerce: 'E-commerce',
        recommendations: 'Recommandations',
        stock: 'Stock',
        promotions: 'Promotions',
        billing: 'Facturation',
        payments: 'Paiements',
        refunds: 'Remboursements',
        disputes: 'Litiges',
        troubleshooting: 'Dépannage',
        documentation: 'Documentation',
        maintenance: 'Maintenance',
        warranty: 'Garantie',
        repair: 'Réparation',
        satisfaction: 'Satisfaction',
        multilingual: 'Multilingue',
        currencies: 'Devises',
        customs: 'Douanes',
        onboarding: 'Intégration',
        tutorials: 'Tutoriels',
        webinars: 'Webinaires',
        planning: 'Planification',
        reminders: 'Rappels',
        availability: 'Disponibilité',
        campaigns: 'Campagnes',
        segmentation: 'Segmentation',
        analytics: 'Analytique',
        engagement: 'Engagement',
        leadGen: 'Génération de leads',
        conversion: 'Conversion',
        gdprRights: 'Droits RGPD',
        dataErasure: 'Effacement de données',
        compliance: 'Conformité',
        audit: 'Audit',
        protection: 'Protection',
        monitoring: 'Surveillance',
        contracts: 'Contrats',
        legalAdvice: 'Conseil juridique'
      },
      status: {
        active: 'Actif',
        inactive: 'Inactif'
      }
    },
    usage: {
    header: {
      title: 'Utilisation & Analytiques',
      subtitle: 'Surveillez votre utilisation et optimisez vos ressources',
      refresh: 'Actualiser',
      export: 'Exporter le Rapport'
    },
    periods: {
      day: 'Jour',
      week: 'Semaine',
      month: 'Mois',
      year: 'Année'
    },
      advancedOptions: {
    show: 'Afficher les Analytiques Avancées',
    hide: 'Masquer les Analytiques Avancées'
  },
  error: {
    title: 'Erreur de Chargement des Données d\'Utilisation',
    retry: 'Réessayer'
  }
  }
    ,
    templates: {
      page: {
        title: 'Modèles',
        subtitle: 'Commencez avec un modèle et personnalisez-le selon vos besoins',
        newTemplate: 'Nouveau Modèle',
        search: {
          placeholder: 'Rechercher des modèles',
          filters: 'Filtres'
        },
        categories: {
          label: 'Catégories',
          all: 'Tous les Modèles',
          marketing: 'Marketing',
          sales: 'Ventes',
          customerService: 'Service Client',
          operations: 'Opérations',
          humanResources: 'Ressources Humaines',
          technical: 'Technique',
          legal: 'Juridique',
          finance: 'Finance'
        },
        filters: {
          sort: {
            label: 'Trier par',
            newest: 'Plus récents',
            popular: 'Plus populaires',
            alphabetical: 'Ordre alphabétique'
          },
          type: {
            label: 'Type',
            all: 'Tous',
            free: 'Gratuit',
            premium: 'Premium'
          },
          complexity: {
            label: 'Complexité',
            beginner: 'Débutant',
            intermediate: 'Intermédiaire',
            advanced: 'Avancé'
          }
        },
        noResults: 'Aucun modèle trouvé',
        loading: 'Chargement des modèles...'
      },
      header: {
        title: 'Modèles',
        subtitle: 'Gérez vos modèles de communication',
        newCategory: 'Nouvelle Catégorie',
        newTemplate: 'Nouveau Modèle'
      },
      categories: {
        title: 'Catégories',
        email: 'Email',
        whatsapp: 'WhatsApp',
        chat: 'Discussion',
        notification: 'Notification',
        employee: 'Employé',
        customer: 'Client',
        custom: 'Personnalisé'
      },
      search: {
        placeholder: 'Rechercher un modèle',
        filters: 'Filtres',
        filterOptions: {
          sortBy: 'Trier par',
          dateCreated: 'Date de création',
          lastModified: 'Dernière modification',
          alphabetical: 'Ordre alphabétique',
          category: 'Catégorie',
          status: 'Statut',
          type: 'Type'
        }
      }
    },
// Traductions en français pour les Prompts
prompts: {
  header: {
    title: 'Prompts',
    subtitle: 'Gérer et découvrir des prompts IA',
    newRole: 'Nouveau Rôle',
    generatePrompt: 'Générer un Nouveau Prompt'
  },
    view: {
    label: 'Libellé'
      },
  categories: {
    title: 'Rôles',
    all: 'Tous',
    marketing: 'Marketing',
    content_creation: 'Création de Contenu',
    development: 'Développement',
    support: 'Support',
    sales: 'Ventes',
    hr: 'RH',
    custom: 'Personnalisé'
  },
  search: {
    placeholder: 'Rechercher un prompt',
    filtersButton: 'Filtres',
    filters: 'Filtres',
    filterOptions: {
      sortBy: 'Trier par',
      dateCreated: 'Date de création',
      lastModified: 'Dernière modification',
      alphabetical: 'Ordre alphabétique',
      role: 'Rôle',
      popularity: 'Popularité',
      author: 'Auteur'
    }
  },
  list: {
    noResultsTitle: 'Aucun prompt trouvé',
    noResultsDescription: 'Essayez de modifier votre recherche ou vos filtres pour trouver ce que vous cherchez.'
  },
  generator: {
    title: 'Générer un Prompt IA',
    subtitle: 'Créer un prompt structuré en utilisant la méthode ROCKSTAR',
    describePrompt: 'Décrivez ce que vous voulez que l\'IA fasse:',
    placeholder: 'Ex., Créer un e-mail marketing pour le lancement d\'un nouveau produit',
    generate: 'Générer',
    generating: 'En cours de génération',
    inputLabel: 'Que souhaitez-vous que l\'IA fasse?',
    inputPlaceholder: 'Ex., Créer un e-mail marketing pour le lancement d\'un nouveau produit',
    generateButton: 'Générer le Prompt',
    regenerateButton: 'Régénérer',
    saveButton: 'Enregistrer dans la Bibliothèque',
    editButton: 'Modifier le Prompt',
    useButton: 'Utiliser le Prompt',
    savePrompt: 'Enregistrer le Prompt',
    rockstar: {
      role: 'Rôle',
      objective: 'Objectif',
      context: 'Contexte',
      keywords: 'Mots-clés',
      specificity: 'Spécificité',
      tone: 'Ton',
      action: 'Action',
      results: 'Résultats'
    }
  }
}

    
    ,
    conversations: {
      title: 'Discussions',
      subtitle: 'Gérez vos discussions facilement',
      newMessage: 'Nouvelle conversation',
      backToDiscussions: 'Retour aux Discussions',
      noDiscussionSelected: 'Aucune discussion sélectionnée',
      selectDiscussionPrompt: 'Sélectionnez une discussion dans la liste pour voir les détails',
      search: {
        placeholder: "Rechercher une discussion",
        clear: "Effacer la recherche",
        noResults: "Aucun résultat trouvé"
      },
      filters: {
        button: "Filtres",
        tooltipAdvanced: "Ouvrir les filtres avancés",
        all: "Tous",
        ongoing: "En cours",
        attention: "Attention requise",
        urgent: "Urgent",
        advancedTitle: "Filtres avancés",
        advancedContent: "Filtres avancés à implémenter",
        apply: "Appliquer les filtres",
        reset: "Réinitialiser",
        count: {
          all: "Toutes les discussions",
          filtered: "Discussions filtrées"
        }
      },
      status: {
        inProgress: "En cours",
        attention: "Attention requise",
        urgent: "Urgent",
        resolved: "Résolu"
      }
    },
     documents: {
      title: 'Base de Connaissances',
      subtitle: 'Gérez vos documents et assignez-les aux agents',
      actions: {
        export: 'Exporter',
        newDocument: 'Nouveau Document',
        upload: 'Téléverser',
        cancel: 'Annuler'
      },
      search: {
        placeholder: "Rechercher des documents",
        ariaLabel: "Rechercher des documents",
        filters: "Filtres",
        noResults: "Aucun résultat trouvé",
        clearSearch: "Effacer la recherche"
      },
      filters: {
        all: 'Tous',
        pdf: 'PDF',
        docx: 'DOCX',
        assignedTo: 'Assigné à'
      },
      grid: {
        emptyState: 'Aucun document trouvé',
        lastModified: 'Dernière modification',
        size: 'Taille',
        type: 'Type',
        assignedAgents: 'Agents Assignés'
      },
      upload: {
        title: 'Téléverser un Document',
        dragDrop: 'Glissez et déposez votre fichier ici, ou',
        browse: 'parcourir',
        maxSize: 'Taille maximale : 10Mo',
        supportedFormats: 'Formats supportés : PDF, DOCX'
      },
      messages: {
        deleteConfirm: 'Êtes-vous sûr de vouloir supprimer ce document ?',
        uploadSuccess: 'Document téléversé avec succès',
        uploadError: 'Erreur lors du téléversement',
        deleteSuccess: 'Document supprimé avec succès',
        deleteError: 'Erreur lors de la suppression'
      },
      aria: {
        exportButton: 'Exporter les documents',
        newDocumentButton: 'Ajouter un nouveau document',
        deleteDocument: 'Supprimer le document',
        assignAgent: 'Assigner un agent au document',
        closeModal: 'Fermer la fenêtre de téléversement'
      }
    },
    integrations: {
title: 'Outils',
subtitle: 'Connecter et gérer les services et les sources de données externes',
learnMore: 'En savoir plus',
searchPlaceholder: 'Rechercher des outils',
status: 'État',
connected: 'Connecté',
disconnected: 'Déconnecté',
add: 'Ajouter',
addTool: 'Ajouter un outil',
disconnect: 'Déconnecter',
configure: 'Configurer',
connect: 'Se connecter',
connectedSince: 'Connecté depuis',
syncFrequency: 'Fréquence de synchronisation',
realtime: 'Temps réel',
hourly: 'Toutes les heures',
daily: 'Quotidien',
manual: 'Manuel',
accessLevel: "Niveau d'accès",
readOnly: 'Lecture seule',
readWrite: 'Lecture et écriture',
fullAccess: 'Accès complet',
enableNotifications: 'Activer les notifications pour cette intégration',
connectedTools: 'Outils connectés',
noConnectedTools: 'Aucun outil connecté',
connectedToolsDescription: 'Ces outils sont actuellement connectés à votre espace de travail',
noToolsConnected: 'Aucun outil connecté',
noToolsConnectedDescription: 'Commencez par ajouter votre première intégration',
availableTools: 'Outils disponibles',
availableToolsDescription: 'Parcourir et connecter les intégrations disponibles',
noToolsFound: 'Aucun outil trouvé',
noToolsFoundDescription: "Essayez d'ajuster votre recherche ou vos filtres",
category: 'Catégorie',
allCategories: 'Toutes les catégories',
messaging: 'Messagerie',
calendar: 'Calendrier',
storage: 'Stockage',
analytics: 'Analytiques',
productivity: 'Productivité',
crm: 'Gestion de la relation client',
other: 'Autre',
integrationDetails: "Détails de l'intégration",
cancel: 'Annuler',
confirmDisconnect: 'Oui, déconnecter',
saveSuccess: 'Enregistrer',
saveError: "Échec de l'enregistrement de la configuration",
"authDescription": "Fournir vos informations d'identification pour vous connecter",
filters: {
  category: 'Catégorie',
categories: {
category: 'Catégorie',
all: 'Toutes les catégories',
messaging: 'Messagerie',
calendar: 'Calendrier',
storage: 'Stockage',
analytics: 'Analytiques',
productivity: 'Productivité',
crm: 'Gestion de la relation client',
other: 'Autre',
status: 'État',
connected: 'Connecté',
disconnected: 'Déconnecté',
  email: 'Email',
  automation: "Automatisation",
  ecommerce: "E-commerce",
  payment: "Paiement",
  project: "Gestion de project"
}
},

actions: {
learnMore: 'En savoir plus',
add: 'Ajouter',
addTool: 'Ajouter un outil',
disconnect: 'Déconnecter',
configure: 'Configurer',
connect: "Se connecter",
cancel: 'Annuler',
confirmDisconnect: 'Oui, déconnecter'
},
search: {
placeholder: 'Rechercher des outils',
ariaLabel: "Rechercher des outils",
filters: 'Filtres',
noResults: 'Aucun outil trouvé',
clearSearch: 'Effacer la recherche'
},
grid: {
emptyState: 'Aucun outil trouvé',
connectedTools: 'Outils connectés',
noConnectedTools: 'Aucun outil connecté',
availableTools: 'Outils disponibles',
connectedSince: 'Connecté depuis',
syncFrequency: 'Fréquence de synchronisation'
},
configuration: {
authDescription: "Fournir vos informations d'identification pour vous connecter à {name}",
realtime: 'Temps réel',
hourly: 'Toutes les heures',
daily: 'Quotidien',
manual: 'Manuel',
accessLevel: "Niveau d'accès",
readOnly: 'Lecture seule',
readWrite: 'Lecture et écriture',
fullAccess: 'Accès complet',
enableNotifications: 'Activer les notifications pour cette intégration',
integrationDetails: "Détails de l'intégration"
},
descriptions: {
connectedToolsDescription: 'Ces outils sont actuellement connectés à votre espace de travail',
noToolsConnectedDescription: 'Commencez par ajouter votre première intégration',
availableToolsDescription: 'Parcourir et connecter les intégrations disponibles',
noToolsFoundDescription: "Essayez d'ajuster votre recherche ou vos filtres",
disconnectConfirm: "Êtes-vous sûr de vouloir déconnecter {name}?",
disconnectDescription: "Cela supprimera toutes les connexions et l'arrêt de la synchronisation des données. Cela ne supprimera pas les données qui ont déjà été synchronisées."
},
messages: {
connectSuccess: 'Connecté avec succès à {name}',
connectError: 'Échec de la connexion à {name}',
disconnectSuccess: 'Déconnecté avec succès de {name}',
disconnectError: 'Échec de la déconnexion de {name}',
saveSuccess: 'Enregistrer',
saveError: "Échec de l'enregistrement de la configuration"
},
aria: {
searchTools: 'Rechercher des outils',
filterByCategory: 'Filtrer par catégorie',
filterByType: 'Filtrer par type',
filterByStatus: 'Filtrer par état',
configureButton: "Configurer l'intégration",
connectButton: "Se connecter à l'intégration",
disconnectButton: "Déconnecter l'intégration",
closeModal: 'Fermer la modale'
}
}

    ,
     settings: {
      title: "Paramètres",
      subtitle: "Gérez vos paramètres ici",
      sections: {
        general: "Général",
        userManagement: "Gestion des utilisateurs",
        integrations: "Intégrations",
        security: "Sécurité",
        customization: "Personnalisation",
        ai: "Intelligence artificielle"
      },
      actions: {
        save: "Enregistrer les modifications",
        cancel: "Annuler",
        reset: "Réinitialiser"
      },
      notifications: {
        saveSuccess: "Paramètres enregistrés avec succès",
        saveError: "Erreur lors de l'enregistrement des paramètres",
        resetSuccess: "Paramètres réinitialisés avec succès",
        resetError: "Erreur lors de la réinitialisation des paramètres"
      },
      confirmation: {
        reset: "Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?",
        discard: "Êtes-vous sûr de vouloir annuler les modifications ?"
      }
    },
    workflows: {
      title: "Lignées",
      subtitle: "Concevez et gérez vos flux d'automatisation",
      newWorkflow: "Nouveau flux de travail",
      backToList: "Retour à la liste",
      list: {
        title: "Flux de travail",
        newButton: "Nouveau",
        searchPlaceholder: "Rechercher des flux de travail",
        noWorkflowsFound: "Aucun flux de travail trouvé",
        filters: {
          all: "Tous",
          active: "Actifs",
          draft: "Brouillons",
          paused: "En pause",
          archived: "Archivés"
        },
        status: {
          all: "Tous",
          active: "Actif",
          draft: "Brouillon",
          paused: "En pause",
          archived: "Archivé"
        },
        card: {
          updatedAt: "Mis à jour le",
          agents: "agent"
        },
        modal: {
          title: "Créer un nouveau flux",
          nameLabel: "Nom",
          descriptionLabel: "Description",
          cancelButton: "Annuler",
          createButton: "Créer"
        }
      },
      tabs: {
        design: "Concepteur",
        designer: "Concepteur",
        triggers: "Déclencheurs",
        errors: "Erreurs",
        integrations: "Intégrations",
        rules: "Règles",
        errorHandling: "Gestion des erreurs"
      },

      mockData: {
        customerSupport: {
          name: "Support client 24/7",
          description: "Système de réponse automatisé pour le support client"
        },
        SalesSupport: {
          name: "Assistant Commercial",
          description: "Soutient l'équipe commerciale en gérant les relations clients"
        },
        TechnicalSupport: {
          name: "Assistance Technique",
          description: "Gère les demandes pour résoudre efficacement les problèmes techniques"
        },
        HRAssistant: {
          name: "Assistant RH",
          description: "Assiste les RH dans la gestion des tâches administratives"
        }
      },  
    
      status: {
        active: "Actif",
        draft: "Brouillon",
        paused: "En pause",
        error: "Erreur"
      },
    
      noWorkflowSelected: "Aucun flux sélectionné",
      selectWorkflowPrompt: "Sélectionnez un flux dans la liste ou créez-en un nouveau pour commencer"
    }

    // s'arrête ici
  }
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  toggleLanguage: () => {},
  t: (key: string) => key
})

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en')

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'fr' : 'en'))
  }

  const t = (key: string) => {
    // Split the key by dots to access nested properties
    const keys = key.split('.')
    let value = translations[language]
    
    // Traverse the nested object
    for (const k of keys) {
      value = value?.[k]
      if (value === undefined) {
        console.warn(`Translation missing for key: ${key}`)
        return key // Return the key if translation is not found
      }
    }
    
    return value as string
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}