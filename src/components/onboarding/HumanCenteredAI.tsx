import React from 'react';
import { Users, MessageSquare, Eye, RefreshCw } from 'lucide-react';
import SectionNavigation from './SectionNavigation';

interface HumanCenteredAIProps {
  onNext: () => void;
}

const HumanCenteredAI: React.FC<HumanCenteredAIProps> = ({ onNext }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Human-Centered AI Approach</h2>
        <p className="text-gray-600">
          Sendplex is built on the principle that AI should augment human capabilities, not replace them. 
          Our platform puts humans at the center of the AI experience, ensuring that technology serves people's needs.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Personalization</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Tailor AI interactions to individual user needs, preferences, and contexts for more relevant and effective experiences.
          </p>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="p-1 bg-indigo-100 rounded-full mt-0.5 mr-3">
                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">User Preference Learning</h4>
                <p className="text-sm text-gray-500">Adapts to individual communication styles and preferences</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="p-1 bg-indigo-100 rounded-full mt-0.5 mr-3">
                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Contextual Awareness</h4>
                <p className="text-sm text-gray-500">Considers user history and context for more relevant interactions</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="p-1 bg-indigo-100 rounded-full mt-0.5 mr-3">
                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Adaptive Interfaces</h4>
                <p className="text-sm text-gray-500">Adjusts complexity based on user expertise and needs</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <MessageSquare className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Ethical Guidelines</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Built-in ethical frameworks ensure AI systems operate according to your organization's values and principles.
          </p>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="p-1 bg-indigo-100 rounded-full mt-0.5 mr-3">
                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Value Alignment</h4>
                <p className="text-sm text-gray-500">Ensures AI behavior aligns with organizational values</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="p-1 bg-indigo-100 rounded-full mt-0.5 mr-3">
                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Bias Mitigation</h4>
                <p className="text-sm text-gray-500">Actively identifies and reduces potential biases</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="p-1 bg-indigo-100 rounded-full mt-0.5 mr-3">
                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Fairness Monitoring</h4>
                <p className="text-sm text-gray-500">Continuously evaluates AI decisions for fairness</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Eye className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Transparency</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Make AI decision-making processes transparent and explainable to build trust with users and stakeholders.
          </p>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="p-1 bg-indigo-100 rounded-full mt-0.5 mr-3">
                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Decision Explanations</h4>
                <p className="text-sm text-gray-500">Provides clear rationale for AI recommendations</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="p-1 bg-indigo-100 rounded-full mt-0.5 mr-3">
                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Confidence Indicators</h4>
                <p className="text-sm text-gray-500">Shows reliability level of AI-generated information</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="p-1 bg-indigo-100 rounded-full mt-0.5 mr-3">
                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Source Attribution</h4>
                <p className="text-sm text-gray-500">Clearly identifies information sources</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <RefreshCw className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Continuous Improvement</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Leverage user feedback and performance data to continuously improve AI capabilities and experiences.
          </p>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="p-1 bg-indigo-100 rounded-full mt-0.5 mr-3">
                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Feedback Integration</h4>
                <p className="text-sm text-gray-500">Incorporates user feedback into system improvements</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="p-1 bg-indigo-100 rounded-full mt-0.5 mr-3">
                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Performance Analytics</h4>
                <p className="text-sm text-gray-500">Identifies improvement opportunities through data analysis</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="p-1 bg-indigo-100 rounded-full mt-0.5 mr-3">
                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Iterative Development</h4>
                <p className="text-sm text-gray-500">Regularly updates AI capabilities based on insights</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-indigo-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Human-AI Collaboration Framework</h3>
        <p className="text-gray-600 mb-6">
          Sendplex is designed to facilitate effective collaboration between humans and AI systems, creating a partnership that leverages the strengths of both.
        </p>
        <div className="relative h-48 bg-white rounded-lg p-4 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500">Human-AI collaboration diagram placeholder</p>
              <p className="text-sm text-gray-400 mt-2">Illustrating how humans and AI work together in the Sendplex ecosystem</p>
            </div>
          </div>
        </div>
      </div>
      
      <SectionNavigation onNext={onNext} />
    </div>
  );
};

export default HumanCenteredAI;