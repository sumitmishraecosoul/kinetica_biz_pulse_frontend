'use client';

import { useState, useEffect } from "react";
import * as dashboardAPI from '../../services/dashboardAPI';
// Using existing icon system instead of lucide-react

interface FilterOption {
  label: string;
  value: string;
  checked: boolean;
}

interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}

const FilterDropdown = ({ label, options, onChange }: FilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const checkedCount = options.filter(option => option.checked).length;
  const displayLabel = checkedCount > 0 ? `${label} (${checkedCount})` : label;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="filter-dropdown px-4 py-2 text-sm font-medium flex items-center space-x-2"
      >
        <span>{displayLabel}</span>
        <i className="ri-arrow-down-s-line text-sm"></i>
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-dashboard-border rounded-md shadow-lg z-10">
          <div className="p-2">
            {/* Select All Checkbox */}
            <div className="border-b border-dashboard-border pb-2 mb-2">
              <div
                className="flex items-center space-x-2 px-2 py-1 hover:bg-dashboard-gray-light cursor-pointer rounded"
                onClick={() => {
                  const allChecked = options.every(option => option.checked);
                  options.forEach(option => {
                    if (allChecked) {
                      // If all are checked, uncheck all
                      if (option.checked) onChange(option.value);
                    } else {
                      // If not all are checked, check all
                      if (!option.checked) onChange(option.value);
                    }
                  });
                }}
              >
                <input
                  type="checkbox"
                  checked={options.every(option => option.checked)}
                  onChange={() => {}}
                  className="w-4 h-4 text-dashboard-blue border-dashboard-gray rounded focus:ring-dashboard-blue"
                />
                <span className="text-sm font-medium">Select All</span>
              </div>
            </div>
            
            {/* Individual Options */}
            {options.map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-2 px-2 py-1 hover:bg-dashboard-gray-light cursor-pointer rounded"
                onClick={() => onChange(option.value)}
              >
                <input
                  type="checkbox"
                  checked={option.checked}
                  onChange={() => {}}
                  className="w-4 h-4 text-dashboard-blue border-dashboard-gray rounded focus:ring-dashboard-blue"
                />
                <span className="text-sm">{option.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface FilterBarProps {
  onFiltersChange: (filters: any) => void;
}

export default function FilterBar({ onFiltersChange }: FilterBarProps) {
  // Start with hardcoded values so filters always show
  const [filters, setFilters] = useState({
    year: [
      { label: "2023", value: "2023", checked: true },
      { label: "2024", value: "2024", checked: true },
      { label: "2025", value: "2025", checked: true },
    ],
    month: [
      { label: "January", value: "Jan", checked: true },
      { label: "February", value: "Feb", checked: true },
      { label: "March", value: "Mar", checked: true },
      { label: "April", value: "Apr", checked: true },
      { label: "May", value: "May", checked: true },
      { label: "June", value: "Jun", checked: true },
      { label: "July", value: "Jul", checked: true },
      { label: "August", value: "Aug", checked: true },
      { label: "September", value: "Sep", checked: true },
      { label: "October", value: "Oct", checked: true },
      { label: "November", value: "Nov", checked: true },
      { label: "December", value: "Dec", checked: true },
    ],
    business: [
      { label: "Brillo, Goddards & KMPL", value: "Brillo, Goddards & KMPL", checked: true },
      { label: "Cali Cali", value: "Cali Cali", checked: true },
      { label: "Food", value: "Food", checked: true },
      { label: "Green Aware", value: "Green Aware", checked: true },
      { label: "Household & Beauty", value: "Household & Beauty", checked: true },
      { label: "Kinetica", value: "Kinetica", checked: true },
    ],
    channel: [
      { label: "Convenience", value: "Convenience", checked: true },
      { label: "Grocery", value: "Grocery", checked: true },
      { label: "International", value: "International", checked: true },
      { label: "Online", value: "Online", checked: true },
      { label: "Sports & Others", value: "Sports & Others", checked: true },
      { label: "Wholesale", value: "Wholesale", checked: true },
    ],
    brand: [
      { label: "Asda", value: "Asda", checked: true },
      { label: "Babykind", value: "Babykind", checked: true },
      { label: "Bensons", value: "Bensons", checked: true },
      { label: "Bonne Maman", value: "Bonne Maman", checked: true },
      { label: "Brillo", value: "Brillo", checked: true },
      { label: "BV Honey", value: "BV Honey", checked: true },
      { label: "Koka", value: "Koka", checked: true },
      { label: "McDonnells", value: "McDonnells", checked: true },
    ],
    category: [
      { label: "Pickles", value: "Pickles", checked: true },
      { label: "Plastic sacks", value: "Plastic sacks", checked: true },
      { label: "Polish", value: "Polish", checked: true },
      { label: "Pots", value: "Pots", checked: true },
      { label: "Preserves", value: "Preserves", checked: true },
      { label: "Protein Bar", value: "Protein Bar", checked: true },
      { label: "Protein Milk", value: "Protein Milk", checked: true },
      { label: "Shopping bags", value: "Shopping bags", checked: true },
      { label: "Snacking", value: "Snacking", checked: true },
    ],
    customer: [
      { label: "Aldi ROI", value: "Aldi ROI", checked: true },
      { label: "Amazon", value: "Amazon", checked: true },
      { label: "Australia", value: "Australia", checked: true },
      { label: "Austria", value: "Austria", checked: true },
      { label: "Bahrain", value: "Bahrain", checked: true },
      { label: "Barry Group", value: "Barry Group", checked: true },
      { label: "Belgium", value: "Belgium", checked: true },
      { label: "BWG", value: "BWG", checked: true },
      { label: "Canada", value: "Canada", checked: true },
    ],
  });

  // Fetch real data from API and update filters
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        console.log('FilterBar: Fetching filter options from API...');
        const response = await dashboardAPI.getFilterOptions();
        
        console.log('FilterBar: API Response received');
        console.log('Full API Response:', response);
        console.log('Response data:', response.data);
        console.log('Response data.data:', response.data?.data);
        console.log('Brands count:', response.data?.brands?.length || 0);
        console.log('Customers count:', response.data?.customers?.length || 0);
        console.log('Categories count:', response.data?.categories?.length || 0);
        
        // Update filters with real data from API
        const apiData = response.data;
        setFilters(prevFilters => ({
          year: (apiData?.years || []).map((year: number) => ({
            label: year.toString(),
            value: year.toString(),
            checked: true
          })),
          month: (apiData?.months || []).map((month: string) => ({
            label: month,
            value: month,
            checked: true
          })),
          business: (apiData?.businessAreas || []).map((business: string) => ({
            label: business,
            value: business,
            checked: true
          })),
          channel: (apiData?.channels || []).map((channel: string) => ({
            label: channel,
            value: channel,
            checked: true
          })),
          brand: (apiData?.brands || []).map((brand: string) => ({
            label: brand,
            value: brand,
            checked: true
          })),
          category: (apiData?.categories || []).map((category: string) => ({
            label: category,
            value: category,
            checked: true
          })),
          customer: (apiData?.customers || []).map((customer: string) => ({
            label: customer,
            value: customer,
            checked: true
          })),
        }));
        
        console.log('FilterBar: Filters updated with real data');
      } catch (error) {
        console.error('FilterBar: Error fetching filter options:', error);
        // Keep existing hardcoded values if API fails
      }
    };
    
    fetchFilterOptions();
  }, []);

  // Call onFiltersChange whenever filters are updated
  useEffect(() => {
    const selectedFilters = Object.keys(filters).reduce((acc, key) => {
      acc[key] = filters[key as keyof typeof filters]
        .filter(option => option.checked)
        .map(option => option.value);
      return acc;
    }, {} as Record<string, string[]>);
    
    onFiltersChange(selectedFilters);
  }, [filters, onFiltersChange]);

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType as keyof typeof prev].map(option =>
        option.value === value ? { ...option, checked: !option.checked } : option
      )
    }));
  };

  const clearAllFilters = () => {
    setFilters(prev => {
      const newFilters = { ...prev };
      Object.keys(newFilters).forEach(key => {
        newFilters[key as keyof typeof newFilters] = newFilters[key as keyof typeof newFilters].map(option => ({
          ...option,
          checked: false
        }));
      });
      return newFilters;
    });
  };

  const selectAllFilters = () => {
    setFilters(prev => {
      const newFilters = { ...prev };
      Object.keys(newFilters).forEach(key => {
        newFilters[key as keyof typeof newFilters] = newFilters[key as keyof typeof newFilters].map(option => ({
          ...option,
          checked: true
        }));
      });
      return newFilters;
    });
  };

  const applyFilters = () => {
    const selectedFilters = Object.keys(filters).reduce((acc, key) => {
      acc[key] = filters[key as keyof typeof filters]
        .filter(option => option.checked)
        .map(option => option.value);
      return acc;
    }, {} as Record<string, string[]>);
    
    onFiltersChange(selectedFilters);
  };

  return (
    <div className="bg-dashboard-gray-light px-6 py-4 border-b border-dashboard-border">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-dashboard-navy mb-1">Dashboard</h1>
        <p className="text-dashboard-gray-dark text-sm">
          Comprehensive business performance overview with advanced filtering
        </p>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <FilterDropdown
            label="Year"
            options={filters.year}
            onChange={(value) => handleFilterChange('year', value)}
          />
          <FilterDropdown
            label="Month"
            options={filters.month}
            onChange={(value) => handleFilterChange('month', value)}
          />
          <FilterDropdown
            label="Business"
            options={filters.business}
            onChange={(value) => handleFilterChange('business', value)}
          />
          <FilterDropdown
            label="Channel"
            options={filters.channel}
            onChange={(value) => handleFilterChange('channel', value)}
          />
          <FilterDropdown
            label="Brand"
            options={filters.brand}
            onChange={(value) => handleFilterChange('brand', value)}
          />
          <FilterDropdown
            label="Category"
            options={filters.category}
            onChange={(value) => handleFilterChange('category', value)}
          />
          <FilterDropdown
            label="Customer"
            options={filters.customer}
            onChange={(value) => handleFilterChange('customer', value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={selectAllFilters}
            className="px-4 py-2 text-sm font-medium text-dashboard-blue hover:text-dashboard-navy border border-dashboard-blue rounded-md hover:bg-blue-50"
          >
            Select All
          </button>
          <button 
            onClick={clearAllFilters}
            className="px-4 py-2 text-sm font-medium text-dashboard-gray-dark hover:text-dashboard-navy border border-dashboard-border rounded-md hover:bg-dashboard-gray-light"
          >
            Clear All
          </button>
          <button 
            onClick={applyFilters}
            className="px-4 py-2 text-sm font-medium bg-dashboard-blue hover:bg-dashboard-navy-light text-dashboard-white rounded-md"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
