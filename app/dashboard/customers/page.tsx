
'use client';

import { useState } from 'react';
import DashboardHeader from '../DashboardHeader';
import CustomerFilters from './CustomerFilters';
import CustomerOverviewCards from './CustomerOverviewCards';
import CustomerPerformanceChart from './CustomerPerformanceChart';
import TopCustomersSection from './TopCustomersSection';
import ChannelShareAnalysis from './ChannelShareAnalysis';
import CustomerDrillDownModal from './CustomerDrillDownModal';

export default function CustomerAnalysis() {
  const [selectedPeriod, setSelectedPeriod] = useState('YTD');
  const [selectedChannel, setSelectedChannel] = useState('All');
  const [selectedCustomer, setSelectedCustomer] = useState('All');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [selectedBusinessArea, setSelectedBusinessArea] = useState('All');
  const [drillDownData, setDrillDownData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDrillDown = (data: any) => {
    setDrillDownData(data);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setDrillDownData(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customer Analysis</h1>
            <p className="text-gray-600 mt-1">Analyze performance across channels and key customers</p>
          </div>
          <div className="flex space-x-2">
            <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <i className="ri-download-line text-gray-600"></i>
            </button>
            <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <i className="ri-bookmark-line text-gray-600"></i>
            </button>
            <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <i className="ri-share-line text-gray-600"></i>
            </button>
          </div>
        </div>

        <CustomerFilters
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
          selectedChannel={selectedChannel}
          setSelectedChannel={setSelectedChannel}
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
          selectedBusinessArea={selectedBusinessArea}
          setSelectedBusinessArea={setSelectedBusinessArea}
        />

        <CustomerOverviewCards
          selectedPeriod={selectedPeriod}
          selectedChannel={selectedChannel}
          selectedCustomer={selectedCustomer}
          selectedBusinessArea={selectedBusinessArea}
          onDrillDown={handleDrillDown}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CustomerPerformanceChart
              selectedPeriod={selectedPeriod}
              selectedChannel={selectedChannel}
              selectedCustomer={selectedCustomer}
              selectedMetric={selectedMetric}
              setSelectedMetric={setSelectedMetric}
              onDrillDown={handleDrillDown}
            />
          </div>
          <div>
            <ChannelShareAnalysis
              selectedPeriod={selectedPeriod}
              selectedBusinessArea={selectedBusinessArea}
              onDrillDown={handleDrillDown}
            />
          </div>
        </div>

        <TopCustomersSection
          selectedPeriod={selectedPeriod}
          selectedChannel={selectedChannel}
          selectedBusinessArea={selectedBusinessArea}
          onDrillDown={handleDrillDown}
        />

        {isModalOpen && drillDownData && (
          <CustomerDrillDownModal
            data={drillDownData}
            onClose={closeModal}
          />
        )}
      </div>
    </div>
  );
}
