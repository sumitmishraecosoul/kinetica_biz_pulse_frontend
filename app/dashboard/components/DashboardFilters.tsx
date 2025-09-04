'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

interface FilterOption {
  value: string;
  label: string;
  selected: boolean;
}

interface FilterSection {
  id: string;
  title: string;
  options: FilterOption[];
  isOpen: boolean;
}

interface DashboardFiltersProps {
  onFiltersChange: (filters: any) => void;
}

export default function DashboardFilters({ onFiltersChange }: DashboardFiltersProps) {
  const [filters, setFilters] = useState<FilterSection[]>([
    {
      id: 'year',
      title: 'Year',
      options: [
        { value: '2023', label: '2023', selected: true },
        { value: '2024', label: '2024', selected: true },
        { value: '2025', label: '2025', selected: true }
      ],
      isOpen: true
    },
    {
      id: 'month',
      title: 'Month Name',
      options: [
        { value: 'Jan', label: 'Jan', selected: true },
        { value: 'Feb', label: 'Feb', selected: true },
        { value: 'Mar', label: 'Mar', selected: true },
        { value: 'Apr', label: 'Apr', selected: true },
        { value: 'May', label: 'May', selected: true },
        { value: 'Jun', label: 'Jun', selected: true },
        { value: 'Jul', label: 'Jul', selected: true },
        { value: 'Aug', label: 'Aug', selected: true },
        { value: 'Sep', label: 'Sep', selected: true },
        { value: 'Oct', label: 'Oct', selected: true },
        { value: 'Nov', label: 'Nov', selected: true },
        { value: 'Dec', label: 'Dec', selected: true }
      ],
      isOpen: true
    },
    {
      id: 'business',
      title: 'Business',
      options: [
        { value: 'Brillo, Goddards & KMPL', label: 'Brillo, Goddards & KMPL', selected: true },
        { value: 'Cali Cali', label: 'Cali Cali', selected: true },
        { value: 'Food', label: 'Food', selected: true },
        { value: 'Green Aware', label: 'Green Aware', selected: true },
        { value: 'Household & Beauty', label: 'Household & Beauty', selected: true },
        { value: 'Kinetica', label: 'Kinetica', selected: true }
      ],
      isOpen: true
    },
    {
      id: 'channel',
      title: 'Channel',
      options: [
        { value: 'Convenience', label: 'Convenience', selected: true },
        { value: 'Grocery', label: 'Grocery', selected: true },
        { value: 'International', label: 'International', selected: true },
        { value: 'Online', label: 'Online', selected: true },
        { value: 'Sports & Others', label: 'Sports & Others', selected: true },
        { value: 'Wholesale', label: 'Wholesale', selected: true }
      ],
      isOpen: true
    },
    {
      id: 'brand',
      title: 'Brand',
      options: [
        { value: 'Asda', label: 'Asda', selected: true },
        { value: 'Babykind', label: 'Babykind', selected: true },
        { value: 'Bensons', label: 'Bensons', selected: true },
        { value: 'Bonne Maman', label: 'Bonne Maman', selected: true },
        { value: 'Brillo', label: 'Brillo', selected: true },
        { value: 'BV Honey', label: 'BV Honey', selected: true },
        { value: 'Koka', label: 'Koka', selected: true },
        { value: 'McDonnells', label: 'McDonnells', selected: true }
      ],
      isOpen: true
    },
    {
      id: 'category',
      title: 'Category',
      options: [
        { value: 'Pickles', label: 'Pickles', selected: true },
        { value: 'Plastic sacks', label: 'Plastic sacks', selected: true },
        { value: 'Polish', label: 'Polish', selected: true },
        { value: 'Pots', label: 'Pots', selected: true },
        { value: 'Preserves', label: 'Preserves', selected: true },
        { value: 'Protein Bar', label: 'Protein Bar', selected: true },
        { value: 'Protein Milk', label: 'Protein Milk', selected: true },
        { value: 'Shopping bags', label: 'Shopping bags', selected: true },
        { value: 'Snacking', label: 'Snacking', selected: true }
      ],
      isOpen: true
    },
    {
      id: 'customer',
      title: 'Customer',
      options: [
        { value: 'Aldi ROI', label: 'Aldi ROI', selected: true },
        { value: 'Amazon', label: 'Amazon', selected: true },
        { value: 'Australia', label: 'Australia', selected: true },
        { value: 'Austria', label: 'Austria', selected: true },
        { value: 'Bahrain', label: 'Bahrain', selected: true },
        { value: 'Barry Group', label: 'Barry Group', selected: true },
        { value: 'Belgium', label: 'Belgium', selected: true },
        { value: 'BWG', label: 'BWG', selected: true },
        { value: 'Canada', label: 'Canada', selected: true }
      ],
      isOpen: true
    }
  ]);

  const toggleFilter = (filterId: string, optionValue: string) => {
    setFilters(prev => prev.map(filter => {
      if (filter.id === filterId) {
        return {
          ...filter,
          options: filter.options.map(option => 
            option.value === optionValue 
              ? { ...option, selected: !option.selected }
              : option
          )
        };
      }
      return filter;
    }));
  };

  const toggleSection = (filterId: string) => {
    setFilters(prev => prev.map(filter => 
      filter.id === filterId 
        ? { ...filter, isOpen: !filter.isOpen }
        : filter
    ));
  };

  const selectAll = (filterId: string) => {
    setFilters(prev => prev.map(filter => {
      if (filter.id === filterId) {
        return {
          ...filter,
          options: filter.options.map(option => ({ ...option, selected: true }))
        };
      }
      return filter;
    }));
  };

  const deselectAll = (filterId: string) => {
    setFilters(prev => prev.map(filter => {
      if (filter.id === filterId) {
        return {
          ...filter,
          options: filter.options.map(option => ({ ...option, selected: false }))
        };
      }
      return filter;
    }));
  };

  useEffect(() => {
    const selectedFilters = filters.reduce((acc, filter) => {
      acc[filter.id] = filter.options
        .filter(option => option.selected)
        .map(option => option.value);
      return acc;
    }, {} as Record<string, string[]>);
    
    onFiltersChange(selectedFilters);
  }, [filters, onFiltersChange]);

  return (
    <div className="w-80 bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button className="text-gray-400 hover:text-gray-600">
          <Cog6ToothIcon className="h-5 w-5" />
        </button>
      </div>

      {filters.map((filter) => (
        <div key={filter.id} className="border border-gray-200 rounded-lg">
          <div 
            className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
            onClick={() => toggleSection(filter.id)}
          >
            <h4 className="font-medium text-gray-900">{filter.title}</h4>
            {filter.isOpen ? (
              <ChevronUpIcon className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDownIcon className="h-4 w-4 text-gray-500" />
            )}
          </div>
          
          {filter.isOpen && (
            <div className="p-3 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => selectAll(filter.id)}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Select All
                </button>
                <button
                  onClick={() => deselectAll(filter.id)}
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  Deselect All
                </button>
              </div>
              
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {filter.options.map((option) => (
                  <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={option.selected}
                      onChange={() => toggleFilter(filter.id, option.value)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
