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
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Usage History</h3>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <BarChart2 className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="relative group">
            <button 
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              onClick={() => onExport('csv')}
            >
              <Download className="w-5 h-5 text-gray-600" />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
              <button 
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => onExport('csv')}
              >
                Export as CSV
              </button>
              <button 
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => onExport('pdf')}
              >
                Export as PDF
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">Credits Used</p>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold">{currentMonth.credits.toLocaleString()}</p>
            <div className={`flex items-center text-sm ${creditsChange.isIncrease ? 'text-red-500' : 'text-green-500'}`}>
              {creditsChange.isIncrease ? (
                <ArrowUp className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 mr-1" />
              )}
              {creditsChange.value}%
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">Messages Sent</p>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold">{currentMonth.messages.toLocaleString()}</p>
            <div className={`flex items-center text-sm ${messagesChange.isIncrease ? 'text-red-500' : 'text-green-500'}`}>
              {messagesChange.isIncrease ? (
                <ArrowUp className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 mr-1" />
              )}
              {messagesChange.value}%
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">Conversations</p>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold">{currentMonth.conversations.toLocaleString()}</p>
            <div className={`flex items-center text-sm ${conversationsChange.isIncrease ? 'text-red-500' : 'text-green-500'}`}>
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
        <h4 className="text-sm font-medium text-gray-700 mb-4">Monthly Comparison</h4>
        <div className="h-64">
          <div className="h-full flex items-end justify-between">
            {history.map((month, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="w-full flex justify-center items-end h-[85%]">
                  <div 
                    className="w-full max-w-[30px] bg-indigo-500 rounded-t-sm mx-1 transition-all duration-500 ease-in-out hover:bg-indigo-600"
                    style={{ 
                      height: `${(month.credits / usageData.credits.total) * 100}%`,
                      minHeight: '4px'
                    }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-2">{month.month.substring(0, 3)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}