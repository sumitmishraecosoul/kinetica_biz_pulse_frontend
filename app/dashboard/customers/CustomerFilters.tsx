
'use client';

interface CustomerFiltersProps {
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
  selectedChannel: string;
  setSelectedChannel: (channel: string) => void;
  selectedCustomer: string;
  setSelectedCustomer: (customer: string) => void;
  selectedBusinessArea: string;
  setSelectedBusinessArea: (area: string) => void;
}

export default function CustomerFilters({
  selectedPeriod,
  setSelectedPeriod,
  selectedChannel,
  setSelectedChannel,
  selectedCustomer,
  setSelectedCustomer,
  selectedBusinessArea,
  setSelectedBusinessArea
}: CustomerFiltersProps) {
  const periods = ['YTD', 'MTD', 'Q1', 'Q2', 'Q3', 'Q4', '2024', '2023'];
  const channels = ['All', 'Grocery ROI', 'Grocery NI/UK', 'Wholesale ROI', 'Wholesale NI/UK', 'International', 'Online', 'Sports & Others'];
  const customers = ['All', 'Tesco Ireland', 'SuperValu', 'Dunnes', 'Tesco UK', 'Sainsbury\'s', 'ASDA', 'BWG Foods', 'Musgraves', 'Amazon'];
  const businessAreas = ['All', 'Food', 'Household', 'Brillo', 'Kinetica'];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Analysis Filters</h2>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap">
          Save as Default
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full p-3 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {periods.map(period => (
                <option key={period} value={period}>{period}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <i className="ri-arrow-down-s-line text-gray-400"></i>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Channel</label>
          <div className="relative">
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="w-full p-3 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {channels.map(channel => (
                <option key={channel} value={channel}>{channel}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <i className="ri-arrow-down-s-line text-gray-400"></i>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
          <div className="relative">
            <select
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="w-full p-3 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {customers.map(customer => (
                <option key={customer} value={customer}>{customer}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <i className="ri-arrow-down-s-line text-gray-400"></i>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Business Area</label>
          <div className="relative">
            <select
              value={selectedBusinessArea}
              onChange={(e) => setSelectedBusinessArea(e.target.value)}
              className="w-full p-3 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {businessAreas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <i className="ri-arrow-down-s-line text-gray-400"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex space-x-3">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium whitespace-nowrap">
            Apply Filters
          </button>
          <button 
            className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 font-medium whitespace-nowrap"
            onClick={() => {
              setSelectedPeriod('YTD');
              setSelectedChannel('All');
              setSelectedCustomer('All');
              setSelectedBusinessArea('All');
            }}
          >
            Reset All
          </button>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
