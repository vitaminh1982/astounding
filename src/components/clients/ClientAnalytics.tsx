import React from 'react';
import { TrendingUp, Users, ShoppingCart, Heart } from 'lucide-react';

interface Metric {
  label: string;
  value: string;
  trend: string;
  icon: React.ComponentType<any>;
  color: string;
}

const metrics: Metric[] = [
  {
    label: 'Average Satisfaction',
    value: '92%',
    trend: '+2.5%',
    icon: Heart,
    color: 'text-red-500',
  },
  {
    label: 'Retention Rate',
    value: '85%',
    trend: '+1.2%',
    icon: Users,
    color: 'text-indigo-500',
  },
  {
    label: 'Average basket',
    value: '127€',
    trend: '+4.3%',
    icon: ShoppingCart,
    color: 'text-green-500',
  },
];

interface MetricProps {
  metric: Metric;
}

function MetricIcon({ metric }: MetricProps) {
  return (
    <metric.icon className={`w-5 h-5 md:w-7 md:h-7 ${metric.color}`} />
  );
}

function MetricTrend({ metric }: MetricProps) {
  // Determine text color for trend based on sign for light/dark mode
  const isPositiveTrend = metric.trend.startsWith('+');
  const trendColor = isPositiveTrend ? 'text-green-500' : 'text-red-500';

  return (
    <div className={`flex items-center gap-1 text-sm md:text-base ${trendColor} dark:text-green-400`}>
      <TrendingUp className="w-4 h-4 md:w-6 md:h-6" />
      {metric.trend}
    </div>
  );
}

function MetricInfo({ metric }: MetricProps) {
  return (
    <div>
      <div className="text-2xl md:text-3xl font-bold dark:text-gray-200">{metric.value}</div>
      <div className="text-sm md:text-base text-gray-500 dark:text-gray-400">{metric.label}</div>
    </div>
  );
}

function MetricCard({ metric }: MetricProps) {
  return (
    <div key={metric.label} className="p-3 md:p-6 rounded-lg border bg-white shadow dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center justify-between mb-2 md:mb-4">
        <MetricIcon metric={metric} />
        <MetricTrend metric={metric} />
      </div>
      <MetricInfo metric={metric} />
    </div>
  );
}

export default function ClientAnalytics() {
  return (
    <div className="bg-white rounded-lg shadow p-4 md:p-6 dark:bg-gray-900 dark:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg md:text-xl dark:text-gray-200">Analytics</h2>
        <TrendingUp className="w-5 h-5 text-gray-400 dark:text-gray-500" />
      </div>
      
      <div className="space-y-4 md:space-y-6">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>
    </div>
  );
}
