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
      name: 'Free',
      description: 'Get started for free, best for personal use',
      price: '0€',
      conversations: 1000,
      isAvailable: true,
      features: [
        '1,000 Conversations Per Month',
        'Chat with 3 Documents',
        'Deploy 2 Pre-Built Agents',
        'Integrate 1 Custom Tool'
      ]
    },
    {
      name: 'Pro',
      description: 'Collaborate with your team members',
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
        'Automated Workflows',
        'Shared Prompt Libraries'
      ]
    },
    {
      name: 'Enterprise',
      description: 'For organizations needing security and scale',
      price: 'Custom',
      conversations: 200000,
      isAvailable: true,
      features: [
        'Unlimited Conversations Per Month',
        'Unlimited Documents and Resource Library',
        'Unlimited Pre-Built Agents',
        'Unlimited Custom Tools',
        'Unlimited Automated Workflows',
        'Priority Support Calls',
        'SAML SSO & Advanced Permissions',
        'Advanced permissions and security controls'
      ]
    }
  ];
  
  return (
    <div className="bg-white dark:bg-surface-container-high rounded-lg shadow-sm dark:shadow-gray-900 border border-border dark:border-border p-6 transition-colors">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-foreground dark:text-foreground">Upgrade Options</h3>
        <div className="p-2 bg-blue-100 dark:bg-green-900 rounded-lg transition-colors">
          <Zap className="w-5 h-5 text-tertiary dark:text-green-300" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <div 
            key={index} 
            className={`border rounded-xl p-4 relative bg-white dark:bg-surface-container-highest transition-colors ${
              plan.isRecommended 
                ? 'border-tertiary dark:border-green-500' 
                : 'border-border dark:border-border'
            } ${!plan.isAvailable ? 'opacity-80' : ''}`}
          >
            {plan.isRecommended && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-tertiary dark:bg-green-600 text-white text-xs px-3 py-1 rounded-full font-medium transition-colors">
                  Most Popular
                </span>
              </div>
            )}
            
            <h4 className="font-semibold text-lg mb-1 text-foreground dark:text-foreground">{plan.name}</h4>
            <p className="text-sm text-muted-foreground dark:text-muted-foreground mb-3">{plan.description}</p>
            
            <div className="flex items-end mb-5">
              {plan.name === 'Pro' && additionalPacks > 0 ? (
                <span className="text-3xl font-bold text-foreground dark:text-foreground">{calculateStarterTotal()}€</span>
              ) : (
                <span className="text-3xl font-bold text-foreground dark:text-foreground">{plan.price}</span>
              )}
              <span className="text-muted-foreground dark:text-muted-foreground ml-2 text-sm">per month</span>
            </div>
            
            <button 
              disabled={!plan.isAvailable}
              className={`w-full py-2.5 rounded-lg flex items-center justify-center mb-5 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-700 ${
                plan.isAvailable
                  ? 'bg-tertiary dark:bg-green-600 text-white hover:bg-blue-700 dark:hover:bg-green-700 focus:ring-blue-500 dark:focus:ring-ring' 
                  : 'bg-surface-container dark:bg-surface-container-highest text-muted-foreground dark:text-muted-foreground cursor-not-allowed'
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
            
            <div className="text-sm text-muted-foreground dark:text-muted-foreground mb-3">
              {plan.name === 'Pro' && additionalPacks > 0 ? (
                <p>{calculateTotalConversations(plan.conversations, plan.additionalCost!.conversations).toLocaleString()} conversations per month</p>
              ) : (
                <p>{plan.conversations.toLocaleString()} conversations per month</p>
              )}
            </div>
            
            {plan.name === 'Pro' && plan.additionalCost && (
              <div className="mb-5">
                <div className="flex justify-between text-sm mb-2">
                  <p className="text-on-surface dark:text-on-surface-variant">Additional Credits</p>
                  <p className="text-on-surface dark:text-on-surface-variant">
                    {plan.additionalCost.price}€ per {plan.additionalCost.conversations.toLocaleString()} conversations
                  </p>
                </div>
                
                <div className="flex items-center">
                  <button 
                    onClick={decrementPacks}
                    className="bg-surface-container dark:bg-surface-container-highest hover:bg-surface-container dark:hover:bg-outline rounded-l-lg p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-ring focus:ring-offset-2 dark:focus:ring-offset-gray-700"
                  >
                    <Minus className="w-5 h-5 text-on-surface dark:text-on-surface-variant" />
                  </button>
                  
                  <input 
                    type="text" 
                    value={additionalPacks}
                    readOnly
                    className="bg-surface-container-low dark:bg-surface-container-highest border-y border-border dark:border-outline text-foreground dark:text-foreground w-full text-center py-2 transition-colors"
                  />
                  
                  <button 
                    onClick={incrementPacks}
                    className="bg-surface-container dark:bg-surface-container-highest hover:bg-surface-container dark:hover:bg-outline rounded-r-lg p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-ring focus:ring-offset-2 dark:focus:ring-offset-gray-700"
                  >
                    <Plus className="w-5 h-5 text-on-surface dark:text-on-surface-variant" />
                  </button>
                </div>
                
                {additionalPacks > 0 && (
                  <div className="mt-2 pt-2 border-t border-border dark:border-border">
                    <p className="text-xs text-muted-foreground dark:text-muted-foreground">
                      Base price: 49€ + {additionalPacks} × 15€
                    </p>
                  </div>
                )}
              </div>
            )}
            
            <div className="space-y-2">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-start">
                  <Check className="w-4 h-4 text-green-500 dark:text-green-400 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground dark:text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-6 border-t border-border dark:border-border">
        <p className="text-sm text-muted-foreground dark:text-muted-foreground text-center">
          Need a custom plan? <a href="#" className="text-tertiary dark:text-green-400 hover:text-blue-800 dark:hover:text-green-300 transition-colors">Contact our sales team</a>
        </p>
      </div>
    </div>
  );
}
