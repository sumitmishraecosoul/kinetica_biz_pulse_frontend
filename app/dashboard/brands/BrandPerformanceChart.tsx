
'use client';

import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from 'recharts';

interface BrandPerformanceChartProps {
  selectedBusinessArea: string;
  selectedBrand: string;
  selectedPeriod: string;
  selectedMetric: string;
  onDrillDown: (data: any) => void;
}

export default function BrandPerformanceChart({ selectedBusinessArea, selectedBrand, selectedPeriod, selectedMetric, onDrillDown }: BrandPerformanceChartProps) {
  const [chartType, setChartType] = useState('area');

  const monthlyData = [
    { month: 'Jan', revenue: 980000, margin: 28.2, units: 45200, growth: 8.1 },
    { month: 'Feb', revenue: 1050000, margin: 29.1, units: 48300, growth: 9.4 },
    { month: 'Mar', revenue: 1120000, margin: 27.8, units: 51200, growth: 11.2 },
    { month: 'Apr', revenue: 1080000, margin: 28.9, units: 49800, growth: 7.8 },
    { month: 'May', revenue: 1150000, margin: 30.2, units: 52100, growth: 12.3 },
    { month: 'Jun', revenue: 1200000, margin: 29.5, units: 54600, growth: 10.7 },
    { month: 'Jul', revenue: 1180000, margin: 28.7, units: 53400, growth: 9.2 },
    { month: 'Aug', revenue: 1250000, margin: 31.1, units: 56200, growth: 13.5 },
    { month: 'Sep', revenue: 1300000, margin: 29.8, units: 58700, growth: 11.9 },
    { month: 'Oct', revenue: 1220000, margin: 28.4, units: 55300, growth: 8.6 },
    { month: 'Nov', revenue: 1350000, margin: 30.5, units: 60100, growth: 14.2 },
    { month: 'Dec', revenue: 1400000, margin: 32.1, units: 62800, growth: 16.4 }
  ];

  const formatValue = (value: number) => {
    if (selectedMetric === 'revenue') {
      return `€${(value / 1000).toFixed(0)}K`;
    } else if (selectedMetric === 'margin') {
      return `${value}%`;
    } else if (selectedMetric === 'units') {
      return `${(value / 1000).toFixed(1)}K`;
    } else {
      return `${value}%`;
    }
  };

  const getMetricValue = (item: any) => {
    return item[selectedMetric];
  };

  const renderChart = () => {
    const commonProps = {
      data: monthlyData,
      margin: { top: 20, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={formatValue} />
            <Tooltip formatter={(value: any) => [formatValue(value), selectedMetric]} />
            <Bar dataKey={selectedMetric} fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={formatValue} />
            <Tooltip formatter={(value: any) => [formatValue(value), selectedMetric]} />
            <Line type="monotone" dataKey={selectedMetric} stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6' }} />
          </LineChart>
        );
      default:
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={formatValue} />
            <Tooltip formatter={(value: any) => [formatValue(value), selectedMetric]} />
            <Area type="monotone" dataKey={selectedMetric} stroke="#3B82F6" fill="url(#colorGradient)" />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
          </AreaChart>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Brand Performance Trend</h3>
          <p className="text-sm text-gray-500 capitalize">{selectedMetric} over time</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button 
              className={`px-3 py-1 rounded-md text-sm whitespace-nowrap ${chartType === 'area' ? 'bg-white shadow-sm' : ''}`}
              onClick={() => setChartType('area')}
            >
              Area
            </button>
            <button 
              className={`px-3 py-1 rounded-md text-sm whitespace-nowrap ${chartType === 'bar' ? 'bg-white shadow-sm' : ''}`}
              onClick={() => setChartType('bar')}
            >
              Bar
            </button>
            <button 
              className={`px-3 py-1 rounded-md text-sm whitespace-nowrap ${chartType === 'line' ? 'bg-white shadow-sm' : ''}`}
              onClick={() => setChartType('line')}
            >
              Line
            </button>
          </div>
          <button 
            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 border border-gray-300 rounded"
            onClick={() => onDrillDown({ type: 'chart', data: monthlyData })}
          >
            <i className="ri-fullscreen-line"></i>
          </button>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t">
        <div className="text-center">
          <p className="text-xs text-gray-500">Best Month</p>
          <p className="font-semibold">December</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Avg Growth</p>
          <p className="font-semibold text-green-600">+10.8%</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Peak Value</p>
          <p className="font-semibold">{formatValue(Math.max(...monthlyData.map(getMetricValue)))}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Trend</p>
          <p className="font-semibold text-green-600">
            <i className="ri-trending-up-line mr-1"></i>Rising
          </p>
        </div>
      </div>
    </div>
  );
}
