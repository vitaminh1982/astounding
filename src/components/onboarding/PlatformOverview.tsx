import React from 'react';
import { ArrowRight, ShieldCheck, Bot, Workflow, Building } from 'lucide-react';
import SectionNavigation from './SectionNavigation';
import WorkflowVisualization from './WorkflowVisualization';

interface PlatformOverviewProps {
  onNext: () => void;
}

const PlatformOverview: React.FC<PlatformOverviewProps> = ({ onNext }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 transition-colors">Platform Overview</h2>
        <p className="text-gray-600 dark:text-gray-400 transition-colors">
          Sendplex is a comprehensive enterprise AI governance and management platform designed to help organizations 
          deploy, manage, and govern AI agents and virtual assistants at scale.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-gray-900 hover:shadow-md dark:hover:shadow-gray-800 transition-all duration-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 dark:bg-teal-900 rounded-lg transition-colors">
              <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-teal-300 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 transition-colors">AI Governance</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4 transition-colors">
            Establish comprehensive governance frameworks for your AI systems with policy management, 
            compliance monitoring, and risk assessment tools.
          </p>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            <li className="flex items-start">
              <ArrowRight className="w-4 h-4 text-indigo-600 dark:text-teal-400 mt-1 mr-2 flex-shrink-0 transition-colors" />
              <span className="transition-colors">Centralized policy management</span>
            </li>
            <li className="flex items-start">
              <ArrowRight className="w-4 h-4 text-indigo-600 dark:text-teal-400 mt-1 mr-2 flex-shrink-0 transition-colors" />
              <span className="transition-colors">Compliance monitoring and reporting</span>
            </li>
            <li className="flex items-start">
              <ArrowRight className="w-4 h-4 text-indigo-600 dark:text-teal-400 mt-1 mr-2 flex-shrink-0 transition-colors" />
              <span className="transition-colors">Risk assessment and mitigation</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-gray-900 hover:shadow-md dark:hover:shadow-gray-800 transition-all duration-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 dark:bg-teal-900 rounded-lg transition-colors">
              <Bot className="w-5 h-5 text-indigo-600 dark:text-teal-300 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 transition-colors">AI Management</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4 transition-colors">
            Efficiently manage your AI agents with intuitive configuration tools, performance monitoring, 
            and seamless integration capabilities.
          </p>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            <li className="flex items-start">
              <ArrowRight className="w-4 h-4 text-indigo-600 dark:text-teal-400 mt-1 mr-2 flex-shrink-0 transition-colors" />
              <span className="transition-colors">Agent configuration and deployment</span>
            </li>
            <li className="flex items-start">
              <ArrowRight className="w-4 h-4 text-indigo-600 dark:text-teal-400 mt-1 mr-2 flex-shrink-0 transition-colors" />
              <span className="transition-colors">Performance monitoring and analytics</span>
            </li>
            <li className="flex items-start">
              <ArrowRight className="w-4 h-4 text-indigo-600 dark:text-teal-400 mt-1 mr-2 flex-shrink-0 transition-colors" />
              <span className="transition-colors">Integration with existing systems</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="bg-indigo-50 dark:bg-teal-900 rounded-xl p-6 border border-indigo-100 dark:border-teal-800 shadow-sm dark:shadow-gray-900 hover:shadow-md dark:hover:shadow-gray-800 transition-all duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-100 dark:bg-teal-800 rounded-lg transition-colors">
            <Building className="w-5 h-5 text-indigo-600 dark:text-teal-300 transition-colors" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 transition-colors">Enterprise Integration</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4 transition-colors">
          Sendplex seamlessly integrates with your existing enterprise infrastructure, including CRM systems, 
          knowledge bases, and communication platforms.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg text-center border border-gray-200 dark:border-gray-600 shadow-sm dark:shadow-gray-900 hover:shadow-md dark:hover:shadow-gray-800 transition-all duration-200">
            <div className="text-gray-800 dark:text-gray-100 font-medium transition-colors">CRM Systems</div>
          </div>
          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg text-center border border-gray-200 dark:border-gray-600 shadow-sm dark:shadow-gray-900 hover:shadow-md dark:hover:shadow-gray-800 transition-all duration-200">
            <div className="text-gray-800 dark:text-gray-100 font-medium transition-colors">Knowledge Bases</div>
          </div>
          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg text-center border border-gray-200 dark:border-gray-600 shadow-sm dark:shadow-gray-900 hover:shadow-md dark:hover:shadow-gray-800 transition-all duration-200">
            <div className="text-gray-800 dark:text-gray-100 font-medium transition-colors">Communication</div>
          </div>
          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg text-center border border-gray-200 dark:border-gray-600 shadow-sm dark:shadow-gray-900 hover:shadow-md dark:hover:shadow-gray-800 transition-all duration-200">
            <div className="text-gray-800 dark:text-gray-100 font-medium transition-colors">Data Warehouses</div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-gray-900 hover:shadow-md dark:hover:shadow-gray-800 transition-all duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-100 dark:bg-teal-900 rounded-lg transition-colors">
            <Workflow className="w-5 h-5 text-indigo-600 dark:text-teal-300 transition-colors" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 transition-colors">Workflow Automation</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4 transition-colors">
          Create sophisticated AI-powered workflows that automate business processes, enhance customer 
          experiences, and improve operational efficiency.
        </p>
        {/* Workflow Visualization Component */}
        <WorkflowVisualization height={240} />
      </div>
      
      <SectionNavigation onNext={onNext} />
    </div>
  );
};

export default PlatformOverview;
