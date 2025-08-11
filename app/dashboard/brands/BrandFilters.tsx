'use client';

interface BrandFiltersProps {
  selectedBusinessArea: string;
  setSelectedBusinessArea: (area: string) => void;
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
  selectedMetric: string;
  setSelectedMetric: (metric: string) => void;
}

export default function BrandFilters({
  selectedBusinessArea,
  setSelectedBusinessArea,
  selectedBrand,
  setSelectedBrand,
  selectedPeriod,
  setSelectedPeriod,
  selectedMetric,
  setSelectedMetric
}: BrandFiltersProps) {
  const businessAreas = ['All', 'Food', 'Household', 'Brillo', 'Kinetica'];
  const brands = {
    'All': ['All'],
    'Food': ['All', 'Brand A', 'Brand B', 'Brand C'],
    'Household': ['All', 'Brand D', 'Brand E'],
    'Brillo': ['All', 'Brand F'],
    'Kinetica': ['All', 'Brand G', 'Brand H']
  };
  const periods = ['YTD', 'MTD', 'Q1', 'Q2', 'Q3', 'Q4', 'Last 12M'];
  const metrics = [
    { value: 'revenue', label: 'Revenue' },
    { value: 'margin', label: 'Margin %' },
    { value: 'units', label: 'Units Sold' },
    { value: 'growth', label: 'Growth %' }
  ];

  const availableBrands = brands[selectedBusinessArea as keyof typeof brands] || ['All'];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Advanced Filters</h2>
        <button className="text-gray-400 hover:text-gray-600">
          <i className="ri-settings-3-line text-lg"></i>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Business Area</label>
          <div className="relative">
            <select
              value={selectedBusinessArea}
              onChange={(e) => {
                setSelectedBusinessArea(e.target.value);
                setSelectedBrand('All');
              }}
              className="w-full p-2 pr-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {businessAreas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <i className="ri-arrow-down-s-line text-gray-400"></i>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
          <div className="relative">
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full p-2 pr-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {availableBrands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <i className="ri-arrow-down-s-line text-gray-400"></i>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full p-2 pr-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {periods.map(period => (
                <option key={period} value={period}>{period}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <i className="ri-arrow-down-s-line text-gray-400"></i>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Primary Metric</label>
          <div className="relative">
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="w-full p-2 pr-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {metrics.map(metric => (
                <option key={metric.value} value={metric.value}>{metric.label}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <i className="ri-arrow-down-s-line text-gray-400"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex space-x-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 whitespace-nowrap">
            <i className="ri-search-line mr-2"></i>Apply Filters
          </button>
          <button 
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 whitespace-nowrap"
            onClick={() => {
              setSelectedBusinessArea('All');
              setSelectedBrand('All');
              setSelectedPeriod('YTD');
              setSelectedMetric('revenue');
            }}
          >
            <i className="ri-refresh-line mr-2"></i>Reset
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button className="text-gray-600 hover:text-gray-900 p-2">
            <i className="ri-bookmark-line"></i>
          </button>
          <button className="text-gray-600 hover:text-gray-900 p-2">
            <i className="ri-share-line"></i>
          </button>
        </div>
      </div>
    </div>
  );
}