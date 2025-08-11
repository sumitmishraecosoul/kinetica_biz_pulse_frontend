
'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from 'recharts';
import { useState } from 'react';

interface CustomerPerformanceChartProps {
  selectedPeriod: string;
  selectedChannel: string;
  selectedCustomer: string;
  selectedMetric: string;
  setSelectedMetric: (metric: string) => void;
  onDrillDown: (data: any) => void;
}

export default function CustomerPerformanceChart({
  selectedPeriod,
  selectedChannel,
  selectedCustomer,
  selectedMetric,
  setSelectedMetric,
  onDrillDown
}: CustomerPerformanceChartProps) {
  const [chartType, setChartType] = useState('area');

  const performanceData = [
    { month: 'Jan', revenue: 180000, margin: 22.5, units: 8500, customers: 42 },
    { month: 'Feb', revenue: 195000, margin: 24.1, units: 9200, customers: 45 },
    { month: 'Mar', revenue: 210000, margin: 23.8, units: 9800, customers: 48 },
    { month: 'Apr', revenue: 225000, margin: 25.2, units: 10500, customers: 52 },
    { month: 'May', revenue: 240000, margin: 26.1, units: 11200, customers: 55 },
    { month: 'Jun', revenue: 235000, margin: 25.8, units: 10900, customers: 58 },
    { month: 'Jul', revenue: 250000, margin: 27.2, units: 11800, customers: 61 },
    { month: 'Aug', revenue: 265000, margin: 28.1, units: 12400, customers: 64 },
    { month: 'Sep', revenue: 280000, margin: 27.9, units: 13100, customers: 67 },
    { month: 'Oct', revenue: 295000, margin: 29.3, units: 13800, customers: 70 },
    { month: 'Nov', revenue: 310000, margin: 30.1, units: 14500, customers: 73 },
    { month: 'Dec', revenue: 325000, margin: 31.2, units: 15200, customers: 76 }
  ];

  const metrics = [
    { value: 'revenue', label: 'Revenue', color: '#3B82F6' },
    { value: 'margin', label: 'Margin %', color: '#10B981' },
    { value: 'units', label: 'Units Sold', color: '#F59E0B' },
    { value: 'customers', label: 'Active Customers', color: '#8B5CF6' }
  ];

  const chartTypes = [
    { value: 'area', icon: 'ri-line-chart-line', label: 'Area' },
    { value: 'bar', icon: 'ri-bar-chart-line', label: 'Bar' },
    { value: 'line', icon: 'ri-stock-line', label: 'Line' }
  ];

  const formatValue = (value: number, metric: string) => {
    switch (metric) {
      case 'revenue':
        return `€${(value / 1000).toFixed(0)}K`;
      case 'margin':
        return `${value.toFixed(1)}%`;
      case 'units':
        return (value / 1000).toFixed(1) + 'K';
      case 'customers':
        return value.toString();
      default:
        return value.toString();
    }
  };

  const handleChartClick = (data: any) => {
    if (data && data.activePayload) {
      const clickedData = data.activePayload[0].payload;
      onDrillDown({
        type: 'customer-performance',
        title: `${metrics.find(m => m.value === selectedMetric)?.label} - ${clickedData.month}`,
        data: clickedData,
        metric: selectedMetric,
        period: selectedPeriod
      });
    }
  };

  const renderChart = () => {
    const currentMetric = metrics.find(m => m.value === selectedMetric);
    
    switch (chartType) {
      case 'bar':
        return (
          <BarChart data={performanceData} onClick={handleChartClick}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: number) => [formatValue(value, selectedMetric), currentMetric?.label]}
            />
            <Bar dataKey={selectedMetric} fill={currentMetric?.color} radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={performanceData} onClick={handleChartClick}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: number) => [formatValue(value, selectedMetric), currentMetric?.label]}
            />
            <Line 
              type="monotone" 
              dataKey={selectedMetric} 
              stroke={currentMetric?.color}
              strokeWidth={3}
              dot={{ fill: currentMetric?.color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        );
      default:
        return (
          <AreaChart data={performanceData} onClick={handleChartClick}>
            <defs>
              <linearGradient id={`gradient-${selectedMetric}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={currentMetric?.color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={currentMetric?.color} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: number) => [formatValue(value, selectedMetric), currentMetric?.label]}
            />
            <Area
              type="monotone"
              dataKey={selectedMetric}
              stroke={currentMetric?.color}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#gradient-${selectedMetric})`}
            />
          </AreaChart>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Customer Performance Trends</h3>
          <p className="text-sm text-gray-500 mt-1">Track key customer metrics over time</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {chartTypes.map(type => (
              <button
                key={type.value}
                onClick={() => setChartType(type.value)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors duration-200 ${
                  chartType === type.value
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
                title={type.label}
              >
                <i className={type.icon}></i>
              </button>
            ))}
          </div>
          <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <i className="ri-more-2-line"></i>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {metrics.map(metric => (
          <button
            key={metric.value}
            onClick={() => setSelectedMetric(metric.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedMetric === metric.value
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {metric.label}
          </button>
        ))}
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Click on data points for detailed analysis</span>
          <span>Data updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
