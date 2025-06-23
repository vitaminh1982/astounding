import React from 'react';
import { Workflow, Bot, BarChart3, Shield } from 'lucide-react';
import SectionNavigation from './SectionNavigation';

interface CoreFeaturesProps {
  onNext: () => void;
}

const CoreFeatures: React.FC<CoreFeaturesProps> = ({ onNext }) => {

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
  
  // Feature data
  const features = [
    {
      id: 1,
      title: 'Agentic Workflow Automation',
      description: 'Design and deploy sophisticated AI-powered workflows that automate complex business processes.',
      icon: Workflow,
      color: 'bg-blue-100',
      textColor: 'text-blue-600',
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
      color: 'bg-purple-100',
      textColor: 'text-purple-600',
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
      color: 'bg-green-100',
      textColor: 'text-green-600',
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
      color: 'bg-amber-100',
      textColor: 'text-amber-600',
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
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Core Features & Benefits</h2>
        <p className="text-gray-600">
          Sendplex offers a comprehensive suite of features designed to help you deploy, manage, and govern AI systems at scale.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature) => (
          <div key={feature.id} className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 ${feature.color} rounded-lg`}>
                <feature.icon className={`w-5 h-5 ${feature.textColor}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{feature.title}</h3>
            </div>
            <p className="text-gray-600 mb-4">{feature.description}</p>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Key Benefits:</h4>
              <ul className="space-y-2">
                {feature.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <span className={`inline-block w-2 h-2 ${feature.textColor} rounded-full mt-1.5 mr-2`}></span>
                    <span className="text-sm text-gray-600">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-indigo-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Feature Comparison</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feature</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sendplex</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Competitors</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Centralized Governance</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">✓ Comprehensive</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Limited</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Multi-Agent Orchestration</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">✓ Advanced</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Basic</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Enterprise Integration</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">✓ Seamless</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Complex</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Performance Analytics</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">✓ Real-time</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Delayed</td>
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