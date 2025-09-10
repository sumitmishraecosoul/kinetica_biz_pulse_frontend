'use client';

import { useEffect, useState } from 'react';
import { dashboardAPI } from '../../services/api';

interface ReportsFiltersProps {
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
}

export default function ReportsFilters({
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
  onResetFilters
}: ReportsFiltersProps) {
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

  // Fetch dependent filter options when parent filters change
  useEffect(() => {
    const fetchDependentOptions = async () => {
      try {
        const filters: any = {};
        if (selectedYear !== 'All') filters.year = parseInt(selectedYear);
        if (selectedBusinessArea !== 'All') filters.businessArea = selectedBusinessArea;
        if (selectedBrand !== 'All') filters.brand = selectedBrand;
        if (selectedCategory !== 'All') filters.category = selectedCategory;

        const response = await dashboardAPI.getFilterOptions(filters);
        const data = response.data.data;

        if (data) {
          // Update channels based on business area
          if (data.channels && Array.isArray(data.channels)) {
            const channelOptions = ['All', ...data.channels];
            setChannels(channelOptions);
          }

          // Update brands based on business area
          if (data.brands && Array.isArray(data.brands)) {
            const brandOptions = ['All', ...data.brands];
            setBrands(brandOptions);
          }

          // Update categories based on brand
          if (data.categories && Array.isArray(data.categories)) {
            const categoryOptions = ['All', ...data.categories];
            setCategories(categoryOptions);
          }

          // Update sub-categories based on category
          if (data.subCategories && Array.isArray(data.subCategories)) {
            const subCategoryOptions = ['All', ...data.subCategories];
            setSubCategories(subCategoryOptions);
          }

          // Update customers based on channel
          if (data.customers && Array.isArray(data.customers)) {
            const customerOptions = ['All', ...data.customers];
            setCustomers(customerOptions);
          }
        }
      } catch (error) {
        console.error('Error fetching dependent filter options:', error);
      }
    };

    fetchDependentOptions();
  }, [selectedYear, selectedBusinessArea, selectedBrand, selectedCategory]);

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
      <div className="bg-white rounded-lg shadow-sm p-6">
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
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-900">Filters *</h2>
      
      {/* First row of filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => handleYearChange(e.target.value)}
              className="w-full p-2 pr-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Month *</label>
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full p-2 pr-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Channel *</label>
          <div className="relative">
            <select
              value={selectedChannel}
              onChange={(e) => handleChannelChange(e.target.value)}
              className="w-full p-2 pr-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              {channels.map(channel => (
                <option key={channel} value={channel}>{channel}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Customer *</label>
          <div className="relative">
            <select
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="w-full p-2 pr-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              {customers.map(customer => (
                <option key={customer} value={customer}>{customer}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Second row of filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Business Area *</label>
          <div className="relative">
            <select
              value={selectedBusinessArea}
              onChange={(e) => handleBusinessAreaChange(e.target.value)}
              className="w-full p-2 pr-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              {businessAreas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Brand *</label>
          <div className="relative">
            <select
              value={selectedBrand}
              onChange={(e) => handleBrandChange(e.target.value)}
              className="w-full p-2 pr-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              {brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full p-2 pr-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sub Category *</label>
          <div className="relative">
            <select
              value={selectedSubCategory}
              onChange={(e) => setSelectedSubCategory(e.target.value)}
              className="w-full p-2 pr-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              {subCategories.map(subCategory => (
                <option key={subCategory} value={subCategory}>{subCategory}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
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
    </div>
  );
}
