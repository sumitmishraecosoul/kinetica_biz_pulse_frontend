'use client';

import React from 'react';

interface HouseholdBrandDetailsData {
  name: string;
  brand: string;
  subCategory: string;
  cases: {
    ytd: number;
    ly: number;
    lyVar: number;
    lyVarPercent: number;
  };
  gSales: {
    ytd: number;
    ly: number;
    lyVar: number;
    lyVarPercent: number;
  };
  fGP: {
    ytd: number;
    ly: number;
    lyVar: number;
    lyVarPercent: number;
  };
  fGPPercent: {
    ytd: number;
    ly: number;
    lyVar: number;
  };
  isTotal?: boolean;
}

interface HouseholdBrandsDetailsTableProps {
  data: HouseholdBrandDetailsData[];
  isLoading?: boolean;
}

export default function HouseholdBrandsDetailsTable({ data, isLoading }: HouseholdBrandsDetailsTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading household brands details data...</span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No household brands details data available
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num === 0) return '0';
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  const formatCurrency = (num: number) => {
    if (num === 0) return '0';
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  const formatVariance = (num: number, isPercentage = false) => {
    if (num === 0) return '0';
    const absNum = Math.abs(num);
    const formatted = isPercentage 
      ? new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1
        }).format(absNum) + '%'
      : new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(absNum);
    
    return num < 0 ? `(${formatted})` : formatted;
  };

  const getVarianceColor = (num: number) => {
    if (num < 0) return 'text-red-600';
    if (num > 0) return 'text-green-600';
    return 'text-gray-900';
  };

  const formatPercentage = (num: number) => {
    if (num === 0) return '0.0%';
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(num) + '%';
  };

  // Group data by brand for better organization
  const groupedData = data.reduce((acc, item) => {
    if (!acc[item.brand]) {
      acc[item.brand] = [];
    }
    acc[item.brand].push(item);
    return acc;
  }, {} as Record<string, HouseholdBrandDetailsData[]>);

  return (
    <div className="overflow-x-auto min-w-full">
      <table className="min-w-full bg-white border border-gray-200" style={{ minWidth: '1400px' }}>
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-300">CATEGORY/SUB-CATEGORY</th>
            
            {/* Cases */}
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-300" colSpan={4}>CASES</th>
            
            {/* gSales */}
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-300" colSpan={4}>GSALES (£'000)</th>
            
            {/* fGP */}
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-300" colSpan={4}>FGP (£'000)</th>
            
            {/* fGP % */}
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={3}>FGP %</th>
          </tr>
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-300">
              {/* Category/Sub-category column */}
            </th>
            
            {/* Cases sub-headers */}
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">YTD NO.</th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">LY NO.</th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">LY VAR NO.</th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-300">Y VAR %</th>
            
            {/* gSales sub-headers */}
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">YTD £'000</th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">LY £'000</th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">LY VAR £'000</th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-300">Y VAR %</th>
            
            {/* fGP sub-headers */}
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">YTD £'000</th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">LY £'000</th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">LY VAR £'000</th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-300">Y VAR %</th>
            
            {/* fGP % sub-headers */}
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">YTD %</th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">LY %</th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">LY VAR %</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Object.entries(groupedData).map(([brandName, brandItems]) => (
            <React.Fragment key={brandName}>
              {/* Brand Header */}
              <tr className="bg-blue-50">
                <td className="px-4 py-3 text-sm font-bold text-blue-900 border-r-2 border-gray-300" colSpan={15}>
                  {brandName}
                </td>
              </tr>
              
              {/* Brand Items */}
              {brandItems.map((item, index) => (
                <tr 
                  key={`${brandName}-${index}`} 
                  className={`hover:bg-gray-50 ${
                    item.isTotal 
                      ? 'bg-gray-100 font-semibold'
                      : ''
                  }`}
                >
                  <td className={`px-4 py-2 text-sm border-r-2 border-gray-300 ${
                    item.isTotal 
                      ? 'text-gray-800 font-semibold'
                      : 'text-gray-900'
                  }`}>
                    {item.name}
                  </td>
                  
                  {/* Cases */}
                  <td className="px-4 py-2 text-sm text-right">
                    {formatNumber(item.cases.ytd)}
                  </td>
                  <td className="px-4 py-2 text-sm text-right">
                    {formatNumber(item.cases.ly)}
                  </td>
                  <td className={`px-4 py-2 text-sm text-right ${getVarianceColor(item.cases.lyVar)}`}>
                    {formatVariance(item.cases.lyVar)}
                  </td>
                  <td className={`px-4 py-2 text-sm text-right border-r-2 border-gray-300 ${getVarianceColor(item.cases.lyVarPercent)}`}>
                    {formatVariance(item.cases.lyVarPercent, true)}
                  </td>
                  
                  {/* gSales */}
                  <td className="px-4 py-2 text-sm text-right">
                    {formatCurrency(item.gSales.ytd)}
                  </td>
                  <td className="px-4 py-2 text-sm text-right">
                    {formatCurrency(item.gSales.ly)}
                  </td>
                  <td className={`px-4 py-2 text-sm text-right ${getVarianceColor(item.gSales.lyVar)}`}>
                    {formatVariance(item.gSales.lyVar)}
                  </td>
                  <td className={`px-4 py-2 text-sm text-right border-r-2 border-gray-300 ${getVarianceColor(item.gSales.lyVarPercent)}`}>
                    {formatVariance(item.gSales.lyVarPercent, true)}
                  </td>
                  
                  {/* fGP */}
                  <td className="px-4 py-2 text-sm text-right">
                    {formatCurrency(item.fGP.ytd)}
                  </td>
                  <td className="px-4 py-2 text-sm text-right">
                    {formatCurrency(item.fGP.ly)}
                  </td>
                  <td className={`px-4 py-2 text-sm text-right ${getVarianceColor(item.fGP.lyVar)}`}>
                    {formatVariance(item.fGP.lyVar)}
                  </td>
                  <td className={`px-4 py-2 text-sm text-right border-r-2 border-gray-300 ${getVarianceColor(item.fGP.lyVarPercent)}`}>
                    {formatVariance(item.fGP.lyVarPercent, true)}
                  </td>
                  
                  {/* fGP % */}
                  <td className="px-4 py-2 text-sm text-right">
                    {formatPercentage(item.fGPPercent.ytd)}
                  </td>
                  <td className="px-4 py-2 text-sm text-right">
                    {formatPercentage(item.fGPPercent.ly)}
                  </td>
                  <td className={`px-4 py-2 text-sm text-right ${getVarianceColor(item.fGPPercent.lyVar)}`}>
                    {formatVariance(item.fGPPercent.lyVar, true)}
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
