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
        <h2 className="text-2xl font-bold text-on-surface dark:text-foreground mb-4">Human-Centered AI Approach</h2>
        <p className="text-muted-foreground dark:text-muted-foreground">
          Sendplex is built on the principle that AI should augment human capabilities, not replace them. 
          Our platform puts humans at the center of the AI experience, ensuring that technology serves people's needs.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-container-low dark:bg-surface-container-high rounded-xl p-6 border border-border dark:border-border transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 dark:bg-teal-900 rounded-lg transition-colors">
              <Users className="w-5 h-5 text-primary-green dark:text-teal-300" />
            </div>
            <h3 className="text-lg font-semibold text-on-surface dark:text-foreground">Personalization</h3>
          </div>
          <p className="text-muted-foreground dark:text-muted-foreground mb-4">
            Tailor AI interactions to individual user needs, preferences, and contexts for more relevant and effective experiences.
          </p>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="p-1 bg-indigo-100 dark:bg-teal-900 rounded-full mt-0.5 mr-3 transition-colors">
                <div className="w-2 h-2 bg-primary dark:bg-teal-300 rounded-full"></div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-on-surface dark:text-on-surface-variant">User Preference Learning</h4>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">Adapts to individual communication styles and preferences</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="p-1 bg-indigo-100 dark:bg-teal-900 rounded-full mt-0.5 mr-3 transition-colors">
                <div className="w-2 h-2 bg-primary dark:bg-teal-300 rounded-full"></div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-on-surface dark:text-on-surface-variant">Contextual Awareness</h4>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">Considers user history and context for more relevant interactions</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="p-1 bg-indigo-100 dark:bg-teal-900 rounded-full mt-0.5 mr-3 transition-colors">
                <div className="w-2 h-2 bg-primary dark:bg-teal-300 rounded-full"></div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-on-surface dark:text-on-surface-variant">Adaptive Interfaces</h4>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">Adjusts complexity based on user expertise and needs</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-surface-container-low dark:bg-surface-container-high rounded-xl p-6 border border-border dark:border-border transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 dark:bg-teal-900 rounded-lg transition-colors">
              <MessageSquare className="w-5 h-5 text-primary-green dark:text-teal-300" />
            </div>
            <h3 className="text-lg font-semibold text-on-surface dark:text-foreground">Ethical Guidelines</h3>
          </div>
          <p className="text-muted-foreground dark:text-muted-foreground mb-4">
            Built-in ethical frameworks ensure AI systems operate according to your organization's values and principles.
          </p>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="p-1 bg-indigo-100 dark:bg-teal-900 rounded-full mt-0.5 mr-3 transition-colors">
                <div className="w-2 h-2 bg-primary dark:bg-teal-300 rounded-full"></div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-on-surface dark:text-on-surface-variant">Value Alignment</h4>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">Ensures AI behavior aligns with organizational values</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="p-1 bg-indigo-100 dark:bg-teal-900 rounded-full mt-0.5 mr-3 transition-colors">
                <div className="w-2 h-2 bg-primary dark:bg-teal-300 rounded-full"></div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-on-surface dark:text-on-surface-variant">Bias Mitigation</h4>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">Actively identifies and reduces potential biases</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="p-1 bg-indigo-100 dark:bg-teal-900 rounded-full mt-0.5 mr-3 transition-colors">
                <div className="w-2 h-2 bg-primary dark:bg-teal-300 rounded-full"></div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-on-surface dark:text-on-surface-variant">Fairness Monitoring</h4>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">Continuously evaluates AI decisions for fairness</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-surface-container-low dark:bg-surface-container-high rounded-xl p-6 border border-border dark:border-border transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 dark:bg-teal-900 rounded-lg transition-colors">
              <Eye className="w-5 h-5 text-primary-green dark:text-teal-300" />
            </div>
            <h3 className="text-lg font-semibold text-on-surface dark:text-foreground">Transparency</h3>
          </div>
          <p className="text-muted-foreground dark:text-muted-foreground mb-4">
            Make AI decision-making processes transparent and explainable to build trust with users and stakeholders.
          </p>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="p-1 bg-indigo-100 dark:bg-teal-900 rounded-full mt-0.5 mr-3 transition-colors">
                <div className="w-2 h-2 bg-primary dark:bg-teal-300 rounded-full"></div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-on-surface dark:text-on-surface-variant">Decision Explanations</h4>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">Provides clear rationale for AI recommendations</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="p-1 bg-indigo-100 dark:bg-teal-900 rounded-full mt-0.5 mr-3 transition-colors">
                <div className="w-2 h-2 bg-primary dark:bg-teal-300 rounded-full"></div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-on-surface dark:text-on-surface-variant">Confidence Indicators</h4>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">Shows reliability level of AI-generated information</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="p-1 bg-indigo-100 dark:bg-teal-900 rounded-full mt-0.5 mr-3 transition-colors">
                <div className="w-2 h-2 bg-primary dark:bg-teal-300 rounded-full"></div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-on-surface dark:text-on-surface-variant">Source Attribution</h4>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">Clearly identifies information sources</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-surface-container-low dark:bg-surface-container-high rounded-xl p-6 border border-border dark:border-border transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 dark:bg-teal-900 rounded-lg transition-colors">
              <RefreshCw className="w-5 h-5 text-primary-green dark:text-teal-300" />
            </div>
            <h3 className="text-lg font-semibold text-on-surface dark:text-foreground">Continuous Improvement</h3>
          </div>
          <p className="text-muted-foreground dark:text-muted-foreground mb-4">
            Leverage user feedback and performance data to continuously improve AI capabilities and experiences.
          </p>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="p-1 bg-indigo-100 dark:bg-teal-900 rounded-full mt-0.5 mr-3 transition-colors">
                <div className="w-2 h-2 bg-primary dark:bg-teal-300 rounded-full"></div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-on-surface dark:text-on-surface-variant">Feedback Integration</h4>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">Incorporates user feedback into system improvements</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="p-1 bg-indigo-100 dark:bg-teal-900 rounded-full mt-0.5 mr-3 transition-colors">
                <div className="w-2 h-2 bg-primary dark:bg-teal-300 rounded-full"></div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-on-surface dark:text-on-surface-variant">Performance Analytics</h4>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">Identifies improvement opportunities through data analysis</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="p-1 bg-indigo-100 dark:bg-teal-900 rounded-full mt-0.5 mr-3 transition-colors">
                <div className="w-2 h-2 bg-primary dark:bg-teal-300 rounded-full"></div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-on-surface dark:text-on-surface-variant">Iterative Development</h4>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">Regularly updates AI capabilities based on insights</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-indigo-50 dark:bg-teal-900 rounded-xl p-6 border border-indigo-100 dark:border-teal-800 transition-colors">
        <h3 className="text-lg font-semibold text-on-surface dark:text-foreground mb-4">Human-AI Collaboration Framework</h3>
        <p className="text-muted-foreground dark:text-muted-foreground mb-6">
          Sendplex is designed to facilitate effective collaboration between humans and AI systems, creating a partnership that leverages the strengths of both to achieve optimal outcomes.
        </p>
        <HumanAICollaborationFramework />
      </div>
      
      <SectionNavigation onNext={onNext} />
    </div>
  );
};

export default HumanCenteredAI;
