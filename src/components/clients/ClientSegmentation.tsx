import React from 'react';
import { PieChart, Users, Clock, CreditCard, MessageSquare } from 'lucide-react';

// Updated segments with dark mode colors
const segments = [
  { 
    name: 'Premium', 
    count: 234, 
    icon: Users, 
    // Light mode: bg-indigo-100 text-indigo-600
    // Dark mode: bg-purple-700 text-purple-200
    color: 'bg-indigo-100 text-indigo-600 dark:bg-purple-700 dark:text-purple-200',
    percentage: 12
  },
  { 
    name: 'Standard', 
    count: 567, 
    icon: Clock, 
    // Light mode: bg-green-100 text-green-600
    // Dark mode: bg-teal-700 text-teal-200
    color: 'bg-green-100 text-green-600 dark:bg-teal-700 dark:text-teal-200',
    percentage: 45
  },
  { 
    name: 'Occasionnel', 
    count: 890, 
    icon: CreditCard, 
    // Light mode: bg-amber-100 text-amber-600
    // Dark mode: bg-yellow-600 text-yellow-200
    color: 'bg-amber-100 text-amber-600 dark:bg-yellow-600 dark:text-yellow-200',
    percentage: 28
  },
  { 
    name: 'Inactif', 
    count: 123, 
    icon: MessageSquare, 
    // Light mode: bg-gray-100 text-gray-600
    // Dark mode: bg-gray-700 text-gray-300
    color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
    percentage: 15
  },
];

interface Segment {
  name: string;
  count: number;
  icon: React.ComponentType<any>;
  color: string; // This will now hold both light and dark mode classes
  percentage: number;
}

interface SegmentProps {
  segment: Segment;
}

function SegmentHeader({ segment }: SegmentProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer dark:hover:bg-gray-700">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className={`p-2.5 rounded-lg ${segment.color} transition-transform group-hover:scale-105`}>
          <segment.icon className="w-5 h-5" />
        </div>
        <div>
          <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{segment.name}</span>
          <p className="text-xs text-gray-500 mt-0.5 dark:text-gray-400">{segment.count} customers</p>
        </div>
      </div>
      <div className="text-right">
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-200">{segment.percentage}%</span>
      </div>
    </div>
  );
}

function ProgressBar({ percentage, color }: { percentage: number; color: string }) {
  // Dynamically adjust colors for dark mode if they exist in the color string
  const colorClasses = color.split(' ');
  const lightModeColor = colorClasses.find(cls => cls.startsWith('bg-') && !cls.includes('dark:')) || 'bg-gray-500';
  const darkModeColor = colorClasses.find(cls => cls.startsWith('dark:bg-'))?.replace('dark:bg-', 'bg-') || lightModeColor.replace('bg-', 'bg-gray-');
  
  // Construct the final Tailwind classes for the progress bar's filled portion
  const progressBarFillClass = `${lightModeColor} ${darkModeColor}`;

  return (
    <div className="w-full bg-gray-100 rounded-full h-1.5 dark:bg-gray-700">
      <div className={`h-1.5 rounded-full ${progressBarFillClass}`} style={{ width: `${percentage}%` }} />
    </div>
  );
}

function Segment({ segment }: SegmentProps) {
  return (
    <div className="group transition-all duration-200 ease-in-out">
      <SegmentHeader segment={segment} />
      <div className="mt-2 px-3">
        <ProgressBar percentage={segment.percentage} color={segment.color} />
      </div>
    </div>
  );
}

function Total() {
  const total = segments.reduce((acc, curr) => acc + curr.count, 0);
  return (
    <div className="mt-6 pt-4 border-t dark:border-gray-700">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500 dark:text-gray-400">Total Customers</span>
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-200">{total}</span>
      </div>
    </div>
  );
}

export default function ClientSegmentation() {
  return (
    <div className="bg-white rounded-lg shadow p-4 md:p-6 dark:bg-gray-800 dark:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-semibold text-lg md:text-xl text-gray-900 dark:text-gray-200">Segmentation</h2>
          <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">Customer segmentations</p>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors dark:hover:bg-gray-700">
          <PieChart className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        </button>
      </div>
      
      {/* List of segments */}
      <div className="space-y-4">
        {segments.map((segment) => (
          <Segment key={segment.name} segment={segment} />
        ))}
      </div>

      <Total />
    </div>
  );
}
