import React, { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Download, Calendar, ChevronUp, ChevronDown } from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ComparisonData {
  category: string;
  currentPeriod: number;
  previousPeriod: number;
  change: number;
}

interface MetricComparisonChartProps {
  title: string;
  description?: string;
  metric: string;
  unit?: string;
  height?: number;
  className?: string;
}

const MetricComparisonChart: React.FC<MetricComparisonChartProps> = ({
  title,
  description,
  metric,
  unit = '',
  height = 350,
  className = ''
}) => {
  const [comparisonData, setComparisonData] = useState<ComparisonData[]>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [isLoading, setIsLoading] = useState(true);
  const chartRef = useRef<ChartJS>(null);

  // Generate mock comparison data
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Generate mock data based on the metric
      let mockData: ComparisonData[] = [];
      
      if (metric === 'responseTime') {
        mockData = [
          { category: 'Customer Support', currentPeriod: 1.2, previousPeriod: 1.4, change: -14.3 },
          { category: 'Sales Assistant', currentPeriod: 1.1, previousPeriod: 1.3, change: -15.4 },
          { category: 'Technical Support', currentPeriod: 1.5, previousPeriod: 1.7, change: -11.8 },
          { category: 'E-commerce', currentPeriod: 1.0, previousPeriod: 1.2, change: -16.7 }
        ];
      } else if (metric === 'resolutionRate') {
        mockData = [
          { category: 'Customer Support', currentPeriod: 96.2, previousPeriod: 94.5, change: 1.8 },
          { category: 'Sales Assistant', currentPeriod: 93.5, previousPeriod: 91.8, change: 1.9 },
          { category: 'Technical Support', currentPeriod: 91.8, previousPeriod: 89.5, change: 2.6 },
          { category: 'E-commerce', currentPeriod: 95.3, previousPeriod: 93.7, change: 1.7 }
        ];
      } else if (metric === 'satisfaction') {
        mockData = [
          { category: 'Customer Support', currentPeriod: 4.9, previousPeriod: 4.7, change: 4.3 },
          { category: 'Sales Assistant', currentPeriod: 4.7, previousPeriod: 4.5, change: 4.4 },
          { category: 'Technical Support', currentPeriod: 4.6, previousPeriod: 4.4, change: 4.5 },
          { category: 'E-commerce', currentPeriod: 4.8, previousPeriod: 4.7, change: 2.1 }
        ];
      } else {
        // Default data
        mockData = [
          { category: 'Category A', currentPeriod: 85, previousPeriod: 75, change: 13.3 },
          { category: 'Category B', currentPeriod: 65, previousPeriod: 60, change: 8.3 },
          { category: 'Category C', currentPeriod: 90, previousPeriod: 85, change: 5.9 },
          { category: 'Category D', currentPeriod: 70, previousPeriod: 65, change: 7.7 }
        ];
      }
      
      setComparisonData(mockData);
      setIsLoading(false);
    }, 800);
  }, [metric, timeRange]);

  // Export chart as image
  const handleExport = () => {
    if (chartRef.current) {
      const url = chartRef.current.toBase64Image();
      const link = document.createElement('a');
      link.download = `${metric}-comparison.png`;
      link.href = url;
      link.click();
    }
  };

  // Format value based on metric
  const formatValue = (value: number) => {
    if (metric === 'responseTime') return `${value}s`;
    if (metric === 'resolutionRate') return `${value}%`;
    if (metric === 'satisfaction') return `${value}/5`;
    return value.toString();
  };

  // Prepare chart data
  const data: ChartData<'bar'> = {
    labels: comparisonData.map(d => d.category),
    datasets: [
      {
        label: 'Current Period',
        data: comparisonData.map(d => d.currentPeriod),
        backgroundColor: '#4F46E5',
        borderColor: '#4F46E5',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'Previous Period',
        data: comparisonData.map(d => d.previousPeriod),
        backgroundColor: '#A5B4FC',
        borderColor: '#A5B4FC',
        borderWidth: 1,
        borderRadius: 4,
      }
    ]
  };

  // Chart options
  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: false,
        grid: {
          color: '#E5E7EB'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 6,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#111827',
        bodyColor: '#4B5563',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            const dataIndex = context.dataIndex;
            const datasetIndex = context.datasetIndex;
            
            if (datasetIndex === 0) {
              return `Current: ${formatValue(value)}`;
            } else {
              return `Previous: ${formatValue(value)}`;
            }
          },
          afterBody: (tooltipItems) => {
            const dataIndex = tooltipItems[0].dataIndex;
            const change = comparisonData[dataIndex].change;
            const changeText = change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
            const changeLabel = metric === 'responseTime' ? 
              (change < 0 ? 'Improvement' : 'Slowdown') : 
              (change > 0 ? 'Improvement' : 'Decline');
            
            return [`Change: ${changeText} (${changeLabel})`];
          }
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false
    },
    barPercentage: 0.7,
    categoryPercentage: 0.7
  };

  return (
    <div className={`bg-white rounded-lg border p-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
        <div className="flex gap-2">
          {/* Time range selector */}
          <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden">
            <Calendar className="ml-3 w-4 h-4 text-gray-500" />
            <select
              className="w-full py-2 pl-2 pr-8 bg-transparent border-none focus:ring-0 text-sm"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
            >
              <option value="7d">vs Previous 7 Days</option>
              <option value="30d">vs Previous 30 Days</option>
              <option value="90d">vs Previous 90 Days</option>
            </select>
          </div>
          
          {/* Export button */}
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-2 border rounded-lg bg-white hover:bg-gray-50 text-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Chart */}
      <div style={{ height: `${height}px` }} className="relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75 rounded-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <Bar ref={chartRef} data={data} options={options} />
        )}
      </div>

      {/* Summary table */}
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Previous</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {comparisonData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatValue(item.currentPeriod)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatValue(item.previousPeriod)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`flex items-center text-sm ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.change >= 0 ? (
                      <ChevronUp className="w-4 h-4 mr-1" />
                    ) : (
                      <ChevronDown className="w-4 h-4 mr-1" />
                    )}
                    <span>{Math.abs(item.change).toFixed(1)}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MetricComparisonChart;