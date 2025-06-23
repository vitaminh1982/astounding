import React, { useState } from 'react';
import { Info, HelpCircle } from 'lucide-react';

interface CreditConsumptionBarProps {
  directCredits: {
    used: number;
    total: number;
  };
  backgroundCredits: {
    used: number;
    total: number;
  };
  className?: string;
}

const CreditConsumptionBar: React.FC<CreditConsumptionBarProps> = ({
  directCredits,
  backgroundCredits,
  className = ''
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Calculate percentages for progress bars
  const directPercentage = Math.min(100, (directCredits.used / directCredits.total) * 100);
  const backgroundPercentage = Math.min(100, (backgroundCredits.used / backgroundCredits.total) * 100);
  
  // Determine color based on usage percentage
  const getColorClass = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className={`flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border ${className}`}>
      {/* Direct Conversations Credits */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3">
        <div className="text-sm text-gray-700 whitespace-nowrap font-medium">
          {directCredits.used.toLocaleString()}/{directCredits.total.toLocaleString()} credits

      

      
      {/* Info Button */}
      <div className="relative">
        <button
          className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={() => setShowTooltip(!showTooltip)}
          aria-label="Credit information"
        >
          <Info className="w-4 h-4" />
        </button>
        
        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg p-4 z-50 text-xs border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-2">Credit Usage Information</h4>
            <div className="space-y-2">
              <div>
                <p className="font-medium text-gray-700">Active Direct Conversations</p>
                <p className="text-gray-600">Credits used for real-time chat interactions with customers.</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Background Processing</p>
                <p className="text-gray-600">Credits used for automated tasks, data processing, and scheduled operations.</p>
              </div>
              <div className="pt-2 border-t border-gray-200 mt-2">
                <p className="text-gray-500">Credits refresh on the 1st of each month. Unused credits do not roll over.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreditConsumptionBar;