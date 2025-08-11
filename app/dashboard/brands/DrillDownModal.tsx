'use client';

interface DrillDownModalProps {
  data: any;
  onClose: () => void;
}

export default function DrillDownModal({ data, onClose }: DrillDownModalProps) {
  if (!data) return null;

  const renderContent = () => {
    switch (data.type) {
      case 'sku-detail':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">SKU Performance</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">SKU Code:</span>
                    <span className="font-medium">{data.data.sku}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Revenue:</span>
                    <span className="font-medium">€{(data.data.revenue / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Margin:</span>
                    <span className="font-medium">{data.data.margin}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Units Sold:</span>
                    <span className="font-medium">{data.data.units.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rate of Sale:</span>
                    <span className={`font-medium ${data.data.rateOfSale > 5 ? 'text-green-600' : 'text-red-600'}`}>
                      {data.data.rateOfSale}/week
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Risk Assessment</h4>
                <div className="space-y-2">
                  <div className={`p-3 rounded-lg ${
                    data.data.risk === 'high' ? 'bg-red-50 text-red-700' :
                    data.data.risk === 'medium' ? 'bg-yellow-50 text-yellow-700' :
                    'bg-green-50 text-green-700'
                  }`}>
                    <p className="font-medium capitalize">{data.data.risk} Risk Level</p>
                    <p className="text-sm mt-1">
                      {data.data.risk === 'high' ? 'Immediate attention required' :
                       data.data.risk === 'medium' ? 'Monitor closely' :
                       'Performing well'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'customer-detail':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">€{(data.data.revenue / 1000).toFixed(0)}K</p>
                <p className="text-sm text-gray-600">Total Revenue</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{data.data.margin}%</p>
                <p className="text-sm text-gray-600">Average Margin</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{data.data.share}%</p>
                <p className="text-sm text-gray-600">Market Share</p>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div>
            <p className="text-gray-600">Detailed analysis view would appear here with interactive charts and deeper insights.</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full m-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {data.type === 'sku-detail' ? data.data.name :
               data.type === 'customer-detail' ? `${data.data.customer} - Detailed Analysis` :
               'Detailed Analysis'}
            </h3>
            <p className="text-sm text-gray-500">
              {data.type === 'sku-detail' ? 'SKU Performance Deep Dive' :
               data.type === 'customer-detail' ? `${data.data.channel} Channel` :
               'Interactive drill-down view'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>
        
        <div className="p-6">
          {renderContent()}
        </div>
        
        <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
          <button 
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 whitespace-nowrap"
          >
            Close
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 whitespace-nowrap">
            <i className="ri-download-line mr-2"></i>Export Data
          </button>
        </div>
      </div>
    </div>
  );
}