
'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CustomerDrillDownModalProps {
  data: any;
  onClose: () => void;
}

export default function CustomerDrillDownModal({ data, onClose }: CustomerDrillDownModalProps) {
  const getDetailedData = () => {
    switch (data.type) {
      case 'customer-overview':
        return {
          title: data.title,
          sections: [
            {
              title: 'Customer Breakdown',
              type: 'stats',
              data: Object.entries(data.data).map(([key, value]) => ({
                label: key.charAt(0).toUpperCase() + key.slice(1),
                value: value
              }))
            }
          ]
        };
      
      case 'customer-performance':
        return {
          title: `${data.title} Details`,
          sections: [
            {
              title: 'Monthly Performance',
              type: 'chart',
              data: [
                { name: 'Week 1', value: data.data[data.metric] * 0.2 },
                { name: 'Week 2', value: data.data[data.metric] * 0.25 },
                { name: 'Week 3', value: data.data[data.metric] * 0.3 },
                { name: 'Week 4', value: data.data[data.metric] * 0.25 }
              ]
            }
          ]
        };
      
      case 'channel-share':
        return {
          title: data.title,
          sections: [
            {
              title: 'Channel Performance',
              type: 'stats',
              data: [
                { label: 'Market Share', value: `${data.data.marketShare}%` },
                { label: 'Revenue', value: `€${(data.data.revenue / 1000).toFixed(0)}K` },
                { label: 'Customer Count', value: data.data.customerCount },
                { label: 'Avg Customer Value', value: `€${Math.round(data.data.averageCustomerValue)}` }
              ]
            }
          ]
        };
      
      default:
        return {
          title: 'Analysis Details',
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {section.data.map((stat: any, statIndex: number) => (
                    <div key={statIndex} className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
                      <div className="text-lg font-semibold text-gray-900">{stat.value}</div>
                    </div>
                  ))}
                </div>
              )}
              
              {section.type === 'chart' && (
                <div className="h-64 bg-gray-50 rounded-lg p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={section.data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                      <YAxis stroke="#6b7280" fontSize={12} />
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
            Export Data
          </button>
        </div>
      </div>
    </div>
  );
}
