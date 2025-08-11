
'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface CategoryTrendsChartProps {
  selectedPeriod: string;
  selectedBusinessArea: string;
  selectedCategory: string;
  onDrillDown: (data: any) => void;
}

export default function CategoryTrendsChart({
  selectedPeriod,
  selectedBusinessArea,
  selectedCategory,
  onDrillDown
}: CategoryTrendsChartProps) {
  const trendsData = [
    { month: 'Jan', snacks: 85000, beverages: 72000, cleaning: 54000, kitchen: 38000, nutrition: 28000 },
    { month: 'Feb', snacks: 89000, beverages: 75000, cleaning: 56000, kitchen: 39000, nutrition: 30000 },
    { month: 'Mar', snacks: 92000, beverages: 78000, cleaning: 58000, kitchen: 40000, nutrition: 32000 },
    { month: 'Apr', snacks: 96000, beverages: 81000, cleaning: 61000, kitchen: 41000, nutrition: 34000 },
    { month: 'May', snacks: 99000, beverages: 84000, cleaning: 63000, kitchen: 42000, nutrition: 36000 },
    { month: 'Jun', snacks: 95000, beverages: 82000, cleaning: 60000, kitchen: 41000, nutrition: 35000 },
    { month: 'Jul', snacks: 102000, beverages: 87000, cleaning: 65000, kitchen: 43000, nutrition: 38000 },
    { month: 'Aug', snacks: 105000, beverages: 89000, cleaning: 67000, kitchen: 44000, nutrition: 40000 },
    { month: 'Sep', snacks: 108000, beverages: 91000, cleaning: 69000, kitchen: 45000, nutrition: 42000 },
    { month: 'Oct', snacks: 112000, beverages: 94000, cleaning: 72000, kitchen: 46000, nutrition: 44000 },
    { month: 'Nov', snacks: 115000, beverages: 96000, cleaning: 74000, kitchen: 47000, nutrition: 46000 },
    { month: 'Dec', snacks: 118000, beverages: 98000, cleaning: 76000, kitchen: 48000, nutrition: 48000 }
  ];

  const categoryColors = {
    snacks: '#3B82F6',
    beverages: '#10B981',
    cleaning: '#F59E0B',
    kitchen: '#8B5CF6',
    nutrition: '#EF4444'
  };

  const categoryLabels = {
    snacks: 'Snacks',
    beverages: 'Beverages',
    cleaning: 'Cleaning',
    kitchen: 'Kitchen',
    nutrition: 'Sports Nutrition'
  };

  const handleChartClick = (data: any) => {
    if (data && data.activePayload) {
      const clickedData = data.activePayload[0].payload;
      onDrillDown({
        type: 'category-trends',
        title: `Category Trends - ${clickedData.month}`,
        data: clickedData,
        period: selectedPeriod
      });
    }
  };

  const formatValue = (value: number) => {
    return `€${(value / 1000).toFixed(0)}K`;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Category Performance Trends</h3>
          <p className="text-sm text-gray-500 mt-1">Monthly revenue trends by category</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 whitespace-nowrap">
            Export Chart
          </button>
          <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <i className="ri-more-2-line"></i>
          </button>
        </div>
      </div>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendsData} onClick={handleChartClick}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280" 
              fontSize={12}
              tick={{ fill: '#6b7280' }}
            />
            <YAxis 
              stroke="#6b7280" 
              fontSize={12}
              tick={{ fill: '#6b7280' }}
              tickFormatter={formatValue}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: number, name: string) => [
                formatValue(value), 
                categoryLabels[name as keyof typeof categoryLabels]
              ]}
            />
            <Legend />
            
            {Object.entries(categoryColors).map(([category, color]) => (
              <Line
                key={category}
                type="monotone"
                dataKey={category}
                stroke={color}
                strokeWidth={2}
                dot={{ fill: color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
                name={categoryLabels[category as keyof typeof categoryLabels]}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          {Object.entries(categoryLabels).map(([key, label]) => (
            <div key={key} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: categoryColors[key as keyof typeof categoryColors] }}
              ></div>
              <span className="text-gray-700">{label}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center text-sm text-gray-500">
          Click on data points for detailed monthly analysis
        </div>
      </div>
    </div>
  );
}
