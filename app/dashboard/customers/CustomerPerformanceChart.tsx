
'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from 'recharts';
import { useState, useEffect } from 'react';
import { dashboardAPI } from '../../services/api';

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
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        setLoading(true);
        const params = {
          period: selectedPeriod,
          channel: selectedChannel !== 'All' ? selectedChannel : undefined,
          customer: selectedCustomer !== 'All' ? selectedCustomer : undefined,
        };

        // Fetch trend data for different metrics
        const [revenueData, marginData, unitsData, customersData] = await Promise.all([
          dashboardAPI.getTrend({ ...params, metric: 'gSales' }),
          dashboardAPI.getTrend({ ...params, metric: 'margin' }),
          dashboardAPI.getTrend({ ...params, metric: 'Cases' }),
          dashboardAPI.getTrend({ ...params, metric: 'customers' })
        ]);

        const revenue = revenueData.data.data || [];
        const margin = marginData.data.data || [];
        const units = unitsData.data.data || [];
        const customers = customersData.data.data || [];

        // Merge all trend data by month
        const mergedData = revenue.map((item: any, index: number) => ({
          month: item.period?.substring(0, 3) || `Month ${index + 1}`,
          revenue: item.value || 0,
          margin: margin[index]?.value || 0,
          units: units[index]?.value || 0,
          customers: customers[index]?.value || 0
        }));

        setPerformanceData(mergedData);
      } catch (error) {
        console.error('Error fetching performance data:', error);
        setPerformanceData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, [selectedPeriod, selectedChannel, selectedCustomer]);

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
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-500">Loading performance data...</p>
            </div>
          </div>
        ) : performanceData.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-gray-500">No performance data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        )}
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
