'use client';

import { useState, useEffect } from 'react';
import DashboardHeader from '../DashboardHeader';
import BusinessAreaDetailedCards from '../BusinessAreaDetailedCards';
import ChannelCard from '../ChannelCard';
import SummaryFilters from '../SummaryFilters';
import DataTable from '../DataTable';
import { dashboardAPI } from '../../services/api';

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

export default function BusinessAnalysis() {
    // Check authentication and API health on client side
  useEffect(() => {
    const checkAuthAndHealth = async () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        const refreshToken = localStorage.getItem('refresh_token');

        console.log('Auth check:', { token: !!token, refreshToken: !!refreshToken });

        if (!token && !refreshToken) {
          console.log('No authentication found - redirecting to login');
          window.location.href = '/login';
          return;
        }

        // Check API health
        try {
          const healthResponse = await fetch('http://localhost:5000/health');
          if (!healthResponse.ok) {
            console.error('API health check failed');
            setError('API server is not responding. Please check if the server is running.');
          }
        } catch (err) {
          console.error('API health check error:', err);
          setError('Cannot connect to API server. Please check if the server is running on port 5000.');
        }
      }
    };

    checkAuthAndHealth();
  }, []);
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

  // Fetch data from APIs with debouncing
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          period: selectedPeriod,
          month: selectedMonth,
          businessArea: selectedBusinessArea,
          channel: selectedChannel,
        };

        // Add a small delay to prevent rapid successive calls
        await new Promise(resolve => setTimeout(resolve, 100));

        const [businessAreasRes, channelsRes, performanceRes] = await Promise.all([
          dashboardAPI.getBusinessAreas(params),
          dashboardAPI.getChannels(params),
          dashboardAPI.getPerformanceData(params)
        ]);

        setBusinessAreas(businessAreasRes.data.data || []);
        setChannels(channelsRes.data.data || []);
        setPerformanceData(performanceRes.data.data || []);
      } catch (err: any) {
        console.error('Error fetching business analysis data:', err);
        
        // Handle rate limiting specifically
        if (err.response?.status === 429) {
          setError('Too many requests. Please wait a moment and try again.');
        } else {
          setError('Failed to load business analysis data');
        }
      } finally {
        setLoading(false);
      }
    };

    // Add debouncing to prevent rapid successive calls
    const timeoutId = setTimeout(fetchData, 300);
    return () => clearTimeout(timeoutId);
  }, [selectedPeriod, selectedMonth, selectedBusinessArea, selectedChannel]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading business analysis data...</p>
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
            onClick={() => {
              setError(null);
              setLoading(true);
              // Force a fresh data fetch
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            }} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Business Analysis</h1>
            <p className="text-gray-600 mt-1">Comprehensive analysis of business areas, channels, and performance metrics</p>
          </div>
        </div>

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
            <div className="flex items-center space-x-2 mb-4">
              <img src="/assets/Tag.svg" alt="Tag" className="w-5 h-5" />
              <h2 className="text-xl font-semibold">Business Areas</h2>
            </div>
            <BusinessAreaDetailedCards
              selectedBusinessArea={selectedBusinessArea}
              selectedPeriod={selectedPeriod}
              selectedMonth={selectedMonth}
              selectedChannel={selectedChannel}
              onDrillDown={(businessArea) => setSelectedBusinessArea(businessArea)}
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-2 mb-4">
              <img src="/assets/Users.svg" alt="Users" className="w-5 h-5" />
              <h2 className="text-xl font-semibold">Sales Channels</h2>
            </div>
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
          <div className="flex items-center space-x-2 mb-4">
            <img src="/assets/Dollar sign.svg" alt="Dollar" className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Performance Data</h2>
          </div>
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
