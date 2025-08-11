'use client';

interface TopPerformersSectionProps {
  selectedBusinessArea: string;
  selectedBrand: string;
  onDrillDown: (data: any) => void;
}

export default function TopPerformersSection({ selectedBusinessArea, selectedBrand, onDrillDown }: TopPerformersSectionProps) {
  const topSKUs = [
    { sku: 'SKU-001-A', name: 'Premium Protein Powder 2kg', revenue: 245000, margin: 34.2, units: 1250, rateOfSale: 8.5, trend: 'up', risk: 'low' },
    { sku: 'SKU-002-B', name: 'Multi-Surface Cleaner 500ml', revenue: 189000, margin: 28.9, units: 3200, rateOfSale: 12.3, trend: 'up', risk: 'low' },
    { sku: 'SKU-003-C', name: 'Kitchen Scouring Pads 4pk', revenue: 167000, margin: 31.5, units: 5600, rateOfSale: 6.2, trend: 'down', risk: 'medium' },
    { sku: 'SKU-004-D', name: 'Organic Snack Mix 250g', revenue: 145000, margin: 22.1, units: 2800, rateOfSale: 4.1, trend: 'down', risk: 'high' },
    { sku: 'SKU-005-E', name: 'Premium Coffee Blend 1kg', revenue: 134000, margin: 29.7, units: 890, rateOfSale: 2.1, trend: 'down', risk: 'high' }
  ];

  const topCustomers = [
    { customer: 'Tesco Ireland', channel: 'Grocery ROI', revenue: 890000, margin: 28.4, share: 18.2, growth: 12.3 },
    { customer: 'SuperValu', channel: 'Grocery ROI', revenue: 734000, margin: 31.1, share: 15.1, growth: 8.7 },
    { customer: 'Dunnes Stores', channel: 'Grocery ROI', revenue: 567000, margin: 26.8, share: 11.6, growth: 15.4 },
    { customer: 'Tesco UK', channel: 'Grocery NI/UK', revenue: 445000, margin: 24.2, share: 9.1, growth: 6.2 },
    { customer: 'BWG Foods', channel: 'Wholesale ROI', revenue: 389000, margin: 33.5, share: 8.0, growth: 19.8 }
  ];

  const brandShare = [
    { brand: 'Brand A', businessArea: 'Food', revenue: 2400000, share: 19.4, margin: 28.7, growth: 11.2 },
    { brand: 'Brand G', businessArea: 'Kinetica', revenue: 1800000, share: 14.6, margin: 35.4, growth: 18.3 },
    { brand: 'Brand D', businessArea: 'Household', revenue: 1650000, share: 13.4, margin: 31.2, growth: 9.8 },
    { brand: 'Brand F', businessArea: 'Brillo', revenue: 1200000, share: 9.7, margin: 28.9, growth: 5.2 },
    { brand: 'Brand B', businessArea: 'Food', revenue: 980000, share: 7.9, margin: 22.1, growth: 7.5 }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-green-600 bg-green-50';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Top 20 SKUs</h3>
          <button 
            className="text-blue-600 hover:text-blue-800 text-sm whitespace-nowrap"
            onClick={() => onDrillDown({ type: 'skus', data: topSKUs })}
          >
            View All
          </button>
        </div>
        
        <div className="space-y-3">
          {topSKUs.slice(0, 5).map((sku, index) => (
            <div key={index} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                 onClick={() => onDrillDown({ type: 'sku-detail', data: sku })}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{sku.name}</p>
                  <p className="text-xs text-gray-500">{sku.sku}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getRiskColor(sku.risk)}`}>
                  {sku.risk} risk
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-gray-500">Revenue</p>
                  <p className="font-medium">{formatCurrency(sku.revenue)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Margin</p>
                  <p className="font-medium">{sku.margin}%</p>
                </div>
                <div>
                  <p className="text-gray-500">ROS</p>
                  <p className={`font-medium flex items-center ${sku.rateOfSale > 5 ? 'text-green-600' : 'text-red-600'}`}>
                    {sku.rateOfSale}
                    <i className={`ml-1 ${sku.trend === 'up' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'}`}></i>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Top 10 Customers</h3>
          <button 
            className="text-blue-600 hover:text-blue-800 text-sm whitespace-nowrap"
            onClick={() => onDrillDown({ type: 'customers', data: topCustomers })}
          >
            View All
          </button>
        </div>
        
        <div className="space-y-3">
          {topCustomers.map((customer, index) => (
            <div key={index} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                 onClick={() => onDrillDown({ type: 'customer-detail', data: customer })}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium text-gray-900">{customer.customer}</p>
                  <p className="text-xs text-gray-500">{customer.channel}</p>
                </div>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {customer.share}% share
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-gray-500">Revenue</p>
                  <p className="font-medium">{formatCurrency(customer.revenue)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Growth</p>
                  <p className="font-medium text-green-600">+{customer.growth}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Brand Share Analysis</h3>
          <button 
            className="text-blue-600 hover:text-blue-800 text-sm whitespace-nowrap"
            onClick={() => onDrillDown({ type: 'brand-share', data: brandShare })}
          >
            View Details
          </button>
        </div>
        
        <div className="space-y-3">
          {brandShare.map((brand, index) => (
            <div key={index} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                 onClick={() => onDrillDown({ type: 'brand-detail', data: brand })}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium text-gray-900">{brand.brand}</p>
                  <p className="text-xs text-gray-500">{brand.businessArea}</p>
                </div>
                <span className="text-sm font-bold text-gray-900">{brand.share}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${brand.share}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{formatCurrency(brand.revenue)}</span>
                <span className="text-green-600">+{brand.growth}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}