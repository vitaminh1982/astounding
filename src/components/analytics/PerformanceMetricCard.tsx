import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PerformanceMetricCardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendValue?: string;
  icon?: React.ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  className?: string;
}

const PerformanceMetricCard: React.FC<PerformanceMetricCardProps> = ({
  title,
  value,
  trend,
  trendValue,
  icon,
  iconBgColor = 'bg-indigo-100',
  iconColor = 'text-indigo-600',
  className = ''
}) => {
  const getTrendIcon = () => {
    if (!trend) return null;
    
    if (trend === 'up') {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    } else if (trend === 'down') {
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    }
    
    return null;
  };

  const getTrendColor = () => {
    if (!trend) return 'text-gray-500';
    
    // For metrics where down is good (like response time)
    if (title.toLowerCase().includes('time') || title.toLowerCase().includes('cost')) {
      return trend === 'down' ? 'text-green-600' : 'text-red-600';
    }
    
    // For metrics where up is good (like resolution rate)
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className={`bg-white rounded-lg border p-6 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        {icon && (
          <div className={`p-2 ${iconBgColor} rounded-lg`}>
            <div className={iconColor}>{icon}</div>
          </div>
        )}
      </div>
      <div className="text-3xl font-bold">{value}</div>
      {trendValue && (
        <div className="mt-2 flex items-center text-sm">
          <div className={`flex items-center ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="ml-1">{trendValue}</span>
          </div>
          {trend && <span className="ml-2 text-gray-500">from previous period</span>}
        </div>
      )}
    </div>
  );
};

export default PerformanceMetricCard;