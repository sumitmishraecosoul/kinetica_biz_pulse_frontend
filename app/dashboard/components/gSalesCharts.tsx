'use client';

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { dashboardChartsAPI } from '../../services/dashboardAPI';

interface ChartProps {
  filters: any;
}

interface ChartData {
  business?: string;
  channel?: string;
  month?: string;
  '2023': number;
  '2024': number;
  '2025': number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Custom Tooltip component to completely remove grey background
const CustomTooltip = ({ active, payload, label, formatter }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="text-gray-900 font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-gray-700" style={{ color: entry.color }}>
            {entry.name}: {formatter ? formatter(entry.value) : Math.round(entry.value).toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function GSalesByBusinessUnit({ filters }: ChartProps) {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await dashboardChartsAPI.getGSalesByBusiness(filters);
        setChartData(data);
      } catch (err) {
        console.error('Error fetching gSales by Business data:', err);
        setError('Failed to load gSales by Business data');
      } finally {
        setLoading(false);
      }
    };

    if (filters) {
      fetchData();
    }
  }, [filters]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">gSales by Business Unit</h3>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">gSales by Business Unit</h3>
        <div className="h-64 flex items-center justify-center text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">gSales by Business Unit</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="business" />
          <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`} />
          <Tooltip content={<CustomTooltip formatter={(value: any) => Math.round(value).toLocaleString()} />} />
          <Legend />
          {filters?.year?.includes('2023') && (
            <Bar dataKey="2023" fill="#3B82F6" name="2023" />
          )}
          {filters?.year?.includes('2024') && (
            <Bar dataKey="2024" fill="#10B981" name="2024" />
          )}
          {filters?.year?.includes('2025') && (
            <Bar dataKey="2025" fill="#8B5CF6" name="2025" />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function GSalesByChannel({ filters }: ChartProps) {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await dashboardChartsAPI.getGSalesByChannel(filters);
        setChartData(data);
      } catch (err) {
        console.error('Error fetching gSales by Channel data:', err);
        setError('Failed to load gSales by Channel data');
      } finally {
        setLoading(false);
      }
    };

    if (filters) {
      fetchData();
    }
  }, [filters]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">gSales by Channel</h3>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">gSales by Channel</h3>
        <div className="h-64 flex items-center justify-center text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">gSales by Channel</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="channel" />
          <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`} />
          <Tooltip content={<CustomTooltip formatter={(value: any) => Math.round(value).toLocaleString()} />} />
          <Legend />
          {filters?.year?.includes('2023') && (
            <Bar dataKey="2023" fill="#3B82F6" name="2023" />
          )}
          {filters?.year?.includes('2024') && (
            <Bar dataKey="2024" fill="#10B981" name="2024" />
          )}
          {filters?.year?.includes('2025') && (
            <Bar dataKey="2025" fill="#8B5CF6" name="2025" />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function GSalesMonthlyTrend({ filters }: ChartProps) {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await dashboardChartsAPI.getGSalesMonthlyTrend(filters);
        setChartData(data);
      } catch (err) {
        console.error('Error fetching gSales Monthly Trend data:', err);
        setError('Failed to load gSales Monthly Trend data');
      } finally {
        setLoading(false);
      }
    };

    if (filters) {
      fetchData();
    }
  }, [filters]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">gSales Monthly Trend (YTD)</h3>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">gSales Monthly Trend (YTD)</h3>
        <div className="h-64 flex items-center justify-center text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">gSales Monthly Trend (YTD)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`} />
          <Tooltip content={<CustomTooltip formatter={(value: any) => Math.round(value).toLocaleString()} />} />
          <Legend />
          {filters?.year?.includes('2023') && (
            <Line type="monotone" dataKey="2023" stroke="#3B82F6" strokeWidth={2} name="2023" />
          )}
          {filters?.year?.includes('2024') && (
            <Line type="monotone" dataKey="2024" stroke="#10B981" strokeWidth={2} name="2024" />
          )}
          {filters?.year?.includes('2025') && (
            <Line type="monotone" dataKey="2025" stroke="#8B5CF6" strokeWidth={2} name="2025" />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// gSales Analysis Section Header
export function GSalesAnalysisHeader() {
  return (
    <div className="w-full bg-gray-800 text-white py-4 mb-6">
      <h2 className="text-2xl font-bold text-center">gSales Analysis</h2>
    </div>
  );
}
