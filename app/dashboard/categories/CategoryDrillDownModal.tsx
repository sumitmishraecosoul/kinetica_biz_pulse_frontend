
'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface CategoryDrillDownModalProps {
  data: any;
  onClose: () => void;
}

export default function CategoryDrillDownModal({ data, onClose }: CategoryDrillDownModalProps) {
  const getDetailedData = () => {
    switch (data.type) {
      case 'category-overview':
        return {
          title: data.title,
          sections: [
            {
              title: 'Category Metrics',
              type: 'stats',
              data: Object.entries(data.data).map(([key, value]) => ({
                label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
                value: value
              }))
            }
          ]
        };
      
      case 'category-performance':
        const category = data.data;
        return {
          title: data.title,
          sections: [
            {
              title: 'Performance Metrics',
              type: 'stats',
              data: [
                { label: 'Revenue', value: `€${(category.revenue / 1000).toFixed(0)}K` },
                { label: 'Margin', value: `${category.margin.toFixed(1)}%` },
                { label: 'Growth', value: `${category.growth > 0 ? '+' : ''}${category.growth.toFixed(1)}%` },
                { label: 'Market Share', value: `${category.marketShare.toFixed(1)}%` },
                { label: 'Sub-Categories', value: category.subCategories },
                { label: 'Performance', value: category.performance.toUpperCase() }
              ]
            },
            {
              title: 'Monthly Breakdown',
              type: 'chart',
              data: Array.from({ length: 6 }, (_, i) => ({
                name: new Date(2024, 6 + i, 1).toLocaleDateString('en-US', { month: 'short' }),
                revenue: category.revenue / 6 * (0.8 + Math.random() * 0.4),
                margin: category.margin + (Math.random() - 0.5) * 5
              }))
            }
          ]
        };
      
      case 'subcategory-analysis':
        const subCategory = data.data;
        return {
          title: data.title,
          sections: [
            {
              title: 'Sub-Category Performance',
              type: 'stats',
              data: [
                { label: 'Revenue', value: `€${(subCategory.revenue / 1000).toFixed(0)}K` },
                { label: 'Margin', value: `${subCategory.margin.toFixed(1)}%` },
                { label: 'Growth', value: `${subCategory.growth > 0 ? '+' : ''}${subCategory.growth.toFixed(1)}%` },
                { label: 'Units Sold', value: subCategory.units.toLocaleString() },
                { label: 'Rate of Sale', value: subCategory.rateOfSale.toFixed(1) },
                { label: 'Status', value: subCategory.status.toUpperCase() }
              ]
            }
          ]
        };
      
      case 'category-trends':
        return {
          title: data.title,
          sections: [
            {
              title: 'Monthly Comparison',
              type: 'chart',
              data: Object.entries(data.data)
                .filter(([key]) => key !== 'month')
                .map(([category, value]) => ({
                  name: category.charAt(0).toUpperCase() + category.slice(1),
                  value: value
                }))
            }
          ]
        };
      
      default:
        return {
          title: 'Category Analysis',
          sections: [
            {
              title: 'Information',
              type: 'stats',
              data: [
                { label: 'Type', value: data.type },
                { label: 'Period', value: data.period }
              ]
            }
          ]
        };
    }
  };

  const detailData = getDetailedData();
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{detailData.title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <i className="ri-close-line"></i>
          </button>
        </div>

        <div className="p-6">
          {detailData.sections.map((section, index) => (
            <div key={index} className="mb-8 last:mb-0">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{section.title}</h3>
              
              {section.type === 'stats' && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {section.data.map((stat: any, statIndex: number) => (
                    <div key={statIndex} className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
                      <div className="text-lg font-semibold text-gray-900">{stat.value}</div>
                    </div>
                  ))}
                </div>
              )}
              
              {section.type === 'chart' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="h-64 bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Bar Chart View</h4>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={section.data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" stroke="#6b7280" fontSize={11} />
                        <YAxis stroke="#6b7280" fontSize={11} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {section.data.length <= 6 && (
                    <div className="h-64 bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Distribution View</h4>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={section.data}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {section.data.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium whitespace-nowrap"
          >
            Close
          </button>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium whitespace-nowrap">
            Export Analysis
          </button>
        </div>
      </div>
    </div>
  );
}
