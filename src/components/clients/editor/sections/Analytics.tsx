import React from 'react';
import { Client } from '../../../../types/client';
import { TrendingUp, TrendingDown, BarChart3, Heart, Target, Euro, Percent, Award } from 'lucide-react';
import { motion } from 'framer-motion';

interface AnalyticsProps {
  client: Client;
}

interface MetricCardProps {
  label: string;
  value: string | number;
  maxValue?: number;
  percentage: number;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
  colorTheme: 'green' | 'blue' | 'purple' | 'amber';
  suffix?: string;
}

const MetricCard = ({ 
  label, 
  value, 
  maxValue, 
  percentage, 
  icon, 
  trend, 
  colorTheme, 
  suffix = '' 
}: MetricCardProps) => {
  const colorClasses = {
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      icon: 'text-green-600 dark:text-green-400',
      progress: 'bg-green-500 dark:bg-green-400',
      text: 'text-green-700 dark:text-green-300'
    },
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      icon: 'text-tertiary dark:text-tertiary',
      progress: 'bg-tertiary dark:bg-blue-400',
      text: 'text-blue-700 dark:text-blue-300'
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      border: 'border-purple-200 dark:border-purple-800',
      icon: 'text-tertiary dark:text-tertiary',
      progress: 'bg-tertiary dark:bg-purple-400',
      text: 'text-purple-700 dark:text-purple-300'
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-200 dark:border-amber-800',
      icon: 'text-amber-600 dark:text-destructive',
      progress: 'bg-destructive dark:bg-destructive',
      text: 'text-amber-700 dark:text-amber-300'
    }
  };

  const colors = colorClasses[colorTheme];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 ${colors.bg} border ${colors.border} rounded-lg transition-colors`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 bg-white dark:bg-surface-container-high rounded-lg shadow-sm transition-colors`}>
            <div className={colors.icon}>
              {icon}
            </div>
          </div>
          <span className="text-sm font-medium text-on-surface dark:text-muted-foreground transition-colors">
            {label}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          {trend && (
            <div className={`p-1 rounded-full ${trend === 'up' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'} transition-colors`}>
              {trend === 'up' ? (
                <TrendingUp className="w-3 h-3 text-green-600 dark:text-green-400 transition-colors" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-600 dark:text-destructive transition-colors" />
              )}
            </div>
          )}
          <span className={`text-sm font-semibold ${colors.text} transition-colors`}>
            {value}{suffix}
            {maxValue && (
              <span className="text-xs opacity-75 ml-1">
                / {maxValue}
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground dark:text-muted-foreground transition-colors">
            Progress
          </span>
          <span className={`font-medium ${colors.text} transition-colors`}>
            {Math.round(percentage)}%
          </span>
        </div>
        
        <div className="relative">
          <div className="h-2 bg-surface-container dark:bg-surface-container-highest rounded-full overflow-hidden transition-colors">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={`h-full ${colors.progress} rounded-full transition-colors relative overflow-hidden`}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 -skew-x-12 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function Analytics({ client }: AnalyticsProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-100 dark:bg-green-900/30 border border-indigo-200 dark:border-green-800 rounded-lg transition-colors">
          <BarChart3 className="w-5 h-5 text-primary-green dark:text-green-400 transition-colors" />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-foreground dark:text-foreground transition-colors">
            Client Analytics
          </h3>
          <p className="text-sm text-muted-foreground dark:text-muted-foreground transition-colors">
            Performance metrics and insights
          </p>
        </div>
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Lifetime Value */}
        <MetricCard
          label="Lifetime Value"
          value={client.ltv}
          percentage={(client.ltv / 5000) * 100}
          icon={<Euro className="w-4 h-4" />}
          trend={client.ltvTrend}
          colorTheme="green"
          suffix="€"
        />

        {/* Satisfaction */}
        <MetricCard
          label="Satisfaction"
          value={client.satisfaction}
          percentage={client.satisfaction}
          icon={<Heart className="w-4 h-4" />}
          colorTheme="blue"
          suffix="%"
        />

        {/* Engagement */}
        <MetricCard
          label="Engagement Score"
          value={client.engagementScore}
          maxValue={100}
          percentage={client.engagementScore}
          icon={<Target className="w-4 h-4" />}
          colorTheme="purple"
        />
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-surface-container-high border border-border dark:border-border rounded-lg text-center shadow-sm dark:shadow-gray-900 transition-colors">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg inline-flex mb-2 transition-colors">
            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400 transition-colors" />
          </div>
          <p className="text-lg font-semibold text-foreground dark:text-foreground transition-colors">
            {client.ltv}€
          </p>
          <p className="text-xs text-muted-foreground dark:text-muted-foreground transition-colors">
            Total Value
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-surface-container-high border border-border dark:border-border rounded-lg text-center shadow-sm dark:shadow-gray-900 transition-colors">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg inline-flex mb-2 transition-colors">
            <Percent className="w-4 h-4 text-tertiary dark:text-tertiary transition-colors" />
          </div>
          <p className="text-lg font-semibold text-foreground dark:text-foreground transition-colors">
            {client.satisfaction}%
          </p>
          <p className="text-xs text-muted-foreground dark:text-muted-foreground transition-colors">
            Satisfaction
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-surface-container-high border border-border dark:border-border rounded-lg text-center shadow-sm dark:shadow-gray-900 transition-colors">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg inline-flex mb-2 transition-colors">
            <Target className="w-4 h-4 text-tertiary dark:text-tertiary transition-colors" />
          </div>
          <p className="text-lg font-semibold text-foreground dark:text-foreground transition-colors">
            {client.engagementScore}
          </p>
          <p className="text-xs text-muted-foreground dark:text-muted-foreground transition-colors">
            Engagement
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-surface-container-high border border-border dark:border-border rounded-lg text-center shadow-sm dark:shadow-gray-900 transition-colors">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg inline-flex mb-2 transition-colors">
            <Award className="w-4 h-4 text-amber-600 dark:text-destructive transition-colors" />
          </div>
          <p className="text-lg font-semibold text-foreground dark:text-foreground transition-colors">
            {Math.round((client.satisfaction + client.engagementScore) / 2)}
          </p>
          <p className="text-xs text-muted-foreground dark:text-muted-foreground transition-colors">
            Overall Score
          </p>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 border border-border dark:border-border rounded-lg transition-colors">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-primary-green dark:text-green-400 transition-colors" />
          <h4 className="font-medium text-foreground dark:text-foreground transition-colors">
            Performance Insights
          </h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground dark:text-muted-foreground transition-colors">
                LTV Growth Potential
              </span>
              <span className="font-medium text-foreground dark:text-foreground transition-colors">
                {client.ltvTrend === 'up' ? 'High' : 'Moderate'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground dark:text-muted-foreground transition-colors">
                Engagement Level
              </span>
              <span className="font-medium text-foreground dark:text-foreground transition-colors">
                {client.engagementScore >= 80 ? 'Excellent' : client.engagementScore >= 60 ? 'Good' : 'Needs Attention'}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground dark:text-muted-foreground transition-colors">
                Satisfaction Status
              </span>
              <span className="font-medium text-foreground dark:text-foreground transition-colors">
                {client.satisfaction >= 90 ? 'Exceptional' : client.satisfaction >= 70 ? 'Satisfied' : 'At Risk'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground dark:text-muted-foreground transition-colors">
                Retention Risk
              </span>
              <span className={`font-medium transition-colors ${
                client.satisfaction >= 80 && client.engagementScore >= 70 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-amber-600 dark:text-destructive'
              }`}>
                {client.satisfaction >= 80 && client.engagementScore >= 70 ? 'Low' : 'Medium'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add shimmer keyframes to your CSS or Tailwind config
// @keyframes shimmer {
//   100% { transform: translateX(100%); }
// }
