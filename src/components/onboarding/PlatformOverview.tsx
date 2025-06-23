import React from 'react';
import { ArrowRight, ShieldCheck, Bot, Workflow, Building } from 'lucide-react';
import SectionNavigation from './SectionNavigation';

interface PlatformOverviewProps {
  onNext: () => void;
}

const PlatformOverview: React.FC<PlatformOverviewProps> = ({ onNext }) => {
  const handleNext = () => {
    // Scroll to top of the page
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    
    // Call the original onNext function
    onNext();
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Platform Overview</h2>
        <p className="text-gray-600">
          Sendplex is a comprehensive enterprise AI governance and management platform designed to help organizations 
          deploy, manage, and govern AI agents and virtual assistants at scale.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">AI Governance</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Establish comprehensive governance frameworks for your AI systems with policy management, 
            compliance monitoring, and risk assessment tools.
          </p>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <ArrowRight className="w-4 h-4 text-indigo-600 mt-1 mr-2 flex-shrink-0" />
              <span>Centralized policy management</span>
            </li>
            <li className="flex items-start">
              <ArrowRight className="w-4 h-4 text-indigo-600 mt-1 mr-2 flex-shrink-0" />
              <span>Compliance monitoring and reporting</span>
            </li>
            <li className="flex items-start">
              <ArrowRight className="w-4 h-4 text-indigo-600 mt-1 mr-2 flex-shrink-0" />
              <span>Risk assessment and mitigation</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Bot className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">AI Management</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Efficiently manage your AI agents with intuitive configuration tools, performance monitoring, 
            and seamless integration capabilities.
          </p>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <ArrowRight className="w-4 h-4 text-indigo-600 mt-1 mr-2 flex-shrink-0" />
              <span>Agent configuration and deployment</span>
            </li>
            <li className="flex items-start">
              <ArrowRight className="w-4 h-4 text-indigo-600 mt-1 mr-2 flex-shrink-0" />
              <span>Performance monitoring and analytics</span>
            </li>
            <li className="flex items-start">
              <ArrowRight className="w-4 h-4 text-indigo-600 mt-1 mr-2 flex-shrink-0" />
              <span>Integration with existing systems</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="bg-indigo-50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Building className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Enterprise Integration</h3>
        </div>
        <p className="text-gray-600 mb-4">
          Sendplex seamlessly integrates with your existing enterprise infrastructure, including CRM systems, 
          knowledge bases, and communication platforms.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg text-center">
            <div className="text-gray-800 font-medium">CRM Systems</div>
          </div>
          <div className="bg-white p-4 rounded-lg text-center">
            <div className="text-gray-800 font-medium">Knowledge Bases</div>
          </div>
          <div className="bg-white p-4 rounded-lg text-center">
            <div className="text-gray-800 font-medium">Communication</div>
          </div>
          <div className="bg-white p-4 rounded-lg text-center">
            <div className="text-gray-800 font-medium">Data Warehouses</div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Workflow className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Workflow Automation</h3>
        </div>
        <p className="text-gray-600 mb-4">
          Create sophisticated AI-powered workflows that automate business processes, enhance customer 
          experiences, and improve operational efficiency.
        </p>
        <div className="relative h-24 bg-white rounded-lg p-4 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500">Workflow visualization placeholder</p>
            </div>
          </div>
        </div>
      </div>
      
      <SectionNavigation onNext={handleNext} />
    </div>
  );
};

export default PlatformOverview;
