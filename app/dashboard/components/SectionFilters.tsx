'use client';

import { useEffect, useState } from 'react';
import { dashboardAPI } from '../../services/api';

interface SectionFiltersProps {
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  selectedBusinessArea: string;
  setSelectedBusinessArea: (area: string) => void;
  selectedChannel: string;
  setSelectedChannel: (channel: string) => void;
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedSubCategory: string;
  setSelectedSubCategory: (subCategory: string) => void;
  selectedCustomer: string;
  setSelectedCustomer: (customer: string) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  onDownloadCSV: () => void;
  isDownloading?: boolean;
}

export default function SectionFilters({
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  selectedBusinessArea,
  setSelectedBusinessArea,
  selectedChannel,
  setSelectedChannel,
  selectedBrand,
  setSelectedBrand,
  selectedCategory,
  setSelectedCategory,
  selectedSubCategory,
  setSelectedSubCategory,
  selectedCustomer,
  setSelectedCustomer,
  onApplyFilters,
  onResetFilters,
  onDownloadCSV,
  isDownloading = false
}: SectionFiltersProps) {
  const [years, setYears] = useState<string[]>(['All']);
  const [months, setMonths] = useState<string[]>(['All']);
  const [businessAreas, setBusinessAreas] = useState<string[]>(['All']);
  const [channels, setChannels] = useState<string[]>(['All']);
  const [brands, setBrands] = useState<string[]>(['All']);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [subCategories, setSubCategories] = useState<string[]>(['All']);
  const [customers, setCustomers] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);

  // Fetch dynamic filter options from API
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setLoading(true);
        const response = await dashboardAPI.getFilterOptions();
        const data = response.data.data;
        
        if (data) {
          // Set years from the data
          if (data.years && Array.isArray(data.years)) {
            const yearOptions = ['All', ...data.years.map((year: number) => year.toString())];
            setYears(yearOptions);
          }
          
          // Set months from the data
          if (data.months && Array.isArray(data.months)) {
            const monthOptions = ['All', ...data.months];
            setMonths(monthOptions);
          }
          
          // Set business areas from the data
          if (data.businessAreas && Array.isArray(data.businessAreas)) {
            const businessAreaOptions = ['All', ...data.businessAreas];
            setBusinessAreas(businessAreaOptions);
          }
          
          // Set channels from the data
          if (data.channels && Array.isArray(data.channels)) {
            const channelOptions = ['All', ...data.channels];
            setChannels(channelOptions);
          }

          // Set brands from the data
          if (data.brands && Array.isArray(data.brands)) {
            const brandOptions = ['All', ...data.brands];
            setBrands(brandOptions);
          }

          // Set categories from the data
          if (data.categories && Array.isArray(data.categories)) {
            const categoryOptions = ['All', ...data.categories];
            setCategories(categoryOptions);
          }

          // Set sub-categories from the data
          if (data.subCategories && Array.isArray(data.subCategories)) {
            const subCategoryOptions = ['All', ...data.subCategories];
            setSubCategories(subCategoryOptions);
          }

          // Set customers from the data
          if (data.customers && Array.isArray(data.customers)) {
            const customerOptions = ['All', ...data.customers];
            setCustomers(customerOptions);
          }
        }
      } catch (error) {
        console.error('Error fetching filter options:', error);
        // Fallback to default values
        setYears(['All', '2024', '2023', '2022']);
        setMonths(['All', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']);
        setBusinessAreas(['All', 'Food', 'Household', 'Brillo', 'Kinetica']);
        setChannels(['All', 'Grocery ROI', 'Grocery UK & NI', 'Wholesale ROI', 'Wholesale UK & NI', 'International', 'Online', 'Sports & Others']);
        setBrands(['All']);
        setCategories(['All']);
        setSubCategories(['All']);
        setCustomers(['All']);
      } finally {
        setLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  // Reset dependent filters when parent changes
  const handleYearChange = (newYear: string) => {
    setSelectedYear(newYear);
    if (newYear === 'All') {
      setSelectedMonth('All');
    }
  };

  const handleBusinessAreaChange = (newBusinessArea: string) => {
    setSelectedBusinessArea(newBusinessArea);
    setSelectedChannel('All');
    setSelectedBrand('All');
    setSelectedCategory('All');
    setSelectedSubCategory('All');
  };

  const handleBrandChange = (newBrand: string) => {
    setSelectedBrand(newBrand);
    setSelectedCategory('All');
    setSelectedSubCategory('All');
  };

  const handleCategoryChange = (newCategory: string) => {
    setSelectedCategory(newCategory);
    setSelectedSubCategory('All');
  };

  const handleChannelChange = (newChannel: string) => {
    setSelectedChannel(newChannel);
    setSelectedCustomer('All');
  };

  if (loading) {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* All Filters Display */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">All Filters</h4>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Year: {selectedYear}</span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Month: {selectedMonth}</span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Business Area: {selectedBusinessArea}</span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Channel: {selectedChannel}</span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Brand: {selectedBrand}</span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Category: {selectedCategory}</span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Sub Category: {selectedSubCategory}</span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Customer: {selectedCustomer}</span>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
          <select
            value={selectedYear}
            onChange={(e) => handleYearChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Month *</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {months.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Business Area *</label>
          <select
            value={selectedBusinessArea}
            onChange={(e) => handleBusinessAreaChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {businessAreas.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Channel *</label>
          <select
            value={selectedChannel}
            onChange={(e) => handleChannelChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {channels.map(channel => (
              <option key={channel} value={channel}>{channel}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Brand *</label>
          <select
            value={selectedBrand}
            onChange={(e) => handleBrandChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sub Category *</label>
          <select
            value={selectedSubCategory}
            onChange={(e) => setSelectedSubCategory(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {subCategories.map(subCategory => (
              <option key={subCategory} value={subCategory}>{subCategory}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Customer *</label>
          <select
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {customers.map(customer => (
              <option key={customer} value={customer}>{customer}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <button 
            onClick={onApplyFilters}
            className="text-white px-4 py-2 rounded-md whitespace-nowrap hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#0B2639' }}
          >
            Apply Filters
          </button>
          <button 
            onClick={onResetFilters}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-200 whitespace-nowrap transition-colors"
          >
            Reset All
          </button>
        </div>
        
        <button
          onClick={onDownloadCSV}
          disabled={isDownloading}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isDownloading ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Downloading...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Download CSV</span>
            </>
          )}
        </button>
      </div>

      {/* Data Info */}
      <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
        <p>All Data in tables will show</p>
      </div>
    </div>
  );
}
