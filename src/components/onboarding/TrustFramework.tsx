import React from 'react';
import { Shield, Lock, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import SectionNavigation from './SectionNavigation';

interface TrustFrameworkProps {
  onNext: () => void;
}

const TrustFramework: React.FC<TrustFrameworkProps> = ({ onNext }) => {
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-on-surface dark:text-foreground mb-4">Trust & Responsibility Framework</h2>
        <p className="text-muted-foreground dark:text-muted-foreground">
          Sendplex's Trust & Responsibility Framework ensures that AI systems operate reliably, securely, and ethically 
          within your organization, building confidence among users, customers, and stakeholders.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-container-low dark:bg-surface-container-high rounded-xl p-6 border border-border dark:border-border transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 dark:bg-green-900 rounded-lg transition-colors">
              <Shield className="w-5 h-5 text-primary-green dark:text-green-300" />
            </div>
            <h3 className="text-lg font-semibold text-on-surface dark:text-foreground">AI Safety Measures</h3>
          </div>
          <p className="text-muted-foreground dark:text-muted-foreground mb-4">
            Comprehensive safety protocols to prevent misuse and ensure responsible AI operation.
          </p>
          <ul className="space-y-3">
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 mt-1 mr-2 flex-shrink-0" />
              <div>
                <span className="font-medium text-on-surface dark:text-on-surface-variant">Content Filtering</span>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">Prevents harmful or inappropriate content generation</p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 mt-1 mr-2 flex-shrink-0" />
              <div>
                <span className="font-medium text-on-surface dark:text-on-surface-variant">Operational Boundaries</span>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">Defines clear limits on AI agent capabilities</p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 mt-1 mr-2 flex-shrink-0" />
              <div>
                <span className="font-medium text-on-surface dark:text-on-surface-variant">Human Oversight</span>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">Maintains appropriate human supervision of AI systems</p>
              </div>
            </li>
          </ul>
        </div>
        
        <div className="bg-surface-container-low dark:bg-surface-container-high rounded-xl p-6 border border-border dark:border-border transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 dark:bg-green-900 rounded-lg transition-colors">
              <Lock className="w-5 h-5 text-primary-green dark:text-green-300" />
            </div>
            <h3 className="text-lg font-semibold text-on-surface dark:text-foreground">Data Privacy & Security</h3>
          </div>
          <p className="text-muted-foreground dark:text-muted-foreground mb-4">
            Robust data protection measures to safeguard sensitive information and maintain privacy.
          </p>
          <ul className="space-y-3">
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 mt-1 mr-2 flex-shrink-0" />
              <div>
                <span className="font-medium text-on-surface dark:text-on-surface-variant">End-to-End Encryption</span>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">Secures data in transit and at rest</p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 mt-1 mr-2 flex-shrink-0" />
              <div>
                <span className="font-medium text-on-surface dark:text-on-surface-variant">Data Minimization</span>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">Collects only necessary information for specific purposes</p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 mt-1 mr-2 flex-shrink-0" />
              <div>
                <span className="font-medium text-on-surface dark:text-on-surface-variant">Access Controls</span>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">Restricts data access based on roles and permissions</p>
              </div>
            </li>
          </ul>
        </div>
        
        <div className="bg-surface-container-low dark:bg-surface-container-high rounded-xl p-6 border border-border dark:border-border transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 dark:bg-green-900 rounded-lg transition-colors">
              <FileText className="w-5 h-5 text-primary-green dark:text-green-300" />
            </div>
            <h3 className="text-lg font-semibold text-on-surface dark:text-foreground">Compliance & Standards</h3>
          </div>
          <p className="text-muted-foreground dark:text-muted-foreground mb-4">
            Adherence to industry regulations and standards to ensure legal and ethical AI deployment.
          </p>
          <ul className="space-y-3">
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 mt-1 mr-2 flex-shrink-0" />
              <div>
                <span className="font-medium text-on-surface dark:text-on-surface-variant">Regulatory Compliance</span>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">GDPR, CCPA, and industry-specific regulations</p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 mt-1 mr-2 flex-shrink-0" />
              <div>
                <span className="font-medium text-on-surface dark:text-on-surface-variant">Ethical AI Standards</span>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">Alignment with established AI ethics frameworks</p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 mt-1 mr-2 flex-shrink-0" />
              <div>
                <span className="font-medium text-on-surface dark:text-on-surface-variant">Documentation & Reporting</span>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">Comprehensive records for audit and compliance</p>
              </div>
            </li>
          </ul>
        </div>
        
        <div className="bg-surface-container-low dark:bg-surface-container-high rounded-xl p-6 border border-border dark:border-border transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 dark:bg-green-900 rounded-lg transition-colors">
              <AlertTriangle className="w-5 h-5 text-primary-green dark:text-green-300" />
            </div>
            <h3 className="text-lg font-semibold text-on-surface dark:text-foreground">Risk Management</h3>
          </div>
          <p className="text-muted-foreground dark:text-muted-foreground mb-4">
            Proactive identification and mitigation of risks associated with AI deployment and operation.
          </p>
          <ul className="space-y-3">
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 mt-1 mr-2 flex-shrink-0" />
              <div>
                <span className="font-medium text-on-surface dark:text-on-surface-variant">Risk Assessment</span>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">Systematic evaluation of potential AI risks</p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 mt-1 mr-2 flex-shrink-0" />
              <div>
                <span className="font-medium text-on-surface dark:text-on-surface-variant">Mitigation Strategies</span>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">Predefined approaches to address identified risks</p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 mt-1 mr-2 flex-shrink-0" />
              <div>
                <span className="font-medium text-on-surface dark:text-on-surface-variant">Incident Response</span>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">Protocols for addressing AI-related incidents</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="bg-indigo-50 dark:bg-green-900 rounded-xl p-6 border border-indigo-100 dark:border-green-800 transition-colors">
        <h3 className="text-lg font-semibold text-on-surface dark:text-foreground mb-4">Data Wallet Integration</h3>
        <p className="text-muted-foreground dark:text-muted-foreground mb-4">
          Sendplex's Data Wallet serves as a secure vault for both company and user data, providing transparency and control over information usage.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-surface-container-highest rounded-lg p-4 border border-border dark:border-border transition-colors">
            <h4 className="font-medium text-on-surface dark:text-foreground mb-2">For Organizations</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="p-1 bg-indigo-100 dark:bg-green-800 rounded-full mt-0.5 mr-2 transition-colors">
                  <div className="w-1.5 h-1.5 bg-primary dark:bg-green-300 rounded-full"></div>
                </div>
                <span className="text-sm text-muted-foreground dark:text-muted-foreground">Centralized data governance</span>
              </li>
              <li className="flex items-start">
                <div className="p-1 bg-indigo-100 dark:bg-green-800 rounded-full mt-0.5 mr-2 transition-colors">
                  <div className="w-1.5 h-1.5 bg-primary dark:bg-green-300 rounded-full"></div>
                </div>
                <span className="text-sm text-muted-foreground dark:text-muted-foreground">Audit trails for data access</span>
              </li>
              <li className="flex items-start">
                <div className="p-1 bg-indigo-100 dark:bg-green-800 rounded-full mt-0.5 mr-2 transition-colors">
                  <div className="w-1.5 h-1.5 bg-primary dark:bg-green-300 rounded-full"></div>
                </div>
                <span className="text-sm text-muted-foreground dark:text-muted-foreground">Compliance documentation</span>
              </li>
            </ul>
          </div>
          <div className="bg-white dark:bg-surface-container-highest rounded-lg p-4 border border-border dark:border-border transition-colors">
            <h4 className="font-medium text-on-surface dark:text-foreground mb-2">For Users</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="p-1 bg-indigo-100 dark:bg-green-800 rounded-full mt-0.5 mr-2 transition-colors">
                  <div className="w-1.5 h-1.5 bg-primary dark:bg-green-300 rounded-full"></div>
                </div>
                <span className="text-sm text-muted-foreground dark:text-muted-foreground">Transparency into data usage</span>
              </li>
              <li className="flex items-start">
                <div className="p-1 bg-indigo-100 dark:bg-green-800 rounded-full mt-0.5 mr-2 transition-colors">
                  <div className="w-1.5 h-1.5 bg-primary dark:bg-green-300 rounded-full"></div>
                </div>
                <span className="text-sm text-muted-foreground dark:text-muted-foreground">Control over personal information</span>
              </li>
              <li className="flex items-start">
                <div className="p-1 bg-indigo-100 dark:bg-green-800 rounded-full mt-0.5 mr-2 transition-colors">
                  <div className="w-1.5 h-1.5 bg-primary dark:bg-green-300 rounded-full"></div>
                </div>
                <span className="text-sm text-muted-foreground dark:text-muted-foreground">Data access and portability</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <SectionNavigation onNext={onNext} />
    </div>
  );
};

export default TrustFramework;
