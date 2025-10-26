import React from 'react';
import { Workflow, Bot, BarChart3, Shield } from 'lucide-react';
import SectionNavigation from './SectionNavigation';

interface CoreFeaturesProps {
  onNext: () => void;
}

const CoreFeatures: React.FC<CoreFeaturesProps> = ({ onNext }) => {
  
  // Feature data
  const features = [
    {
      id: 1,
      title: 'Agentic Workflow Automation',
      description: 'Design and deploy sophisticated AI-powered workflows that automate complex business processes.',
      icon: Workflow,
      color: 'bg-blue-100 dark:bg-blue-900',
      textColor: 'text-blue-600 dark:text-blue-300',
      benefits: [
        'Reduce manual workload by up to 70%',
        'Ensure consistent process execution',
        'Seamlessly integrate with existing systems'
      ]
    },
    {
      id: 2,
      title: 'Intelligent Virtual Assistants',
      description: 'Create and manage AI assistants that augment your workforce and enhance customer experiences.',
      icon: Bot,
      color: 'bg-purple-100 dark:bg-purple-900',
      textColor: 'text-purple-600 dark:text-purple-300',
      benefits: [
        '24/7 availability for customer support',
        'Consistent and personalized interactions',
        'Seamless escalation to human agents when needed'
      ]
    },
    {
      id: 3,
      title: 'Centralized AI Governance',
      description: 'Establish comprehensive governance frameworks for all your AI systems with policy management.',
      icon: Shield,
      color: 'bg-green-100 dark:bg-green-900',
      textColor: 'text-green-600 dark:text-green-300',
      benefits: [
        'Ensure compliance with regulations',
        'Mitigate risks associated with AI deployment',
        'Maintain ethical AI practices across your organization'
      ]
    },
    {
      id: 4,
      title: 'Real-time Monitoring & Analytics',
      description: 'Track performance, usage patterns, and outcomes with comprehensive analytics dashboards.',
      icon: BarChart3,
      color: 'bg-amber-100 dark:bg-amber-900',
      textColor: 'text-amber-600 dark:text-amber-300',
      benefits: [
        'Identify optimization opportunities',
        'Track ROI and business impact',
        'Monitor system health and performance'
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Core Features & Benefits</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Sendplex offers a comprehensive suite of features designed to help you deploy, manage, and govern AI systems at scale.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature) => (
          <div key={feature.id} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 ${feature.color} rounded-lg transition-colors`}>
                <feature.icon className={`w-5 h-5 ${feature.textColor}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{feature.title}</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{feature.description}</p>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">Key Benefits:</h4>
              <ul className="space-y-2">
                {feature.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <span className={`inline-block w-2 h-2 ${feature.textColor} rounded-full mt-1.5 mr-2`}></span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-indigo-50 dark:bg-teal-900 rounded-xl p-6 border border-indigo-100 dark:border-teal-800 transition-colors">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Feature Comparison</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Feature</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sendplex</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Competitors</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">Centralized Governance</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400">✓ Comprehensive</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Limited</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">Multi-Agent Orchestration</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400">✓ Advanced</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Basic</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">Enterprise Integration</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400">✓ Seamless</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Complex</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">Performance Analytics</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400">✓ Real-time</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Delayed</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <SectionNavigation onNext={onNext} />
    </div>
  );
};

export default CoreFeatures;
