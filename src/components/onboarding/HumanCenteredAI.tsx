import React from 'react';
import { Users, MessageSquare, Eye, RefreshCw } from 'lucide-react';
import SectionNavigation from './SectionNavigation';
import HumanAICollaborationFramework from './HumanAICollaborationFramework';

interface HumanCenteredAIProps {
  onNext: () => void;
}

const HumanCenteredAI: React.FC<HumanCenteredAIProps> = ({ onNext }) => {
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Human-Centered AI Approach</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Sendplex is built on the principle that AI should augment human capabilities, not replace them. 
          Our platform puts humans at the center of the AI experience, ensuring that technology serves people's needs.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 dark:bg-teal-900 rounded-lg transition-colors">
              <Users className="w-5 h-5 text-indigo-600 dark:text-teal-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Personalization</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Tailor AI interactions to individual user needs, preferences, and contexts for more relevant and effective experiences.
          </p>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="p-1 bg-indigo-100 dark:bg-teal-900 rounded-full mt-0.5 mr-3 transition-colors">
                <div className="w-2 h-2 bg-indigo-600 dark:bg-teal-300 rounded-full"></div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">User Preference Learning</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Adapts to individual communication styles and preferences</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="p-1 bg-indigo-100 dark:bg-teal-900 rounded-full mt-0.5 mr-3 transition-colors">
                <div className="w-2 h-2 bg-indigo-600 dark:bg-teal-300 rounded-full"></div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">Contextual Awareness</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Considers user history and context for more relevant interactions</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="p-1 bg-indigo-100 dark:bg-teal-900 rounded-full mt-0.5 mr-3 transition-colors">
                <div className="w-2 h-2 bg-indigo-600 dark:bg-teal-300 rounded-full"></div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">Adaptive Interfaces</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Adjusts complexity based on user expertise and needs</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 dark:bg-teal-900 rounded-lg transition-colors">
              <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-teal-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Ethical Guidelines</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Built-in ethical frameworks ensure AI systems operate according to your organization's values and principles.
          </p>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="p-1 bg-indigo-100 dark:bg-teal-900 rounded-full mt-0.5 mr-3 transition-colors">
                <div className="w-2 h-2 bg-indigo-600 dark:bg-teal-300 rounded-full"></div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">Value Alignment</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Ensures AI behavior aligns with organizational values</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="p-1 bg-indigo-100 dark:bg-teal-900 rounded-full mt-0.5 mr-3 transition-colors">
                <div className="w-2 h-2 bg-indigo-600 dark:bg-teal-300 rounded-full"></div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">Bias Mitigation</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Actively identifies and reduces potential biases</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="p-1 bg-indigo-100 dark:bg-teal-900 rounded-full mt-0.5 mr-3 transition-colors">
                <div className="w-2 h-2 bg-indigo-600 dark:bg-teal-300 rounded-full"></div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">Fairness Monitoring</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Continuously evaluates AI decisions for fairness</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 dark:bg-teal-900 rounded-lg transition-colors">
              <Eye className="w-5 h-5 text-indigo-600 dark:text-teal-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Transparency</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Make AI decision-making processes transparent and explainable to build trust with users and stakeholders.
          </p>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="p-1 bg-indigo-100 dark:bg-teal-900 rounded-full mt-0.5 mr-3 transition-colors">
                <div className="w-2 h-2 bg-indigo-600 dark:bg-teal-300 rounded-full"></div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">Decision Explanations</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Provides clear rationale for AI recommendations</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="p-1 bg-indigo-100 dark:bg-teal-900 rounded-full mt-0.5 mr-3 transition-colors">
                <div className="w-2 h-2 bg-indigo-600 dark:bg-teal-300 rounded-full"></div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">Confidence Indicators</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Shows reliability level of AI-generated information</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="p-1 bg-indigo-100 dark:bg-teal-900 rounded-full mt-0.5 mr-3 transition-colors">
                <div className="w-2 h-2 bg-indigo-600 dark:bg-teal-300 rounded-full"></div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">Source Attribution</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Clearly identifies information sources</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 dark:bg-teal-900 rounded-lg transition-colors">
              <RefreshCw className="w-5 h-5 text-indigo-600 dark:text-teal-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Continuous Improvement</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Leverage user feedback and performance data to continuously improve AI capabilities and experiences.
          </p>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="p-1 bg-indigo-100 dark:bg-teal-900 rounded-full mt-0.5 mr-3 transition-colors">
                <div className="w-2 h-2 bg-indigo-600 dark:bg-teal-300 rounded-full"></div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">Feedback Integration</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Incorporates user feedback into system improvements</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="p-1 bg-indigo-100 dark:bg-teal-900 rounded-full mt-0.5 mr-3 transition-colors">
                <div className="w-2 h-2 bg-indigo-600 dark:bg-teal-300 rounded-full"></div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">Performance Analytics</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Identifies improvement opportunities through data analysis</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="p-1 bg-indigo-100 dark:bg-teal-900 rounded-full mt-0.5 mr-3 transition-colors">
                <div className="w-2 h-2 bg-indigo-600 dark:bg-teal-300 rounded-full"></div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">Iterative Development</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Regularly updates AI capabilities based on insights</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-indigo-50 dark:bg-teal-900 rounded-xl p-6 border border-indigo-100 dark:border-teal-800 transition-colors">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Human-AI Collaboration Framework</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Sendplex is designed to facilitate effective collaboration between humans and AI systems, creating a partnership that leverages the strengths of both to achieve optimal outcomes.
        </p>
        <HumanAICollaborationFramework />
      </div>
      
      <SectionNavigation onNext={onNext} />
    </div>
  );
};

export default HumanCenteredAI;
