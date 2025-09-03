'use client';

import { useState, useEffect } from 'react';
import { dashboardAPI } from '../../services/api';

interface BrandFiltersProps {
  selectedBusinessArea: string;
  setSelectedBusinessArea: (area: string) => void;
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
  selectedMetric: string;
  setSelectedMetric: (metric: string) => void;
}

export default function BrandFilters({
  selectedBusinessArea,
  setSelectedBusinessArea,
  selectedBrand,
  setSelectedBrand,
  selectedPeriod,
  setSelectedPeriod,
  selectedMetric,
  setSelectedMetric
}: BrandFiltersProps) {
  const [filterOptions, setFilterOptions] = useState<any>({
    businessAreas: ['All'],
    brands: ['All'],
    periods: ['YTD', 'MTD', 'Q1', 'Q2', 'Q3', 'Q4', 'Last 12M']
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const metrics = [
    { value: 'revenue', label: 'Revenue' },
    { value: 'margin', label: 'Margin %' },
    { value: 'units', label: 'Units Sold' },
    { value: 'growth', label: 'Growth %' }
  ];

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await dashboardAPI.getFilterOptions();
        const data = response.data.data;
        
        if (!data || !data.brands || data.brands.length === 0) {
          throw new Error('No brand data available from API');
        }
        
        setFilterOptions({
          businessAreas: ['All', ...(data.businessAreas || [])],
          brands: ['All', ...(data.brands || [])],
          periods: data.periods || ['YTD', 'MTD', 'Q1', 'Q2', 'Q3', 'Q4', 'Last 12M']
        });
      } catch (error) {
        console.error('Error fetching filter options:', error);
        setError('Failed to load filter options. Please refresh the page.');
        // Don't set fallback data - let user know there's an issue
      } finally {
        setLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Advanced Filters</h2>
          <button className="text-gray-400 hover:text-gray-600">
            <i className="ri-settings-3-line text-lg"></i>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Advanced Filters</h2>
          <button className="text-gray-400 hover:text-gray-600">
            <i className="ri-settings-3-line text-lg"></i>
          </button>
        </div>
        
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">
            <i className="ri-error-warning-line text-2xl"></i>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Advanced Filters</h2>
        <button className="text-gray-400 hover:text-gray-600">
          <i className="ri-settings-3-line text-lg"></i>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Business Area</label>
          <div className="relative">
            <select
              value={selectedBusinessArea}
              onChange={(e) => {
                setSelectedBusinessArea(e.target.value);
                setSelectedBrand('All');
              }}
              className="w-full p-2 pr-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              {filterOptions.businessAreas.map((area: string) => (
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
          <div className="relative">
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full p-2 pr-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              {filterOptions.brands.map((brand: string) => (
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full p-2 pr-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              {filterOptions.periods.map((period: string) => (
                <option key={period} value={period}>{period}</option>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Primary Metric</label>
          <div className="relative">
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="w-full p-2 pr-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              {metrics.map(metric => (
                <option key={metric.value} value={metric.value}>{metric.label}</option>
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

      <div className="mt-4 flex items-center justify-between">
        <div className="flex space-x-2">
          <button 
            className="text-white px-4 py-2 rounded-md whitespace-nowrap hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#0B2639' }}
          >
            <i className="ri-search-line mr-2"></i>Apply Filters
          </button>
          <button 
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-200 whitespace-nowrap transition-colors"
            onClick={() => {
              setSelectedBusinessArea('All');
              setSelectedBrand('All');
              setSelectedPeriod('YTD');
              setSelectedMetric('revenue');
            }}
          >
            <i className="ri-refresh-line mr-2"></i>Reset All
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button className="text-gray-600 hover:text-gray-900 p-2">
            <i className="ri-bookmark-line"></i>
          </button>
          <button className="text-gray-600 hover:text-gray-900 p-2">
            <i className="ri-share-line"></i>
          </button>
        </div>
      </div>
    </div>
  );
}