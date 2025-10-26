// components/common/EmptyState.tsx
import React from 'react';
import { LucideIcon, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
    variant?: 'primary' | 'secondary' | 'ghost';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'card' | 'minimal';
  animated?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className = '',
  size = 'md',
  variant = 'default',
  animated = true,
}) => {
  // Size configurations
  const sizeConfig = {
    sm: {
      container: 'py-8 px-4',
      icon: 'w-10 h-10 p-2.5',
      iconSize: 'w-5 h-5',
      title: 'text-base',
      description: 'text-xs',
      button: 'px-3 py-1.5 text-sm',
    },
    md: {
      container: 'py-12 px-4',
      icon: 'w-14 h-14 p-3.5',
      iconSize: 'w-7 h-7',
      title: 'text-lg',
      description: 'text-sm',
      button: 'px-4 py-2 text-sm',
    },
    lg: {
      container: 'py-16 px-6',
      icon: 'w-20 h-20 p-5',
      iconSize: 'w-10 h-10',
      title: 'text-xl',
      description: 'text-base',
      button: 'px-5 py-2.5 text-base',
    },
  };

  // Variant configurations
  const variantConfig = {
    default: 'bg-transparent',
    card: 'bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm',
    minimal: 'bg-gray-50 dark:bg-gray-900/50 rounded-lg',
  };

  // Button variant configurations
  const buttonVariants = {
    primary: 'bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white shadow-sm hover:shadow-md',
    secondary: 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 shadow-sm',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
  };

  const config = sizeConfig[size];
  const ActionIcon = action?.icon;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15,
      },
    },
  };

  const ContentWrapper = animated ? motion.div : 'div';
  const contentProps = animated
    ? {
        variants: containerVariants,
        initial: 'hidden',
        animate: 'visible',
      }
    : {};

  return (
    <ContentWrapper
      className={`flex flex-col items-center justify-center text-center ${config.container} ${variantConfig[variant]} ${className} transition-colors duration-200`}
      {...contentProps}
    >
      {/* Icon */}
      {Icon && (
        <motion.div
          variants={animated ? iconVariants : undefined}
          className={`rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 ${config.icon} mb-4 transition-colors duration-200 relative overflow-hidden group`}
        >
          {/* Animated background gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-400/10 dark:to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <Icon className={`${config.iconSize} text-gray-400 dark:text-gray-500 transition-colors duration-200 relative z-10`} />
        </motion.div>
      )}

      {/* Title */}
      <motion.h3
        variants={animated ? itemVariants : undefined}
        className={`${config.title} font-semibold text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-200`}
      >
        {title}
      </motion.h3>

      {/* Description */}
      {description && (
        <motion.p
          variants={animated ? itemVariants : undefined}
          className={`${config.description} text-gray-500 dark:text-gray-400 max-w-md mb-6 leading-relaxed transition-colors duration-200`}
        >
          {description}
        </motion.p>
      )}

      {/* Actions */}
      {(action || secondaryAction) && (
        <motion.div
          variants={animated ? itemVariants : undefined}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          {/* Primary Action */}
          {action && (
            <button
              onClick={action.onClick}
              className={`inline-flex items-center justify-center gap-2 ${config.button} rounded-lg font-medium transition-all duration-200 ${
                buttonVariants[action.variant || 'primary']
              } group`}
            >
              {ActionIcon && <ActionIcon className="w-4 h-4" />}
              <span>{action.label}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
            </button>
          )}

          {/* Secondary Action */}
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className={`inline-flex items-center justify-center gap-2 ${config.button} rounded-lg font-medium transition-all duration-200 ${buttonVariants.ghost}`}
            >
              {secondaryAction.label}
            </button>
          )}
        </motion.div>
      )}

      {/* Decorative elements for card variant */}
      {variant === 'card' && (
        <>
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 dark:from-indigo-400/5 dark:to-purple-400/5 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-pink-500/5 to-orange-500/5 dark:from-pink-400/5 dark:to-orange-400/5 rounded-full blur-3xl -z-10" />
        </>
      )}
    </ContentWrapper>
  );
};

export default EmptyState;
