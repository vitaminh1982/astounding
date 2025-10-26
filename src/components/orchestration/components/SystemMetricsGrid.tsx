import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { SystemMetric } from '../types';

interface SystemMetricsGridProps {
  metrics: SystemMetric[];
}

const SystemMetricsGrid: React.FC<SystemMetricsGridProps> = ({ metrics }) => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900 border border-gray-200 dark:border-gray-600 p-4 sm:p-6 hover:shadow-md dark:hover:shadow-gray-800 transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`${metric.bgColor} p-3 rounded-xl`}>
              <metric.icon className={`h-6 w-6 ${metric.color}`} />
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700">
              {metric.trend === 'up' ? (
                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
              ) : (
                <TrendingDown className="h-4 w-4 text-green-600 dark:text-green-400" />
              )}
              <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                {metric.change}
              </span>
            </div>
          </div>
          <div className="mb-2">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
              {metric.title}
            </h3>
            <div className="mt-2">
              <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {metric.value}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{metric.changeLabel}</p>
        </motion.div>
      ))}
    </section>
  );
};

export default React.memo(SystemMetricsGrid);
