
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardFilters from './components/DashboardFilters';
import { FGPByBusinessUnit, FGPByChannel, FGPMonthlyTrend, FGPAnalysisHeader } from './components/fGPCharts';
import { GSalesByBusinessUnit, GSalesByChannel, GSalesMonthlyTrend, GSalesAnalysisHeader } from './components/gSalesCharts';

export default function Dashboard() {
  const [filters, setFilters] = useState<any>({
    year: ['2023', '2024', '2025'],
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    business: ['Brillo, Goddards & KMPL', 'Cali Cali', 'Food', 'Green Aware', 'Household & Beauty', 'Kinetica'],
    channel: ['Convenience', 'Grocery', 'International', 'Online', 'Sports & Others', 'Wholesale'],
    brand: ['Asda', 'Babykind', 'Bensons', 'Bonne Maman', 'Brillo', 'BV Honey', 'Koka', 'McDonnells'],
    category: ['Pickles', 'Plastic sacks', 'Polish', 'Pots', 'Preserves', 'Protein Bar', 'Protein Milk', 'Shopping bags', 'Snacking'],
    customer: ['Aldi ROI', 'Amazon', 'Australia', 'Austria', 'Bahrain', 'Barry Group', 'Belgium', 'BWG', 'Canada']
  });

  // Memoize the filters object to prevent unnecessary re-renders
  const memoizedFilters = useMemo(() => filters, [filters.year, filters.month, filters.business, filters.channel, filters.brand, filters.category, filters.customer]);

  const handleFiltersChange = useCallback((newFilters: any) => {
    setFilters(newFilters);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Comprehensive business performance overview with advanced filtering</p>
          </div>
        </div>
        
        <div className="flex space-x-6">
          {/* Left Side - Filters */}
          <div className="flex-shrink-0">
            <DashboardFilters onFiltersChange={handleFiltersChange} />
          </div>
          
          {/* Right Side - Charts - One per row */}
          <div className="flex-1 space-y-6">
            {/* fGP Charts Section */}
            <div className="space-y-6">
              <FGPAnalysisHeader />
              
              {/* Chart 1: fGP by Business Unit */}
              <FGPByBusinessUnit filters={memoizedFilters} />
              
              {/* Chart 2: fGP by Channel */}
              <FGPByChannel filters={memoizedFilters} />
              
              {/* Chart 3: fGP Monthly Trend */}
              <FGPMonthlyTrend filters={memoizedFilters} />
            </div>
            
            {/* gSales Charts Section */}
            <div className="space-y-6">
              <GSalesAnalysisHeader />
              
              {/* Chart 5: gSales by Business Unit */}
              <GSalesByBusinessUnit filters={memoizedFilters} />
              
              {/* Chart 6: gSales by Channel */}
              <GSalesByChannel filters={memoizedFilters} />
              
              {/* Chart 8: gSales Monthly Trend */}
              <GSalesMonthlyTrend filters={memoizedFilters} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
