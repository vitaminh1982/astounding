import React from 'react';
import { PieChart, Users, Clock, CreditCard, MessageSquare } from 'lucide-react';

const segments = [
  { 
    name: 'Premium', 
    count: 234, 
    icon: Users, 
    color: 'bg-indigo-100 text-indigo-600',
    percentage: 12
  },
  { 
    name: 'Standard', 
    count: 567, 
    icon: Clock, 
    color: 'bg-green-100 text-green-600',
    percentage: 45
  },
  { 
    name: 'Occasionnel', 
    count: 890, 
    icon: CreditCard, 
    color: 'bg-amber-100 text-amber-600',
    percentage: 28
  },
  { 
    name: 'Inactif', 
    count: 123, 
    icon: MessageSquare, 
    color: 'bg-gray-100 text-gray-600',
    percentage: 15
  },
];

interface Segment {
  name: string;
  count: number;
  icon: React.ComponentType<any>;
  color: string;
  percentage: number;
}

interface SegmentProps {
  segment: Segment;
}

function SegmentHeader({ segment }: SegmentProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className={`p-2.5 rounded-lg ${segment.color} transition-transform group-hover:scale-105`}>
          <segment.icon className="w-5 h-5" />
        </div>
        <div>
          <span className="text-sm font-medium text-gray-900">{segment.name}</span>
          <p className="text-xs text-gray-500 mt-0.5">{segment.count} customers</p>
        </div>
      </div>
      <div className="text-right">
        <span className="text-sm font-semibold text-gray-900">{segment.percentage}%</span>
      </div>
    </div>
  );
}

function ProgressBar({ percentage, color }: { percentage: number; color: string }) {
  const colorModified = color.replace('100', '500');
  return (
    <div className="w-full bg-gray-100 rounded-full h-1.5">
      <div className={`h-1.5 rounded-full ${colorModified}`} style={{ width: `${percentage}%` }} />
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
    <div className="mt-6 pt-4 border-t">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">Total Customers</span>
        <span className="text-sm font-semibold text-gray-900">{total}</span>
      </div>
    </div>
  );
}

export default function ClientSegmentation() {
  return (
    <div className="bg-white rounded-lg shadow p-4 md:p-6">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-semibold text-lg md:text-xl text-gray-900">Segmentation</h2>
          <p className="text-sm text-gray-500 mt-1">Customer segmentations</p>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <PieChart className="w-5 h-5 text-gray-400" />
        </button>
      </div>
      
      {/* Liste des segments */}
      <div className="space-y-4">
        {segments.map((segment) => (
          <Segment key={segment.name} segment={segment} />
        ))}
      </div>

      <Total />
    </div>
  );
}
