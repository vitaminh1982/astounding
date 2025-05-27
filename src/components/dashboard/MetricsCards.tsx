import React, { useContext } from 'react';
import { MessageSquare, Bot, FileText, TrendingUp, Info } from 'lucide-react';
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

  const metrics = [
    {
      id: 'activeAgents',
      title: t('metrics.cards.activeAgents.title') || 'Active AI Agents',
      value: '5',
      change: '+1',
      changeLabel: t('metrics.cards.activeAgents.changeLabel') || 'since last month',
      icon: Bot,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      page: 'agents' as Page
    },
    {
      id: 'templates',
      title: t('metrics.cards.templates.title') || 'Templates Used',
      value: '115',
      change: '+8.2%',
      changeLabel: t('metrics.cards.templates.changeLabel') || 'since last week',
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      page: 'templates' as Page
    },
    {
      id: 'messages',
      title: t('metrics.cards.messages.title') || 'Messages Sent',
      value: '1,432',
      change: '+12.5%',
      changeLabel: t('metrics.cards.messages.changeLabel') || 'since yesterday',
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      page: 'conversations' as Page
    },
  ];

  // Animation variants remain the same
  const cardVariants = {
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
  };

  const numberVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {[1, 2, 3].map((index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200">
              <div className="flex justify-between items-center">
                <div className="h-12 w-12 rounded-full bg-gray-200"/>
                <div className="h-6 w-20 rounded-full bg-gray-200"/>
              </div>
              <div className="mt-4 h-4 w-24 bg-gray-200 rounded"/>
              <div className="mt-2 h-8 w-16 bg-gray-200 rounded"/>
              <div className="mt-6 h-8 w-full bg-gray-200 rounded"/>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {metrics.map((metric, index) => (
        <motion.div 
          key={metric.id}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={index}
          whileHover={{ scale: 1.02 }}
          onClick={() => onNavigate(metric.page)}
          className="group bg-white rounded-lg shadow-md border border-gray-200 transition-all duration-200 cursor-pointer"
        >
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className={`${metric.bgColor} p-2 sm:p-3 rounded-full transition-transform group-hover:scale-105`}>
                <metric.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${metric.color}`} />
              </div>
              
              <Tooltip content={metric.changeLabel}>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 hover:bg-green-100 transition-colors">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                  <span className="text-xs sm:text-sm font-medium text-green-600">
                    {metric.change}
                  </span>
                  <Info className="h-3 w-3 text-green-400 ml-1" />
                </div>
              </Tooltip>
            </div>

            <div className="mt-3 sm:mt-4">
              <h3 className="text-sm sm:text-base font-medium text-gray-600">
                {metric.title}
              </h3>
              <motion.div 
                variants={numberVariants}
                initial="hidden"
                animate="visible"
                className="mt-1 sm:mt-2"
              >
                <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {metric.value}
                </span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
