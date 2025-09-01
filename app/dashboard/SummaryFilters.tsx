
'use client';

interface SummaryFiltersProps {
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  selectedBusinessArea: string;
  setSelectedBusinessArea: (area: string) => void;
  selectedChannel: string;
  setSelectedChannel: (channel: string) => void;
}

export default function SummaryFilters({
  selectedPeriod,
  setSelectedPeriod,
  selectedMonth,
  setSelectedMonth,
  selectedBusinessArea,
  setSelectedBusinessArea,
  selectedChannel,
  setSelectedChannel
}: SummaryFiltersProps) {
  const periods = ['YTD', 'MTD', 'Q1', 'Q2', 'Q3', 'Q4'];
  const months = ['All', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const businessAreas = ['All', 'Food', 'Household', 'Brillo', 'Kinetica'];
  const channels = ['All', 'Grocery ROI', 'Grocery NI/UK', 'Wholesale ROI', 'Wholesale NI/UK', 'International', 'Online', 'Sports & Others'];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-900">Filters</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full p-2 pr-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              {periods.map(period => (
                <option key={period} value={period}>{period}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full p-2 pr-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Business Area</label>
          <div className="relative">
            <select
              value={selectedBusinessArea}
              onChange={(e) => setSelectedBusinessArea(e.target.value)}
              className="w-full p-2 pr-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              {businessAreas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Channel</label>
          <div className="relative">
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="w-full p-2 pr-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              {channels.map(channel => (
                <option key={channel} value={channel}>{channel}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex space-x-2">
        <button 
          className="text-white px-4 py-2 rounded-md whitespace-nowrap hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#0B2639' }}
        >
          Apply Filters
        </button>
        <button 
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-200 whitespace-nowrap transition-colors"
          onClick={() => {
            setSelectedPeriod('YTD');
            setSelectedMonth('All');
            setSelectedBusinessArea('All');
            setSelectedChannel('All');
          }}
        >
          Reset All
        </button>
      </div>
    </div>
  );
}
