'use client';

import React from 'react';

interface HouseholdBrandData {
  name: string;
  cases: {
    ytd: number;
    lyVar: number;
    lyVarPercent: number;
  };
  gSales: {
    ytd: number;
    lyVar: number;
    lyVarPercent: number;
  };
  fGP: {
    ytd: number;
    lyVar: number;
    lyVarPercent: number;
  };
  fGPPercent: {
    ytd: number;
    lyVar: number;
  };
  fGPFY24: {
    ytd: number;
    cyVLy: number;
  };
  isTotal?: boolean;
}

interface HouseholdBrandsTableProps {
  data: HouseholdBrandData[];
  isLoading?: boolean;
}

export default function HouseholdBrandsTable({ data, isLoading }: HouseholdBrandsTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading household brands data...</span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No household brands data available
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

  return (
    <div className="overflow-x-auto min-w-full">
      <table className="min-w-full bg-white border border-gray-200" style={{ minWidth: '1200px' }}>
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-300">BRAND</th>
            
            {/* Cases */}
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-300" colSpan={3}>CASES</th>
            
            {/* gSales */}
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-300" colSpan={3}>GSALES</th>
            
            {/* fGP */}
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-300" colSpan={3}>FGP</th>
            
            {/* fGP % */}
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-300" colSpan={2}>FGP %</th>
            
            {/* fGP FY24 */}
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>FGP FY24</th>
          </tr>
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-300">
              {/* Brand column */}
            </th>
            
            {/* Cases sub-headers */}
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">YTD NO.</th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">LY VAR NO.</th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-300">LY VAR %</th>
            
            {/* gSales sub-headers */}
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">YTD €'000</th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">LY VAR €'000</th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-300">LY VAR %</th>
            
            {/* fGP sub-headers */}
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">YTD €'000</th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">LY VAR €'000</th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-300">LY VAR %</th>
            
            {/* fGP % sub-headers */}
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">YTD %</th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-300">LY VAR %</th>
            
            {/* fGP FY24 sub-headers */}
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">YTD €'000</th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">CY V LY %</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((brand, index) => (
            <tr 
              key={index} 
              className={`hover:bg-gray-50 ${
                brand.isTotal 
                  ? brand.name === 'Overall Total' 
                    ? 'bg-blue-100 font-bold' 
                    : 'bg-gray-100 font-semibold'
                  : ''
              }`}
            >
              <td className={`px-4 py-2 text-sm border-r-2 border-gray-300 ${
                brand.isTotal 
                  ? brand.name === 'Overall Total' 
                    ? 'text-blue-900 font-bold' 
                    : 'text-gray-800 font-semibold'
                  : 'text-gray-900'
              }`}>
                {brand.name}
              </td>
              
              {/* Cases */}
              <td className="px-4 py-2 text-sm text-right">
                {formatNumber(brand.cases.ytd)}
              </td>
              <td className={`px-4 py-2 text-sm text-right ${getVarianceColor(brand.cases.lyVar)}`}>
                {formatVariance(brand.cases.lyVar)}
              </td>
              <td className={`px-4 py-2 text-sm text-right border-r-2 border-gray-300 ${getVarianceColor(brand.cases.lyVarPercent)}`}>
                {formatVariance(brand.cases.lyVarPercent, true)}
              </td>
              
              {/* gSales */}
              <td className="px-4 py-2 text-sm text-right">
                {formatCurrency(brand.gSales.ytd)}
              </td>
              <td className={`px-4 py-2 text-sm text-right ${getVarianceColor(brand.gSales.lyVar)}`}>
                {formatVariance(brand.gSales.lyVar)}
              </td>
              <td className={`px-4 py-2 text-sm text-right border-r-2 border-gray-300 ${getVarianceColor(brand.gSales.lyVarPercent)}`}>
                {formatVariance(brand.gSales.lyVarPercent, true)}
              </td>
              
              {/* fGP */}
              <td className="px-4 py-2 text-sm text-right">
                {formatCurrency(brand.fGP.ytd)}
              </td>
              <td className={`px-4 py-2 text-sm text-right ${getVarianceColor(brand.fGP.lyVar)}`}>
                {formatVariance(brand.fGP.lyVar)}
              </td>
              <td className={`px-4 py-2 text-sm text-right border-r-2 border-gray-300 ${getVarianceColor(brand.fGP.lyVarPercent)}`}>
                {formatVariance(brand.fGP.lyVarPercent, true)}
              </td>
              
              {/* fGP % */}
              <td className="px-4 py-2 text-sm text-right">
                {formatPercentage(brand.fGPPercent.ytd)}
              </td>
              <td className={`px-4 py-2 text-sm text-right border-r-2 border-gray-300 ${getVarianceColor(brand.fGPPercent.lyVar)}`}>
                {formatVariance(brand.fGPPercent.lyVar, true)}
              </td>
              
              {/* fGP FY24 */}
              <td className="px-4 py-2 text-sm text-right">
                {formatCurrency(brand.fGPFY24.ytd)}
              </td>
              <td className={`px-4 py-2 text-sm text-right ${getVarianceColor(brand.fGPFY24.cyVLy - 100)}`}>
                {formatPercentage(brand.fGPFY24.cyVLy)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}












