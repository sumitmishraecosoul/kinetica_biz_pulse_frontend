'use client';

import { useState, useEffect } from 'react';
import { dashboardAPI } from '../../services/api';

interface RevenueChartProps {
  selectedPeriod: string;
  selectedMonth: string;
  selectedBusinessArea: string;
  selectedChannel: string;
}

interface ChartData {
  month: string;
  revenue: number;
  cost: number;
  profit: number;
}

export default function RevenueChart({
  selectedPeriod,
  selectedMonth,
  selectedBusinessArea,
  selectedChannel
}: RevenueChartProps) {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        // Mock data for now - replace with actual API call
        const mockData: ChartData[] = [
          { month: 'Jan', revenue: 1250000, cost: 875000, profit: 375000 },
          { month: 'Feb', revenue: 1380000, cost: 966000, profit: 414000 },
          { month: 'Mar', revenue: 1420000, cost: 994000, profit: 426000 },
          { month: 'Apr', revenue: 1350000, cost: 945000, profit: 405000 },
          { month: 'May', revenue: 1480000, cost: 1036000, profit: 444000 },
          { month: 'Jun', revenue: 1520000, cost: 1064000, profit: 456000 },
        ];
        setChartData(mockData);
      } catch (error) {
        console.error('Error fetching chart data:', error);
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
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...chartData.map(d => Math.max(d.revenue, d.cost, d.profit)));

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
      <div className="space-y-3">
        {chartData.map((data, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="w-16 text-sm text-gray-600">{data.month}</div>
            <div className="flex-1">
              <div className="flex space-x-2">
                <div className="flex-1 bg-blue-100 rounded h-6 relative">
                  <div 
                    className="bg-blue-500 h-6 rounded"
                    style={{ width: `${(data.revenue / maxValue) * 100}%` }}
                  ></div>
                  <span className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium">
                    ${(data.revenue / 1000000).toFixed(1)}M
                  </span>
                </div>
                <div className="flex-1 bg-red-100 rounded h-6 relative">
                  <div 
                    className="bg-red-500 h-6 rounded"
                    style={{ width: `${(data.cost / maxValue) * 100}%` }}
                  ></div>
                  <span className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium">
                    ${(data.cost / 1000000).toFixed(1)}M
                  </span>
                </div>
                <div className="flex-1 bg-green-100 rounded h-6 relative">
                  <div 
                    className="bg-green-500 h-6 rounded"
                    style={{ width: `${(data.profit / maxValue) * 100}%` }}
                  ></div>
                  <span className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium">
                    ${(data.profit / 1000000).toFixed(1)}M
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center space-x-6 mt-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span>Revenue</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>Cost</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Profit</span>
        </div>
      </div>
    </div>
  );
}
