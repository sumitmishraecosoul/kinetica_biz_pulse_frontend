'use client';

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';
import { dashboardChartsAPI } from '../../services/dashboardAPI';

interface AnalyticsSectionProps {
  title: string;
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

// Format numbers to millions, billions, or thousands
const formatNumber = (value: number) => {
  if (value >= 1000000000) {
    return (value / 1000000000).toFixed(1) + 'B';
  } else if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M';
  } else if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K';
  }
  return value.toString();
};

// Custom Tooltip component with formatted numbers
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="text-gray-900 font-medium" title={label}>{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-gray-700" style={{ color: entry.color }}>
            {entry.name}: {formatNumber(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AnalyticsSection = ({ title, filters }: AnalyticsSectionProps) => {
  const [businessData, setBusinessData] = useState<ChartData[]>([]);
  const [channelData, setChannelData] = useState<ChartData[]>([]);
  const [monthlyData, setMonthlyData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log(`${title}: Fetching data with filters:`, filters);

        let businessPromise, channelPromise, monthlyPromise;

        if (title === 'fGP Analysis') {
          businessPromise = dashboardChartsAPI.getFGPByBusiness(filters);
          channelPromise = dashboardChartsAPI.getFGPByChannel(filters);
          monthlyPromise = dashboardChartsAPI.getFGPMonthlyTrend(filters);
        } else if (title === 'Cases Analysis') {
          businessPromise = dashboardChartsAPI.getCasesByBusiness(filters);
          channelPromise = dashboardChartsAPI.getCasesByChannel(filters);
          monthlyPromise = dashboardChartsAPI.getCasesMonthlyTrend(filters);
        } else {
          businessPromise = dashboardChartsAPI.getGSalesByBusiness(filters);
          channelPromise = dashboardChartsAPI.getGSalesByChannel(filters);
          monthlyPromise = dashboardChartsAPI.getGSalesMonthlyTrend(filters);
        }

        const [business, channel, monthly] = await Promise.all([
          businessPromise,
          channelPromise,
          monthlyPromise
        ]);

        setBusinessData(business);
        setChannelData(channel);
        setMonthlyData(monthly);
      } catch (err) {
        console.error(`Error fetching ${title} data:`, err);
        setError(`Failed to load ${title} data`);
      } finally {
        setLoading(false);
      }
    };

    if (filters) {
      fetchData();
    }
  }, [filters, title]);

  if (loading) {
    return (
      <div className="mb-8">
        <div className="dashboard-section-header px-6 py-3 mb-6">
          <h2 className="text-lg font-medium">{title}</h2>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dashboard-blue"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8">
        <div className="dashboard-section-header px-6 py-3 mb-6">
          <h2 className="text-lg font-medium">{title}</h2>
        </div>
        <div className="flex items-center justify-center h-64 text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      {/* Section Header */}
      <div className="dashboard-section-header px-6 py-3 mb-6">
        <h2 className="text-lg font-medium">{title}</h2>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Left Chart - Business Unit */}
        <div className="dashboard-card p-6">
          <h3 className="text-sm font-medium text-dashboard-gray-dark mb-4">
            {title === 'fGP Analysis' ? 'fGP by Business Unit' : title === 'Cases Analysis' ? 'Cases by Business Unit' : 'gSales by Business Unit'}
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={businessData}>
              <XAxis dataKey="business" tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip content={<CustomTooltip />} />
              {filters?.year?.includes('2023') && (
                <Bar dataKey="2023" fill="#6B7280" name="2023" />
              )}
              {filters?.year?.includes('2024') && (
                <Bar dataKey="2024" fill="#F97316" name="2024" />
              )}
              {filters?.year?.includes('2025') && (
                <Bar dataKey="2025" fill="#3B82F6" name="2025" />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Right Chart - Channel */}
        <div className="dashboard-card p-6">
          <h3 className="text-sm font-medium text-dashboard-gray-dark mb-4">
            {title === 'fGP Analysis' ? 'fGP by Channel' : title === 'Cases Analysis' ? 'Cases by Channel' : 'gSales by Channel'}
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={channelData}>
              <XAxis dataKey="channel" tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip content={<CustomTooltip />} />
              {filters?.year?.includes('2023') && (
                <Bar dataKey="2023" fill="#6B7280" name="2023" />
              )}
              {filters?.year?.includes('2024') && (
                <Bar dataKey="2024" fill="#F97316" name="2024" />
              )}
              {filters?.year?.includes('2025') && (
                <Bar dataKey="2025" fill="#3B82F6" name="2025" />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Line Chart */}
      <div className="dashboard-card p-6">
        <h3 className="text-sm font-medium text-dashboard-gray-dark mb-4">
          {title === 'fGP Analysis' ? 'fGP Monthly Trend' : title === 'Cases Analysis' ? 'Cases Monthly Trend' : 'gSales Monthly Trend'}
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={monthlyData}>
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
            <Tooltip content={<CustomTooltip />} />
            {filters?.year?.includes('2023') && (
              <Line 
                type="monotone" 
                dataKey="2023" 
                stroke="#6B7280" 
                strokeWidth={2}
                dot={{ fill: '#6B7280', strokeWidth: 2, r: 4 }}
                name="2023"
              />
            )}
            {filters?.year?.includes('2024') && (
              <Line 
                type="monotone" 
                dataKey="2024" 
                stroke="#F97316" 
                strokeWidth={2}
                dot={{ fill: '#F97316', strokeWidth: 2, r: 4 }}
                name="2024"
              />
            )}
            {filters?.year?.includes('2025') && (
              <Line 
                type="monotone" 
                dataKey="2025" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                name="2025"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center mt-4 space-x-6 text-sm">
          {filters?.year?.includes('2023') && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#6B7280' }}></div>
              <span className="text-dashboard-gray-dark">2023</span>
            </div>
          )}
          {filters?.year?.includes('2024') && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#F97316' }}></div>
              <span className="text-dashboard-gray-dark">2024</span>
            </div>
          )}
          {filters?.year?.includes('2025') && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#3B82F6' }}></div>
              <span className="text-dashboard-gray-dark">2025</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSection;
