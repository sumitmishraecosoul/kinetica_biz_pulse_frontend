'use client';

import { useState } from 'react';
import DashboardHeader from '../DashboardHeader';
import BrandOverviewCards from './BrandOverviewCards';
import BrandPerformanceChart from './BrandPerformanceChart';
import MarginVarianceAnalysis from './MarginVarianceAnalysis';
import TopPerformersSection from './TopPerformersSection';
import BrandFilters from './BrandFilters';
import DrillDownModal from './DrillDownModal';

export default function BrandsAnalysis() {
  const [selectedBusinessArea, setSelectedBusinessArea] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedPeriod, setSelectedPeriod] = useState('YTD');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [drillDownData, setDrillDownData] = useState(null);
  const [showDrillDown, setShowDrillDown] = useState(false);

  const handleDrillDown = (data: any) => {
    setDrillDownData(data);
    setShowDrillDown(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Brand Analysis Dashboard</h1>
          <div className="flex space-x-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 whitespace-nowrap">
              <i className="ri-download-line mr-2"></i>Export Report
            </button>
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 whitespace-nowrap">
              <i className="ri-settings-3-line mr-2"></i>Configure
            </button>
          </div>
        </div>

        <BrandFilters
          selectedBusinessArea={selectedBusinessArea}
          setSelectedBusinessArea={setSelectedBusinessArea}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
          selectedMetric={selectedMetric}
          setSelectedMetric={setSelectedMetric}
        />

        <BrandOverviewCards 
          selectedBusinessArea={selectedBusinessArea}
          selectedBrand={selectedBrand}
          selectedPeriod={selectedPeriod}
          onDrillDown={handleDrillDown}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <BrandPerformanceChart
              selectedBusinessArea={selectedBusinessArea}
              selectedBrand={selectedBrand}
              selectedPeriod={selectedPeriod}
              selectedMetric={selectedMetric}
              onDrillDown={handleDrillDown}
            />
          </div>
          <div>
            <MarginVarianceAnalysis
              selectedBusinessArea={selectedBusinessArea}
              selectedBrand={selectedBrand}
            />
          </div>
        </div>

        <TopPerformersSection
          selectedBusinessArea={selectedBusinessArea}
          selectedBrand={selectedBrand}
          onDrillDown={handleDrillDown}
        />

        {showDrillDown && (
          <DrillDownModal
            data={drillDownData}
            onClose={() => setShowDrillDown(false)}
          />
        )}
      </div>
    </div>
  );
}