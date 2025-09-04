
'use client';

import { useEffect, useState } from 'react';
import { dashboardAPI } from '../services/api';

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
  const [periods, setPeriods] = useState<string[]>(['YTD']);
  const [months, setMonths] = useState<string[]>(['All']);
  const [businessAreas, setBusinessAreas] = useState<string[]>(['All']);
  const [channels, setChannels] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);

  // Fetch dynamic filter options from API
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setLoading(true);
        const response = await dashboardAPI.getFilterOptions();
        const data = response.data.data;
        
        if (data) {
          // Set periods (years) from the data
          if (data.years && Array.isArray(data.years)) {
            const yearOptions = ['YTD', ...data.years.map((year: number) => year.toString())];
            setPeriods(yearOptions);
          }
          
          // Set months from the data
          if (data.months && Array.isArray(data.months)) {
            const monthOptions = ['All', ...data.months];
            setMonths(monthOptions);
          }
          
          // Set channels from the data
          if (data.channels && Array.isArray(data.channels)) {
            const channelOptions = ['All', ...data.channels];
            setChannels(channelOptions);
          }
        }
      } catch (error) {
        console.error('Error fetching filter options:', error);
        // Fallback to default values
        setPeriods(['YTD', '2024', '2023', '2022']);
        setMonths(['All', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']);
        setChannels(['All', 'Grocery ROI', 'Grocery NI/UK', 'Wholesale ROI', 'Wholesale NI/UK', 'International', 'Online', 'Sports & Others']);
      } finally {
        setLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  // Fetch business areas based on selected year
  useEffect(() => {
    const fetchBusinessAreasForYear = async () => {
      try {
        if (selectedPeriod === 'YTD') {
          // For YTD, use current year
          const currentYear = new Date().getFullYear();
          const response = await dashboardAPI.getFilterOptions({ year: currentYear });
          if (response.data.data && response.data.data.businessAreas) {
            const businessAreaOptions = ['All', ...response.data.data.businessAreas];
            setBusinessAreas(businessAreaOptions);
          }
        } else if (selectedPeriod) {
          // For specific year, fetch business areas for that year
          const response = await dashboardAPI.getFilterOptions({ year: parseInt(selectedPeriod) });
          if (response.data.data && response.data.data.businessAreas) {
            const businessAreaOptions = ['All', ...response.data.data.businessAreas];
            setBusinessAreas(businessAreaOptions);
          }
        }
      } catch (error) {
        console.error('Error fetching business areas for year:', error);
        // Fallback to default values
        setBusinessAreas(['All', 'Food', 'Household', 'Brillo', 'Kinetica']);
      }
    };

    fetchBusinessAreasForYear();
  }, [selectedPeriod]);

  // Fetch channels based on selected business area
  useEffect(() => {
    const fetchChannelsForBusinessArea = async () => {
      try {
        if (selectedBusinessArea && selectedBusinessArea !== 'All') {
          const response = await dashboardAPI.getFilterOptions({ 
            year: selectedPeriod === 'YTD' ? new Date().getFullYear() : parseInt(selectedPeriod),
            businessArea: selectedBusinessArea 
          });
          if (response.data.data && response.data.data.channels) {
            const channelOptions = ['All', ...response.data.data.channels];
            setChannels(channelOptions);
          } else {
            setChannels(['All']); // Fallback if no channels for the business area
          }
        } else {
          // If "All" business areas selected, show all available channels
          const response = await dashboardAPI.getFilterOptions({ 
            year: selectedPeriod === 'YTD' ? new Date().getFullYear() : parseInt(selectedPeriod)
          });
          if (response.data.data && response.data.data.channels) {
            const channelOptions = ['All', ...response.data.data.channels];
            setChannels(channelOptions);
          }
        }
      } catch (error) {
        console.error('Error fetching channels for business area:', error);
        // Fallback to default values
        setChannels(['All', 'Grocery ROI', 'Grocery NI/UK', 'Wholesale ROI', 'Wholesale NI/UK', 'International', 'Online', 'Sports & Others']);
      }
    };

    fetchChannelsForBusinessArea();
  }, [selectedBusinessArea, selectedPeriod]);

  // Reset month when period changes (if period is not YTD)
  const handlePeriodChange = (newPeriod: string) => {
    setSelectedPeriod(newPeriod);
    if (newPeriod !== 'YTD') {
      setSelectedMonth('All');
    }
  };

  // Reset channel when business area changes
  const handleBusinessAreaChange = (newBusinessArea: string) => {
    setSelectedBusinessArea(newBusinessArea);
    setSelectedChannel('All'); // Reset channel to "All" when business area changes
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-900">Filters</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={(e) => handlePeriodChange(e.target.value)}
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
              onChange={(e) => handleBusinessAreaChange(e.target.value)}
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
