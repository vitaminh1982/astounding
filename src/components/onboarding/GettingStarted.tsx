import React from 'react';
import { CheckCircle, ArrowRight, Calendar, Users, Settings, Bot } from 'lucide-react';

const GettingStarted: React.FC = () => {
  // Implementation steps data
  const implementationSteps = [
    {
      id: 1,
      title: 'Platform Setup',
      description: 'Configure your Sendplex environment and connect to your existing systems.',
      status: 'completed',
      tasks: [
        { id: 't1', name: 'Create administrator account', completed: true },
        { id: 't2', name: 'Configure workspace settings', completed: true },
        { id: 't3', name: 'Set up team members and permissions', completed: true }
      ]
    },
    {
      id: 2,
      title: 'AI Agent Configuration',
      description: 'Design and deploy your first AI agents based on your business needs.',
      status: 'in-progress',
      tasks: [
        { id: 't4', name: 'Define agent roles and capabilities', completed: true },
        { id: 't5', name: 'Configure knowledge bases', completed: false },
        { id: 't6', name: 'Set up communication channels', completed: false }
      ]
    },
    {
      id: 3,
      title: 'Governance Setup',
      description: 'Establish governance policies and compliance frameworks for your AI systems.',
      status: 'pending',
      tasks: [
        { id: 't7', name: 'Define AI usage policies', completed: false },
        { id: 't8', name: 'Configure compliance monitoring', completed: false },
        { id: 't9', name: 'Set up audit logging', completed: false }
      ]
    },
    {
      id: 4,
      title: 'Training & Adoption',
      description: 'Train your team and roll out the platform across your organization.',
      status: 'pending',
      tasks: [
        { id: 't10', name: 'Conduct administrator training', completed: false },
        { id: 't11', name: 'Prepare user documentation', completed: false },
        { id: 't12', name: 'Plan phased rollout', completed: false }
      ]
    }
  ];

  // Resources data
  const resources = [
    {
      id: 'r1',
      title: 'Documentation',
      description: 'Comprehensive guides and API references',
      icon: Settings,
      link: '#'
    },
    {
      id: 'r2',
      title: 'Webinars',
      description: 'Live and recorded training sessions',
      icon: Calendar,
      link: '#'
    },
    {
      id: 'r3',
      title: 'Community',
      description: 'Connect with other Sendplex users',
      icon: Users,
      link: '#'
    },
    {
      id: 'r4',
      title: 'Templates',
      description: 'Pre-built agents and workflows',
      icon: Bot,
      link: '#'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Getting Started Guide</h2>
        <p className="text-gray-600">
          Follow this step-by-step implementation process to successfully deploy Sendplex across your organization.
        </p>
      </div>
      
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-800">Implementation Process</h3>
        
        <div className="space-y-4">
          {implementationSteps.map((step) => (
            <div 
              key={step.id} 
              className={`border rounded-xl p-5 ${
                step.status === 'completed' 
                  ? 'border-green-200 bg-green-50' 
                  : step.status === 'in-progress'
                  ? 'border-blue-200 bg-blue-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-start">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                  step.status === 'completed' 
                    ? 'bg-green-100 text-green-600' 
                    : step.status === 'in-progress'
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {step.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{step.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      step.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : step.status === 'in-progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {step.status === 'completed' 
                        ? 'Completed' 
                        : step.status === 'in-progress'
                        ? 'In Progress'
                        : 'Pending'}
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    {step.tasks.map((task) => (
                      <div key={task.id} className="flex items-start">
                        <div className={`p-0.5 rounded-full mr-2 mt-0.5 ${
                          task.completed ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <CheckCircle className={`w-4 h-4 ${
                            task.completed ? 'text-green-600' : 'text-gray-400'
                          }`} />
                        </div>
                        <span className={`text-sm ${
                          task.completed ? 'text-gray-700' : 'text-gray-500'
                        }`}>
                          {task.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-indigo-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Best Practices for User Adoption</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">Start Small, Scale Fast</h4>
            <p className="text-sm text-gray-600">Begin with a focused pilot project before expanding to the entire organization.</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">Involve Key Stakeholders</h4>
            <p className="text-sm text-gray-600">Ensure buy-in from leadership and department heads early in the process.</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">Provide Adequate Training</h4>
            <p className="text-sm text-gray-600">Invest in comprehensive training for all users to maximize adoption.</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">Measure & Communicate Success</h4>
            <p className="text-sm text-gray-600">Track key metrics and share wins to build momentum and enthusiasm.</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-800">Resources & Support</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((resource) => (
            <a 
              key={resource.id}
              href={resource.link}
              className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="p-2 bg-indigo-100 rounded-lg mr-4">
                <resource.icon className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">{resource.title}</h4>
                <p className="text-sm text-gray-600">{resource.description}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-indigo-600 ml-auto" />
            </a>
          ))}
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="p-2 bg-green-100 rounded-lg mr-4">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Ready to Get Started?</h4>
              <p className="text-sm text-gray-600 mb-3">
                Your Sendplex environment is now ready for configuration. Our team is available to help you with the next steps.
              </p>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm">
                Schedule Onboarding Call
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GettingStarted;