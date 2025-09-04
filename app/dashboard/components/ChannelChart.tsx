'use client';

import { useState, useEffect } from 'react';
import { dashboardAPI } from '../../services/api';

interface ChannelChartProps {
  selectedPeriod: string;
  selectedMonth: string;
  selectedBusinessArea: string;
  selectedChannel: string;
}

interface ChannelData {
  name: string;
  revenue: number;
  marketShare: number;
  growth: number;
}

export default function ChannelChart({
  selectedPeriod,
  selectedMonth,
  selectedBusinessArea,
  selectedChannel
}: ChannelChartProps) {
  const [chartData, setChartData] = useState<ChannelData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        // Mock data for now - replace with actual API call
        const mockData: ChannelData[] = [
          { name: 'Direct Sales', revenue: 5200000, marketShare: 0.35, growth: 0.18 },
          { name: 'E-commerce', revenue: 3800000, marketShare: 0.25, growth: 0.25 },
          { name: 'Retail Partners', revenue: 3200000, marketShare: 0.22, growth: 0.12 },
          { name: 'Distributors', revenue: 2800000, marketShare: 0.18, growth: 0.08 },
        ];
        setChartData(mockData);
      } catch (error) {
        console.error('Error fetching channel data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [selectedPeriod, selectedMonth, selectedBusinessArea, selectedChannel]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const totalRevenue = chartData.reduce((sum, d) => sum + d.revenue, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Channel Performance</h3>
      <div className="space-y-4">
        {chartData.map((data, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">{data.name}</span>
              <span className="text-sm text-gray-500">
                ${(data.revenue / 1000000).toFixed(1)}M
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-teal-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(data.revenue / totalRevenue) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Share: {(data.marketShare * 100).toFixed(1)}%</span>
              <span className={data.growth >= 0 ? 'text-green-600' : 'text-red-600'}>
                Growth: {(data.growth * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
