
'use client';

import { useState, useEffect } from 'react';
import { dashboardAPI } from '../../services/api';

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
  const [filterOptions, setFilterOptions] = useState<any>({
    periods: ['YTD', 'MTD', 'Q1', 'Q2', 'Q3', 'Q4'],
    channels: ['All'],
    customers: ['All'],
    businessAreas: ['All']
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setLoading(true);
        const response = await dashboardAPI.getFilterOptions();
        const data = response.data.data;
        
        setFilterOptions({
          periods: data.periods || ['YTD', 'MTD', 'Q1', 'Q2', 'Q3', 'Q4'],
          channels: ['All', ...(data.channels || [])],
          customers: ['All', ...(data.customers || [])],
          businessAreas: ['All', ...(data.businessAreas || [])]
        });
      } catch (error) {
        console.error('Error fetching filter options:', error);
        // Use fallback options
        setFilterOptions({
          periods: ['YTD', 'MTD', 'Q1', 'Q2', 'Q3', 'Q4'],
          channels: ['All', 'Grocery ROI', 'Grocery NI/UK', 'Wholesale ROI', 'Wholesale NI/UK', 'International', 'Online', 'Sports & Others'],
          customers: ['All', 'Tesco Ireland', 'SuperValu', 'Dunnes', 'Tesco UK', 'Sainsbury\'s', 'ASDA', 'BWG Foods', 'Musgraves', 'Amazon'],
          businessAreas: ['All', 'Food', 'Household', 'Brillo', 'Kinetica']
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Analysis Filters</h2>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap">
            Save as Default
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
              className="w-full p-3 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none"
            >
              {filterOptions.periods.map((period: string) => (
                <option key={period} value={period}>{period}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
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
              className="w-full p-3 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none"
            >
              {filterOptions.channels.map((channel: string) => (
                <option key={channel} value={channel}>{channel}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
          <div className="relative">
            <select
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="w-full p-3 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none"
            >
              {filterOptions.customers.map((customer: string) => (
                <option key={customer} value={customer}>{customer}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
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
              className="w-full p-3 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none"
            >
              {filterOptions.businessAreas.map((area: string) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex space-x-3">
          <button 
            className="text-white px-6 py-2 rounded-lg font-medium whitespace-nowrap hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#0B2639' }}
          >
            Apply Filters
          </button>
          <button 
            className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg border border-gray-200 hover:bg-gray-200 font-medium whitespace-nowrap transition-colors"
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
