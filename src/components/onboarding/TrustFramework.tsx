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
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Trust & Responsibility Framework</h2>
        <p className="text-gray-600">
          Sendplex's Trust & Responsibility Framework ensures that AI systems operate reliably, securely, and ethically 
          within your organization, building confidence among users, customers, and stakeholders.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Shield className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">AI Safety Measures</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Comprehensive safety protocols to prevent misuse and ensure responsible AI operation.
          </p>
          <ul className="space-y-3">
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-700">Content Filtering</span>
                <p className="text-sm text-gray-500">Prevents harmful or inappropriate content generation</p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-700">Operational Boundaries</span>
                <p className="text-sm text-gray-500">Defines clear limits on AI agent capabilities</p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-700">Human Oversight</span>
                <p className="text-sm text-gray-500">Maintains appropriate human supervision of AI systems</p>
              </div>
            </li>
          </ul>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Lock className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Data Privacy & Security</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Robust data protection measures to safeguard sensitive information and maintain privacy.
          </p>
          <ul className="space-y-3">
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-700">End-to-End Encryption</span>
                <p className="text-sm text-gray-500">Secures data in transit and at rest</p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-700">Data Minimization</span>
                <p className="text-sm text-gray-500">Collects only necessary information for specific purposes</p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-700">Access Controls</span>
                <p className="text-sm text-gray-500">Restricts data access based on roles and permissions</p>
              </div>
            </li>
          </ul>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <FileText className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Compliance & Standards</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Adherence to industry regulations and standards to ensure legal and ethical AI deployment.
          </p>
          <ul className="space-y-3">
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-700">Regulatory Compliance</span>
                <p className="text-sm text-gray-500">GDPR, CCPA, and industry-specific regulations</p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-700">Ethical AI Standards</span>
                <p className="text-sm text-gray-500">Alignment with established AI ethics frameworks</p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-700">Documentation & Reporting</span>
                <p className="text-sm text-gray-500">Comprehensive records for audit and compliance</p>
              </div>
            </li>
          </ul>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Risk Management</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Proactive identification and mitigation of risks associated with AI deployment and operation.
          </p>
          <ul className="space-y-3">
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-700">Risk Assessment</span>
                <p className="text-sm text-gray-500">Systematic evaluation of potential AI risks</p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-700">Mitigation Strategies</span>
                <p className="text-sm text-gray-500">Predefined approaches to address identified risks</p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-700">Incident Response</span>
                <p className="text-sm text-gray-500">Protocols for addressing AI-related incidents</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="bg-indigo-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Wallet Integration</h3>
        <p className="text-gray-600 mb-4">
          Sendplex's Data Wallet serves as a secure vault for both company and user data, providing transparency and control over information usage.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">For Organizations</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="p-1 bg-indigo-100 rounded-full mt-0.5 mr-2">
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-600">Centralized data governance</span>
              </li>
              <li className="flex items-start">
                <div className="p-1 bg-indigo-100 rounded-full mt-0.5 mr-2">
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-600">Audit trails for data access</span>
              </li>
              <li className="flex items-start">
                <div className="p-1 bg-indigo-100 rounded-full mt-0.5 mr-2">
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-600">Compliance documentation</span>
              </li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">For Users</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="p-1 bg-indigo-100 rounded-full mt-0.5 mr-2">
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-600">Transparency into data usage</span>
              </li>
              <li className="flex items-start">
                <div className="p-1 bg-indigo-100 rounded-full mt-0.5 mr-2">
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-600">Control over personal information</span>
              </li>
              <li className="flex items-start">
                <div className="p-1 bg-indigo-100 rounded-full mt-0.5 mr-2">
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-600">Data access and portability</span>
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