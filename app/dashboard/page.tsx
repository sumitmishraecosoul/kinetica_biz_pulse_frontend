
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import DashboardHeader from './DashboardHeader';
import FilterBar from './components/FilterBar';
import AnalyticsSection from './components/AnalyticsSection';

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
    console.log('Dashboard: Filters changed:', newFilters);
    setFilters(newFilters);
  }, []);

  return (
    <div className="min-h-screen bg-dashboard-gray-light">
      <DashboardHeader />
      <FilterBar onFiltersChange={handleFiltersChange} />
      
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* gSales Analysis Section */}
        <AnalyticsSection title="gSales Analysis" filters={memoizedFilters} />
        
        {/* fGP Analysis Section */}
        <AnalyticsSection title="fGP Analysis" filters={memoizedFilters} />
        
        {/* Cases Analysis Section */}
        <AnalyticsSection title="Cases Analysis" filters={memoizedFilters} />
      </div>
    </div>
  );
}
