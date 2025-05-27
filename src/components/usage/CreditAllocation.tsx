import React from 'react';
import { PieChart, DollarSign } from 'lucide-react';
import { UsageMetrics } from '../../types/usage';

interface CreditAllocationProps {
  usageData: UsageMetrics;
}

export default function CreditAllocation({ usageData }: CreditAllocationProps) {
  const { creditAllocation } = usageData;
  
  // Generate colors for the pie chart segments
  const colors = [
    'bg-indigo-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-purple-500'
  ];
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Credit Allocation</h3>
        <div className="p-2 bg-indigo-100 rounded-lg">
          <DollarSign className="w-5 h-5 text-indigo-600" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex justify-center items-center">
          <div className="relative w-48 h-48">
            {/* Simplified pie chart visualization */}
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {creditAllocation.map((item, index) => {
                // Calculate the start and end angles for the pie slice
                const startAngle = creditAllocation
                  .slice(0, index)
                  .reduce((sum, curr) => sum + curr.percentage, 0) * 3.6; // 3.6 = 360/100
                const endAngle = startAngle + item.percentage * 3.6;
                
                // Convert angles to radians
                const startRad = (startAngle - 90) * Math.PI / 180;
                const endRad = (endAngle - 90) * Math.PI / 180;
                
                // Calculate the SVG arc path
                const x1 = 50 + 40 * Math.cos(startRad);
                const y1 = 50 + 40 * Math.sin(startRad);
                const x2 = 50 + 40 * Math.cos(endRad);
                const y2 = 50 + 40 * Math.sin(endRad);
                
                // Determine if the arc should be drawn as a large arc
                const largeArcFlag = item.percentage > 50 ? 1 : 0;
                
                // Create the SVG path
                const path = `
                  M 50 50
                  L ${x1} ${y1}
                  A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}
                  Z
                `;
                
                return (
                  <path
                    key={index}
                    d={path}
                    fill={colors[index % colors.length].replace('bg-', 'fill-')}
                    stroke="#fff"
                    strokeWidth="1"
                  />
                );
              })}
              <circle cx="50" cy="50" r="25" fill="white" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-xs text-gray-500">Total</p>
                <p className="text-xl font-bold">{usageData.credits.used.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4">Breakdown</h4>
          <div className="space-y-4">
            {creditAllocation.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-4 h-4 rounded-sm ${colors[index % colors.length]} mr-3`}></div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">{item.category}</p>
                    <p className="text-sm text-gray-500">{item.percentage}%</p>
                  </div>
                  <div className="text-sm text-gray-500">{item.amount.toLocaleString()} credits</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-4">Cost Efficiency</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">Cost per Conversation</p>
            <p className="text-lg font-medium">
              {(usageData.credits.used / usageData.conversations.total).toFixed(2)} credits
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">Cost per Message</p>
            <p className="text-lg font-medium">
              {(usageData.credits.used / usageData.messages.used).toFixed(2)} credits
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}