import React from 'react';
import { MessageSquare } from 'lucide-react';
import { UsageMetrics } from '../../types/usage';

interface ConversationSummaryProps {
  usageData: UsageMetrics;
}

export default function ConversationSummary({ usageData }: ConversationSummaryProps) {
  const { conversations } = usageData;

  // Sample data for demonstration - replace with actual data in production
  const sampleData = [
    { date: '2023-07-07', count: 15 }, // Fri
    { date: '2023-07-08', count: 10 }, // Sat
    { date: '2023-07-09', count: 5 },  // Sun
    { date: '2023-07-10', count: 18 }, // Mon
    { date: '2023-07-11', count: 22 }, // Tue
  ];

  // Use sample data or actual data
  const recentDailyUsage = conversations?.dailyUsage?.slice(-5)?.length > 0 
    ? conversations.dailyUsage.slice(-5) 
    : sampleData;

  return (
    <div className="bg-white rounded-lg shadow p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-semibold text-gray-900">Conversation Summary</h3>
        <div className="flex items-center">
          <span className="text-sm text-gray-500">Total: </span>
          <span className="font-bold text-gray-800 ml-1">{conversations?.total || 70}</span>
        </div>
      </div>

      {/* Chart with count and days */}
      <div className="mt-2 mb-6">
        {/* Counts */}
        <div className="flex justify-between mb-1 px-2">
          {recentDailyUsage.map((day, index) => (
            <div key={`count-${index}`} className="text-center" style={{width: '50px'}}>
              <span className="text-xs font-medium text-gray-700">{day.count}</span>
            </div>
          ))}
        </div>
        
        {/* Add gap space for the bars that should appear here */}
        <div className="h-12 relative">
          {/* Bars with absolute positioning and explicit heights */}
          {recentDailyUsage.map((day, index) => {
            const maxHeight = 40; // px
            const maxCount = Math.max(...recentDailyUsage.map(d => d.count));
            const ratio = day.count / maxCount;
            const barHeight = Math.max(Math.floor(ratio * maxHeight), 4); // Minimum 4px height
            const isToday = index === recentDailyUsage.length - 1;
            
            return (
              <div 
                key={`bar-${index}`}
                className={`absolute bottom-0 ${isToday ? 'bg-indigo-500' : 'bg-indigo-300'} rounded-t-sm`}
                style={{
                  left: `${(index * 20) + 7.5}%`, // Position bars evenly
                  width: '16px',
                  height: `${barHeight}px`,
                }}
              />
            );
          })}
        </div>
        
        {/* Day names */}
        <div className="flex justify-between mt-1 px-2">
          {recentDailyUsage.map((day, index) => {
            const date = new Date(day.date);
            const dayName = date instanceof Date && !isNaN(date.getTime()) 
              ? date.toLocaleDateString('en-US', { weekday: 'short' })
              : ['Fri', 'Sat', 'Sun', 'Mon', 'Tue'][index];
            
            return (
              <div key={`day-${index}`} className="text-center" style={{width: '50px'}}>
                <div className="text-xs text-gray-500">{dayName}</div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-2 gap-4">
        <div className="flex items-center">
          <div className="p-2 bg-blue-50 rounded-lg mr-2.5">
            <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Avg/Conv</p>
            <p className="text-sm font-semibold">{conversations?.averageMessagesPerConversation || "12"}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="p-2 bg-purple-50 rounded-lg mr-2.5">
            <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Today</p>
            <p className="text-sm font-semibold">{recentDailyUsage[recentDailyUsage.length-1]?.count || 22}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
