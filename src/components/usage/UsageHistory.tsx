import React from 'react';
import { BarChart2, Download, ArrowUp, ArrowDown } from 'lucide-react';
import { UsageMetrics } from '../../types/usage';

interface UsageHistoryProps {
  usageData: UsageMetrics;
  onExport: (format: 'csv' | 'pdf') => void;
}

export default function UsageHistory({ usageData, onExport }: UsageHistoryProps) {
  const { history } = usageData;
  
  // Get current and previous month data
  const currentMonth = history[history.length - 1];
  const previousMonth = history[history.length - 2];
  
  // Calculate percentage changes
  const calculateChange = (current: number, previous: number) => {
    if (!previous) return { value: 0, isIncrease: false };
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      isIncrease: change > 0
    };
  };
  
  const creditsChange = calculateChange(currentMonth.credits, previousMonth?.credits);
  const messagesChange = calculateChange(currentMonth.messages, previousMonth?.messages);
  const conversationsChange = calculateChange(currentMonth.conversations, previousMonth?.conversations);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 border border-gray-200 dark:border-gray-700 p-6 transition-colors">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Usage History</h3>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-100 dark:bg-teal-900 rounded-lg transition-colors">
            <BarChart2 className="w-5 h-5 text-indigo-600 dark:text-teal-300" />
          </div>
          <div className="relative group">
            <button 
              className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              onClick={() => onExport('csv')}
            >
              <Download className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg dark:shadow-gray-900 py-1 z-10 hidden group-hover:block transition-colors">
              <button 
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => onExport('csv')}
              >
                Export as CSV
              </button>
              <button 
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => onExport('pdf')}
              >
                Export as PDF
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-lg p-4 transition-colors">
          <p className="text-sm text-gray-500 dark:text-gray-400">Credits Used</p>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{currentMonth.credits.toLocaleString()}</p>
            <div className={`flex items-center text-sm ${creditsChange.isIncrease ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'}`}>
              {creditsChange.isIncrease ? (
                <ArrowUp className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 mr-1" />
              )}
              {creditsChange.value}%
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-lg p-4 transition-colors">
          <p className="text-sm text-gray-500 dark:text-gray-400">Messages Sent</p>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{currentMonth.messages.toLocaleString()}</p>
            <div className={`flex items-center text-sm ${messagesChange.isIncrease ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'}`}>
              {messagesChange.isIncrease ? (
                <ArrowUp className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 mr-1" />
              )}
              {messagesChange.value}%
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-lg p-4 transition-colors">
          <p className="text-sm text-gray-500 dark:text-gray-400">Conversations</p>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{currentMonth.conversations.toLocaleString()}</p>
            <div className={`flex items-center text-sm ${conversationsChange.isIncrease ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'}`}>
              {conversationsChange.isIncrease ? (
                <ArrowUp className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 mr-1" />
              )}
              {conversationsChange.value}%
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-4">Monthly Comparison</h4>
        <div className="h-64">
          <div className="h-full flex items-end justify-between">
            {history.map((month, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="w-full flex justify-center items-end h-[85%]">
                  <div 
                    className="w-full max-w-[30px] bg-indigo-500 dark:bg-teal-500 rounded-t-sm mx-1 transition-all duration-500 ease-in-out hover:bg-indigo-600 dark:hover:bg-teal-600"
                    style={{ 
                      height: `${(month.credits / usageData.credits.total) * 100}%`,
                      minHeight: '4px'
                    }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">{month.month.substring(0, 3)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
