'use client';

import React from 'react';

interface FoodBrandsDetailsData {
  brand: string;
  subCategory: string;
  product: string;
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
}

interface FoodBrandsDetailsTableProps {
  data: FoodBrandsDetailsData[];
  isLoading?: boolean;
  currentYear?: number;
}

export default function FoodBrandsDetailsTable({ 
  data, 
  isLoading = false, 
  currentYear = 2025 
}: FoodBrandsDetailsTableProps) {
  
  console.log('🔍 FoodBrandsDetailsTable received data:', data);
  console.log('🔍 FoodBrandsDetailsTable data length:', data?.length);
  console.log('🔍 FoodBrandsDetailsTable isLoading:', isLoading);

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading food brands details data...</span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No food brands details data available
      </div>
    );
  }

  // Group data by brand and sub-category
  const groupedData = data.reduce((acc, item) => {
    if (!acc[item.brand]) {
      acc[item.brand] = {};
    }
    if (!acc[item.brand][item.subCategory]) {
      acc[item.brand][item.subCategory] = [];
    }
    acc[item.brand][item.subCategory].push(item);
    return acc;
  }, {} as Record<string, Record<string, FoodBrandsDetailsData[]>>);

  // Calculate totals for a group of items
  const calculateTotals = (items: FoodBrandsDetailsData[]) => {
    return items.reduce((totals, item) => ({
      cases: {
        ytd: totals.cases.ytd + item.cases.ytd,
        lyVar: totals.cases.lyVar + item.cases.lyVar,
        lyVarPercent: totals.cases.lyVarPercent + item.cases.lyVarPercent
      },
      gSales: {
        ytd: totals.gSales.ytd + item.gSales.ytd,
        lyVar: totals.gSales.lyVar + item.gSales.lyVar,
        lyVarPercent: totals.gSales.lyVarPercent + item.gSales.lyVarPercent
      },
      fGP: {
        ytd: totals.fGP.ytd + item.fGP.ytd,
        lyVar: totals.fGP.lyVar + item.fGP.lyVar,
        lyVarPercent: totals.fGP.lyVarPercent + item.fGP.lyVarPercent
      },
      fGPPercent: {
        ytd: totals.fGPPercent.ytd + item.fGPPercent.ytd,
        lyVar: totals.fGPPercent.lyVar + item.fGPPercent.lyVar
      }
    }), {
      cases: { ytd: 0, lyVar: 0, lyVarPercent: 0 },
      gSales: { ytd: 0, lyVar: 0, lyVarPercent: 0 },
      fGP: { ytd: 0, lyVar: 0, lyVarPercent: 0 },
      fGPPercent: { ytd: 0, lyVar: 0 }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto min-w-full">
        <table className="min-w-full divide-y divide-gray-200" style={{ minWidth: '1200px' }}>
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-300">
                BRAND / SUB-CATEGORY
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-300" colSpan={3}>
                CASES
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-300" colSpan={3}>
                GSALES
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-300" colSpan={3}>
                FGP
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>
                FGP %
              </th>
            </tr>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-300">
                {/* Brand/Sub-category column */}
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                YTD NO.
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                LY VAR NO.
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-300">
                LY VAR %
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                YTD €'000
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                LY VAR €'000
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-300">
                LY VAR %
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                YTD €'000
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                LY VAR €'000
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-300">
                LY VAR %
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                YTD %
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                LY VAR %
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(groupedData).map(([brand, subCategories]) => (
              <React.Fragment key={brand}>
                {/* Brand Header */}
                <tr className="bg-blue-50">
                  <td colSpan={12} className="px-4 py-2 text-sm font-bold text-blue-800 border-r-2 border-gray-300">
                    {brand}
                  </td>
                </tr>
                
                {Object.entries(subCategories).map(([subCategory, items]) => (
                  <React.Fragment key={`${brand}-${subCategory}`}>
                    {/* Sub-category Header */}
                    <tr className="bg-gray-100">
                      <td colSpan={12} className="px-4 py-2 text-sm font-semibold text-gray-700 border-r-2 border-gray-300">
                        {subCategory}
                      </td>
                    </tr>
                    
                    {/* Product rows */}
                    {items.map((item, index) => (
                      <tr key={`${brand}-${subCategory}-${index}`} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm text-gray-900 border-r-2 border-gray-300 pl-8">
                          {item.product}
                        </td>
                        <td className="px-4 py-2 text-sm text-right">
                          {formatNumber(item.cases.ytd)}
                        </td>
                        <td className={`px-4 py-2 text-sm text-right ${getVarianceColor(item.cases.lyVar)}`}>
                          {formatVariance(item.cases.lyVar)}
                        </td>
                        <td className={`px-4 py-2 text-sm text-right border-r-2 border-gray-300 ${getVarianceColor(item.cases.lyVarPercent)}`}>
                          {formatVariance(item.cases.lyVarPercent, true)}
                        </td>
                        <td className="px-4 py-2 text-sm text-right">
                          {formatCurrency(item.gSales.ytd)}
                        </td>
                        <td className={`px-4 py-2 text-sm text-right ${getVarianceColor(item.gSales.lyVar)}`}>
                          {formatVariance(item.gSales.lyVar)}
                        </td>
                        <td className={`px-4 py-2 text-sm text-right border-r-2 border-gray-300 ${getVarianceColor(item.gSales.lyVarPercent)}`}>
                          {formatVariance(item.gSales.lyVarPercent, true)}
                        </td>
                        <td className="px-4 py-2 text-sm text-right">
                          {formatCurrency(item.fGP.ytd)}
                        </td>
                        <td className={`px-4 py-2 text-sm text-right ${getVarianceColor(item.fGP.lyVar)}`}>
                          {formatVariance(item.fGP.lyVar)}
                        </td>
                        <td className={`px-4 py-2 text-sm text-right border-r-2 border-gray-300 ${getVarianceColor(item.fGP.lyVarPercent)}`}>
                          {formatVariance(item.fGP.lyVarPercent, true)}
                        </td>
                        <td className="px-4 py-2 text-sm text-right">
                          {formatPercentage(item.fGPPercent.ytd)}
                        </td>
                        <td className={`px-4 py-2 text-sm text-right ${getVarianceColor(item.fGPPercent.lyVar)}`}>
                          {formatVariance(item.fGPPercent.lyVar, true)}
                        </td>
                      </tr>
                    ))}
                    
                    {/* Sub-category Total */}
                    {(() => {
                      const subCategoryTotal = calculateTotals(items);
                      return (
                        <tr className="bg-gray-50 font-semibold">
                          <td className="px-4 py-2 text-sm font-bold text-gray-800 border-r-2 border-gray-300 pl-6">
                            {subCategory} Total
                          </td>
                          <td className="px-4 py-2 text-sm text-right font-bold">
                            {formatNumber(subCategoryTotal.cases.ytd)}
                          </td>
                          <td className={`px-4 py-2 text-sm text-right font-bold ${getVarianceColor(subCategoryTotal.cases.lyVar)}`}>
                            {formatVariance(subCategoryTotal.cases.lyVar)}
                          </td>
                          <td className={`px-4 py-2 text-sm text-right font-bold border-r-2 border-gray-300 ${getVarianceColor(subCategoryTotal.cases.lyVarPercent)}`}>
                            {formatVariance(subCategoryTotal.cases.lyVarPercent, true)}
                          </td>
                          <td className="px-4 py-2 text-sm text-right font-bold">
                            {formatCurrency(subCategoryTotal.gSales.ytd)}
                          </td>
                          <td className={`px-4 py-2 text-sm text-right font-bold ${getVarianceColor(subCategoryTotal.gSales.lyVar)}`}>
                            {formatVariance(subCategoryTotal.gSales.lyVar)}
                          </td>
                          <td className={`px-4 py-2 text-sm text-right font-bold border-r-2 border-gray-300 ${getVarianceColor(subCategoryTotal.gSales.lyVarPercent)}`}>
                            {formatVariance(subCategoryTotal.gSales.lyVarPercent, true)}
                          </td>
                          <td className="px-4 py-2 text-sm text-right font-bold">
                            {formatCurrency(subCategoryTotal.fGP.ytd)}
                          </td>
                          <td className={`px-4 py-2 text-sm text-right font-bold ${getVarianceColor(subCategoryTotal.fGP.lyVar)}`}>
                            {formatVariance(subCategoryTotal.fGP.lyVar)}
                          </td>
                          <td className={`px-4 py-2 text-sm text-right font-bold border-r-2 border-gray-300 ${getVarianceColor(subCategoryTotal.fGP.lyVarPercent)}`}>
                            {formatVariance(subCategoryTotal.fGP.lyVarPercent, true)}
                          </td>
                          <td className="px-4 py-2 text-sm text-right font-bold">
                            {formatPercentage(subCategoryTotal.fGPPercent.ytd)}
                          </td>
                          <td className={`px-4 py-2 text-sm text-right font-bold ${getVarianceColor(subCategoryTotal.fGPPercent.lyVar)}`}>
                            {formatVariance(subCategoryTotal.fGPPercent.lyVar, true)}
                          </td>
                        </tr>
                      );
                    })()}
                  </React.Fragment>
                ))}
                
                {/* Brand Total */}
                {(() => {
                  const allBrandItems = Object.values(subCategories).flat();
                  const brandTotal = calculateTotals(allBrandItems);
                  return (
                    <tr className="bg-blue-100 font-bold">
                      <td className="px-4 py-2 text-sm font-bold text-blue-900 border-r-2 border-gray-300">
                        {brand} Total
                      </td>
                      <td className="px-4 py-2 text-sm text-right font-bold">
                        {formatNumber(brandTotal.cases.ytd)}
                      </td>
                      <td className={`px-4 py-2 text-sm text-right font-bold ${getVarianceColor(brandTotal.cases.lyVar)}`}>
                        {formatVariance(brandTotal.cases.lyVar)}
                      </td>
                      <td className={`px-4 py-2 text-sm text-right font-bold border-r-2 border-gray-300 ${getVarianceColor(brandTotal.cases.lyVarPercent)}`}>
                        {formatVariance(brandTotal.cases.lyVarPercent, true)}
                      </td>
                      <td className="px-4 py-2 text-sm text-right font-bold">
                        {formatCurrency(brandTotal.gSales.ytd)}
                      </td>
                      <td className={`px-4 py-2 text-sm text-right font-bold ${getVarianceColor(brandTotal.gSales.lyVar)}`}>
                        {formatVariance(brandTotal.gSales.lyVar)}
                      </td>
                      <td className={`px-4 py-2 text-sm text-right font-bold border-r-2 border-gray-300 ${getVarianceColor(brandTotal.gSales.lyVarPercent)}`}>
                        {formatVariance(brandTotal.gSales.lyVarPercent, true)}
                      </td>
                      <td className="px-4 py-2 text-sm text-right font-bold">
                        {formatCurrency(brandTotal.fGP.ytd)}
                      </td>
                      <td className={`px-4 py-2 text-sm text-right font-bold ${getVarianceColor(brandTotal.fGP.lyVar)}`}>
                        {formatVariance(brandTotal.fGP.lyVar)}
                      </td>
                      <td className={`px-4 py-2 text-sm text-right font-bold border-r-2 border-gray-300 ${getVarianceColor(brandTotal.fGP.lyVarPercent)}`}>
                        {formatVariance(brandTotal.fGP.lyVarPercent, true)}
                      </td>
                      <td className="px-4 py-2 text-sm text-right font-bold">
                        {formatPercentage(brandTotal.fGPPercent.ytd)}
                      </td>
                      <td className={`px-4 py-2 text-sm text-right font-bold ${getVarianceColor(brandTotal.fGPPercent.lyVar)}`}>
                        {formatVariance(brandTotal.fGPPercent.lyVar, true)}
                      </td>
                    </tr>
                  );
                })()}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}