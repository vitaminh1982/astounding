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
      <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600 transition-colors" />
      <div className="px-4 py-1 bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300 rounded-full transition-colors">
        {date}
      </div>
      <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600 transition-colors" />
    </div>
  );
};

export default DateSeparator;
