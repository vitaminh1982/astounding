import React from 'react';
import { Bell, AlertTriangle, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import Tooltip from '../common/Tooltip';

interface NotificationBadgeProps {
  count: number;
  variant?: 'primary' | 'warning';
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ count, variant = 'primary' }) => {
  const baseColors = {
    primary: 'bg-red-500',
    warning: 'bg-amber-500'
  };

  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`
        absolute -top-1 -right-1 
        ${baseColors[variant]} text-white 
        text-xs min-w-[20px] h-5 
        rounded-full flex items-center justify-center
        px-1
      `}
    >
      {count > 99 ? '99+' : count}
    </motion.span>
  );
};

interface NotificationButtonProps {
  icon: React.ReactNode;
  count: number;
  tooltip: string;
  variant?: 'primary' | 'warning';
  onClick: () => void;
}

const NotificationButton: React.FC<NotificationButtonProps> = ({
  icon,
  count,
  tooltip,
  variant = 'primary',
  onClick
}) => (
  <Tooltip content={tooltip}>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        relative p-2 
        hover:bg-gray-100 
        rounded-full 
        transition-colors
        focus:outline-none 
        focus:ring-2 
        focus:ring-offset-2 
        focus:ring-${variant === 'warning' ? 'amber' : 'blue'}-500
      `}
      onClick={onClick}
    >
      {icon}
      {count > 0 && <NotificationBadge count={count} variant={variant} />}
    </motion.button>
  </Tooltip>
);

export default function ConversationsHeader() {
  const [isInfoVisible, setIsInfoVisible] = React.useState(false);

  const handleAlerts = () => {
    console.log('Manage alerts');
  };

  const handleNotifications = () => {
    console.log('Manage notifications');
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Discussions</h1>
        <p className="text-sm sm:text-base text-gray-600">Managed discussions that require attention</p>
      </div>
      <div className="flex gap-3 items-center">
        <NotificationButton
          icon={<AlertTriangle className="h-5 w-5 text-amber-500" />}
          count={2}
          tooltip="Conversations urgentes"
          variant="warning"
          onClick={handleAlerts}
        />
        
        <NotificationButton
          icon={<Bell className="h-5 w-5 text-gray-600" />}
          count={8}
          tooltip="Notifications"
          onClick={handleNotifications}
        />
      </div>
    </div>
  );
}
