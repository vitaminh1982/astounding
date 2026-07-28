import React from 'react';
import { PieChart, DollarSign } from 'lucide-react';
import { UsageMetrics } from '../../types/usage';

interface CreditAllocationProps {
  usageData: UsageMetrics;
}

export default function CreditAllocation({ usageData }: CreditAllocationProps) {
  const { creditAllocation } = usageData;
  
  // Generate colors for both light and dark modes
  const colors = [
    { light: '#6366f1', dark: '#14b8a6', bg: 'bg-primary dark:bg-primary' }, // indigo -> green
    { light: '#3b82f6', dark: '#06b6d4', bg: 'bg-tertiary dark:bg-green-500' },   // blue -> green
    { light: '#10b981', dark: '#10b981', bg: 'bg-green-500 dark:bg-green-500' }, // green stays green
    { light: '#f59e0b', dark: '#f59e0b', bg: 'bg-yellow-500 dark:bg-yellow-500' }, // yellow stays yellow
    { light: '#ef4444', dark: '#ef4444', bg: 'bg-destructive dark:bg-destructive' },     // red stays red
    { light: '#8b5cf6', dark: '#a855f7', bg: 'bg-tertiary dark:bg-tertiary' } // purple stays purple
  ];
  
  return (
    <div className="bg-white dark:bg-surface-container-high rounded-lg shadow-sm dark:shadow-gray-900 border border-border dark:border-border p-6 transition-colors">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-foreground dark:text-foreground">Credit Allocation</h3>
        <div className="p-2 bg-indigo-100 dark:bg-green-900 rounded-lg transition-colors">
          <DollarSign className="w-5 h-5 text-primary-green dark:text-green-300" />
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
                    fill={`var(--pie-color-${index})`}
                    stroke="var(--pie-stroke)"
                    strokeWidth="1"
                    className="transition-colors"
                    style={{
                      '--pie-color-0': colors[index % colors.length].light,
                      '--pie-stroke': '#ffffff'
                    } as React.CSSProperties & { [key: string]: string }}
                  />
                );
              })}
              ircle cx="50" cy="50" r="25" fill="var(--pie-center)" className="transition-colors" style={{'--pie-center': '#ffffff'} as React.CSSProperties & { [key: string]: string }}}} />
              {/* Dark mode colors via CSS custom properties */}
              <style jsx>{`
                @media (prefers-color-scheme: dark) {
                  path {
                    --pie-color-0: ${colors[0].dark} !important;
                    --pie-color-1: ${colors[1].dark} !important;
                    --pie-color-2: ${colors[2].dark} !important;
                    --pie-color-3: ${colors[3].dark} !important;
                    --pie-color-4: ${colors[4].dark} !important;
                    --pie-color-5: ${colors[5].dark} !important;
                    --pie-stroke: #374151 !important;
                  }
                  circle {
                    --pie-center: #374151 !important;
                  }
                }
                .dark path {
                  --pie-color-0: ${colors[0].dark} !important;
                  --pie-color-1: ${colors[1].dark} !important;
                  --pie-color-2: ${colors[2].dark} !important;
                  --pie-color-3: ${colors[3].dark} !important;
                  --pie-color-4: ${colors[4].dark} !important;
                  --pie-color-5: ${colors[5].dark} !important;
                  --pie-stroke: #374151 !important;
                }
                .dark circle {
                  --pie-center: #374151 !important;
                }
              `}</style>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-xs text-muted-foreground dark:text-muted-foreground">Total</p>
                <p className="text-xl font-bold text-foreground dark:text-foreground">{usageData.credits.used.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-on-surface dark:text-on-surface-variant mb-4">Breakdown</h4>
          <div className="space-y-4">
            {creditAllocation.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-4 h-4 rounded-sm ${colors[index % colors.length].bg} mr-3 transition-colors`}></div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-foreground dark:text-foreground">{item.category}</p>
                    <p className="text-sm text-muted-foreground dark:text-muted-foreground">{item.percentage}%</p>
                  </div>
                  <div className="text-sm text-muted-foreground dark:text-muted-foreground">{item.amount.toLocaleString()} credits</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-border dark:border-border">
        <h4 className="text-sm font-medium text-on-surface dark:text-on-surface-variant mb-4">Cost Efficiency</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-surface-container-low dark:bg-surface-container-highest border border-border dark:border-border rounded-lg p-3 transition-colors">
            <p className="text-xs text-muted-foreground dark:text-muted-foreground">Cost per Conversation</p>
            <p className="text-lg font-medium text-foreground dark:text-foreground">
              {(usageData.credits.used / usageData.conversations.total).toFixed(2)} credits
            </p>
          </div>
          <div className="bg-surface-container-low dark:bg-surface-container-highest border border-border dark:border-border rounded-lg p-3 transition-colors">
            <p className="text-xs text-muted-foreground dark:text-muted-foreground">Cost per Message</p>
            <p className="text-lg font-medium text-foreground dark:text-foreground">
              {(usageData.credits.used / usageData.messages.used).toFixed(2)} credits
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
