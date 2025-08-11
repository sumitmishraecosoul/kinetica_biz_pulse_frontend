
'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ChannelShareAnalysisProps {
  selectedPeriod: string;
  selectedBusinessArea: string;
  onDrillDown: (data: any) => void;
}

export default function ChannelShareAnalysis({
  selectedPeriod,
  selectedBusinessArea,
  onDrillDown
}: ChannelShareAnalysisProps) {
  const channelData = [
    { name: 'Grocery ROI', value: 35.2, revenue: 845000, customers: 28, color: '#3B82F6' },
    { name: 'Grocery NI/UK', value: 28.5, revenue: 684000, customers: 24, color: '#10B981' },
    { name: 'Wholesale ROI', value: 15.8, revenue: 379000, customers: 18, color: '#F59E0B' },
    { name: 'Wholesale NI/UK', value: 12.3, revenue: 295000, customers: 15, color: '#8B5CF6' },
    { name: 'International', value: 4.2, revenue: 101000, customers: 8, color: '#EF4444' },
    { name: 'Online', value: 2.8, revenue: 67000, customers: 12, color: '#06B6D4' },
    { name: 'Sports & Others', value: 1.2, revenue: 29000, customers: 5, color: '#84CC16' }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleChannelClick = (channel: any) => {
    onDrillDown({
      type: 'channel-share',
      title: `${channel.name} Analysis`,
      data: {
        channel: channel.name,
        marketShare: channel.value,
        revenue: channel.revenue,
        customerCount: channel.customers,
        averageCustomerValue: channel.revenue / channel.customers,
        period: selectedPeriod
      }
    });
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <h4 className="font-medium text-gray-900 mb-2">{data.name}</h4>
          <div className="space-y-1 text-sm">
            <p className="text-gray-600">Share: <span className="font-medium">{data.value}%</span></p>
            <p className="text-gray-600">Revenue: <span className="font-medium">{formatCurrency(data.revenue)}</span></p>
            <p className="text-gray-600">Customers: <span className="font-medium">{data.customers}</span></p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Channel Share Analysis</h3>
          <p className="text-sm text-gray-500 mt-1">Revenue distribution by channel</p>
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
              dataKey="value"
            >
              {channelData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
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
                style={{ backgroundColor: channel.color }}
              ></div>
              <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                {channel.name}
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">{channel.value}%</div>
              <div className="text-xs text-gray-500">{channel.customers} customers</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-gray-900">€2.4M</div>
            <div className="text-xs text-gray-500">Total Revenue</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">110</div>
            <div className="text-xs text-gray-500">Total Customers</div>
          </div>
        </div>
      </div>
    </div>
  );
}
