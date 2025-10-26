import React from 'react';
import { 
  Brain, 
  Users, 
  Lightbulb, 
  Heart, 
  Scale, 
  Workflow, 
  Zap, 
  Database, 
  BarChart2, 
  Clock, 
  CheckSquare, 
  Shield, 
  RefreshCw, 
  Share2, 
  AlertCircle, 
  Sparkles
} from 'lucide-react';

/**
 * Human-AI Collaboration Framework Component
 * 
 * A visual representation of how humans and AI systems collaborate within the Sendplex platform,
 * highlighting the complementary strengths of each and the areas where they work together.
 */
const HumanAICollaborationFramework: React.FC = () => {
  // Human strengths data
  const humanStrengths = [
    { id: 'h1', label: 'Critical Thinking', icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'h2', label: 'Emotional Intelligence', icon: <Heart className="w-4 h-4" /> },
    { id: 'h3', label: 'Ethical Decision-Making', icon: <Scale className="w-4 h-4" /> },
    { id: 'h4', label: 'Creative Problem-Solving', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'h5', label: 'Context Understanding', icon: <Users className="w-4 h-4" /> },
    { id: 'h6', label: 'Strategic Oversight', icon: <AlertCircle className="w-4 h-4" /> }
  ];

  // AI capabilities data
  const aiCapabilities = [
    { id: 'a1', label: 'Data Processing', icon: <Database className="w-4 h-4" /> },
    { id: 'a2', label: 'Pattern Recognition', icon: <Brain className="w-4 h-4" /> },
    { id: 'a3', label: 'Rapid Calculations', icon: <Zap className="w-4 h-4" /> },
    { id: 'a4', label: 'Consistency', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'a5', label: 'Scalability', icon: <BarChart2 className="w-4 h-4" /> },
    { id: 'a6', label: '24/7 Operation', icon: <Clock className="w-4 h-4" /> }
  ];

  // Collaboration zones data
  const collaborationZones = [
    { id: 'c1', label: 'Decision Support', icon: <Scale className="w-4 h-4" /> },
    { id: 'c2', label: 'Augmented Intelligence', icon: <Brain className="w-4 h-4" /> },
    { id: 'c3', label: 'Knowledge Sharing', icon: <Share2 className="w-4 h-4" /> },
    { id: 'c4', label: 'Quality Control', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'c5', label: 'Risk Management', icon: <Shield className="w-4 h-4" /> },
    { id: 'c6', label: 'Innovation Acceleration', icon: <Workflow className="w-4 h-4" /> }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm dark:shadow-gray-900 border border-gray-200 dark:border-gray-700 transition-colors" aria-label="Human-AI Collaboration Framework diagram showing how humans and AI systems work together, with human strengths on the left, AI capabilities on the right, and collaboration zones in the center">
      {/* Main container with responsive design */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Human Strengths Column */}
        <div className="w-full md:w-1/3 bg-blue-50 dark:bg-blue-900 rounded-lg p-4 border border-blue-100 dark:border-blue-800 transition-colors">
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-800 mb-2 transition-colors">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">Human Strengths</h3>
          </div>
          
          <div className="space-y-3">
            {humanStrengths.map(strength => (
              <div key={strength.id} className="flex items-center bg-white dark:bg-gray-700 p-2 rounded-lg shadow-sm dark:shadow-gray-800 border border-gray-100 dark:border-gray-600 transition-colors">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-800 rounded-full mr-2 transition-colors">
                  {React.cloneElement(strength.icon, { className: "text-blue-600 dark:text-blue-300" })}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{strength.label}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Center Collaboration Zone */}
        <div className="w-full md:w-1/3 relative">
          {/* Connecting circles with gradient background */}
          <div className="relative">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-gradient-to-r from-blue-200 to-indigo-200 dark:from-teal-800 dark:to-teal-700 opacity-20 dark:opacity-30"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-gradient-to-r from-blue-300 to-indigo-300 dark:from-teal-700 dark:to-teal-600 opacity-20 dark:opacity-30"></div>
            
            {/* Central icon */}
            <div className="relative flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-teal-600 dark:to-teal-500 flex items-center justify-center shadow-lg dark:shadow-gray-900 mb-3 transition-all">
                <RefreshCw className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 text-center mb-4">Collaboration Zones</h3>
              
              {/* Bidirectional arrows */}
              <div className="hidden md:block absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-full">
                <div className="flex items-center">
                  <div className="w-8 h-0.5 bg-blue-400 dark:bg-teal-400"></div>
                  <div className="w-0 h-0 border-t-4 border-b-4 border-r-8 border-t-transparent border-b-transparent border-r-blue-400 dark:border-r-teal-400"></div>
                </div>
              </div>
              <div className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-full">
                <div className="flex items-center">
                  <div className="w-0 h-0 border-t-4 border-b-4 border-l-8 border-t-transparent border-b-transparent border-l-indigo-400 dark:border-l-teal-400"></div>
                  <div className="w-8 h-0.5 bg-indigo-400 dark:bg-teal-400"></div>
                </div>
              </div>
            </div>
            
            {/* Collaboration zones in a grid */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              {collaborationZones.map(zone => (
                <div key={zone.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-teal-900 dark:to-teal-800 p-2 rounded-lg shadow-sm dark:shadow-gray-800 border border-blue-100 dark:border-teal-700 transition-colors">
                  <div className="flex items-center">
                    <div className="p-1.5 bg-white dark:bg-gray-700 rounded-full mr-2 shadow-sm dark:shadow-gray-800 border border-gray-100 dark:border-gray-600 transition-colors">
                      {React.cloneElement(zone.icon, { className: "text-indigo-600 dark:text-teal-300 w-3.5 h-3.5" })}
                    </div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-200">{zone.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* AI Capabilities Column */}
        <div className="w-full md:w-1/3 bg-indigo-50 dark:bg-teal-900 rounded-lg p-4 border border-indigo-100 dark:border-teal-800 transition-colors">
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 dark:bg-teal-800 mb-2 transition-colors">
              <Brain className="w-6 h-6 text-indigo-600 dark:text-teal-300" />
            </div>
            <h3 className="text-lg font-semibold text-indigo-800 dark:text-teal-200">AI Capabilities</h3>
          </div>
          
          <div className="space-y-3">
            {aiCapabilities.map(capability => (
              <div key={capability.id} className="flex items-center bg-white dark:bg-gray-700 p-2 rounded-lg shadow-sm dark:shadow-gray-800 border border-gray-100 dark:border-gray-600 transition-colors">
                <div className="p-1.5 bg-indigo-100 dark:bg-teal-800 rounded-full mr-2 transition-colors">
                  {React.cloneElement(capability.icon, { className: "text-indigo-600 dark:text-teal-300" })}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{capability.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom description */}
      <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400 transition-colors">
        <p>The Human-AI Collaboration Framework enables organizations to create AI systems that complement human capabilities rather than replace them, resulting in more effective, ethical, and sustainable outcomes.</p>
      </div>
    </div>
  );
};

export default HumanAICollaborationFramework;
