'use client';

import { useState, useEffect } from 'react';
import { dashboardAPI } from '../../services/api';

interface CustomerFiltersProps {
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
  onApplyFilters: () => void;
  onResetFilters: () => void;
  onDownloadCSV: () => void;
  isDownloading: boolean;
}

export default function CustomerFilters({
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
  onApplyFilters,
  onResetFilters,
  onDownloadCSV,
  isDownloading
}: CustomerFiltersProps) {
  const [filterOptions, setFilterOptions] = useState({
    years: [] as string[],
    months: [] as string[],
    channels: [] as string[],
    categories: [] as string[],
    subCategories: [] as string[],
    customers: [] as string[]
  });
  const [loading, setLoading] = useState(false);

  // Fetch filter options
  const fetchFilterOptions = async () => {
    setLoading(true);
    try {
      const response = await dashboardAPI.getFilterOptions();
      if (response.data && response.data.data) {
        setFilterOptions(response.data.data);
      } else {
        console.warn('No filter options data received');
        setFilterOptions({
          years: [],
          months: [],
          channels: [],
          categories: [],
          subCategories: [],
          customers: []
        });
      }
    } catch (error) {
      console.error('Error fetching filter options:', error);
      setFilterOptions({
        years: [],
        months: [],
        channels: [],
        categories: [],
        subCategories: [],
        customers: []
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {/* Year Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Year</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          >
            <option value="All">All</option>
            {filterOptions.years?.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            )) || []}
          </select>
        </div>

        {/* Month Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Month</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          >
            <option value="All">All</option>
            {filterOptions.months?.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            )) || []}
          </select>
        </div>

        {/* Channel Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Channel</label>
          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          >
            <option value="All">All</option>
            {filterOptions.channels?.map((channel) => (
              <option key={channel} value={channel}>
                {channel}
              </option>
            )) || []}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          >
            <option value="All">All</option>
            {filterOptions.categories?.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            )) || []}
          </select>
        </div>

        {/* Sub Category Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Sub Category</label>
          <select
            value={selectedSubCategory}
            onChange={(e) => setSelectedSubCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          >
            <option value="All">All</option>
            {filterOptions.subCategories?.map((subCategory) => (
              <option key={subCategory} value={subCategory}>
                {subCategory}
              </option>
            )) || []}
          </select>
        </div>

        {/* Customer Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Customer</label>
          <select
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          >
            <option value="All">All</option>
            {filterOptions.customers?.map((customer) => (
              <option key={customer} value={customer}>
                {customer}
              </option>
            )) || []}
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onApplyFilters}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Apply Filters
          </button>
          <button
            onClick={onResetFilters}
            className="px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Reset
          </button>
        </div>
        
        <button
          onClick={onDownloadCSV}
          disabled={isDownloading}
          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDownloading ? 'Downloading...' : 'Download CSV'}
        </button>
      </div>
    </div>
  );
}
