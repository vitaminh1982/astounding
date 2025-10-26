import React, { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
  ChartOptions,
  ChartData,
  TooltipItem
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { format, subDays, subMonths, parseISO, isValid } from 'date-fns';
import { Download, Calendar, Filter, ArrowDown, ArrowUp, AlertCircle } from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Define metric types
export interface Metric {
  id: string;
  name: string;
  color: string;
  visible: boolean;
  unit?: string;
  description?: string;
}

// Define data point interface
export interface DataPoint {
  date: string;
  [key: string]: number | string;
}

interface PerformanceChartProps {
  title?: string;
  description?: string;
  height?: number;
  className?: string;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({
  title = 'Performance Metrics',
  description = 'Track key performance indicators over time',
  height = 400,
  className = ''
}) => {
  // Available metrics with theme-aware colors
  const [metrics, setMetrics] = useState<Metric[]>([
    { id: 'responseTime', name: 'Response Time', color: '#0D9488', visible: true, unit: 'seconds', description: 'Average time to generate a response' },
    { id: 'resolutionRate', name: 'Resolution Rate', color: '#10B981', visible: true, unit: '%', description: 'Percentage of issues resolved without escalation' },
    { id: 'satisfaction', name: 'Satisfaction', color: '#F59E0B', visible: true, unit: 'score', description: 'Average customer satisfaction rating (1-5)' },
    { id: 'conversationCount', name: 'Conversation Count', color: '#6366F1', visible: false, unit: 'count', description: 'Total number of conversations' },
    { id: 'costPerConversation', name: 'Cost Per Conversation', color: '#EC4899', visible: false, unit: '€', description: 'Average cost per conversation' }
  ]);

  // Time range state
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'custom'>('30d');
  const [customDateRange, setCustomDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: subDays(new Date(), 30),
    end: new Date()
  });
  const [isCustomRangeOpen, setIsCustomRangeOpen] = useState(false);
  const [granularity, setGranularity] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Chart data state
  const [chartData, setChartData] = useState<DataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLegend, setShowLegend] = useState(true);
  const [sortMetric, setSortMetric] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Chart ref for export functionality
  const chartRef = useRef<ChartJS>(null);

  // Generate mock data based on time range
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    try {
      // Determine date range based on selected time range
      let startDate: Date;
      let endDate = new Date();
      
      if (timeRange === 'custom' && customDateRange.start && customDateRange.end) {
        startDate = customDateRange.start;
        endDate = customDateRange.end;
      } else {
        switch (timeRange) {
          case '7d':
            startDate = subDays(endDate, 7);
            break;
          case '30d':
            startDate = subDays(endDate, 30);
            break;
          case '90d':
            startDate = subDays(endDate, 90);
            break;
          default:
            startDate = subDays(endDate, 30);
        }
      }

      // Generate mock data points
      const data: DataPoint[] = [];
      const dayDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Determine data point frequency based on granularity and time range
      let interval = 1; // days
      if (granularity === 'weekly') interval = 7;
      else if (granularity === 'monthly') interval = 30;
      
      // Generate data points
      for (let i = 0; i <= dayDiff; i += interval) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        
        // Create data point with random but realistic values
        const dataPoint: DataPoint = {
          date: currentDate.toISOString(),
          responseTime: (1 + Math.random() * 0.5).toFixed(1), // 1.0-1.5s
          resolutionRate: (90 + Math.random() * 8).toFixed(1), // 90-98%
          satisfaction: (4.5 + Math.random() * 0.5).toFixed(1), // 4.5-5.0
          conversationCount: Math.floor(300 + Math.random() * 200), // 300-500
          costPerConversation: (0.01 + Math.random() * 0.01).toFixed(3) // €0.01-0.02
        };
        
        data.push(dataPoint);
      }

      setChartData(data);
      setIsLoading(false);
    } catch (err) {
      console.error('Error generating chart data:', err);
      setError('Failed to load performance data');
      setIsLoading(false);
    }
  }, [timeRange, customDateRange, granularity]);

  // Toggle metric visibility
  const toggleMetric = (id: string) => {
    setMetrics(metrics.map(metric => 
      metric.id === id ? { ...metric, visible: !metric.visible } : metric
    ));
  };

  // Export chart as image
  const handleExport = () => {
    if (chartRef.current) {
      const url = chartRef.current.toBase64Image();
      const link = document.createElement('a');
      link.download = `performance-metrics-${format(new Date(), 'yyyy-MM-dd')}.png`;
      link.href = url;
      link.click();
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    switch (granularity) {
      case 'daily':
        return format(date, 'MMM d');
      case 'weekly':
        return format(date, "'Week of' MMM d");
      case 'monthly':
        return format(date, 'MMM yyyy');
      default:
        return format(date, 'MMM d');
    }
  };

  // Prepare chart data
  const data: ChartData<'line'> = {
    labels: chartData.map(d => d.date),
    datasets: metrics
      .filter(metric => metric.visible)
      .map(metric => ({
        label: metric.name,
        data: chartData.map(d => Number(d[metric.id])),
        borderColor: metric.color,
        backgroundColor: `${metric.color}20`, // Add transparency for fill
        fill: false,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: metric.color,
      }))
  };

  // Chart options with theme-aware styling
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: granularity === 'daily' ? 'day' : granularity === 'weekly' ? 'week' : 'month',
          tooltipFormat: 'PPP', // Localized date format
          displayFormats: {
            day: 'MMM d',
            week: 'MMM d',
            month: 'MMM yyyy'
          }
        },
        title: {
          display: true,
          text: 'Date',
          color: document.documentElement.classList.contains('dark') ? '#9CA3AF' : '#6B7280',
          font: {
            size: 12,
            weight: 'normal'
          }
        },
        grid: {
          display: false
        },
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#9CA3AF' : '#6B7280'
        }
      },
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Value',
          color: document.documentElement.classList.contains('dark') ? '#9CA3AF' : '#6B7280',
          font: {
            size: 12,
            weight: 'normal'
          }
        },
        grid: {
          color: document.documentElement.classList.contains('dark') ? '#374151' : '#E5E7EB'
        },
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#9CA3AF' : '#6B7280'
        }
      }
    },
    plugins: {
      legend: {
        display: showLegend,
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 6,
          font: {
            size: 12
          },
          color: document.documentElement.classList.contains('dark') ? '#E5E7EB' : '#374151'
        }
      },
      tooltip: {
        backgroundColor: document.documentElement.classList.contains('dark') ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: document.documentElement.classList.contains('dark') ? '#F3F4F6' : '#111827',
        bodyColor: document.documentElement.classList.contains('dark') ? '#D1D5DB' : '#4B5563',
        borderColor: document.documentElement.classList.contains('dark') ? '#4B5563' : '#E5E7EB',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          title: (tooltipItems: TooltipItem<'line'>[]) => {
            if (tooltipItems.length > 0) {
              // Use the parsed x value (timestamp) instead of label
              const timestamp = tooltipItems[0].parsed.x;
              const date = new Date(timestamp);
              
              // Validate the date before formatting
              if (isValid(date)) {
                return format(date, 'PPP'); // Localized date format
              }
              
              // Fallback to raw label if date is invalid
              return tooltipItems[0].label || 'Invalid Date';
            }
            return '';
          },
          label: (context: TooltipItem<'line'>) => {
            const metric = metrics.find(m => m.name === context.dataset.label);
            if (metric) {
              let value = context.raw as number;
              let unit = metric.unit || '';
              
              // Format based on unit
              if (unit === '%') {
                return `${metric.name}: ${value}%`;
              } else if (unit === '€') {
                return `${metric.name}: €${value}`;
              } else if (unit === 'seconds') {
                return `${metric.name}: ${value}s`;
              } else if (unit === 'score') {
                return `${metric.name}: ${value}/5`;
              } else {
                return `${metric.name}: ${value}`;
              }
            }
            return `${context.dataset.label}: ${context.raw}`;
          }
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false
    },
    elements: {
      line: {
        tension: 0.4
      }
    }
  };

  // Handle time range change
  const handleTimeRangeChange = (range: '7d' | '30d' | '90d' | 'custom') => {
    setTimeRange(range);
    if (range !== 'custom') {
      setIsCustomRangeOpen(false);
    } else {
      setIsCustomRangeOpen(true);
    }
  };

  // Handle granularity change
  const handleGranularityChange = (gran: 'daily' | 'weekly' | 'monthly') => {
    setGranularity(gran);
  };

  // Handle sort change
  const handleSortChange = (metricId: string) => {
    if (sortMetric === metricId) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortMetric(metricId);
      setSortDirection('desc');
    }
  };

  // Get sorted metrics
  const getSortedMetrics = () => {
    if (!sortMetric) return metrics;
    
    return [...metrics].sort((a, b) => {
      if (sortMetric === 'name') {
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      return 0;
    });
  };

  return (
    <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6 transition-colors ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 transition-colors">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">{description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {/* Time range selector */}
          <div className="flex items-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden transition-colors">
            <Calendar className="ml-3 w-4 h-4 text-gray-500 dark:text-gray-400 transition-colors" />
            <select
              className="w-full py-2 pl-2 pr-8 bg-transparent border-none focus:ring-0 text-sm text-gray-700 dark:text-gray-300 transition-colors focus:outline-none"
              value={timeRange}
              onChange={(e) => handleTimeRangeChange(e.target.value as '7d' | '30d' | '90d' | 'custom')}
            >
              <option value="7d" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">Last 7 Days</option>
              <option value="30d" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">Last 30 Days</option>
              <option value="90d" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">Last 90 Days</option>
              <option value="custom" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">Custom Range</option>
            </select>
          </div>
          
          {/* Granularity selector */}
          <div className="flex items-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden transition-colors">
            <Filter className="ml-3 w-4 h-4 text-gray-500 dark:text-gray-400 transition-colors" />
            <select
              className="w-full py-2 pl-2 pr-8 bg-transparent border-none focus:ring-0 text-sm text-gray-700 dark:text-gray-300 transition-colors focus:outline-none"
              value={granularity}
              onChange={(e) => handleGranularityChange(e.target.value as 'daily' | 'weekly' | 'monthly')}
            >
              <option value="daily" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">Daily</option>
              <option value="weekly" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">Weekly</option>
              <option value="monthly" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">Monthly</option>
            </select>
          </div>
          
          {/* Export button */}
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 bg-indigo-600 dark:bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-teal-700 transition-colors shadow-sm dark:shadow-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Custom date range picker (conditionally rendered) */}
      {isCustomRangeOpen && (
        <div className="mb-6 p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 transition-colors">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Start Date</label>
              <input
                type="date"
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:ring-indigo-500 dark:focus:ring-teal-500 focus:border-indigo-500 dark:focus:border-teal-500 transition-colors"
                value={customDateRange.start ? format(customDateRange.start, 'yyyy-MM-dd') : ''}
                onChange={(e) => setCustomDateRange({
                  ...customDateRange,
                  start: e.target.value ? new Date(e.target.value) : null
                })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">End Date</label>
              <input
                type="date"
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:ring-indigo-500 dark:focus:ring-teal-500 focus:border-indigo-500 dark:focus:border-teal-500 transition-colors"
                value={customDateRange.end ? format(customDateRange.end, 'yyyy-MM-dd') : ''}
                onChange={(e) => setCustomDateRange({
                  ...customDateRange,
                  end: e.target.value ? new Date(e.target.value) : null
                })}
                min={customDateRange.start ? format(customDateRange.start, 'yyyy-MM-dd') : undefined}
                max={format(new Date(), 'yyyy-MM-dd')}
              />
            </div>
            <div className="flex items-end">
              <button
                className="px-4 py-2 bg-indigo-600 dark:bg-teal-600 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {
                  if (customDateRange.start && customDateRange.end) {
                    // Apply custom date range
                    setTimeRange('custom');
                    setIsCustomRangeOpen(false);
                  }
                }}
                disabled={!customDateRange.start || !customDateRange.end}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Metric selector */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">Metrics</h4>
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="text-xs text-indigo-600 dark:text-teal-400 hover:text-indigo-800 dark:hover:text-teal-300 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded-sm px-1"
          >
            {showLegend ? 'Hide Legend' : 'Show Legend'}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
            <thead className="bg-gray-50 dark:bg-gray-700 transition-colors">
              <tr>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors">
                  <button 
                    className="flex items-center focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-700 rounded-sm px-1"
                    onClick={() => handleSortChange('name')}
                  >
                    Metric
                    {sortMetric === 'name' && (
                      sortDirection === 'asc' ? <ArrowUp className="ml-1 w-3 h-3" /> : <ArrowDown className="ml-1 w-3 h-3" />
                    )}
                  </button>
                </th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors">Description</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors">Unit</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors">Visible</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600 transition-colors">
              {getSortedMetrics().map((metric) => (
                <tr key={metric.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: metric.color }}></div>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors">{metric.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 transition-colors">{metric.description}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 transition-colors">{metric.unit}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-indigo-600 dark:text-teal-500 focus:ring-indigo-500 dark:focus:ring-teal-500 transition-colors"
                        checked={metric.visible}
                        onChange={() => toggleMetric(metric.id)}
                      />
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chart */}
      <div style={{ height: `${height}px` }} className="relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-700/50 bg-opacity-75 rounded-lg transition-colors">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-teal-500"></div>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-700/50 bg-opacity-75 rounded-lg transition-colors">
            <div className="text-red-500 dark:text-red-400 text-center transition-colors">
              <AlertCircle className="h-12 w-12 mx-auto mb-2" />
              <p>{error}</p>
              <button 
                className="mt-2 px-4 py-2 bg-indigo-600 dark:bg-teal-600 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-700"
                onClick={() => {
                  setIsLoading(true);
                  setError(null);
                  // Simulate data reload
                  setTimeout(() => {
                    setIsLoading(false);
                  }, 1000);
                }}
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <Line ref={chartRef} data={data} options={options} />
        )}
      </div>

      {/* Summary statistics */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.filter(m => m.visible).map(metric => {
          // Calculate average value for the metric
          const values = chartData.map(d => Number(d[metric.id]));
          const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
          
          // Calculate trend (compare first and last values)
          const firstValue = values[0] || 0;
          const lastValue = values[values.length - 1] || 0;
          const change = lastValue - firstValue;
          const percentChange = firstValue !== 0 ? (change / firstValue) * 100 : 0;
          
          return (
            <div key={metric.id} className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: metric.color }}></div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">{metric.name}</h4>
                </div>
                {percentChange !== 0 && (
                  <div className={`flex items-center text-xs transition-colors ${percentChange > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {percentChange > 0 ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                    {Math.abs(percentChange).toFixed(1)}%
                  </div>
                )}
              </div>
              <div className="text-xl font-semibold text-gray-900 dark:text-gray-100 transition-colors">
                {metric.unit === '%' ? `${avg.toFixed(1)}%` : 
                 metric.unit === '€' ? `€${avg.toFixed(3)}` :
                 metric.unit === 'seconds' ? `${avg.toFixed(1)}s` :
                 metric.unit === 'score' ? `${avg.toFixed(1)}/5` :
                 metric.unit === 'count' ? avg.toFixed(0) : avg.toFixed(1)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors">Average for selected period</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PerformanceChart;
