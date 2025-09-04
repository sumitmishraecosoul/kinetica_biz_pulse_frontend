'use client';

import { useState, useEffect } from 'react';
import { dashboardAPI } from '../../services/api';

interface BusinessAreaChartProps {
  selectedPeriod: string;
  selectedMonth: string;
  selectedBusinessArea: string;
  selectedChannel: string;
}

interface BusinessAreaData {
  name: string;
  revenue: number;
  margin: number;
  growth: number;
}

export default function BusinessAreaChart({
  selectedPeriod,
  selectedMonth,
  selectedBusinessArea,
  selectedChannel
}: BusinessAreaChartProps) {
  const [chartData, setChartData] = useState<BusinessAreaData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        // Mock data for now - replace with actual API call
        const mockData: BusinessAreaData[] = [
          { name: 'Food', revenue: 8500000, margin: 0.28, growth: 0.15 },
          { name: 'Household', revenue: 6200000, margin: 0.32, growth: 0.12 },
          { name: 'Brillio & KMPL', revenue: 4800000, margin: 0.25, growth: 0.08 },
          { name: 'Kinetica', revenue: 3200000, margin: 0.35, growth: 0.22 },
        ];
        setChartData(mockData);
      } catch (error) {
        console.error('Error fetching business area data:', error);
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

  const maxRevenue = Math.max(...chartData.map(d => d.revenue));

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Area Performance</h3>
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
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(data.revenue / maxRevenue) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Margin: {(data.margin * 100).toFixed(1)}%</span>
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
