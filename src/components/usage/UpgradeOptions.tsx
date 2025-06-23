import React, { useState } from 'react';
import { Zap, Check, ArrowRight, Clock, Plus, Minus } from 'lucide-react';

interface Plan {
  name: string;
  description: string;
  price: string;
  conversations: number;
  features: string[];
  isRecommended?: boolean;
  isAvailable: boolean;
  additionalCost?: {
    price: number;
    conversations: number;
  };
}

export default function UpgradeOptions() {
  const [additionalPacks, setAdditionalPacks] = useState(0);
  
  const incrementPacks = () => {
    setAdditionalPacks(prev => prev + 1);
  };
  
  const decrementPacks = () => {
    if (additionalPacks > 0) {
      setAdditionalPacks(prev => prev - 1);
    }
  };
  
  const calculateStarterTotal = () => {
    return 49 + (additionalPacks * 15);
  };
  
  const calculateTotalConversations = (base: number, pack: number) => {
    return base + (additionalPacks * pack);
  };
  
  const plans: Plan[] = [
    {
      name: 'Starter',
      description: 'Collaborate across 10 users at one time',
      price: '49€',
      conversations: 5000,
      isAvailable: true,
      isRecommended: true,
      additionalCost: {
        price: 15,
        conversations: 4000
      },
      features: [
        '5,000 Conversations Per Month Using Multiple LLMs',
        'Chat with 10 Documents',
        'Deploy 10 Pre-Built Agents',
        'Integrate 10 Custom Tools',
        'Limited Automated Workflows',
        'Shared Prompt Libraries'
      ]
    },
    {
      name: 'Professional',
      description: 'Collaborate across 50 users at one time',
      price: '316€',
      conversations: 20000,
      isAvailable: false,
      features: [
        '20,000 Conversations Per Month Using Multiple LLMs',
        'Chat with 25 Documents',
        'Deploy 25 Pre-Built Agents',
        'Integrate 25 Custom Tools',
        'Up to 10 Automated Workflows',
        'Shared Prompt Libraries'
      ]
    },
    {
      name: 'Enterprise Solutions',
      description: 'Collaborate across 1000 users at one time',
      price: '849€',
      conversations: 200000,
      isAvailable: false,
      features: [
        '200,000 Conversations Per Month Using Multiple LLMs',
        '10 Workspaces (Up to 1000 Team Members)',
        'Unlimited Documents and Resource Library',
        'Unlimited Pre-Built Agents',
        'Unlimited Custom Tools',
        'Unlimited Automated Workflows',
        'Limited Autonomous Agentic AI',
        'Priority Support Calls',
        'SAML SSO',
        'Advanced permissions and security controls'
      ]
    }
  ];
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Upgrade Options</h3>
        <div className="p-2 bg-blue-100 rounded-lg">
          <Zap className="w-5 h-5 text-blue-600" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <div 
            key={index} 
            className={`border rounded-xl p-4 relative ${
              plan.isRecommended 
                ? 'border-blue-500' 
                : 'border-gray-200'
            } ${!plan.isAvailable ? 'opacity-80' : ''}`}
          >
            {plan.isRecommended && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                  Most Popular
                </span>
              </div>
            )}
            
            <h4 className="font-semibold text-lg mb-1 text-gray-900">{plan.name}</h4>
            <p className="text-sm text-gray-600 mb-3">{plan.description}</p>
            
            <div className="flex items-end mb-5">
              {plan.name === 'Starter' && additionalPacks > 0 ? (
                <span className="text-3xl font-bold text-gray-900">{calculateStarterTotal()}€</span>
              ) : (
                <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
              )}
              <span className="text-gray-500 ml-2 text-sm">per month</span>
            </div>
            
            <button 
              disabled={!plan.isAvailable}
              className={`w-full py-2.5 rounded-lg flex items-center justify-center mb-5 ${
                plan.isAvailable
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              }`}
            >
              {plan.isAvailable ? (
                <>
                  Upgrade
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4 mr-2" />
                  Coming Soon
                </>
              )}
            </button>
            
            <div className="text-sm text-gray-600 mb-3">
              {plan.name === 'Starter' && additionalPacks > 0 ? (
                <p>{calculateTotalConversations(plan.conversations, plan.additionalCost!.conversations).toLocaleString()} conversations per month</p>
              ) : (
                <p>{plan.conversations.toLocaleString()} conversations per month</p>
              )}
            </div>
            
            {plan.name === 'Starter' && plan.additionalCost && (
              <div className="mb-5">
                <div className="flex justify-between text-sm mb-2">
                  <p className="text-gray-700">Additional Credits</p>
                  <p className="text-gray-700">
                    {plan.additionalCost.price}€ per {plan.additionalCost.conversations.toLocaleString()} conversations
                  </p>
                </div>
                
                <div className="flex items-center">
                  <button 
                    onClick={decrementPacks}
                    className="bg-gray-200 hover:bg-gray-300 rounded-l-lg p-2"
                  >
                    <Minus className="w-5 h-5 text-gray-700" />
                  </button>
                  
                  <input 
                    type="text" 
                    value={additionalPacks}
                    readOnly
                    className="bg-gray-100 border-y border-gray-300 w-full text-center py-2"
                  />
                  
                  <button 
                    onClick={incrementPacks}
                    className="bg-gray-200 hover:bg-gray-300 rounded-r-lg p-2"
                  >
                    <Plus className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
                
                {additionalPacks > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-600">
                      Base price: 49€ + {additionalPacks} × 15€
                    </p>
                  </div>
                )}
              </div>
            )}
            
            <div className="space-y-2">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-start">
                  <Check className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-500 text-center">
          Need a custom plan? <a href="#" className="text-blue-600 hover:text-blue-800">Contact our sales team</a>
        </p>
      </div>
    </div>
  );
}
