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
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Trust & Responsibility Framework</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Sendplex's Trust & Responsibility Framework ensures that AI systems operate reliably, securely, and ethically 
          within your organization, building confidence among users, customers, and stakeholders.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 dark:bg-teal-900 rounded-lg transition-colors">
              <Shield className="w-5 h-5 text-indigo-600 dark:text-teal-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">AI Safety Measures</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Comprehensive safety protocols to prevent misuse and ensure responsible AI operation.
          </p>
          <ul className="space-y-3">
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 mt-1 mr-2 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-200">Content Filtering</span>
                <p className="text-sm text-gray-500 dark:text-gray-400">Prevents harmful or inappropriate content generation</p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 mt-1 mr-2 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-200">Operational Boundaries</span>
                <p className="text-sm text-gray-500 dark:text-gray-400">Defines clear limits on AI agent capabilities</p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 mt-1 mr-2 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-200">Human Oversight</span>
                <p className="text-sm text-gray-500 dark:text-gray-400">Maintains appropriate human supervision of AI systems</p>
              </div>
            </li>
          </ul>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 dark:bg-teal-900 rounded-lg transition-colors">
              <Lock className="w-5 h-5 text-indigo-600 dark:text-teal-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Data Privacy & Security</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Robust data protection measures to safeguard sensitive information and maintain privacy.
          </p>
          <ul className="space-y-3">
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 mt-1 mr-2 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-200">End-to-End Encryption</span>
                <p className="text-sm text-gray-500 dark:text-gray-400">Secures data in transit and at rest</p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 mt-1 mr-2 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-200">Data Minimization</span>
                <p className="text-sm text-gray-500 dark:text-gray-400">Collects only necessary information for specific purposes</p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 mt-1 mr-2 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-200">Access Controls</span>
                <p className="text-sm text-gray-500 dark:text-gray-400">Restricts data access based on roles and permissions</p>
              </div>
            </li>
          </ul>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 dark:bg-teal-900 rounded-lg transition-colors">
              <FileText className="w-5 h-5 text-indigo-600 dark:text-teal-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Compliance & Standards</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Adherence to industry regulations and standards to ensure legal and ethical AI deployment.
          </p>
          <ul className="space-y-3">
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 mt-1 mr-2 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-200">Regulatory Compliance</span>
                <p className="text-sm text-gray-500 dark:text-gray-400">GDPR, CCPA, and industry-specific regulations</p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 mt-1 mr-2 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-200">Ethical AI Standards</span>
                <p className="text-sm text-gray-500 dark:text-gray-400">Alignment with established AI ethics frameworks</p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 mt-1 mr-2 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-200">Documentation & Reporting</span>
                <p className="text-sm text-gray-500 dark:text-gray-400">Comprehensive records for audit and compliance</p>
              </div>
            </li>
          </ul>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 dark:bg-teal-900 rounded-lg transition-colors">
              <AlertTriangle className="w-5 h-5 text-indigo-600 dark:text-teal-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Risk Management</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Proactive identification and mitigation of risks associated with AI deployment and operation.
          </p>
          <ul className="space-y-3">
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 mt-1 mr-2 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-200">Risk Assessment</span>
                <p className="text-sm text-gray-500 dark:text-gray-400">Systematic evaluation of potential AI risks</p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 mt-1 mr-2 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-200">Mitigation Strategies</span>
                <p className="text-sm text-gray-500 dark:text-gray-400">Predefined approaches to address identified risks</p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 mt-1 mr-2 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-200">Incident Response</span>
                <p className="text-sm text-gray-500 dark:text-gray-400">Protocols for addressing AI-related incidents</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="bg-indigo-50 dark:bg-teal-900 rounded-xl p-6 border border-indigo-100 dark:border-teal-800 transition-colors">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Data Wallet Integration</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Sendplex's Data Wallet serves as a secure vault for both company and user data, providing transparency and control over information usage.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 transition-colors">
            <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-2">For Organizations</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="p-1 bg-indigo-100 dark:bg-teal-800 rounded-full mt-0.5 mr-2 transition-colors">
                  <div className="w-1.5 h-1.5 bg-indigo-600 dark:bg-teal-300 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Centralized data governance</span>
              </li>
              <li className="flex items-start">
                <div className="p-1 bg-indigo-100 dark:bg-teal-800 rounded-full mt-0.5 mr-2 transition-colors">
                  <div className="w-1.5 h-1.5 bg-indigo-600 dark:bg-teal-300 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Audit trails for data access</span>
              </li>
              <li className="flex items-start">
                <div className="p-1 bg-indigo-100 dark:bg-teal-800 rounded-full mt-0.5 mr-2 transition-colors">
                  <div className="w-1.5 h-1.5 bg-indigo-600 dark:bg-teal-300 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Compliance documentation</span>
              </li>
            </ul>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 transition-colors">
            <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-2">For Users</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="p-1 bg-indigo-100 dark:bg-teal-800 rounded-full mt-0.5 mr-2 transition-colors">
                  <div className="w-1.5 h-1.5 bg-indigo-600 dark:bg-teal-300 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Transparency into data usage</span>
              </li>
              <li className="flex items-start">
                <div className="p-1 bg-indigo-100 dark:bg-teal-800 rounded-full mt-0.5 mr-2 transition-colors">
                  <div className="w-1.5 h-1.5 bg-indigo-600 dark:bg-teal-300 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Control over personal information</span>
              </li>
              <li className="flex items-start">
                <div className="p-1 bg-indigo-100 dark:bg-teal-800 rounded-full mt-0.5 mr-2 transition-colors">
                  <div className="w-1.5 h-1.5 bg-indigo-600 dark:bg-teal-300 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Data access and portability</span>
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
