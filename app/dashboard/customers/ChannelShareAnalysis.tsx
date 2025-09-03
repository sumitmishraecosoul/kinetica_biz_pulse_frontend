
'use client';

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { dashboardAPI } from '../../services/api';

interface ChannelShareAnalysisProps {
  selectedPeriod: string;
  selectedBusinessArea: string;
  onDrillDown: (data: any) => void;
}

interface ChannelData {
  channel: string;
  revenue: number;
  margin: number;
  growth: number;
  marketShare: number;
  customerCount: number;
  customers: string[];
  performance: string;
}

export default function ChannelShareAnalysis({
  selectedPeriod,
  selectedBusinessArea,
  onDrillDown
}: ChannelShareAnalysisProps) {
  const [channelData, setChannelData] = useState<ChannelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          period: selectedPeriod,
          businessArea: selectedBusinessArea !== 'All' ? selectedBusinessArea : undefined,
        };

        const response = await dashboardAPI.getCustomerChannels(params);
        const channels = response.data.data || [];
        
        // Calculate total revenue for market share validation
        const totalRevenue = channels.reduce((sum: number, channel: any) => sum + (channel.revenue || 0), 0);
        
        // Validate and enhance channel data
        const enhancedData = channels.map((channel: any) => ({
          channel: channel.channel || 'Unknown',
          revenue: channel.revenue || 0,
          margin: channel.margin || 0,
          growth: channel.growth || 0,
          marketShare: totalRevenue > 0 ? ((channel.revenue || 0) / totalRevenue) * 100 : 0,
          customerCount: channel.customerCount || 0,
          customers: channel.customers || [],
          performance: channel.performance || 'medium'
        })).sort((a: any, b: any) => b.revenue - a.revenue);

        setChannelData(enhancedData);
      } catch (error) {
        console.error('Error fetching channel data:', error);
        setError('Failed to load channel data');
        setChannelData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChannelData();
  }, [selectedPeriod, selectedBusinessArea]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getChannelColor = (index: number) => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4', '#84CC16'];
    return colors[index % colors.length];
  };

  const handleChannelClick = (channel: ChannelData) => {
    onDrillDown({
      type: 'channel-share',
      title: `${channel.channel} Analysis`,
      data: {
        channel: channel.channel,
        marketShare: channel.marketShare,
        revenue: channel.revenue,
        customerCount: channel.customerCount,
        averageCustomerValue: channel.customerCount > 0 ? channel.revenue / channel.customerCount : 0,
        period: selectedPeriod
      }
    });
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <h4 className="font-medium text-gray-900 mb-2">{data.channel}</h4>
          <div className="space-y-1 text-sm">
            <p className="text-gray-600">Share: <span className="font-medium">{data.marketShare.toFixed(1)}%</span></p>
            <p className="text-gray-600">Revenue: <span className="font-medium">{formatCurrency(data.revenue)}</span></p>
            <p className="text-gray-600">Customers: <span className="font-medium">{data.customerCount}</span></p>
            <p className="text-gray-600">Growth: <span className={`font-medium ${data.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.growth >= 0 ? '+' : ''}{data.growth.toFixed(1)}%
            </span></p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <img src="/assets/Heart.svg" alt="Heart" className="w-5 h-5" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Channel Share Analysis</h3>
            <p className="text-sm text-gray-500 mt-1">Revenue distribution by channel</p>
          </div>
        </div>
        <div className="h-64 mb-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-500">Loading channel data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || channelData.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <img src="/assets/Heart.svg" alt="Heart" className="w-5 h-5" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Channel Share Analysis</h3>
            <p className="text-sm text-gray-500 mt-1">Revenue distribution by channel</p>
          </div>
        </div>
        <div className="h-64 mb-6 flex items-center justify-center">
          <p className="text-sm text-red-500">{error || 'No channel data available'}</p>
        </div>
      </div>
    );
  }

  // Calculate totals for summary
  const totalRevenue = channelData.reduce((sum, channel) => sum + channel.revenue, 0);
  const totalCustomers = channelData.reduce((sum, channel) => sum + channel.customerCount, 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <img src="/assets/Heart.svg" alt="Heart" className="w-5 h-5" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Channel Share Analysis</h3>
            <p className="text-sm text-gray-500 mt-1">Revenue distribution by channel</p>
          </div>
        </div>
        <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
          <i className="ri-more-2-line"></i>
        </button>
      </div>

      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={channelData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={40}
              paddingAngle={2}
              dataKey="marketShare"
            >
              {channelData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getChannelColor(index)}
                  className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
                  onClick={() => handleChannelClick(entry)}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3">
        {channelData.map((channel, index) => (
          <div
            key={index}
            onClick={() => handleChannelClick(channel)}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200 group"
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getChannelColor(index) }}
              ></div>
              <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                {channel.channel}
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">{channel.marketShare.toFixed(1)}%</div>
              <div className="text-xs text-gray-500">{channel.customerCount} customers</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-gray-900">{formatCurrency(totalRevenue)}</div>
            <div className="text-xs text-gray-500">Total Revenue</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">{totalCustomers}</div>
            <div className="text-xs text-gray-500">Total Customers</div>
          </div>
        </div>
      </div>
    </div>
  );
}
