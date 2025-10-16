
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
          selectedYear={selectedPeriod}
          setSelectedYear={setSelectedPeriod}
          selectedMonth="All"
          setSelectedMonth={() => {}}
          selectedChannel={selectedChannel}
          setSelectedChannel={setSelectedChannel}
          selectedCategory="All"
          setSelectedCategory={() => {}}
          selectedSubCategory="All"
          setSelectedSubCategory={() => {}}
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
          onApplyFilters={() => {}}
          onResetFilters={() => {}}
          onDownloadCSV={() => {}}
          sectionType="customers"
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

        {/* Additional Insights Section - Utilizing the whitespace */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-6">
          {/* Customer Growth Insights */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <i className="ri-trending-up-line text-blue-600 text-xl"></i>
              </div>
              <span className="text-sm text-green-600 font-medium">+12.5%</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Growth Leaders</h3>
            <p className="text-sm text-gray-600 mb-3">Top performing customers this period</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Stonehouse</span>
                <span className="text-sm font-medium text-green-600">+15.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Irish Breeze</span>
                <span className="text-sm font-medium text-green-600">+10.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">GDF</span>
                <span className="text-sm font-medium text-green-600">+7.1%</span>
              </div>
            </div>
          </div>

          {/* Customer Risk Alerts */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                <i className="ri-alert-line text-red-600 text-xl"></i>
              </div>
              <span className="text-sm text-red-600 font-medium">3</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">At Risk</h3>
            <p className="text-sm text-gray-600 mb-3">Customers requiring attention</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Qatar</span>
                <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">HIGH</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Slovenia</span>
                <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">MEDIUM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">WHSmith</span>
                <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">MEDIUM</span>
              </div>
            </div>
          </div>

          {/* Channel Performance */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <i className="ri-store-line text-green-600 text-xl"></i>
              </div>
              <span className="text-sm text-green-600 font-medium">€64.4M</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Top Channel</h3>
            <p className="text-sm text-gray-600 mb-3">Grocery ROI leading performance</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Grocery ROI</span>
                <span className="text-sm font-medium text-gray-900">59.7%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Wholesale ROI</span>
                <span className="text-sm font-medium text-gray-900">18.3%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">International</span>
                <span className="text-sm font-medium text-gray-900">6.2%</span>
              </div>
            </div>
          </div>

          {/* Customer Insights */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <i className="ri-user-line text-purple-600 text-xl"></i>
              </div>
              <span className="text-sm text-purple-600 font-medium">77</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Customers</h3>
            <p className="text-sm text-gray-600 mb-3">Total active customer base</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">New this month</span>
                <span className="text-sm font-medium text-green-600">+7</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Retention rate</span>
                <span className="text-sm font-medium text-blue-600">87.3%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg. value</span>
                <span className="text-sm font-medium text-gray-900">€882K</span>
              </div>
            </div>
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
