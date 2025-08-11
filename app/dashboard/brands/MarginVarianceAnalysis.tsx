'use client';

interface MarginVarianceAnalysisProps {
  selectedBusinessArea: string;
  selectedBrand: string;
}

export default function MarginVarianceAnalysis({ selectedBusinessArea, selectedBrand }: MarginVarianceAnalysisProps) {
  const varianceData = [
    {
      driver: 'Volume Impact',
      value: +2.4,
      description: 'Higher sales volume',
      icon: 'ri-arrow-up-circle-fill',
      color: 'text-green-600'
    },
    {
      driver: 'Price Changes',
      value: +1.8,
      description: 'Price optimization',
      icon: 'ri-arrow-up-circle-fill',
      color: 'text-green-600'
    },
    {
      driver: 'Raw Material Cost',
      value: -1.2,
      description: 'Commodity inflation',
      icon: 'ri-arrow-down-circle-fill',
      color: 'text-red-600'
    },
    {
      driver: 'Manufacturing',
      value: -0.5,
      description: 'Efficiency losses',
      icon: 'ri-arrow-down-circle-fill',
      color: 'text-red-600'
    },
    {
      driver: 'Logistics',
      value: -0.3,
      description: 'Transport costs',
      icon: 'ri-arrow-down-circle-fill',
      color: 'text-red-600'
    },
    {
      driver: 'Promotions',
      value: -0.8,
      description: 'Trade spend increase',
      icon: 'ri-arrow-down-circle-fill',
      color: 'text-red-600'
    }
  ];

  const totalImpact = varianceData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Margin Variance Analysis</h3>
          <p className="text-sm text-gray-500">Period-over-period drivers</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Net Impact</p>
          <p className={`text-lg font-bold ${totalImpact > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalImpact > 0 ? '+' : ''}{totalImpact.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {varianceData.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <i className={`${item.icon} text-lg ${item.color}`}></i>
              <div>
                <p className="font-medium text-gray-900">{item.driver}</p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-bold ${item.color}`}>
                {item.value > 0 ? '+' : ''}{item.value.toFixed(1)}%
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <i className="ri-lightbulb-line text-blue-600 text-lg mt-0.5"></i>
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Key Insights</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Volume growth driving positive margin impact</li>
                <li>• Raw material inflation remains key risk</li>
                <li>• Review promotional strategy effectiveness</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md text-sm whitespace-nowrap">
          <i className="ri-file-excel-line mr-2"></i>Export Detailed Analysis
        </button>
      </div>
    </div>
  );
}