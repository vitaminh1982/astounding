import React, { useContext, useMemo } from 'react';
import { MessageSquare, Bot, FileText, TrendingUp, Info, TrendingDown, Minus } from 'lucide-react';
import { Page } from '../../App';
import { motion } from 'framer-motion';
import Tooltip from '../common/Tooltip';
import { LanguageContext } from '../../context/LanguageContext';

interface MetricsCardsProps {
  onNavigate: (page: Page) => void;
  loading?: boolean;
}

export default function MetricsCards({ onNavigate, loading = false }: MetricsCardsProps) {
  const { t } = useContext(LanguageContext);

  const metrics = useMemo(() => [
    {
      id: 'activeAgents',
      title: t('metrics.cards.activeAgents.title') || 'Active AI Agents',
      value: '5',
      change: '+1',
      changeType: 'increase' as const,
      changeLabel: t('metrics.cards.activeAgents.changeLabel') || 'since last month',
      icon: Bot,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      hoverBgColor: 'group-hover:bg-green-200 dark:group-hover:bg-green-900/30',
      borderColor: 'border-green-200 dark:border-green-800',
      page: 'agents' as Page
    },
    {
      id: 'templates',
      title: t('metrics.cards.templates.title') || 'Templates Used',
      value: '115',
      change: '+8.2%',
      changeType: 'increase' as const,
      changeLabel: t('metrics.cards.templates.changeLabel') || 'since last week',
      icon: FileText,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      hoverBgColor: 'group-hover:bg-purple-200 dark:group-hover:bg-purple-900/30',
      borderColor: 'border-purple-200 dark:border-purple-800',
      page: 'templates' as Page
    },
    {
      id: 'messages',
      title: t('metrics.cards.messages.title') || 'Messages Sent',
      value: '1,432',
      change: '+12.5%',
      changeType: 'increase' as const,
      changeLabel: t('metrics.cards.messages.changeLabel') || 'since yesterday',
      icon: MessageSquare,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      hoverBgColor: 'group-hover:bg-blue-200 dark:group-hover:bg-blue-900/30',
      borderColor: 'border-blue-200 dark:border-blue-800',
      page: 'conversations' as Page
    },
  ], [t]);

  // Animation variants
  const cardVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.5,
        ease: 'easeOut'
      }
    })
  }), []);

  const numberVariants = useMemo(() => ({
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  }), []);

  // Helper function to get change indicator
  const getChangeIndicator = (changeType: 'increase' | 'decrease' | 'neutral') => {
    switch (changeType) {
      case 'increase':
        return {
          icon: TrendingUp,
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          hoverBgColor: 'hover:bg-green-100 dark:hover:bg-green-900/30',
          textColor: 'text-green-600 dark:text-green-400',
          iconColor: 'text-green-500 dark:text-green-400',
          borderColor: 'border-green-200 dark:border-green-800'
        };
      case 'decrease':
        return {
          icon: TrendingDown,
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          hoverBgColor: 'hover:bg-red-100 dark:hover:bg-red-900/30',
          textColor: 'text-red-600 dark:text-red-400',
          iconColor: 'text-red-500 dark:text-red-400',
          borderColor: 'border-red-200 dark:border-red-800'
        };
      case 'neutral':
        return {
          icon: Minus,
          bgColor: 'bg-gray-50 dark:bg-gray-800',
          hoverBgColor: 'hover:bg-gray-100 dark:hover:bg-gray-700',
          textColor: 'text-gray-600 dark:text-gray-400',
          iconColor: 'text-gray-500 dark:text-gray-400',
          borderColor: 'border-gray-200 dark:border-gray-700'
        };
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {[1, 2, 3].map((index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-colors">
              <div className="flex justify-between items-center">
                <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors"/>
                <div className="h-6 w-20 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors"/>
              </div>
              <div className="mt-4 h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded transition-colors"/>
              <div className="mt-2 h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded transition-colors"/>
              <div className="mt-4 h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded transition-colors"/>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {metrics.map((metric, index) => {
        const changeIndicator = getChangeIndicator(metric.changeType);
        const ChangeIcon = changeIndicator.icon;

        return (
          <motion.div 
            key={metric.id}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={index}
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate(metric.page)}
            className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-200 cursor-pointer overflow-hidden"
          >
            {/* Card Content */}
            <div className="p-4 sm:p-6">
              {/* Header Row */}
              <div className="flex items-center justify-between">
                {/* Icon */}
                <div className={`${metric.bgColor} ${metric.hoverBgColor} p-2 sm:p-3 rounded-xl transition-all duration-200 group-hover:scale-110`}>
                  <metric.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${metric.color} transition-colors`} />
                </div>
                
                {/* Change Badge */}
                <Tooltip content={metric.changeLabel}>
                  <div className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg ${changeIndicator.bgColor} ${changeIndicator.hoverBgColor} border ${changeIndicator.borderColor} transition-all duration-200`}>
                    <ChangeIcon className={`h-3 w-3 sm:h-4 sm:w-4 ${changeIndicator.iconColor}`} />
                    <span className={`text-xs sm:text-sm font-semibold ${changeIndicator.textColor} transition-colors`}>
                      {metric.change}
                    </span>
                    <Info className={`h-3 w-3 ${changeIndicator.iconColor} ml-0.5 opacity-60`} />
                  </div>
                </Tooltip>
              </div>

              {/* Metric Details */}
              <div className="mt-4 sm:mt-5">
                <h3 className="text-sm sm:text-base font-medium text-gray-600 dark:text-gray-400 transition-colors">
                  {metric.title}
                </h3>
                <motion.div 
                  variants={numberVariants}
                  initial="hidden"
                  animate="visible"
                  className="mt-1 sm:mt-2"
                >
                  <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors">
                    {metric.value}
                  </span>
                </motion.div>
                
                {/* Change Label */}
                <p className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 transition-colors">
                  {metric.changeLabel}
                </p>
              </div>
            </div>

            {/* Hover Effect Border */}
            <div className={`h-1 w-full ${metric.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-200`} />
          </motion.div>
        );
      })}
    </div>
  );
}
