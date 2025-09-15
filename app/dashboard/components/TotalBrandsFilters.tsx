'use client';

import { useEffect, useState } from 'react';
import { dashboardAPI } from '../../services/api';

interface TotalBrandsFiltersProps {
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  selectedChannel: string;
  setSelectedChannel: (channel: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedSubCategory: string;
  setSelectedSubCategory: (subCategory: string) => void;
  selectedCustomer: string;
  setSelectedCustomer: (customer: string) => void;
  selectedRoi: string;
  setSelectedRoi: (roi: string) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  onDownloadCSV: () => void;
  isDownloading?: boolean;
}

export default function TotalBrandsFilters({
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  selectedChannel,
  setSelectedChannel,
  selectedCategory,
  setSelectedCategory,
  selectedSubCategory,
  setSelectedSubCategory,
  selectedCustomer,
  setSelectedCustomer,
  selectedRoi,
  setSelectedRoi,
  onApplyFilters,
  onResetFilters,
  onDownloadCSV,
  isDownloading = false
}: TotalBrandsFiltersProps) {
  const [filterOptions, setFilterOptions] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await dashboardAPI.getFilterOptions();
        if (response.data.success) {
          setFilterOptions(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching filter options:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!filterOptions) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Failed to load filter options</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-700 mb-4">Filters</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Year Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Year</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {filterOptions.years?.map((year: number) => (
              <option key={year} value={year.toString()}>{year}</option>
            ))}
          </select>
        </div>

        {/* Month Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Month</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All (YTD)</option>
            {filterOptions.months?.map((month: string) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>

        {/* Channel Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Channel</label>
          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Channels</option>
            {filterOptions.channels?.map((channel: string) => (
              <option key={channel} value={channel}>{channel}</option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Categories</option>
            {filterOptions.categories?.map((category: string) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Sub Category Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Sub Category</label>
          <select
            value={selectedSubCategory}
            onChange={(e) => setSelectedSubCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Sub Categories</option>
            {filterOptions.subCategories?.map((subCategory: string) => (
              <option key={subCategory} value={subCategory}>{subCategory}</option>
            ))}
          </select>
        </div>

        {/* Customer Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Customer</label>
          <select
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Customers</option>
            {filterOptions.customers?.map((customer: string) => (
              <option key={customer} value={customer}>{customer}</option>
            ))}
          </select>
        </div>

        {/* ROI Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">ROI Only</label>
          <select
            value={selectedRoi}
            onChange={(e) => setSelectedRoi(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All</option>
            <option value="ROI">ROI</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
        <div className="flex space-x-3">
          <button
            onClick={onApplyFilters}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Apply Filters
          </button>
          <button
            onClick={onResetFilters}
            className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Reset
          </button>
        </div>
        
        <button
          onClick={onDownloadCSV}
          disabled={isDownloading}
          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDownloading ? 'Exporting...' : 'Export CSV'}
        </button>
      </div>
    </div>
  );
}
