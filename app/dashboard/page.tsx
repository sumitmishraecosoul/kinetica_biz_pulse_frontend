
'use client';

import { useState, useEffect } from 'react';
import DashboardHeader from './DashboardHeader';
import BusinessAreaCard from './BusinessAreaCard';
import ChannelCard from './ChannelCard';
import SummaryFilters from './SummaryFilters';
import DataTable from './DataTable';
import { dashboardAPI } from '../services/api';

interface BusinessArea {
  name: string;
  revenue: number;
  cost: number;
  volume: number;
  margin: number;
  growth: number;
  brands: string[];
}

interface Channel {
  name: string;
  revenue: number;
  cost: number;
  volume: number;
  margin: number;
  growth: number;
  customers: string[];
  region: string;
}

interface PerformanceData {
  businessArea: string;
  brand: string;
  category: string;
  subCategory: string;
  channel: string;
  customer: string;
  revenue: number;
  cost: number;
  volume: number;
  margin: number;
}

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('YTD');
  const [selectedBusinessArea, setSelectedBusinessArea] = useState('All');
  const [selectedChannel, setSelectedChannel] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('All');
  
  // API data states
  const [businessAreas, setBusinessAreas] = useState<BusinessArea[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all data in parallel
        const [businessAreasRes, channelsRes, performanceRes] = await Promise.all([
          dashboardAPI.getBusinessAreas(),
          dashboardAPI.getChannels(),
          dashboardAPI.getPerformanceData()
        ]);

        setBusinessAreas(businessAreasRes.data.data || []);
        setChannels(channelsRes.data.data || []);
        setPerformanceData(performanceRes.data.data || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <SummaryFilters
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedBusinessArea={selectedBusinessArea}
          setSelectedBusinessArea={setSelectedBusinessArea}
          selectedChannel={selectedChannel}
          setSelectedChannel={setSelectedChannel}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Business Areas</h2>
            <div className="grid grid-cols-2 gap-4">
              {Array.isArray(businessAreas) && businessAreas.map((area, index) => (
                <BusinessAreaCard
                  key={index}
                  area={area}
                  isSelected={selectedBusinessArea === area.name}
                  onClick={() => setSelectedBusinessArea(area.name)}
                />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Sales Channels</h2>
            <div className="space-y-3">
              {Array.isArray(channels) && channels.map((channel, index) => (
                <ChannelCard
                  key={index}
                  channel={channel}
                  isSelected={selectedChannel === channel.name}
                  onClick={() => setSelectedChannel(channel.name)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Performance Overview</h2>
          <DataTable
            data={performanceData}
            loading={loading}
            selectedPeriod={selectedPeriod}
            selectedBusinessArea={selectedBusinessArea}
            selectedChannel={selectedChannel}
            selectedMonth={selectedMonth}
          />
        </div>
      </div>
    </div>
  );
}
