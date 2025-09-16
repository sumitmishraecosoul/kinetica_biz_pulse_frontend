'use client';

import React from 'react';

interface FoodBrandData {
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
}

interface FoodBrandsTableProps {
  data: FoodBrandData[];
  isLoading?: boolean;
}

export default function FoodBrandsTable({ data, isLoading }: FoodBrandsTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading food brands data...</span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No food brands data available
      </div>
    );
  }

  const formatNumber = (num: number | undefined | null): string => {
    if (num === undefined || num === null || isNaN(num)) return '0';
    return new Intl.NumberFormat('en-US').format(Math.round(num));
  };

  const formatVariance = (num: number | undefined | null, isPercent = false): string => {
    if (num === undefined || num === null || isNaN(num)) {
      return isPercent ? '0.0%' : '0';
    }
    
    if (isPercent) {
      return num >= 0 ? `${num.toFixed(1)}%` : `-${Math.abs(num).toFixed(1)}%`;
    } else {
      const absNum = Math.abs(num);
      const formattedNum = new Intl.NumberFormat('en-US').format(Math.round(absNum));
      return num >= 0 ? formattedNum : `(${formattedNum})`;
    }
  };

  const getVarianceColor = (num: number | undefined | null): string => {
    if (num === undefined || num === null || isNaN(num)) return 'text-gray-900';
    return num < 0 ? 'text-red-600' : num > 0 ? 'text-green-600' : 'text-gray-900';
  };

  // Group data by brand category
  const bvBrands = data.filter(item => 
    ['McDonnells', 'BV Honey', 'Don Carlos', 'Chivers', 'Homecook', 'Erin', 'Lakeshore', 'Panda', 'Lifeforce', 'GDF', 'Richmond', 'Cali Cali'].includes(item.name)
  );
  
  const agcBrands = data.filter(item => 
    ['Koka', 'Bonne Maman', 'Bensons'].includes(item.name)
  );
  
  const plBrands = data.filter(item => 
    ['Tesco', 'Dunnes'].includes(item.name)
  );

  // Calculate totals for each category
  const calculateTotals = (brands: FoodBrandData[]) => {
    return brands.reduce((totals, brand) => ({
      cases: {
        ytd: totals.cases.ytd + (brand.cases?.ytd || 0),
        lyVar: totals.cases.lyVar + (brand.cases?.lyVar || 0),
        lyVarPercent: 0 // Will be calculated
      },
      gSales: {
        ytd: totals.gSales.ytd + (brand.gSales?.ytd || 0),
        lyVar: totals.gSales.lyVar + (brand.gSales?.lyVar || 0),
        lyVarPercent: 0 // Will be calculated
      },
      fGP: {
        ytd: totals.fGP.ytd + (brand.fGP?.ytd || 0),
        lyVar: totals.fGP.lyVar + (brand.fGP?.lyVar || 0),
        lyVarPercent: 0 // Will be calculated
      },
      fGPPercent: {
        ytd: totals.fGP.ytd > 0 ? (totals.fGP.ytd / totals.gSales.ytd) * 100 : 0,
        lyVar: 0 // Will be calculated
      },
      fGPFY24: {
        ytd: totals.fGPFY24.ytd + (brand.fGPFY24?.ytd || 0),
        cyVLy: 0 // Will be calculated
      }
    }), {
      cases: { ytd: 0, lyVar: 0, lyVarPercent: 0 },
      gSales: { ytd: 0, lyVar: 0, lyVarPercent: 0 },
      fGP: { ytd: 0, lyVar: 0, lyVarPercent: 0 },
      fGPPercent: { ytd: 0, lyVar: 0 },
      fGPFY24: { ytd: 0, cyVLy: 0 }
    });
  };

  const bvTotals = calculateTotals(bvBrands);
  const agcTotals = calculateTotals(agcBrands);
  const plTotals = calculateTotals(plBrands);
  const overallTotals = calculateTotals(data);

  // Calculate percentages for totals
  const calculatePercentages = (totals: any) => {
    const casesLyVarPercent = totals.cases.ytd > 0 ? (totals.cases.lyVar / (totals.cases.ytd - totals.cases.lyVar)) * 100 : 0;
    const gSalesLyVarPercent = totals.gSales.ytd > 0 ? (totals.gSales.lyVar / (totals.gSales.ytd - totals.gSales.lyVar)) * 100 : 0;
    const fGPLyVarPercent = totals.fGP.ytd > 0 ? (totals.fGP.lyVar / (totals.fGP.ytd - totals.fGP.lyVar)) * 100 : 0;
    const fGPPercentLyVar = totals.fGPPercent.ytd > 0 ? ((totals.fGP.ytd / totals.gSales.ytd) - ((totals.fGP.ytd - totals.fGP.lyVar) / (totals.gSales.ytd - totals.gSales.lyVar))) * 100 : 0;
    const fGPFY24CyVLy = totals.fGPFY24.ytd > 0 ? (totals.fGP.ytd / totals.fGPFY24.ytd) * 100 : 0;

    return {
      ...totals,
      cases: { ...totals.cases, lyVarPercent: casesLyVarPercent },
      gSales: { ...totals.gSales, lyVarPercent: gSalesLyVarPercent },
      fGP: { ...totals.fGP, lyVarPercent: fGPLyVarPercent },
      fGPPercent: { ...totals.fGPPercent, lyVar: fGPPercentLyVar },
      fGPFY24: { ...totals.fGPFY24, cyVLy: fGPFY24CyVLy }
    };
  };

  const bvTotalsWithPercentages = calculatePercentages(bvTotals);
  const agcTotalsWithPercentages = calculatePercentages(agcTotals);
  const plTotalsWithPercentages = calculatePercentages(plTotals);
  const overallTotalsWithPercentages = calculatePercentages(overallTotals);

  const renderBrandRow = (brand: FoodBrandData) => (
    <tr key={brand.name} className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-4 py-2 text-sm font-medium text-gray-900 border-r-2 border-gray-300">{brand.name}</td>
      
      {/* Cases */}
      <td className="px-4 py-2 text-sm text-gray-900 text-right">{formatNumber(brand.cases?.ytd)}</td>
      <td className={`px-4 py-2 text-sm text-right ${getVarianceColor(brand.cases?.lyVar)}`}>
        {formatVariance(brand.cases?.lyVar)}
      </td>
      <td className={`px-4 py-2 text-sm text-right border-r-2 border-gray-300 ${getVarianceColor(brand.cases?.lyVarPercent)}`}>
        {formatVariance(brand.cases?.lyVarPercent, true)}
      </td>
      
      {/* gSales */}
      <td className="px-4 py-2 text-sm text-gray-900 text-right">{formatNumber(brand.gSales?.ytd)}</td>
      <td className={`px-4 py-2 text-sm text-right ${getVarianceColor(brand.gSales?.lyVar)}`}>
        {formatVariance(brand.gSales?.lyVar)}
      </td>
      <td className={`px-4 py-2 text-sm text-right border-r-2 border-gray-300 ${getVarianceColor(brand.gSales?.lyVarPercent)}`}>
        {formatVariance(brand.gSales?.lyVarPercent, true)}
      </td>
      
      {/* fGP */}
      <td className="px-4 py-2 text-sm text-gray-900 text-right">{formatNumber(brand.fGP?.ytd)}</td>
      <td className={`px-4 py-2 text-sm text-right ${getVarianceColor(brand.fGP?.lyVar)}`}>
        {formatVariance(brand.fGP?.lyVar)}
      </td>
      <td className={`px-4 py-2 text-sm text-right border-r-2 border-gray-300 ${getVarianceColor(brand.fGP?.lyVarPercent)}`}>
        {formatVariance(brand.fGP?.lyVarPercent, true)}
      </td>
      
      {/* fGP % */}
      <td className="px-4 py-2 text-sm text-gray-900 text-right">{(brand.fGPPercent?.ytd || 0).toFixed(1)}%</td>
      <td className={`px-4 py-2 text-sm text-right border-r-2 border-gray-300 ${getVarianceColor(brand.fGPPercent?.lyVar)}`}>
        {formatVariance(brand.fGPPercent?.lyVar, true)}
      </td>
      
      {/* fGP FY24 */}
      <td className="px-4 py-2 text-sm text-gray-900 text-right">{formatNumber(brand.fGPFY24?.ytd)}</td>
      <td className={`px-4 py-2 text-sm text-right ${getVarianceColor(brand.fGPFY24?.cyVLy)}`}>
        {formatVariance(brand.fGPFY24?.cyVLy, true)}
      </td>
    </tr>
  );

  const renderTotalRow = (totals: any, label: string, isOverall = false) => (
    <tr key={label} className={`border-t-2 ${isOverall ? 'border-gray-400 bg-gray-100' : 'border-gray-300 bg-gray-50'}`}>
      <td className={`px-4 py-2 text-sm font-bold border-r-2 border-gray-300 ${isOverall ? 'text-gray-900' : 'text-gray-800'}`}>
        {label}
      </td>
      
      {/* Cases */}
      <td className={`px-4 py-2 text-sm text-right font-bold ${isOverall ? 'text-gray-900' : 'text-gray-800'}`}>
        {formatNumber(totals.cases?.ytd)}
      </td>
      <td className={`px-4 py-2 text-sm text-right font-bold ${getVarianceColor(totals.cases?.lyVar)}`}>
        {formatVariance(totals.cases?.lyVar)}
      </td>
      <td className={`px-4 py-2 text-sm text-right font-bold border-r-2 border-gray-300 ${getVarianceColor(totals.cases?.lyVarPercent)}`}>
        {formatVariance(totals.cases?.lyVarPercent, true)}
      </td>
      
      {/* gSales */}
      <td className={`px-4 py-2 text-sm text-right font-bold ${isOverall ? 'text-gray-900' : 'text-gray-800'}`}>
        {formatNumber(totals.gSales?.ytd)}
      </td>
      <td className={`px-4 py-2 text-sm text-right font-bold ${getVarianceColor(totals.gSales?.lyVar)}`}>
        {formatVariance(totals.gSales?.lyVar)}
      </td>
      <td className={`px-4 py-2 text-sm text-right font-bold border-r-2 border-gray-300 ${getVarianceColor(totals.gSales?.lyVarPercent)}`}>
        {formatVariance(totals.gSales?.lyVarPercent, true)}
      </td>
      
      {/* fGP */}
      <td className={`px-4 py-2 text-sm text-right font-bold ${isOverall ? 'text-gray-900' : 'text-gray-800'}`}>
        {formatNumber(totals.fGP?.ytd)}
      </td>
      <td className={`px-4 py-2 text-sm text-right font-bold ${getVarianceColor(totals.fGP?.lyVar)}`}>
        {formatVariance(totals.fGP?.lyVar)}
      </td>
      <td className={`px-4 py-2 text-sm text-right font-bold border-r-2 border-gray-300 ${getVarianceColor(totals.fGP?.lyVarPercent)}`}>
        {formatVariance(totals.fGP?.lyVarPercent, true)}
      </td>
      
      {/* fGP % */}
      <td className={`px-4 py-2 text-sm text-right font-bold ${isOverall ? 'text-gray-900' : 'text-gray-800'}`}>
        {(totals.fGPPercent?.ytd || 0).toFixed(1)}%
      </td>
      <td className={`px-4 py-2 text-sm text-right font-bold border-r-2 border-gray-300 ${getVarianceColor(totals.fGPPercent?.lyVar)}`}>
        {formatVariance(totals.fGPPercent?.lyVar, true)}
      </td>
      
      {/* fGP FY24 */}
      <td className={`px-4 py-2 text-sm text-right font-bold ${isOverall ? 'text-gray-900' : 'text-gray-800'}`}>
        {formatNumber(totals.fGPFY24?.ytd)}
      </td>
      <td className={`px-4 py-2 text-sm text-right font-bold ${getVarianceColor(totals.fGPFY24?.cyVLy)}`}>
        {formatVariance(totals.fGPFY24?.cyVLy, true)}
      </td>
    </tr>
  );

  return (
    <div className="overflow-x-auto min-w-full">
      <table className="min-w-full bg-white border border-gray-200" style={{ minWidth: '1200px' }}>
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-300">BRAND</th>
            
            {/* Cases */}
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-300" colSpan={3}>
              CASES
            </th>
            
            {/* gSales */}
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-300" colSpan={3}>
              GSALES
            </th>
            
            {/* fGP */}
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-300" colSpan={3}>
              FGP
            </th>
            
            {/* fGP % */}
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-300" colSpan={2}>
              FGP %
            </th>
            
            {/* fGP FY24 */}
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>
              FGP FY24
            </th>
          </tr>
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-300"></th>
            
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
          {/* BV Brands - Food */}
          <tr className="bg-blue-50">
            <td colSpan={14} className="px-4 py-2 text-sm font-bold text-blue-800 border-r-2 border-gray-300">BV Brands - Food</td>
          </tr>
          {bvBrands.map(renderBrandRow)}
          {renderTotalRow(bvTotalsWithPercentages, 'Total (BV Brands - Food)')}
          
          {/* AGC Brands - Food */}
          <tr className="bg-green-50">
            <td colSpan={14} className="px-4 py-2 text-sm font-bold text-green-800 border-r-2 border-gray-300">AGC Brands - Food</td>
          </tr>
          {agcBrands.map(renderBrandRow)}
          {renderTotalRow(agcTotalsWithPercentages, 'Total (AGC Brands - Food)')}
          
          {/* PL Brands - Food */}
          <tr className="bg-yellow-50">
            <td colSpan={14} className="px-4 py-2 text-sm font-bold text-yellow-800 border-r-2 border-gray-300">PL Brands - Food</td>
          </tr>
          {plBrands.map(renderBrandRow)}
          {renderTotalRow(plTotalsWithPercentages, 'Total (PL Brands - Food)')}
          
          {/* Overall Total */}
          {renderTotalRow(overallTotalsWithPercentages, 'Overall Total', true)}
        </tbody>
      </table>
    </div>
  );
}