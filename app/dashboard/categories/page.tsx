
'use client';

import { useState } from 'react';
import DashboardHeader from '../DashboardHeader';
import CategoryFilters from './CategoryFilters';
import CategoryOverviewCards from './CategoryOverviewCards';
import CategoryPerformanceMatrix from './CategoryPerformanceMatrix';
import SubCategoryAnalysis from './SubCategoryAnalysis';
import CategoryTrendsChart from './CategoryTrendsChart';
import CategoryDrillDownModal from './CategoryDrillDownModal';

export default function CategoryAnalysis() {
  const [selectedPeriod, setSelectedPeriod] = useState('YTD');
  const [selectedBusinessArea, setSelectedBusinessArea] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedChannel, setSelectedChannel] = useState('All');
  const [selectedView, setSelectedView] = useState('performance');
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
            <h1 className="text-3xl font-bold text-gray-900">Category Analysis</h1>
            <p className="text-gray-600 mt-1">Deep dive into product categories and sub-categories performance</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-white border border-gray-300 rounded-lg">
              {[
                { value: 'performance', label: 'Performance', icon: 'ri-bar-chart-line' },
                { value: 'trends', label: 'Trends', icon: 'ri-line-chart-line' },
                { value: 'matrix', label: 'Matrix', icon: 'ri-grid-line' }
              ].map(view => (
                <button
                  key={view.value}
                  onClick={() => setSelectedView(view.value)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    selectedView === view.value
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <i className={`${view.icon} mr-2`}></i>
                  {view.label}
                </button>
              ))}
            </div>
            <div className="flex space-x-2">
              <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                <i className="ri-download-line text-gray-600"></i>
              </button>
              <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                <i className="ri-bookmark-line text-gray-600"></i>
              </button>
            </div>
          </div>
        </div>

        <CategoryFilters
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
          selectedBusinessArea={selectedBusinessArea}
          setSelectedBusinessArea={setSelectedBusinessArea}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedChannel={selectedChannel}
          setSelectedChannel={setSelectedChannel}
        />

        <CategoryOverviewCards
          selectedPeriod={selectedPeriod}
          selectedBusinessArea={selectedBusinessArea}
          selectedCategory={selectedCategory}
          onDrillDown={handleDrillDown}
        />

        {selectedView === 'performance' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CategoryPerformanceMatrix
                selectedPeriod={selectedPeriod}
                selectedBusinessArea={selectedBusinessArea}
                selectedChannel={selectedChannel}
                onDrillDown={handleDrillDown}
              />
            </div>
            <div>
              <SubCategoryAnalysis
                selectedPeriod={selectedPeriod}
                selectedBusinessArea={selectedBusinessArea}
                selectedCategory={selectedCategory}
                onDrillDown={handleDrillDown}
              />
            </div>
          </div>
        )}

        {selectedView === 'trends' && (
          <CategoryTrendsChart
            selectedPeriod={selectedPeriod}
            selectedBusinessArea={selectedBusinessArea}
            selectedCategory={selectedCategory}
            onDrillDown={handleDrillDown}
          />
        )}

        {selectedView === 'matrix' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CategoryPerformanceMatrix
              selectedPeriod={selectedPeriod}
              selectedBusinessArea={selectedBusinessArea}
              selectedChannel={selectedChannel}
              onDrillDown={handleDrillDown}
            />
            <SubCategoryAnalysis
              selectedPeriod={selectedPeriod}
              selectedBusinessArea={selectedBusinessArea}
              selectedCategory={selectedCategory}
              onDrillDown={handleDrillDown}
            />
          </div>
        )}

        {isModalOpen && drillDownData && (
          <CategoryDrillDownModal
            data={drillDownData}
            onClose={closeModal}
          />
        )}
      </div>
    </div>
  );
}
