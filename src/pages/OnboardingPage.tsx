import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Bot, 
  GitBranch, 
  Users, 
  Database, 
  Zap, 
  Lock, 
  FileText, 
  CheckSquare, 
  ArrowRight, 
  Lightbulb, 
  Settings, 
  BarChart2,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';

export default function OnboardingPage() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'platform-overview': true,
    'core-features': true,
    'human-centered': true,
    'trust-framework': true,
    'getting-started': true
  });

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-2xl p-8 md:p-12 mb-10 text-white">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Welcome to Sendplex</h1>
            <p className="text-xl md:text-2xl font-light mb-6">
              Your enterprise AI governance and management platform
            </p>
            <p className="text-lg opacity-90 mb-8">
              Discover how Sendplex helps you manage, govern, and optimize your AI agents while ensuring compliance, security, and performance.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Quick Start Guide
              </button>
              <button className="bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-800 transition-colors flex items-center">
                <Bot className="w-5 h-5 mr-2" />
                Create Your First Agent
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Platform Overview Section */}
            <section className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div 
                className="p-6 border-b border-gray-100 flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection('platform-overview')}
              >
                <div className="flex items-center">
                  <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                    <ShieldCheck className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Platform Overview</h2>
                </div>
                {expandedSections['platform-overview'] ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
              
              {expandedSections['platform-overview'] && (
                <div className="p-6">
                  <p className="text-gray-600 mb-6">
                    Sendplex is a comprehensive enterprise AI governance and management platform designed to help organizations deploy, manage, and optimize AI agents at scale. Our platform provides the tools and frameworks necessary to ensure your AI systems operate efficiently, securely, and in compliance with regulatory requirements.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="border border-gray-200 rounded-lg p-5">
                      <h3 className="font-medium text-gray-900 mb-2">AI Agent Management</h3>
                      <p className="text-gray-600 text-sm">
                        Centralized control and monitoring of all AI agents across your organization, with detailed performance metrics and governance controls.
                      </p>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-5">
                      <h3 className="font-medium text-gray-900 mb-2">Workflow Orchestration</h3>
                      <p className="text-gray-600 text-sm">
                        Design, deploy, and manage complex AI workflows that integrate with your existing business processes and systems.
                      </p>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-5">
                      <h3 className="font-medium text-gray-900 mb-2">Enterprise Integration</h3>
                      <p className="text-gray-600 text-sm">
                        Seamlessly connect with your existing enterprise systems, including CRM, ERP, and knowledge management platforms.
                      </p>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-5">
                      <h3 className="font-medium text-gray-900 mb-2">Governance Framework</h3>
                      <p className="text-gray-600 text-sm">
                        Comprehensive governance tools for policy management, compliance monitoring, and risk assessment of AI systems.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-indigo-50 rounded-lg p-4 flex items-start">
                    <Lightbulb className="h-5 w-5 text-indigo-600 mt-0.5 mr-3 flex-shrink-0" />
                    <p className="text-sm text-indigo-700">
                      Sendplex is designed to work with your existing infrastructure, providing a layer of governance and management on top of your AI investments without disrupting your current operations.
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* Core Features Section */}
            <section className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div 
                className="p-6 border-b border-gray-100 flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection('core-features')}
              >
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <Zap className="h-6 w-6 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Core Features & Benefits</h2>
                </div>
                {expandedSections['core-features'] ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
              
              {expandedSections['core-features'] && (
                <div className="p-6">
                  <div className="grid gap-8">
                    <div className="flex">
                      <div className="flex-shrink-0 mt-1">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <GitBranch className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Agentic Workflow Automation</h3>
                        <p className="mt-2 text-gray-600">
                          Design and deploy sophisticated AI workflows that automate complex business processes. Our visual workflow builder allows you to create multi-step processes involving multiple AI agents, human-in-the-loop approvals, and integration with external systems.
                        </p>
                        <ul className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                          <li className="flex items-center text-sm text-gray-600">
                            <CheckSquare className="h-4 w-4 text-green-500 mr-2" />
                            Visual workflow designer
                          </li>
                          <li className="flex items-center text-sm text-gray-600">
                            <CheckSquare className="h-4 w-4 text-green-500 mr-2" />
                            Multi-agent orchestration
                          </li>
                          <li className="flex items-center text-sm text-gray-600">
                            <CheckSquare className="h-4 w-4 text-green-500 mr-2" />
                            Human-in-the-loop controls
                          </li>
                          <li className="flex items-center text-sm text-gray-600">
                            <CheckSquare className="h-4 w-4 text-green-500 mr-2" />
                            Error handling and recovery
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0 mt-1">
                        <div className="bg-purple-100 p-2 rounded-lg">
                          <Bot className="h-5 w-5 text-purple-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Intelligent Virtual Assistants</h3>
                        <p className="mt-2 text-gray-600">
                          Create and manage AI assistants that augment your workforce across departments. From customer support to sales enablement, our platform provides the tools to build, train, and deploy specialized AI agents that work alongside your team.
                        </p>
                        <ul className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                          <li className="flex items-center text-sm text-gray-600">
                            <CheckSquare className="h-4 w-4 text-green-500 mr-2" />
                            Role-specific agent templates
                          </li>
                          <li className="flex items-center text-sm text-gray-600">
                            <CheckSquare className="h-4 w-4 text-green-500 mr-2" />
                            Custom knowledge integration
                          </li>
                          <li className="flex items-center text-sm text-gray-600">
                            <CheckSquare className="h-4 w-4 text-green-500 mr-2" />
                            Behavior configuration
                          </li>
                          <li className="flex items-center text-sm text-gray-600">
                            <CheckSquare className="h-4 w-4 text-green-500 mr-2" />
                            Multi-channel deployment
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0 mt-1">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <ShieldCheck className="h-5 w-5 text-green-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Centralized AI Governance</h3>
                        <p className="mt-2 text-gray-600">
                          Implement consistent governance policies across all AI systems with our centralized management console. Define and enforce policies for data access, content filtering, and operational boundaries to ensure responsible AI use.
                        </p>
                        <ul className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                          <li className="flex items-center text-sm text-gray-600">
                            <CheckSquare className="h-4 w-4 text-green-500 mr-2" />
                            Policy management
                          </li>
                          <li className="flex items-center text-sm text-gray-600">
                            <CheckSquare className="h-4 w-4 text-green-500 mr-2" />
                            Role-based access control
                          </li>
                          <li className="flex items-center text-sm text-gray-600">
                            <CheckSquare className="h-4 w-4 text-green-500 mr-2" />
                            Compliance monitoring
                          </li>
                          <li className="flex items-center text-sm text-gray-600">
                            <CheckSquare className="h-4 w-4 text-green-500 mr-2" />
                            Audit logging
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0 mt-1">
                        <div className="bg-orange-100 p-2 rounded-lg">
                          <BarChart2 className="h-5 w-5 text-orange-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Performance Analytics</h3>
                        <p className="mt-2 text-gray-600">
                          Gain deep insights into your AI operations with comprehensive analytics dashboards. Monitor performance metrics, track usage patterns, and identify optimization opportunities to maximize the value of your AI investments.
                        </p>
                        <ul className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                          <li className="flex items-center text-sm text-gray-600">
                            <CheckSquare className="h-4 w-4 text-green-500 mr-2" />
                            Real-time monitoring
                          </li>
                          <li className="flex items-center text-sm text-gray-600">
                            <CheckSquare className="h-4 w-4 text-green-500 mr-2" />
                            Custom reporting
                          </li>
                          <li className="flex items-center text-sm text-gray-600">
                            <CheckSquare className="h-4 w-4 text-green-500 mr-2" />
                            Trend analysis
                          </li>
                          <li className="flex items-center text-sm text-gray-600">
                            <CheckSquare className="h-4 w-4 text-green-500 mr-2" />
                            Cost optimization
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Human-Centered AI Section */}
            <section className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div 
                className="p-6 border-b border-gray-100 flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection('human-centered')}
              >
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-lg mr-4">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Human-Centered AI Approach</h2>
                </div>
                {expandedSections['human-centered'] ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
              
              {expandedSections['human-centered'] && (
                <div className="p-6">
                  <p className="text-gray-600 mb-6">
                    At Sendplex, we believe that AI should augment human capabilities, not replace them. Our platform is built with a human-centered approach that prioritizes user needs, ethical considerations, and continuous improvement based on feedback.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-5">
                      <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                        <Settings className="h-5 w-5 text-purple-600 mr-2" />
                        Personalization Capabilities
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        Tailor AI interactions to individual user preferences, communication styles, and specific needs. Our platform allows for deep personalization at both the individual and team levels.
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <CheckSquare className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                          <span className="text-sm text-gray-600">User preference management</span>
                        </li>
                        <li className="flex items-start">
                          <CheckSquare className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                          <span className="text-sm text-gray-600">Adaptive communication styles</span>
                        </li>
                        <li className="flex items-start">
                          <CheckSquare className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                          <span className="text-sm text-gray-600">Role-based customization</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-5">
                      <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                        <ShieldCheck className="h-5 w-5 text-purple-600 mr-2" />
                        Ethical Guidelines & Safeguards
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        Ensure your AI systems operate within defined ethical boundaries with built-in safeguards and guidelines that align with your organization's values and industry standards.
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <CheckSquare className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                          <span className="text-sm text-gray-600">Content filtering and moderation</span>
                        </li>
                        <li className="flex items-start">
                          <CheckSquare className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                          <span className="text-sm text-gray-600">Bias detection and mitigation</span>
                        </li>
                        <li className="flex items-start">
                          <CheckSquare className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                          <span className="text-sm text-gray-600">Ethical use policy enforcement</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-5">
                      <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                        <FileText className="h-5 w-5 text-purple-600 mr-2" />
                        Transparency in AI Decision-Making
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        Provide clear explanations for AI-driven decisions and recommendations, enabling users to understand and trust the system's outputs.
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <CheckSquare className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                          <span className="text-sm text-gray-600">Decision explanation capabilities</span>
                        </li>
                        <li className="flex items-start">
                          <CheckSquare className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                          <span className="text-sm text-gray-600">Confidence scoring</span>
                        </li>
                        <li className="flex items-start">
                          <CheckSquare className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                          <span className="text-sm text-gray-600">Source attribution</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-5">
                      <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                        <Zap className="h-5 w-5 text-purple-600 mr-2" />
                        Continuous Improvement
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        Collect and incorporate user feedback to continuously improve AI performance, relevance, and user experience over time.
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <CheckSquare className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                          <span className="text-sm text-gray-600">Feedback collection mechanisms</span>
                        </li>
                        <li className="flex items-start">
                          <CheckSquare className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                          <span className="text-sm text-gray-600">Performance analytics</span>
                        </li>
                        <li className="flex items-start">
                          <CheckSquare className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                          <span className="text-sm text-gray-600">Iterative improvement cycles</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-purple-50 rounded-lg p-4 flex items-start">
                    <Lightbulb className="h-5 w-5 text-purple-600 mt-0.5 mr-3 flex-shrink-0" />
                    <p className="text-sm text-purple-700">
                      Our human-centered approach ensures that AI systems remain tools that enhance human capabilities rather than replace them. By keeping humans in the loop and focusing on augmentation rather than automation, we help organizations build AI systems that employees trust and embrace.
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* Trust & Responsibility Framework */}
            <section className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div 
                className="p-6 border-b border-gray-100 flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection('trust-framework')}
              >
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-lg mr-4">
                    <Lock className="h-6 w-6 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Trust & Responsibility Framework</h2>
                </div>
                {expandedSections['trust-framework'] ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
              
              {expandedSections['trust-framework'] && (
                <div className="p-6">
                  <p className="text-gray-600 mb-6">
                    Sendplex's Trust & Responsibility Framework provides a comprehensive approach to ensuring your AI systems operate safely, securely, and in compliance with relevant regulations. Our framework addresses key areas of concern for enterprise AI deployment.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 p-4 border-b border-gray-200">
                        <h3 className="font-medium text-gray-900 flex items-center">
                          <ShieldCheck className="h-5 w-5 text-green-600 mr-2" />
                          AI Safety Measures & Risk Management
                        </h3>
                      </div>
                      <div className="p-4">
                        <p className="text-gray-600 text-sm mb-4">
                          Comprehensive safety controls and risk management tools to identify, assess, and mitigate potential risks associated with AI systems.
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Content Safety</h4>
                            <p className="text-xs text-gray-600">
                              Advanced content filtering and moderation to prevent harmful outputs
                            </p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Risk Assessment</h4>
                            <p className="text-xs text-gray-600">
                              Automated risk scoring and assessment for AI applications
                            </p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Operational Boundaries</h4>
                            <p className="text-xs text-gray-600">
                              Define clear operational limits for AI systems
                            </p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Incident Response</h4>
                            <p className="text-xs text-gray-600">
                              Predefined protocols for handling AI safety incidents
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 p-4 border-b border-gray-200">
                        <h3 className="font-medium text-gray-900 flex items-center">
                          <Lock className="h-5 w-5 text-green-600 mr-2" />
                          Data Privacy & Security Protocols
                        </h3>
                      </div>
                      <div className="p-4">
                        <p className="text-gray-600 text-sm mb-4">
                          Robust data protection measures to safeguard sensitive information and ensure privacy compliance across all AI operations.
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">End-to-End Encryption</h4>
                            <p className="text-xs text-gray-600">
                              Secure data transmission and storage with encryption
                            </p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Data Minimization</h4>
                            <p className="text-xs text-gray-600">
                              Tools to ensure only necessary data is processed
                            </p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Access Controls</h4>
                            <p className="text-xs text-gray-600">
                              Granular permissions and role-based access
                            </p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Data Residency</h4>
                            <p className="text-xs text-gray-600">
                              Regional data storage options for compliance
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 p-4 border-b border-gray-200">
                        <h3 className="font-medium text-gray-900 flex items-center">
                          <CheckSquare className="h-5 w-5 text-green-600 mr-2" />
                          Compliance with Industry Standards
                        </h3>
                      </div>
                      <div className="p-4">
                        <p className="text-gray-600 text-sm mb-4">
                          Built-in compliance features to help meet regulatory requirements and industry standards for AI governance.
                        </p>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <div className="font-medium text-gray-900 mb-1">GDPR</div>
                              <div className="text-xs text-gray-600">Compliant</div>
                            </div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <div className="font-medium text-gray-900 mb-1">HIPAA</div>
                              <div className="text-xs text-gray-600">Ready</div>
                            </div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <div className="font-medium text-gray-900 mb-1">SOC 2</div>
                              <div className="text-xs text-gray-600">Certified</div>
                            </div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <div className="font-medium text-gray-900 mb-1">ISO 27001</div>
                              <div className="text-xs text-gray-600">Compliant</div>
                            </div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <div className="font-medium text-gray-900 mb-1">CCPA</div>
                              <div className="text-xs text-gray-600">Ready</div>
                            </div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <div className="font-medium text-gray-900 mb-1">AI Act</div>
                              <div className="text-xs text-gray-600">Prepared</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 p-4 border-b border-gray-200">
                        <h3 className="font-medium text-gray-900 flex items-center">
                          <Database className="h-5 w-5 text-green-600 mr-2" />
                          Data Wallet Integration
                        </h3>
                      </div>
                      <div className="p-4">
                        <p className="text-gray-600 text-sm mb-4">
                          Secure data management with our integrated Data Wallet, providing a centralized repository for both company and user data with granular access controls.
                        </p>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="text-sm font-medium text-blue-800 mb-2">Data Wallet Features</h4>
                          <ul className="space-y-2">
                            <li className="flex items-start">
                              <CheckSquare className="h-4 w-4 text-blue-600 mt-0.5 mr-2" />
                              <span className="text-sm text-blue-700">Secure data storage with encryption at rest and in transit</span>
                            </li>
                            <li className="flex items-start">
                              <CheckSquare className="h-4 w-4 text-blue-600 mt-0.5 mr-2" />
                              <span className="text-sm text-blue-700">Granular access controls for different data categories</span>
                            </li>
                            <li className="flex items-start">
                              <CheckSquare className="h-4 w-4 text-blue-600 mt-0.5 mr-2" />
                              <span className="text-sm text-blue-700">Data lineage tracking and audit trails</span>
                            </li>
                            <li className="flex items-start">
                              <CheckSquare className="h-4 w-4 text-blue-600 mt-0.5 mr-2" />
                              <span className="text-sm text-blue-700">User-controlled data sharing preferences</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 p-4 border-b border-gray-200">
                        <h3 className="font-medium text-gray-900 flex items-center">
                          <FileText className="h-5 w-5 text-green-600 mr-2" />
                          Audit Trails & Accountability
                        </h3>
                      </div>
                      <div className="p-4">
                        <p className="text-gray-600 text-sm mb-4">
                          Comprehensive logging and audit capabilities to track all AI activities, decisions, and user interactions for accountability and compliance purposes.
                        </p>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Audit Feature</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Activity Logging</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Detailed logs of all AI actions and decisions</td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">User Interaction Tracking</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Records of all user interactions with AI systems</td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Decision Explanations</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rationale behind AI decisions for accountability</td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Compliance Reporting</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Automated reports for regulatory compliance</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Getting Started Guide */}
            <section className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div 
                className="p-6 border-b border-gray-100 flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection('getting-started')}
              >
                <div className="flex items-center">
                  <div className="bg-amber-100 p-3 rounded-lg mr-4">
                    <Zap className="h-6 w-6 text-amber-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Getting Started Guide</h2>
                </div>
                {expandedSections['getting-started'] ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
              
              {expandedSections['getting-started'] && (
                <div className="p-6">
                  <p className="text-gray-600 mb-6">
                    Follow these steps to quickly set up and start using Sendplex for your organization's AI governance and management needs.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-600 font-semibold">
                          1
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Set Up Your Workspace</h3>
                        <p className="mt-1 text-gray-600">
                          Configure your organization's workspace with team members, roles, and permissions.
                        </p>
                        <div className="mt-3 flex">
                          <button className="text-amber-600 font-medium text-sm flex items-center hover:text-amber-700">
                            Go to Workspace Settings
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-600 font-semibold">
                          2
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Define Governance Policies</h3>
                        <p className="mt-1 text-gray-600">
                          Create and configure governance policies that will apply to all AI agents in your organization.
                        </p>
                        <div className="mt-3 flex">
                          <button className="text-amber-600 font-medium text-sm flex items-center hover:text-amber-700">
                            Set Up Policies
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-600 font-semibold">
                          3
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Connect Your First AI Agent</h3>
                        <p className="mt-1 text-gray-600">
                          Connect to your preferred AI provider and create your first managed AI agent.
                        </p>
                        <div className="mt-3 flex">
                          <button className="text-amber-600 font-medium text-sm flex items-center hover:text-amber-700">
                            Connect an Agent
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-600 font-semibold">
                          4
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Design Your First Workflow</h3>
                        <p className="mt-1 text-gray-600">
                          Create a workflow that automates a business process using your AI agents and integrations.
                        </p>
                        <div className="mt-3 flex">
                          <button className="text-amber-600 font-medium text-sm flex items-center hover:text-amber-700">
                            Create Workflow
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-600 font-semibold">
                          5
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Monitor & Optimize</h3>
                        <p className="mt-1 text-gray-600">
                          Use the analytics dashboards to monitor performance and identify optimization opportunities.
                        </p>
                        <div className="mt-3 flex">
                          <button className="text-amber-600 font-medium text-sm flex items-center hover:text-amber-700">
                            View Analytics
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 bg-amber-50 rounded-lg p-4">
                    <h3 className="font-medium text-amber-800 mb-2">Need Help Getting Started?</h3>
                    <p className="text-sm text-amber-700 mb-3">
                      Our team is available to help you set up and configure Sendplex for your specific needs.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button className="bg-white border border-amber-300 text-amber-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-50 transition-colors flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        Contact Support
                      </button>
                      <button className="bg-white border border-amber-300 text-amber-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-50 transition-colors flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Schedule Demo
                      </button>
                      <button className="bg-white border border-amber-300 text-amber-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-50 transition-colors flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Documentation
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Quick Links Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-3">
                <a href="#" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Bot className="h-5 w-5 text-indigo-600 mr-3" />
                  <span className="text-gray-700">Create AI Agent</span>
                </a>
                <a href="#" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <GitBranch className="h-5 w-5 text-indigo-600 mr-3" />
                  <span className="text-gray-700">Design Workflow</span>
                </a>
                <a href="#" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <ShieldCheck className="h-5 w-5 text-indigo-600 mr-3" />
                  <span className="text-gray-700">Governance Settings</span>
                </a>
                <a href="#" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Database className="h-5 w-5 text-indigo-600 mr-3" />
                  <span className="text-gray-700">Data Wallet</span>
                </a>
                <a href="#" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <BarChart2 className="h-5 w-5 text-indigo-600 mr-3" />
                  <span className="text-gray-700">Analytics Dashboard</span>
                </a>
              </div>
            </div>
            
            {/* Resources Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Resources</h3>
              <div className="space-y-4">
                <a href="#" className="block group">
                  <h4 className="text-indigo-600 font-medium group-hover:text-indigo-700 flex items-center">
                    Getting Started Guide
                    <ExternalLink className="h-3.5 w-3.5 ml-1 opacity-70" />
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Step-by-step guide to setting up Sendplex
                  </p>
                </a>
                <a href="#" className="block group">
                  <h4 className="text-indigo-600 font-medium group-hover:text-indigo-700 flex items-center">
                    API Documentation
                    <ExternalLink className="h-3.5 w-3.5 ml-1 opacity-70" />
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Technical documentation for developers
                  </p>
                </a>
                <a href="#" className="block group">
                  <h4 className="text-indigo-600 font-medium group-hover:text-indigo-700 flex items-center">
                    Best Practices
                    <ExternalLink className="h-3.5 w-3.5 ml-1 opacity-70" />
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Recommended approaches for AI governance
                  </p>
                </a>
                <a href="#" className="block group">
                  <h4 className="text-indigo-600 font-medium group-hover:text-indigo-700 flex items-center">
                    Case Studies
                    <ExternalLink className="h-3.5 w-3.5 ml-1 opacity-70" />
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Success stories from Sendplex customers
                  </p>
                </a>
              </div>
            </div>
            
            {/* Support Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Need Support?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Our team is here to help you get the most out of Sendplex.
              </p>
              <div className="space-y-3">
                <button className="w-full bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact Support
                </button>
                <button className="w-full bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Schedule Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}