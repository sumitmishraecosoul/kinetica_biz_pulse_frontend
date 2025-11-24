'use client';

import React from 'react';

interface MetricData {
  ytd: number;
  ly: number;
  lyVar: number;
  lyVarPercent: number;
}

interface FGPPercentData {
  ytd: number;
  ly: number;
  lyVar: number;
}

interface WSUKNIChannelRowData {
  name: string;
  isTotal: boolean;
  isSubTotal?: boolean;
  cases?: MetricData;
  gSales?: MetricData;
  fGP?: MetricData;
  fGPPercent?: FGPPercentData;
}

interface WSUKNIChannelTableProps {
  data: WSUKNIChannelRowData[];
  isLoading: boolean;
}

const formatNumber = (num: number | undefined, isCurrency = false, isPercent = false): string => {
  if (num === undefined || num === null || isNaN(num)) return '-';
  
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: isPercent ? 1 : 0,
    maximumFractionDigits: isPercent ? 1 : 0,
  }).format(num);
  return isCurrency ? `€${formatted}` : isPercent ? `${formatted}%` : formatted;
};

const renderRow = (row: WSUKNIChannelRowData) => {
  const isTotalRow = row.isTotal;
  const isSubTotalRow = row.isSubTotal;

  const getVarianceClass = (value: number | undefined) => {
    if (value === undefined || value === null || value === 0) return '';
    return value < 0 ? 'text-red-600' : 'text-green-600';
  };

  const getRowClass = () => {
    if (isTotalRow) return 'bg-gray-200 font-bold border-t-2 border-gray-400';
    if (isSubTotalRow) return 'bg-gray-100 font-semibold border-t border-gray-300';
    return 'bg-white hover:bg-gray-50';
  };

  return (
    <tr key={row.name} className={`${getRowClass()} border-b border-gray-200`}>
      <td className="py-3 px-4 text-sm text-gray-800 whitespace-nowrap">
        {row.name}
      </td>
      {/* Cases */}
      <td className="py-3 px-4 text-sm text-gray-800 text-right whitespace-nowrap">
        {formatNumber(row.cases?.ytd)}
      </td>
      <td className="py-3 px-4 text-sm text-gray-800 text-right whitespace-nowrap">
        {formatNumber(row.cases?.ly)}
      </td>
      <td className="py-3 px-4 text-sm text-gray-800 text-right whitespace-nowrap">
        <span className={getVarianceClass(row.cases?.lyVar)}>
          {row.cases?.lyVar !== undefined && row.cases.lyVar < 0 ? 
            `(${Math.abs(row.cases.lyVar).toLocaleString()})` : 
            formatNumber(row.cases?.lyVar)
          }
        </span>
      </td>
      <td className="py-3 px-4 text-sm text-gray-800 text-right whitespace-nowrap">
        <span className={getVarianceClass(row.cases?.lyVarPercent)}>
          {formatNumber(row.cases?.lyVarPercent, false, true)}
        </span>
      </td>
      {/* gSales */}
      <td className="py-3 px-4 text-sm text-gray-800 text-right whitespace-nowrap">
        {formatNumber(row.gSales?.ytd, true)}
      </td>
      <td className="py-3 px-4 text-sm text-gray-800 text-right whitespace-nowrap">
        {formatNumber(row.gSales?.ly, true)}
      </td>
      <td className="py-3 px-4 text-sm text-gray-800 text-right whitespace-nowrap">
        <span className={getVarianceClass(row.gSales?.lyVar)}>
          {row.gSales?.lyVar !== undefined && row.gSales.lyVar < 0 ? 
            `(${Math.abs(row.gSales.lyVar).toLocaleString()})` : 
            formatNumber(row.gSales?.lyVar, true)
          }
        </span>
      </td>
      <td className="py-3 px-4 text-sm text-gray-800 text-right whitespace-nowrap">
        <span className={getVarianceClass(row.gSales?.lyVarPercent)}>
          {formatNumber(row.gSales?.lyVarPercent, false, true)}
        </span>
      </td>
      {/* fGP */}
      <td className="py-3 px-4 text-sm text-gray-800 text-right whitespace-nowrap">
        {formatNumber(row.fGP?.ytd, true)}
      </td>
      <td className="py-3 px-4 text-sm text-gray-800 text-right whitespace-nowrap">
        {formatNumber(row.fGP?.ly, true)}
      </td>
      <td className="py-3 px-4 text-sm text-gray-800 text-right whitespace-nowrap">
        <span className={getVarianceClass(row.fGP?.lyVar)}>
          {row.fGP?.lyVar !== undefined && row.fGP.lyVar < 0 ? 
            `(${Math.abs(row.fGP.lyVar).toLocaleString()})` : 
            formatNumber(row.fGP?.lyVar, true)
          }
        </span>
      </td>
      <td className="py-3 px-4 text-sm text-gray-800 text-right whitespace-nowrap">
        <span className={getVarianceClass(row.fGP?.lyVarPercent)}>
          {formatNumber(row.fGP?.lyVarPercent, false, true)}
        </span>
      </td>
      {/* fGP % */}
      <td className="py-3 px-4 text-sm text-gray-800 text-right whitespace-nowrap">
        {formatNumber(row.fGPPercent?.ytd, false, true)}
      </td>
      <td className="py-3 px-4 text-sm text-gray-800 text-right whitespace-nowrap">
        {formatNumber(row.fGPPercent?.ly, false, true)}
      </td>
      <td className="py-3 px-4 text-sm text-gray-800 text-right whitespace-nowrap">
        <span className={getVarianceClass(row.fGPPercent?.lyVar)}>
          {formatNumber(row.fGPPercent?.lyVar, false, true)}
        </span>
      </td>
    </tr>
  );
};

const WSUKNIChannelTable: React.FC<WSUKNIChannelTableProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        No WS UK&NI Channel data available for the selected filters.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer / Brand
              </th>
              <th scope="col" colSpan={4} className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-r border-gray-200">
                Cases
              </th>
              <th scope="col" colSpan={4} className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                gSales
              </th>
              <th scope="col" colSpan={4} className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                fGP
              </th>
              <th scope="col" colSpan={3} className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                fGP %
              </th>
            </tr>
            <tr>
              {/* Cases */}
              <th scope="col" className="py-2 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">YTD No.</th>
              <th scope="col" className="py-2 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">LY No.</th>
              <th scope="col" className="py-2 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">LY Var No.</th>
              <th scope="col" className="py-2 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">LY Var %</th>
              {/* gSales */}
              <th scope="col" className="py-2 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">YTD €'000</th>
              <th scope="col" className="py-2 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">LY €'000</th>
              <th scope="col" className="py-2 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">LY Var €'000</th>
              <th scope="col" className="py-2 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">LY Var %</th>
              {/* fGP */}
              <th scope="col" className="py-2 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">YTD €'000</th>
              <th scope="col" className="py-2 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">LY €'000</th>
              <th scope="col" className="py-2 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">LY Var €'000</th>
              <th scope="col" className="py-2 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">LY Var %</th>
              {/* fGP % */}
              <th scope="col" className="py-2 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">YTD %</th>
              <th scope="col" className="py-2 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">LY %</th>
              <th scope="col" className="py-2 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">LY Var %</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map(row => renderRow(row))}
          </tbody>
        </table>
      </div>

      {/* Footnotes */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <div className="space-y-1 text-xs text-gray-600">
          <p>- Food includes Food, Mall, and Chilled business units.</p>
          <p>- Waterwipes are excluded.</p>
          <p>- Samples and sell off of stressed stock are excluded.</p>
        </div>
      </div>
    </div>
  );
};

export default WSUKNIChannelTable;






