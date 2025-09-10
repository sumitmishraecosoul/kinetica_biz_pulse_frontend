'use client';

import { useState, useEffect } from 'react';
import DashboardHeader from '../DashboardHeader';
import CollapsibleSection from '../components/CollapsibleSection';
import SectionFilters from '../components/SectionFilters';
import SummaryTable from '../components/SummaryTable';
import { dashboardAPI } from '../../services/api';
import { SummaryRowData } from '../../services/summaryCalculationService';

interface FilterState {
  selectedYear: string;
  selectedMonth: string;
  selectedBusinessArea: string;
  selectedChannel: string;
  selectedBrand: string;
  selectedCategory: string;
  selectedSubCategory: string;
  selectedCustomer: string;
}

export default function Reports() {
  const [activeTab, setActiveTab] = useState<'reports' | 'summary'>('reports');
  
  const [filters, setFilters] = useState<FilterState>({
    selectedYear: '2024',
    selectedMonth: 'All',
    selectedBusinessArea: 'All',
    selectedChannel: 'All',
    selectedBrand: 'All',
    selectedCategory: 'All',
    selectedSubCategory: 'All',
    selectedCustomer: 'All',
  });

  const [businessAreaData, setBusinessAreaData] = useState<SummaryRowData[]>([]);
  const [channelData, setChannelData] = useState<SummaryRowData[]>([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Fetch reports summary data from Azure using new APIs
  const fetchReportsData = async () => {
    try {
      console.log('Fetching reports data from Azure APIs...');
      
      const filterParams = {
        year: filters.selectedYear !== 'All' ? parseInt(filters.selectedYear) : undefined,
        month: filters.selectedMonth !== 'All' ? filters.selectedMonth : undefined,
        businessArea: filters.selectedBusinessArea !== 'All' ? filters.selectedBusinessArea : undefined,
        channel: filters.selectedChannel !== 'All' ? filters.selectedChannel : undefined,
        customer: filters.selectedCustomer !== 'All' ? filters.selectedCustomer : undefined,
        brand: filters.selectedBrand !== 'All' ? filters.selectedBrand : undefined,
        category: filters.selectedCategory !== 'All' ? filters.selectedCategory : undefined,
        subCategory: filters.selectedSubCategory !== 'All' ? filters.selectedSubCategory : undefined,
      };

      console.log('Filter params:', filterParams);

      // Fetch Business Area Summary
      const businessAreaResponse = await dashboardAPI.getReportsBusinessAreaSummary(filterParams);
      console.log('Business Area API Response:', businessAreaResponse.data);
      console.log('Business Area Data Array:', businessAreaResponse.data.data);
      console.log('Business Area Data Length:', businessAreaResponse.data.data?.length);
      if (businessAreaResponse.data.data?.length > 0) {
        console.log('First Business Area Row:', businessAreaResponse.data.data[0]);
      }
      setBusinessAreaData(businessAreaResponse.data.data || []);

      // Fetch Channel Summary
      const channelResponse = await dashboardAPI.getReportsChannelSummary(filterParams);
      console.log('Channel API Response:', channelResponse.data);
      console.log('Channel Data Array:', channelResponse.data.data);
      console.log('Channel Data Length:', channelResponse.data.data?.length);
      if (channelResponse.data.data?.length > 0) {
        console.log('First Channel Row:', channelResponse.data.data[0]);
      }
      setChannelData(channelResponse.data.data || []);

    } catch (error) {
      console.error('Error fetching reports data:', error);
      // Set empty data on error
      setBusinessAreaData([]);
      setChannelData([]);
    }
  };

  // Fetch data when filters change
  const fetchData = async () => {
    setLoading(true);
    try {
      await fetchReportsData();
    } catch (error) {
      console.error('Error fetching reports data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Refetch data when filters change
  useEffect(() => {
    fetchData();
  }, [filters]);

  const handleApplyFilters = () => {
    fetchData();
  };

  const handleResetFilters = () => {
    setFilters({
      selectedYear: 'All',
      selectedMonth: 'All',
      selectedBusinessArea: 'All',
      selectedChannel: 'All',
      selectedBrand: 'All',
      selectedCategory: 'All',
      selectedSubCategory: 'All',
      selectedCustomer: 'All',
    });
  };

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const filterParams = {
        year: filters.selectedYear !== 'All' ? parseInt(filters.selectedYear) : undefined,
        month: filters.selectedMonth !== 'All' ? filters.selectedMonth : undefined,
        businessArea: filters.selectedBusinessArea !== 'All' ? filters.selectedBusinessArea : undefined,
        channel: filters.selectedChannel !== 'All' ? filters.selectedChannel : undefined,
        brand: filters.selectedBrand !== 'All' ? filters.selectedBrand : undefined,
        category: filters.selectedCategory !== 'All' ? filters.selectedCategory : undefined,
        subCategory: filters.selectedSubCategory !== 'All' ? filters.selectedSubCategory : undefined,
        customer: filters.selectedCustomer !== 'All' ? filters.selectedCustomer : undefined,
      };

      const response = await dashboardAPI.exportCSV(filterParams);
      
      // Create blob and download
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `kinetica-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Failed to export CSV. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header with Tabs */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab('reports')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'reports'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Reports
              </button>
              <button
                onClick={() => setActiveTab('summary')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'summary'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Summary
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-semibold text-gray-900">Business Area and Channel-Summary</h1>
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Collapsible Sections */}
        <div className="space-y-4">
          {/* Summary Section */}
          <CollapsibleSection 
            title="Summary" 
            defaultExpanded={true}
          >
            <SectionFilters
              selectedYear={filters.selectedYear}
              setSelectedYear={(year) => setFilters(prev => ({ ...prev, selectedYear: year }))}
              selectedMonth={filters.selectedMonth}
              setSelectedMonth={(month) => setFilters(prev => ({ ...prev, selectedMonth: month }))}
              selectedBusinessArea={filters.selectedBusinessArea}
              setSelectedBusinessArea={(area) => setFilters(prev => ({ ...prev, selectedBusinessArea: area }))}
              selectedChannel={filters.selectedChannel}
              setSelectedChannel={(channel) => setFilters(prev => ({ ...prev, selectedChannel: channel }))}
              selectedBrand={filters.selectedBrand}
              setSelectedBrand={(brand) => setFilters(prev => ({ ...prev, selectedBrand: brand }))}
              selectedCategory={filters.selectedCategory}
              setSelectedCategory={(category) => setFilters(prev => ({ ...prev, selectedCategory: category }))}
              selectedSubCategory={filters.selectedSubCategory}
              setSelectedSubCategory={(subCategory) => setFilters(prev => ({ ...prev, selectedSubCategory: subCategory }))}
              selectedCustomer={filters.selectedCustomer}
              setSelectedCustomer={(customer) => setFilters(prev => ({ ...prev, selectedCustomer: customer }))}
              onApplyFilters={handleApplyFilters}
              onResetFilters={handleResetFilters}
              onDownloadCSV={handleExportCSV}
              isDownloading={exporting}
            />
            
            <div className="mt-6 space-y-6">
              <SummaryTable 
                title="Business Area" 
                data={businessAreaData} 
                loading={loading}
                periodLabel={filters.selectedMonth !== 'All' ? filters.selectedMonth : 'YTD'}
              />
              <SummaryTable 
                title="Channel" 
                data={channelData} 
                loading={loading}
                periodLabel={filters.selectedMonth !== 'All' ? filters.selectedMonth : 'YTD'}
              />
            </div>
          </CollapsibleSection>

          {/* Total Brands Section */}
          <CollapsibleSection title="Total Brands">
            <SectionFilters
              selectedYear={filters.selectedYear}
              setSelectedYear={(year) => setFilters(prev => ({ ...prev, selectedYear: year }))}
              selectedMonth={filters.selectedMonth}
              setSelectedMonth={(month) => setFilters(prev => ({ ...prev, selectedMonth: month }))}
              selectedBusinessArea={filters.selectedBusinessArea}
              setSelectedBusinessArea={(area) => setFilters(prev => ({ ...prev, selectedBusinessArea: area }))}
              selectedChannel={filters.selectedChannel}
              setSelectedChannel={(channel) => setFilters(prev => ({ ...prev, selectedChannel: channel }))}
              selectedBrand={filters.selectedBrand}
              setSelectedBrand={(brand) => setFilters(prev => ({ ...prev, selectedBrand: brand }))}
              selectedCategory={filters.selectedCategory}
              setSelectedCategory={(category) => setFilters(prev => ({ ...prev, selectedCategory: category }))}
              selectedSubCategory={filters.selectedSubCategory}
              setSelectedSubCategory={(subCategory) => setFilters(prev => ({ ...prev, selectedSubCategory: subCategory }))}
              selectedCustomer={filters.selectedCustomer}
              setSelectedCustomer={(customer) => setFilters(prev => ({ ...prev, selectedCustomer: customer }))}
              onApplyFilters={handleApplyFilters}
              onResetFilters={handleResetFilters}
              onDownloadCSV={handleExportCSV}
              isDownloading={exporting}
            />
            
            <div className="mt-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Brand Performance</h3>
                <div className="text-center py-8 text-gray-500">
                  Brand performance data will be displayed here
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* Customers Section */}
          <CollapsibleSection title="Customers">
            <SectionFilters
              selectedYear={filters.selectedYear}
              setSelectedYear={(year) => setFilters(prev => ({ ...prev, selectedYear: year }))}
              selectedMonth={filters.selectedMonth}
              setSelectedMonth={(month) => setFilters(prev => ({ ...prev, selectedMonth: month }))}
              selectedBusinessArea={filters.selectedBusinessArea}
              setSelectedBusinessArea={(area) => setFilters(prev => ({ ...prev, selectedBusinessArea: area }))}
              selectedChannel={filters.selectedChannel}
              setSelectedChannel={(channel) => setFilters(prev => ({ ...prev, selectedChannel: channel }))}
              selectedBrand={filters.selectedBrand}
              setSelectedBrand={(brand) => setFilters(prev => ({ ...prev, selectedBrand: brand }))}
              selectedCategory={filters.selectedCategory}
              setSelectedCategory={(category) => setFilters(prev => ({ ...prev, selectedCategory: category }))}
              selectedSubCategory={filters.selectedSubCategory}
              setSelectedSubCategory={(subCategory) => setFilters(prev => ({ ...prev, selectedSubCategory: subCategory }))}
              selectedCustomer={filters.selectedCustomer}
              setSelectedCustomer={(customer) => setFilters(prev => ({ ...prev, selectedCustomer: customer }))}
              onApplyFilters={handleApplyFilters}
              onResetFilters={handleResetFilters}
              onDownloadCSV={handleExportCSV}
              isDownloading={exporting}
            />
            
            <div className="mt-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Customer Performance</h3>
                <div className="text-center py-8 text-gray-500">
                  Customer performance data will be displayed here
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* Trend Section */}
          <CollapsibleSection title="Trend">
            <SectionFilters
              selectedYear={filters.selectedYear}
              setSelectedYear={(year) => setFilters(prev => ({ ...prev, selectedYear: year }))}
              selectedMonth={filters.selectedMonth}
              setSelectedMonth={(month) => setFilters(prev => ({ ...prev, selectedMonth: month }))}
              selectedBusinessArea={filters.selectedBusinessArea}
              setSelectedBusinessArea={(area) => setFilters(prev => ({ ...prev, selectedBusinessArea: area }))}
              selectedChannel={filters.selectedChannel}
              setSelectedChannel={(channel) => setFilters(prev => ({ ...prev, selectedChannel: channel }))}
              selectedBrand={filters.selectedBrand}
              setSelectedBrand={(brand) => setFilters(prev => ({ ...prev, selectedBrand: brand }))}
              selectedCategory={filters.selectedCategory}
              setSelectedCategory={(category) => setFilters(prev => ({ ...prev, selectedCategory: category }))}
              selectedSubCategory={filters.selectedSubCategory}
              setSelectedSubCategory={(subCategory) => setFilters(prev => ({ ...prev, selectedSubCategory: subCategory }))}
              selectedCustomer={filters.selectedCustomer}
              setSelectedCustomer={(customer) => setFilters(prev => ({ ...prev, selectedCustomer: customer }))}
              onApplyFilters={handleApplyFilters}
              onResetFilters={handleResetFilters}
              onDownloadCSV={handleExportCSV}
              isDownloading={exporting}
            />
            
            <div className="mt-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Trend Analysis</h3>
                <div className="text-center py-8 text-gray-500">
                  Trend analysis charts will be displayed here
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* Sales to FGP Section */}
          <CollapsibleSection title="Sales to FGP">
            <SectionFilters
              selectedYear={filters.selectedYear}
              setSelectedYear={(year) => setFilters(prev => ({ ...prev, selectedYear: year }))}
              selectedMonth={filters.selectedMonth}
              setSelectedMonth={(month) => setFilters(prev => ({ ...prev, selectedMonth: month }))}
              selectedBusinessArea={filters.selectedBusinessArea}
              setSelectedBusinessArea={(area) => setFilters(prev => ({ ...prev, selectedBusinessArea: area }))}
              selectedChannel={filters.selectedChannel}
              setSelectedChannel={(channel) => setFilters(prev => ({ ...prev, selectedChannel: channel }))}
              selectedBrand={filters.selectedBrand}
              setSelectedBrand={(brand) => setFilters(prev => ({ ...prev, selectedBrand: brand }))}
              selectedCategory={filters.selectedCategory}
              setSelectedCategory={(category) => setFilters(prev => ({ ...prev, selectedCategory: category }))}
              selectedSubCategory={filters.selectedSubCategory}
              setSelectedSubCategory={(subCategory) => setFilters(prev => ({ ...prev, selectedSubCategory: subCategory }))}
              selectedCustomer={filters.selectedCustomer}
              setSelectedCustomer={(customer) => setFilters(prev => ({ ...prev, selectedCustomer: customer }))}
              onApplyFilters={handleApplyFilters}
              onResetFilters={handleResetFilters}
              onDownloadCSV={handleExportCSV}
              isDownloading={exporting}
            />
            
            <div className="mt-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Sales to FGP Analysis</h3>
                <div className="text-center py-8 text-gray-500">
                  Sales to FGP analysis will be displayed here
                </div>
              </div>
            </div>
          </CollapsibleSection>
        </div>

        {/* Footnotes */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Notes</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>1. Food includes Food, Mell & CAL business units.</p>
            <p>2. Waterwipes are excluded.</p>
            <p>3. Samples and sell off of stressed stock are excluded.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
