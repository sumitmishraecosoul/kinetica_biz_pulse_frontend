'use client';

import { useState, useEffect } from 'react';

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
  sectionType?: 'customers' | 'food-brands' | 'food-brands-details';
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
  sectionType = 'customers'
}: CustomerFiltersProps) {
  // Hardcoded options that will definitely work
  const filterOptions = {
    years: ['All', '2025', '2024', '2023'],
    months: ['All', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    channels: ['All', 'Grocery', 'Wholesale', 'International', 'Online', 'Sports & Others', 'Convenience'],
    categories: ['All', 'Beauty', 'Jam', 'Honey', 'Polish', 'Pots', 'Preserves', 'Protein Bar', 'Protein Milk', 'Shopping bags', 'Snacking'],
    subCategories: ['All', 'Sub1', 'Sub2', 'Sub3'],
    customers: ['All', 'Musgrave ROI', 'Dunnes ROI', 'Tesco ROI', 'BWG', 'UK', 'NI', 'Others ROI', 'Germany', 'Aldi ROI', 'Stonehouse', 'Amazon', 'Australia', 'Austria', 'Bahrain', 'Barry Group', 'Belgium', 'Canada']
  };

  console.log('CustomerFilters: Component rendered with options:', filterOptions);
  console.log('CustomerFilters: Selected values:', {
    selectedYear,
    selectedMonth,
    selectedChannel,
    selectedCustomer
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Analysis Filters</h2>
        <div className="flex items-center space-x-4">
          <div className="text-xs text-gray-500">
            Years: {filterOptions.years.length} | Months: {filterOptions.months.length} | 
            Channels: {filterOptions.channels.length} | Customers: {filterOptions.customers.length}
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Save as Default
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-4">
        {/* Year Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Year ({filterOptions.years.length} options)
          </label>
          <select
            value={selectedYear}
            onChange={(e) => {
              console.log('Year changed to:', e.target.value);
              setSelectedYear(e.target.value);
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            {filterOptions.years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Month Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Month ({filterOptions.months.length} options)
          </label>
          <select
            value={selectedMonth}
            onChange={(e) => {
              console.log('Month changed to:', e.target.value);
              setSelectedMonth(e.target.value);
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            {filterOptions.months.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>

        {/* Channel Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Channel ({filterOptions.channels.length} options)
          </label>
          <select
            value={selectedChannel}
            onChange={(e) => {
              console.log('Channel changed to:', e.target.value);
              setSelectedChannel(e.target.value);
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            {filterOptions.channels.map((channel) => (
              <option key={channel} value={channel}>{channel}</option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category ({filterOptions.categories.length} options)
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => {
              console.log('Category changed to:', e.target.value);
              setSelectedCategory(e.target.value);
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            {filterOptions.categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Sub Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sub Category ({filterOptions.subCategories.length} options)
          </label>
          <select
            value={selectedSubCategory}
            onChange={(e) => {
              console.log('SubCategory changed to:', e.target.value);
              setSelectedSubCategory(e.target.value);
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            {filterOptions.subCategories.map((subCategory) => (
              <option key={subCategory} value={subCategory}>{subCategory}</option>
            ))}
          </select>
        </div>

        {/* Customer Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Customer ({filterOptions.customers.length} options)
          </label>
          <select
            value={selectedCustomer}
            onChange={(e) => {
              console.log('Customer changed to:', e.target.value);
              setSelectedCustomer(e.target.value);
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            {filterOptions.customers.map((customer) => (
              <option key={customer} value={customer}>{customer}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              console.log('Apply Filters clicked');
              onApplyFilters();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Apply Filters
          </button>
          <button
            onClick={() => {
              console.log('Reset Filters clicked');
              onResetFilters();
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Reset All
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              console.log('Download CSV clicked');
              onDownloadCSV();
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Download CSV
          </button>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}