
'use client';

interface SubCategoryAnalysisProps {
  selectedPeriod: string;
  selectedBusinessArea: string;
  selectedCategory: string;
  onDrillDown: (data: any) => void;
}

export default function SubCategoryAnalysis({
  selectedPeriod,
  selectedBusinessArea,
  selectedCategory,
  onDrillDown
}: SubCategoryAnalysisProps) {
  const subCategoryData = [
    {
      subCategory: 'Chips & Crisps',
      category: 'Snacks',
      revenue: 485000,
      margin: 29.8,
      growth: 14.5,
      units: 24500,
      rateOfSale: 4.2,
      status: 'growing'
    },
    {
      subCategory: 'Nuts & Seeds',
      category: 'Snacks',
      revenue: 325000,
      margin: 35.2,
      growth: 18.7,
      units: 15800,
      rateOfSale: 3.8,
      status: 'growing'
    },
    {
      subCategory: 'Chocolate Bars',
      category: 'Snacks',
      revenue: 315000,
      margin: 22.1,
      growth: 6.2,
      units: 18900,
      rateOfSale: 3.1,
      status: 'stable'
    },
    {
      subCategory: 'Surface Cleaners',
      category: 'Cleaning',
      revenue: 285000,
      margin: 33.5,
      growth: 16.8,
      units: 12400,
      rateOfSale: 5.2,
      status: 'growing'
    },
    {
      subCategory: 'Protein Powders',
      category: 'Sports Nutrition',
      revenue: 225000,
      margin: 45.8,
      growth: 28.5,
      units: 5600,
      rateOfSale: 6.8,
      status: 'growing'
    },
    {
      subCategory: 'Energy Drinks',
      category: 'Beverages',
      revenue: 195000,
      margin: 28.9,
      growth: 12.1,
      units: 8900,
      rateOfSale: 4.5,
      status: 'growing'
    },
    {
      subCategory: 'Scouring Pads',
      category: 'Kitchen',
      revenue: 165000,
      margin: 38.4,
      growth: 3.2,
      units: 7800,
      rateOfSale: 2.1,
      status: 'stable'
    },
    {
      subCategory: 'Hand Soap',
      category: 'Personal Care',
      revenue: 125000,
      margin: 31.2,
      growth: -5.8,
      units: 6200,
      rateOfSale: 1.8,
      status: 'declining'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'growing':
        return 'text-green-600 bg-green-50';
      case 'stable':
        return 'text-blue-600 bg-blue-50';
      case 'declining':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getRateOfSaleColor = (rate: number) => {
    if (rate >= 5) return 'text-green-600';
    if (rate >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleSubCategoryClick = (subCategory: any) => {
    onDrillDown({
      type: 'subcategory-analysis',
      title: `${subCategory.subCategory} Analysis`,
      data: subCategory,
      period: selectedPeriod
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Sub-Category Analysis</h3>
          <p className="text-sm text-gray-500 mt-1">Detailed performance by sub-category</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap">
            View All
          </button>
          <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <i className="ri-more-2-line"></i>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {subCategoryData.map((item, index) => (
          <div
            key={index}
            onClick={() => handleSubCategoryClick(item)}
            className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors duration-200 group"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                  {item.subCategory}
                </h4>
                <p className="text-sm text-gray-500">{item.category}</p>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                {item.status}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Revenue:</span>
                <span className="font-medium text-gray-900 ml-2">{formatCurrency(item.revenue)}</span>
              </div>
              <div>
                <span className="text-gray-500">Margin:</span>
                <span className="font-medium text-gray-900 ml-2">{item.margin.toFixed(1)}%</span>
              </div>
              <div>
                <span className="text-gray-500">Growth:</span>
                <span className={`font-medium ml-2 ${item.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {item.growth > 0 ? '+' : ''}{item.growth.toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="text-gray-500">Rate of Sale:</span>
                <span className={`font-medium ml-2 ${getRateOfSaleColor(item.rateOfSale)}`}>
                  {item.rateOfSale.toFixed(1)}
                </span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{item.units.toLocaleString()} units sold</span>
                <i className="ri-arrow-right-s-line group-hover:text-gray-700 transition-colors duration-200"></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-center">
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm whitespace-nowrap">
            View All Sub-Categories ({subCategoryData.length + 15} total)
          </button>
        </div>
      </div>
    </div>
  );
}
