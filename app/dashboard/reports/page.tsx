'use client';

import { useState } from 'react';
import DashboardHeader from '../DashboardHeader';
import SummaryFilters from '../SummaryFilters';

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState('YTD');
  const [selectedBusinessArea, setSelectedBusinessArea] = useState('All');
  const [selectedChannel, setSelectedChannel] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('All');

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-600 mt-1">Generate and export comprehensive business reports</p>
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
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h2 className="text-xl font-semibold">Performance Report</h2>
            </div>
            <p className="text-gray-600 mb-4">Comprehensive analysis of business performance metrics</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Generate Report
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-2 mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h2 className="text-xl font-semibold">Export Data</h2>
            </div>
            <p className="text-gray-600 mb-4">Export filtered data in various formats (CSV, Excel, PDF)</p>
            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
              Export Data
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Reports</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Q4 2024 Performance Report</p>
                <p className="text-sm text-gray-600">Generated on Dec 31, 2024</p>
              </div>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Download
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Annual Business Review 2024</p>
                <p className="text-sm text-gray-600">Generated on Dec 15, 2024</p>
              </div>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Download
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Monthly Performance Summary</p>
                <p className="text-sm text-gray-600">Generated on Dec 1, 2024</p>
              </div>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
