/**
 * Date separator component for message list
 */
import React from 'react';

interface DateSeparatorProps {
  date: string;
}

const DateSeparator: React.FC<DateSeparatorProps> = ({ date }) => {
  return (
    <div 
      className="flex items-center justify-center my-6"
      role="separator"
      aria-label={`Messages from ${date}`}
    >
      <div className="flex-1 h-px bg-surface-container dark:bg-surface-container-highest transition-colors" />
      <div className="px-4 py-1 bg-surface-container-low dark:bg-surface-container-highest text-xs font-medium text-muted-foreground dark:text-muted-foreground rounded-full transition-colors">
        {date}
      </div>
      <div className="flex-1 h-px bg-surface-container dark:bg-surface-container-highest transition-colors" />
    </div>
  );
};

export default DateSeparator;
